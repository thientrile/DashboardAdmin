<!-- @format -->

<template>
  <Main>
    <div
      id="seach"
      class="sticky top-0 flex justify-between text-xs z-50 bg-white dark:bg-black shadow-sm p-3 rounded-2xl"
    >
      <div class="flex items-center">
        <UInput placeholder="Search" icon="ic:baseline-search" class="w-full" />
      </div>
      <div class="flex gap-2 justify-between items-center">
        <UTooltip text="Refresh permissions">
          <UButton
            icon="material-symbols:refresh"
            :loading="is.loading"
            @click="refresh"
            color="primary"
            variant="subtle"
          />
        </UTooltip>
        <div v-show="general.actions.create">
          <UTooltip text="Create new permission">
            <UButton
              @click="openModelResource"
              icon="material-symbols:add"
              color="primary"
              variant="subtle"
            >
              <UKbd>N</UKbd>
            </UButton>
          </UTooltip>
          <UModal v-model:open="modelResource.model">
            <template #header>
              <UInput
                v-model="modelResource.search"
                @change="onChangeSearchModel"
                icon="i-lucide-search"
                placeholder="Search..."
              />
            </template>
            <template #body>
              <UTable
                ref="table"
                :data="modelResource.resources"
                :columns="modelResource.collums"
                class="flex-1 max-h-[312px]"
              />
            </template>
            <template #footer>
              <div class="w-full flex justify-between">
                <div>
                  <span
                    >{{
                      table?.tableApi?.getFilteredSelectedRowModel().rows
                        .length || 0
                    }}
                    of</span
                  >
                  <span>
                    {{
                      table?.tableApi?.getFilteredRowModel().rows.length || 0
                    }}
                    row(s) selected.
                  </span>
                </div>

                <div>
                  <UTooltip text="Open on GitHub">
                    <UButton
                      label="Add"
                      @click="BtnModelAdd"
                      variant="subtle"
                    />
                  </UTooltip>
                </div>
              </div>
            </template>
          </UModal>
        </div>

        <div v-show="is.change&&general.actions.update">
          <UTooltip text="Save permissions">
            <UButton
              icon="material-symbols:save-outline"
              @click="is.save = true"
              color="primary"
              variant="subtle"
            >
              <UKbd>S</UKbd></UButton
            >
          </UTooltip>
        </div>
      </div>
    </div>
    <div
      class="mt-2 flex justify-around bg-white dark:bg-black shadow-2xl p-5 rounded-2xl"
    >
      <TableGrants
        v-if="role.grants"
        :roleId="role._id"
        :grants="role.grants"
        v-model:is="is"
      />
    </div>
  </Main>
</template>

<script setup>
import Main from "~/layouts/main.vue";
import { useGeneralStore } from "~/store/general";
import { useAdminStore } from "~/store/admin";
import TableGrants from "~/components/role/TableGrants.vue";
const admin = useAdminStore();
const general = useGeneralStore();
const route = useRoute();
const router = useRouter();

const newGrants = ref([]);
const role = ref({});
const is = ref({
  loading: false,
  change: false,
  save: false,
});

definePageMeta({ middleware: "auth" });
const refresh = async () => {
  is.value.loading = true;
  await admin.getAllListRoles();
  is.value.loading = false;

  getGrants();
};
onMounted(async () => {
  if (admin.roles.length === 0) {
    is.value.loading = true;
    await admin.getAllListRoles();
    is.value.loading = false;
  }

  getGrants();
});

const getGrants = () => {
  const roleId = route.params.id;
  if (!roleId) return router.back();

  role.value = admin.roles.find((item) => item.name === roleId);
  if (!role.value) return router.back();

  // Lọc bỏ grants không hợp lệ
  role.value.grants = role.value.grants.filter((grant) => grant.name);

  role.value.grants = role.value.grants.map((grant) => ({
    ...grant,
    attributes:
      typeof grant.attributes === "string"
        ? grant.attributes.split(",")
        : grant.attributes,
    isloading: false,
    suggest_not: grant.suggest.map((item) => `!${item}`).concat("*"),
    suggest: [...grant.suggest, "*"],
    isAdd: false,
    attrNewValue: "",
    permissions: ["read", "create", "update", "delete"].reduce(
      (acc, action) => {
        acc[action] = { checked: false, value: "own" };
        return acc;
      },
      {}
    ),
  }));

  // Cập nhật quyền (permissions)
  role.value.grants.forEach((grant) => {
    grant.actions.forEach((action) => {
      const [actionType, scope] = action.split(":");
      if (grant.permissions[actionType]) {
        grant.permissions[actionType].value = scope;
        grant.permissions[actionType].checked = true;
      }
    });
  });

  return role.value.grants;
};

// handdle model add perrmistion
import { h, resolveComponent } from "vue";
const UCheckbox = resolveComponent("UCheckbox");
const modelResource = ref({
  model: false,
  search: ref(""),
  loading: false,
  resources: [],
  collums: [
    {
      id: "select",
      header: ({ table }) =>
        h(UCheckbox, {
          modelValue: table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : table.getIsAllPageRowsSelected(),
          label: "Select all",
          "onUpdate:modelValue": (value) =>
            table.toggleAllPageRowsSelected(!!value),
        }),
      cell: ({ row }) =>
        h(UCheckbox, {
          modelValue: row.getIsSelected(),
          "onUpdate:modelValue": (value) => {
            if (!!value && !newGrants.value.includes(row.original._id)) {
              newGrants.value.push(row.original._id);
            } else {
              const idx = newGrants.value.indexOf(row.original._id);
              if (idx > -1) {
                newGrants.value.splice(idx, 1);
              }
            }
            return row.toggleSelected(!!value);
          },
          ariaLabel: "Select row",
          label: row.original.name,
          value: row.original._id,
          id: row.original._id,
          name: row.original.name,
        }),
    },
  ],
});
const table = useTemplateRef("table");
const openModelResource = async () => {
  if (!general.actions.create) return;
  newGrants.value = [];
  if (admin.resources.length === 0) {
    await admin.getSrc({
      limit: 10,
      page: 1,
      search: "",
    });
  }

  modelResource.value.resources = admin.resources;
  modelResource.value.model = true;
};
defineShortcuts({
  n: async () => await openModelResource(),
});
const onChangeSearchModel = async () => {
  await admin.getSrc({
    limit: 10,
    page: 1,
    search: modelResource.value.search,
  });
  modelResource.value.resources = admin.resources;
};
const BtnModelAdd = async () => {
  modelResource.loading = true;
  const body = {
    roleId: role.value._id,
    grants: [],
  };
  newGrants.value.forEach((i) => {
    body.grants.push({
      resourceId: i,
    });
  });

  await admin.addGrantToRole(body);
  modelResource.value.loading = false;
  modelResource.value.model = false;
  await general.getMenu();
  getGrants();
};
</script>
