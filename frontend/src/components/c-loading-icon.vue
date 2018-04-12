<template>
	<div class='loading_icon'>
		<div class='loading_icon__icon'></div>
	</div>
</template>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.loading_icon {
		display: flex;
		justify-content: center;
		padding: 0.25rem 0;

		@at-root #{&}__icon {
			animation-duration: 1s;
			animation-iteration-count: infinite;
			animation-name: rotate;
			animation-timing-function: linear;
			background-color: #fff;
			border: 0.25rem solid $gray-2;
			border-top-color: $blue-3;
			border-radius: 100%;
			height: 2rem;
			width: 2rem;
		}
	}
</style>