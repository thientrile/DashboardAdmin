<!-- @format -->

<template>
	<div
		class="text-md flex w-[100vw] bg-gray-200 dark:bg-gray-800 h-[100vh] justify-center items-center">
		<div
			class="py-4 min-w-[500px] bg-white dark:bg-black flex-col rounded-md shadow-lg">
			<div class="flex justify-center">
				<img
					class="w-12 h-12"
					src="/favicon.ico"
					alt="" />
			</div>
			<div class="w-full text-xl font-bold flex justify-center py-1.5">
				<span v-if="isRegister">Register</span>
				<span v-else>Login</span>
			</div>
			<div class="container px-2">
				<Register v-if="isRegister" />
				<Login v-else />
			</div>
			<div class="p-2 w-full m-2">
				<UButton
					variant="outline"
					type="button"
					class="min-w-[25%] flex justify-center mx-auto"
					@click="isRegister = !isRegister">
					<span v-if="isRegister">I already have an account</span>
					<span v-else>I have not registered an account yet.</span>
				</UButton>
				<USeparator label="or" />
				<UButtonGroup class="flex justify-center gap-2 mt-2">
					<UButton
						color="neutral"
						variant="outline">
						<UIcon
							size="20"
							name="devicon:google" />
					</UButton>
					<UButton
						color="neutral"
						variant="outline">
						<UIcon
							size="20"
							name="line-md:facebook" />
					</UButton>
				</UButtonGroup>
			</div>
		</div>
	</div>
</template>

<script setup>

	useHead({
		title: 'Auth'
	});

	import { useUserStore } from '~/store/user';
	const user = useUserStore();

	watch(
		() => user.isAuthenticated,
		() => {
			if (user.isAuthenticated || !!useCookie('x-client-id').value) {
				// redirect to home page
				useRouter().push('/');
			}
		}
	);

	import Login from '~/components/Login.vue';
	import Register from '~/components/Register.vue';

	const isRegister = ref(false);
</script>
