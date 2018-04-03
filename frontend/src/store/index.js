import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		username: null,
		userId: null
	},
	mutations: {
		setUser (state, user) {
			state.username = user.username;
			state.userId = user.id;
		}
	}
});

function getCookies () {
	let pairs = document.cookie.split(';').map(pair => pair.trim());
	let obj = {};

	pairs.forEach(pair => {
		let [key, value] = pair.split('=');
		obj[key] = value;
	});

	return obj;
}

const cookies = getCookies();
if (cookies.username && cookies.id) {
	store.commit('setUser', cookies);
}

export default store;