<template>
  <q-layout view="lHh Lpr fFf" class="bg-primary">
    <q-pull-to-refresh @refresh="refresh" no-mouse color="primary" bg-color="secondary">
      <q-header class="bg-primary-400" elevated>
        <electron-toolbar/>
        <q-toolbar class="bg-primary-400 electron-hide">
          <toolbar-title/>

          <q-space/>
          <div class="menu-label text-secondary text-weight-bold gt-xs lt-md"> {{ pageTitle }}</div>
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
        class="bg-primary-400"
        show-if-above
        v-model="drawer"
        :breakpoint="1023"
        elevated
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
              active-class="menu-link"
              @click="setPageTitle('Home')"
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
              active-class="menu-link"
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
              active-class="menu-link"
              @click="setPageTitle('Chart')"
            >
              <q-item-section avatar>
                <q-icon name="bar_chart"/>
              </q-item-section>

              <q-item-section>
                Chart
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

        <q-img class="absolute-top" src="../assets/avatar-bg2.jpg" style="height: 200px">
          <div class="avatar-texts q-mx-lg q-mt-xs full-height bg-transparent">
            <q-avatar size="130px" class="q-mb-xs">
              <img src="../assets/avatar.jpg" alt="avatar_img"/>
            </q-avatar>
            <div v-if="userDetails.email" class="avatar-mail text-weight-bold">
              @ {{ userDetails.email.split('@')[0] }}
            </div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <router-view/>
      </q-page-container>
    </q-pull-to-refresh>
  </q-layout>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  data() {
    return {
      drawer: false,
      pageTitle: 'Home',
      link: '/'
    }
  },
  methods: {
    ...mapActions('myStore', ['logoutUser']),
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    setPageTitle(title) {
      this.pageTitle = title
    },
    refresh(done) {
      setTimeout(() => {
        window.location.reload()
        done()
      }, 1000)

    }
  },
  computed: {
    ...mapState('myStore', ['userDetails']),
  },
  components: {
    'electron-toolbar': require('components/ElectronToolbar').default,
    'toolbar-title': require('components/ToolbarTitle').default
  },
}
</script>

<style lang="scss" scoped>
.q-header {
  .q-toolbar {
    padding-right: 0;
    padding-left: 1rem;
  }

  .navbar-title {
    padding-left: 0.8rem;
    padding-right: 0;
    font-size: 1.6rem;
    font-weight: bold;
    color: $secondary;
  }

  .q-avatar {
    font-size: 1.7rem;
  }
}

.q-drawer {
  background-color: $primary-400;

  .q-img {
    .avatar-texts {
      padding-bottom: 0.3rem;

      .avatar-mail {
        font-size: 1.4rem;
      }
    }
  }

  .q-item {
    height: 5rem;
    padding: 0 2rem 0 2rem;

    &:hover {
      color: $primary;
      background: $secondary-300;
    }

    .menu-link {
      color: $primary;
      background: $secondary;
    }
  }
}

@media (min-width: $breakpoint-sm-min) {
  .q-header {
    .q-avatar {
      font-size: 2rem;
    }

    .navbar-title {
      font-size: 1.8rem;
    }

    .menu-label {
      font-size: 1.8rem;
    }
  }
}

@media (min-width: $breakpoint-md-min) {
  .q-header {
    .q-toolbar {
      padding: 0.9rem 0 0.9rem 1rem;
    }

    .q-avatar {
      font-size: 2rem;
    }
  }
}

@media (min-width: $breakpoint-lg-min) {
  .q-header {
    .q-bar {
      padding: 2.3rem 1.2rem 2.3rem 1.5rem;
    }

    .q-toolbar {
      padding-left: 1.5rem;
    }

    .q-avatar {
      font-size: 2.1rem;
    }
  }
}

</style>
