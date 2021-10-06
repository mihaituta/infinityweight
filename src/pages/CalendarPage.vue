<template>
  <q-page>
    <actions-modal
      @closeUpdateModal="closeUpdateModal($event)"
      action="update"
      :weightData="updateWeightData"
      :open="openUpdateModal"/>
    <actions-modal action="add"/>
    <div id="calendar" class="full-width">
      <header>
        <div class="current-day">
          {{ `${weekdayNames[currentDay]}, ${month[currentDate.month]} ${currentDate.date}` }}
        </div>
        <div class="current-date">
          <div class="selected-date-title row justify-center">
            <div class="items-center">
              <q-icon class="arrow" name="navigate_before" @click="monthDown"/>
              {{ month[currentDate.month] }}
              <q-icon class="arrow" name="navigate_next" @click="monthUp"/>
            </div>

            <div class="items-center">
              <q-icon class="arrow" name="navigate_before" @click="currentDate.year -= 1"/>
              {{ currentDate.year }}
              <q-icon class="arrow" name="navigate_next" @click="currentDate.year += 1"/>
            </div>
          </div>
        </div>
      </header>
      <div class="content">
        <div class="weekdays">
          <div class="weekday" v-for="(weekday, index) in weekdays" :key="index">
            {{ weekday }}
          </div>
        </div>
        <div class="date">
          <div class="day-hidden" v-for="(day, index) in (firstMonthDay -1)" :key="'prev'+index">
            {{ (prevMonthDays + 1) - firstMonthDay + day }}
          </div>
          <div class="day"
               :class="{ active: day === currentDate.date}"
               @click="updateWeight(day)"
               v-for="(day, index) in currentMonthDays"
               :key="'day'+index">
            <div> {{ day }}</div>
            <!--            <div v-if="tempWeights.length > 0 && tempWeights.find(e => e.day === n) !== undefined">
                          {{ tempWeights.find(e => e.day === n).weight }}
                        </div>-->
            <div v-if="getWeights(day) && getWeights(day)[1] === 'neutral'" class="weight text-grey-5">
              {{ getWeights(day)[0] }} kg
            </div>
            <div v-else-if="getWeights(day) && getWeights(day)[1] === 'positive'" class="weight text-secondary">
              {{ getWeights(day)[0] }} kg
            </div>
            <div v-else-if="getWeights(day) && getWeights(day)[1] === 'negative'" class="weight text-negative">
              {{ getWeights(day)[0] }} kg
            </div>

          </div>
          <div class="day-hidden" v-for="(n, index) in (43 - (currentMonthDays + firstMonthDay))" :key="'next'+index">
            {{ n }}
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  data: function () {
    return {
      openUpdateModal: false,
      updateWeightData: {},
      tempWeights: [],
      tempWeightStatus: '',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      weekdayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      month: [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
      ],
      currentDate: {
        date: 0,
        month: 0,
        year: 0
      }
    }
  },
  computed: {
    ...mapGetters('myStore', ['weights']),
    prevMonthDays() {
      let year = this.currentDate.month === 0 ? this.currentDate.year - 1 : this.currentDate.year;
      let month = this.currentDate.month === 0 ? 12 : this.currentDate.month;
      return new Date(year, month, 0).getDate();
    },
    firstMonthDay() {
      let firstDay = new Date(this.currentDate.year, this.currentDate.month, 1).getDay();
      if (firstDay === 0) firstDay = 7;
      return firstDay;
    },
    currentDay() {
      return new Date(this.currentDate.year, this.currentDate.month, this.currentDate.date).getDay();
    },
    currentMonthDays() {
      return new Date(this.currentDate.year, this.currentDate.month + 1, 0).getDate();
    },

  },
  methods: {
    closeUpdateModal() {
      this.openUpdateModal = false
    },
    getWeights(n) {
      this.tempWeights = []
      const selectedDay = this.currentDate.year + '/' + (this.currentDate.month + 1) + '/' + n
      const selectedDate = new Date(selectedDay)
      const weightObj = this.weights.find(e => e.date.getTime() === selectedDate.getTime())
      let status = ''
      if (weightObj !== undefined) {
        if (Math.sign(weightObj.weightDiff) === 1) {
          status = 'positive'
        } else if (Math.sign(weightObj.weightDiff) === -1) {
          status = 'negative'
        } else if (Math.sign(weightObj.weightDiff) === -0 || Math.sign(weightObj.weightDiff) === 0) {
          status = 'neutral'
        }

        return [weightObj.weight, status]
      }
    },
    /*    getWeights() {
          this.tempWeights = []
          for (let i = 1; i <= this.currentMonthDays; i++) {
            const selectedDay = this.currentDate.year + '/' + (this.currentDate.month + 1) + '/' + i
            const selectedDate = new Date(selectedDay)
            const weightObj = this.weights.find(e => new Date(e.date).getTime() === selectedDate.getTime())
            let status = ''
            if (weightObj !== undefined) {
              if (Math.sign(weightObj.weightDiff) === 1) {
                status = 'positive'
              } else if (Math.sign(weightObj.weightDiff) === -1) {
                status = 'negative'
              } else if (Math.sign(weightObj.weightDiff) === -0 || Math.sign(weightObj.weightDiff) === 0) {
                status = 'neutral'
              }
              this.tempWeights.push(
                {
                  day: i,
                  weight: weightObj.weight,
                  status: status
                }
              )
            }
          }
        },*/

    updateWeight(date) {
      this.currentDate.date = date
      const selectedDay = this.currentDate.year + '/' + (this.currentDate.month + 1) + '/' + date
      const selectedDate = new Date(selectedDay)
      const weight = this.weights.find(e => e.date.getTime() === selectedDate.getTime())
      if (weight) {
        this.updateWeightData = weight
        this.openUpdateModal = true
      }
    },
    getCurrentDate() {
      let today = new Date();
      this.currentDate.date = today.getDate();
      this.currentDate.month = today.getMonth();
      this.currentDate.year = today.getFullYear();
    },
    monthUp() {
      if (this.currentDate.month === 11) {
        this.currentDate.month = 0;
        this.currentDate.year += 1;
      } else {
        this.currentDate.month += 1;
      }
      this.getWeights()
    },
    monthDown() {
      if (this.currentDate.month === 0) {
        this.currentDate.month = 11;
        this.currentDate.year -= 1;
      } else {
        this.currentDate.month -= 1;
      }
      this.getWeights()
    }
  },
  components: {
    'actions-modal': require('components/ActionsModal').default
  },
  created() {
    this.getCurrentDate();
    this.getWeights()
  },
  mounted() {
    this.getWeights()
  }
}
</script>

