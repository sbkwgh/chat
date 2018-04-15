<template>
	<div class='side_panel'>
		<div class='side_panel__header'>
			<c-menu
				class='side_panel__username'
				:items='userMenu'
				@logout='logout'
			>
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
				:class='{
					"side_panel__search__input--small": showCloseButton
				}'
				@focus='setShowCloseButton(true)'
				@keyup='getConversations'
				v-model='searchQuery'
			>
			<transition name='transition-grow'>
				<button
					class='button side_panel__search__close'
					v-if='showCloseButton'
					@click='setShowCloseButton(false)'
				>
					Close
				</button>
			</transition>
		</div>
		<c-scroll-load
			class='side_panel__conversations'
			:class='{ "side_panel__conversations--empty": !conversations.length }'

			:loading='loading'
			position='bottom'
			@load='getConversations'
		>
			<side-panel-conversation
				v-for='conversation in conversations'
				:conversation='conversation'
				tabindex='0'
			></side-panel-conversation>

			<div v-if='!conversations.length'>
				No conversations
			</div>
		</c-scroll-load>
	</div>
</template>

<script>
	import CMenu from './c-menu';
	import CScrollLoad from './c-scroll-load';
	import SidePanelConversation from './side-panel-conversation';

	export default {
		name: 'side-panel',
		components: {
			CMenu,
			CScrollLoad,
			SidePanelConversation
		},
		data () {
			return {
				conversations: [],
				page: 0,

				loading: false,
				userMenu: [
					{ text: 'Settings', event: 'settings' },
					{ text: 'Log out', event: 'logout' }
				],

				showCloseButton: false,
				searchQuery: ''
			};
		},
		watch: {
			//When typing for each letter clear the data
			searchQuery () {
				this.page = 0;
				this.conversations = [];
			}
		},
		methods: {
			logout () {
				this.axios
					.post('/api/user/logout')
					.then(() => {
						this.$store.commit('setUser', { id: null, username: null });
						this.$router.push('/');
					})
					.catch(e => {
						this.$store.commit('setErrors', e.response.data.errors);
					});
			},
			setShowCloseButton (val) {
				if(this.showCloseButton !== val) {
					this.showCloseButton = val;
					this.conversations = [];
					this.page = 0;

					if(!val) {
						this.searchQuery = '';
						this.getConversations();
					}
				}
			},
			getConversations () {
				if(!this.loading && this.page !== null) {
					let params = { page: this.page };
					let searchQuery = this.searchQuery.trim();
					if(searchQuery) params.search = searchQuery;

					this.loading = true;

					this.axios
						.get(`/api/user/${this.$store.state.userId}/conversations`, { params })
						.then(res => {
							this.loading = false;
							this.conversations.push(...res.data.Conversations);
							this.page = res.data.continuePagination ? this.page+1 : null;
						})
						.catch(e => {
							this.loading = false;
							this.$store.commit('setErrors', e.response.data.errors);
						});
				}
			}
		},
		mounted () {
			this.getConversations();
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
			display: grid;
			grid-template-columns: auto min-content;
			padding: 0 0.5rem;

			@at-root #{&}__input {
				padding: 1rem 0.75rem;
				transition: padding 0.2s;

				@at-root #{&}--small {
					padding: 1rem 0.25rem;
				}
			}

			@at-root #{&}__close {
				margin-left: 0.25rem;
				padding: 0 0.25rem;
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