<!-- @format -->

<template>
	<form
		class="flex flex-col gap-2 px-5"
		action="/auth"
		method="post"
		@submit="handleFormRegister"
		id="registerForm">
		<div class="w-full flex justify-between">
			<div class="flex flex-col gap-1">
				<label
					for="lastName"
					class="font-bold">
					<span>Last name</span>
					<span class="text-red-500">*</span>
				</label>
				<input
					tabindex="0"
					type="text"
					id="lastName"
					autocomplete="family-name"
					placeholder="Enter your last name"
					name="lastName"
					v-model="lastName"
					required
					class="px-1.5 block w-full rounded-md border-2 focus:border-amber-100 border-gray-200 py-1.5 focus-visible:border-sky-300" />
			</div>
			<div class="flex flex-col gap-1">
				<label
					for="firstName"
					class="font-bold">
					<span>First name</span>
					<span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					tabindex="0"
					id="firstName"
					autocomplete="given-name"
					placeholder="Enter your first name"
					name="firstName"
					v-model="firstName"
					required
					class="px-1.5 block w-full rounded-md border-2 focus:border-amber-100 border-gray-200 py-1.5 focus-visible:border-sky-300" />
			</div>
		</div>
		<div class="w-full flex flex-col gap-1">
			<label for="email">
				<span class="font-bold">Email</span>
				<span class="text-red-500">*</span>
			</label>
			<input
				type="email"
				tabindex="0"
				id="email"
				autocomplete="email"
				placeholder="Enter your email"
				name="email"
				v-model="email"
				required
				class="px-1.5 block w-full rounded-md border-2 focus:border-amber-100 border-gray-200 py-1.5 focus-visible:border-sky-300" />
			<span
				v-show="false"
				class="text-xs text-red-500"
				>This email already exists
			</span>
		</div>
		<div class="w-full flex justify-between">
			<div class="flex flex-col gap-1">
				<label for="sex">
					<span class="font-bold"> Gender </span>
				</label>
				<USelect
					id="sex"
					name="sex"
					v-model="sex"
					:items="itemsSex"
					:icon="itemsSex.find((item) => item.value == sex).icon"
					class="block w-46 rounded-md" />
			</div>
			<div class="flex flex-col gap-1">
				<label for="date">
					<span class="font-bold"> Date of birth </span>
					<span class="text-red-500">*</span>
				</label>
				<UInput
					name="date"
					id="date"
					type="date"
					v-model="dateOfBirth"
					autocomplete="bday"
					@change="isValidDate"
					placeholder="Enter your date of birth"
					class="block w-47" />
				<span
					v-show="new Date(dateOfBirth) > new Date()"
					class="text-red-500 text-xs">
					Invalid date of birth
				</span>
			</div>
		</div>
		<div class="flex flex-col gap-1">
			<label for="password">
				<span class="font-bold"> Password </span>
				<span class="text-red-500">*</span>
			</label>
			<input
				tabindex="0"
				type="password"
				id="password"
				autocomplete="new-password"
				placeholder="Enter your password"
				name="password"
				v-model="password"
				@input="isvalidPassword"
				required
				min="8"
				class="px-1.5 block w-full rounded-md border-2 focus:border-amber-100 border-gray-200 py-1.5 focus-visible:border-sky-300" />
			<span
				class="text-red-500 text-xs"
				v-show="isShowPawdError">
				{{ pawdError }}
			</span>
		</div>
		<div class="flex flex-col gap-1">
			<label for="rePaws">
				<span class="font-bold"> Confirm password </span>
				<span class="text-red-500">*</span>
			</label>
			<input
				type="password"
				tabindex="0"
				id="rePaws"
				autocomplete="new-password"
				placeholder="Re-enter your password"
				name="rePaws"
				v-model="rePassword"
				required
				@input="isValidRePaws"
				min="8"
				class="px-1.5 block w-full rounded-md border-2 focus:border-amber-100 border-gray-200 py-1.5 focus-visible:border-sky-300" />
			<span
				class="text-red-500 text-xs"
				v-show="rePassword !== password">
				Password does not match
			</span>
		</div>
		<div class="flex flex-col items-center mt-2">
			<div class="w-full h-[0.1px] bg-gray-500"></div>
			<UButton
				:disabled="!isRegister"
				type="submit"
				class="w-full flex justify-center mx-1.5 bg-blue-500  rounded-md py-2 px-4 mt-4"
				:color="isRegister ? 'secondary' : 'neutral'">
				<span
					class="font-bold"
					:loading="isLoading"
					>Register</span
				>
			</UButton>
		</div>
	</form>
</template>

<script setup>
	const isLoading = ref(false);
	const lastName = ref('');
	const firstName = ref('');
	const email = ref('');
	const password = ref('');
	const dateOfBirth = ref(Date());
	const rePassword = ref('');
	const sex = ref('male');
	const itemsSex = ref([
		{
			label: 'Female',
			value: 'female',
			icon: 'material-symbols:female-rounded'
		},
		{
			label: 'Male',
			value: 'male',
			icon: 'material-symbols:male-rounded'
		},
		{
			label: 'Other',
			value: 'other',
			icon: 'icon-park-outline:other'
		}
	]);

	const isRegister = ref(true);
	const pawdError = ref('');
	const isShowPawdError = ref(false);
	const isvalidPassword = () => {
		isRegister.value = true;
		isShowPawdError.value = false;
		pawdError.value = '';
		const lower = /(?=.*[a-z])/;
		const upper = /(?=.*[A-Z])/;
		const number = /(?=.*\d)/;
		const special = /(?=.*[!@#$%^&*])/;
		const length = /(?=.{8,})/;
		if (!length.test(password.value)) {
			isShowPawdError.value = true;
			isRegister.value = false;
			pawdError.value = 'Password must be at least 8 characters';
		}
		if (!lower.test(password.value)) {
			isShowPawdError.value = true;
			isRegister.value = false;
			pawdError.value = 'Password must contain at least one lowercase letter';
		} else if (!upper.test(password.value)) {
			isShowPawdError.value = true;
			isRegister.value = false;
			pawdError.value = 'Password must contain at least one uppercase letter';
		}
		if (!number.test(password.value)) {
			isShowPawdError.value = true;
			isRegister.value = false;
			pawdError.value = 'Password must contain at least one number';
		}
		if (!special.test(password.value)) {
			isShowPawdError.value = true;
			isRegister.value = false;
			pawdError.value = 'Password must contain at least one special letter';
		}
	};

	const isValidRePaws = () => {
		isRegister.value = true;
		if (rePassword.value !== password.value) {
			isRegister.value = false;
		}
	};

	const isValidDate = () => {
		isRegister.value = true;
		if (new Date(dateOfBirth.value) > new Date()) {
			isRegister.value = false;
		}
	};
	import { useUserStore } from '~/store/user';
	const user = useUserStore();
	const handleFormRegister = async () => {
		event.preventDefault();
		const body = {
			name: `${firstName.value} ${lastName.value}`,
			email: email.value,
			date_of_birth: dateOfBirth.value,
			sex: sex.value,
			password: password.value
		};
		isLoading.value = true;
		const result = await user.register(body);
		isLoading.value = false;
		if (result) {
			$router.push('/');
		}
	};
</script>
