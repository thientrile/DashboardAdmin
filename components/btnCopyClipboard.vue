<template>
  <div class="inline relative">
    <UBadge
      class="absolute top-0 left-0 z-10"
      v-show="status"
      size="md"
      variant="outline"
      color="neutral"
      >copied</UBadge
    >
    <UButton
      icon="material-symbols:content-copy-outline-sharp"
      size="md"
      color="neutral"
      variant="outline"
      @click="copy"
    />
  </div>
</template>
<script setup>
const props = defineProps(["text"]);
const { text } = toRefs(props);
const status = ref(false);
const copy = async () => {
  await navigator.clipboard.writeText(text.value);
  status.value = true;
  setTimeout(() => {
    status.value = false;
  }, 1000);
};
</script>
