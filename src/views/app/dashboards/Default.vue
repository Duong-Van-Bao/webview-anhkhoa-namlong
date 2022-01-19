<template>
  <div>
    <div
      v-if="objectData !== undefined"
      style="cursor: pointer"
    >
      <b-row>
        <b-colxx xxs="12">
          <h1><strong>{{ objectData.formName }}</strong></h1>
          <div class="separator mb-5"></div>
        </b-colxx>
      </b-row>
      <b-row>
        <b-colxx
          lg="8"
          md="12"
          class="mb-4"
        >
          <b-card :title="$t('dashboards.chart-station')">
            <b-row>
              <b-colxx md="4">
                <b-form-group :label="$t('dashboards.station') + ':'">
                  <b-form-select
                    v-model="selectedStation"
                    :options="optionStation"
                    size="sm"
                    @change="loadDataChart(selectedStation, fromDate, toDate)"
                  ></b-form-select>
                </b-form-group>
              </b-colxx>
              <b-colxx md="4">
                <b-form-group :label="$t('dashboards.from-date') + ':'">
                  <b-form-datepicker
                    locale="vi"
                    v-model="fromDate"
                    @input="loadDataChart(selectedStation, fromDate, toDate)"
                  ></b-form-datepicker>
                </b-form-group>
              </b-colxx>
              <b-colxx md="4">
                <b-form-group :label="$t('dashboards.to-date') + ':'">
                  <b-form-datepicker
                    locale="vi"
                    v-model="toDate"
                    @input="loadDataChart(selectedStation, fromDate, toDate)"
                  ></b-form-datepicker>
                </b-form-group>
              </b-colxx>
              <b-colxx md="12">
                <div id="chart-line">
                  <vue-apex-chart
                    type="area"
                    width="100%"
                    height="400px"
                    :options="lineChartOptions"
                    :series="lineSeries"
                  ></vue-apex-chart>
                </div>
              </b-colxx>
            </b-row>
          </b-card>
        </b-colxx>
        <b-colxx
          lg="4"
          md="12"
          class="mb-4"
        >
          <b-card :title="$t('dashboards.calendar')">
            <calendar-view
              style="min-height:500px"
              :show-date="calendar.showDate"
            >
              <calendar-view-header
                slot="header"
                slot-scope="t"
                :header-props="t.headerProps"
                @input="setShowDate"
              />
            </calendar-view>
          </b-card>
        </b-colxx>
      </b-row>
      <template v-if="dataDashboard !== null && dataDashboard.length > 0">
        <template v-for="(data, key) in dataDashboard">
          <b-row
            class="mt-2"
            :key="key"
          >
            <b-colxx xxs="12">
              <h5 class="text-muted"><strong>{{
              data.Name.toUpperCase() }}</strong></h5>
              <div class="separator mb-5"></div>
            </b-colxx>
            <b-colxx
              lg="6"
              md="12"
              class="mb-4"
            >
              <template v-if="data.TotalProperties !== null && data.TotalProperties.length > 0">
                <template v-for="(s,index) in data.TotalProperties">
                  <b-row :key="index">
                    <b-colxx
                      md="12"
                      class="mb-4"
                    >
                      <gradient-with-radial-progress-card
                        icon="iconsminds-monitoring"
                        :title="`${s.Total} ${$t('dashboards.station-total')}`"
                        :detail="$t('dashboards.station-total-description')"
                        :percent="(s.Total / s.Total) * 100"
                        :progressText="s.Total"
                        style="background-image: linear-gradient(to right top, #104978, #3582b2, #3693ce);"
                      />
                    </b-colxx>
                    <b-colxx
                      md="12"
                      class="mb-4"
                    >
                      <gradient-with-radial-progress-card
                        icon="iconsminds-idea"
                        :title="`${s.Actived} ${$t('dashboards.station-active')}`"
                        :detail="$t('dashboards.station-active-description')"
                        :percent="(s.Actived / s.Total) * 100"
                        :progressText="`${s.Actived} / ${s.Total}`"
                        style="background-image: linear-gradient(to right top, #576a3d, #73904c, #7baa39);"
                      />
                    </b-colxx>
                    <b-colxx
                      md="12"
                      class="mb-4"
                    >
                      <gradient-with-radial-progress-card
                        icon="iconsminds-danger"
                        :title="`${s.Error} ${$t('dashboards.station-error')}`"
                        :detail="$t('dashboards.station-error-description')"
                        :percent="(s.Error / s.Total) * 100"
                        :progressText="`${s.Error} / ${s.Total}`"
                        style="background-image: linear-gradient(to right top, #5d0413, #a32337, #992235);"
                      />
                    </b-colxx>
                  </b-row>
                </template>
              </template>
            </b-colxx>
            <b-colxx
              lg="6"
              md="12"
              class="mb-4"
            >
              <b-card :title="$t('dashboards.follow-station')">
                <vue-perfect-scrollbar
                  class="scroll dashboard-list-station"
                  :settings="{ suppressScrollX: true, wheelPropagation: false }"
                >
                  <follow-station
                    v-for="(value ,index) in data.MonitorProperties"
                    :value="value"
                    :key="index"
                  />
                </vue-perfect-scrollbar>
              </b-card>
            </b-colxx>
          </b-row>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import handling from '../../../function/handling'
