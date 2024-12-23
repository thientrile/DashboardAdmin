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
				tabindex="0"
				type="text"
				id="firstname"
				name="firstname"
				placeholder="Enter your first name"
				autocomplete="given-name"
				v-model="firstName"
				class="block w-full py-1.5 rounded-md border-2 focus-visible:border-sky-300"
				:required="!isLogin" />
		</div>
		<div
			class="mt-2"
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
				placeholder="Enter your last name"
				autocomplete="family-name"
				v-model="lastName"
				:required="!isLogin"
				class="block w-full rounded-md border-2 py-1.5 focus-visible:border-sky-300" />
		</div>
		<div
			class="mt-2"
			v-if="!isLogin">
			<label
				for="email"
				class="font-bold"
				>Email address <span class="text-red-500"> * </span></label
			>
			<input
				type="email"
				id="email"
				name="email"
				placeholder="Enter your email address"
				autocomplete="email"
				v-model="email"
				required
				class="block w-full rounded-md border-2 py-1.5 focus-visible:border-sky-300"
				@input="isEmailError = false" />
			<span
				v-show="isEmailError"
				class="text-red-500"
				>This email is already in use</span
			>
		</div>
		<div
			class="mt-2"
			v-else>
			<label
				for="username"
				class="font-bold">
				<span>Username</span>
				<span class="text-red-500"> * </span>
			</label>
			<input
				type="text"
				id="username"
				name="username"
				placeholder="Enter your username or phone number or email"
				autocomplete="username"
				v-model="username"
				required
				class="block w-full rounded-md border-2 py-1.5 focus-visible:border-sky-300"
				@input="isEmailError = false" />
			<span
				v-show="isEmailError"
				class="text-red-500"
				>Incorrect email or password</span
			>
		</div>
		<div
			class="mt-2 flex"
			v-show="!isLogin">
			<div class="">
				<label
					for="sex"
					class="font-bold"
					>Sex</label
				>
				<USelect
					id="sex"
					name="sex"
					v-model="sex"
					:options="['Male', 'Female', 'Order']" />
			</div>
			<div class="ms-2">
				<label
					for="dateOfBirth"
					class="font-bold">
					Date of birth <span class="text-red-500">*</span>
				</label>

				<UPopover :popper="{ placement: 'bottom-start' }">
					<UButton
						icon="i-heroicons-calendar-days-20-solid"
						:label="format(dateOfBirth, 'yyyy-MM-dd')" />

					<template #panel="{ close }">
						<DatePicker
							v-model="dateOfBirth"
							:is-required="!isLogin"
							@close="close" />
					</template>
				</UPopover>
				<span class="text-red-500">
					{{
						dateOfBirth > new Date()
							? 'Date of birth must be less than the current date'
							: ''
					}}
				</span>
			</div>
		</div>
		<div class="mt-2">
			<label
				for="password"
				class="font-bold">
				Enter your Password <span class="text-red-500"> * </span>
			</label>
			<input
				type="password"
				id="password"
				name="password"
				placeholder="Enter your password"
				:autocomplete="isLogin ? 'current-password' : 'new-password'"
				v-model="password"
				required
				@input="isvalidPassword()"
				class="block w-full rounded-md border-2 py-1.5 focus-visible:border-sky-300"
				:class="isPwsError ? 'border-red-500' : ''" />
			<span class="text-red-500">{{ messagePwsError }}</span>
		</div>
		<div
			class="mt-2"
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
				placeholder="Re-enter your password"
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
					tabindex="-1"
					href="#"
					class="text-red-500 underline"
					>license</a
				></span
			>
		</div>
		<div v-else>
			<a
				tabindex="-1"
				href="/auth/forgot-password"
				class="block text-end text-sm text-red-500 underline"
				>Forgot password?</a
			>
		</div>
		<div class="mt-2">
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
		<div class="my-2 w-full flex justify-center">
			<span class="w-[15em] bg-gray-500 h-[1px]"></span>
		</div>
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
	import DatePicker from '~/components/DatePicker.vue';
	import { format } from 'date-fns';
	import { useUserStore } from '~/store/user.js';
	const user = useUserStore();
	const username = ref('');
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
	const dateOfBirth = ref(new Date(-1));
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
		let req;
		if (!isLogin.value && isLoading.value) {
			isLoading.value =
				!isRepwsError.value && new Date(dateOfBirth.value) < Date.now();
			const body = {
				name: firstName.value + ' ' + lastName.value,
				email: email.value,
				password: password.value,
				sex: sex.value,
				date_of_birth: new Date(dateOfBirth.value)
			};

			req = await user.register(body);
			isLoading.value = false;
		} else if (isLogin.value && isLoading.value) {
			const body = {
				username: username.value,
				password: password.value
			};
			req = await user.login(body);
			isLoading.value = false;
		}
		isLoading.value = false;
		if (req) {
			isEmailError.value = false;
			navigateTo('/');
		}
		isEmailError.value = true;
	};
</script>
