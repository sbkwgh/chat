<template>
	<c-modal :value='value' @input='e => { $emit("input", e) }'>
		<div slot='main'>
			<slot></slot>
		</div>
		<div slot='footer'>
			<button class='button' :class='buttonClass' @click='$emit("input", false); $emit("confirm")'>
				{{buttonText}}
			</button>
			<button class='button' @click='$emit("input", false)'>Cancel</button>
		</div>
	</c-modal>
</template>

<script>
	import CModal from './c-modal';

	export default {
		name: 'c-prompt-modal',
		props: ['value', 'button-text', 'color'],
		components: { CModal },
		computed: {
			buttonClass () {
				if(this.color) {
					return 'button--' + this.color;
				} else {
					return '';
				}
			}
		}
	}
</script>