<template>
	<div class='login'>
		<div class='login__container login__container--hero'>
			<div class='login__hero'>
				<div>
					<h1>Hey!</h1>
					<p>Make an account or log in to start chatting</p>
				</div>
			</div>
		</div>

		<div class='login__container'>
			<transition name='transition-horizontal-slide' mode='out-in'>
			<form key='login' class='login__form' @submit.prevent='doLogin' v-if='showLogin'>
				<label class='label'>
					<span>Username</span>
					<input class='input' v-model='login.username'>
					<span class='error' v-if='login.errors.username'>
						{{login.errors.username}}
					</span>
				</label>
				<label class='label'>
					<span>Password</span>
					<input class='input' type='password' v-model='login.password'>
					<span class='error' v-if='login.errors.hash'>
						{{login.errors.hash}}
					</span>
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
			<form key='account' class='login__form' @submit.prevent='create' v-else>
				<label class='label'>
					<span>Username</span>
					<input class='input' v-model='createAccount.username'>
					<span class='error' v-if='createAccount.errors.username'>
						{{createAccount.errors.username}}
					</span>
				</label>
				<label class='label'>
					<span>Password</span>
					<input class='input' type='password' v-model='createAccount.password'>
					<span class='error' v-if='createAccount.errors.hash'>
						{{createAccount.errors.hash}}
					</span>
				</label>
				<label class='label'>
					<span>Confirm password</span>
					<input class='input' type='password' v-model='createAccount.confirmPassword'>
					<span class='error' v-if='createAccount.errors.confirmPassword'>
						{{createAccount.errors.confirmPassword}}
					</span>
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
	</div>
</template>

<script>
	export default {
		name: 'login',
		data () {
			return {
				showLogin: true,

				login: {
					username: '',
					password: '',

					errors: {
						username: null,
						hash: null
					}
				},

				createAccount: {
					username: '',
					password: '',
					confirmPassword: '',

					errors: {
						username: null,
						hash: null,
						confirmPassword: null
					}
				}
			}
		},
		methods: {
			setErrors (form, params) {
				let errorsExist = false;

				for(let key in this[form].errors) {
					if(!params || !params[key]) {
						this[form].errors[key] = null;
					} else {
						this[form].errors[key] = params[key];
						errorsExist = true;
					}
				}

				return errorsExist;
			},
			setApiErrors (form, errors) {
				let formErrors = {};
				let alertErrors = [];

				for(let error of errors) {
					let path = error.path;
					let message = error.message;

					if(path && this[form].errors[path] !== undefined) {
						formErrors[path] = message;
					} else {
						alertErrors.push(error);
					}
				}

				this.setErrors(form, formErrors);
				this.$store.commit('setErrors', alertErrors);
				return alertErrors;
			},
			create () {
				let username = this.createAccount.username.trim();
				let password = this.createAccount.password;
				let confirmPassword = this.createAccount.confirmPassword;

				let errors = {};
				if(!username.length) {
					errors.username = 'Username can\'t be empty';
				} if(password !== confirmPassword) {
					errors.confirmPassword = 'Passwords don\'t match';
				} if(password.length < 8) {
					errors.hash = 'Password must be at least 8 characters'
				}
				if (this.setErrors('createAccount', errors)) return;

				this.axios
					.post('/api/user', { username, password })
					.then(res => {
						this.$store.commit('setUser', res.data);
						this.$router.push('app');

						//Disconnect and reconnect to refresh session
						this.$io.close();
						this.$io.connect();
					})
					.catch(res => {
						let errors = res.response.data.errors;
						this.setApiErrors('createAccount', errors);
					});
			},
			doLogin () {
				let username = this.login.username.trim();
				let password = this.login.password;

				let errors = {};
				if(!username.length) {
					errors.username = 'Username can\'t be empty';
				} if(!password.length) {
					errors.hash = 'Password can\'t be empty';
				}
				if (this.setErrors('login', errors)) return;

				this.axios
					.post('/api/user/login', { username, password })
					.then(res => {
						this.$store.commit('setUser', res.data);
						this.$router.push('app');

						//Disconnect and reconnect to refresh session
						this.$io.close();
						this.$io.connect();
					})
					.catch(res => {
						let errors = res.response.data.errors;
						this.setApiErrors('login', errors);
					});
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
		grid-template-columns: auto 40rem;
		height: 100%;

		@at-root #{&}__hero {
			align-items: center;
			background: rgb(17,86,191);
			background: linear-gradient(158deg, rgba(17,86,191,0.9) 0%, rgba(33,150,243,0.9) 71%, rgba(69,223,196,0.9) 100%); 
			color: #fff;
			display: flex;
			flex-direction: column;
			justify-content: center;
			width: 100%;

			h1 {
				font-size: 3rem;
				margin-bottom: 0;
			}
			p {
				font-size: 1.25rem;
			}
		}

		@at-root #{&}__container {
			display: flex;
			justify-content: center;

			@at-root #{&}--hero {
				align-self: stretch;
			}
		}

		@at-root #{&}__form {
			display: grid;
			grid-row-gap: 0.5rem;
			padding: 2rem;
			width: 20rem;

			label span {
				color: $text-secondary;
				font-size: 0.85rem;	
				margin-bottom: 0.25rem;
			}
			label span.error {
				color: $red-4;
				font-weight: 300;
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