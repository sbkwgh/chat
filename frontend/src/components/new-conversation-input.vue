<template>
	<div class='new_conversation_input'>
		<input placeholder="Enter someone's name" class='new_conversation_input__input'>
		<transition name='transition-slide-fade'>
			<div class='new_conversation_input__suggestions' v-if='suggestions.length'>
				<div
					class='new_conversation_input__suggestion_item'
					v-for='suggestion in suggestions'
				>
					<div>
						<div class='new_conversation_input__profile_picture'></div>
					</div>
					<div class='new_conversation_input__name'>{{suggestion.username}}</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
	export default {
		name: 'new-conversation-input',
		props: ['value'],
		data () {
			return {
				suggestions: [
					{ username: 'Username' },
					{ username: 'Username' },
					{ username: 'Username' },
					{ username: 'Username' },
					{ username: 'Username' },
					{ username: 'Username' },
					{ username: 'Username' }
				]
			};
		}
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.new_conversation_input {
		position: relative;

		@at-root #{&}__input {
			padding: 1rem 0.5rem;
			width: 20rem;
		}
		@at-root #{&}__suggestions {
			background-color: #fff;
			border: thin solid $gray-2;
			border-radius: 0.25rem;
			box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
			left: calc(50% - 15rem);
			max-height: 25rem;
			overflow-y: auto;
			padding: 0.25rem 0;
			position: absolute;
			top: calc(100% + 0.25rem);
			width: 30rem;
		}
		@at-root #{&}__suggestion_item {
			align-items: center;
			cursor: default;
			display: flex;
			font-weight: 300;
			padding: 0.5rem 1rem;
			transition: background-color 0.2s;

			&:hover {
				background-color: $gray-hover;
			}
			&:active, &:focus {
				background-color: $gray-0;
			}
		}
		@at-root #{&}__profile_picture {
			border-radius: 100%;
			background-color: $gray-1;
			height: 1.5rem;
			margin-right: 0.5rem;
			width: 1.5em;
		}
	}
</style>