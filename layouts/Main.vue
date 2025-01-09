<!-- @format -->

<template>
	<div
		class="h-screen flex bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
		<LeftNav />
		<div class="m-2 w-full flex flex-col">
			<div
				class="my-2 p-2 bg-white dark:bg-black w-full shadow-2xl rounded-2xl flex justify-between items-center">
				<div>
					<h1 class="text-2xl font-semibold text-center">
						<UBreadcrumb :items="general.breadcrumb" />
					</h1>
				</div>

				<div class="flex items-center gap-2">
					<UChip text="0">
						<UButton
							icon="tdesign:notification"
							color="neutral"
							variant="subtle" />
					</UChip>
					<ColorModeButton />

					<div class="relative">
						<UPopover mode="hover">
							<UButton
								class="flex items-center justify-center rounded-full border-0"
								variant="outline">
								<UAvatar
									:src="user.profile.avatar"
									:alt="user.profile.name"
									size="md" />
							</UButton>

							<template #content>
								<div
									class="p-2 flex flex-col gap-2 items-start w-[200px] min-h-10 bg-white dark:bg-gray-800 shadow-2xl rounded-sm z-50">
									<ULink
										class="ms-2.5 flex items-center gap-2"
										to="/profile">
										<UIcon name="gg:profile" />
										<span> Profile </span>
									</ULink>

									<UButton
										@click="handleLogout"
										label="Logout"
										variant="none"
										icon="material-symbols:logout" />
								</div>
							</template>
						</UPopover>
					</div>
				</div>
			</div>
			<div class="max-h-full px-2 overflow-hidden overflow-y-auto snap-y">
				<slot class="container mx-auto" />
	
			</div>
		</div>
	</div>
</template>

<script setup>
	import { useUserStore } from '~/store/user';
	const user = useUserStore();

	import ColorModeButton from '~/components/ColorModeButton.vue';
	import LeftNav from '~/components/LeftNav.vue';

	const handleLogout = async () => {
		await user.logout();
	};


	import { useGeneralStore } from '~/store/general';

	const general = useGeneralStore();


</script>
