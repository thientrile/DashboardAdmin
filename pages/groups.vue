<template>
	<Main> groups </Main>
</template>

<script setup>
	import Main from '@/layouts/main.vue';
	definePageMeta({ middleware: 'auth',
		
	 });

	const router=useRoute();
	console.log('auth page',router.fullPath);
</script>
