<template>
  <q-list class="q-px-md q-pt-md" dark style="max-width: 40rem">
    <q-item-label class="q-pa-none text-h5" header>
      History
    </q-item-label>

    <q-item
      v-for="weight in weights"
      :key="weight"
      class="no-padding q-mt-md"
      clickable
      v-ripple>
      <q-item-section class="bg-secondary q-px-sm text-center item-date text-weight-bold">
        <q-item-label>{{ weight.date.getDate() }} {{ months[weight.date.getMonth()] }}</q-item-label>
        <q-item-label>{{ weight.date.getFullYear() }}</q-item-label>
      </q-item-section>

      <q-item-section class="q-pl-sm item-weight">
        <q-item-label>{{ weight.weight }} <span>kg</span></q-item-label>
      </q-item-section>

      <q-item-section class="q-mr-md item-diff" side>
        <div class="flex items-center">
          <q-icon v-if="weight.weightDiff > 0" size="1.5rem" name="north" color="negative"></q-icon>
          <q-icon v-else-if="weight.weightDiff < 0" size="1.5rem" name="south" color="secondary"></q-icon>

          <q-item-label v-if="weight.weightDiff > 0" class="q-pl-xs text-negative">
            {{ weight.weightDiff }}
            <span>kg</span></q-item-label>
          <q-item-label v-else-if="weight.weightDiff < 0" class="q-pl-xs text-secondary">
            <!-- turn the number positive and get rid of '-' when it is displayed -->
            {{ weight.weightDiff * -1 }}
            <span>kg</span></q-item-label>
          <q-item-label v-else class="q-pl-xs same"> 0 <span>kg</span></q-item-label>

        </div>
      </q-item-section>
    </q-item>

  </q-list>
  <actions-modal action="add"/>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "HistoryPage",
  data() {
    return {
      months: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.',
        'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.']
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
  padding-bottom: 6rem;

  .q-item {
    background: $primary-400;

    .item-date {
      max-width: 5rem;
      font-size: 1rem;
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
  }
}

</style>
