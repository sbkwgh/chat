<template>
	<div
		class='conversation_message'
		:class='{
			"conversation_message--self": self
		}'
	>
		<div
			class='conversation_message__username'
			v-if='users.length > 2 && !self'
		>
			{{message.User.username}}
		</div>
		<pre
			class='conversation_message__message'
			:class='{
				"conversation_message__message--self": self
			}'
		>{{message.content}}</pre>
	</div>
</template>

<script>
	export default {
		name: 'conversation-message',
		props: ['message', 'users'],
		computed: {
			self () {
				return this.message.User.username === this.$store.state.username;
			}
		}
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.conversation_message {
		align-items: flex-start;
		display: flex;
		flex-direction: column;

		@at-root #{&}--self {
			align-items: flex-end;
			margin: 0.5rem 0;
		}

		@at-root #{&}__username {
			color: $text-secondary;
			font-size: 0.85rem;
			font-weight: 300;
			margin-left: 0.5rem;
		}

		@at-root #{&}__message {
			background-color: $gray-0;
			border-radius: 0.5rem 0.5rem 0.5rem 0;
			font-family: $font-family;
			font-size: 0.85rem;
			font-weight: 300;
			margin: 0;
			max-width: 75%;
			padding: 0.5rem 0.75rem;
			white-space: pre-line;
			word-break: break-all;

			@at-root #{&}--self {
				background-color: $blue-2;
				border-radius: 0.5rem 0.5rem 0 0.5rem;
				color: #fff;
			}
		}
	}
</style>