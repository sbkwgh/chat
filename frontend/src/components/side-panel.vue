<template>
	<div class='side_panel'>
		<div class='side_panel__header'>
			<c-menu class='side_panel__username' :items='userMenu'>
				{{$store.state.username}} <span>&#9660;</span>
			</c-menu>
			<button
				class='side_panel__add button button--blue_border'
				@click='$router.push("/app/conversation")'
			>
				New conversation
			</button>
		</div>
		<div class='side_panel__search'>
			<input
				type='text'
				placeholder='Search conversations and people'
				class='input side_panel__search__input'
			>
		</div>
		<div
			class='side_panel__conversations'
			:class='{ "side_panel__conversations--empty": !conversations.length }'
		>
			<side-panel-conversation v-for='conversation in conversations' :conversation='conversation'></side-panel-conversation>

			<div v-if='!conversations.length'>
				No conversations
			</div>
		</div>
	</div>
</template>

<script>
	import CMenu from './c-menu';
	import SidePanelConversation from './side-panel-conversation';

	export default {
		name: 'side-panel',
		components: {
			CMenu,
			SidePanelConversation
		},
		data () {
			return {
				conversations: [],
				userMenu: [
					{ text: 'Settings', event: 'settings' },
					{ text: 'Log out', event: 'logout' }
				]
			};
		},
		mounted () {
			this.axios
				.get('/api/user/' + this.$store.state.userId + '/conversations')
				.then(res => {
					this.conversations = res.data;
				})
				.catch(e => {
					this.$store.commit('setErrors', e.response.data.errors);
				});
		}
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.side_panel {
		border-right: thin solid $gray-1;
		display: grid;
		grid-template-rows: 4rem 2.75rem auto;
		height: 100%;
		width: 17rem;

		@at-root #{&}__header {
			align-items: center;
			align-self: center;
			display: flex;
			font-weight: 300;
			justify-content: space-between;
			padding: 0 0.5rem;
			text-align: center;
		}
			@at-root #{&}__username {
				cursor: pointer;

				span {
					color: $gray-4;
					font-size: 0.85rem;
					margin-left: -0.25rem;
				}
			}
			@at-root #{&}__add {
				cursor: pointer;
				height: 2rem;
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

			@at-root #{&}--empty {
				align-items: center;
				cursor: default;
				display: flex;
				height: 100%;
				justify-content: center;
				user-select: none;
			}
		}
	}
</style>