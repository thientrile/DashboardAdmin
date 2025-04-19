<template>
  <Main>
    <div
   
      class="sticky top-0 flex justify-between text-xs z-50 bg-white dark:bg-black shadow-sm p-3 rounded-2xl"
    >
fssf

</div>
  </Main>
</template>

<script setup>
import Main from "@/layouts/main.vue";
const route = useRoute();
console.log(route.params.id);
definePageMeta({ middleware: "auth" });
</script>
