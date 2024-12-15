<!-- @format -->

<template>
	<Auth>
		<div class="">
			<auth />
		</div>
		<div></div>
	</Auth>
</template>

<script setup>
	import Auth from '~/layouts/Auth.vue';
	import auth from '~/components/Auth.vue';
	import { useUserStore } from '~/store/user.js';
	const user = useUserStore();

	onMounted(() => {
		if (useCookie('x-client-id').value) {
			navigateTo('');
		}
	});
</script>
