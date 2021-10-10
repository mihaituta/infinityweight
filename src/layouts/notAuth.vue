<template>
  <q-layout view="lHh Lpr fFf" class="bg-primary">
    <q-header class="q-py-sm bg-primary-400" elevated>
      <electron-toolbar/>

      <q-toolbar class="electron-hide">
        <toolbar-title/>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>

</template>

<script>
export default {
  name: "notAuth",
  components: {
    'electron-toolbar': require('components/ElectronToolbar').default,
    'toolbar-title': require('components/ToolbarTitle').default
  },
}
</script>

<style scoped>

</style>
