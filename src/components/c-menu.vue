<template>
	<div class='c_menu'>
		<div
			class='c_menu__slot'
			:class='{ "c_menu__slot--show": showMenu }'
			@click='showMenu = true'
		>
			<slot></slot>
		</div>
		<div
			class='c_menu__menu'
			:class='{ "c_menu__menu--show": showMenu }'
		>
			<div
				class='c_menu__item'
				v-for='item in items'
				@click='showMenu = false; $emit(item.event)'
			>
				{{item.text}}
			</div>
		</div>
		<div
			class='c_menu__overlay'
			:class='{ "c_menu__overlay--show": showMenu }'
			@click='showMenu = false'
		></div>
	</div>
</template>

<script>
	export default {
		name: 'c-menu',
		props: ['items'],
		data () {
			return {
				showMenu: false
			}
		}
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.c_menu {
		position: relative;

		@at-root #{&}__slot {
			cursor: pointer;

			&::before, &::after {
				content: '';
				height: 0;
				margin-top: -0.5rem;
				opacity: 0;
				position: absolute;
				transition: opacity 0.2s, margin-top 0.2s;
				width: 0;
			}

			@at-root #{&}--show::before, #{&}--show::after {
				margin-top: 0;
				opacity: 1;
			}

			&::before {
				border-bottom: solid 0.5rem $gray-2;
				border-left: solid 0.5rem transparent;
				border-right: solid 0.5rem transparent;
				left: calc(50% - 0.5rem);
				top: calc(100% - 0.2rem + 1px);
			}

			&::after {
				border-bottom: solid calc(0.5rem - 1px) #fff;
				border-left: solid calc(0.5rem - 0.75px) transparent;
				border-right: solid calc(0.5rem - 0.75px) transparent;
				left: calc(50% - 0.5rem + 1px);
				top: calc(100% - 0.2rem + 2px);
				z-index: 4;
			}
		}

		@at-root #{&}__overlay {
			height: 100%;
			left: 0;
			pointer-events: none;
			position: fixed;
			top: 0;
			width: 100%;
			z-index: 2;

			@at-root #{&}--show {
				pointer-events: all;
			}
		}
		@at-root #{&}__menu {
			background-color: #fff;
			border: 1px solid $gray-2;
			border-radius: 0.25rem;
			box-shadow: 0 0.25rem 0.25rem rgba(0, 0, 0, 0.2);
			left: calc(-100% - 2.5rem);
			margin-top: -0.5rem;
			opacity: 0;
			overflow: hidden;
			padding: 0.25rem 0;
			pointer-events: none;
			position: absolute;
			top: calc(100% + 0.25rem);
			transition: margin-top 0.2s, opacity 0.2s;
			width: 10rem;
			z-index: 3;

			@at-root #{&}--show {
				margin-top: 0;
				pointer-events: all;
				opacity: 1;
			}
		}
		@at-root #{&}__item {
			cursor: default;
			padding: 0.5rem 1rem;
			transition: background-color 0.2s;

			&:hover {
				background-color: $gray-hover;
			}
			&:active {
				background-color: $gray-0;
			}
		}
	}
</style>