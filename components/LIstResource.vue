<!-- @format -->

<template>
	<div class="min-w-[80vw] p-2 border-t-2 dark:t">
		<div class="flex justify-between">
			<div class="flex gap-2">
				<button
					type="button"
					@click="
						currentPage--;
						handleChange();
					"
					class="p-1.5 rounded-sm"
					:disabled="currentPage - 1 <= 0">
					<Icon name="bx:left-arrow" />
				</button>
				<span class="p-1.5">page: {{ currentPage }}</span>
				<button
					type="button"
					:disabled="admin.resources.length < limit"
					@click="
						currentPage++;
						handleChange();
					"
					class="p-1.5 rounded-sm">
					<Icon name="bx:right-arrow" />
				</button>

				<label
					for="limit"
					class="border-inherit p-1.5 rounded-s-md"
					>Limit</label
				>
				<input
					class="w-[50px] rounded-md border-2 py-1.5 focus-visible:border-sky-300 dark:text-white"
					type="number"
					v-model="limit"
					id="limit"
					max="100"
					min="1"
					@change="
						currentPage = 1;
						handleChange();
					" />
			</div>
			<div class="flex gap-2">
				<label
					for="search"
					class="border-current p-1.5 rounded-s-md"
					>Search</label
				>
				<input
					class="rounded-md border-2 py-1.5 focus-visible:border-sky-300"
					type="text"
					v-model="search"
					id="search"
					placeholder="Enter name resource"
					@change="
						currentPage = 1;
						handleChange();
					" />
			</div>
		</div>
		<div
			v-if="listSrc.length > 0"
			class="max-h-[300px] min-h-[150px] overflow-hidden overflow-y-auto">
			<table
				class="w-full cursor-pointer w-fulborder-collapse border border-slate-400">
				<thead class="sticky">
					<tr>
						<th class="border border-slate-300">Name</th>
						<th class="border border-slate-300">Description</th>
						<th
							class="border border-slate-300"
							v-show="check">
							Actions
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						class="cursor-pointer hover:bg-gray-500"
						:class="admin.selectSrc == item.slug ? 'bg-gray-500' : ''"
						v-for="(item, index) in listSrc"
						:key="index">
						<td
							class="border border-slate-300"
							@click="admin.selectSrc = item.slug">
							{{ item.name }}
						</td>
						<td
							class="border border-slate-300"
							@click="admin.selectSrc = item.slug">
							{{ item.description }}
						</td>
						<td
							class="border border-slate-300 flex w-full"
							v-show="check && !item.isRoot">
							<button
								class="bg-red-500 rounded-md flex items-center justify-center p-1.5"
								:disabled="item.isloading"
								@click="delSrc(item.resourceId, index)">
								<span
									v-if="item.isloading"
									class="flex items-center">
									<span>Deleting</span>
									<Icon name="line-md:loading-loop" />
								</span>

								<span
									v-else
									class="text-white rouned-md hover:ring-1"
									>Delete</span
								>
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<div
			v-else
			class="flex border-inherit justify-center items-center backdrop-blur-md min-h-[5em] dark:text-white">
			Empty
		</div>
	</div>
</template>

<script setup>
	import { useAdminStore } from '~/store/admin';
	const admin = useAdminStore();
	const listSrc = ref([]);
	const search = ref('');
	const currentPage = ref(1);
	const limit = ref(10);
	const props = defineProps(['isActions']);
	const { isActions } = toRefs(props);
	const check = ref(isActions.value == 'true');
	onMounted(async () => {
		await admin.getSrc({ limit: limit.value, page: currentPage.value });
	});
	watch(
		() => admin.resources,
		() => {
			const arrTemp = [];
			for (let i in admin.resources) {
				let objTemp = {};
				objTemp = admin.resources[i];
				objTemp.isloading = false;
				arrTemp.push(objTemp);
			}
			listSrc.value = arrTemp;
		}
	);
	const handleChange = async () => {
		limit.value = limit.value == '' ? 10 : limit.value;
		const checkData = admin.resources.filter((item) =>
			item.name.toLowerCase().includes(search.value.toLowerCase())
		);

		if (checkData.length > 0 && search.value.length > 0) {
			listSrc.value = checkData;
		} else {
			await admin.getSrc({
				search: search.value,
				limit: limit.value,
				page: currentPage.value
			});
		}
	};
	const delSrc = async (id, idx) => {
		listSrc.value[idx].isloading = true;
		const body = {
			resourceId: id
		};
		const result = await admin.deleteSrc(body);
		listSrc.value[idx].isloading = false;
		if (result) {
			listSrc.value.splice(idx, 1);
		}
	};
</script>
