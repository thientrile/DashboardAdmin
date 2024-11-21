<!-- @format -->

<template>
	<NuxtPage />
	<NuxtLayout />
	
</template>
<script setup>
	import { useUserStore } from '~/store/user.js';
	const user = useUserStore();

	user.loadFromCookies();
</script>
