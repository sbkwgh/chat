<template>
	<div class='c_menu'>
		<div
			class='c_menu__slot'
			:class='{ "c_menu__slot--show": showMenu }'
			@click='showMenu = true'
			ref='slot'
		>
			<slot></slot>
		</div>
		<div
			class='c_menu__menu'
			:style='{ "left": left }'
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
				showMenu: false,
				left: 'calc(50% - 1rem)'
			}
		},
		mounted () {
			let rect = this.$refs.slot.getBoundingClientRect();
			let rem = 16;

			if(rect.right + 10*rem + 0.5*rem > window.innerWidth) {
				this.left = 'calc(50% - 8.5rem)';
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

			&:after, &:before {
				bottom: calc(100% - 0.5rem - 1px);
				left: 50%;
				border: solid transparent;
				content: ' ';
				height: 0;
				width: 0;
				opacity: 0;
				position: absolute;
				pointer-events: none;
				z-index: 4;
			}
			&:after {
				border-color: rgba(255, 255, 255, 0);
				border-bottom-color: #fff;
				border-width: 8px;
				margin-left: -8px;
				transition: opacity 0.2s, bottom 0.2s;
			}

			&:before {
				border-color: rgba(84, 84, 84, 0);
				border-bottom-color: #545454;
				border-width: 9px;
				margin-left: -9px;
				transition: opacity 0.05s, bottom 0.2s;
			}

			@at-root #{&}--show:before, #{&}--show:after {
				bottom: calc(100% - 1.5rem - 1px);
				opacity: 1;
			}
			@at-root #{&}--show:before {
				transition: opacity 0.25s, bottom 0.2s;
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