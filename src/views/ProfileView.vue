<script setup>
import ProfileCard from "./../components/ProfileCard.vue"
import LastBattlesCard from "./../components/LastBattlesCard.vue"
import AchievementsCard from "./../components/AchievementsCard.vue"
</script>

<template>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 py-10 px-10 ml-20
				dark:bg-slate-800">
		<ProfileCard />
		<LastBattlesCard />
		<AchievementsCard />
	</div>
</template>