import methods from '../../../function/api'
import { timer } from '@/constants/services'
import moment from 'moment'
import 'moment-timezone'
import { CalendarView, CalendarViewHeader, CalendarMathMixin } from 'vue-simple-calendar'
import FollowStation from '../../../components/Listing/FollowStation'
import GradientCard from '../../../components/Cards/GradientCard'
import GradientWithRadialProgressCard from '../../../components/Cards/GradientWithRadialProgressCard'
import VueApexCharts from 'vue-apexcharts'


String.prototype.allReplace = function (obj) {
  var retStr = this;
  for (var i in obj) {
    retStr = retStr.replace(new RegExp(i, 'g'), obj[i]);
  }
  return retStr;
}

export default {
  components: {
    'calendar-view': CalendarView,
    'calendar-view-header': CalendarViewHeader,
    'follow-station': FollowStation,
    'gradient-card': GradientCard,
    'vue-apex-chart': VueApexCharts,
    'gradient-with-radial-progress-card': GradientWithRadialProgressCard,
  },
  mixins: [CalendarMathMixin],
  data () {
    return {
      menuRight: [],
      dataDashboard: [],
      calendar: {
        showDate: this.thisMonth(1),
      },
      selectedStation: null,
      optionStation: [],
      fromDate: moment(new Date()).format("YYYY-MM-DD"),
      toDate: moment(new Date()).format("YYYY-MM-DD"),
      lineSeries: [],
      lineChartOptions: {
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          }
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center'
        },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false,
            datetimeFormatter: {
              year: 'yyyy',
              month: 'MM',
              day: 'DD',
              hour: 'HH:mm',
              minute: 'HH:mm'
            }
          }
        },
        tooltip: {
          x: {
            format: "HH:mm dd/MM/yyyy",
          },
          fixed: {
            enabled: false,
            position: 'topRight'
          },
        },
      },
    }
  },
  methods: {
    loadDataChart (select, from, to) {
      let body = {
        StationID: select,
        FrmDate: from.allReplace({ '-': '/' }),
        ToDate: to.allReplace({ '-': '/' })
      }
      methods.post("/api/Charts/GetChartData", body).then(val => {
        if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
          let resultChart = val.Result
          this.lineSeries = []
          if (resultChart && resultChart.length > 0) {
            for (let i = 0; i < resultChart.length; i++) {
              let obj = {
                name: resultChart[i].IndicatorName + ' (' + resultChart[i].UnitName + '): ',
                data: []
              }
              let objData = resultChart[i].ChartDetailList
              if (objData && objData.length > 0) {
                for (let j = 0; j < objData.length; j++) {
                  obj.data.push([this.convertDateToTimeStamp(objData[j].ItemDate), parseFloat(objData[j].IndicatorValue)])
                }
              }
              this.lineSeries.push(obj)
            }
          }
        } else {
          this.lineSeries = []
        }
      }).catch(err => {
        console.log(err);
      })
    },
    thisMonth (d, h, m) {
      const t = new Date()
      return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
    },
    setShowDate (d) {
      this.calendar.showDate = d
    },
    getListMenuRight () {
      methods.post("/api/menu/GetMenuRightByGroupID", { GroupID: this.$store.getters.currentUser.GroupID.toString() }).then(val => {
        if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
          this.menuRight = val.Result
        } else {
          this.menuRight = []
        }
      }).catch(err => {
        console.log(err);
      })
    },
    getDataDashboard () {
      methods.post("/api/Dashboard/GetDashboard", {}).then(val => {
        if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
          this.dataDashboard = val.Result
          if (this.dataDashboard.length > 0) {
            let arr = []
            for (let i = 0; i < this.dataDashboard.length; i++) {
              let stationList = this.dataDashboard[i].MonitorProperties
              if (stationList !== null && stationList.length > 0) {
                for (let j = 0; j < stationList.length; j++) {
                  let obj = {
                    value: stationList[j].StationID,
                    text: stationList[j].StationName
                  }
                  arr.push(obj)
                }
              }
            }
            this.optionStation = arr
            this.selectedStation = this.optionStation[0].value
            this.loadDataChart(this.selectedStation, this.fromDate, this.toDate)
          }
        } else {
          this.dataDashboard = []
        }
      }).catch(err => {
        console.log(err);
      })
    },
    timerLoadDashboard (time) {
      this.getDataDashboard()
      setTimeout(() => {
        this.timerLoadDashboard(time)
      }, time)
    },
    convertDateToTimeStamp (date) {
      return moment(date).tz('Asia/Ho_Chi_Minh').format().valueOf()
    }
  },
  async created () {
    await this.getListMenuRight()
    await this.timerLoadDashboard(timer * 240)
  },
  computed: {
    userIDCurrent: function () {
      return this.$store.getters.currentUser.UserID.toString()
    },
    objectData: function () {
      for (let i = 0; i < this.menuRight.length; i++) {
        if (this.$route.fullPath === this.menuRight[i].Link) {
          return {
            menuIDCurrent: this.menuRight[i].MenuID.toString(),
            formName: this.menuRight[i].MenuName.toUpperCase(),
            accessWrite: handling.convertBitToBoolean(this.menuRight[i].AccessWrite)
          }
        }
      }
    }
  },
  mounted () {
  }
}
</script>
<style>
.dashboard-list-station {
  /*min-height: 165px;*/
  /*max-height: 538px;*/
  height: 538px;
}
</style>
