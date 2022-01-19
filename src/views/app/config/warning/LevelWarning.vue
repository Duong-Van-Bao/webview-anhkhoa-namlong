<template>
  <div v-if="objectData !== undefined">
    <b-row>
      <b-colxx xxs="12">
        <h1><strong>{{ objectData.formName }}</strong></h1>
        <div class="top-right-button-container">
          <b-button-group>
            <b-dropdown right :text="$t('dropdown.action')" variant="primary">
              <b-dropdown-item @click="addModal()" v-if="objectData.accessWrite === true">
                <i class="fad fa-plus"></i>&emsp;{{$t('pages.add')}}
              </b-dropdown-item>
              <b-dropdown-item @click="infoModal(selectedItems)" v-if="selectedItems.length === 1">
                <i class="fad fa-info-circle"></i>&emsp;{{$t('pages.info')}}
              </b-dropdown-item>
              <b-dropdown-item v-else disabled>
                <i class="fad fa-info-circle"></i>&emsp;{{$t('pages.info')}}
              </b-dropdown-item>
              <b-dropdown-item @click="editModal(selectedItems)"
                               v-if="selectedItems.length === 1 && objectData.accessWrite === true">
                <i class="fad fa-edit"></i>&emsp;{{$t('pages.edit')}}
              </b-dropdown-item>
              <b-dropdown-item v-else disabled>
                <i class="fad fa-edit"></i>&emsp;{{$t('pages.edit')}}
              </b-dropdown-item>
              <b-dropdown-item @click="deleteModal(selectedItems)"
                               v-if="selectedItems.length === 1 && objectData.accessWrite === true">
                <i class="fad fa-trash-alt"></i>&emsp;{{$t('pages.delete')}}
              </b-dropdown-item>
              <b-dropdown-item v-else disabled>
                <i class="fad fa-trash-alt"></i>&emsp;{{$t('pages.delete')}}
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
                 :user-current="userIDCurrent" :menu-current="objectData.menuIDCurrent"
                 @handle-submit="handleSubmit"></custom-form>
  </div>
</template>
<script>
  import CustomTables from '../../../../components/Listing/CustomTables'
  import CustomForm from '../../../../components/Form/CustomFormCategory'
  import methods from '../../../../function/api'
  import handling from '../../../../function/handling'
  import { timer } from '../../../../constants/services'

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
        columnAdd: null
      }
    },
    methods: {
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
        this.dataForm = handling.showExtensionFormAddCategory(this.columnAdd)
        this.nameForm = 'modal-add'
        this.titleForm = this.$t('form.title-add').toUpperCase()
        this.typeForm = 'ADD'
        this.apiForm = '/api/LevelWarnings/AddLevelWarning'
        setTimeout(() => {
          this.$bvModal.show(this.nameForm)
        }, timer)
      },
      handleSubmit(val) {
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
        } else {
          this.$bvModal.hide(this.nameForm)
          this.getData()
          setTimeout(() => {
            this.makeToast('danger', this.$t('toast.fail').toUpperCase(), val.Message)
          }, timer)
        }
        this.nameForm = null
        this.titleForm = null
        this.apiForm = null
        this.idForm = null
        this.typeForm = ''
      },
      editModal(items) {
        this.getDataByID(items[0].LevelWarningID)
        setTimeout(() => {
          this.dataForm = handling.showExtensionFormEditCategory(this.dataByID)
          this.nameForm = 'modal-edit'
          this.titleForm = this.$t('form.title-edit').toUpperCase()
          this.typeForm = 'EDIT'
          this.apiForm = '/api/LevelWarnings/EditLevelWarning'
          this.idForm = items[0].LevelWarningID
          setTimeout(() => {
            this.$bvModal.show(this.nameForm)
          }, timer)
        }, timer)
      },
      deleteModal(items) {
        this.$bvModal.msgBoxConfirm(this.$t('form.question') + items[0].LevelWarningName + '?', {
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
              this.handleSubmitDelete(items[0].LevelWarningID);
            }
          })
          .catch(err => {
            console.log(err);
          })
      },
      async handleSubmitDelete(id) {
        let body = {
          ID: id,
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        methods.post("/api/LevelWarnings/DeleteLevelWarning", body).then(val => {
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
      rowSelected(data) {
        this.selectedItems = data
      },
      statusEdit(data) {
        let body = {
          ID: data.LevelWarningID,
          IsActive: handling.convertBooleanToBit(data.IsActive),
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        methods.post("/api/LevelWarnings/ChangeStatusLevelWarning", body).then(val => {
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
      getDataByID(id) {
        let body = {
          ID: id
        }
        methods.post("/api/LevelWarnings/GetLevelWarningById", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.dataByID = val.Result
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getData() {
        methods.post("/api/LevelWarnings/GetListLevelWarning", {}).then(val => {
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
        methods.post("/api/LevelWarnings/GetListLevelWarning", {}).then(val => {
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
      await this.getColumn('levelwarnings')
      await this.getKeyTable()
      await this.getData()
      await this.getFormAddShow('levelwarnings')
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
