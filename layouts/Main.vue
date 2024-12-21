<!-- @format -->

<template>
	<div class="min-h-full bg-white dark:bg-gray-800 dark:text-white">
		<TopNavbar />
		<header class="shadow sticky top-0 z-50">
			<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
				<h5 class="text-md font-bold tracking-tight">
					{{
						!useRoute().path.split('/')[1]
							? 'Dashboard'
							: useRoute().path.split('/')[1].toUpperCase()
					}}
				</h5>
			</div>
		</header>
		<main>
			<div class="mx-auto max-w-7xl h-full px-4 py-6 sm:px-6 lg:px-8">
				<slot />
			</div>
		</main>
	</div>
</template>
<script setup>
	import TopNavbar from '~/components/TopNavbar.vue';
</script>
