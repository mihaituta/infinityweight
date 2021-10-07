<template>
  <q-page class="flex justify-center">
    <q-card dark>
      <q-card-section>
        sms
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'PageIndex'
})
</script>

<style lang="scss" scoped>
.q-card {
  width: 100%;
  height: inherit;
  margin: 1rem;
}


@media (min-width: $breakpoint-sm-min) {
  .q-card {
    margin: 2rem;
  }
}

@media (min-width: $breakpoint-md-min) {
  .q-card {
    margin: 3rem;
  }
}

@media (min-width: $breakpoint-lg-min) {

}
</style>
