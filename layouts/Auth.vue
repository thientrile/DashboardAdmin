<!-- @format -->

<template>
	<div
		id="AuthLayout"
		class="h-screen">
		<nav
			id="Topmenu"
			class="w-full mx-auto bg-black py-5 mb-5">
			<a class="w-full flex items-center justify-center pointer-events-none">
				<img
					src="/favicon.ico"
					alt="favcion" />
				<h1 class="text-2xl font-bold ms-2 text-white">TO-RI</h1>
			</a>
		</nav>
		<div class="w-full flex items-center justify-center">
			<slot />
		</div>
	</div>
</template>

<script lang="ts" setup></script>
