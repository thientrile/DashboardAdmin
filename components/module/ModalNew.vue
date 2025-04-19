<script setup>
import { useAdminStore } from "~/store/admin";

const open = ref(false);
const state = reactive({
  name: "",
  description: "",
  df_roleId: "",
  isMgroup: false,
});
const validate = () => {
  const errors = [];

  if (!state.name) errors.push({ name: "name", message: "Name cannot blank" });
  if (!state.df_roleId)
    errors.push({ name: "df_roleId", message: "Please select default role" });
  return errors;
};

const admin = useAdminStore();
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
const onSumit = async () => {
  await admin.createModule(state);
  open.value = false;
  onClear();
};
const onClear = () => {
  state.name = "";
  state.description = "";
  state.df_roleId = "";
  state.isMgroup = false;
};
defineShortcuts({
  n: () => (open.value = !open.value),
});
</script>

<template>
  <UModal v-model:open="open">
    <UTooltip text="Create new module" placement="top">

      <UButton icon="mdi:plus"  color="neutral" variant="subtle" />
    </UTooltip>
    <template #title>
      <h3>
        <span class="text-lg font-bold">New Module</span>
      </h3>
    </template>
    <template #body>
      <UForm
        :validate="validate"
        :state="state"
        class="w-full"
        @submit="onSumit"
      >
        <UFormField label="Name" name="name">
          <UInput
            v-model="state.name"
            class="w-full"
            placeholder="Enter name..."
          />
        </UFormField>
        <UFormField label="Role" name="df_roleId">
          <USelect
            :items="selectRole"
            v-model="state.df_roleId"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Description" name="description">
          <UTextarea
            v-model="state.description"
            class="w-full"
            placeholder="Enter description ..."
          />
        </UFormField>
        <UFormField name="isMgroup">
          <USwitch
            v-model="state.isMgroup"
            label="Allows creation of multiple groups"
          />
        </UFormField>
        <UButton type="submit" variant="outline" class="mt-2">
          Create Module
        </UButton>
        <UButton
          type="button"
          color="error"
          variant="outline"
          class="m-2"
          @click="onClear"
        >
          Clear
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
