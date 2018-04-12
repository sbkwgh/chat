<template>
	<div class='scroll_load' @scroll='handler'>
		<c-loading-icon v-if='position === "top" && loading'></c-loading-icon>
		<slot></slot>
		<c-loading-icon v-if='position === "bottom" && loading'></c-loading-icon>
	</div>
</template>

<script>
	import CLoadingIcon from '../components/c-loading-icon';

	export default {
		name: 'c-scroll-load',
		props: ['position', 'loading'],
		components: { CLoadingIcon },
		methods: {
			handler (e) {
				let $el = e.target;
				let height = $el.scrollHeight - $el.scrollTop - 16 <= $el.clientHeight;

				if(
					(this.position === 'top' && $el.scrollTop < 16) ||
					(this.position === 'bottom' && height)
				) {
					this.$emit('load');
				}
			}
		}
	};
</script>