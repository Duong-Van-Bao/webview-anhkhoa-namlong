<template>
  <div v-if="objectData !== undefined">
    <b-row>
      <b-colxx xxs="12">
        <h1><strong>{{ objectData.formName }}</strong></h1>
        <div class="top-right-button-container">
          <b-button-group>
            <b-dropdown right :text="$t('dropdown.action')" variant="primary">
              <b-dropdown-item @click="infoModal(selectedItems)" v-if="selectedItems.length === 1">
                <i class="fad fa-info-circle"></i>&emsp;{{$t('pages.info')}}
              </b-dropdown-item>
              <b-dropdown-item v-else disabled>
                <i class="fad fa-info-circle"></i>&emsp;{{$t('pages.info')}}
              </b-dropdown-item>
            </b-dropdown>
          </b-button-group>
        </div>
        <div class="mb-2 mt-2">
        </div>
        <div class="separator mb-5"></div>
      </b-colxx>
    </b-row>
    <b-row>
      <b-colxx xxs="12">
        <b-card>
          <custom-table :data-table="items" :field-table="fields" :column-show="listColumnShow"
                        :access-write="objectData.accessWrite" :select-mode="selectMode"
                        @row-selected="rowSelected"></custom-table>
        </b-card>
      </b-colxx>
    </b-row>
    <b-modal id="modal-item" v-if="dataModal !== null" hide-header size="xl" ok-only centered scrollable
             @hide="resetModal">
      <b-row>
        <b-colxx md="12">
          <h3 class="text-center font-weight-bold">
            {{dataModal.StationName.toUpperCase()}}
          </h3>
          <p class="text-center">
            <span class="font-italic">{{$t('map.address') + ': ' }}</span>
            <span class="font-weight-bold">{{dataModal.StationAddress}}</span>
            <span>/</span>
            <span class="font-italic">{{$t('map.lng') + ' - ' + $t('map.lat') + ': ' }}</span>
            <span class="font-weight-bold">{{dataModal.Long + ', ' + dataModal.Lat}}</span>
            <span>/</span>
            <span class="font-italic">{{$t('map.update-time') + ': ' }}</span>
            <span class="text-danger font-weight-bold">{{convertDateTime(dataModal.UpdateTime)}}</span>
          </p>
        </b-colxx>
        <b-colxx md="4"></b-colxx>
        <b-colxx md="4" v-if="dataModal.StatusID === 0">
          <b-alert class="text-center led-green" style="color: white; letter-spacing: 4px;" show>
            <strong>{{dataModal.StatusName.toUpperCase()}}</strong></b-alert>
        </b-colxx>
        <b-colxx md="4" v-else>
          <b-alert class="text-center led-red" style="color: white; letter-spacing: 4px;" show>
            <strong>{{dataModal.StatusName.toUpperCase()}}</strong></b-alert>
        </b-colxx>
        <b-colxx md="4"></b-colxx>
        <b-colxx md="12">
          <b-row>
            <template v-for="monitor in dataModal.MonitorInfoProperties">
              <b-colxx md="6">
                <template v-if="monitor.IndicatorCode === 'TEMP'">
                  <template v-if="parseFloat(monitor.IndicatorValue) < 0">
                    <b-form-group :label="monitor.IndicatorName + ':'">
                      <b-progress class="w-100" :max="100" height="1.5rem" style="background-color: rgb(233, 236, 239)">
                        <b-progress-bar :striped="true" class="text-center text-uppercase font-weight-bold"
                                        style="background-color: rgb(255, 0, 50); color: black" value="100"
                                        :label="$t('map.error-sensor')"></b-progress-bar>
                      </b-progress>
                    </b-form-group>
                  </template>
                  <template v-else>
                    <template v-if="parseInt(monitor.IsWarning) === 0">
                      <b-form-group :label="monitor.IndicatorName + ': ' + monitor.WarningDescription">
                        <b-progress class="w-100" :max="100" height="1.5rem"
                                    style="background-color: rgb(233, 236, 239)">
                          <b-progress-bar :animated="animated" style="background-color: rgb(60, 179, 113); color: black"
                                          :value="parseFloat(monitor.IndicatorValue)"
                                          :label="`${parseFloat(monitor.IndicatorValue)} ºC`"></b-progress-bar>
                        </b-progress>
                      </b-form-group>
                    </template>
                    <template v-else>
                      <b-form-group :label="monitor.IndicatorName + ': ' + monitor.WarningDescription">
                        <template v-if="parseInt(monitor.IsWarning) === 1">
                          <b-progress class="w-100" :max="100" height="1.5rem"
                                      style="background-color: rgb(233, 236, 239)">
                            <b-progress-bar :animated="animated"
                                            style="background-color: rgb(255, 225, 50); color: black"
                                            :value="parseFloat(monitor.IndicatorValue)"
                                            :label="`${parseFloat(monitor.IndicatorValue)} ºC`"></b-progress-bar>
                          </b-progress>
                        </template>
                        <template v-else-if="parseInt(monitor.IsWarning) === 2">
                          <b-progress class="w-100" :max="100" height="1.5rem"
                                      style="background-color: rgb(233, 236, 239)">
                            <b-progress-bar :animated="animated"
                                            style="background-color: rgb(255, 150, 0); color: black"
                                            :value="parseFloat(monitor.IndicatorValue)"
                                            :label="`${parseFloat(monitor.IndicatorValue)} ºC`"></b-progress-bar>
                          </b-progress>
                        </template>
                        <template v-else>
                          <b-progress class="w-100" :max="100" height="1.5rem"
                                      style="background-color: rgb(233, 236, 239)">
                            <b-progress-bar :animated="animated" style="background-color: rgb(255, 0, 50); color: black"
                                            :value="parseFloat(monitor.IndicatorValue)"
                                            :label="`${parseFloat(monitor.IndicatorValue)} ºC`"></b-progress-bar>
                          </b-progress>
                        </template>
                      </b-form-group>
                    </template>
                  </template>
                </template>
                <template v-else-if="monitor.IndicatorCode === 'SAL'">
                  <template v-if="parseFloat(monitor.IndicatorValue) < 0">
                    <b-form-group :label="monitor.IndicatorName + ':'">
                      <b-progress class="w-100" :max="100" height="1.5rem" style="background-color: rgb(233, 236, 239)">
                        <b-progress-bar :striped="true" class="text-center text-uppercase font-weight-bold"
                                        style="background-color: rgb(255, 0, 50); color: black" value="100"
                                        :label="$t('map.error-sensor')"></b-progress-bar>
                      </b-progress>
                    </b-form-group>
                  </template>
                  <template v-else>
                    <template v-if="parseInt(monitor.IsWarning) === 0">
                      <b-form-group :label="monitor.IndicatorName + ': ' + monitor.WarningDescription">
                        <b-progress class="w-100" :max="100" height="1.5rem"
                                    style="background-color: rgb(233, 236, 239)">
                          <b-progress-bar :animated="animated" style="background-color: rgb(60, 179, 113); color: black"
                                          :value="parseFloat(monitor.IndicatorValue)"
                                          :label="`${parseFloat(monitor.IndicatorValue)} ‰`"></b-progress-bar>
                        </b-progress>
                      </b-form-group>
                    </template>
                    <template v-else>
                      <b-form-group :label="monitor.IndicatorName + ': ' + monitor.WarningDescription">
                        <template v-if="parseInt(monitor.IsWarning) === 1">
                          <b-progress class="w-100" :max="100" height="1.5rem"
                                      style="background-color: rgb(233, 236, 239)">
                            <b-progress-bar :animated="animated"
                                            style="background-color: rgb(255, 225, 50); color: black"
                                            :value="parseFloat(monitor.IndicatorValue)"
                                            :label="`${parseFloat(monitor.IndicatorValue)} ‰`"></b-progress-bar>
                          </b-progress>
                        </template>
                        <template v-else-if="parseInt(monitor.IsWarning) === 2">
                          <b-progress class="w-100" :max="100" height="1.5rem"
                                      style="background-color: rgb(233, 236, 239)">
                            <b-progress-bar :animated="animated"
                                            style="background-color: rgb(255, 150, 0); color: black"
                                            :value="parseFloat(monitor.IndicatorValue)"
                                            :label="`${parseFloat(monitor.IndicatorValue)} ‰`"></b-progress-bar>
                          </b-progress>
                        </template>
                        <template v-else>
                          <b-progress class="w-100" :max="100" height="1.5rem"
                                      style="background-color: rgb(233, 236, 239)">
                            <b-progress-bar :animated="animated" style="background-color: rgb(255, 0, 50); color: black"
                                            :value="parseFloat(monitor.IndicatorValue)"
                                            :label="`${parseFloat(monitor.IndicatorValue)} ‰`"></b-progress-bar>
                          </b-progress>
                        </template>
                      </b-form-group>
                    </template>
                  </template>
                </template>
                <template v-else>
                  <template v-if="parseFloat(monitor.IndicatorValue) < 0">
                    <b-form-group class="mb-0" :label="monitor.IndicatorName + ':'">
                      <b-alert class="text-center text-uppercase font-weight-bold" show
                               style="background-color: rgb(255, 0, 50); color: black">
                        {{$t('map.error-sensor')}}
                      </b-alert>
                    </b-form-group>
                  </template>
                  <template v-else>
                    <template v-if="parseInt(monitor.IsWarning) === 0">
                      <b-form-group class="mb-0" :label="monitor.IndicatorName + ': ' + monitor.WarningDescription">
                        <b-alert class="text-right" show style="background-color: rgb(233, 236, 239); color: black">
                          {{monitor.IndicatorValue + ' ' +
                          monitor.UnitName}}
                        </b-alert>
                      </b-form-group>
                    </template>
                    <template v-else>
                      <b-form-group class="mb-0" :label="monitor.IndicatorName + ': ' + monitor.WarningDescription">
                        <template v-if="parseInt(monitor.IsWarning) === 1">
                          <b-alert class="text-right" show style="background-color: rgb(255, 225, 50); color: black">
                            {{monitor.IndicatorValue + ' ' + monitor.UnitName}}
                          </b-alert>
                        </template>
                        <template v-else-if="parseInt(monitor.IsWarning) === 2">
                          <b-alert class="text-right" show style="background-color: rgb(255, 150, 0); color: black">
                            {{monitor.IndicatorValue + ' ' + monitor.UnitName}}
                          </b-alert>
                        </template>
                        <template v-else>
                          <b-alert class="text-right" show style="background-color: rgb(255, 0, 50); color: black">
                            {{monitor.IndicatorValue + ' ' + monitor.UnitName}}
                          </b-alert>
                        </template>
                      </b-form-group>
                    </template>
                  </template>
                </template>
              </b-colxx>
            </template>
            <template v-for="device in dataModal.DeviceInfoProperties">
              <template v-if="device.InfoCode !== 'IMG'">
                <b-colxx md="6">
                  <template v-if="device.InfoCode === 'TDV'">
                    <b-form-group :label="device.InfoName + ':'">
                      <template v-if="parseFloat(device.InfoValue) < 0">
                        <b-progress class="w-100" :max="100" height="1.5rem"
                                    style="background-color: rgb(233, 236, 239)">
                          <b-progress-bar :striped="true" class="text-center text-uppercase font-weight-bold"
                                          style="background-color: rgb(255, 0, 50); color: black" value="100"
                                          :label="$t('map.error-sensor')"></b-progress-bar>
                        </b-progress>
                      </template>
                      <template v-else-if="parseFloat(device.InfoValue) < 50">
                        <b-progress class="w-100" :max="100" height="1.5rem"
                                    style="background-color: rgb(233, 236, 239)">
                          <b-progress-bar :animated="animated" style="background-color: rgb(60, 179, 113); color: black"
                                          :value="parseFloat(device.InfoValue)"
                                          :label="`${parseFloat(device.InfoValue)} ºC`"></b-progress-bar>
                        </b-progress>
                      </template>
                      <template v-else>
                        <b-progress class="w-100" :max="100" height="1.5rem"
                                    style="background-color: rgb(233, 236, 239)">
                          <b-progress-bar :animated="animated" style="background-color: rgb(255, 0, 50); color: black"
                                          :value="parseFloat(device.InfoValue)"
                                          :label="`${parseFloat(device.InfoValue)} ºC`"></b-progress-bar>
                        </b-progress>
                      </template>
                    </b-form-group>
                  </template>
                  <template v-else-if="device.InfoCode === 'PIN'">
                    <b-form-group :label="device.InfoName + ':'">
                      <template v-if="parseFloat(device.InfoValue) < 0">
                        <b-progress class="w-100" :max="100" height="1.5rem"
                                    style="background-color: rgb(233, 236, 239)">
                          <b-progress-bar :striped="true" class="text-center text-uppercase font-weight-bold"
                                          style="background-color: rgb(255, 0, 50); color: black" value="100"
                                          :label="$t('map.error-sensor')"></b-progress-bar>
                        </b-progress>
                      </template>
                      <template v-else-if="parseFloat(device.InfoValue) < 50">
                        <b-progress class="w-100" :max="100" height="1.5rem"
                                    style="background-color: rgb(233, 236, 239)">
                          <b-progress-bar :animated="animated" style="background-color: rgb(255, 0, 50); color: black"
                                          :value="parseFloat(device.InfoValue)"
                                          :label="`${parseFloat(device.InfoValue)} %`"></b-progress-bar>
                        </b-progress>
                      </template>
                      <template v-else>
                        <b-progress class="w-100" :max="100" height="1.5rem"
                                    style="background-color: rgb(233, 236, 239)">
                          <b-progress-bar :animated="animated" style="background-color: rgb(60, 179, 113); color: black"
                                          :value="parseFloat(device.InfoValue)"
                                          :label="`${parseFloat(device.InfoValue)} %`"></b-progress-bar>
                        </b-progress>
                      </template>
                    </b-form-group>
                  </template>
                </b-colxx>
              </template>
            </template>
          </b-row>
        </b-colxx>
        <b-colxx md="12">
          <template v-for="deviceImg in dataModal.DeviceInfoProperties">
            <template v-if="deviceImg.InfoCode === 'IMG'">
              <b-form-group :label="deviceImg.InfoName + ':'">
                <template v-if="parseFloat(deviceImg.InfoValue) < 0">
                  <b-alert class="text-center text-uppercase font-weight-bold" show variant="danger">
                    {{$t('map.error-sensor')}}
                  </b-alert>
                </template>
                <template v-else>
                  <b-img id="image-station" :src="deviceImg.InfoValue" fluid :alt="deviceImg.UnitName"
                         style="cursor: pointer" @click="openFullscreen('image-station')"></b-img>
                </template>
              </b-form-group>
            </template>
          </template>
        </b-colxx>
      </b-row>
    </b-modal>
  </div>
