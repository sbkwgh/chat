<template>
	<div class='conversation_time_break' v-if='showDate'>
		{{formattedDate}}
	</div>
</template>

<script>
	export default  {
		name: 'conversation-time-break',
		props: ['message', 'previous'],
		computed: {
			formattedDate () {
				let date = new Date(this.message.createdAt);

				let beginningOfToday = new Date();
				    beginningOfToday.setMilliseconds(0);
				    beginningOfToday.setSeconds(0);
				    beginningOfToday.setMinutes(0);
				    beginningOfToday.setHours(0);
				let beginningOfYesterday = new Date(beginningOfToday - 24*60*60*1000);
				let timeString = date.toTimeString().slice(0, 5);

				if(date - beginningOfToday >= 0) {
					return timeString;
				} else if(date - beginningOfYesterday >= 0) {
					return 'Yesterday at ' + timeString;
				} else {
					return date.toLocaleDateString() + ' at ' + timeString;
				}
			},
			showDate () {
				if(!this.previous) {
					return true;
				} else {
					let date = new Date(this.message.createdAt);
					let prev = new Date(this.previous.createdAt);

					//Greater than 30 minutes difference
					return !prev || (date - prev) > 1000*60*30;
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	@import '../assets/scss/variables.scss';

	.conversation_time_break {
		color: $text-secondary;
		cursor: default;
		font-size: 0.85rem;
		text-align: center;
		user-select: none;
		width: 100%;
	}
</style>