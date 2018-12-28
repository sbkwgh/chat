<template>
	<div
		class='c_modal'
		:class='{ "c_modal--show": value }'
		@click.self='$emit("input", false)'
	>
		<div
			class='c_modal__window'
			:class='{ "c_modal__window--show": value }'
			:style='{ "width": width || "20rem" }'
		>
			<div class='c_modal__main'>
				<slot name='main'></slot>
			</div>
			<div class='c_modal__footer'>
				<slot name='footer'></slot>
			</div> 
		</div>
	</div>
</template>

<script>
	export default {
		name: 'c-modal',
		props: ['value', 'width']
	}
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.c_modal {
		align-items: center;
		background-color: rgba($gray-5, 0.5);
		display: grid;
		grid-template-rows: auto 2rem;
		height: 100%;
		justify-content: center;
		left: 0;
		padding-top: 2rem;
		opacity: 0;
		overflow-y: auto;
		pointer-events: none;
		position: fixed;
		top: 0;
		transition: opacity 0.2s;
		width: 100%;
		z-index: 4;

		&::after {
			content: '';
			height: 2rem;
		}

		@at-root #{&}--show {
			opacity: 1;
			pointer-events: all;
		}

		@at-root #{&}__window {
			background-color: #fff;
			border-radius: 0.25rem;
			transform: scale(1.1);
			transition: transform 0.2s, box-shadow 0.2s;

			@at-root #{&}--show {
				transform: scale(1);
				box-shadow: 0 0 1rem rgba($gray-5, 0.5), 0 1rem 1rem rgba($gray-5, 0.25);
			}
		}
		@at-root #{&}__main {
			font-weight: 300;
			font-size: 0.9rem;
			padding: 1rem;
		}
		@at-root #{&}__footer {
			align-items: center;
			background-color: $gray-1;
			border-radius: 0 0 0.25rem 0.25rem;
			display: flex;
			justify-content: flex-end;
			padding: 0.5rem 1rem;
			width: 100%;

			button {
				margin-left: 0.5rem;
			}
		}
	}
</style>