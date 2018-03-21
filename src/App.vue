<template>
	<div id='app'>
		<router-view></router-view>
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
	@import './assets/scss/transitions.scss';

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
</style>
