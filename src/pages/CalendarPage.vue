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

    <div id="calendar">
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

            <div v-if="getWeight(day) && getWeight(day).weightDiff === 0" class="text-grey-5">
              {{ getWeight(day).weight }}
              <span class="gt-xs">kg</span>
            </div>

            <div v-else-if="getWeight(day) && getWeight(day).weightDiff < 0" class="weight">
              <div class="text-secondary-400">
                {{ getWeight(day).weight }}
                <span class="gt-xs">kg</span>
              </div>

              <div class="weightDiff q-pl-xs text-secondary flex items-center gt-md">
                <q-icon size="1.3rem" name="south"/>
                <!-- turn the string into a positive number (weight loss is a negative number in database)
                 and get rid of '-' when it is displayed -->
                {{ -getWeight(day).weightDiff }}kg
              </div>
            </div>

            <div v-else-if="getWeight(day) && getWeight(day).weightDiff > 0" class="weight">
              <div class="text-negative-400">
                {{ getWeight(day).weight }}
                <span class="gt-xs">kg</span>
              </div>

              <div class="weightDiff q-pl-xs text-negative flex items-center gt-md">
                <q-icon size="1.3rem" name="north"/>
                <!-- turn the string into a number to get rid of the zero after coma Ex: 35.0 -> 35 -->
                {{ +getWeight(day).weightDiff }}kg
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
      const weightObj = this.weights.find(weight =>  weight.date.toLocaleDateString() === selectedDate.toLocaleDateString())
      if (weightObj !== undefined) {
        return {
          weight: weightObj.weight,
          weightDiff: weightObj.weightDiff,
        }
      }
    },
    weightActions(date) {
      this.currentDate.date = date
      const selectedDay = this.currentDate.year + '/' + (this.currentDate.month + 1) + '/' + date
      const selectedDate = new Date(selectedDay)
      const weight = this.weights.find(weight => weight.date.toLocaleDateString() === selectedDate.toLocaleDateString())
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
.q-page {
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
        border-bottom: 1px solid $primary;
      }

      .date {
        display: grid;
        grid-template-columns: repeat(7, minmax(20px, 1fr));
        height: 100%;
        background-color: $primary-400;
        border-right: 1px solid $primary;

        .active {
          background-color: $secondary-700;
          text-shadow: 1px 1px 1px $primary,
          1px -1px 1px $primary,
          -1px 1px 1px $primary,
          -1px -1px 1px $primary;
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
            text-align: center;
          }
        }

        .day {
          cursor: pointer;
          transition: all 0.4s;
          transition-property: background-color, text-shadow;
          font-size: 1rem;

          &:hover {
            background-color: $secondary-700;
            color: #2A4C50;
            text-shadow: 1px 1px 1px $primary,
            1px -1px 1px $primary,
            -1px 1px 1px $primary,
            -1px -1px 1px $primary;
          }

          .weightDiff {
            font-size: 1.1rem;
          }
        }

        .day-hidden {
          color: $grey-9;
        }
      }
    }
  }
}

@media (min-width: $breakpoint-sm-min) {
  .q-page {
    padding: 2rem;

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
}

@media (min-width: $breakpoint-md-min) {
  .q-page {
    #calendar {
      .content {
        .weekdays {
          font-size: 1.4rem;
        }

        .date {
          .calendar-days {
            height: 100px;
            font-size: 1.4rem;
          }
        }
      }

      header {
        .selected-date-title {
          div {
            .arrow {
              font-size: 2.4rem;
            }
          }
        }
      }
    }
  }
}

@media (min-width: $breakpoint-lg-min) {
  .q-page {
    padding: 3rem;

    #calendar {
      .content {
        .weight {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
        }
      }
    }
  }
}

</style>
