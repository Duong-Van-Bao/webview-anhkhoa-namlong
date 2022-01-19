<template>
  <div v-if="objectData !== undefined">
    <b-row>
      <b-colxx xxs="12">
        <h1><strong>{{ objectData.formName }}</strong></h1>
        <div class="top-right-button-container">
          <b-button-group>
            <b-dropdown right :text="$t('dropdown.action')" variant="primary">
              <b-dropdown-item @click="addModal()" v-if="objectData.accessWrite === true">
                <i class="fad fa-plus"></i>&emsp;{{$t('dropdown.add')}}
              </b-dropdown-item>
              <b-dropdown-item @click="infoModal(selectedItems)" v-if="selectedItems.length === 1">
                <i class="fad fa-info-circle"></i>&emsp;{{$t('dropdown.details')}}
              </b-dropdown-item>
              <b-dropdown-item v-else disabled>
                <i class="fad fa-info-circle"></i>&emsp;{{$t('dropdown.details')}}
              </b-dropdown-item>
              <b-dropdown-item @click="editModal(selectedItems)"
                               v-if="selectedItems.length === 1 && objectData.accessWrite === true">
                <i class="fad fa-edit"></i>&emsp;{{$t('dropdown.edit')}}
              </b-dropdown-item>
              <b-dropdown-item v-else disabled>
                <i class="fad fa-edit"></i>&emsp;{{$t('dropdown.edit')}}
              </b-dropdown-item>
              <b-dropdown-item @click="deleteModal(selectedItems)"
                               v-if="selectedItems.length === 1 && objectData.accessWrite === true">
                <i class="fad fa-trash-alt"></i>&emsp;{{$t('dropdown.delete')}}
              </b-dropdown-item>
              <b-dropdown-item v-else disabled>
                <i class="fad fa-trash-alt"></i>&emsp;{{$t('dropdown.delete')}}
              </b-dropdown-item>
              <b-dropdown-item @click="deviceModal(selectedItems)"
                               v-if="selectedItems.length === 1 && objectData.accessWrite === true">
                <i class="fad fa-sort-alpha-up-alt"></i>&emsp;{{$t('dropdown.device-permission')}}
              </b-dropdown-item>
              <b-dropdown-item v-else disabled>
                <i class="fad fa-sort-alpha-up-alt"></i>&emsp;{{$t('dropdown.device-permission')}}
              </b-dropdown-item>
              <b-dropdown-item @click="monitorModal(selectedItems)"
                               v-if="selectedItems.length === 1 && objectData.accessWrite === true">
                <i class="fad fa-sort-numeric-up-alt"></i>&emsp;{{$t('dropdown.monitor-permission')}}
              </b-dropdown-item>
              <b-dropdown-item v-else disabled>
                <i class="fad fa-sort-numeric-up-alt"></i>&emsp;{{$t('dropdown.monitor-permission')}}
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
                        @row-selected="rowSelected" @status-edit="statusEdit"></custom-table>
        </b-card>
      </b-colxx>
    </b-row>
    <custom-form :name-form="nameForm" :title-form="titleForm" :api-form="apiForm"
                 :data-form="dataForm" :state-form="stateForm" :id-form="idForm" :type-form="typeForm"
                 :user-current="userIDCurrent" :menu-current="objectData.menuIDCurrent"  :data-form-option="dataFormOptions"
                 @handle-submit="handleSubmit"></custom-form>

    <b-modal class="text-center" centered id="device-modal" :title="$t('form.device-modal-title')" ok-only @hidden="resetModalDevice" scrollable size="lg">
      <template v-if="dataDevicePermission !== null">
        <b-row class="mb-4">
          <b-colxx md="8" class="mt-2">
            <span>{{$t('form.total')}}: <strong>{{totalDeviceRows}}</strong> {{$t('form.result').toLowerCase()}}</span>
          </b-colxx>
          <b-colxx md="4">
            <b-form-group
              label-align-sm="right"
              label-size="sm"
              label-for="filterInput"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  v-model="filterDevice"
                  type="search"
                  id="filterInput"
                  :placeholder="search_title"
                  style="border-radius: 20px"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-colxx>
        </b-row>
        <b-table
          ref="custom-table"
          id="custom-table"
          sort-by="title" sort-desc.sync="false"
          sticky-header
          :fields="fieldDevice"
          :items="dataDevicePermission"
          class="text-center"
          responsive
          @filtered="onFilteredDevice"
          :filter="filterDevice"
        >
          <template v-slot:cell(Action)="row">
            <b-form-checkbox v-model="row.item.IsCheck" switch size="md" @change="editModalDevice(row.item)">
            </b-form-checkbox>
          </template>
        </b-table>
      </template>
    </b-modal>
    <b-modal class="text-center" centered id="monitor-modal" :title="$t('form.monitor-modal-title')" ok-only @hidden="resetModalMonitor" scrollable size="lg">
      <template v-if="dataMonitorPermission !== null">
        <b-row class="mb-4">
          <b-colxx md="8" class="mt-2">
            <span>{{$t('form.total')}}: <strong>{{totalMonitorRows}}</strong> {{$t('form.result').toLowerCase()}}</span>
          </b-colxx>
          <b-colxx md="4">
            <b-form-group
              label-align-sm="right"
              label-size="sm"
              label-for="filterInput"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  v-model="filterMonitor"
                  type="search"
                  id="filterInput"
                  :placeholder="search_title"
                  style="border-radius: 20px"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </b-colxx>
        </b-row>
        <b-table
          ref="custom-table"
          id="custom-table"
          sort-by="title" sort-desc.sync="false"
          sticky-header
          :fields="fieldMonitor"
          :items="dataMonitorPermission"
          class="text-center"
          responsive
          @filtered="onFilteredMonitor"
          :filter="filterMonitor"
        >
          <template v-slot:cell(Action)="row">
            <b-form-checkbox v-model="row.item.IsCheck" switch size="md" @change="editModalMonitor(row.item)">
            </b-form-checkbox>
          </template>
        </b-table>
      </template>
    </b-modal>
  </div>
