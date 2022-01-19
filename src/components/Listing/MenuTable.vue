<template>
  <div v-if="subs">
    <menu-table-list :type="type" :data="subs" :selected-items="selectedItems" :access-write="accessWrite"
                     @toggle-item="toggleItem" @check-active="checkActive"></menu-table-list>
  </div>
</template>

<script>
  import MenuTableList from './MenuTableList'
  export default {
    props: ['subs', 'selectedItems', 'accessWrite', 'type'],
    components: {
      'menu-table-list': MenuTableList
    },
    methods: {
      toggleItem(event, item) {
        this.$emit('toggle-item', event, item)
      },
      checkActive(data){
        this.$emit('check-active', data)
      },
    }
  }
</script>
