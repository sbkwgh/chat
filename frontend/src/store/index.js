import getCookies from '../lib/getCookies';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		username: null,
		userId: null,
		errors: null,
		conversations: []
	},
	mutations: {
		setUser (state, user) {
			state.username = user.username;
			state.userId = user.id;
		},
		setErrors (state, errors) {
			if(errors === null || !errors.length) {
				state.errors = null;
			} else {
				state.errors = errors.map(e => e.message);
			}
		},
		clearConversations (state, conversations) {
			state.conversations = [];
		},
		addConversations (state, conversations) {
			state.conversations.push(...conversations);
		},
		updateConversationLastRead (state, id) {
			let index = state.conversations.findIndex(conversation => {
				return conversation.id === id;
			});

			let conversation = state.conversations[index];
			conversation.lastRead = new Date() + '';

			state.conversations.splice(index, 1, conversation);
		},
		updateUnshiftConversation (state, updatedConversation) {
			let index = state.conversations.findIndex(conversation => {
				return conversation.id === updatedConversation.id;
			});

			if(index > -1) {
				state.conversations.splice(index, 1);
			}

			state.conversations.unshift(updatedConversation);
		},
		updateConversationName (state, { id, name }) {
			let index = state.conversations.findIndex(conversation => {
				return conversation.id === id;
			});

			let conversation = state.conversations[index];
			conversation.name = name;

			state.conversations.splice(index, 1, conversation);
		}
	}
});

const cookies = getCookies();
if (cookies.username && cookies.id) {
	store.commit('setUser', cookies);
}

export default store;