<template>
	<div class='side_panel_conversation' @click='$router.push("/app/conversation/" + conversation.id)'>
		<div>
			<div class='side_panel_conversation__profile_picture'></div>
		</div>
		<div class='side_panel_conversation__conversation_content'>
			<div class='side_panel_conversation__name'>{{conversation.Messages[0].User.username}}</div>
			<div class='side_panel_conversation__snippet'>{{conversation.Messages[0].content}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'side-panel-conversation',
		props: ['conversation']
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
		transition: background-color 0.2s;
		width: 100%;

		&:hover {
			background-color: $gray-hover;
		}

		@at-root #{&}__profile_picture {
			background-color: $gray-1;
			border-radius: 100%;
			height: 3rem;
			width: 3rem;
		}
		@at-root #{&}__conversation_content {
			margin-left: 0.5rem;
		}
		@at-root #{&}__snippet {
			color: $text-secondary;
			font-weight: 300;
		}
	}
</style>