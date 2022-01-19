<template>
  <div>
    <template v-if="typeForm === 'INFO'">
      <b-modal class="text-center" :id="nameForm" :title="titleForm" ok-only @hidden="resetModal" scrollable size="lg">
        <b-row>
          <template v-for="items in Object.keys(dataForm)" v-if="Object.keys(dataForm).length > 0">
            <template v-if="dataForm[items][2].toUpperCase() === 'CHECK'">
              <b-colxx md="12">
                <b-alert class="text-center font-italic" variant="success" v-if="dataForm[items][1] === 1" show><strong>Đã đóng</strong></b-alert>
                <b-alert class="text-center font-italic" variant="danger" v-else show><strong>Chưa đóng</strong></b-alert>
              </b-colxx>
            </template>
            <template v-else>
              <template v-if="items.toUpperCase().search('NOTE') === -1 && items.toUpperCase().search('DESCRIPTION') === -1">
                <b-colxx md="6">
                  <template v-if="dataForm[items][2].toUpperCase() === 'BIT'">
                    <b-form-group :label="dataForm[items][0]">
                      <b-form-checkbox v-model="dataForm[items][1]" switch size="md" disabled>
                        <template v-if="dataForm[items][1] === true">{{$t('status.active')}}</template>
                        <template v-else>{{$t('status.non-active')}}</template>
                      </b-form-checkbox>
                    </b-form-group>
                  </template>
                  <template v-else-if="dataForm[items][2].toUpperCase() === 'DATE'">
                    <b-form-group :label="dataForm[items][0]">
                      <b-form-input class="text-left" :value="convertDate(dataForm[items][1])" disabled></b-form-input>
                    </b-form-group>
                  </template>
                  <template v-else>
                    <template v-if="dataForm[items][2].toUpperCase().search('NUMBER') > -1">
                      <b-form-group :label="dataForm[items][0]">
                        <b-form-input class="text-right" v-model="dataForm[items][1]" disabled></b-form-input>
                      </b-form-group>
                    </template>
                    <template v-else>
                      <b-form-group :label="dataForm[items][0]">
                        <b-form-input class="text-left" v-model="dataForm[items][1]" disabled></b-form-input>
                      </b-form-group>
                    </template>
                  </template>
                </b-colxx>
              </template>
              <template v-else>
                <b-colxx md="12">
                  <b-form-group :label="dataForm[items][0]">
                    <b-form-textarea class="text-left" v-model="dataForm[items][1]" rows="3" max-rows="6" disabled></b-form-textarea>
                  </b-form-group>
                </b-colxx>
              </template>
            </template>
          </template>
        </b-row>
      </b-modal>
    </template>
    <template v-else>
      <b-modal
        :id="nameForm"
        :ref="nameForm"
        :title="titleForm"
        @hidden="resetModal"
        @ok="handleModal"
        v-if="dataForm"
        scrollable
        class="text-center"
        size="lg"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-row>
            <template v-for="items in Object.keys(dataForm)" v-if="Object.keys(dataForm).length > 0">
              <template v-if="items.toUpperCase().search('NOTE') === -1 && items.toUpperCase().search('DESCRIPTION') === -1">
                <b-colxx md="6">
                  <template v-if="dataForm[items][2].toUpperCase() === 'BIT'">
                    <b-form-group :label="dataForm[items][0]">
                      <b-form-checkbox v-model="dataForm[items][1]" switch size="md">
                        <template v-if="dataForm[items][1] === true">{{$t('status.active')}}</template>
                        <template v-else>{{$t('status.non-active')}}</template>
                      </b-form-checkbox>
                    </b-form-group>
                  </template>
                  <template v-else-if="dataForm[items][2].toUpperCase() === 'KEY'">
                    <b-form-group :label="dataForm[items][0]">
                      <b-form-input class="text-center" v-model="dataForm[items][1]" disabled
                      ></b-form-input>
                    </b-form-group>
                  </template>
                  <template v-else-if="dataForm[items][2].toUpperCase() === 'DATE'">
                    <b-form-group :label="dataForm[items][0]">
                      <b-form-datepicker locale="vi" v-model="dataForm[items][1]" required></b-form-datepicker>
                    </b-form-group>
                  </template>
                  <template v-else-if="dataForm[items][2].toUpperCase() === 'SELECT'">
                    <b-form-group :label="dataForm[items][0]">
                      <b-form-select v-model="dataForm[items][1]" :options="dataFormOption[items]" size="sm"></b-form-select>
                    </b-form-group>
                  </template>
                  <template v-else-if="dataForm[items][2].toUpperCase() === 'EMAIL'">
                    <b-form-group
                      :label="dataForm[items][0]"
                      :label-for="items + '-input'"
                      :invalid-feedback="$t('form.please-invalid') + dataForm[items][0].toLowerCase()"
                      :state="stateForm[items]"
                    >
                      <b-form-input
                        class="text-left"
                        :id="items + '-input'"
                        v-model="dataForm[items][1]"
                        :state="stateForm[items]"
                        type="email"
                      ></b-form-input>
                    </b-form-group>
                  </template>
                  <template v-else-if="dataForm[items][2].toUpperCase().search('NUMBER') > -1">
                    <b-form-group
                      :label="dataForm[items][0]"
                      :label-for="items + '-input'"
                      :invalid-feedback="$t('form.please-invalid') + dataForm[items][0].toLowerCase()"
                      :state="stateForm[items]"
                    >
                      <b-form-input
                        class="text-right"
                        :id="items + '-input'"
                        v-model="dataForm[items][1]"
                        :state="stateForm[items]"
                        type="number"
                        min="0"
                      ></b-form-input>
                    </b-form-group>
                  </template>
                  <template v-else>
                    <b-form-group
                      :label="dataForm[items][0]"
                      :label-for="items + '-input'"
                      :invalid-feedback="$t('form.please-invalid') + dataForm[items][0].toLowerCase()"
                      :state="stateForm[items]"
                    >
                      <b-form-input
                        class="text-left"
                        :id="items + '-input'"
                        v-model="dataForm[items][1]"
                        :state="stateForm[items]"
                        required
                      ></b-form-input>
                    </b-form-group>
                  </template>
                </b-colxx>
              </template>
              <template v-else>
                <b-colxx md="12">
                  <b-form-group :label="dataForm[items][0]">
                    <b-form-textarea class="text-left" v-model="dataForm[items][1]" rows="3" max-rows="6"></b-form-textarea>
                  </b-form-group>
                </b-colxx>
              </template>
            </template>
          </b-row>
        </form>
      </b-modal>
    </template>
  </div>
