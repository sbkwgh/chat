<template>
	<div class='conversation_time_break'>
		{{formattedDate}}
	</div>
</template>

<script>
	export default  {
		name: 'conversation-time-break',
		props: ['date'],
		computed: {
			formattedDate () {
				let beginningOfToday = new Date();
				    beginningOfToday.setMilliseconds(0);
				    beginningOfToday.setSeconds(0);
				    beginningOfToday.setMinutes(0);
				    beginningOfToday.setHours(0);
				let beginningOfYesterday = new Date(beginningOfToday - 24*60*60*1000);
				let timeString = this.date.toTimeString().slice(0, 5);

				if(this.date - beginningOfToday >= 0) {
					return timeString;
				} else if(this.date - beginningOfYesterday >= 0) {
					return 'Yesterday at ' + timeString;
				} else {
					return this.date.toLocaleDateString() + ' at ' + timeString;
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