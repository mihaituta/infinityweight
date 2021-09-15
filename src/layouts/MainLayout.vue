<template>
  <q-layout view="lHh Lpr fFf" class="bg-primary">

    <q-header bordered class="bg-primary">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>

        <q-toolbar-title class="text-secondary">
          <!--          <q-avatar>-->
          <!--            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">-->
          <!--          </q-avatar>-->
          InfinityWeight
        </q-toolbar-title>

        <q-btn
          v-if="userDetails.userId"
          @click="logoutUser"
          color="secondary"
          icon="logout"
          label="Logout"
          dense
          class="q-px-md q-py-sm"
        >
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      :width="300"
      :breakpoint="400"
      class="bg-dark"
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px;">
        <q-list padding class="text-secondary">
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="edit_calendar"/>
            </q-item-section>

            <q-item-section>
              Calendar
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="bar_chart"/>
            </q-item-section>

            <q-item-section>
              Graph
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="format_list_bulleted"/>
            </q-item-section>

            <q-item-section>
              List
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="60px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">Mihai Tuta</div>
          <div>@tutamihai</div>
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
      leftDrawerOpen: false,
    }
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    ...mapActions('myStore', ['logoutUser'])
  },
  computed: {
    ...mapState('myStore', ['userDetails'])
  }
}
</script>
