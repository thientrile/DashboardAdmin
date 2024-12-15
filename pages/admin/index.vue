<!-- @format -->

<template>
	<Admin>
		<div class="flex">
			home
		</div>
	</Admin>
</template>

<script setup>
	import Admin from '~/layouts/Admin.vue';
	onMounted(() => {
		definePageMeta({ middleware: 'auth' })
	});
</script>
