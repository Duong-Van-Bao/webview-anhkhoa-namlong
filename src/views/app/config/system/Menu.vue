<template>
  <b-row v-if="objectData !== undefined">
    <b-colxx class="disable-text-selection" v-if="itemsRecursive.length > 0">
      <b-row v-if="isLoad">
        <b-colxx xxs="12">
          <h1><strong>{{ objectData.formName }}</strong></h1>
          <div class="top-right-button-container">
            <b-button-group>
              <b-button variant="primary" @click="openModal(selectedItems)" v-if="selectedItems.length === 1 && objectData.accessWrite === true"><i class="fad fa-edit"></i>&emsp;{{$t('dropdown.edit')}}</b-button>
              <b-button variant="primary" v-else disabled><i class="fad fa-edit"></i>&emsp;{{$t('dropdown.edit')}}</b-button>
            </b-button-group>
          </div>
          <div class="mb-2 mt-2">
          </div>
          <div class="separator mb-5"/>
        </b-colxx>
      </b-row>
      <template v-if="isLoad">
        <b-row v-if="displayMode === 'list' " key="list">
          <b-colxx cols="12">
            <menu-table-list :type="type" :data="itemsRecursive[0].subs" :selected-items="selectedItems" :access-write="objectData.accessWrite"
                             @toggle-item="toggleItem" @check-active="checkActive"></menu-table-list>
          </b-colxx>
        </b-row>
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
    </b-colxx>
    <custom-form :name-form="nameForm" :title-form="titleForm" :api-form="apiForm"
                 :data-form="dataForm" :state-form="stateForm" :id-form="idForm" :type-form="typeForm"
                 :user-current="userIDCurrent" :menu-current="objectData.menuIDCurrent"
                 @handle-submit="handleSubmit"></custom-form>
  </b-row>
</template>

<script>
  import vSelect from 'vue-select'
  import 'vue-select/dist/vue-select.css'
  import MenuTableList from '../../../../components/Listing/MenuTableList'
  import CustomForm from '../../../../components/Form/CustomFormMenu'
  import methods from '../../../../function/api'
  import handling from "../../../../function/handling"
  import { timer } from '../../../../constants/services'

  export default {
    components: {
      'v-select': vSelect,
      'menu-table-list': MenuTableList,
      'custom-form': CustomForm
    },
    data() {
      return {
        type: 'Menu',
        isLoad: false,
        displayMode: 'list',
        menuRight: [],
        itemsRecursive: [],
        selectedItems: [],
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
        show: false,
        dataByID: null,
      }
    },
    methods: {
      loadItems() {
        this.isLoad = false
        setTimeout(() => {
          this.selectedItems = []
          this.isLoad = true
        },timer)
      },
      checkActive(data){
        let body = {
          ListMenuID : data.id + ":" + handling.convertBooleanToBit(data.active),
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        methods.post("/api/menu/EditStatus",body).then(val =>{
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.getListMenu()
            setTimeout(() => {
              this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
            },timer)
          } else {
            this.getListMenu()
            setTimeout(() => {
              this.makeToast('danger', this.$t('toast.fail').toUpperCase(), val.Message)
            },timer)
          }
        }).catch(err =>{
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
      toggleItem(event, item) {
        if (this.selectedItems.includes(item.id)) {
          this.selectedItems = []
        }
        else {
          this.selectedItems = []
          this.selectedItems.push(item.id)
        }
      },
      openModal(items){
        this.getDataByID(items[0])
        setTimeout(() => {
          this.dataForm = handling.showExtensionFormEditCategory(this.dataByID)
          this.nameForm = 'modal-edit'
          this.titleForm = this.$t('form.title-edit').toUpperCase()
          this.typeForm = 'EDIT'
          this.apiForm = '/api/menu/EditMenu'
          this.idForm = items[0]
          setTimeout(() => {
            this.$bvModal.show(this.nameForm)
          }, timer)
        }, timer)
      },
      handleSubmit(val) {
        if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
          if (this.itemsRecursive === undefined || this.itemsRecursive === null || this.itemsRecursive.length === 0) {
            this.$bvModal.hide(this.nameForm)
            this.getListMenu()
            setTimeout(() => {
              this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
            }, timer)
          } else {
            this.$bvModal.hide(this.nameForm)
            this.getListMenu()
            setTimeout(() => {
              this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
            }, timer)
          }
        } else {
          this.$bvModal.hide(this.nameForm)
          this.getListMenu()
          setTimeout(() => {
            this.makeToast('success', this.$t('toast.fail').toUpperCase(), val.Message)
          }, timer)
        }
        this.nameForm = null
        this.titleForm = null
        this.apiForm = null
        this.idForm = null
        this.typeForm = ''
      },
      getDataByID(id) {
        let body = {
          ID: id
        }
        methods.post("/api/menu/GetMenuById", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.dataByID = val.Result
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getListMenu(){
        this.itemsRecursive = []
        methods.post("/api/menu/GetListMenu",{}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            handling.recursiveMenu(val.Result, '0', this.itemsRecursive)
          }
        }).catch(err =>{
          console.log(err);
        })
        this.loadItems()
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
      await this.getListMenu()
    },
    computed: {
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
    beforeRouteEnter (to, from, next) {
      if (from.fullPath !== '/' && from.fullPath !== to.fullPath) {
        localStorage.removeItem('collapse')
      }
      next()
    },
    watch: {
      'itemsRecursive'(){
        if (this.itemsRecursive.length > 0) {
          setTimeout(() => {
            if (localStorage.getItem('collapse') !== undefined && localStorage.getItem('collapse') !== null){
              let array = localStorage.getItem('collapse').split(',').filter(x => x !== '')
              if (array.length > 0) {
                for (let i = 0; i < array.length; i++){
                  this.$root.$emit('bv::toggle::collapse', array[i])
                  setTimeout(() => {
                    this.$nextTick(() => {
                      document.getElementById('icon-' + array[i]).className = 'fa fa-minus'
                    })
                  },timer)
                }
              }
            }
          },timer*1.5)
        }
      }
    },
    mounted(){},
  }
</script>
<style>

</style>
