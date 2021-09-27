<template>
  <q-btn
    round
    class="fixed-bottom-right q-mr-md q-mb-md"
    color="secondary"
    size="lg"
    push
    icon="add"
    @click="openModal = true"
  ></q-btn>

  <q-dialog v-model="openModal">
    <q-card class="q-px-md wid" dark style="width: 400px; max-width: 90vw;">
      <q-form
        @submit="onSubmit"
      >
        <q-card-section class="row items-center q-px-none q-pb-none">
          <div v-if="action.toLowerCase() === 'add'" class="text-h6 text-capitalize">{{ action }} weight</div>
          <date-picker @setDate="setDate($event)" v-else-if="action.toLowerCase() === 'update'"/>
          <q-space/>
          <q-btn icon="close" flat round dense @click="onClose" v-close-popup/>
        </q-card-section>

        <q-card-section class="q-pa-none q-my-lg">
          <q-input
            dark
            filled
            class="form-input"
            color="secondary"
            v-model="weight"
            placeholder="Weight"
            suffix="kg"
          >
            <template v-slot:prepend>
              <q-icon name="monitor_weight"/>
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions class="q-pa-none q-mb-md">
          <date-picker @setDate="setDate($event)" v-if="action.toLowerCase() === 'add'"/>
          <q-btn size="md" v-else-if="action.toLowerCase() === 'update'" color="negative" label="Delete" v-close-popup/>

          <q-space/>

          <q-btn color="negative" label="Close" @click="onClose" v-close-popup/>
          <q-btn color="secondary" type="submit" v-close-popup :label="action"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

</template>

<script>
import DatePicker from "components/DatePicker";
import {date} from "quasar";
import {mapActions, mapGetters} from "vuex";

export default {
  components: {DatePicker},
  props: ['action'],
  data() {
    return {
      openModal: false,
      dateModal: false,
      weight: '',
      date: new Date()
    }
  },
  methods: {
    ...mapActions('myStore', ['addWeight']),

    resetFields() {
      if (this.weights.length !== 0) {
        this.weight = this.weights[0].weight
      } else {
        this.weight = ''
      }
      this.date = new Date()
    },

    // called from DatePicker to send the selected date from the calendar
    setDate(d) {
      this.date = date.extractDate(d, 'DD-MM-YYYY')
    },

    onSubmit() {
      // this.weight = Math.floor(parseFloat(this.weight) * 10) / 10
      const weightData = {
        weight: parseFloat(this.weight),
        date: this.date
      }
      this.addWeight(weightData).then(() => this.resetFields())
    },

    onClose() {
      this.resetFields()
    },

    weightRules($e) {
      // v-on:keypress="weightRules"
      let keyCode = $e.keyCode
      // weight cannot start with 0 or .
      if (this.weight.length === 0 && (keyCode === 46 || keyCode === 48)) {
        $e.preventDefault()
      }

      // only allow number and one dot
      if (this.weight !== null && (keyCode < 48 || keyCode > 57) && (keyCode !== 46 || this.weight.indexOf('.') !== -1)) { // 46 is dot
        $e.preventDefault()
      }

      // restrict weight to max 3 digits and allow to add a . to add decimals
      if (this.weight != null && keyCode === 46 && this.weight.length >= 3) {
        return true;
      } else if (this.weight != null && this.weight.length >= 3 && this.weight.indexOf('.') === -1) {
        $e.preventDefault()
      }

      //restrict to only 1 decimal
      if ((this.weight != null && this.weight.indexOf('.') > -1 && (this.weight.split('.')[1].length >= 1))) {
        $e.preventDefault()
      }
    },
  },

  computed: {
    ...mapGetters('myStore', ['weights']),
  },

  // set the default weight in modal as the most recent logged date by the user
  mounted() {
    if (this.weights.length !== 0) this.weight = this.weights[0].weight
  },
  watch: {
    weight() {
      // 1st replace = only allow numbers and dot, can't start with dot or 0
      // 2nd replace = can only have 1 dot, max 4 chars, only 1 decimal
      this.weight = this.weight.replace(/[^0-9.]|^0|^\./g, '').replace(/(\.){2,}|(\d{4}).|(\.\d)./g, '$1 $2 $3')
    },
  }
}
</script>

<style scoped>

</style>
