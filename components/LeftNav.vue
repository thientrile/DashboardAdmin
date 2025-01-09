<!-- @format -->

<template>
	<div
		class="p-2 mt-4 bg-white dark:bg-black shadow-2xl rounded-2xl orverflow-hidden">
		<div class="">
			<ULink
				class="ms-2 flex gap-6"
				to="/">
				<img
					src="/favicon.ico"
					alt="" />
				<span class="font-bold text-2xl">SCMS </span>
			</ULink>
		</div>
		<div v-show="more">
			<UNavigationMenu
				trailing-icon="i-lucide-arrow-down"
				orientation="vertical"
				:items="items"
				class="data-[orientation=vertical]:w-48" />
		</div>
	</div>
</template>
<script setup>
	import { useGeneralStore } from '~/store/general';
	const more = ref(true);
	const general = useGeneralStore();
	const items = ref([general.menuArrs]);

	watch(
		() => general.menuArrs,
		() => {
			items.value = general.menuArrs;
		}
	);
</script>
