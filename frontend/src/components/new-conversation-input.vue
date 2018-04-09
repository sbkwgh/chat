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
					:class='{ "new_conversation_input__suggestion_item--focus": focusedSuggestionIndex === $index }'
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
				suggestionsData: [],
				selected: [],
				focusedSuggestionIndex: null
			};
		},
		computed: {
			suggestions () {
				return this.suggestionsData.filter(user => {
					return (
						!this.selected.filter(u => u.id === user.id).length &&
						user.username !== this.$store.state.username
					);
				});
			},
			selectedSuggestionIndex () {
				if(this.focusedSuggestionIndex !== null) {
					return this.focusedSuggestionIndex;
				} else {
					return 0;
				}
			},
			placeholders () {
				if(!this.suggestions.length) {
					return ['', ''];
				}
				let firstSuggestion = this.suggestions[this.selectedSuggestionIndex].username;

				return [
					firstSuggestion.slice(0, this.input.length),
					firstSuggestion.slice(this.input.length, firstSuggestion.length)
				];
			},
		},
		methods: {
			inputHandler (e) {
				//tab, space or enter
				if([9, 32, 13].indexOf(e.keyCode) > -1) {
					e.preventDefault();
					this.addUser();
				//backspace
				} else if (
					e.keyCode === 8 &&
					!this.input.length &&
					this.selected.length
				) {
					this.input = this.selected.pop().username;
				//Down
				} else if(e.keyCode === 40) {
					this.setSelectionFocus(1);
				//Up
				} else if(e.keyCode === 38) {
					this.setSelectionFocus(-1);
				}
			},
			setSelectionFocus (direction) {
				let index = this.focusedSuggestionIndex;
				let length = this.suggestions.length;
				
				if(!length) return;

				if(index !== null) {
					let newIndex = (index + 1*direction) % length;
					this.focusedSuggestionIndex = (newIndex > 0) ? newIndex : null;
				} else if (direction === 1 && index === null) {
					this.focusedSuggestionIndex = 0;
				}
			},
			addUser (user) {
				if(user) {
					this.selected.push(user);
				} else if(this.suggestions.length) {
					this.selected.push(
						this.suggestions[this.selectedSuggestionIndex]
					);
				} else {
					return;
				}

				this.input = '';
				this.focusedSuggestionIndex = null;
				this.$refs.input.focus();
			}
		},
		watch: {
			input () {
				let input = this.input.trim();

				if(input) {
					this.axios
						.get('/api/user/search/' + input)
						.then(res => {
							this.suggestionsData = res.data;
						})
						.catch(e => {
							this.$store.commit('setErrors', e.response.data.errors);
						})
				} else {
					this.suggestionsData = [];
				}
			},
			selected () {
				this.$emit('input', this.selected);
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
						margin-left: -0.5px;

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