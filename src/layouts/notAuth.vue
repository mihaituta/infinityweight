<template>
  <q-layout view="lHh Lpr fFf" class="bg-primary">
    <q-header class="q-py-sm bg-primary-400" elevated>
      <q-toolbar>
        <q-toolbar-title class="text-secondary text-h5 q-ml-md text-weight-bold">
          InfinityWeight
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>

</template>

<script>
export default {
  name: "notAuth"
}
</script>

<style scoped>

</style>
