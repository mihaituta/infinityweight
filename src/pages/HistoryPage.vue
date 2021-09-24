<template>
  <q-list class="q-px-md q-mt-md" dark>
    <q-item
      v-for="weight in weights"
      :key="weight"
      class="rounded-borders bg-dark no-padding q-my-md"
      clickable
      v-ripple>
      <q-item-section class="bg-secondary q-px-sm text-center item-date text-weight-bold">
        <q-item-label>{{ weight.date.day }} {{ weight.date.month }}</q-item-label>
        <q-item-label>{{ weight.date.year }}</q-item-label>
      </q-item-section>

      <q-item-section class="q-pl-sm item-weight">
        <q-item-label>{{ weight.weight }} <span>kg</span></q-item-label>
      </q-item-section>

      <q-item-section class="q-mr-md item-diff" side>
        <div class="flex items-center">
          <q-icon v-if="weight.status === '+'" size="1.4rem" name="north" color="negative"></q-icon>
          <q-icon v-else-if="weight.status === '-'" size="1.4rem" name="south" color="positive"></q-icon>
          <q-icon v-else size="1.4rem" name="remove" color="info"></q-icon>
          <q-item-label class="q-pl-xs"> {{ weight.weightDiff }} <span>kg</span></q-item-label>
        </div>
      </q-item-section>
    </q-item>

  </q-list>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "HistoryPage",
  computed: {
    ...mapGetters('myStore', ['weights'])
  },
}
</script>

<style lang="scss">
.item-date {
  max-width: 5rem;
  font-size: 1rem;
}

.item-weight {
  font-size: 1.4rem;

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
</style>
