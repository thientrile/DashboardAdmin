<!-- @format -->

<template>
	<UModal
		title="Search iconify"
		:close="{
			color: 'primary',
			variant: 'outline',
			class: 'rounded-full'
		}">
		<UButton
			icon="material-symbols:edit-outline-sharp"
			color="neutral"
			variant="subtle" />

		<template #body>
			<div class="flex flex-col justify-center w-full">
				<UInput
					:loading="loading"
					color="neutral"
					v-model="searchTerm"
					@keyup.enter="handleSearch"
					list="search"
					placeholder="Search..." />
				<datalist id="search">
					<option>
						{{ search }}
					</option>
				</datalist>
			</div>
			<div class="max-h-[250px] overflow-y-auto">
				<span
					v-for="item in items"
					@click="emit('update:icon', item)"
					class="m-1 p-1 hover:bg-gray-400">
					<UIcon :name="item" />
				</span>
			</div>
		</template>
	</UModal>
</template>

<script setup>
	const props = defineProps(['search']);
	const { search } = toRefs(props);
	const searchTerm = ref();
	const loading = ref(false);
	const items = ref([]);
	const emit = defineEmits(['update:icon']);
	const handleSearch = async () => {
		loading.value = true;
		const response = await $fetch(
			`https://api.iconify.design/search?query=${searchTerm.value}&limit=999`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
		loading.value = false;
		items.value = response.icons;
	};
</script>
