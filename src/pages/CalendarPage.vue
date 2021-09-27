<template>
  <q-date
    v-model="date"
    dark
    bordered
  />
</template>

<script>
export default {
  name: "CalendarPage"
}
</script>

<style scoped lang="scss">
  .q-date{
    width: auto;
  }
</style>
