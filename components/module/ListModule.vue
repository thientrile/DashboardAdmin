<!-- @format -->

<template>
  <table class="border-collapse border border-gray-400 w-full">
    <thead>
      <tr class="text-center">
        <th scope="col" class="border border-gray-300 w-1" rowspan="2">Id</th>
        <th scope="col" class="border border-gray-300 p-1" colspan="2">Name</th>

        <th scope="col" class="border border-gray-300 w-1" rowspan="2">
          Decription
        </th>

        <th
          scope="col"
          v-show="general.actions.update || general.actions.delete"
          class="border border-gray-300"
          colspan="3"
        >
          Actions
        </th>
      </tr>
      <tr>
        <th scope="col" class="border border-gray-300 p-1 w-0">Module</th>
        <th scope="col" class="border border-gray-300 p-1 w-0">Roles</th>
        <th scope="col" class="border border-gray-300 w-0">Status</th>
        <th
          scope="col"
          v-show="general.actions.update"
          class="border border-gray-300 w-0"
        >
          Save
        </th>
        <th
          scope="col"
          v-show="general.actions.delete"
          class="border border-gray-300 w-0"
        >
          Delete
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, idx) in admin.modules">
        <td class="border border-gray-300 p-2">
          <btnCopyClipboard class="text-right" :text="item.id" />
          <span class="inline-block truncate ms-2">
            {{ item.id }}
          </span>
        </td>
        <td class="border border-gray-300 h-full">
          <UInput v-if="item.edit" class="h-full" v-model="item.name" />
          <ULink v-else :to="`/modules/${item.id}`"> {{ item.name }}</ULink>
        </td>
        <td class="border border-gray-300">
          <USelect
            :id="`role-${item._id}`"
            class="w-full"
            :disabled="!item.edit || item.isRoot"
            v-model="item.df_roleId"
            :items="selectRole"
          />
        </td>

        <td class="border border-gray-300 p-1">
          <span v-if="item.edit">
            <UTextarea class="w-full" :rows="1" v-model="item.description" />
          </span>
          <span v-else>
            {{ item.description }}
          </span>
        </td>
        <td class="border border-gray-300 p-1 w-[1.5rem]">
          <USwitch
            @change="handelUpdateStautus(idx)"
            :disabled="item.isRoot || !general.actions.update"
            v-model="item.isActive"
            :loading="item.isloading"
          >
            <template #label>
              <UBadge
                v-if="item.isActive"
                variant="outline"
                label="Activated"
              />
              <UBadge
                v-else
                color="error"
                variant="outline"
                label="Deactivated"
              />
            </template>
          </USwitch>
        </td>
        <td
          v-show="general.actions.update"
          class="border border-gray-300 p-1 text-center"
        >
          <UTooltip :text="item.edit ? 'Save' : 'Edit'">
            <UButton
              v-if="!item.edit"
              icon="material-symbols:ink-pen-outline-sharp"
              variant="outline"
              @click="item.edit = !item.edit"
            />
            <UButton
              v-else
              icon="material-symbols:save"
              color="success"
              variant="outline"
              :loading="item.isloading"
              @click="handelUpdate(idx)"
            />
          </UTooltip>
        </td>
        <td v-show="general.actions.delete" class="border border-gray-300 p-1">
          <UTooltip :text="!item.isRoot ? 'Delete' : 'Can not delete root'">
            <UButton
              :disabled="item.isRoot"
              icon="material-symbols:delete-rounded"
              color="error"
              variant="outline"
              :loading="item.isloading"
              @click="handelDel(idx)"
            />
          </UTooltip>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useAdminStore } from "~/store/admin";
import { useGeneralStore } from "~/store/general";
const general = useGeneralStore();
const admin = useAdminStore();
import btnCopyClipboard from "~/components/btnCopyClipboard.vue";

const selectRole = ref([]);
watch(
  () => admin.roles,
  () => {
    selectRole.value = admin.roles.map((item) => {
      return {
        value: item._id,
        label: item.name,
      };
    });
  }
);
const handelDel = async (idx) => {
  const id = admin.modules[idx].id;
  const body = {
    ids: [id],
  };
  admin.modules[idx].isloading = true;
  await admin.DeleteModule(body);
  admin.modules[idx].isloading = false;
  admin.modules.splice(idx, 1);
};
const handelUpdateStautus = async (idx) => {
  const isActive = admin.modules[idx].isActive;
  admin.modules[idx].isloading = true;
  const body = {
    ids: [admin.modules[idx].id],
  };

  if (isActive) {
    await admin.ActiveModule(body);
  } else {
    await admin.DeactiveModule(body);
  }
  admin.modules[idx].isloading = false;
};
const handelUpdate = async (idx) => {
  const {name, description, df_roleId,id} = admin.modules[idx]
 const body={
    id: id,
    name: name,
    description: description,
    df_roleId: df_roleId,
  };
  if (!body.name) {
    admin.modules[idx].edit = false;
    return;
  }
  if (!body.df_roleId) {
    admin.modules[idx].edit = false;
    return;
 }

  admin.modules[idx].isloading = true;
  await admin.UpdateModule(body);
  admin.modules[idx].isloading = false;
  admin.modules[idx].edit = false;
};
</script>
