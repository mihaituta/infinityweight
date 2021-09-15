<template>
  <q-page class="flex q-pa-md">
    <q-card class="full-width">
      <q-tabs
        v-model="tab"
        class="text-primary"
        active-color="secondary"
        indicator-color="secondary"
        align="justify"
      >
        <q-tab name="login" label="Login"/>
        <q-tab name="register" label="Register"/>
      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab" animated>

        <q-tab-panel name="login">
          <auth-form :tab="tab"/>
        </q-tab-panel>

        <q-tab-panel name="register">
          <auth-form :tab="tab"/>
        </q-tab-panel>

      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      tab: 'login'
    }
  },
  components: {
    'auth-form': require('components/AuthForm').default
  }
}
</script>

<style scoped>

</style>
