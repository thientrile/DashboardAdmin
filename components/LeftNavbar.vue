<!-- @format -->

<template>
	<div
		class="navigation bg-sky-300 dark:bg-black dark:border-black border-s-[10px]"
		:class="isActive ? 'active' : ''">
		<ul>
			<li>
				<nuxt-link to="/profile">
					<span class="icon"
						><img
							:src="user.profile.avatar"
							class="rounded-full h-[60px] w-[60px]"
							alt=""
					/></span>
					<span class="title">{{ user.profile.name }}</span>
				</nuxt-link>
			</li>
			<li v-for="nav in navList">
				<nuxt-link :to="'/admin' + nav.link" >
					<span class="icon"><Icon :name="nav.icon" /></span>
					<span class="title capitalize">{{ nav.title }}</span>
				</nuxt-link>
			</li>
			<li>
				<div @click="logout">
					<span class="icon"><Icon name="material-symbols:logout" /> </span>
					<span class="title">Sign Out</span>
				</div>
			</li>
		</ul>
		<div
			class="toggle  shadow-slate-100  bg-white"
			@click="isActive = !isActive"
			:class="isActive ? 'active' : ''"></div>
	</div>
</template>

<script setup>
	import { ref } from 'vue';
	import { useUserStore } from '~/store/user.js';
	const isActive = ref(false);
	const user = useUserStore();
	const logout = async () => {
		isActive.value = false;

		await user.logout();
	};
	const navList = ref([
		{
			icon: 'material-symbols:home-outline',
			title: 'general',
			link: ''
		},
		{
			icon: 'catppuccin:folder-src',
			title: 'resources',
			link: '/resources'
		},
		{
			icon: 'eos-icons:role-binding-outlined',
			title: 'roles',
			link: '/roles'
		}
	]);
</script>

<style>
	.navigation {
		position: fixed;
		z-index: 1000;
		top: 0;
		left: 0;
		bottom: 20px;
		right: 20px;

		width: 80px;
		min-height: 100vh;

		/* border-left: 10px solid #287bff; */
		overflow: hidden;
		box-shadow: 15px 15px 25px rgba(0, 0, 0, 0.05);
		transition: 0.5s;
	}
	.navigation.active {
		width: 300px;
		border-top-right-radius: 20px;
		border-bottom-right-radius: 20px;
	}
	.toggle {
		position: absolute;
		bottom: 15px;
		right: 15px;
		width: 50px;
		height: 50px;
		/* background-color: #fff; */
		border-radius: 50%;
		box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.15);
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.toggle::before {
		content: '';
		position: absolute;
		width: 26px;
		height: 3px;
		border-radius: 3px;
		background: #365fa1;
		transform: translateY(-5px);
		transition: 1s;
	}
	.toggle.active::before {
		transform: translateY(0) rotate(-405deg);
	}
	.toggle::after {
		content: '';
		position: absolute;
		width: 26px;
		height: 3px;
		border-radius: 3px;
		background: #365fa1;
		transform: translateY(5px);
		transition: 1s;
	}
	.toggle.active::after {
		transform: translateY(0) rotate(225deg);
	}
	.navigation ul {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.navigation ul li:hover {
		background: #fff;
	}

	.navigation ul li {
		position: relative;
		list-style: none;
		width: 100%;
		border-top-left-radius: 30px;
		border-bottom-left-radius: 30px;
		cursor: pointer;
	}
	.navigation ul li:nth-child(1) {
		top: 20px;
		margin-bottom: 40px;
		background: none;
	}

	.navigation ul li:not(:first-child):hover::before {
		content: '';
		width: 20px;
		height: 20px;
		position: absolute;
		top: -20px;
		right: 0;
		border-bottom-right-radius: 20px;
		box-shadow: 7.5px 7.5px 0 7.5px #fff;
	}
	/* .navigation ul li:not(:first-child):hover::after .router-link-active, */
	.navigation ul li:not(:first-child):hover::after {
		content: '';
		width: 20px;
		height: 20px;
		position: absolute;
		bottom: -20px;
		right: 0;
		border-top-right-radius: 20px;
		box-shadow: 7.5px -7.5px 0 7.5px #fff;
	}

	.navigation ul li div,
	.navigation ul li a {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
		text-decoration: none;
		color: #fff;
	}
	.navigation ul li .router-link-active,
	.navigation ul li:hover a {
		color: #365fa1;
	}
	.navigation ul li .router-link-active {
		color: #365fa1;
	}
	.navigation ul li:hover div {
		color: #365fa1;
	}
	.navigation ul li div .icon,
	.navigation ul li a .icon {
		position: relative;
		display: block;
		min-width: 60px;
		height: 60px;
		line-height: 60px;
		text-align: center;
	}
	.navigation ul li div .icon img,
	.navigation ul li div .icon span,
	.navigation ul li a .icon span {
		font-size: 1.75em;
	}
	.navigation ul li:not(:first-child) a .icon i {
		-webkit-text-stroke: 1px white;
		color: transparent;
	}
	.navigation ul li:hover:not(:first-child) a .icon i {
		-webkit-text-stroke: 1px #365fa1;
	}
	.navigation ul li div .title,
	.navigation ul li a .title {
		position: relative;
		display: block;
		padding: 0 10px;
		height: 60px;
		line-height: 60px;
		text-align: start;
		white-space: nowrap;
	}
</style>
