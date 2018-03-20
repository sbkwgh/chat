<template>
	<div id="app">
		<side-panel></side-panel>
		<router-view class='router_view'></router-view>
	</div>
</template>

<script>
	import SidePanel from './components/side-panel';

export default {
	name: 'app',
	components: {
		SidePanel
	}
};
</script>

<style lang='scss'>
	@import './assets/scss/variables.scss';
	@import './assets/scss/elements.scss';

	@import url('https://fonts.googleapis.com/css?family=Fira+Sans:300,400,500');

	* {
		box-sizing: border-box;
	}

	html, body, #app {
		color: $text-primary;
		font-family: $font-family;
		height: 100%;
		margin: 0;
		padding: 0;
		width: 100%;
	}

	#app {
		display: flex;
		height: 100%;
		width: 100%;
	}

	.router_view {
		width: calc(100% - 17rem);
		height: 100%;
		overflow: auto;
	}
</style>
