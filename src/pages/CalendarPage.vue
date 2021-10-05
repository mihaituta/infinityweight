<template>
  <q-page>
    <div id="calendar" class="full-width">
      <header>
        <div class="current-day">
          {{ `${weekdays[currentDay]}, ${month[currentDate.month]} ${currentDate.date}` }}
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
          <div class="day-hidden" v-for="(n, index) in (firstMonthDay -1)" :key="'prev'+index">
            {{ (prevMonthDays + 1) - firstMonthDay + n }}
          </div>
          <div class="day"
               :class="{ active: n === currentDate.date}"
               @click="currentDate.date = n"
               v-for="(n, index) in currentMonthDays"
               :key="'day'+index">
            {{ n }}

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
export default {
  data: function () {
    return {
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
    }
  },
  methods: {
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
    },
    monthDown() {
      if (this.currentDate.month === 0) {
        this.currentDate.month = 11;
        this.currentDate.year -= 1;
      } else {
        this.currentDate.month -= 1;
      }
    }
  },
  created() {
    this.getCurrentDate();
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
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #fff;
  }
}

#calendar {

  //width: 500px;
  //height: 730px;
  //border-radius: 5px;

  background-size: cover;
  user-select: none;

  .content {
    height: 100%;
  }

  .weekdays {
    @include calendar-layout(15px 0 15px);
    background-color: $secondary-700;

    /*div:nth-child(7n) {
      color: #D43541;
    }*/
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

      /*   &:nth-child(7n) {
           color: #D43541;

           &:hover {
             background-color: $secondary;
             color: #D43541;
           }
         }*/
    }

    .day-hidden {
      opacity: .3;

      /* &:nth-child(7n) {
         color: #D43541;
       }*/
    }
  }
}

header {
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
      height: 700px;
    }
  }
}

</style>

<!--
<template>
  <q-card dark class="q-ma-xl">
    <q-card-section>
      <div class="container">
        <div class="calendar">
          <div class="month">
            <i class="fas fa-angle-left prev"></i>
            <div class="date">
              <h1></h1>
              <p></p>
            </div>
            <i class="fas fa-angle-right next"></i>
          </div>
          <div class="weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div class="days"></div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu','Fri', 'Sat','Sun'],
      weekdayNames: ['Sunday',]
    }
  },
  methods: {
  /*  calendar() {
      const date = new Date();

      const renderCalendar = () => {
        date.setDate(1);

        const monthDays = document.querySelector(".days");

        const lastDay = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDate();

        const prevLastDay = new Date(
          date.getFullYear(),
          date.getMonth(),
          0
        ).getDate();

        const firstDayIndex = date.getDay();

        const lastDayIndex = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDay();

        const nextDays = 7 - lastDayIndex - 1;

        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        document.querySelector(".date h1").innerHTML = months[date.getMonth()];

        document.querySelector(".date p").innerHTML = new Date().toDateString();

        let days = "";

        for (let x = firstDayIndex; x > 0; x&#45;&#45;) {
          days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
        }

        for (let i = 1; i <= lastDay; i++) {
          if (
            i === new Date().getDate() &&
            date.getMonth() === new Date().getMonth()
          ) {
            days += `<div class="today">${i}</div>`;
          } else {
            days += `<div>${i}</div>`;
          }
        }

        for (let j = 1; j <= nextDays; j++) {
          days += `<div class="next-date">${j}</div>`;
          monthDays.innerHTML = days;
        }
      };

      document.querySelector(".prev").addEventListener("click", () => {
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
      });

      document.querySelector(".next").addEventListener("click", () => {
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
      });

      renderCalendar();
    }*/
  },
  mounted() {

  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100vh;
  background-color: #12121f;
  color: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar {
  width: 45rem;
  height: 52rem;
  background-color: #222227;
  box-shadow: 0 0.5rem 3rem rgba(0, 0, 0, 0.4);
}

.month {
  width: 100%;
  height: 12rem;
  background-color: #167e56;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  text-align: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.5);
}

.month i {
  font-size: 2.5rem;
  cursor: pointer;
}

.month h1 {
  font-size: 3rem;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  margin-bottom: 1rem;
}

.month p {
  font-size: 1.6rem;
}

.weekdays {
  width: 100%;
  height: 5rem;
  padding: 0 0.4rem;
  display: flex;
  align-items: center;
}

.weekdays div {
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.1rem;
  width: calc(44.2rem / 7);
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.5);
}

.days {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0.2rem;
}

.days div {
  font-size: 1.4rem;
  margin: 0.3rem;
  width: calc(40.2rem / 7);
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 0 0.3rem 0.5rem rgba(0, 0, 0, 0.5);
  transition: background-color 0.2s;
}

.days div:hover:not(.today) {
  background-color: #262626;
  border: 0.2rem solid #777;
  cursor: pointer;
}

.prev-date,
.next-date {
  opacity: 0.5;
}

.today {
  background-color: #167e56;
}
</style>
-->
