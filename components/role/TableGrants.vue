<!-- @format -->

<script setup>
import { useAdminStore } from "~/store/admin";
import { useGeneralStore } from "~/store/general";
const props = defineProps(["grants", "roleId", "is"]);
const { grants, roleId, is } = toRefs(props);
const admin = useAdminStore();
const general = useGeneralStore();
const isSuggest = ref(false);

const isAny = ref([
  {
    label: "Any",
    value: "any",
  },
  {
    label: "Own",
    value: "own",
  },
]);
const emit = defineEmits(["update:is"]);

const addItemAtt = async (idx) => {
  if (grants.value[idx].attrNewValue === "") {
    grants.value[idx].attrNewValue = "";
    grants.value[idx].isAdd = false;
    return;
  }
  // await admin.updateSrc({

  // })
  const body = {
    resourceId: grants.value[idx].resourceId,
    attr: grants.value[idx].attrNewValue,
  };
  await admin.addAttr(body);
  is.value.change = true
  const newvalue =
    grants.value[idx].attributes.includes("*") &&
    !grants.value[idx].attrNewValue.includes("!")
      ? `!${grants.value[idx].attrNewValue}`
      : grants.value[idx].attrNewValue;
  if (!grants.value[idx].attributes.includes(newvalue)) {
    grants.value[idx].attributes.push(newvalue);
  }
  if (
    grants.value[idx].attributes.includes("*") &&
    !grants.value[idx].suggest_not.includes(newvalue)
  ) {
    grants.value[idx].suggest_not.push(newvalue);
  } else if (!grants.value[idx].suggest.includes(newvalue)) {
    grants.value[idx].suggest.push(newvalue);
  }
  grants.value[idx].attrNewValue = "";
  grants.value[idx].isAdd = false;
};
const deleteGrants = async (id, idx) => {
  const body = {
    roleId: roleId.value,
    grantId: id,
  };
  is.value.change = false;
  grants.value[idx].isloading = true;
  await Promise.all([
    await admin.deleteGrantToRole(body),
    await general.getMenu(),
  ]);

  grants.value.splice(idx, 1);
  grants.value[idx].isloading = false;
};
const removeAttr = (idx) => {
  is.value.change = true;

  const attrs = grants.value[idx].attributes;
  const suggest = grants.value[idx].suggest;
  const suggestNot = grants.value[idx].suggest_not;

  if (attrs.includes("*")) {
    grants.value[idx].attributes = attrs.filter(
      (attr) => attr === "*" || !suggest.includes(attr)
    );
  } else {
    grants.value[idx].attributes = attrs.filter(
      (attr) => !suggestNot.includes(attr)
    );
  }
};
watch(
  () => is.value.save,
  async () => {
    if (is.value.save) {
      await Save();
      is.value.save = false;
    }
  }
);
const Save = async () => {
  const body = {
    roleId: roleId.value,
    grants: [],
  };
  is.value.loading = true;
  grants.value.forEach((item) => {
    const actions = [];
    for (let i in item.permissions) {
      if (item.permissions[i].checked) {
        actions.push(`${i}:${item.permissions[i].value || "own"}`);
      }
    }
    if (item.attributes.length === 0) {
      item.attributes.push("*");
    }
    let obj = {
      _id: item._id,
      resourceId: item.resourceId,
      attributes: item.attributes.join(","),
      isRoot: item.isRoot,
      actions,
    };
    body.grants.push(obj);
  });
  //await

  await Promise.all([
    await admin.setGrantToRole(body),
    await general.getMenu(),
  ]);
  is.value.change = false;
  is.value.loading = false;
};
watch(
  () => isSuggest.value,
  () => {
    console.log(isSuggest.value);
  }
);
defineShortcuts({
  s: async () => {
    if (is.value.change && general.actions.update) {
      await Save();
      useToast().add({
        title: "Save Success ",
        description: "Update permissions successfully",
        duration: 2000,
      });
    }
  },
});
</script>

