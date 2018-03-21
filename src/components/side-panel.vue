<template>
	<div class='side_panel'>
		<div class='side_panel__header'>
			Chat
		</div>
		<div class='side_panel__search'>
			<input type='text' placeholder='Search conversations' class='side_panel__search__input'>
		</div>
		<div class='side_panel__conversations'>
			<side-panel-conversation v-for='conversation in conversations'></side-panel-conversation>
		</div>
	</div>
</template>

<script>
	import SidePanelConversation from './side-panel-conversation';

	export default {
		name: 'side-panel',
		components: {
			SidePanelConversation
		},
		data () {
			return {
				conversations: (new Array(10)).fill(0)
			};
		}
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.side_panel {
		border-right: thin solid $gray-1;
		display: grid;
		grid-template-rows: 4.25rem 2.75rem auto;
		height: 100%;
		width: 17rem;

		@at-root #{&}__header {
			align-self: center;
			font-size: 2.5rem;
			font-weight: 300;
			text-align: center;
		}
		@at-root #{&}__search {
			align-self: start;
			padding: 0 0.5rem;

			@at-root #{&}__input {
				padding: 1rem 0.75rem;
			}
		}
		@at-root #{&}__conversations {
			align-self: start;
			border-top: thin solid $gray-1;
			max-height: 100%;
			overflow-y: auto;
		}
	}
</style>