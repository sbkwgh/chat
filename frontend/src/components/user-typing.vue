<template>
	<transition name='transition-slide-up'>
		<div class='user_typing' v-if='typingUsers.length'>
			<div class='user_typing__users' v-if='users.length > 2'>{{userList}} {{typingUsers.length > 2 ? "are" : "is"}} typing</div>
			<c-loading-dots></c-loading-dots>
		</div>
	</transition>
</template>

<script>
	import CLoadingDots from './c-loading-dots';

	export default {
		name: 'user-typing',
		props: ['users', 'typing-users'],
		components: { CLoadingDots },
		computed: {
			userList () {
				return this.typingUsers
					.map(u => u.username)
					.join(', ')
					.replace(/, ([^,]*)$/, ' and $1');
			}
		}
	}
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.user_typing {
		display: flex;
		flex-direction: column;
		padding: 0.5rem 0;

		@at-root #{&}__users {
			color: $text-secondary;
			font-size: 0.85rem;
			font-weight: 300;
		}
	}
</style>