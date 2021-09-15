<template>
  <q-form
    @submit="onSubmit"
    class=""
  >
    <q-input
      v-if="tab === 'register'"
      class="q-mb-md"
      standard
      color="secondary"
      v-model="formData.name"
      label="Name"
      ondemand
      :rules="[ val => val && val.length > 0 || 'Name is required']"
    >
      <template v-slot:prepend>
        <q-icon name="person"/>
      </template>
    </q-input>

    <q-input
      standard
      class="q-mb-md"
      color="secondary"
      type="email"
      v-model="formData.email"
      label="Email"
      ondemand
      :rules="[ val => val && val.length > 0 || 'Email is required']"
    >
      <template v-slot:prepend>
        <q-icon name="mail"/>
      </template>
    </q-input>

    <q-input
      standard
      class="q-mb-md"
      color="secondary"
      v-model="formData.password"
      label="Password"
      :type="isPwd ? 'password' : 'text'"
      ondemand
      :rules="[ val => val && val.length > 0 || 'Password is required.']"
    >
      <template v-slot:prepend>
        <q-icon name="lock"/>
      </template>
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>

    <div>
      <q-btn
        :label="tab"
        type="submit"
        color="secondary"/>
    </div>
  </q-form>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  props: ['tab'],
  data() {
    return {
      isPwd: true,
      formData: {
        name: '',
        email: '1@gmail.com',
        password: '123123'
      }
    }
  },
  methods: {
    ...mapActions('myStore', ['registerUser', 'loginUser']),
    onSubmit() {
      if (this.tab === 'login') {
        this.loginUser(this.formData)
      } else {
        this.registerUser(this.formData)
      }
    }
  },
}
</script>

<style scoped>

</style>
