import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import VueAxios from 'vue-axios';

import App from './App';

//Routes
import Login from './routes/login';
import Index from './routes/index';
import IndexPlaceholder from './routes/index-placeholder';
import Conversation from './routes/conversation';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueAxios, axios);

const router = new VueRouter({
	mode: 'history',
	routes: [
		{ path: '/', component: Login },
		{
			path: '/app', component: Index,
			children: [
				{ path: '/', component: IndexPlaceholder },
				{ path: 'conversation/:id', component: Conversation }
			]
		}
	]
});

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');