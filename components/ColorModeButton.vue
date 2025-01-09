<!-- @format -->

<script setup>
	const items = ref([
		{
			// label: 'System',
			value: 'system',
			icon: 'hugeicons:system-update-02'
		},
		{
			// label: 'Light',
			value: 'light',
			icon: 'entypo:light-up'
		},
		{
			// label: 'Dark',
			value: 'dark',
			icon: 'entypo:moon'
		},
		{
			// label: 'Sepia',
			value: 'sepia',
			icon: 'entypo:feather'
		}
	]);
</script>

<template>
	<USelect
		class="w-10"
		v-model="$colorMode.preference"
		:items="items"
		:icon="items.find((item) => item.value === $colorMode.preference).icon" />
</template>
