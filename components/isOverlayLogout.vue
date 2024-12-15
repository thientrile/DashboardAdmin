<!-- @format -->

<template>
	<div
		v-show="user.isOverLogout"
		id="isOverLoading"
		class="fixed top-0 h-screen w-screen flex justify-center backdrop-blur-sm items-center z-50 bg-white/30">
		<div class="flex flex-col justify-between">
			<div
				class="w-[500px] min-h-[200px]  shadow-xl py-1.5 rounded-md flex flex-col justify-between px-1.5">
				<div class="flex justify-center">
					<Icon
						name="clarity:error-solid"
						class="text-sky-500 text-4xl" />
				</div>
				<div>
					<h1 class="text-3xl text-center">Login time expired</h1>
					
				</div>
				<div class="flex justify-center sticky float-end">
					<button
						@click="buttonHandler"
						type="button"
						class="bg-red-500 py-1.5 w-[5em] ring-2 rounded-sm text-white font-bold">
						OK
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { useUserStore } from '~/store/user';
	const user = useUserStore();
	const seconds = ref(3);
	const buttonHandler = () => {
		user.isOverLogout = false;
		user.logout();
	};
</script>
