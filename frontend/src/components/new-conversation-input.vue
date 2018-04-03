<template>
	<div class='new_conversation_input'>
		<div
			class='new_conversation_input__input_bar'
			:class='{ "new_conversation_input__input_bar--focus": inputFocused }'
		>
			<div class='new_conversation_input__selected_users'>
				<div class='new_conversation_input__selected_user' v-for='user in selected'>
					{{user.username}}
				</div>
			</div>
			<div class='new_conversation_input__placeholders_input'>
				<input
					ref='input'
					v-model='input'
					placeholder="Enter a username"
					class='new_conversation_input__input'
					@keydown='inputHandler'
					@focus='inputFocused = true;'
					@blur='inputFocused = false;'
				>
				<div class='new_conversation_input__placeholders'>
					<span
						class='new_conversation_input__placeholder--hidden'
					>
						{{placeholders[0]}}
					</span>
					<span
						class='new_conversation_input__placeholder'
						v-if='placeholders[1]'
					>
						{{placeholders[1]}}
					</span>
				</div>
			</div>
		</div>
		<transition name='transition-slide-fade'>
			<div class='new_conversation_input__suggestions' v-if='suggestions.length'>
				<div
					class='new_conversation_input__suggestion_item'
					:class='{ "new_conversation_input__suggestion_item--focus": focusedSuggestion === $index }'
					tabindex='0'
					v-for='(suggestion, $index) in suggestions'
					@click='addUser(suggestion)'
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
				input: '',
				inputFocused: false,
				suggestions_: [
					{ username: 'Username1' },
					{ username: 'Username2' },
					{ username: 'Username3' },
					{ username: 'Username4' },
					{ username: 'Username5' },
					{ username: 'Username6' },
					{ username: 'Username7' }
				],
				selected: [],
				focusedSuggestion: null
			};
		},
		computed: {
			suggestions () {
				let regexp = new RegExp('^' + this.input, 'i')

				return this.suggestions_.filter(v => {
					let match = v.username.match(regexp);

					return match && match[0].length && !this.selected.includes(v);
				});
			},
			placeholders () {
				if(!this.suggestions.length) {
					return ['', ''];
				}

				let firstSuggestion = this.suggestions[0].username;

				return [
					firstSuggestion.slice(0, this.input.length),
					firstSuggestion.slice(this.input.length, firstSuggestion.length)
				];
			},
		},
		methods: {
			inputHandler (e) {
				if(e.keyCode === 9 || e.keyCode === 32) {
					e.preventDefault();
					this.addUser();
				} else if (
					e.keyCode === 8 &&
					!this.input.length &&
					this.selected.length
				) {
					this.input = this.selected.pop().username;
				} else if(e.keyCode === 40) {
					this.setSelectionFocus(1);
				} else if(e.keyCode === 38) {
					this.setSelectionFocus(-1);
				} else if (e.keyCode === 13 && this.focusedSuggestion !== null) {
					this.addUser(this.suggestions[this.focusedSuggestion]);
					this.focusedSuggestion = null;
				}
			},
			setSelectionFocus (direction) {
				if(!this.suggestions.length) return;

				if(this.focusedSuggestion !== null) {
					this.focusedSuggestion = (this.focusedSuggestion + 1*direction) % this.suggestions.length;
				} else if (direction === 1 && this.focusedSuggestion === null) {
					this.focusedSuggestion = 0;
				}
			},
			addUser (user) {
				if(user) {
					this.selected.push(user);
				} else if(this.suggestions.length) {
					this.selected.push(this.suggestions[0]);
				} else {
					return;
				}

				this.input = '';
				this.$refs.input.focus();
			}
		}
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';
	@import '../assets/scss/elements.scss';

	.new_conversation_input {
		position: relative;

		@at-root #{&}__input_bar {
			@extend .input;

			display: flex;
			height: 2rem;
			padding: 0 0.25rem;
			padding-left: 0.125rem;
			width: 30rem;
			overflow-x: hidden;

			@at-root #{&}--focus {
				border-color: $gray-2;
				box-shadow: 0 0 0 2px $gray-2;
			}
		}
			@at-root #{&}__selected_users {
				align-items: center;
				display: flex;
				font-weight: 300;
				font-size: 0.85rem;
				margin-right: 0.125rem;
			}
				@at-root #{&}__selected_user {
					background-color: $gray-1;
					border-radius: 0.25rem;
					cursor: default;
					font-size: 0.8rem;
					height: 1.5rem;
					line-height: 1.5rem;
					margin: 0.125rem;
					padding: 0 0.25rem;
				}
			@at-root #{&}__placeholders_input {
				position: relative;
				width: 100%;
			}
				@at-root #{&}__input {
					border: 0;
					font-family: $font-family;
					font-weight: 300;
					font-size: 0.85rem;
					height: 100%;
					outline: none;
					width: 100%;
				}
				@at-root #{&}__placeholders {
					align-items: center;
					color: $gray-2;
					display: flex;
					font-size: 0.85rem;
					height: 100%;
					left: 1px;
					pointer-events: none;
					position: absolute;
					top: 0;
				}
					@at-root #{&}__placeholder {
						margin-left: -1px;

						@at-root #{&}--hidden {
							visibility: hidden;
						}
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
			@at-root #{&}--focus {
				background-color: $gray-0;
			}
			&:active, &:focus {
				background-color: $gray-0;
				outline: none;
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