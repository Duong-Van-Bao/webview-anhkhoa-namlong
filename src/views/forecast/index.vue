<template>
  <div id="app-container" :class="getMenuType">
    <top-nav/>
    <sidebar/>
    <div class="main-custom">
      <div class="container-fluid">
        <router-view/>
      </div>
    </div>
    <footer-component/>
  </div>
</template>

<script>
  import Sidebar from './containers/Sidebar'
  import TopNav from './containers/TopNav'
  import Footer from './containers/Footer'
  import {
    mapGetters
  } from 'vuex'

  export default {
    components: {
      'top-nav': TopNav,
      'sidebar': Sidebar,
      'footer-component': Footer
    },
    data() {
      return {
        show: false
      }
    },
    computed: {
      ...mapGetters(['getMenuType']),
    }
  }
</script>
<style scoped>
  @media screen and (max-width: 767px){
    footer.page-footer {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
      border-top: 1px solid #d7d7d7;
      width: 100%;
      position: absolute;
      bottom: 0;
      height: 70px;
    }
  }

  @media screen and (min-width: 768px) and (max-width: 1199px){
    footer.page-footer {
      padding-top: 1.6rem;
      padding-bottom: 1.6rem;
      border-top: 1px solid #d7d7d7;
      width: 100%;
      position: absolute;
      bottom: 0;
      height: 80px;
    }
  }
</style>
