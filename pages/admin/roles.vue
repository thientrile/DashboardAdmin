<!-- @format -->

<template>
	<Admin>

		<ListRoles />
		<EditPermission />
	</Admin>
</template>

<script setup>
	import EditPermission from '~/components/EditPermission.vue';
	import ListRoles from '~/components/ListRoles.vue';
	import Admin from '~/layouts/Admin.vue';

	onMounted(() => {
		definePageMeta({ middleware: 'auth' });
	});
</script>
