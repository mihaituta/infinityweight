<template>
  <q-page>
    <div class="wrapper">

      <q-card :flat="cardShadow" dark class="stats-card">
        <q-card-section>
          <div>CURRENT</div>
          <q-separator/>
          <div class="content">
            <q-skeleton v-if="loadingStatus" type="rect"/>
            <div v-else-if="weights.length > 0" class="text-grey-5">{{ weights[0].weight }} kg</div>
            <div v-else class="text-grey-5">No weights</div>
          </div>
        </q-card-section>

        <q-card-section>
          <div>CHANGE</div>
          <q-separator/>
          <div class="content">
            <q-skeleton v-if="loadingStatus" type="rect"/>
            <div v-else-if="weights.length > 0 && weights[0].weightDiff > 0" class="text-negative flex items-center">
              <q-icon name="north"/>
              <!-- turn the string into a number to get rid of the zero after coma Ex: 35.0 -> 35 -->
              <div> {{ +weights[0].weightDiff }} kg</div>
            </div>

            <div v-else-if="weights.length > 0 && weights[0].weightDiff < 0"
                 class="text-secondary-400 flex items-center">
              <q-icon name="south"/>
              <!-- turn the string into a positive number (weight loss is a negative number in database)
               and get rid of '-' when it is displayed -->
              {{ -weights[0].weightDiff }} kg
            </div>

            <div v-else-if="weights.length > 0 && weights[0].weightDiff === 0" class="text-grey-5">
              Same weight
            </div>

            <div v-else class="text-grey-5">No weights</div>
          </div>
        </q-card-section>

        <q-card-section>
          <div>THIS WEEK</div>
          <q-separator/>
          <div class="content">
            <q-skeleton v-if="loadingStatus" type="rect"/>

            <div v-else-if="weights.length > 0 && thisWeekChange > 0" class=" text-negative flex items-center">
              <q-icon name="north"/>
              {{ +thisWeekChange }} kg
            </div>

            <div v-else-if="weights.length > 0 && thisWeekChange < 0" class=" text-secondary-400 flex items-center">
              <q-icon name="south"/>
              {{ -thisWeekChange }} kg
            </div>

            <div v-else-if="weights.length > 0 && thisWeekChange === 0" class="text-grey-5">
              Same weight
            </div>

            <div v-else class="text-grey-5">No weights</div>
          </div>
        </q-card-section>

        <q-card-section>
          <div>THIS MONTH</div>
          <q-separator/>
          <div class="content">
            <q-skeleton v-if="loadingStatus" type="rect"/>

            <div v-else-if="weights.length > 0 && thisMonthChange > 0" class=" text-negative flex items-end">
              <div class="flex align-items">
                <q-icon name="north"/>
                {{ +thisMonthChange }} kg
              </div>
            </div>

            <div v-else-if="weights.length > 0 && thisMonthChange < 0" class=" text-secondary-400 flex items-center">
              <q-icon name="south"/>
              {{ -thisMonthChange }} kg
            </div>

            <div v-else-if="weights.length > 0 && thisMonthChange === 0" class="text-grey-5">
              Same weight
            </div>

            <div v-else class="text-grey-5">No weights</div>
          </div>
        </q-card-section>

        <q-card-section>
          <div>THIS YEAR</div>
          <q-separator/>
          <div class="content">
            <q-skeleton v-if="loadingStatus" type="rect"/>

            <div v-else-if="weights.length > 0 && thisYearChange > 0" class=" text-negative flex items-end">
              <div class="flex align-items">
                <q-icon name="north"/>
                {{ +thisYearChange }} kg
              </div>
            </div>

            <div v-else-if="weights.length > 0 && thisYearChange < 0" class=" text-secondary-400 flex items-center">
              <q-icon name="south"/>
              {{ -thisYearChange }} kg
            </div>

            <div v-else-if="weights.length > 0 && thisYearChange === 0" class="text-grey-5">
              Same weight
            </div>

            <div v-else class="text-grey-5">No weights</div>
          </div>
        </q-card-section>

        <q-card-section>
          <div>ALL TIME</div>
          <q-separator class="q-my-sm"/>

          <div class="content">
            <q-skeleton v-if="loadingStatus" type="rect"/>
            <div v-else-if="weights.length > 0 && allTimeChange > 0" class=" text-negative flex items-end">
              <div class="flex align-items">
                <q-icon name="north"/>
                {{ +allTimeChange }} kg
              </div>
            </div>

            <div v-else-if="weights.length > 0 && allTimeChange < 0" class=" text-secondary-400 flex items-center">
              <q-icon name="south"/>
              {{ -allTimeChange }} kg
            </div>

            <div v-else-if="weights.length > 0 && allTimeChange === 0" class="text-grey-5">
              Same weight
            </div>

            <div v-else class="text-grey-5">No weights</div>
          </div>
        </q-card-section>
      </q-card>

      <q-card :flat="cardShadow" dark class="items-card">
        <actions-modal
          @closeUpdateModal="closeUpdateModal($event)"
          action="update"
          :weightData="updateWeightData"
          :open="openUpdateModal"
        />

        <q-card-section class="actions">
          <div class="title q-pa-none text-secondary lt-sm">
            History
          </div>

          <actions-modal
            :addBtnVisible="true"
            action="add"
          />

          <q-input
            v-if="weights.length"
            dark
            class="search-input"
            v-model="searchDate"
            filled
            color="secondary"
            label="Search by date"
            placeholder="Search by date"
          >
            <template v-slot:prepend>
              <q-icon name="search"/>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section v-if="loadingStatus" class="items-skeleton">
          <div class="bg-primary-200 full-width flex items-center">
            <q-skeleton class="bg-secondary" type="rect" height="5rem" width="5rem"></q-skeleton>
            <q-skeleton class="q-ml-md" type="rect" height="1.5rem" width="4.5rem"></q-skeleton>
            <q-space/>
            <q-skeleton class="bg-secondary q-mr-md" type="rect" height="1.5rem" width="4.2rem"></q-skeleton>
          </div>
          <div class="bg-primary-200 full-width flex items-center">
            <q-skeleton class="bg-secondary" type="rect" height="5rem" width="5rem"></q-skeleton>
            <q-skeleton class="q-ml-md" type="rect" height="1.5rem" width="4.5rem"></q-skeleton>
            <q-space/>
            <q-skeleton class="bg-secondary q-mr-md" type="rect" height="1.5rem" width="4.2rem"></q-skeleton>
          </div>
          <div class="bg-primary-200 full-width flex items-center">
            <q-skeleton class="bg-secondary" type="rect" height="5rem" width="5rem"></q-skeleton>
            <q-skeleton class="q-ml-md" type="rect" height="1.5rem" width="4.5rem"></q-skeleton>
            <q-space/>
            <q-skeleton class="bg-negative q-mr-md" type="rect" height="1.5rem" width="4.2rem"></q-skeleton>
          </div>
          <div class="bg-primary-200 full-width flex items-center">
            <q-skeleton class="bg-secondary" type="rect" height="5rem" width="5rem"></q-skeleton>
            <q-skeleton class="q-ml-md" type="rect" height="1.5rem" width="4.5rem"></q-skeleton>
            <q-space/>
            <q-skeleton class="bg-secondary q-mr-md" type="rect" height="1.5rem" width="4.2rem"></q-skeleton>
          </div>
          <div class="bg-primary-200 full-width flex items-center">
            <q-skeleton class="bg-secondary" type="rect" height="5rem" width="5rem"></q-skeleton>
            <q-skeleton class="q-ml-md" type="rect" height="1.5rem" width="4.5rem"></q-skeleton>
            <q-space/>
            <q-skeleton class="bg-negative q-mr-md" type="rect" height="1.5rem" width="4.2rem"></q-skeleton>
          </div>
          <div class="bg-primary-200 full-width flex items-center">
            <q-skeleton class="bg-secondary" type="rect" height="5rem" width="5rem"></q-skeleton>
            <q-skeleton class="q-ml-md" type="rect" height="1.5rem" width="4.5rem"></q-skeleton>
            <q-space/>
            <q-skeleton class="bg-negative q-mr-md" type="rect" height="1.5rem" width="4.2rem"></q-skeleton>
          </div>
          <div class="bg-primary-200 full-width flex items-center">
            <q-skeleton class="bg-secondary" type="rect" height="5rem" width="5rem"></q-skeleton>
            <q-skeleton class="q-ml-md" type="rect" height="1.5rem" width="4.5rem"></q-skeleton>
            <q-space/>
            <q-skeleton class="bg-secondary q-mr-md" type="rect" height="1.5rem" width="4.2rem"></q-skeleton>
          </div>
          <div class="bg-primary-200 full-width flex items-center">
            <q-skeleton class="bg-secondary" type="rect" height="5rem" width="5rem"></q-skeleton>
            <q-skeleton class="q-ml-md" type="rect" height="1.5rem" width="4.5rem"></q-skeleton>
            <q-space/>
            <q-skeleton class="bg-negative q-mr-md" type="rect" height="1.5rem" width="4.2rem"></q-skeleton>
          </div>
        </q-card-section>

        <q-card-section v-else-if="weights.length > 0" class="q-pa-none">
          <q-list>
            <transition
              enter-active-class="animated rollIn"
              leave-active-class="animated rollOut"
            >
              <div v-if="!filteredWeights.length && filteredWeights">
                <div class="not-found">
                  Nothing found on date: <span> {{ searchDate }} </span>
                </div>
              </div>
            </transition>

            <transition-group
              enter-active-class="animated fadeInRight"
              leave-active-class="animated fadeOutRight"
            >
              <q-item
                v-for="(weight, index) in filteredWeights"
                :key="index"
                class="no-padding q-mt-md shadow-5"
                clickable
                @click="onClick(weight)">
                <q-item-section class="q-px-sm text-center text-white item-date text-weight-bold">
                  <q-item-label>{{ weight.date.getDate() }} {{ months[weight.date.getMonth()] }}</q-item-label>
                  <q-item-label>{{ weight.date.getFullYear() }}</q-item-label>
                </q-item-section>

                <q-item-section class="q-pl-sm text-white item-weight">
                  <q-item-label>{{ weight.weight }} <span>kg</span></q-item-label>
                </q-item-section>

                <q-item-section class="q-mr-md item-diff" side>
                  <q-item-label v-if="weight.weightDiff > 0" class="q-pl-xs text-negative flex items-end">
                    <div class="flex">
                      <q-icon name="north"/>
                      <!-- turn the string into a number to get rid of the zero after coma Ex: 35.0 -> 35 -->
                      {{ +weight.weightDiff }}
                    </div>
                    <span>kg</span>
                  </q-item-label>

                  <q-item-label v-else-if="weight.weightDiff < 0" class="q-pl-xs text-secondary flex items-center">
                    <q-icon name="south"/>
                    <!-- turn the string into a positive number (weight loss is a negative number in database)
                     and get rid of '-' when it is displayed -->
                    {{ -weight.weightDiff }}
                    <span>kg</span>
                  </q-item-label>

                  <q-item-label v-else class="q-pl-xs"> 0 <span>kg</span></q-item-label>
                </q-item-section>
              </q-item>
            </transition-group>


          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import {defineComponent} from 'vue';
