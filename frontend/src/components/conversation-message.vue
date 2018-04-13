<template>
	<div
		class='conversation_message'
		:class='{
			"conversation_message--self": self,
			"conversation_message--margin": useMargin
		}'
	>
		<conversation-time-break :message='message' :previous='context[0]'></conversation-time-break>
		<div
			class='conversation_message__username'
			v-if='showUsername'
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
	import ConversationTimeBreak from './conversation-time-break';

	export default {
		name: 'conversation-message',
		props: ['message', 'users', 'context'],
		components: {
			ConversationTimeBreak
		},
		computed: {
			self () {
				return this.message.User.username === this.$store.state.username;
			},
			showUsername () {
				let prev = this.context[0];
				let selfUsername = this.message.User.username;

				//If first message or not from the same user
				//and there are more than two users in the conversation
				return (
					(!prev || prev.User.username !== selfUsername) &&
					(this.users.length > 2 && !this.self)
				);
			},
			useMargin () {
				let next = this.context[1];

				//If next message exists and is not from the same user
				return (
					next &&
					next.User.username !== this.message.User.username
				);
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
		margin-bottom: 0.125rem;

		@at-root #{&}--self {
			align-items: flex-end;
		}

		@at-root #{&}--margin {
			margin-bottom: 0.5rem;
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