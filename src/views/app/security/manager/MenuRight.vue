<template>
  <b-row v-if="objectData !== undefined">
    <b-colxx class="disable-text-selection">
      <b-row v-if="isLoad">
        <b-colxx xxs="12">
          <h1><strong>{{ objectData.formName }}</strong></h1>
          <div class="top-right-button-container">
            <b-button-group>
              <b-dropdown right :text="edit.group_name" variant="primary">
                <template v-if="listGroup.length > 0" v-for="items in listGroup">
                  <b-dropdown-item @click="getListMenuChange(items)">
                    {{items.text}}
                  </b-dropdown-item>
                </template>
              </b-dropdown>
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
  </b-row>
</template>

<script>
  import vSelect from 'vue-select'
  import 'vue-select/dist/vue-select.css'
  import MenuTableList from '../../../../components/Listing/MenuTableList'
  import methods from '../../../../function/api'
  import handling from "../../../../function/handling"
  import { timer } from '../../../../constants/services'

  export default {
    components: {
      'v-select': vSelect,
      'menu-table-list': MenuTableList
    },
    data() {
      return {
        type: 'MenuRight',
        isLoad: false,
        displayMode: 'list',
        menuRight: [],
        items: null,
        itemsRecursive: [],
        selectedItems: [],
        show: false,
        listGroup: [],
        edit: {
          group_id: null,
          group_name: null,
        },
      }
    },
    methods: {
      loadItems() {
        this.isLoad = false
        setTimeout(() => {
          this.isLoad = true
        }, timer)
      },
      checkActive(data) {
        let body = {
          GroupID: this.edit.group_id,
          ListMenuID: "",
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        if (this.selectedItems.length > 0){
          for (let i = 0; i < this.selectedItems.length; i++){
            for (let j = 0; j < this.items.length; j++){
              if (this.selectedItems[i] === this.items[j].MenuID){
                let new_string
                if (this.selectedItems[i] === data.id) {
                  new_string = this.items[j].MenuID + ":" + handling.convertBooleanToBit(data.menuAccess) + ";"
                } else {
                  new_string = this.items[j].MenuID + ":" + this.items[j].AccessWrite + ";"
                }
                body.ListMenuID = body.ListMenuID + new_string
              }
            }
          }
        }
        methods.post("/api/menu/EditMenuRightByGroupID", body).then(val => {
          if (val && val.StatusCode === 200 && val.Success === 1) {
            this.getListMenu(this.edit)
            setTimeout(() => {
              this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
            }, timer)
          } else {
            this.getListMenu(this.edit)
            setTimeout(() => {
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
      toggleItem(event, item) {
        if (this.selectedItems.includes(item.id)) {
          this.selectedItems = this.selectedItems.filter(e => e !== item.id);
        }
        else {
          this.selectedItems.push(item.id)
        }
        let body = {
          GroupID: this.edit.group_id,
          ListMenuID: "",
          UserIDCurent: this.userIDCurrent,
          MenuIDCurent: this.objectData.menuIDCurrent
        }
        if (this.selectedItems.length > 0){
          for (let i = 0; i < this.selectedItems.length; i++){
            for (let j = 0; j < this.items.length; j++){
              if (this.selectedItems[i] === this.items[j].MenuID){
                let new_string = this.items[j].MenuID + ":" + this.items[j].AccessWrite + ";"
                body.ListMenuID = body.ListMenuID + new_string
              }
            }
          }
        }
        methods.post("/api/menu/EditMenuRightByGroupID", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            // this.getListMenu(this.edit)
            setTimeout(() => {
              this.makeToast('success', this.$t('toast.success').toUpperCase(), val.Message)
            }, timer)
          } else {
            this.getListMenu(this.edit)
            setTimeout(() => {
              this.makeToast('danger', this.$t('toast.fail').toUpperCase(), val.Message)
            }, timer)
          }
        }).catch(err => {
          console.log(err);
        })
      },
      getListMenuChange(items){
        this.edit = {
          group_id: items.value,
          group_name: items.text,
        }
        this.getListMenu(this.edit)
      },
      getListMenu(items) {
        this.itemsRecursive = []
        this.selectedItems = []
        let body = {
          GroupID: items.group_id
        }
        methods.post("/api/menu/GetListMenuByGroupID", body).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            this.items = val.Result
            handling.recursiveMenuRightEdit(val.Result, '0', this.itemsRecursive)
            for (let i = 0; i < val.Result.length; i++) {
              if (val.Result[i].IsSelected === 1) {
                this.selectedItems.push(val.Result[i].MenuID)
              }
            }
          }
        }).catch(err => {
          console.log(err);
        })
        this.loadItems()
      },
      getListGroup() {
        this.listGroup = []
        methods.post("/api/groupuser/GetListGroupUser", {}).then(val => {
          if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
            for (let i = 0; i < val.Result.length; i++) {
              let obj = {
                value: val.Result[i].GroupID,
                text: val.Result[i].GroupName,
              }
              this.listGroup.push(obj)
            }
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
      await this.getListGroup()
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
    mounted() {
      setTimeout(() => {
        this.edit = {
          group_id: this.listGroup[0].value,
          group_name: this.listGroup[0].text,
        }
        this.getListMenu(this.edit)
      }, timer)
    }
  }
</script>
<style>

</style>
