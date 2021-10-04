<template>
  <q-form
    @submit="onSubmit"
    greedy
    class="auth-form"
  >
    <h1 class="text-center text-capitalize">
      {{ tab }}
    </h1>
    <q-input
      dark
      v-if="tab === 'register'"
      class="form-input q-mb-md"
      filled
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
      dark
      filled
      class="form-input q-mb-md"
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
      dark
      filled
      class="form-input q-mb-md"
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

    <q-btn
      :label="tab"
      type="submit"
      class="form-btn bg-secondary q-px-xl q-py-sm text-weight-bold full-width"
    />

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
        email: 'test@gmail.com',
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

<style lang="scss">
.form-btn {
  font-size: 1.2rem;
}

.form-input {
  font-size: 1.2rem;
}

.auth-form {
  h1 {
    font-size: 2.7rem;
  }
}

</style>
