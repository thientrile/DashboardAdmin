<!-- @format -->

<template>
	<div
		id="adminLayout"
		class="bg-white-200 min-h-[100vh] w-full flex">
		<leftNavbar />

		<div class="ms-[80px] w-screen overflow-hidden">
			<div class="w-full h-[50px] bg-gray-300 fixed z-50 dark:bg-gray-800 dark:text-white">
				<h2 class="block w-full text-center font-bold py-auto uppercase">
					{{ path[2] ? path[2] : 'Dashboard' }}
				</h2>
			</div>
			<div class="mt-[50px] w-full h-full flex overflow-y-auto bg-white dark:bg-gray-800 dark:text-white">
				<slot />
			</div>
		</div>
	</div>
	<isOverLoading />
</template>

<script setup>
	import leftNavbar from '~/components/LeftNavbar.vue';
	import isOverLoading from '~/components/isOverLoading.vue';
	const path = useRoute().path.split('/');
</script>
