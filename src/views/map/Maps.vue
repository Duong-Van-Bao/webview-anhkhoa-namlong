<template>
  <div id="app-container-map">
    <div id="map" class="map">
      <div id="menu-left-click">
        <p>{{coordinateClick.lat + ', ' + coordinateClick.lng}}
          <strong><span class="pl-4 float-right"><b-link @click.prevent.stop="copyCoordinate(coordinateClick.lat + ', ' + coordinateClick.lng)">{{$t('map.copy')}}</b-link></span></strong>
        </p>
        <p><strong>{{coordinateClick.name}}
          <strong><span class="pl-4 float-right"><b-link @click.prevent.stop="hidePopup">{{$t('map.hide')}}</b-link></span></strong>
        </strong></p>
      </div>
    </div>
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
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import 'leaflet.fullscreen/Control.FullScreen'
  import 'leaflet.fullscreen/Control.FullScreen.css'
  import '@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse'
  import '@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css'
  import 'leaflet.markercluster/dist/MarkerCluster.css'
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
  import 'leaflet.markercluster/dist/leaflet.markercluster'
  import 'leaflet.markercluster/dist/leaflet.markercluster-src'
  // import 'leaflet.locatecontrol/dist/L.Control.Locate.min'
  // import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css'
  import {timer} from '@/constants/services'
  import wfs from '../../function/wfs'
  import methods from '../../function/api'
  import moment from 'moment'
  import {mapGetters} from "vuex";

  export default {
    name: "Maps",
    data() {
      return {
        map: null,
        dataMapNow: null,
        layerAction: {},
        coordinateClick: {
          lat: null,
          lng: null,
          name: null
        },
        dataModal: null,
        animated: true,
      }
    },
    computed: {
      ...mapGetters({
        menuClickCount: 'getMenuClickCount'
      })
    },
    watch: {
      'menuClickCount'(){
        if (this.map) {
          this.map.invalidateSize()
        }
      },
      '$route'(to, from) {
        if (to.query.type) {
          if (to.query.type !== from.query.type) {
            if (this.map) {
              this.map.remove()
            }
            this.map = this.initMap(to.query.type)
          }
        }
        if (to.query.layers) {
          if (from.query.layers) {
            if (typeof from.query.layers === 'string') {
              this.map.removeLayer(this.layerAction[from.query.layers])
            } else {
              if (to.query.layers.length < from.query.layers.length) {
                for (let i = 0; i < from.query.layers.length; i++) {
                  this.map.removeLayer(this.layerAction[from.query.layers[i]])
                }
              }
            }
          }
          this.openBounding(to.query.layers)
        } else {
          if (from.query.layers) {
            if (typeof from.query.layers === 'string') {
              this.map.removeLayer(this.layerAction[from.query.layers])
            } else {
              for (let j = 0; j < from.query.layers.length; j++) {
                this.map.removeLayer(this.layerAction[from.query.layers[j]])
              }
            }
          }
        }
      },
      'dataMapNow'() {
        if (this.$route.query.layers) {
          this.openBounding(this.$route.query.layers)
        }
        if (this.dataModal !== null) {
          this.dataModal = this.returnDataModal(this.dataModal.Lat, this.dataModal.Long, this.dataMapNow)
        }
      },
    },
    async created() {
      if (!this.$route.query.type) {
        await this.$router.push({ path: this.$route.fullPath, query: {type: 'CanTho2D'}})
      }
      await this.timeGetMapNow(timer * 240)
    },
    mounted() {
      this.map = this.initMap(this.$route.query.type)
      setTimeout(() => {
        if (this.$route.query.layers) {
          this.openBounding(this.$route.query.layers)
        }
      }, timer)
    },
    methods: {
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
      initMap(type) {
        let mapDefault
        if (type) {
          let string = '';
          for (let i = 0; i < (type.length - 2); i++) {
            string  = string + type[i]
          }
          let urlMap = 'http://map.namlongtekgroup.com/index.php?r=' + string + '&t=' + type.split(string)[1] + '&z={z}&x={x}&y={y}&k=namlong_2021'
          mapDefault = L.tileLayer(urlMap, {minZoom: 1, maxZoom: 18, transparent: false})
        }
        let map = L.map('map', {
          center: [10.1344965, 105.5346680],
          zoom: 11,
          layers: mapDefault,
          fullscreenControl: true,
        })
        map.addEventListener('click', this.openPoint)
        L.control.scale({position: 'bottomright'}).addTo(map)
        // L.control.locate({showPopup: false,}).addTo(map)
        map.invalidateSize()
        return map
      },
      timeGetMapNow(time) {
        this.getMapNow()
        setTimeout(() => {
          this.timeGetMapNow(time)
        }, time)
      },
      addLayerStyle(type) {
        if (this.layerAction[type]) {
          this.map.removeLayer(this.layerAction[type])
        }
        // let BBOX = this.map.getBounds().toBBoxString()
        let BBOX = null
        let URL = wfs.getPoint(BBOX, type)

        let WFSLayer = (result) => {
          this.layerAction[type] = L.markerClusterGroup()
          for (let i = 0; i < result.length; i++) {
            let objectData = this.returnDataPopup(result[i], this.dataMapNow, type.toLowerCase())
            let icon = L.icon.pulse({iconSize: [15, 15], fillColor: objectData.fillColor, color: objectData.color});
            let marker = L.marker(new L.LatLng(objectData.lat, objectData.lng), {icon: icon});
            let contentPopup =
              '<div>' +
              '<img style="width: 300px;" src="http://imgsmartcity.namlongtekgroup.com/Stations/' + objectData.id + '.jpg"/>' +
              '<p class="pl-3 pr-3" style="font-size: 15px"><strong>' + objectData.name + '</strong></p>' +
              '<p class="pl-3 pr-3 font-italic" style="font-size: 12px; margin-top: -10px">' + objectData.address + '</p>' +
              '<p class="pl-3 pr-3 font-italic" style="font-size: 12px; margin-top: -10px">' + this.$t('map.update-time') + ': ' + '<span class="text-danger font-weight-bold">' + objectData.time + '</span></p>' +
              '</div>'
            let popup = L.popup({
              closeButton: false
            }).setContent(contentPopup)
            marker.bindPopup(popup)
            marker.on('mouseover', function (e) {
              marker.openPopup()
            })
            marker.on('mouseout', function (e) {
              marker.closePopup()
            })
            marker.on('click', this.showModal)
            this.layerAction[type].addLayer(marker);
          }
          this.map.addLayer(this.layerAction[type]);
        }
        fetch(URL, {
          method: 'GET',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then(data => {
            return data.json();
          })
          .then(resp => {
            WFSLayer(resp.features)
          })
          .catch((err) => console.log('ErrorAddLayerStyle', err))
      },
      returnDataPopup(mapData, jsonData, type) {
        let keyID = type + 'id'
        let keyName = type + 'name'
        let keyAddress = type + 'address'
        let objectData = {
          fillColor: null,
          color: null,
          id: null,
          name: null,
          lat: null,
          lng: null,
          address: null,
          time: null,
        }
        if (type === 'air') {
          objectData.fillColor = 'green'
        } else if (type === 'water') {
          objectData.fillColor = 'blue'
        }
        if (mapData && jsonData !== null) {
          for (let i = 0; i < jsonData.length; i++) {
            if (mapData.properties[keyID].toString() === jsonData[i].StationID) {
              if (jsonData[i].StatusID !== 0) {
                objectData.color = 'red'
              } else {
                objectData.color = objectData.fillColor
              }
              objectData.id = jsonData[i].StationID
              objectData.name = jsonData[i].StationName
              objectData.lat = parseFloat(jsonData[i].Lat)
              objectData.lng = parseFloat(jsonData[i].Long)
              objectData.address = jsonData[i].StationAddress
              objectData.time = this.convertDateTime(jsonData[i].UpdateTime)
              break
            } else {
              objectData.color = 'red'
              objectData.id = mapData.properties[keyID].toString()
              objectData.name = mapData.properties[keyName]
              objectData.lat = mapData.geometry.coordinates[1]
              objectData.lng = mapData.geometry.coordinates[0]
              objectData.address = mapData.properties[keyAddress]
              objectData.time = this.$t('map.no-data')
            }
          }
        } else {
          objectData.color = 'red'
          objectData.id = mapData.properties[keyID].toString()
          objectData.name = mapData.properties[keyName]
          objectData.lat = mapData.geometry.coordinates[1]
          objectData.lng = mapData.geometry.coordinates[0]
          objectData.address = mapData.properties[keyAddress]
          objectData.time = this.$t('map.no-data')
        }
        return objectData
      },
      returnDataModal(latitude, longitude, dataMapNow) {
        let data = null
        for (let i = 0; i < dataMapNow.length; i++) {
          if (data !== null) {
            return data
          }
          if (parseFloat(dataMapNow[i].Lat) === parseFloat(latitude) && parseFloat(dataMapNow[i].Long) === parseFloat(longitude)) {
            data = dataMapNow[i]
          }
        }
        return data
      },
      resetModal() {
        this.dataModal = null
      },
      showModal(e) {
        let latitude = parseFloat(e.latlng.lat).toFixed(7)
        let longitude = parseFloat(e.latlng.lng).toFixed(7)
        this.dataModal = this.returnDataModal(latitude, longitude, this.dataMapNow)
        setTimeout(() => {
          this.$bvModal.show('modal-item')
        }, timer)
      },
      openBounding(layers) {
        if (typeof layers === "string") {
          this.addLayerStyle(layers)
        } else {
          for (let i = 0; i < layers.length; i++) {
            this.addLayerStyle(layers[i])
          }
        }
      },
      openPoint(e) {
        let latitude = parseFloat(e.latlng.lat).toFixed(7)
        let longitude = parseFloat(e.latlng.lng).toFixed(7)
        this.handleClick(latitude, longitude)
      },
      handleClick(lat, lng) {
        let context = document.getElementById('menu-left-click')
        if (lat !== this.coordinateClick.lat || lng !== this.coordinateClick.lng) {
          if (this.coordinateClick.lat === null && this.coordinateClick.lng === null) {
            context.style.display = 'block'
            this.coordinateClick = {
              lat: lat,
              lng: lng,
              name: this.$t('map.no-result')
            }
          } else {
            context.style.display = 'none'
            this.coordinateClick = {
              lat: null,
              lng: null,
              name: null
            }
          }
        }
      },
      copyCoordinate(text){
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      },
      hidePopup(e) {
        e.preventDefault()
        document.getElementById('menu-left-click').style.display = 'none'
        this.coordinateClick = {
          lat: null,
          lng: null,
          name: null
        }
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
      convertDateTime(string) {
        let date = moment(string, "YYYY-MM-DD'T'HH:mm:ss")
        return date.format('HH:mm:ss DD/MM/YYYY')
      },
    },
  }
</script>

<style scoped>
  #app-container-map {
    height: calc(100vh - 230px);
    box-shadow: 0 1px 15px rgba(0, 0, 0, 0.18), 0 1px 6px rgba(0, 0, 0, 0.18);
  }

  #map {
    height: 100%;
    z-index: 0;
    background-color: white;
  }

  @media screen and (max-width: 575px) {
    #app-container-map {
      height: calc(100vh - 180px);
      box-shadow: 0 1px 15px rgba(0, 0, 0, 0.18), 0 1px 6px rgba(0, 0, 0, 0.18);
    }
  }

  @media screen and (max-width: 767px) {
    #app-container-map {
      height: calc(100vh - 180px);
      box-shadow: 0 1px 15px rgba(0, 0, 0, 0.18), 0 1px 6px rgba(0, 0, 0, 0.18);
    }
  }

  @media screen and (min-width: 768px) and (max-width: 1199px) {
    #app-container-map {
      height: calc(100vh - 200px);
      box-shadow: 0 1px 15px rgba(0, 0, 0, 0.18), 0 1px 6px rgba(0, 0, 0, 0.18);
    }
  }

  @media screen and (min-width: 1200px) and (max-width: 1439px) {
    #app-container-map {
      height: calc(100vh - 220px);
      box-shadow: 0 1px 15px rgba(0, 0, 0, 0.18), 0 1px 6px rgba(0, 0, 0, 0.18);
    }
  }

  #menu-left-click {
    display: none;
    position: absolute;
    z-index: 100000;
    width: auto;
    padding: 10px;
    left: 50%;
    bottom: 2%;
    background-color: white;
    border: 1px solid #d7d7d7;
    box-shadow: 0 1px 15px rgba(0, 0, 0, 0.1), 0 1px 6px rgba(0, 0, 0, 0.1);
    transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(0);
  }

  #menu-left-click p {
    margin-bottom: 0;
  }

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
