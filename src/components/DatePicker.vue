<template>
  <q-btn class="dateBtn" padding="none" icon="event" flat color="secondary" :label="dateNow">
    <q-popup-proxy @before-show="updateProxy" transition-show="scale" transition-hide="scale">
      <q-date
        today-btn
        dark
        no-unset
        color="secondary"
        mask="DD-MM-YYYY"
        :options="dateOptions"
        v-model="proxyDate"
      >
        <div class="row items-center justify-end q-gutter-sm">
          <q-btn label="Close" color="negative" v-close-popup/>
          <q-btn label="Save" color="secondary" @click="saveDate" v-close-popup/>
        </div>
      </q-date>
    </q-popup-proxy>
  </q-btn>
</template>

<script>
import {date} from "quasar";

export default {
  name: "DatePicker",
  props: ['action', 'date'],
  data() {
    return {
      dateNow: this.action.toLowerCase() === 'add'
        ? date.formatDate(Date.now(), 'DD-MM-YYYY')
        : date.formatDate(this.date, 'DD-MM-YYYY'),

      proxyDate: this.action.toLowerCase() === 'add'
        ? date.formatDate(Date.now(), 'DD-MM-YYYY')
        : date.formatDate(this.date, 'DD-MM-YYYY'),
    }
  },
  methods: {
    updateProxy() {
      this.proxyDate = this.dateNow
    },
    saveDate() {
      this.dateNow = this.proxyDate
      this.$emit('setDate', this.dateNow)
    },
    dateOptions(targetDate) {
      // restrict user to not log weight in future dates (only <= 'today')
      return targetDate <= date.formatDate(Date.now(), 'YYYY/MM/DD')
    },
  }
}
</script>

<style scoped lang="scss">
.dateBtn {
  font-size: 1.1rem;
}
</style>
