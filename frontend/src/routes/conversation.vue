<template>
	<div class='conversation'>
		<c-prompt-modal
			v-model='showDeleteModal'
			button-text='OK, delete'
			color='red'
			@confirm='alert'
		>
			Are you sure you want to delete this conversation?
		</c-prompt-modal>

		<c-prompt-modal
			v-model='showEditModal'
			button-text='Change name'
			color='blue'
		>
			Enter the new name for your chat below
			<input type='text' placeholder='Chat name' class='input' style='margin-top: 0.5rem;'>
		</c-prompt-modal>
		
		<transition name='transition-fade' mode='out-in'>
			<div
				class='conversation__header'
				key='new-conversation'
				v-if='showNewConversationBar'
			>
				<new-conversation-input
					class='conversation__new_conversation_input'
					@input='selected => { newConversationUsers = selected }'
				></new-conversation-input>
			</div>
			<div class='conversation__header' key='header' v-else>
				<div class='conversation__title'>{{name}}</div>
				<div class='conversation__actions'>
					<c-menu
						:items='settingsItems'
						@delete='showDeleteModal = true'
						@edit='showEditModal = true'
					>Settings</c-menu>
				</div>
			</div>
		</transition>

		<c-scroll-load
			class='conversation__main'
			position='top'
			:loading='loading'
			@load='getConversation'

			ref='conversation'
		>
			<div class='conversation__main__conversations'>
				<conversation-message
					v-for='message in messages'
					:context='messages'
					:message='message'
					:users='users'
				></conversation-message>
			</div>

			<user-typing :users='users' :typing-users='typingUsers'></user-typing>

			<div style='padding: 2.5rem'></div>
		</c-scroll-load>


		<div class='conversation__input_bar input'>
			<textarea
				class='input--textarea conversation__input'
				placeholder='Type your message here'
				@keydown.enter.prevent='() => $route.params.id ? sendMessage() : createConversation()'
				@keydown='sendTyping'
				v-model='input'
			></textarea>
			<button
				class='conversation__submit button button--blue'
				@click='() => $route.params.id ? sendMessage() : createConversation()'
			>
				<font-awesome-icon icon='paper-plane'></font-awesome-icon>
			</button>
		</div>
	</div>
</template>

