import io from 'socket.io-client';

export default {
	install (Vue) {
		Vue.prototype.$io = io('http://localhost:8080');
	}
};