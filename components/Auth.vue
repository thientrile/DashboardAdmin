<!-- @format -->

<template>
	<form
		id="authForm"
		class="transition delay-1000 duration-300 ease-in-out flex min-w-[500px] flex-col px-6 py-6 shadow-lg lg:px-8"
		@submit="submitFrom"
		method="post">
		<div class="flex justify-center">
			<img
				src="/favicon.ico"
				alt="" />
		</div>
		<h1
			v-if="isLogin"
			class="text-2xl font-bold block text-center">
			Login your account
		</h1>
		<h1
			v-else
			class="text-2xl font-bold block text-center">
			Register your account
		</h1>

		<div class="w-ful mb-10 flex items-center justify-center"></div>
		<div
			class="w-full"
			v-show="!isLogin">
			<label
				for="firstname"
				class="font-bold"
				>First name <span class="text-red-500"> * </span></label
			>
			<input
				type="text"
				id="firstname"
				name="firstname"
				autocomplete="given-name"
				v-model="firstName"
				class="block w-full py-1.5 rounded-md border-2 focus-visible:border-sky-300"
				:required="!isLogin" />
		</div>
		<div
			class="mt-2 min-w-[50%]"
			v-show="!isLogin">
			<label
				for="lastname"
				class="font-bold"
				>Last name <span class="text-red-500"> * </span></label
			>
			<input
				type="text"
				id="lastname"
				name="lastname"
				autocomplete="family-name"
				v-model="lastName"
				:required="!isLogin"
				class="block w-full rounded-md border-2 py-1.5 focus-visible:border-sky-300" />
		</div>

		<div class="mt-2 min-w-[50%]">
			<label
				for="email"
				class="font-bold"
				>{{ isLogin ? 'Username/email/phonenumber' : 'Email'
				}}<span class="text-red-500"> * </span></label
			>
			<input
				:type="isLogin ? 'text' : 'email'"
				:id="isLogin ? 'username' : 'email'"
				:name="isLogin ? 'username' : 'email'"
				:autocomplete="isLogin ? 'username' : 'email'"
				v-model="email"
				required
				class="block w-full rounded-md border-2 py-1.5 focus-visible:border-sky-300"
				@input="isEmailError = false" />
			<span
				v-show="isEmailError"
				class="text-red-500"
				>{{
					isLogin
						? 'Incorrect email or password'
						: 'This email is already in use'
				}}</span
			>
		</div>
		<div
			class="mt-2 grid grid-cols-3 gap-3"
			v-show="!isLogin">
			<div class="">
				<label
					for="sex"
					class="font-bold"
					>Sex</label
				>
				<select
					v-model="sex"
					name="sex"
					class="block border-2 rounded-md py-1.5 w-full">
					<option
						selected
						value="0">
						Male
					</option>
					<option value="1">Female</option>
					<option value="2">Order</option>
				</select>
			</div>
			<div class="ms-2">
				<label
					for="dateOfBirth"
					class="font-bold">
					Date of birth <span class="text-red-500">*</span>
				</label>
				<input
					type="date"
					autocomplete="bday"
					name="dateOfBirth"
					id="dateOfBirth"
					v-model="dateOfBirth"
					class="block rounded-md border-2 py-1.5 focus-visible:border-sky-300"
					:required="!isLogin" />
			</div>
		</div>
		<div class="mt-2 min-w-[50%]">
			<label
				for="password"
				class="font-bold">
				Enter your Password <span class="text-red-500"> * </span>
			</label>
			<input
				type="password"
				id="password"
				name="password"
				:autocomplete="isLogin ? 'current-password' : 'new-password'"
				v-model="password"
				required
				@input="isvalidPassword()"
				class="block w-full rounded-md border-2 py-1.5 focus-visible:border-sky-300"
				:class="isPwsError ? 'border-red-500' : ''" />
			<span class="text-red-500">{{ messagePwsError }}</span>
		</div>
		<div
			class="mt-2 min-w-[50%]"
			v-show="!isLogin">
			<label
				for="re-password"
				class="font-bold">
				Re-enter your password <span class="text-red-500"> * </span>
			</label>
			<input
				type="password"
				id="re-password"
				name="re-password"
				v-model="confirmPassword"
				:required="!isLogin"
				@change="isRepassword()"
				class="block w-full rounded-md border-2 py-1.5 focus-visible:border-sky-300"
				:class="isRepwsError ? 'border-red-500' : ''" />
			<span
				v-show="isRepwsError"
				class="text-red-500"
				>Incorrect password</span
			>
		</div>
		<div v-if="!isLogin">
			<input
				for=""
				type="checkbox"
				:required="!isLogin" />
			<span class="ms-2 text-sm"
				>I agree to the terms of privacy
				<a
					href="#"
					class="text-red-500 underline"
					>license</a
				></span
			>
		</div>
		<div v-else>
			<a
				href="/auth/forgot-password"
				class="block text-end text-sm text-red-500 underline"
				>Forgot password?</a
			>
		</div>
		<div class="mt-2 min-w-[50%]">
			<button
				:disabled="isLoading"
				type="submit"
				class="w-full bg-sky-600 py-1.5 rounded-md ring-inset text-white font-bold">
				<Icon
					v-if="isLoading"
					name="eos-icons:loading"
					class="font-bold" />
				<span v-else>{{ isLogin ? 'Login' : 'Register' }}</span>
			</button>
		</div>
		<div class="my-2 w-full h-[2px] bg-black"></div>
		<button
			type="button"
			@click="
				isLogin = !isLogin;
				isLoading = false;
			"
			class="w-full bg-green-600 py-1.5 rounded-md ring-inset text-white font-bold">
			{{ isLogin ? "I don't have an account" : 'I have an account' }}
		</button>
	</form>
