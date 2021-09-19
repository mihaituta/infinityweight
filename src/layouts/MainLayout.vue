<template>
  <q-layout view="lHh Lpr fFf">

    <q-header bordered dark>
      <q-toolbar>

        <q-toolbar-title class="text-secondary text-h5 q-ml-md">
          InfinityWeight
        </q-toolbar-title>

        <q-btn
          class="text-h5 lt-md"
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
    >
      <q-scroll-area
        style="height: calc(100% - 200px); margin-top: 200px;"
        class="q-px-lg q-py-lg relative-position text-h6"
      >
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

          <q-space/>

          <q-item
            clickable
            v-ripple
            v-if="userDetails.userId"
            @click="logoutUser"
            class="absolute-bottom"
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
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
    ...mapActions('myStore', ['logoutUser'])
  },
  computed: {
    ...mapState('myStore', ['userDetails'])
  }
}
</script>

<style lang="scss">
.q-item {
  padding-bottom: 1.5rem;
}
</style>
