<!-- @format -->

<template>
	<Main>
		<ListResource />
	</Main>
</template>

<script setup>
	import Main from '@/layouts/main.vue';
	import ListResource from '~/components/ListResource.vue';
	definePageMeta({ middleware: 'auth' });

</script>
