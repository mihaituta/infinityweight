<template>
  <q-layout view="lHh Lpr fFf" class="bg-primary">
    <q-header class="bg-primary-400" elevated>
      <q-toolbar>
        <q-toolbar-title class="text-secondary text-h5 q-ml-md text-weight-bold">
          InfinityWeight
        </q-toolbar-title>

        <div class="text-secondary text-h5 text-weight-bold gt-xs lt-md"> {{ pageTitle }}</div>
        <q-btn
          class="text-h5 lt-md text-secondary"
          flat
          round
          icon="menu"
          @click="toggleDrawer"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      dark
      show-if-above
      v-model="drawer"
      :breakpoint="1023"
      bordered
      no-swipe-open
      no-swipe-close
      no-swipe-backdrop
    >
      <q-scroll-area
        style="height: calc(100% - 200px); margin-top: 200px;"
        class="relative-position text-h6 text-weight-bold"
      >
        <q-list class="text-secondary no-padding">
          <q-item
            clickable
            v-ripple
            to="/"
            exact
            active-class="my-menu-link"
            @click="setPageTitle('')"
          >
            <q-item-section avatar>
              <q-icon name="home"/>
            </q-item-section>

            <q-item-section>
              Home
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/calendar"
            exact
            active-class="my-menu-link"
            @click="setPageTitle('Calendar')"
          >
            <q-item-section avatar>
              <q-icon name="edit_calendar"/>
            </q-item-section>

            <q-item-section>
              Calendar
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/chart"
            exact
            active-class="my-menu-link"
            @click="setPageTitle('Chart')"
          >
            <q-item-section avatar>
              <q-icon name="bar_chart"/>
            </q-item-section>

            <q-item-section>
              Chart
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            to="/history"
            exact active
            active-class="my-menu-link"
            @click="setPageTitle('History')"
          >
            <q-item-section avatar>
              <q-icon name="format_list_bulleted"/>
            </q-item-section>

            <q-item-section>
              History
            </q-item-section>
          </q-item>

          <q-space/>

          <q-item
            clickable
            v-ripple
            v-if="userDetails.userId"
            @click="logoutUser"
            class="absolute-bottom logout-btn"
          >
            <q-item-section avatar>
              <q-icon name="logout"/>
            </q-item-section>

            <q-item-section>
              Logout
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 200px">
        <div class="q-mx-lg absolute-bottom bg-transparent">
          <q-avatar size="100px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div v-if="userDetails.email">@{{ userDetails.email.split('@')[0] }}</div>
          <div class="text-weight-bold text-h6">{{ userDetails.name }}</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

  </q-layout>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  data() {
    return {
      drawer: false,
      pageTitle: '',
      link: '/'
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    setPageTitle(title) {
      this.pageTitle = title
    },
    ...mapActions('myStore', ['logoutUser'])
  },
  computed: {
    ...mapState('myStore', ['userDetails']),
  },
}
</script>

<style lang="scss">
.q-item {
  height: 4rem;
  padding: 0 2rem 0 2rem;

  &:hover {
    color: $primary;
    background: $secondary-300;
  }
}

.my-menu-link {
  color: $primary;
  background: $secondary;
}

@media (min-width: $breakpoint-md-min) {
  .q-header {
    padding: 0.6rem 0;
  }
}

</style>
