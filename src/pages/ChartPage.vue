<template>
  <q-card :flat="cardShadow" class="chart-card" dark>
    <q-card-section class="toggle-btns-wrapper row justify-center q-pb-sm q-px-none">
      <q-btn-toggle
        v-model="selection"
        push
        color="secondary"
        text-color="primary"
        toggle-color="secondary-300"
        toggle-text-color="primary"
        :options="toggleBtnOptions"
      />
    </q-card-section>

    <q-card-section class="q-px-none q-pb-none">
      <div id="chart-timeline">
        <apexchart
          class="ch"
          ref="chart"
          width="100%"
          :height="this.height"
          :options="options"
          :series="series"
        ></apexchart>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import {date, useQuasar} from "quasar";
import {mapGetters} from "vuex";

export default {
  name: 'ChartPage',
  data() {
    return {
      selection: 'one_week',
      series: [{
        name: 'weights',
        data: []
      }],
      height: 650,
      options: {
        noData: {
          text: 'No data'
        },
        chart: {
          /*   redrawOnWindowResize: true,
             redrawOnParentResize: true,*/
          toolbar: {show: false},
          type: 'area',
          zoom: {
            enabled: false,
            autoScaleYAxis: true
          }
        },
        colors: ['#41B983FF'],
        title: {
          text: 'Weight chart',
          align: 'center',
          style: {
            color: '#41B983FF',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: 'Nunito sans'
          },
        },
        fill: {
          colors: '#41B983FF',
          type: 'gradient',
          gradient: {
            inverseColors: true,
            shade: 'dark',
            shadeIntensity: 1,
            opacityFrom: 0.6,
            opacityTo: 0.8,
          }
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '1rem',
            fontFamily: 'Nunito sans',
            colors: ['white']
          },
          offsetY: -10,
          background: {enabled: false,},
        },
        grid: {
          borderColor: '#363636',
          strokeDashArray: 8,
        },
        stroke: {
          width: 3,
          curve: 'smooth',
        },
        markers: {
          size: 4,
          strokeWidth: 2,
          strokeOpacity: 0.7,
          colors: '#41B983FF',
          hover: {
            size: 8,
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: '#41B983FF',
              fontSize: '1rem',
              fontFamily: 'Nunito sans',
            },
            formatter: (y) => {
              if (typeof y !== "undefined") {
                return parseInt(y) + " kg";
              }
              return y;
            }
          },
        },
        xaxis: {
          type: 'datetime',
          tooltip: {
            enabled: false,
          },
          min: new Date(new Date().setDate(new Date().getDate() - 7)).getTime(),
          max: new Date().getTime(),
          axisTicks: {
            show: true,
            height: 4,
          },
          labels: {
            style: {
              colors: '#41B983FF',
              fontSize: '0.8rem',
              fontFamily: 'Nunito sans'
            },
          },
        },
        tooltip: {
          theme: 'dark',
          style: {
            fontSize: '1rem',
            fontFamily: 'Nunito sans'
          },
          marker: {
            show: true
          },

          intersect: false,
          shared: false,
          x: {
            formatter: (x) => date.formatDate(new Date(x), 'DD MMM YYYY')
          },
          y: {
            formatter: (y) => {
              if (typeof y !== "undefined") {
                return y + " kg";
              }
              return y;
            }
          },
        },
        responsive: [{
          breakpoint: 599,
          options: {
            title: {
              style: {
                fontSize: '20px',
              }
            },
            chart: {
              height: 400,
            },
            dataLabels: {
              enabled: false
            },
            markers: {
              size: 0
            },
            stroke: {
              width: 1
            },
            yaxis: {
              labels: {
                style: {
                  colors: '#41B983FF',
                  fontSize: '0.8rem',
                },
                formatter: (y) => parseInt(y)
              },
            },
          },
        }],
      },
    }
  },
  methods: {
    updateChart() {
      const newData = []
      this.weights.forEach(weight => {
        newData.unshift([
          weight.date,
          parseFloat(weight.weight)
        ])
      })
      console.log(this.weights)
      this.series = [{
        name: 'Weight',
        data: newData
      }]
      this.setXaxis()
    },
    setXaxis() {
      this.options = {
        ...this.options,
        ...{
          xaxis: {
            type: 'datetime',
            tooltip: {
              enabled: false,
            },
            min: new Date(new Date().setDate(new Date().getDate() - 7)).getTime(),
            max: this.series[0].data.length > 0
              ? this.series[0].data[this.series[0].data.length - 1][0].getTime()
              : new Date().getTime(),
            axisTicks: {
              show: true,
              height: 4,
            },
            labels: {
              style: {
                colors: '#41B983FF',
                fontSize: '0.8rem',
                fontFamily: 'Nunito sans'
              },
            },
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters('myStore', ['weights']),
    toggleBtnOptions: () => useQuasar().screen.gt.xs
      ? [
        {label: '1 Week', value: 'one_week'},
        {label: '1 Month', value: 'one_month'},
        {label: '6 Months', value: 'six_months'},
        {label: '1 Year', value: 'one_year'},
        {label: 'Year to date', value: 'ytd'},
        {label: 'ALL', value: 'all'}
      ]
      : [
        {label: '1W', value: 'one_week'},
        {label: '1M', value: 'one_month'},
        {label: '6M', value: 'six_months'},
        {label: '1Y', value: 'one_year'},
        {label: 'YTD', value: 'ytd'},
        {label: 'ALL', value: 'all'},
      ],
    // remove shadow of card on smaller screens
    cardShadow: () => useQuasar().screen.lt.sm
  },
  watch: {
    weights: {
      deep: true,
      handler() {
        this.updateChart()
      }
    },
    selection() {
      if (this.weights.length === 0) {
        return
      }

      const oldestWeightDate = this.weights[this.weights.length - 1].date
      const mostRecentWeightDate = this.weights[0].date

      switch (this.selection) {
        case 'one_week':
          /* this.$refs.chart.zoomX(
             new Date(new Date().setDate(new Date().getDate() - 7)).getTime(),
             mostRecentWeightDate.getTime()
           )*/
          this.options = {
            ...this.options,
            ...{
              dataLabels: {
                enabled: true,
              },
              xaxis: {
                type: 'datetime',
                min: new Date(new Date().setDate(new Date().getDate() - 7)).getTime(),
                max: mostRecentWeightDate.getTime(),
                axisTicks: {
                  show: true,
                  height: 4,
                },
                labels: {
                  style: {
                    colors: '#41B983FF',
                  },
                },
              }
            }
          }
          break
        case 'one_month':
          /*  this.$refs.chart.zoomX(
              new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime(),
              mostRecentWeightDate.getTime()
            )*/
          this.options = {
            ...this.options,
            ...{
              dataLabels: {
                enabled: true,
              },
              xaxis: {
                type: 'datetime',
                min: new Date(new Date().setMonth(new Date().getMonth() - 1)).getTime(),
                max: mostRecentWeightDate.getTime(),
                axisTicks: {
                  show: true,
                  height: 4,
                },
                labels: {
                  style: {
                    colors: '#41B983FF',
                  },
                },
              }
            }
          }
          break
        case 'six_months': {
          /*this.$refs.chart.zoomX(
            new Date(new Date().setMonth(new Date().getMonth() - 6)).getTime(),
            mostRecentWeightDate.getTime()
          )*/
          this.options = {
            ...this.options,
            ...{
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                type: 'datetime',
                min: new Date(new Date().setMonth(new Date().getMonth() - 6)).getTime(),
                max: mostRecentWeightDate.getTime(),
                axisTicks: {
                  show: true,
                  height: 4,
                },
                labels: {
                  style: {
                    colors: '#41B983FF',
                  },
                },
              }
            }
          }
          break
        }
        case 'one_year':
          /*  this.$refs.chart.zoomX(
              new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getTime(),
              mostRecentWeightDate.getTime()
            )*/
          this.options = {
            ...this.options,
            ...{
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                type: 'datetime',
                min: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getTime(),
                max: mostRecentWeightDate.getTime(),
                axisTicks: {
                  show: true,
                  height: 4,
                },
                labels: {
                  style: {
                    colors: '#41B983FF',
                  },
                },
              }
            }
          }
          break
        case 'ytd':
          /*    this.$refs.chart.zoomX(
                new Date(new Date().getFullYear(), 0, 1).getTime(),
                mostRecentWeightDate.getTime()
              )*/
          this.options = {
            ...this.options,
            ...{
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                type: 'datetime',
                min: new Date(new Date().getFullYear(), 0, 1).getTime(),
                max: mostRecentWeightDate.getTime(),
                axisTicks: {
                  show: true,
                  height: 4,
                },
                labels: {
                  style: {
                    colors: '#41B983FF',
                  },
                },
              }
            }
          }
          break
        case 'all':
          /*this.$refs.chart.zoomX(
            // between the date of the first and last elements in array = all weights
            oldestWeightDate.getTime(),
            mostRecentWeightDate.getTime()
          )*/
          this.options = {
            ...this.options,
            ...{
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                type: 'datetime',
                min: oldestWeightDate.getTime(),
                max: mostRecentWeightDate.getTime(),
                axisTicks: {
                  show: true,
                  height: 4,
                },
                labels: {
                  style: {
                    colors: '#41B983FF',
                  },
                },
              }
            }
          }
          break
        default:
      }
    }
  },
  components: {
    apexchart: VueApexCharts,
  },
  created() {
    this.updateChart()
  },
}
</script>

<style lang='scss'>
.apexcharts-data-labels:nth-last-child(1) {
  transform: translateX(-20px)
}

.chart-card {
  background-color: $primary;

  .q-btn-toggle {
    margin-top: 0.3rem;
  }
}

.toggle-btns-wrapper {
  .q-btn {
    font-size: 0.8rem;
  }
}

@media (min-width: $breakpoint-sm-min) {
  .chart-card {
    margin: 2rem 2rem 0 2rem;
    background-color: $primary-400;

    .toggle-btns-wrapper {
      padding-right: 0.5rem;
      justify-content: end;

      .q-btn {
        font-size: 0.79rem;
      }
    }
  }
}

@media (min-width: $breakpoint-md-min) {
  .chart-card {
    .toggle-btns-wrapper {
      .q-btn {
        font-size: 0.9rem;
      }
    }
  }
}

@media (min-width: $breakpoint-lg-min) {
  .chart-card {
    padding: 0.7rem 1rem 1rem 1rem;
    margin: 3rem 3rem 0 3rem;

    .apexcharts-xaxis-label {
      font-size: 1rem;
    }
  }
}

</style>