</template>

<script setup>
	import { useUserStore } from '~/store/user.js';
	const user = useUserStore();
	import { ref } from 'vue';
	const isLoading = ref(false);
	const isLogin = ref(true);
	const isPwsError = ref(false);
	const messagePwsError = ref('');
	const firstName = ref('');
	const lastName = ref('');

	const email = ref('');
	const password = ref('');
	const confirmPassword = ref('');
	const isEmailError = ref(false);
	const sex = ref('0');
	const dateOfBirth = ref('');
	const isvalidPassword = () => {
		isPwsError.value = false;
		messagePwsError.value = '';
		const lower = /(?=.*[a-z])/;
		const upper = /(?=.*[A-Z])/;
		const number = /(?=.*\d)/;
		const special = /(?=.*[!@#$%^&*])/;
		const length = /(?=.{8,})/;
		if (!length.test(password.value)) {
			isPwsError.value = true;
			messagePwsError.value = 'Password must be at least 8 characters';
		}
		if (!lower.test(password.value)) {
			isPwsError.value = true;
			messagePwsError.value =
				'Password must contain at least one lowercase letter';
		} else if (!upper.test(password.value)) {
			isPwsError.value = true;
			messagePwsError.value =
				'Password must contain at least one uppercase letter';
		}
		if (!number.test(password.value)) {
			isPwsError.value = true;
			messagePwsError.value = 'Password must contain at least one number';
		}
		if (!special.test(password.value)) {
			isPwsError.value = true;
			messagePwsError.value =
				'Password must contain at least one special letter';
		}
	};
	const isRepwsError = ref(false);
	const isRepassword = () => {
		if (password.value !== confirmPassword.value) {
			isRepwsError.value = true;
		} else {
			isRepwsError.value = false;
		}
	};
	const submitFrom = async () => {
		event.preventDefault();
		isLoading.value = !isPwsError.value;
		// const passwordHash = await bcrypt.hash(password.value, 10);
		if (!isLogin.value && isLoading.value) {
			isLoading.value =
				!isRepwsError.value && new Date(dateOfBirth.value) < Date.now();

			const req = await $fetch('api/auth/register', {
				method: 'POST',
				body: {
					name: firstName.value + ' ' + lastName.value,
					email: email.value,
					password: password.value,

					sex: sex.value,
					date_of_birth: new Date(dateOfBirth.value)
				}
			});

			if (req.status !== 200) {
				isEmailError.value = true;
			} else {
				const { profile, tokens, uniqueId } = req.metadata;
				await user.authenticate(tokens, uniqueId, profile);
			}
		} else if (isLogin.value && isLoading.value) {
			const req = await $fetch('api/auth/login', {
				method: 'POST',
				body: {
					username: email.value,
					password: password.value
				}
			});

			if (req.status !== 200) {
				isEmailError.value = true;
			} else {
				const { profile, tokens, uniqueId } = req.metadata;

				await user.authenticate(tokens, uniqueId, profile);
			}
		}
		isLoading.value = false;
	};
</script>
