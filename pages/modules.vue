<template>
	<Main> modules </Main>
</template>

<script setup>
	import Main from '@/layouts/main.vue';
	
	definePageMeta({ middleware: 'auth' });

</script>
