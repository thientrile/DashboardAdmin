<!-- @format -->

<template>
	<form
		id="loginForm"
		action="/auth"
		method="post"
		class="flex flex-col px-5"
		@submit="handleFormSubmit">
		<div class="w-full">
			<label for="username">
				<span class="font-bold"> Username </span>
				<span class="text-red-500">*</span>
			</label>
			<input
				tabindex="0"
				type="text"
				id="username"
				autocomplete="username"
				name="username"
				placeholder="Enter your username or phone number or email"
				v-model="username"
				required
				@input="isvalidUsername"
				class="px-1.5 block w-full rounded-md border-2 focus:border-amber-100 border-gray-200 py-1.5 focus-visible:border-sky-300" />
			<span
				v-show="isShowUsnError"
				class="text-red-500 text-sm"
				>Username must be at least 4 characters long</span
			>
		</div>
		<UAlert
			v-show="isLoginError"
			color="error"
			variant="outline"
			description="Incorrect email or password"
			icon="material-symbols-light:error-outline" />
		<div class="w-full">
			<label for="password">
				<span class="font-bold"> Password </span>
				<span class="text-red-500">*</span>
			</label>

			<input
				tabindex="0"
				:type="isShowpawd ? 'text' : 'password'"
				id="password"
				:autocomplete="isShowpawd ? '' : 'current-password'"
				name="password"
				placeholder="Enter your password"
				v-model="password"
				required
				min="8"
				@input="isvalidPassword"
				class="px-1.5 block w-full rounded-md border-2 focus:border-amber-100 border-gray-200 py-1.5 focus-visible:border-sky-300"
				:class="isShowPawdError ? 'border-red-500' : ''" />
			<div>
				<UCheckbox
					v-model="isShowpawd"
					label="Show password" />
			</div>

			<span
				class="text-red-500 text-sm"
				v-show="isShowPawdError">
				{{ pawdError }}
			</span>
		</div>

		<div class="flex flex-col items-center mt-2">
			<div class="w-full h-[0.1px] bg-gray-600"/>
			<UButton
				tabindex="0"
				:disabled="isShowPawdError || isShowUsnError"
				type="submit"
				class="w-full flex justify-center mx-1.5 bg-blue-500 rounded-md py-2 px-4 mt-4"
				:color="isShowPawdError || isShowUsnError ? 'secondary' : 'neutral'"
				:loading="isLoading"
				@click="
					isvalidPassword();
					isvalidUsername();
				">
				<span class="font-bold">Login</span>
			</UButton>
		</div>
	</form>
</template>

<script setup>
	const isLoading = ref(false);
	import { useUserStore } from '~/store/user';
	const user = useUserStore();
	const username = ref('');
	const isLoginError = ref(false);
	const password = ref('');
	const isShowUsnError = ref(false);
	const pawdError = ref('');
	const isShowPawdError = ref(false);
	const isShowpawd = ref(false);

	const isvalidPassword = () => {
		isLoginError.value = false;
		isShowPawdError.value = false;
		pawdError.value = '';
		const lower = /(?=.*[a-z])/;
		const upper = /(?=.*[A-Z])/;
		const number = /(?=.*\d)/;
		const special = /(?=.*[!@#$%^&*])/;
		const length = /(?=.{8,})/;
		if (!length.test(password.value)) {
			isShowPawdError.value = true;
			pawdError.value = 'Password must be at least 8 characters';
		}
		if (!lower.test(password.value)) {
			isShowPawdError.value = true;
			pawdError.value = 'Password must contain at least one lowercase letter';
		} else if (!upper.test(password.value)) {
			isShowPawdError.value = true;
			pawdError.value = 'Password must contain at least one uppercase letter';
		}
		if (!number.test(password.value)) {
			isShowPawdError.value = true;
			pawdError.value = 'Password must contain at least one number';
		}
		if (!special.test(password.value)) {
			isShowPawdError.value = true;
			pawdError.value = 'Password must contain at least one special letter';
		}
	};

	const isvalidUsername = () => {
		isLoginError.value = false;
		isShowUsnError.value = false;
		if (username.value.length < 4) {
			isShowUsnError.value = true;
		}
	};

	const handleFormSubmit = async () => {
		event.preventDefault();
		if (!isShowPawdError.value && username.value.length > 4) {
			const body = {
				username: username.value,
				password: password.value
			};
			isLoading.value = true;
			const result = await user.login(body);
			isLoading.value = false;
			isLoginError.value = !result;
			if (result) {
				// redirect to home page
				useRouter().push('/');
			}
		}
	};
</script>
