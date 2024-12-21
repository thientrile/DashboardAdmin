<!-- @format -->

<template>
	<Admin>
		<div class="flex flex-col w-full min-w-md">
			<div class="container-xl"></div>
		</div>
	</Admin>
</template>

<script setup>
	import Admin from '~/layouts/Admin.vue';

	onMounted(() => {
		definePageMeta({ middleware: 'auth' });
	});
</script>
