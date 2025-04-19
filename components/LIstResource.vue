<!-- @format -->

<template>
	<div
		id="seach"
		class="sticky top-0 flex justify-between text-xs z-50 bg-white dark:bg-black shadow-sm p-3 rounded-2xl">
		<div class="flex items-center">
			<UInput
				v-model="search.keyword"
				placeholder="Search"
				icon="ic:baseline-search"
				class="w-full"
				:loading="search.loading"
				@change="getSrcformApi()" />
		</div>
		<div class="flex gap-2 justify-between items-center">
			<label for="limit">
				<span class="font-bold">Limit</span>
			</label>
			<UInputNumber
				class="w-25"
				id="limit"
				lablel="limit"
				:min="1"
				:max="admin.options.size"
				@change="
					page = 1;
					getSrcformApi();
				"
				v-model="limit" />
			<span class="font-bold">/</span>
			<label for="page">
				<span class="font-bold">Page</span>
			</label>
			<UInputNumber
				class="w-25"
				id="page"
				lablel="page"
				:min="1"
				:max="Math.ceil(admin.options.size / limit)"
				@change="getSrcformApi()"
				v-model="page" />
			<UTooltip text="Sync on system">
				<UButton
					icon="material-symbols:refresh-rounded"
					:loading="isLoading"
					@click="refresh()"
					color="neutral"
					variant="subtle" />
			</UTooltip>
			<div v-show="general.actions.create">
				<UTooltip text="Add new resource">
					<UButton
						icon="material-symbols:add"
						color="primary"
						variant="subtle"
						@click="srcNew.isShow = !srcNew.isShow" />
				</UTooltip>
			</div>
			<div v-show="general.actions.update">
				<UTooltip text="Sync on system">
					<UButton
						icon="material-symbols:cloud-outline"
						:loading="syncSrcLoading"
						@click="handleSyncSrc()"
						color="neutral"
						variant="subtle" />
				</UTooltip>
			</div>
		</div>
	</div>
	<div
		class="m-2 mt-2 p-5 bg-white dark:bg-black shadow-2xl rounded-2xl flex flex-col gap-5">
		<table class="border-collapse border border-slate-300 w-full">
			<thead>
				<tr>
					<th class="border border-slate-300 ...">Icon</th>
					<th class="border border-slate-300 ...">Name</th>
					<th class="border border-slate-300 ...">Description</th>
					<th class="border border-slate-300 ... w-[10px]">Actions</th>
				</tr>
			</thead>
			<tbody>
				<tr
					id="newSrc"
					v-show="srcNew.isShow && general.actions.create">
					<td class="border border-slate-300">
						<div class="flex justify-between">
							<div>
								<UIcon :name="srcNew.icon" />
							</div>
							<div>
								<Iconify
									:search="srcNew.name"
									v-model:icon="srcNew.icon" />
							</div>
						</div>
					</td>
					<td class="border border-slate-300">
						<UInput
							class="w-full"
							v-model="srcNew.name"
							placeholder="Enter New Name Resource"
							:color="srcNew.name.length == 0 ? 'error' : ''" />
					</td>
					<td class="border border-slate-300">
						<UInput
							class="w-full"
							v-model="srcNew.description"
							placeholder="Enter New Description" />
					</td>
					<td class="border border-slate-300">
						<div class="flex justify-center gap-2">
							<UTooltip text="Add New Resource">
								<UButton
									:loading="srcNew.loading"
									icon="material-symbols:add-rounded"
									type="button"
									@click="handleAdd"
									color="primary"
									variant="outline" />
							</UTooltip>
							<UTooltip text="Clear">
								<UButton
									@click="handleClearDataforNewSrc"
									icon="mdi:clear-outline"
									color="error"
									variant="outline" />
							</UTooltip>
						</div>
					</td>
				</tr>
				<tr
					@click="handleClearDataforNewSrc()"
					v-for="(item, idx) in listResource"
					:key="item.resourceId">
					<td class="border border-slate-300">
						<div class="flex justify-between">
							<div
								@click="item.isChange = true"
								v-show="general.actions.update">
								<Iconify
									:search="item.name"
									v-model:icon="item.icon" />
							</div>
							<div>
								<UIcon :name="item.icon" />
							</div>
						</div>
					</td>
					<td class="border border-slate-300 ...">
						
						<btnCopyClipboard :text="item.name"/>
						{{ item.name }}

					</td>
					<td
						class="border border-slate-300"
						@dblclick="item.isChange = true">
						<span v-if="!item.isChange">
							{{ item.description }}
						</span>
						<UInput
							v-else
							:disabled="!item.isChange"
							v-model="item.description"
							class="w-full h-full" />
					</td>
					<td class="border border-slate-300">
						<div class="flex justify-center gap-2">
							<div v-show="item.isChange && general.actions.update">
								<UTooltip text="Save Resource">
									<UButton
										:loading="item.loading"
										color="primary"
										variant="outline"
										@click="handledSave(item, idx)"
										icon="ic:baseline-save" />
								</UTooltip>
							</div>
							<div v-show="!item.isRoot && general.actions.delete">
								<UTooltip text="Delete Resource">
									<UButton
										color="error"
										variant="outline"
										@click="handleDelete(item.id, idx)"
										:loading="item.loading"
										icon="ic:baseline-delete" />
								</UTooltip>
							</div>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup>
	import btnCopyClipboard from './btnCopyClipboard.vue';
	import Iconify from './Iconify.vue';
	import { useAdminStore } from '~/store/admin';
	import { useGeneralStore } from '~/store/general';
	const general = useGeneralStore();
	const isLoading = ref(false);
	const admin = useAdminStore();
	const listResource = ref([]);
	const limit = ref(10);
	const page = ref(1);
	const search = ref({
		keyword: '',
		loading: false
	});

	const toast = useToast();
	const srcNew = ref({
		name: '',
		description: '',
		icon: '',
		loading: false,
		isNew: false,
		isError: false,
		isShow: false
	});
	const refresh = async () => {
		isLoading.value = true;
		await admin.getSrc({
			limit: limit.value,
			page: page.value,
			search: search.value.keyword
		});
		getListSrc();
		isLoading.value = false;
	};
	onMounted(async () => {
		await refresh();
	});
	const getSrcformApi = async () => {
		search.value.loading = true;
		await admin.getSrc({
			limit: limit.value,
			page: page.value,
			search: search.value.keyword
		});
		search.value.loading = false;
		getListSrc();
	};
	const getListSrc = () => {
		const arr = [];
		admin.resources.forEach((item) => {
			let obj = {};
			obj.name = item.name;
			obj.createdAt = item.createdAt;
			obj.id = item._id;
			obj.isRoot = item.isRoot;
			obj.description = item.description;
			obj.icon = item.icon || '';
			obj.loading = false;
			obj.isChange = false;
			arr.push(obj);
		});
		listResource.value = arr;
	};
	const handledSave = async (body, idx) => {
		listResource.value[idx].loading = true;

		// function save src

		const result = await admin.updateSrc(body);
		listResource.value[idx].loading = false;
		listResource.value[idx].isChange = false;
		if (result) {
			toast.add({
				title: 'Seccessfully',
				description: 'The resource has been updated',
				icon: 'mdi:success-bold',
				color: 'success'
			});
		} else {
			toast.add({
				title: 'Error',
				description: 'Not Found resource',
				icon: 'material-symbols:error-outline',
				color: 'error'
			});
		}
	};
	const handleAdd = async () => {
		if (srcNew.value.name.length == 0) {
			toast.add({
				title: 'Error',
				description: 'Please fill  the fields name',
				icon: 'material-symbols:error-outline',
				color: 'error'
			});
			return;
		}

		srcNew.value.loading = true;
		// function add src
		const body = {
			name: srcNew.value.name,
			description: srcNew.value.description,
			icon: srcNew.value.icon
		};
		const result = await admin.createSrc(body);
		srcNew.value.loading = false;
		if (result) {
			toast.add({
				title: 'Seccessfully',
				description: 'The new resource has been added',
				icon: 'mdi:success-bold',
				color: 'success'
			});
			getListSrc();
			handleClearDataforNewSrc();
		} else {
			toast.add({
				title: 'Error',
				description: 'The name is already exist',
				icon: 'material-symbols:error-outline',
				color: 'error'
			});
			handleClearDataforNewSrc();
		}
	};
	const handleDelete = async (id, idx) => {
		listResource.value[idx].loading = true;
		// function delete src
		const body = {
			resourceId: id
		};
		const result = await admin.deleteSrc(body);
		if (result) {
			listResource.value.splice(idx, 1);
		}
		listResource.value[idx].loading = false;
	};
	const handleClearDataforNewSrc = () => {
		srcNew.value.name = '';
		srcNew.value.description = '';
		srcNew.value.isNew = false;
		srcNew.value.loading = false;
		srcNew.value.icon = '';
		srcNew.value.isShow = false;
	};
	const syncSrcLoading = ref(false);
	const handleSyncSrc = async () => {
		syncSrcLoading.value = true;
		await admin.SyncSrc();
		await refresh();
		syncSrcLoading.value = false;
	};
</script>
