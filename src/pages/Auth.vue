<template>
  <q-page class="flex q-pa-lg">
    <q-card dark class="full-width">
      <q-tabs
        dark
        v-model="tab"
        active-color="secondary"
        indicator-color="secondary"
        class="auth-tabs"
      >
        <q-tab name="login" label="Login"/>
        <q-tab name="register" label="Register"/>
      </q-tabs>

      <q-separator/>

      <q-tab-panels
        dark
        v-model="tab"
        animated
        swipeable
      >
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

<style>
.auth-tabs .q-tab__label {
  font-size: 1.2rem;
}
</style>
