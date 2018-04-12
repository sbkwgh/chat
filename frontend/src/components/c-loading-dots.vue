<template>
	<div class='loading_dots'>
		<span></span>
		<span></span>
		<span></span>
	</div>
</template>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	@keyframes glow {
		0% {
			background-color: $gray-4;
		}
		100% {
			background-color: $gray-2;
			transform: translateY(0.25rem);
		}
	}

	$duration: 0.5s;

	.loading_dots {
		display: inline-flex;

		span {
			animation: $duration infinite alternate glow;
			background-color: $gray-4;
			border-radius: 100%;
			height: 0.75rem;
			margin: 0 0.125rem;
			width: 0.75rem;

			&:nth-child(2) {
				animation-delay: $duration * 1/3;
			}
			&:nth-child(3) {
				animation-delay: $duration * 2/3;
			}
		}
	}
</style>