<template>
	<div class='index'>
		<div class='index__message'>
			<div class='index__icon'>
				<font-awesome-icon :icon='["far", "comment-alt"]'></font-awesome-icon>
			</div>
			<div class='index__message__text'>
				Select a conversation or click 'New conversation'
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'index-placeholder'
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.index {
		align-items: center;
		color: $text-secondary;
		cursor: default;
		display: flex;
		font-size: 1.25rem;
		font-weight: bold;
		justify-content: center;
		user-select: none;

		@at-root #{&}__icon {
			font-size: 4rem;
			margin-bottom: 0.5rem;
			text-align: center;
		}
	}
</style>