import {mapGetters} from "vuex";
import {date, useQuasar} from "quasar";
import ActionsModal from "components/ActionsModal";

export default defineComponent({
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
      openUpdateModal: false,
      updateWeightData: {},
      searchDate: ''
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
    ...mapGetters('myStore', ['weights', 'loadingStatus']),

    filteredWeights() {
      if (this.searchDate)
        return this.weights.filter(weight => {
          const searchTrim = date.formatDate(weight.date, 'DD MMMM YYYY').toLowerCase().replace(/\s+/g, '')
          const search = date.formatDate(weight.date, 'DD MMMM YYYY').toLowerCase()
          return searchTrim.includes(this.searchDate.toLowerCase()) || search.includes(this.searchDate.toLowerCase())
        })
      else
        return this.weights
    },
    // remove shadow of card on smaller screens
    cardShadow: () => useQuasar().screen.lt.sm,
    thisWeekChange() {
      const mostRecentWeight = this.weights[0]
      const oneWeekAgo = new Date(new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0))
      let firstWeightOneWeekAgo
      this.weights.some(weight => {
        if (oneWeekAgo.getTime() <= weight.date.getTime()) {
          firstWeightOneWeekAgo = weight
        }
      })
      return parseFloat((mostRecentWeight.weight - firstWeightOneWeekAgo.weight).toFixed(1))
    },
    thisMonthChange() {
      const mostRecentWeight = this.weights[0]
      const oneMonthAgo = new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0, 0, 0, 0))
      let firstWeightOneMonthAgo
      this.weights.some(weight => {
        if (oneMonthAgo.getTime() <= weight.date.getTime()) {
          firstWeightOneMonthAgo = weight
        }
      })
      return parseFloat((mostRecentWeight.weight - firstWeightOneMonthAgo.weight).toFixed(1))
    },
    thisYearChange() {
      const mostRecentWeight = this.weights[0]
      const oneYearAgo = new Date(new Date(new Date().setFullYear(new Date().getFullYear() - 1)).setHours(0, 0, 0, 0))
      let firstWeightOneYearAgo
      this.weights.some(weight => {
        if (oneYearAgo.getTime() <= weight.date.getTime()) {
          firstWeightOneYearAgo = weight
        }
      })
      return parseFloat((mostRecentWeight.weight - firstWeightOneYearAgo.weight).toFixed(1))
    },
    allTimeChange() {
      const mostRecentWeight = this.weights[0]
      const firstWeightAllTime = this.weights[this.weights.length - 1]
      return parseFloat((mostRecentWeight.weight - firstWeightAllTime.weight).toFixed(1))
    }
  },
  components: {
    ActionsModal,
    'actions-modal': require('components/ActionsModal').default
  }
})
</script>

