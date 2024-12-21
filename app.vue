<!-- @format -->

<template>
	<div>
		<NuxtLoadingIndicator />
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
		<isOverlayPermission />
		<isOverlayLogout />
	</div>
</template>
<script setup>
	import { useUserStore } from '~/store/user.js';
	const user = useUserStore();
	import isOverlayLogout from './components/isOverlayLogout.vue';
	import isOverlayPermission from './components/isOverlayPermission.vue';
	onMounted(async () => {
		try {
			if (useCookie('x-client-id').value) {
				await user.verify();
			}
		} catch (error) {
			await user.logout();
		}
	});
</script>
