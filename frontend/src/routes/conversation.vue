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
				<new-conversation-input class='conversation__new_conversation_input'></new-conversation-input>
			</div>
			<div class='conversation__header' key='header' v-else>
				<div class='conversation__title'>Title</div>
				<div class='conversation__actions'>
					<c-menu :items='settingsItems' @delete='showModal = true'>Settings</c-menu>
				</div>
			</div>
		</transition>

		<div class='conversation__main'>
			<conversation-message
				v-for='message in messages'
				:message='message.message'
				:self='message.self'
			></conversation-message>
			<conversation-time-break :date='new Date()'></conversation-time-break>
		</div>
		<div class='conversation__input_bar'>
			<textarea
				class='input input--textarea conversation__input'
				placeholder='Type your message here'
			></textarea>
			<button class='conversation__submit button button--blue'>
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
				messages: (new Array(10)).fill({}).map((m, i) => {
					return {
						message: 'Message '.repeat(20),
						self: i % 2
					};
				}),
				settingsItems: [
					{ text: 'Delete', event: 'delete' },
					{ text: 'Mute', event: 'mute' },
					{ text: 'Report', event: 'report' }
				],
				showModal: false,
				showNewConversationBar: false
			}
		},
		methods: {
			alert () {
				console.log('Confirm')
			}
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
			align-items: end;
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