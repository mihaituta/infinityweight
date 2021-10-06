<template>
  <q-btn
    v-if="action.toLowerCase() === 'add'"
    round
    class="fixed-bottom-right q-mr-md q-mb-md lt-sm z-top"
    color="secondary"
    size="xl"
    push
    icon="add"
    @click="openModal = true"
  ></q-btn>

  <q-btn
    v-if="action.toLowerCase() === 'add'"
    class="desktop-add-btn q-my-md gt-xs"
    color="secondary"
    push
    label="Add new weight"
    icon="add"
    @click="openModal = true"
  ></q-btn>

  <q-dialog
    @hide="onClose"
    @before-show="onShow"
    v-model="openModal">
    <q-card class="q-px-md wid" dark style="width: 400px; max-width: 90vw;">
      <q-form
        @submit="onSubmit"
      >
        <q-card-section class="row q-px-none q-mb-sm">
          <div v-if="action.toLowerCase() === 'add'" class="text-h6 text-capitalize text-secondary">
            {{ action }} weight
          </div>
          <div
            v-else-if="action.toLowerCase() === 'update'"
            class="updateDateDisplay flex items-center"
          >
            <q-icon name="event" size="sm" class="q-pr-sm"/>
            {{ this.updateDate }}
          </div>
          <q-space/>
          <q-btn icon="close" flat round dense v-close-popup/>
        </q-card-section>

        <q-card-section class="q-pa-none q-my-sm">
          <q-input
            dark
            filled
            class="weightInput"
            color="secondary"
            v-model="weight"
            placeholder="Weight"
            suffix="kg"
            :rules="[ val => val && val.length > 0 || 'Weight is required!']"
          >
            <template v-slot:prepend>
              <q-icon name="monitor_weight"/>
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions class="q-pa-none q-mb-md">
          <date-picker
            @setDate="setDate($event)"
            action='add'
            v-if="action.toLowerCase() === 'add'"
          />

          <q-btn
            v-else-if="action.toLowerCase() === 'update'"
            class="deleteBtn"
            color="negative"
            label="Delete"
            v-on:click="onDelete"
            v-close-popup
          />
          <q-space/>
          <q-btn class="actionModalBtns" color="negative" label="Close" v-close-popup/>
          <q-btn class="actionModalBtns" color="secondary" type="submit" :label="action"/>
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
  emits: ["closeUpdateModal"],
  props: ['action', 'open', 'weightData'],
  data() {
    return {
      openModal: false,
      dateModal: false,
      weight: '',
      date: new Date(),
      updateDate: ''
    }
  },
  methods: {
    ...mapActions('myStore', ['addWeight', 'updateWeight', 'deleteWeight', 'populateDb']),

    resetFields() {
      if (this.action.toLowerCase() === 'add') {
        if (this.weights.length !== 0) {
          this.weight = this.weights[0].weight
        } else {
          this.weight = ''
        }
        this.date = new Date()
      } else {
        this.weight = ''
        // this.date = ''
      }
    },

    // called from DatePicker to send the selected date from the calendar
    setDate(selectedDate) {
      this.date = date.extractDate(selectedDate, 'DD MMM YYYY')
    },

    closeModal() {
      this.$emit('closeUpdateModal')
    },

    onSubmit() {
      // this.weight = Math.floor(parseFloat(this.weight) * 10) / 10
      const weightChanged = {
        id: this.action.toLowerCase() === 'update' ? this.weightData.id : null,
        weight: parseFloat(this.weight),
        date: new Date(this.date.setHours(0, 0, 0, 0))
      }

      if (this.action.toLowerCase() === 'add') {
        this.addWeight(weightChanged)
        // this.populateDb()
      } else {
        // if weight data is unchanged, no update is required
        if (this.weightData.id === weightChanged.id && this.weightData.date === this.date && this.weightData.weight === this.weight) {
          this.openModal = false
        } else {
          this.updateWeight(weightChanged)
        }
      }
      this.openModal = false
    },

    onDelete() {
      this.deleteWeight(this.weightData)
    },

    onShow() {
      if (this.action.toLowerCase() === 'update') {
        if (this.weights.length !== 0) {
          this.weight = this.weightData.weight
        } else {
          this.weight = ''
        }
        this.updateDate = date.formatDate(this.weightData.date, 'DD MMM YYYY')
      }
    },

    onClose() {
      this.closeModal()
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

  mounted() {
    // set the default weight in modal as the most recent logged date by the user
    if (this.action === 'add') {
      if (this.weights.length !== 0)
        this.weight = this.weights[0].weight
    } else {
      this.resetFields()
    }
  },
  watch: {
    weight() {
      // 1st replace = only allow numbers and dot, can't start with dot or 0
      // 2nd replace = can only have 1 dot, max 4 chars, only 1 decimal
      this.weight = this.weight.replace(/[^0-9.]|^0|^\./g, '').replace(/(\.){2,}|(\d{4}).|(\.\d)./g, '$1 $2 $3')
    },
    open() {
      this.openModal = this.open;
    }
  }
}
</script>

<style lang="scss">
.updateDateDisplay {
  font-size: 1.2rem;
  color: $secondary;

  .q-icon {
    padding-bottom: 0.1rem;
    padding-right: 0.3rem;
  }
}

.actionModalBtns {
  width: 4.5rem;
}

.weightInput {
  font-size: 1.1rem;
}

.desktop-add-btn {
  padding: 0.5rem 0.5rem;
  font-size: 1rem;

  /*.q-icon {
    font-size: 1.7rem;
  }*/

  .on-left {
    margin-right: 0.3rem;
  }

  .block {
    padding-right: 0.3rem;
  }
}

</style>
