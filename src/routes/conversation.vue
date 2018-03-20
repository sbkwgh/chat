<template>
	<div class='conversation'>
		<div class='conversation__header'>
			<div class='conversation__title'>Title</div>
			<div class='conversation__actions'>Actions</div>
		</div>
		<div class='conversation__main'>
			
		</div>
		<div class='conversation__input_bar'>
			<textarea
				class='conversation__input'
				placeholder='Type your message here'
			></textarea>
			<button class='conversation__submit'>
				Send
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'conversation'
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables';

	.conversation {
		display: grid;
		grid-template-rows: 3rem auto 5rem;

		@at-root #{&}__header {
			border-bottom: thin solid $gray-1;
			display: grid;
			grid-column-gap: 0.5rem;
			grid-template-columns: 1fr auto 1fr;
			padding: 1rem 2rem;
		}
			@at-root #{&}__title {
				align-self: center;
				grid-column: 2;
				justify-self: center;
			}
			@at-root #{&}__actions {
				align-self: center;
				grid-column: 3;
				justify-self: end;
			}
		@at-root #{&}__main {
			overflow-y: auto;
		}
		@at-root #{&}__input_bar {
			display: grid;
			grid-column-gap: 0.5rem;
			grid-template-columns: auto 3rem;
			padding: 1rem;
		}
			@at-root #{&}__input {
				height: 3rem;
				width: 100%;
			}
			@at-root #{&}__submit {
				background-color: $blue-2;
				border: thin solid $blue-5;
				color: #fff;
				width: 3rem;

				&:hover {
					background-color: $blue-3;
				}
				&:active {
					background-color: $blue-4;
				}
			}
	}
</style>