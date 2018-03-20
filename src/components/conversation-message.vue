<template>
	<div
		class='conversation_message'
		:class='{
			"conversation_message--self": !!self
		}'
	>
		<pre
			class='conversation_message__message'
			:class='{
				"conversation_message__message--self": !!self
			}'
		>{{message}}</pre>
	</div>
</template>

<script>
	export default {
		name: 'conversation-message',
		props: ['self', 'message']
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.conversation_message {
		display: flex;

		@at-root #{&}--self {
			justify-content: flex-end;
			margin: 0.5rem 0;
		}

		@at-root #{&}__message {
			background-color: $gray-0;
			border-radius: 0.5rem 0.5rem 0.5rem 0;
			font-family: $font-family;
			font-size: 0.85rem;
			font-weight: 300;
			margin: 0;
			max-width: 50%;
			padding: 0.5rem 0.75rem;
			white-space: pre-wrap;
			word-wrap: break-word;

			@at-root #{&}--self {
				background-color: $blue-3;
				border-radius: 0.5rem 0.5rem 0 0.5rem;
				color: #fff;
			}
		}
	}
</style>