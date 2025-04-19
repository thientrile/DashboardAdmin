<!-- @format -->

<template>
  <div
    class="w-48 p-2 mt-4 bg-white dark:bg-black shadow-2xl rounded-2xl orverflow-hidden"
  >
    <div class="">
      <ULink class="ms-2 flex gap-6" to="/">
        <img src="/favicon.ico" alt="" />
        <span class="font-bold text-2xl">SCMS </span>
      </ULink>
    </div>
    <UNavigationMenu orientation="vertical" :items="items" />
  </div>
</template>
<script setup>
import { useGeneralStore } from "~/store/general";
const general = useGeneralStore();
const items = ref([general.menuArrs]);

onMounted(async () => {
  if (general.menuArrs.length === 0) {
    await general.getMenu();
  }
});

watch(
  () => general.menuArrs,
  () => {
    items.value = general.menuArrs;
	
  }
);

</script>
