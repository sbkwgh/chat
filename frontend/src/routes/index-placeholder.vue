<template>
	<div class='index'>
		<div class='index__message'>
			<div classs='index__message__icon'></div>
			<div class='index__message__text'>Select a conversation or click 'New conversation' to start a new one</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'index-placeholder'
	};
</script>

<style lang='scss' scoped>
	.index {
		align-items: center;
		cursor: default;
		display: flex;
		justify-content: center;
		user-select: none;
	}
</style>