<template>
  <table id="ListGrants" class="border-collapse border border-slate-400 w-full">
    <thead>
      <tr>
        <th class="border border-slate-300 text-center" rowspan="2">STT</th>
        <th class="border border-slate-300 text-center" rowspan="2">Name</th>
        <th class="border border-slate-300 text-center" colspan="4">
          Permissions
        </th>
        <th class="border border-slate-300 text-center" rowspan="2">
          Attribute
        </th>
        <th class="border border-slate-300 text-center" rowspan="2">Actions</th>
      </tr>
      <tr>
        <td class="border border-slate-300 text-center font-bold">Read</td>
        <td class="border border-slate-300 text-center font-bold">Create</td>
        <td class="border border-slate-300 text-center font-bold">Update</td>
        <td class="border border-slate-300 text-center font-bold">Delete</td>
      </tr>
    </thead>
    <tbody>
      <tr v-if="grants" :id="`grant-${idx}`" v-for="(item, idx) in grants">
        <td class="border border-slate-300 w-20 text-center">{{ idx }}</td>
        <td class="border border-slate-300">{{ item.name }}</td>
        <td class="border border-slate-300 ...">
          <div class="flex items-center gap-2 px-2">
            <USwitch
              @change="is.change = true"
              v-model="item.permissions.read.checked"
              :disabled="item.isRoot || !general.actions.update"
            />
            <URadioGroup
              @change="is.change = true"
              :disabled="item.isRoot || !general.actions.update"
              v-if="item.permissions.read.checked"
              v-model="item.permissions.read.value"
              :items="isAny"
            />
          </div>
        </td>
        <td class="border border-slate-300 ...">
          <div class="flex items-center gap-2 px-2">
            <USwitch
              @change="is.change = true"
              v-model="item.permissions.create.checked"
              :disabled="item.isRoot || !general.actions.update"
            />
            <URadioGroup
              @change="is.change = true"
              :disabled="item.isRoot || !general.actions.update"
              v-if="item.permissions.create.checked"
              v-model="item.permissions.create.value"
              :items="isAny"
            />
          </div>
        </td>
        <td class="border border-slate-300 ...">
          <div class="flex items-center gap-2 px-2">
            <USwitch
              @change="is.change = true"
              v-model="item.permissions.update.checked"
              :disabled="item.isRoot || !general.actions.update"
            />
            <URadioGroup
              @change="is.change = true"
              :disabled="item.isRoot || !general.actions.update"
              v-show="item.permissions.update.checked"
              v-model="item.permissions.update.value"
              :items="isAny"
            />
          </div>
        </td>
        <td class="border border-slate-300 ...">
          <div class="flex items-center gap-2 px-2">
            <USwitch
              @change="is.change = true"
              v-model="item.permissions.delete.checked"
              :disabled="item.isRoot || !general.actions.update"
            />
            <URadioGroup
              @change="is.change = true"
              :disabled="item.isRoot || !general.actions.update"
              v-show="item.permissions.delete.checked"
              v-model="item.permissions.delete.value"
              :items="isAny"
            />
          </div>
        </td>
        <td class="border border-slate-300 w-30">
          <div class="flex justify-between w-40">
            <div
              v-if="!item.isAdd"
              class="w-full overflow-hidden text-ellipsis whitespace-normal"
            >
              <!-- select -->
              <USelect
                :disabled="!general.actions.update"
                v-if="!item.attributes.includes('*')"
                v-model="item.attributes"
                @change="removeAttr(idx)"
                multiple
                :items="item.suggest"
                class="w-full"
              />
              <!-- not select -->
              <USelect
                :disabled="!general.actions.update"
                v-if="item.attributes.includes('*')"
                v-model="item.attributes"
                @change="removeAttr(idx)"
                multiple
                :items="item.suggest_not"
                class="w-full"
              />
            </div>

            <UInput
              :disabled="!general.actions.update"
              placeholder="Enter attribute"
              v-model="item.attrNewValue"
              v-else
              class="w-full"
            />
            <UTooltip text="New attribute" v-if="!item.isAdd">
              <UButton
                :disabled="!general.actions.update"
                @click="item.isAdd = !item.isAdd"
                variant="outline"
                icon="material-symbols:add"
              />
            </UTooltip>
            <UTooltip text="Add attribute" v-else>
              <UButton
                @click="addItemAtt(idx)"
                variant="outline"
                icon="material-symbols:add"
              />
            </UTooltip>
          </div>
        </td>
        <td class="border border-slate-300 ...">
          <div class="flex">
            <div v-show="!item.isRoot && general.actions.delete">
              <UTooltip text="Delete Grant">
                <UButton
                  :loading="item.isloading"
                  @click="deleteGrants(item._id, idx)"
                  icon="tabler:trash"
                  color="error"
                  variant="outline"
                />
              </UTooltip>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>