<style lang="scss" scoped>

@mixin calendar-layout($property) {
  display: grid;
  grid-template-columns: repeat(7, minmax(20px, 1fr));
  //grid-gap: 10px;
  padding: $property;
  div {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #fff;
  }
}

#calendar {
  user-select: none;

  header {
    padding: 0.7rem 0;
    display: flex;
    flex-flow: column;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    color: #efefef;
    background-color: $secondary;
    /* text-shadow: 1px 1px 1px #222,
     1px -1px 1px #222,
     -1px 1px 1px #222,
     -1px -1px 1px #222;*/


    .selected-date-title {
      font-size: 1.5rem;

      div {
        display: flex;
        justify-content: center;

        .arrow {
          font-size: 2rem;
          cursor: pointer;
          transition: 0.3s;

          &:hover {
            color: $secondary-300;
          }
        }
      }
    }

    .current-day {
      font-size: 2rem;
    }
  }

  .content {
    height: 100%;
  }

  .weekdays {
    @include calendar-layout(15px 0 15px);
    background-color: $secondary-700;
  }

  .date {
    @include calendar-layout(0 0 10px);
    height: 400px;
    background-color: $primary-500;

    .active {
      background-color: $secondary;
      color: #2A4C50;
    }

    .day {
      cursor: pointer;
      transition: background-color 0.4s;

      &:hover {
        background-color: $secondary;
        color: #2A4C50;
      }

      /*  .weight {
          color: $secondary-300;
        }*/
    }

    .day-hidden {
      opacity: .3;
    }
  }
}


@media (min-width: $breakpoint-sm-min) {
  #calendar {
    .date {
      height: 500px;
    }
  }
}

@media (min-width: $breakpoint-md-min) {
  #calendar {
    .date {
      height: 700px;
    }
  }
}

@media (min-width: $breakpoint-lg-min) {
  #calendar {
    .date {
      height: 600px;
    }
  }
}

</style>
