<template>
	<div class='index'>
		<div class='index__message'>
			<div classs='index__message__icon'></div>
			<div class='index__message__text'>Select a conversation or click + to start a new one</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'index'
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables';

	.index {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>