<script>
	import CMenu from '../components/c-menu';
	import ConversationMessage from '../components/conversation-message';
	import ConversationTimeBreak from '../components/conversation-time-break';
	import CPromptModal from '../components/c-prompt-modal';
	import CScrollLoad from '../components/c-scroll-load';
	import NewConversationInput from '../components/new-conversation-input';
	import UserTyping from '../components/user-typing';

	export default {
		name: 'conversation',
		components: {
			CMenu,
			ConversationMessage,
			ConversationTimeBreak,
			CPromptModal,
			CScrollLoad,
			NewConversationInput,
			UserTyping
		},
		data () {
			return {
				name: '',
				messages: [],
				users: [],
				input: '',
				page: 1,

				typingUsers: [],
				typingInterval: null,
				typingTimer: null,

				newConversationUsers: [],

				settingsItems: [
					{ text: 'Delete', event: 'delete' },
					{ text: 'Edit chat name', event: 'edit' }
				],
				showDeleteModal: false,
				showEditModal: false,
				showNewConversationBar: !this.$route.params.id,

				loading: false
			}
		},
		methods: {
			alert () {
				console.log('Confirm')
			},
			clearData () {
				this.name = '';
				this.messages = [];
				this.page = 1;
				this.newConversationUsers = [];

				this.$io.emit('leaveConversation', {
					conversationId: +this.$route.params.id || 0
				});
			},
			hasConversationGotScrollbar () {
				let $el = this.$refs.conversation.$el;

				return $el.scrollHeight > $el.clientHeight;
			},
			getConversation () {
				//If there all pages have been loaded or
				//a new page is currently loading
				//then do not send off another request
				if(!this.$route.params.id || this.page === null || this.loading) return;


				this.showNewConversationBar = false;
				this.loading = true;

				this.axios
					.get(`/api/conversation/${this.$route.params.id}?page=${this.page}`)
					.then(res => {
						this.loading = false;
						this.showModal = false;

						this.users = res.data.Users;
						this.name = res.data.name;
						this.page= res.data.continuePagination ? this.page + 1 : null;

						let $conversation = this.$refs.conversation.$el;
						let scrollBottom = $conversation.scrollHeight - $conversation.scrollTop;

						let ids = this.messages.map(m => m.id);
						let uniqueMessages = res.data.Messages.filter(message => {
							return !ids.includes(message.id);
						});
						this.messages.unshift(...uniqueMessages);

						//Scroll back to original position before new messages were added
						this.$nextTick(() => {
							$conversation.scrollTop = $conversation.scrollHeight - scrollBottom;
						});

						//Keep loading conversations until there is a scroll bar
						//To enable the scroll load mechanism
						if(!this.hasConversationGotScrollbar()) {
							this.getConversation();
						}
					})
					.catch(e => {
						this.loading = false;
						this.$store.commit('setErrors', e.response.data.errors);
					});
			},
			createConversation () {
				let userIds = this.newConversationUsers.map(user => user.id);
				userIds.push(+this.$store.state.userId);

				//If there is no message or only one user (themselves)
				//then do not create new conversation
				if(!this.input.trim().length || userIds.length < 2) return;

				this.axios
					.post('/api/conversation', { userIds })
					.then(res => {
						this.name = res.data.name;
						this.$router.push({
							name: 'conversation',
							params: { id: res.data.id }
						});
						this.sendMessage();
					})
					.catch(e => {
						this.$store.commit('setErrors', e.response.data.errors);
					});
			},
			updateLastRead () {
				this.axios.put('/api/conversation/' + this.$route.params.id);

				//Conversation panel might not have loaded request, so try again in 200 msec
				if(!this.$store.state.conversations.length) {
					setTimeout(this.updateLastRead, 200);
				} else {
					this.$store.commit('updateConversationLastRead', +this.$route.params.id);
				}
			},
			sendMessage () {
				if(!this.input.trim().length) return;

				this.$io.emit('stopTyping', {
					conversationId: +this.$route.params.id
				});

				this.axios
					.post('/api/message', {
						content: this.input.trim(),
						conversationId: +this.$route.params.id
					})
					.then(res => {
						this.input = '';
					})
					.catch(e => {
						this.$store.commit('setErrors', e.response.data.errors);
					});
			},
			setTypingTimer () {
				this.typingTimer = setTimeout(() => {
					this.typingInterval = null;

					this.$io.emit('stopTyping', {
						conversationId: +this.$route.params.id
					});
				}, 2000);
			},
			sendTyping (e) {
				//Ignore enter keypress or if no conversation created yet
				if(e.keyCode === 13 || !this.$route.params.id) return;

				//if interval does not exist --> send startTyping, start timer
				if(this.typingInterval === null) {
					this.$io.emit('startTyping', {
						conversationId: +this.$route.params.id
					});

					this.typingInterval = new Date();
					this.setTypingTimer();
				//if interval is less than 2 seconds --> clear timer 
				} else if (new Date() - this.typingInterval < 2000) {
					clearTimeout(this.typingTimer);
					this.setTypingTimer();
				}
			},
			scrollToBottom (scrollIfNotAtBottom) {
				let $conversation = this.$refs.conversation.$el;	
				
				//If currently scorlled to bottom or parameter set to true
				if(
					scrollIfNotAtBottom || 
					$conversation.scrollHeight - $conversation.scrollTop === $conversation.clientHeight
				) {			
					this.$nextTick(() => {
						$conversation.scrollTop = $conversation.scrollHeight;
					});
				}
			},
			pageLoad () {
				this.clearData();

				if(this.$route.params.id) {
					this.$io.emit('joinConversation', {
						conversationId: +this.$route.params.id 
					});
					this.getConversation();
					this.updateLastRead();
				} else {
					this.showNewConversationBar = true;
				}
			}
		},
		watch: {
			'$route.params': 'pageLoad'
		},
		mounted () {
			this.pageLoad();

			this.$io.on('message', message => {
				if(message.ConversationId !== +this.$route.params.id) return;

				this.messages.push(message);
				this.scrollToBottom();
				this.updateLastRead();
			});
			this.$io.on('startTyping', ({ userId }) => {
				let user = this.users.find(u => u.id === userId);
				this.typingUsers.push(user);
				this.scrollToBottom();
			});
			this.$io.on('stopTyping', ({ userId }) => {
				let index = this.typingUsers.findIndex(u => u.id === userId);
				this.typingUsers.splice(index, 1);
			});
		}
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables';

	.conversation {
		display: grid;
		grid-template-rows: 3rem auto;
		position: relative;

		@at-root #{&}__header {
			border-bottom: thin solid $gray-1;
			display: grid;
			grid-column-gap: 0.5rem;
			grid-template-columns: 1fr auto 1fr;
			padding: 0rem 2rem;
		}
			@at-root #{&}__title, #{&}__new_conversation_input {
				align-self: center;
				font-weight: bold;
				grid-column: 2;
				justify-self: center;
			}
			@at-root #{&}__actions {
				align-self: center;
				font-weight: 300;
				grid-column: 3;
				justify-self: end;
			}
		@at-root #{&}__main {
			display: flex;
			flex-direction: column;
			height: 100%;
			justify-content: space-between;
			overflow-y: auto;
			padding: 0 1rem;
			padding-top: 1rem;

			@at-root #{&}__conversations {			
				align-content: flex-end;
				display: flex;
				flex-direction: column;
			}
		}
		@at-root #{&}__input_bar {
			align-items: center;
			background-color: #fff;
			box-shadow: 0 5px 6px 0px $gray-1;
			bottom: 0.5rem;
			display: flex;
			height: unset;
			margin: 0 2rem;
			padding: 0rem;
			position: absolute;
			width: calc(100% - 4rem);
		}
			@at-root #{&}__input {
				border: 0;
				font-family: $font-family;
				height: 3.25rem;
				padding: 0.75rem;
				width: 100%;
			}
			@at-root #{&}__submit {
				border-radius: 100%;
				box-shadow: 0 4px 6px rgba($blue-5, 0.25);
				font-size: 1rem;
				height: 2rem;
				margin: 0.5rem;
				padding: 0.5rem;
				width: 2rem;

				svg {
					left: -0.1rem;
					position: relative;
					top: -0.15rem;
				}
			}
	}
</style>