</template>
<script>
  import CustomTables from '../../../components/Listing/CustomTables'
  import CustomForm from '../../../components/Form/CustomFormCategory'
  import methods from '../../../function/api'
  import handling from '../../../function/handling'
  import { timer } from '../../../constants/services'
  import moment from "moment";

  export default {
    components: {
      'custom-table': CustomTables,
      'custom-form': CustomForm
    },
    data() {
      return {
        selectMode: 'single',
        listColumnShow: null,
        objectKey: null,
        menuRight: [],
        selectedItems: [],
        items: null,
        dataMapNow: null,
        dataModal: null,
        animated: true,
      }
    },
    watch: {
      'dataMapNow'() {
        if (this.dataModal !== null) {
          this.dataModal = this.returnDataModal(this.dataModal.StationID, this.dataMapNow)
        }
      },
    },
    methods: {
      resetModal() {
        this.dataModal = null
      },
      infoModal(items) {
        this.dataModal = this.returnDataModal(items[0].StationID, this.dataMapNow)
        setTimeout(() => {
          this.$bvModal.show('modal-item')
        }, timer)
      },
      returnDataModal(id, dataMapNow) {
        let data = null
        for (let i = 0; i < dataMapNow.length; i++) {
          if (data !== null) {
            return data
          }
          if (id === dataMapNow[i].StationID) {
            data = dataMapNow[i]
          }
        }
        return data
      },
      rowSelected(data) {
        this.selectedItems = data
      },
      convertDateTime(string) {
        let date = moment(string, "YYYY-MM-DD'T'HH:mm:ss")
        return date.format('HH:mm:ss DD/MM/YYYY')
      },
      openFullscreen(idElement) {
        let element = document.getElementById(idElement)
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      },
      timeLoadData(time){
        this.getData()
        this.getMapNow()
        setTimeout(() => {
          this.timeLoadData(time)
        }, time)
      },
      getMapNow() {
        methods.post("/api/Maps/GetMapNow", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.dataMapNow = val.Result
          } else {
            this.dataMapNow = null
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getData() {
        methods.post("/api/Monitors/GetMonitor", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.items = handling.convertDataBitToBoolean(val.Result)
          } else {
            this.items = []
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getKeyTable() {
        methods.post("/api/Monitors/GetMonitor", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.objectKey = Object.keys(val.Result[0])
          } else {
            this.objectKey = []
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getColumn(string) {
        let body = {
          ObjectName: string
        }
        methods.post("/api/customize/GetColumnShow", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.listColumnShow = val.Result
          } else {
            this.listColumnShow = []
          }
        }).catch(err => {
          console.log(err)
        })
      },
      getListMenuRight() {
        methods.post("/api/menu/GetMenuRightByGroupID", {GroupID: this.$store.getters.currentUser.GroupID.toString()}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.menuRight = val.Result
          } else {
            this.menuRight = []
          }
        }).catch(err => {
          console.log(err);
        })
      },
    },
    async created() {
      await this.getListMenuRight()
      await this.getColumn('monitors')
      await this.getKeyTable()
      await this.timeLoadData(timer * 240)
    },
    computed: {
      fields: function () {
        return handling.mergeTableAndData(this.objectKey, this.listColumnShow)
      },
      userIDCurrent: function () {
        if (this.$store.getters.currentUser) {
          return this.$store.getters.currentUser.UserID.toString()
        }
      },
      objectData: function (){
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
    mounted() {}
  }
</script>
<style scoped>
  .led-red {
    background-color: #F00;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 12px;
    -webkit-animation: blinkRed 0.5s infinite;
    -moz-animation: blinkRed 0.5s infinite;
    -ms-animation: blinkRed 0.5s infinite;
    -o-animation: blinkRed 0.5s infinite;
    animation: blinkRed 0.5s infinite;
  }

  @-webkit-keyframes blinkRed {
    from { background-color: #F00; }
    50% { background-color: #A00; box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 0;}
    to { background-color: #F00; }
  }

  @-moz-keyframes blinkRed {
    from { background-color: #F00; }
    50% { background-color: #A00; box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 0;}
    to { background-color: #F00; }
  }

  @-ms-keyframes blinkRed {
    from { background-color: #F00; }
    50% { background-color: #A00; box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 0;}
    to { background-color: #F00; }
  }

  @-o-keyframes blinkRed {
    from { background-color: #F00; }
    50% { background-color: #A00; box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 0;}
    to { background-color: #F00; }
  }

  @keyframes blinkRed {
    from { background-color: #F00; }
    50% { background-color: #A00; box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 0;}
    to { background-color: #F00; }
  }

  .led-green {
    background-color: rgb(60, 250, 50);
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px, rgb(60, 250, 50) 0 2px 12px;
  }
</style>