</template>

<script>
  import moment from 'moment'
  import methods from '../../function/api'
  import wfs from '../../function/wfs'

  export default {
    props: ['nameForm', 'titleForm', 'dataForm', 'dataFormOption', 'stateForm', 'apiForm', 'idForm', 'typeForm', 'userCurrent', 'menuCurrent'],
    data(){
      return {}
    },
    methods:{
      convertDate(string){
        let date = moment(string, "YYYY-MM-DD'T'HH:mm:ss")
        return date.format('DD/MM/YYYY')
      },
      resetModal() {
        for (let i = 0; i < Object.keys(this.dataForm).length; i++){
          this.dataForm[Object.keys(this.dataForm)[i]][1] = null
          this.stateForm[Object.keys(this.dataForm)[i]] = null
        }
      },
      checkFormValidityModal() {
        let valid = this.$refs.form.checkValidity()
        let pattern = /((09|03|07|08|05)+([0-9]{8})\b)/g
        for (let i = 0; i < Object.keys(this.dataForm).length; i++){
          if (Object.keys(this.dataForm)[i].toUpperCase().search('NOTE') === -1 && Object.keys(this.dataForm)[i].toUpperCase().search('DESCRIPTION') === -1) {
            if (this.dataForm[Object.keys(this.dataForm)[i]][2].toUpperCase() !== 'SELECT' && this.dataForm[Object.keys(this.dataForm)[i]][2].toUpperCase() !== 'DATE'
              && this.dataForm[Object.keys(this.dataForm)[i]][2].toUpperCase() !== 'BIT' && this.dataForm[Object.keys(this.dataForm)[i]][2].toUpperCase() !== 'KEY') {
              if (this.dataForm[Object.keys(this.dataForm)[i]][2].toUpperCase() === 'PHONE'){
                if (!pattern.test(this.dataForm[Object.keys(this.dataForm)[i]][1])){
                  valid = false
                  this.stateForm[Object.keys(this.dataForm)[i]] = false
                }
              } else {
                this.stateForm[Object.keys(this.dataForm)[i]] = document.getElementById(Object.keys(this.dataForm)[i] + '-input').checkValidity()
              }
            }
          }
        }
        return valid
      },
      handleModal(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()
      },
      handleSubmit() {
        if (!this.checkFormValidityModal()) {
          return
        }
        let body, objectData
        if (this.typeForm === 'ADD') {
          body = {
            UserIDCurent: this.userCurrent,
            MenuIDCurent: this.menuCurrent
          }
        } else if (this.typeForm === 'EDIT') {
          body = {
            StationID: this.idForm,
            UserIDCurent: this.userCurrent,
            MenuIDCurent: this.menuCurrent
          }
        }
        switch (this.dataForm['DataTypeID'][1]) {
          case 1:
            objectData = null
            break
          case 2:
            objectData = wfs.getDataTypeForm(this.dataForm, 'Air')
            break
          case 3:
            objectData = wfs.getDataTypeForm(this.dataForm, 'Water')
            break
          default:
            objectData = null
            break
        }
        let obj = {}
        for (let i = 0; i < Object.keys(this.dataForm).length; i++){
          let key = Object.keys(this.dataForm)[i]
          obj[key] = this.dataForm[Object.keys(this.dataForm)[i]][1]
        }

        Object.assign(body, obj);
        if (objectData !== null) {
          methods.post(this.apiForm, body).then(val => {
            this.$emit('handle-submit', val, objectData)
          }).catch(err => {
            console.log(err);
          })
        } else {
          this.makeToast('danger', this.$t('toast.fail').toUpperCase(), objectData)
        }
      },
      makeToast(variant = null, title, body) {
        this.$bvToast.toast(body, {
          title: title,
          variant: variant,
          solid: true,
          autoHideDelay: 10000
        })
      },
    }
  }
</script>
