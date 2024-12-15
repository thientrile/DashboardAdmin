<!-- @format -->

<template>
	<div class="flex justify-end items-center w-full gap-2">
		<button
			type="button" @click="btnSync"
			class="m-5 px-1.5 py-1.4 flex gap-2 items-center justify-center rounded-md border-indigo-200 hover:ring-2">
			<span>Auto Sync</span>
			<Icon name="tdesign:folder-import-filled" v-if="!isSync" />
			<Icon name="line-md:loading-loop" v-else />
		</button>
	</div>
	<form
		class="p-1.5"
		@submit="handleFormSubmit">
		<div class="flex flex-col dark:text-white dark:bg-gray-800">
			<label
				for="name"
				class="text-sm font-bold p-1.5"
				>Name:</label
			>

			<input
				:disabled="isEdit"
				id="name"
				v-model="name"
				name="name"
				type="text"
				placeholder="Enter name resource"
				required
				class="py-1.4 px-1.5 border-2 border-gray-200 rounded-md focus-visible:border-gray-500 dark:bg-gray-800"
				:class="isError ? 'border-red-500' : ''" />
			<span
				v-show="isError"
				class="text-red-500">
				Resource already exists</span
			>
		</div>
		<div class="mt-2 flex flex-col">
			<label for="description">Description</label>
			<textarea
				placeholder="Describes the actions of resources"
				name="description"
				cols="100"
				id="description"
				v-model="description"
				class="py-1.5 px-1.5 border-2 border-gray-100 rounded-md focus-visible:border-sky-300 dark:bg-gray-800"></textarea>
		</div>

		<div class="flex gap-2 justify-end mt-4">
			<button
				v-if="isEdit"
				type="submit"
				class="min-w-[5em] bg-sky-500 px-2.5 py-1.5 rounded-md border-red-300 text-white hover:ring-1">
				<span class="mr-2">Edit</span>
				<Icon name="mdi:pen" />
			</button>
			<button
				v-else
				type="submit"
				class="min-w-[5em] bg-green-500 px-2.5 py-1.5 rounded-md border-red-300 text-white hover:ring-1">
				<span v-if="!isAdd">
					<span class="mr-2">Add new</span>
					<Icon name="ic:baseline-plus" />
				</span>
				<span v-else>
					<span class="mr-2">Adding...</span>
					<Icon name="ic:baseline-autorenew" />
				</span>
			</button>
			<button
				@click="clear"
				type="button"
				class="w-[5em] bg-red-500 px-2.5 py-1.5 rounded-md border-red-300 text-white hover:ring-1">
				<span class="mr-2">Clear</span>
				<Icon
					name="mdi:clear-outline"
					class="" />
			</button>
		</div>
	</form>
</template>

<script setup>
	import { useAdminStore } from '~/store/admin';
	const admin = useAdminStore();
	const name = ref('');
	const description = ref('');
	const isEdit = ref(false);
	const isError = ref(false);
	const isLoading = ref(false);
	const isAdd = ref(false);
	watchEffect(() => {
		if (admin.selectSRC.length == 0) {
			return;
		}
		isError.value = false;
		isEdit.value = true;
		name.value = admin.selectSRC[0].name;
		description.value = admin.selectSRC[0].description;
	});
	const clear = () => {
		admin.selectSrc = null;
		isEdit.value = false;
		admin.select = '';
		name.value = '';
		description.value = '';
	};
	const handleFormSubmit = async () => {
		isLoading.value = true;
		event.preventDefault();
		if (isEdit.value) {
			// handle edit
		} else {
			// handle add new
			isAdd.value = true;
			const reslut = await admin.createSrc(name.value, description.value);
			isAdd.value = false;
			if (reslut) {
				await admin.getSrc({});
				clear();
			} else {
				isError.value = true;
			}
		}
		isLoading.value = false;
	};

	const isSync = ref(false);
	const btnSync = async () => {
		isSync.value = true;
		await admin.SyncSrc();
		isSync.value = false;
	};
</script>
