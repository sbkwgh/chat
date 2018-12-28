import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueIo from './lib/vue-io';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPaperPlane, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faCommentAlt } from '@fortawesome/free-regular-svg-icons';

library.add(faPaperPlane, faAngleDown, faCommentAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

import App from './App';
import store from './store';
import getCookies from './lib/getCookies';

//Routes
import Login from './routes/login';
import Index from './routes/index';
import IndexPlaceholder from './routes/index-placeholder';
import Conversation from './routes/conversation';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(VueIo);

const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/',
			component: Login,
			beforeEnter (to, from, next) {
				if(getCookies().username) {
					next('app');
				} else {
					next();
				}
			} 
		},
		{
			path: '/app',
			component: Index,
			beforeEnter (to, from, next) {
				if(!getCookies().username) {
					next('/');
				} else {
					next();
				}
			},
			children: [
				{ path: '/', component: IndexPlaceholder },
				{ path: 'conversation', component: Conversation },
				{ path: 'conversation/:id', component: Conversation, name: 'conversation' }
			]
		}
	]
});

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app');