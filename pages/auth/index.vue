<!-- @format -->

<template>
	<Auth>
		<auth />
	</Auth>
</template>

<script setup>
	import Auth from '~/layouts/Auth.vue';
	import auth from '~/components/Auth.vue';
	onMounted(() => {
		if (useCookie('x-client-id').value) {
			navigateTo('');
		}
	});
</script>
