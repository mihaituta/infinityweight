<template>
  <q-bar class="q-electron-drag electron-only bg-primary-400">
    <toolbar-title/>
    <q-space/>
    <q-btn color="secondary" size="md" dense flat icon="remove" @click="minimize"/>
    <q-btn color="secondary" size="md" dense flat icon="crop_square" @click="toggleMaximize"/>
    <q-btn color="secondary" size="md" dense flat icon="close" @click="closeApp"/>
  </q-bar>
</template>

<script>
export default {
  name: "ElectronToolbar",
  methods: {
    minimize() {
      if (process.env.MODE === 'electron') {
        window.myWindowAPI.minimize()
      }
    },

    toggleMaximize() {
      if (process.env.MODE === 'electron') {
        window.myWindowAPI.toggleMaximize()
      }
    },

    closeApp() {
      if (process.env.MODE === 'electron') {
        window.myWindowAPI.close()
      }
    }
  },
  components: {
    'toolbar-title': require('components/ToolbarTitle').default
  }
}
</script>

<style lang="scss" scoped>
.q-bar {
  padding: 2.3rem 0.5rem 2.3rem 1rem;
}

@media (min-width: $breakpoint-lg-min) {
  .q-bar {
    padding: 2.3rem 1.2rem 2.3rem 1.5rem;
  }

}
</style>