<style scoped lang="scss">

.q-page {
  padding: 1rem;

  .stats-card {
    display: grid;
    grid-template-columns: repeat(2, minmax(10px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
    background-color: transparent;

    & > * {
      font-weight: bold;
      font-size: 1rem;
      color: $secondary;
      background-color: $primary-400;

      .q-separator {
        margin: 0.8rem 0;
        background-color: $grey-9;
      }

      .content {
        font-weight: normal;
        font-size: 1.1rem;

        .q-icon {
          font-size: 1.2rem;
        }

        .q-skeleton {
          width: 5rem;
        }
      }
    }
  }

  .items-card {
    background-color: transparent;
    height: 100%;

    .actions {
      padding: 0;

      .title {
        font-size: 1.8rem;
        margin-bottom: 0.5rem;
      }

      .search-input {
        font-size: 1rem;
      }
    }

    .q-list {
      padding-bottom: 6rem;

      .q-input {
        font-size: 1rem;
      }

      .not-found {
        margin-top: 1rem;
        color: $grey-5;
        font-size: 1.2rem;

        span {
          font-weight: bold;
          color: $secondary;
        }
      }

      .q-item {
        background: $primary-400;

        .item-date {
          max-width: 5rem;
          font-size: 1.1rem;
          background: $secondary;
        }

        .item-weight {
          font-size: 1.5rem;

          span {
            font-size: 0.9rem;
          }
        }

        .item-diff {
          font-size: 1.3rem;

          span {
            padding-left: 0.2rem;
            font-size: 1.2rem;
          }
        }

        &:hover {
          background: $primary-200;
        }
      }
    }

    .items-skeleton {
      padding: 0;

      & > div {
        margin-top: 1rem;
      }
    }
  }
}

@media (min-width: $breakpoint-sm-min) {
  .q-page {
    padding: 2rem;

    .stats-card {
      background-color: $primary-400;
      gap: 2rem;
      height: 100%;
      padding: 2rem;

      & > * {
        font-size: 1.2rem;
        background-color: $primary-200;

        .q-separator {
          background-color: $grey-8;
        }

        .content {
          font-size: 1.3rem;

          .q-icon {
            font-size: 1.3rem;
          }
        }
      }
    }

    .items-card {
      background-color: $primary-400;
      min-height: 6.5rem;

      .actions {
        padding: 2rem 2rem 0 2rem;

        .search-input {
          font-size: 1.1rem;
        }

        & > :nth-child(3) {
          margin-bottom: 1rem;
        }
      }

      .q-list {
        padding: 0 2rem 2.5rem 2rem;

        .q-item {
          background: $primary-200;

          .item-date {
            max-width: 5.5rem;
            font-size: 1.2rem;
          }
        }
      }

      .items-skeleton {
        padding: 1rem 2rem 2.5rem 2rem;
      }
    }
  }
}

@media (min-width: $breakpoint-md-min) {
  .q-page {
    padding: 1rem;

    .wrapper {
      display: flex;
      flex-flow: row-reverse;

      & > * {
        flex-grow: 1;
        flex-basis: 0;
      }

      .stats-card {
        margin-left: 0.5rem;
        gap: 1rem;
        padding: 1rem;
      }

      .items-card {
        margin-right: 0.5rem;
        min-height: 4rem;

        .actions {
          padding: 1rem 1rem 0 1rem;
        }

        .q-list {
          padding: 0 1rem 1rem 1rem;

          .q-item {
            height: 4rem;

            .item-date {
              max-width: 4.7rem;
              font-size: 1rem;
              background: $secondary;
            }
          }
        }

        .items-skeleton {
          padding: 0 1rem 1rem 1rem;
        }
      }
    }
  }
}

@media (min-width: $breakpoint-lg-min) {
  .q-page {
    padding: 3rem;

    .wrapper {
      .stats-card {
        margin-left: 1.5rem;
        gap: 2rem;
        padding: 2rem;
      }

      .items-card {
        margin-right: 1.5rem;
        min-height: 8.5rem;

        .actions {
          padding: 3rem 3rem 0 3rem;
        }

        .q-list {
          padding: 0 3rem 3rem 3rem;

          .q-item {
            height: 5rem;

            .item-date {
              max-width: 5rem;
              font-size: 1.2rem;
              background: $secondary;
            }
          }
        }

        .items-skeleton {
          padding: 0 3rem 3rem 3rem;
        }
      }
    }
  }
}

</style>
