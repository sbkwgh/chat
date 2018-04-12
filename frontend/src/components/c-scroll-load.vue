<template>
	<div class='scroll_load' @scroll='handler'>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: 'c-scroll-load',
		props: ['position'],
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