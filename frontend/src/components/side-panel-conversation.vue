<template>
	<div
		class='side_panel_conversation'
		:class='{ "side_panel_conversation--selected": selected }'
		@click='goToConversation'
		@keydown.enter='goToConversation'
	>
		<div>
			<div class='side_panel_conversation__profile_picture'>
				<div
					class='side_panel_conversation__profile_picture__letter'
					v-for='userLetter in userLetters'
					:class='[
						"side_panel_conversation__profile_picture__letter--" + userLetters.length
					]'
					:style='{
						"background-color": userLetter.color
					}'
				>
					{{userLetter.letter}}
				</div>
			</div>
		</div>
		<div class='side_panel_conversation__conversation_content'>
			<div class='side_panel_conversation__name'>{{conversation.name}}</div>
			<div class='side_panel_conversation__snippet'>
				{{username}}:
				{{conversation.Messages[0].content}}
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'side-panel-conversation',
		props: ['conversation'],
		computed: {
			selected () {
				return (
					this.$route.name === 'conversation' &&
					+this.$route.params.id === this.conversation.id
				);
			},
			username () {
				let username = this.conversation.Messages[0].User.username;

				if(username === this.$store.state.username) {
					return 'You';
				} else {
					return username;
				}
			},
			userLetters () {
				return this.conversation.Users
					.filter(u => u.username !== this.$store.state.username)
					.map(u => {
						return {
							letter: u.username[0].toUpperCase(),
							color: u.color
						};
					})
					.slice(0, 4);
			}
		},
		methods: {
			goToConversation () {
				this.$router.push("/app/conversation/" + this.conversation.id);
			}
		}
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.side_panel_conversation {
		background-color: #fff;
		border-bottom: thin solid $gray-1;
		cursor: default;
		display: flex;
		height: 5rem;
		padding: 0.5rem;
		position: relative;
		transition: background-color 0.2s;
		width: 100%;

		&:hover, &:focus {
			background-color: $gray-hover;
			outline: none;
		}

		&::after {
			background-color: $gray-4;
			content: '';
			height: 100%;
			left: 0;
			opacity: 0;
			position: absolute;
			top: 0;
			transition: opacity 0.2s;
			width: 0.25rem;
		}

		@at-root #{&}--selected {
			background-color: $gray-hover;

			&::after {
				opacity: 1;
			}
		}

		@at-root #{&}__profile_picture {
			background-color: $gray-1;
			border-radius: 100%;
			height: 3rem;
			overflow: hidden;
			width: 3rem;

			@at-root #{&}__letter {
				font-weight: 300;
				padding: 0.25rem;
				text-align: center;

				@at-root #{&}--1, #{&}--2 {
					font-size: 1.5rem;
					height: 3rem;
					line-height: 2.5rem;
					width: 3rem;
				}
				@at-root #{&}--2 {
					display: inline-block;
					font-size: 1rem;
					width: 1.5rem;
				}
				@at-root #{&}--3 {
					height: 1.5rem;

					&:nth-child(1), &:nth-child(2) {
						display: inline-block;
						padding-bottom: 0;
						width: 1.5rem;
					}
					&:nth-child(3) {
						padding-bottom: 0.5rem;
						padding-top: 0;
						width: 3rem;
					}
				}
				@at-root #{&}--4 {
					display: inline-block;
					height: 1.5rem;
					width: 1.5rem;

					&:nth-child(1), &:nth-child(2) {
						padding-bottom: 0;
					}
					&:nth-child(3), &:nth-child(4) {
						padding-top: 0;
					}
					&:nth-child(1), &:nth-child(3) {
						padding-right: 0;
					}
					&:nth-child(2), &:nth-child(4) {
						padding-left: 0;
					}
				}
			}
		}
		@at-root #{&}__name {
			display: block;
			max-height: 1.25rem;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			width: 11.75rem;
		}
		@at-root #{&}__conversation_content {
			margin-left: 0.5rem;
		}
		@at-root #{&}__snippet {
			color: $text-secondary;
			font-weight: 300;
			height: 2.5rem;
			overflow-y: hidden;
			word-break: break-all;
		}
	}
</style>