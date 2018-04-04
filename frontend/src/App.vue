<template>
	<div id='app'>
		<c-modal :value='$store.state.errors' @input='$store.commit("setErrors", null)'>
			<div slot='main'>
				<template v-for='error in $store.state.errors'>
					{{error}}
					<br/>
				</template>
			</div>
			<div slot='footer'>
				<button class='button' @click='$store.commit("setErrors", null)'>OK</button>
			</div>
		</c-modal>

		<router-view></router-view>
	</div>
</template>

<script>

	import CModal from './components/c-modal';

export default {
	name: 'app',
	components: {
		CModal
	}
};
</script>

<style lang='scss'>
	@import './assets/scss/variables.scss';
	@import './assets/scss/elements.scss';
	@import './assets/scss/transitions.scss';

	@import url('https://fonts.googleapis.com/css?family=Fira+Sans:300,400,500');

	* {
		box-sizing: border-box;
	}

	html, body, #app {
		color: $text-primary;
		font-family: $font-family;
		height: 100%;
		margin: 0;
		padding: 0;
		width: 100%;
	}
</style>
