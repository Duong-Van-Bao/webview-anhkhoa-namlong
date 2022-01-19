<template>
  <div>
    <b-row class="mb-4">
      <b-colxx md="8" class="mt-2">
        <span>{{$t('form.total')}}: <strong>{{totalRows}}</strong> {{$t('form.result').toLowerCase()}}</span>
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
              v-model="filter"
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
      @row-selected="rowSelected"
      selectable
      :select-mode="selectMode"
      :current-page="currentPage"
      :per-page="perPage"
      selectedVariant="primary"
      :fields="fieldTable"
      :items="dataTable"
      class="text-center"
      @filtered="onFiltered"
      :filter="filter"
      responsive
    >
      <template v-slot:[`cell(${objKey.ClName})`]="row" v-for="(objKey, key) in columnShow">
        <template v-if="objKey.TypeCol.toUpperCase() === 'BIT' || objKey.TypeCol.toUpperCase() === 'CHECK'">
          <b-form-checkbox :key="key" v-model="row.item[objKey.ClName]" @change="statusEdit(row.item)" switch size="md" v-if="accessWrite === true"></b-form-checkbox>
          <b-form-checkbox :key="key" v-model="row.item[objKey.ClName]" switch size="md" v-else disabled></b-form-checkbox>
        </template>
        <template v-else-if="objKey.TypeCol.toUpperCase() === 'DATE'">
          <span class="text-muted">{{convertDate(row.item[objKey.ClName])}}</span>
        </template>
        <template v-else>
          {{row.item[objKey.ClName]}}
        </template>
      </template>
    </b-table>
    <b-pagination
      size="sm"
      align="center"
      :total-rows="totalRows"
      :per-page="perPage"
      v-model="currentPage"
    >
      <template v-slot:next-text>
        <i class="simple-icon-arrow-right"/>
      </template>
      <template v-slot:prev-text>
        <i class="simple-icon-arrow-left"/>
      </template>
      <template v-slot:first-text>
        <i class="simple-icon-control-start"/>
      </template>
      <template v-slot:last-text>
        <i class="simple-icon-control-end"/>
      </template>
    </b-pagination>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    props: ['dataTable', 'fieldTable', 'columnShow', 'selectedItems', 'accessWrite', 'selectMode'],
    data(){
      return {
        currentPage: 1,
        perPage: 10,
        search_title: this.$t('form.search-invalid'),
        filter: '',
        totalRows: 0,
      }
    },
    mounted() {
      setTimeout(() => {
        this.totalRows = this.dataTable.length
      },200)
    },
    updated() {
      if (this.dataTable && this.filter === '') {
        this.totalRows = this.dataTable.length
      }
    },
    methods: {
      rowSelected(items) {
        this.$emit('row-selected', items)
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length;
        this.currentPage = 1;
      },
      statusEdit(items){
        this.$emit('status-edit', items)
      },
      convertDate(string){
        let date = moment(string, "YYYY-MM-DD'T'HH:mm:ss")
        return date.format('DD/MM/YYYY')
      },
    }
  }
</script>