</template>
<script>
  import CustomTables from '../../../components/Listing/CustomTables'
  import CustomForm from '../../../components/Form/CustomFormCategoryAndWFS'
  import methods from '../../../function/api'
  import handling from '../../../function/handling'
  import { timer } from '../../../constants/services'
  import wfs from '../../../function/wfs'

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
        nameForm: null,
        titleForm: null,
        apiForm: null,
        dataForm: null,
        dataFormOptions: {
          DataTypeID: [],
          ConnectTypeID:[],
          PowerTypeID: [],
        },
        idForm: null,
        typeForm: '',
        stateForm: {
          Name: null,
          NameExtention1: null,
          NameExtention2: null,
          NameExtention3: null,
          NameExtention4: null,
          NameExtention5: null,
          NameExtention6: null,
          NameExtention7: null,
          NameExtention8: null,
          NameExtention9: null,
        },
        dataByID: null,
        columnAdd: null,
        dataDevicePermission: null,
        totalDeviceRows: 0,
        filterDevice: '',
        search_title: this.$t('form.search-invalid'),
        fieldDevice: [
          {
            key: 'InfoCode',
            label: this.$t('form.device-code'),
            sortable: true,
            tdClass: 'pt-3 text-muted',
          },
          {
            key: 'Name',
            label: this.$t('form.device-name'),
            sortable: true,
            tdClass: 'text-left pt-3',
          },
          {
            key: 'UnitName',
            label: this.$t('form.device-unit'),
            sortable: true,
            tdClass: 'pt-3 text-muted',
          },
          {
            key: 'Action',
            label: this.$t('form.device-action'),
          },
        ],
        dataMonitorPermission: null,
        totalMonitorRows: 0,
        filterMonitor: '',
        fieldMonitor: [
          {
            key: 'IndicatorCode',
            label: this.$t('form.indicator-code'),
            sortable: true,
            tdClass: 'pt-3 text-muted',
          },
          {
            key: 'Name',
            label: this.$t('form.indicator-name'),
            sortable: true,
            tdClass: 'text-left pt-3',
          },
          {
            key: 'UnitName',
            label: this.$t('form.indicator-unit'),
            sortable: true,
            tdClass: 'pt-3 text-muted',
          },
          {
            key: 'Action',
            label: this.$t('form.indicator-action'),
          },
        ],
      }
    },
    methods: {
      onFilteredMonitor(filteredItems){
        this.totalMonitorRows = filteredItems.length
      },
      onFilteredDevice(filteredItems) {
        this.totalDeviceRows = filteredItems.length
      },
      resetModalDevice(){
        this.dataDevicePermission = null
        this.totalDeviceRows = 0
      },
      resetModalMonitor(){
        this.dataMonitorPermission = null
        this.totalMonitorRows = 0
      },
      infoModal(items) {
        this.dataForm = handling.showExtensionFormInfoCategory(items, this.listColumnShow)
        this.nameForm = 'modal-info'
        this.titleForm = this.$t('form.title-info').toUpperCase()
        this.typeForm = 'INFO'
        setTimeout(() => {
          this.$bvModal.show(this.nameForm)
        }, timer)
      },
      addModal() {
        this.dataForm = handling.showExtensionFormAddFunction(this.columnAdd, this.dataFormOptions)
        this.nameForm = 'modal-add'
        this.titleForm = this.$t('form.title-add').toUpperCase()
        this.typeForm = 'ADD'
        this.apiForm = '/api/Stations/Add'
        setTimeout(() => {
          this.$bvModal.show(this.nameForm)
        }, timer)
      },
      handleSubmit(val, objectData) {
        if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
          if (this.items === undefined || this.items === null || this.items.length === 0) {
            this.$bvModal.hide(this.nameForm)
            this.getColumn()
            this.getKeyTable()
            this.getData()
            setTimeout(() => {
              this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
            }, timer)
          } else {
            this.$bvModal.hide(this.nameForm)
            this.getData()
            setTimeout(() => {
              this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
            }, timer)
          }
          if (objectData !== null) {
            switch (this.typeForm) {
              case 'ADD':
                wfs.insertPoint(objectData.url, objectData.workspace, objectData.urlWorkspace, objectData.data, objectData.type).then(val => {
                  if (val !== true) {
                    console.log('Không thêm được dữ liệu')
                    this.handleSubmitDelete(objectData.data[objectData.type.toLowerCase() + 'id'])
                  }
                })
                break
              case 'EDIT':
                let URL = wfs.getPoint(null, objectData.type)
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
                    for (let i = 0; i < resp.features.length; i++) {
                      if (this.idForm === resp.features[i].properties[objectData.type.toLowerCase() + 'id'].toString()) {
                        wfs.updatePoint(objectData.url, objectData.workspace, objectData.urlWorkspace, objectData.data, objectData.type, resp.features[i].id).then(rel => {
                          if (rel !== true) {
                            console.log('Không sửa được dữ liệu')
                          }
                        })
                      }
                    }
                  })
                  .catch((err) => console.log('ErrorUpdate', err))
                break
            }
          } else {
            console.log('Không có dữ liệu để xử lý')
            this.handleSubmitDelete(objectData.data[objectData.type.toLowerCase() + 'id'])
          }
        } else {
          this.$bvModal.hide(this.nameForm)
          this.getData()
          setTimeout(() => {
            this.makeToast('danger', this.$t('toast.fail').toUpperCase(), val.Message)
          }, timer)
        }
        setTimeout(() => {
          this.nameForm = null
          this.titleForm = null
          this.apiForm = null
          this.idForm = null
          this.typeForm = ''
        },200)
      },
      editModal(items) {
        this.getDataByID(items[0].StationID)
        setTimeout(() => {
          this.dataForm = handling.showExtensionFormEditFunction(this.dataByID)
          this.nameForm = 'modal-edit'
          this.titleForm = this.$t('form.title-edit').toUpperCase()
          this.typeForm = 'EDIT'
          this.apiForm = '/api/Stations/Edit'
          this.idForm = items[0].StationID
          setTimeout(() => {
            this.$bvModal.show(this.nameForm)
          }, timer)
        }, timer)
      },
      deleteModal(items) {
        let objectData
        switch (items[0]['DataTypeID']) {
          case 1:
            objectData = null
            break
          case 2:
            objectData = wfs.getDataType(items[0], 'Air')
            break
          case 3:
            objectData = wfs.getDataType(items[0], 'Water')
            break
          default:
            objectData = null
            break
        }
        this.$bvModal.msgBoxConfirm(this.$t('form.question') + items[0].StationName + '?', {
          title: this.$t('form.warning').toUpperCase(),
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: this.$t('form.yes'),
          cancelTitle: this.$t('form.no'),
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            if (value === true) {
              this.handleSubmitDelete(items[0].StationID, objectData);
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      async handleSubmitDelete(id, objectData) {
        if (objectData !== null) {
          let URL = wfs.getPoint(null, objectData.type)
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
              for (let i = 0; i < resp.features.length; i++) {
                if (id === resp.features[i].properties[objectData.type.toLowerCase() + 'id'].toString()) {
                  wfs.deletePoint(objectData.url, objectData.workspace, objectData.type, resp.features[i].id).then(val => {
                    if (val !== true) {
                      console.log('Không xóa được dữ liệu')
                    }
                  })
                }
              }
            })
            .catch((err) => console.log('ErrorDelete', err))
        } else {
          console.log('Không có dữ liệu để xóa')
        }
        let body = {
          ID: id,
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        methods.post("/api/Stations/Delete", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            if (this.items.length === 1) {
              this.getColumn()
              this.getKeyTable()
              this.getData()
              setTimeout(() => {
                this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
              }, timer)
            } else {
              this.getData()
              setTimeout(() => {
                this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
              }, timer)
            }
          } else {
            this.getData()
            setTimeout(() => {
              this.makeToast('danger', this.$t('toast.fail').toUpperCase(), val.Message)
            }, timer)
          }
        }).catch(err => {
          console.log(err);
        })
      },
      editModalMonitor(data) {
        let body = {
          StationID: data.StationID,
          IndicatorID: data.IndicatorID,
          IsCheck: handling.convertBooleanToBit(data.IsCheck),
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        methods.post("/api/StationRights/EditStationRightByMonitorings", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            setTimeout(() => {
              this.getData()
              this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
            }, timer)
          } else {
            setTimeout(() => {
              this.getData()
              this.makeToast('danger', this.$t('toast.fail').toUpperCase(), val.Message)
            }, timer)
          }
        }).catch(err => {
          console.log(err);
        })
      },
      monitorModal(items){
        this.getStationRightByMonitor(items[0].StationID)
        setTimeout(() => {
          this.$bvModal.show('monitor-modal')
        },200)
      },
      editModalDevice(data) {
        let body = {
          StationID: data.StationID,
          InfoID: data.InfoID,
          IsCheck: handling.convertBooleanToBit(data.IsCheck),
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        methods.post("/api/StationRights/EditStationRightByInfos", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            setTimeout(() => {
              this.getData()
              this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
            }, timer)
          } else {
            setTimeout(() => {
              this.getData()
              this.makeToast('danger', this.$t('toast.fail').toUpperCase(), val.Message)
            }, timer)
          }
        }).catch(err => {
          console.log(err);
        })
      },
      deviceModal(items){
        this.getStationRightByDevice(items[0].StationID)
        setTimeout(() => {
          this.$bvModal.show('device-modal')
        },200)
      },
      rowSelected(data) {
        this.selectedItems = data
      },
      statusEdit(data) {
        let body = {
          ID: data.StationID,
          IsActive: handling.convertBooleanToBit(data.IsActive),
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        methods.post("/api/Stations/ChangeStatus", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            setTimeout(() => {
              this.getData()
              this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
            }, timer)
          } else {
            setTimeout(() => {
              this.getData()
              this.makeToast('danger', this.$t('toast.fail').toUpperCase(), val.Message)
            }, timer)
          }
        }).catch(err => {
          console.log(err);
        })
      },
      makeToast(variant = null, title, body) {
        this.$bvToast.toast(body, {
          title: title,
          variant: variant,
          solid: true,
          autoHideDelay: 1000
        })
      },
      getOptionConnectType(){
        methods.post("/api/ConnectTypes/GetListConnectType", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            if (val.Result.length > 0) {
              this.dataFormOptions.ConnectTypeID = []
              for (let i = 0; i < val.Result.length; i++) {
                if (val.Result[i].IsActive === 1) {
                  let obj = {
                    text: val.Result[i].ConnectTypeName,
                    value: val.Result[i].ConnectTypeID,
                  }
                  this.dataFormOptions.ConnectTypeID.push(obj)
                }
              }
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getOptionPowerType(){
        methods.post("/api/PowerTypes/GetListPowerType", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            if (val.Result.length > 0) {
              this.dataFormOptions.PowerTypeID = []
              for (let i = 0; i < val.Result.length; i++) {
                if (val.Result[i].IsActive === 1) {
                  let obj = {
                    text: val.Result[i].PowerTypeName,
                    value: val.Result[i].PowerTypeID,
                  }
                  this.dataFormOptions.PowerTypeID.push(obj)
                }
              }
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getOptionDataType(){
        methods.post("/api/DataTypes/GetListDataType", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            if (val.Result.length > 0) {
              this.dataFormOptions.DataTypeID = []
              for (let i = 0; i < val.Result.length; i++) {
                if (val.Result[i].IsActive === 1) {
                  let obj = {
                    text: val.Result[i].DataTypeName,
                    value: val.Result[i].DataTypeID,
                  }
                  this.dataFormOptions.DataTypeID.push(obj)
                }
              }
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getFormAddShow(string){
        let body = {
          ObjectName: string
        }
        methods.post("/api/customize/GetColumnShowByObjectName", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.columnAdd = val.Result
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getStationRightByDevice(id) {
        let body = {
          StationID: id,
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        methods.post("/api/StationRights/GetStationRightByInfos", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            let arr = []
            for (let i = 0; i < val.Result.length; i++) {
              let obj = {
                IsCheck: handling.convertBitToBoolean(val.Result[i].IsCheck),
                InfoCode: val.Result[i].InfoCode,
                UnitName: val.Result[i].UnitName,
                InfoID: val.Result[i].InfoID,
                Name:  val.Result[i].Name,
                StationID: id
              }
              arr.push(obj)
            }
            this.dataDevicePermission = arr
            this.totalDeviceRows = this.dataDevicePermission.length
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getStationRightByMonitor(id) {
        let body = {
          StationID: id,
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        methods.post("​/api/StationRights/GetStationRightByMonitorings", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            let arr = []
            for (let i = 0; i < val.Result.length; i++) {
              let obj = {
                IsCheck: handling.convertBitToBoolean(val.Result[i].IsCheck),
                IndicatorCode: val.Result[i].IndicatorCode,
                UnitName: val.Result[i].UnitName,
                IndicatorID: val.Result[i].IndicatorID,
                Name:  val.Result[i].Name,
                StationID: id
              }
              arr.push(obj)
            }
            this.dataMonitorPermission = arr
            this.totalMonitorRows = this.dataMonitorPermission.length
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getDataByID(id) {
        let body = {
          ID: id
        }
        methods.post("/api/Stations/GetStationById", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.dataByID = val.Result
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getData() {
        methods.post("/api/Stations/GetListStation", {}).then(val => {
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
        methods.post("/api/Stations/GetListStation", {}).then(val => {
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
      await this.getColumn('stations')
      await this.getKeyTable()
      await this.getData()
      await this.getFormAddShow('stations')
      await this.getOptionPowerType()
      await this.getOptionDataType()
      await this.getOptionConnectType()
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
