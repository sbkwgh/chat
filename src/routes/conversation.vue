<template>
	<div class='conversation'>
		<div class='conversation__header'>
			<div class='conversation__title'>Title</div>
			<div class='conversation__actions'>Actions</div>
		</div>
		<div class='conversation__main'>
			<conversation-message
				v-for='message in messages'
				:message='message.message'
				:self='message.self'
			></conversation-message>
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
	import ConversationMessage from '../components/conversation-message';

	export default {
		name: 'conversation',
		components: {
			ConversationMessage
		},
		data () {
			return {
				messages: (new Array(10)).fill({}).map((m, i) => {
					return {
						message: 'Message '.repeat(20),
						self: i % 2
					};
				})
			}
		}
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
			align-items: end;
			display: flex;
			flex-direction: column;
			overflow-y: auto;
			padding: 0 1rem;
			padding-top: 1rem;
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