<template>
	<div class='conversation'>
		<c-prompt-modal
			v-model='showModal'
			button-text='OK, delete'
			color='red'
			@confirm='alert'
		>
			Are you sure you want to delete this conversation? <br/>
			All your messages will be lost
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
					<c-menu :items='settingsItems' @delete='showModal = true'>Settings</c-menu>
				</div>
			</div>
		</transition>

		<div class='conversation__main'>
			<conversation-message
				v-for='message in messages'
				:message='message.content'
				:self='message.User.username === $store.state.username'
			></conversation-message>
		</div>
		<div class='conversation__input_bar'>
			<textarea
				class='input input--textarea conversation__input'
				placeholder='Type your message here'
				@keydown.enter.prevent='sendMessage'
				v-model='input'
			></textarea>
			<button
				class='conversation__submit button button--blue'
				@click='sendMessage'
			>
				Send
			</button>
		</div>
	</div>
</template>

<script>
	import CMenu from '../components/c-menu';
	import ConversationTimeBreak from '../components/conversation-time-break';
	import CPromptModal from '../components/c-prompt-modal';
	import ConversationMessage from '../components/conversation-message';
	import NewConversationInput from '../components/new-conversation-input';

	export default {
		name: 'conversation',
		components: {
			CMenu,
			ConversationTimeBreak,
			CPromptModal,
			ConversationMessage,
			NewConversationInput
		},
		data () {
			return {
				name: '',
				messages: [],
				id: null,
				input: '',

				newConversationUsers: [],

				settingsItems: [
					{ text: 'Delete', event: 'delete' },
					{ text: 'Mute', event: 'mute' },
					{ text: 'Report', event: 'report' }
				],
				showModal: false,
				showNewConversationBar: !this.$route.params.id
			}
		},
		methods: {
			alert () {
				console.log('Confirm')
			},
			getConversation () {
				let id = this.$route.params.id;

				if(id) {
					this.showNewConversationBar = false;
					this.axios
						.get('/api/conversation/' + id)
						.then(res => {
							this.showModal = false;
							this.messages = res.data.Messages;
							this.name = res.data.name;
							this.id = res.data.id;
						})
						.catch(e => {
							this.$store.commit('setErrors', e.response.data.errors);
						});
				} else {
					this.showNewConversationBar = true;
					this.messages = [];
					this.id = null;
				}
			},
			sendMessage () {
				if(!this.input.trim().length) return;

				if(this.id) {
					this.axios
						.post('/api/message', {
							content: this.input.trim(),
							conversationId: this.id
						})
						.then(res => {
							res.data.User = { username: this.$store.state.username }
							this.messages.push(res.data);
							this.input = '';
						})
						.catch(e => {
							this.$store.commit('setErrors', e.response.data.errors);
						});
				} else {
					let userIds = this.newConversationUsers.map(user => user.id);
					userIds.push(+this.$store.state.userId);

					this.axios
						.post('/api/conversation', { userIds })
						.then(res => {
							this.name = res.data.name;
							this.id = res.data.id;
							this.$router.push({
								name: 'conversation',
								params: { id: res.data.id }
							});
							this.sendMessage();
						})
						.catch(e => {
							this.$store.commit('setErrors', e.response.data.errors);
						});
				}
			}
		},
		watch: {
			'$route.params': 'getConversation'
		},
		mounted () {
			this.getConversation();
		}
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables';

	.conversation {
		display: grid;
		grid-template-rows: 3rem auto 5rem;

		@at-root #{&}__header {
			border-bottom: thin solid $gray-1;
			display: grid;
			grid-column-gap: 0.5rem;
			grid-template-columns: 1fr auto 1fr;
			padding: 0rem 2rem;
		}
			@at-root #{&}__title, #{&}__new_conversation_input {
				align-self: center;
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
			align-content: flex-end;
			display: flex;
			flex-direction: column;
			overflow-y: auto;
			padding: 0 1rem;
			padding-top: 1rem;
		}
		@at-root #{&}__input_bar {
			display: grid;
			grid-column-gap: 0.5rem;
			grid-template-columns: auto 3rem;
			padding: 1rem;
		}
			@at-root #{&}__input {
				height: 3rem;
				width: 100%;
			}
			@at-root #{&}__submit {
				padding: 0;
			}
	}
</style>