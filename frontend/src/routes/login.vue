<template>
	<div class='login'>
		<transition name='transition-horizontal-slide' mode='out-in'>
			<form key='login' class='login__form' v-if='showLogin'>
				<label>
					<span>Username</span>
					<input class='input' type='email'>
				</label>
				<label>
					<span>Password</span>
					<input class='input' type='password'>
				</label>

				<button class='button button--blue_border'>
					Login
				</button>

				<div class='login__create_account_message'>
					Not registered?
					<span
						class='login__create_account_link'
						@click='showLogin = false'
					>
						Create an account
					</span>
				</div>
			</form>
			<form key='account' class='login__form' v-else>
				<label>
					<span>Username</span>
					<input class='input' type='email'>
				</label>
				<label>
					<span>Password</span>
					<input class='input' type='password'>
				</label>
				<label>
					<span>Confirm password</span>
					<input class='input' type='password'>
				</label>

				<button class='button button--blue_border'>
					Create account
				</button>

				<div class='login__create_account_message'>
					<span
						class='login__go_back_link'
						@click='showLogin = true'
					>
						Go back to login
					</span>
				</div>
			</form>
		</transition>
	</div>
</template>

<script>
	export default {
		name: 'login',
		data () {
			return {
				showLogin: true
			}
		}
	};
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.transition-fade-enter, .transition-fade-leave-to {
	opacity: 0;
}
.transition-fade-enter-active, .transition-fade-leave-active {
	transition: opacity 0.2s easein;
}

	.login {
		align-items: center;
		display: grid;
		height: 100%;
		justify-content: center;

		@at-root #{&}__form {
			border: thin solid $gray-3;
			border-radius: 0.25rem;
			display: grid;
			grid-row-gap: 0.5rem;
			padding: 2rem;
			width: 20rem;

			label span {
				color: $text-secondary;
				font-size: 0.85rem;	
				margin-bottom: 0.25rem;
			}

			input {
				border-radius: 0.25rem;
			}

			button {
				margin: 0.5rem 0;
			}
		}

		@at-root #{&}__create_account_message {
			color: $text-secondary;
			text-align: center;
		}
		@at-root #{&}__create_account_link {
			color: $blue-5;
			cursor: pointer;
		}
		@at-root #{&}__go_back_link {
			color: $text-secondary;
			cursor: pointer;
		}
	}
</style>