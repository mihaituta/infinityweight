<template>
  <q-page class="auth-page flex justify-center q-pa-lg">
    <q-card class="auth-card shadow-10" dark>
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

<style lang="scss">
.auth-tabs .q-tab__label {
  font-size: 1.2rem;
}

@media (min-width: $breakpoint-sm-min) {
  .auth-page {
    align-items: center;

    .auth-card {
      min-height: 45rem;

      .q-tab-panels {
        margin-top: 3rem;
      }
    }
  }
}
</style>
