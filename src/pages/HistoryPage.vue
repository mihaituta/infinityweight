<template>
  <q-list class="q-px-md q-pt-md">
    <q-item-label class="history-title q-pa-none text-secondary lt-sm" header>
      History
    </q-item-label>

    <actions-modal
      @closeUpdateModal="closeUpdateModal($event)"
      action="update"
      :weightData="updateWeightData"
      :open="openUpdateModal"/>
    <actions-modal
      :addBtnVisible="true"
      action="add"/>

    <q-item
      v-for="weight in weights"
      :key="weight"
      class="no-padding q-mt-md shadow-5"
      clickable
      @click="onClick(weight)"
    >
      <q-item-section class="q-px-sm text-center text-white item-date text-weight-bold">
        <q-item-label>{{ weight.date.getDate() }} {{ months[weight.date.getMonth()] }}</q-item-label>
        <q-item-label>{{ weight.date.getFullYear() }}</q-item-label>
      </q-item-section>

      <q-item-section class="q-pl-sm text-white item-weight">
        <q-item-label>{{ weight.weight }} <span>kg</span></q-item-label>
      </q-item-section>

      <q-item-section class="q-mr-md item-diff" side>
        <div class="flex items-center">
          <q-icon v-if="weight.weightDiff > 0" size="1.5rem" name="north" color="negative"/>
          <q-icon v-else-if="weight.weightDiff < 0" size="1.5rem" name="south" color="secondary"/>

          <q-item-label v-if="weight.weightDiff > 0" class="q-pl-xs text-negative">
            <!-- turn the string into a number to get rid of the zero after coma Ex: 35.0 -> 35 -->
            {{ +weight.weightDiff }}
            <span>kg</span></q-item-label>
          <q-item-label v-else-if="weight.weightDiff < 0" class="q-pl-xs text-secondary">
            <!-- turn the string into a positive number (weight loss is a negative number in database)
             and get rid of '-' when it is displayed -->
            {{ -weight.weightDiff }}
            <span>kg</span></q-item-label>
          <q-item-label v-else class="q-pl-xs same"> 0 <span>kg</span></q-item-label>

        </div>
      </q-item-section>
    </q-item>

  </q-list>

</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "HistoryPage",
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
      openUpdateModal: false,
      updateWeightData: {}
    }
  },
  methods: {
    onClick(weight) {
      this.updateWeightData = weight
      this.openUpdateModal = true
    },
    closeUpdateModal() {
      this.openUpdateModal = false
    }
  },
  computed: {
    ...mapGetters('myStore', ['weights'])
  },
  components: {
    'actions-modal': require('components/ActionsModal').default
  }
}
</script>

<style scoped lang="scss">
.q-list {
  //max-width: 35rem;
  padding-bottom: 6rem;

  .history-title {
    font-size: 1.8rem;
  }

  .q-item {
    background: $primary-400;

    .item-date {
      max-width: 5rem;
      font-size: 1rem;
      background: $secondary;

    }

    .item-weight {
      font-size: 1.5rem;

      span {
        font-size: 0.9rem;
      }
    }

    .item-diff {
      font-size: 1.2rem;

      span {
        font-size: 1rem;
      }
    }

    &:hover {
      background: $primary-200;
    }
  }
}

@media (min-width: $breakpoint-sm-min) {
  .q-list {
    max-width: 40rem;
    padding: 1.5rem 3rem 2.5rem 3rem;
  }
}

</style>
