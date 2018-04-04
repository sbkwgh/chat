import getCookies from '../lib/getCookies';

import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		username: null,
		userId: null,
		errors: null
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
		}
	}
});

const cookies = getCookies();
if (cookies.username && cookies.id) {
	store.commit('setUser', cookies);
}

export default store;