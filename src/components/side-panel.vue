<template>
	<div class='side_panel'>
		<div class='side_panel__header'>
			Chat
		</div>
		<div class='side_panel__search'>
			<input type='text' placeholder='Search conversations'>
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
		height: 100%;
		width: 17rem;

		@at-root #{&}__header {
			font-size: 2.5rem;
			font-weight: 300;
			padding: 0.5rem;
			padding-top: 1rem;
			text-align: center;
		}
		@at-root #{&}__search {
			padding: 0.5rem;
		}
		@at-root #{&}__conversations {
			border-top: thin solid $gray-1;
			height: calc(100% - 7.125rem);
			overflow-y: auto;
		}
	}
</style>