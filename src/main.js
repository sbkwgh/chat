import Vue from 'vue';
import VueRouter from 'vue-router';

import App from './App';

//Routes
import Conversation from './routes/conversation';

Vue.config.productionTip = false;
Vue.use(VueRouter);

const router = new VueRouter({
	routes: [
		{ path: '/conversation/:id', component: Conversation }
	]
});

new Vue({
	router,
	render: h => h(App)
}).$mount('#app');