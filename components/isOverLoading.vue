<!-- @format -->

<template>
	<div
		v-show="general.IsOverLoading"
		id="isOverLoading"
		class="fixed top-0 h-screen w-screen flex justify-center backdrop-blur-xs items-center z-50 bg-white/30">
		<div class="flex flex-col justify-center">
			<Icon
				name="eos-icons:loading"
				class="text-6xl font-bold text-sky-400" />
			<span class="text-2xl"
				>Loading <Icon name="svg-spinners:3-dots-scale"
			/></span>
		</div>
	</div>
</template>

<script setup>
	import { useGeneralStore } from '~/store/general';
	const general = useGeneralStore();
</script>
