<template>
  <q-page>
    <actions-modal
      @closeUpdateModal="closeUpdateModal($event)"
      action="update"
      :weightData="updateWeightData"
      :open="openUpdateModal"/>

    <actions-modal
      @closeAddModal="closeAddModal($event)"
      action="add"
      :calendarPageAddModal="true"
      :calendarAddDate="calendarAddDate"
      :open="openAddModal"
    />

    <div id="calendar" class="full-width">
      <header>
        <div class="current-day">
          {{ `${weekdayNames[currentDay]}, ${month[currentDate.month]} ${currentDate.date}` }}
        </div>
        <div class="current-date">
          <div class="selected-date-title row justify-center">
            <div class="items-center">
              <q-icon class="arrow" name="navigate_before" @click="monthPrev"/>
              {{ month[currentDate.month] }}
              <q-icon class="arrow" name="navigate_next" @click="monthNext"/>
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
          <div class="day-hidden calendar-days" v-for="(day, index) in (firstMonthDay -1)" :key="'prev'+index">
            {{ (prevMonthDays + 1) - firstMonthDay + day }}
          </div>
          <div class="day calendar-days"
               :class="{ active: day === currentDate.date}"
               @click="weightActions(day)"
               v-for="(day, index) in currentMonthDays"
               :key="'day'+index">
            <div class="text-grey-2"> {{ day }}</div>

            <!--            <div v-if="tempWeights.length > 0 && tempWeights.find(e => e.day === n) !== undefined">
                          {{ tempWeights.find(e => e.day === n).weight }}
                        </div>-->
            <div v-if="getWeight(day) && getWeight(day).weightDiff === 0">
              {{ getWeight(day).weight }}
              <span class="gt-xs">kg</span>

            </div>
            <div v-else-if="getWeight(day) && getWeight(day).weightDiff > 0" class="weight ">
              <div>
                {{ getWeight(day).weight }}
                <span class="gt-xs">kg</span>
              </div>

              <div class="q-pl-xs text-negative flex items-center gt-md">
                <q-icon size="1.2rem" name="north" color="negative"/>
                <!-- turn the string into a number to get rid of the zero after coma Ex: 35.0 -> 35 -->
                {{ +getWeight(day).weightDiff }}kg
              </div>
            </div>

            <div v-else-if="getWeight(day) && getWeight(day).weightDiff < 0" class="weight">
              <div>
                {{ getWeight(day).weight }}
                <span class="gt-xs">kg</span>
              </div>

              <div class="q-pl-xs text-secondary flex items-center gt-md">
                <q-icon size="1.2rem" name="south" color="secondary"/>
                <!-- turn the string into a positive number (weight loss is a negative number in database)
                 and get rid of '-' when it is displayed -->
                {{ -getWeight(day).weightDiff }}kg
              </div>
            </div>

          </div>
          <div class="day-hidden calendar-days" v-for="(n, index) in (43 - (currentMonthDays + firstMonthDay))"
               :key="'next'+index">
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
      openAddModal: false,
      updateWeightData: {},
      calendarAddDate: '',
      // tempWeights: [],
      // tempWeightStatus: '',
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
    closeAddModal() {
      this.openAddModal = false
    },
    getWeight(day) {
      const selectedDay = this.currentDate.year + '/' + (this.currentDate.month + 1) + '/' + day
      const selectedDate = new Date(selectedDay)
      const weightObj = this.weights.find(e => e.date.getTime() === selectedDate.getTime())
      if (weightObj !== undefined) {
        return {
          weight: weightObj.weight,
          weightDiff: weightObj.weightDiff,
        }
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

    weightActions(date) {
      this.currentDate.date = date
      const selectedDay = this.currentDate.year + '/' + (this.currentDate.month + 1) + '/' + date
      const selectedDate = new Date(selectedDay)
      const weight = this.weights.find(e => e.date.getTime() === selectedDate.getTime())
      if (weight) {
        this.updateWeightData = weight
        this.openUpdateModal = true
      } else {
        if (selectedDate < new Date()) {
          this.openAddModal = true
          this.calendarAddDate = selectedDate
        }
      }
    },
    getCurrentDate() {
      let today = new Date();
      this.currentDate.date = today.getDate();
      this.currentDate.month = today.getMonth();
      this.currentDate.year = today.getFullYear();
    },
    monthNext() {
      if (this.currentDate.month === 11) {
        this.currentDate.month = 0;
        this.currentDate.year += 1;
      } else {
        this.currentDate.month += 1;
      }

    },
    monthPrev() {
      if (this.currentDate.month === 0) {
        this.currentDate.month = 11;
        this.currentDate.year -= 1;
      } else {
        this.currentDate.month -= 1;
      }

    }
  },
  components: {
    'actions-modal': require('components/ActionsModal').default
  },
  created() {
    this.getCurrentDate();
  },
}
</script>

<style lang="scss" scoped>

#calendar {
  user-select: none;
  color: $grey-4;

  header {
    padding: 0.7rem 0;
    display: flex;
    flex-flow: column;
    justify-content: center;
    text-align: center;
    overflow: hidden;
    color: $grey-2;
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
      font-size: 1.5rem;
    }
  }

  .content {
    height: 100%;

    .weekdays {
      text-align: center;
      padding: 0.5rem 0;
      display: grid;
      grid-template-columns: repeat(7, minmax(20px, 1fr));
      background-color: $secondary-700;
      color: $grey-2;
    }

    .date {
      display: grid;
      grid-template-columns: repeat(7, minmax(20px, 1fr));
      height: 100%;
      background-color: $primary-500;

      .active {
        background-color: $secondary;
        color: #2A4C50;
      }

      .calendar-days {
        display: flex;
        flex-flow: column;
        justify-content: center;
        text-align: center;
        height: 70px;
        border-left: 1px solid $primary;
        border-bottom: 1px solid $primary;

        .weight {
          display: flex;
          justify-content: space-between;
          padding: 0 1.5rem;
        }
      }

      .day {
        cursor: pointer;
        transition: background-color 0.4s;
        font-size: 1rem;

        &:hover {
          background-color: $secondary;
          color: #2A4C50;
        }
      }

      .day-hidden {
        color: $grey-9;
      }
    }
  }
}

@media (min-width: $breakpoint-sm-min) {
  #calendar {
    .content {
      .weekdays {
        font-size: 1.2rem;
      }

      .date {
        .calendar-days {
          height: 100px;
          font-size: 1.2rem;
        }
      }
    }

    header {
      .selected-date-title {
        font-size: 1.9rem;
      }
      .current-day {
        font-size: 2rem;
      }
    }
  }
}

@media (min-width: $breakpoint-md-min) {
  #calendar {
    .content {
      .weekdays {
        font-size: 1.4rem;
      }
      .date {
        .calendar-days {
          height: 110px;
          font-size: 1.4rem;
        }
      }
    }
  }
}

@media (min-width: $breakpoint-lg-min) {

}

</style>
