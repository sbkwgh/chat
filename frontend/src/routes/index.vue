<template>
	<div class='index'>
		<side-panel></side-panel>
		<router-view class='router_view'></router-view>
	</div>
</template>

<script>
	import SidePanel from '../components/side-panel';

	export default {
		name: 'app-route',
		components: { SidePanel }
	};
</script>

<style lang='scss' scoped>
	.index {
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