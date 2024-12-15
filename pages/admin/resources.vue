<!-- @format -->

<template>
	<Admin>
		<div class="flex flex-col w-full min-w-md">
			<div class="container-xl">
				<FormAddResource />
			</div>
			<LIstResource isActions="true" />
		</div>
	</Admin>
</template>

<script setup>
	import LIstResource from '~/components/LIstResource.vue';
	import FormAddResource from '~/components/formAddResource.vue';
	import Admin from '~/layouts/Admin.vue';

	onMounted(() => {
		definePageMeta({ middleware: 'auth' })
	});
</script>
