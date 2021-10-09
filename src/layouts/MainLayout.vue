<template>
  <q-layout view="lHh Lpr fFf" class="bg-primary">
    <q-header class="bg-primary-400" elevated>
      <q-toolbar>
        <q-avatar square>
          <q-img src="../../public/icons/favicon-128x128.png"/>
        </q-avatar>

        <q-toolbar-title class="navbar-title text-secondary">
          Infinity Weight
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
.q-header {
  .q-toolbar {
    padding-right: 0;
    padding-left: 1rem;

    .q-avatar {
      font-size: 1.7rem;
    }

    .navbar-title {
      padding-right: 0;
      font-size: 1.6rem;
      font-weight: bold;
    }
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
    .q-toolbar {
      .q-avatar {
        font-size: 2rem;
      }

      .navbar-title {
        font-size: 1.8rem;
      }
    }
  }
}

@media (min-width: $breakpoint-md-min) {
  .q-header {
    padding: 0.6rem 0;

    .q-toolbar {
      .q-avatar {
        font-size: 2rem;
      }

    }
  }
}

@media (min-width: $breakpoint-lg-min) {
  .q-header {
    .q-toolbar {
      .q-avatar {
        font-size: 2.1rem;
      }
    }
  }
}

</style>
