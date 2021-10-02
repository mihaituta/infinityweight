<template>
  <q-card class="chart-card" dark>
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
          /* background:{
              borderWidth: 0
           },*/
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
          onClick: () => {
            // do something on marker click
          }
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
        tooltip: {
          /*  custom: function({series, seriesIndex, dataPointIndex, w}) {
              return '<div class="arrow_box">' +
                '<span>' + series[seriesIndex][dataPointIndex] + '</span>' +
                '</div>'
            },*/
          theme: 'dark',
          style: {
            fontSize: '1rem',
            fontFamily: 'Nunito sans'
          },
          marker: {
            show: true
          },
          // fillSeriesColor: true,
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
      this.series = [{
        name: 'Weight',
        data: newData
        /*      data: [
                72.1,
                76.0,
                87.8,
                76.9,
                83.3,
                71.1,
                74.6,
                80.2,
                90.7,
                90.5,
                72.7,
                80.1,
                76.4,
                81.6,
                82.0,
                77.3,
                70.8,
                78.4,
                70.9,
                82.1,
                83.2,
                73.0,
                90.7,
                75.5,
                82.8,
                75.7,
                85.0,
                85.3,
                89.8,
                70.2,
                88.2,
                76.8,
                80.5,
                73.7,
                74.1,
                86.9,
                85.6,
                80.5,
                76.4,
                82.4,
                86.0,
                72.3,
                80.0,
                79.9,
                73.7,
                87.9,
                87.3,
                79.8,
                84.0,
                81.0,
                76.9,
                71.4,
                82.1,
                70.1,
                74.6,
                81.9,
                80.4,
                72.0,
                77.2,
                75.6,
                76.0,
                84.1,
                87.6,
                72.8,
                76.2,
                79.3,
                79.9,
                81.7,
                74.5,
                88.3,
                70.5,
                73.0,
                80.6,
                88.3,
                89.3,
                77.4,
                90.6,
                85.5,
                82.5,
                71.0,
                82.7,
                71.4,
                83.2,
                72.9,
                85.0,
                86.3,
                88.5,
                89.8,
                76.4,
                75.0,
                78.3,
                76.4,
                75.7,
                82.2,
                79.8,
                89.4,
                83.4,
                87.5,
                83.7,
                82.5,
                82.0,
                89.6,
                77.8,
                74.3,
                81.7,
                80.6,
                91.0,
                77.0,
                72.4,
                73.4,
                82.2,
                72.3,
                75.1,
                88.0,
                73.0,
                72.6,
                82.5,
                82.2,
                83.5,
                85.6,
                75.5,
                87.3,
                76.3,
                87.6,
                72.4,
                78.6,
                81.2,
                71.0,
                76.4,
                83.2,
                83.7,
                75.2,
                81.7,
                80.8,
                85.8,
                85.5,
                89.8,
                86.6,
                75.7,
                90.6,
                78.2,
                82.3,
                80.1,
                85.5,
                70.3,
                74.0,
                85.9,
                75.6,
                81.2,
                86.5,
                78.9,
                85.9,
                81.4,
                90.9,
                82.1,
                86.4,
                71.2,
                90.3,
                89.0,
                76.5,
                79.2,
                80.8,
                71.1,
                80.7,
                80.9,
                72.5,
                74.5,
                78.5,
                86.1,
                79.8,
                86.3,
                77.6,
                74.8,
                78.2,
                83.8,
                82.6,
                85.1,
                71.6,
                86.9,
                83.5,
                75.7,
                72.4,
                75.5,
                79.4,
                73.1,
                83.3,
                70.1,
                75.6,
                70.8,
                89.5,
                73.2,
                90.4,
                77.4,
                84.8,
                77.9,
                90.8,
                71.9,
                88.8,
                88.0,
                78.2,
                90.4,
                73.9,
                79.3,
                76.2,
                90.5,
                87.8,
                88.7,
                79.5,
                88.3,
                88.3,
                85.4,
                73.7,
                79.6,
                81.3,
                75.0,
                78.5,
                84.3,
                90.9,
                81.4,
                84.7,
                77.0,
                90.1,
                78.8,
                82.3,
                72.8,
                86.3,
                88.2,
                73.4,
                71.0,
                80.7,
                90.8,
                70.5,
                73.5,
                77.9,
                82.9,
                77.4,
                88.0,
                88.2,
                76.2,
                80.2,
                71.0,
                76.2,
                88.4,
                82.8,
                86.4,
                78.2,
                70.4,
                87.0,
                82.6,
                89.4,
                88.0,
                88.8,
                87.9,
                81.0,
                79.1,
                82.9,
                82.1,
                88.7,
                77.9,
                86.9,
                83.6,
                70.7,
                70.2,
                81.0,
                86.6,
                80.5,
                73.7,
                77.8,
                87.1,
                81.8,
                70.4,
                77.4,
                85.6,
                72.8,
                78.0,
                89.7,
                86.9,
                89.8,
                84.4,
                74.2,
                86.4,
                84.6,
                70.7,
                85.1,
                89.0,
                89.5,
                72.6,
                88.4,
                78.3,
                87.6,
                84.7,
                75.1,
                84.8,
                84.1,
                79.9,
                71.9,
                86.5,
                80.5,
                81.2,
                86.8,
                84.5,
                78.2,
                76.7,
                85.0,
                78.4,
                89.5,
                84.9,
                84.4,
                81.9,
                74.6,
                71.3,
                87.4,
                81.7,
                71.2,
                81.2,
                80.0,
                82.4,
                75.5,
                82.8,
                86.6,
                77.8,
                76.5,
                88.3,
                83.3,
                78.3,
                78.2,
                84.0,
                74.9,
                90.1,
                89.5,
                86.9,
                79.0,
                73.4,
                78.8,
                75.8,
                79.2,
                88.9,
                74.5,
                73.2,
                84.0,
                87.0,
                78.4,
                77.3,
                72.9,
                77.1,
                86.8,
                86.3,
                71.2,
                80.0,
                76.2,
                90.0,
                84.9,
                74.4,
                90.7,
                82.9,
                70.8,
                72.7,
                74.3,
                70.1,
                90.2,
                82.6,
                81.5,
                87.9,
                82.2,
                71.2,
              ]*/
      }]
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
            // tickAmount: 6,
            // tooltip: {
            //   enabled: false
            // },
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
              /*  formatter: (val, timestamp) => {
                  return date.formatDate(new Date(timestamp), 'DD MMM YYYY')
                }*/
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
      ]
  },
  watch: {
    weights: {
      deep: true,
      handler() {
        this.updateChart()
      }
    }
    ,
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
  }
  ,
  components: {
    apexchart: VueApexCharts,
  }
  ,
  created() {
    this.updateChart()
    this.setXaxis()
  }
  ,
}
</script>

<style lang='scss'>
.apexcharts-data-labels:nth-last-child(1) {
  transform: translateX(-20px)
}

.chart-card {
  background-color: $primary-500;

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
