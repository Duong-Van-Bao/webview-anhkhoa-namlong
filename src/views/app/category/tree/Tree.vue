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
    <b-row v-if="fields !== undefined">
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
                 :user-current="userIDCurrent" :menu-current="objectData.menuIDCurrent" :data-form-option="dataFormOptions"
                 @handle-submit="handleSubmit"></custom-form>
  </div>
</template>
<script>
  import CustomTables from '../../../../components/Listing/CustomTables'
  import CustomFormTree from '../../../../components/Form/CustomFormCategory'
  import methods from '../../../../function/api'
  import handling from '../../../../function/handling'
  import { timer } from '../../../../constants/services'

  export default {
    components: {
      'custom-table': CustomTables,
      'custom-form': CustomFormTree
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
          LeafID: [],
          ColorLeafID:[],
          CrownID: [],
          ColorFlowerID: [],
          TreeCategoryID: [],
          TreeGroupID: [],
        },
        idForm: null,
        typeForm: '',
        stateForm: {
          TreeHeight: null,
          DiameterFoliages: null,
          DeciduousPeriod: null,
          FloweringPeriod: null,
          TreeName: null,
          TreeNameExtention1: null,
          TreeNameExtention2: null,
          TreeNameExtention3: null,
          TreeNameExtention4: null,
          TreeNameExtention5: null,
          TreeNameExtention6: null,
          TreeNameExtention7: null,
          TreeNameExtention8: null,
          TreeNameExtention9: null,
          Extention1: null,
          Extention2: null,
          Extention3: null,
          Extention4: null,
          Extention5: null,
          Extention6: null,
          Extention7: null,
          Extention8: null,
          Extention9: null,
        },
        dataByID: null,
        columnAdd: null,
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
        this.dataForm = handling.showExtensionFormAddFunction(this.columnAdd, this.dataFormOptions)
        this.nameForm = 'modal-add'
        this.titleForm = this.$t('form.title-add').toUpperCase()
        this.typeForm = 'ADD'
        this.apiForm = '/api/Trees/Add'
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
        this.getDataByID(items[0].TreeID)
        setTimeout(() => {
          this.dataForm = handling.showExtensionFormEditFunction(this.dataByID)
          this.nameForm = 'modal-edit'
          this.titleForm = this.$t('form.title-edit').toUpperCase()
          this.typeForm = 'EDIT'
          this.apiForm = '/api/Trees/Edit'
          this.idForm = items[0].TreeID
          setTimeout(() => {
            this.$bvModal.show(this.nameForm)
          }, timer)
        }, timer)
      },
      deleteModal(items) {
        this.$bvModal.msgBoxConfirm(this.$t('form.question') + items[0].TreeName + '?', {
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
              this.handleSubmitDelete(items[0].TreeID);
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
        methods.post("/api/Trees/Delete", body).then(val => {
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
          ID: data.TreeID,
          IsActive: handling.convertBooleanToBit(data.IsActive),
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        methods.post("/api/Trees/ChangeStatus", body).then(val => {
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
      getOptionColorLeaf(){
        methods.post("/api/Colors/GetListColor", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            if (val.Result.length > 0) {
              this.dataFormOptions.ColorLeafID = []
              for (let i = 0; i < val.Result.length; i++) {
                if (val.Result[i].IsActive === 1) {
                  let obj = {
                    text: val.Result[i].ColorName,
                    value: val.Result[i].ColorID,
                  }
                  this.dataFormOptions.ColorLeafID.push(obj)
                }
              }
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getOptionLeaf(){
        methods.post("/api/Leafs/GetListLeaf", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            if (val.Result.length > 0) {
              this.dataFormOptions.LeafID = []
              for (let i = 0; i < val.Result.length; i++) {
                if (val.Result[i].IsActive === 1) {
                  let obj = {
                    text: val.Result[i].LeafName,
                    value: val.Result[i].LeafID,
                  }
                  this.dataFormOptions.LeafID.push(obj)
                }
              }
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getOptionCrown(){
        methods.post("/api/Crowns/GetCrownList", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            if (val.Result.length > 0) {
              this.dataFormOptions.CrownID = []
              for (let i = 0; i < val.Result.length; i++) {
                if (val.Result[i].IsActive === 1) {
                  let obj = {
                    text: val.Result[i].CrownName,
                    value: val.Result[i].CrownID,
                  }
                  this.dataFormOptions.CrownID.push(obj)
                }
              }
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getOptionColorFlower(){
        methods.post("/api/Colors/GetListColor", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            if (val.Result.length > 0) {
              this.dataFormOptions.ColorFlowerID = []
              for (let i = 0; i < val.Result.length; i++) {
                if (val.Result[i].IsActive === 1) {
                  let obj = {
                    text: val.Result[i].ColorName,
                    value: val.Result[i].ColorID,
                  }
                  this.dataFormOptions.ColorFlowerID.push(obj)
                }
              }
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getOptionTreeCategory(){
        methods.post("/api/TreeCategories/GetListTreeCategory", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            if (val.Result.length > 0) {
              this.dataFormOptions.TreeCategoryID = []
              for (let i = 0; i < val.Result.length; i++) {
                if (val.Result[i].IsActive === 1) {
                  let obj = {
                    text: val.Result[i].TreeCategorieName,
                    value: val.Result[i].TreeCategorieID,
                  }
                  this.dataFormOptions.TreeCategoryID.push(obj)
                }
              }
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getOptionTreeType(){
        methods.post("/api/TreeTypes/GetTreeTypeList", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            if (val.Result.length > 0) {
              this.dataFormOptions.TreeTypeID = []
              for (let i = 0; i < val.Result.length; i++) {
                if (val.Result[i].IsActive === 1) {
                  let obj = {
                    text: val.Result[i].TreeTypeName,
                    value: val.Result[i].TreeTypeID,
                  }
                  this.dataFormOptions.TreeTypeID.push(obj)
                }
              }
            }
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getOptionTreeGroup(){
        methods.post("/api/TreeGroups/GetTreeGroupList", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            if (val.Result.length > 0) {
              this.dataFormOptions.TreeGroupID = []
              for (let i = 0; i < val.Result.length; i++) {
                if (val.Result[i].IsActive === 1) {
                  let obj = {
                    text: val.Result[i].TreeGroupName,
                    value: val.Result[i].TreeGroupID,
                  }
                  this.dataFormOptions.TreeGroupID.push(obj)
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
      getDataByID(id) {
        let body = {
          ID: id
        }
        methods.post("/api/Trees/GetTreeById", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.dataByID = val.Result
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getData() {
        methods.post("/api/Trees/GetListTree", {}).then(val => {
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
        methods.post("/api/Trees/GetListTree", {}).then(val => {
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
      await this.getColumn('trees')
      await this.getKeyTable()
      await this.getData()
      await this.getFormAddShow('trees')
      await this.getOptionColorFlower()
      await this.getOptionColorLeaf()
      await this.getOptionCrown()
      await this.getOptionLeaf()
      await this.getOptionTreeCategory()
      await this.getOptionTreeGroup()
      // await this.getOptionTreeType()
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
