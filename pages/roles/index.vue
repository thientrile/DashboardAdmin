<!-- @format -->

<template>
	<Main>
		<ListRole />
	</Main>
</template>

<script setup>
	import Main from '@/layouts/main.vue';
	import ListRole from '~/components/role/ListRole.vue';

	definePageMeta({ middleware: 'auth' });
</script>
