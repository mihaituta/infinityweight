<template>

  <RouterLink to="/" class="link flex items-center q-electron-drag--exception">
    <q-avatar square>
      <q-img src="../../public/icons/favicon-128x128.png"/>
    </q-avatar>
    <div class="navbar-title">
      Infinity Weight
    </div>
  </RouterLink>

</template>

<script>
export default {
  name: "ToolbarTitle"
}
</script>

<style lang="scss" scoped>

.link {
  text-decoration: inherit;
}

.q-avatar {
  font-size: 1.7rem;
}

.navbar-title {
  margin-left: 0;
  padding-left: 0.8rem;
  padding-right: 0;
  font-size: 1.6rem;
  font-weight: bold;
  color: $secondary;
}

@media (min-width: $breakpoint-sm-min) {
  .q-avatar {
    font-size: 2rem;
  }

  .navbar-title {
    font-size: 1.8rem;
  }
}

@media (min-width: $breakpoint-md-min) {
  .q-avatar {
    font-size: 2rem;
  }
}

@media (min-width: $breakpoint-lg-min) {
  .q-avatar {
    font-size: 2.1rem;
  }
}

</style>
