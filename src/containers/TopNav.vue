<template>
  <nav class="navbar fixed-top">
    <h1>data dư liệu :{{currentUser}}</h1>
    <div class="d-flex align-items-center navbar-left">
      <a
        href="#"
        class="menu-button d-none d-md-block"
        @click.prevent="changeSideMenuStatus({step :menuClickCount+1,classNames:menuType,selectedMenuHasSubItems})"
      >
        <menu-icon />
      </a>
      <a
        href="#"
        class="menu-button-mobile d-xs-block d-sm-block d-md-none"
        @click.prevent="changeSideMenuForMobile(menuType)"
      >
        <mobile-menu-icon />
      </a>
      <div class="d-inline-block">
        <b-dropdown
          id="langddm"
          class="ml-2"
          variant="light"
          size="sm"
          toggle-class="language-button"
        >
          <template slot="button-content">
            <b-img
              alt="img_language"
              v-for="(k,index) in localeOption"
              v-if="k.id === $i18n.locale"
              fluid
              :key="index"
              :src="k.icon"
              width="30"
            />
            <span class="name">{{$i18n.locale.toUpperCase()}}</span>
          </template>
          <b-dropdown-item
            v-for="(l,index) in localeOption"
            :key="index"
            @click="changeLocale(l.id, l.direction)"
          >
            <b-img
              alt="img_language"
              fluid
              :src="l.icon"
              width="30"
            />
            <span class="ml-2">{{l.name}}</span>
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <router-link
      class="navbar-logo"
      tag="a"
      to="/"
    >
      <span class="logo d-none d-xs-block"></span>
      <span class="logo-mobile d-block d-xs-none"></span>
    </router-link>
    <div class="navbar-right">
      <div class="d-none d-md-inline-block align-middle mr-3">
        <switches
          id="tool-mode-switch"
          v-model="isDarkActive"
          theme="custom"
          class="vue-switcher-small"
          color="primary"
        />
        <b-tooltip
          target="tool-mode-switch"
          placement="left"
          title="Dark Mode"
        ></b-tooltip>
      </div>
      <div class="header-icons d-inline-block align-middle">
        <div class="position-relative d-none d-sm-inline-block ">
          <div class="btn-group">
            <b-button
              variant="empty"
              class="header-icon btn-sm"
              @click="toggleFullScreen"
            >
              <i :class="{'d-inline-block':true,'simple-icon-size-actual':fullScreen,'simple-icon-size-fullscreen':!fullScreen }" />
            </b-button>
          </div>
        </div>
      </div>
      <div
        class="user d-inline-block"
        v-if="currentUser != null"
      >
        <b-dropdown
          class="dropdown-menu-right"
          right
          variant="empty"
          toggle-class="p-0"
          menu-class="mt-3"
          no-caret
        >
          <template slot="button-content">
            <span class="name mr-1">
              <strong v-if="isDarkActive === false">{{currentUser.UserName.charAt(0).toUpperCase() + currentUser.UserName.slice(1)}}</strong>
              <strong
                v-else
                style="color: white"
              >{{currentUser.UserName.charAt(0).toUpperCase() + currentUser.UserName.slice(1)}}</strong>
            </span>
            <span>
              <img
                :alt="currentUser.title"
                :src="'http://imgsmartcity.namlongtekgroup.com/Avatar/' + currentUser.Avatar"
              />
            </span>
          </template>
          <b-dropdown-item @click="showProfile(profile)">{{$t('header.account')}}</b-dropdown-item>
          <b-dropdown-item @click="changePassword()">{{$t('header.change-password')}}</b-dropdown-item>
          <b-dropdown-item>{{$t('header.history')}}</b-dropdown-item>
          <b-dropdown-item>{{$t('header.support')}}</b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item @click="logout">{{$t('header.logout')}}</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <b-modal
      id="modal-change"
      ref="modal-change"
      title="ĐỔI MẬT KHẨU"
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <form
        ref="form"
        @submit.stop.prevent="handleSubmit"
      >
        <b-form-group
          label="Mật khẩu cũ"
          label-for="pass-old-input"
          invalid-feedback="Nhập mật khẩu cũ"
          :state="addState.pass_old"
        >
          <b-form-input
            id="pass-old-input"
            v-model="add.pass_old"
            :state="addState.pass_old"
            type="password"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Mật khẩu mới"
          label-for="pass-new-input"
          invalid-feedback="Nhập mật khẩu mới"
          :state="addState.pass_new"
        >
          <b-form-input
            id="pass-new-input"
            v-model="add.pass_new"
            :state="addState.pass_new"
            type="password"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </nav>
</template>

<script>
import Switches from 'vue-switches'
import {
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'
import {
  MenuIcon,
  MobileMenuIcon
} from '../components/Svg'
import {
  searchPath,
  menuHiddenBreakpoint,
  localeOption,
  buyUrl,
  defaultColor
} from '@/constants/config'
import {
  getDirection,
  setDirection
} from '../utils'
import methods from '../function/api'

export default {
  components: {
    'menu-icon': MenuIcon,
    'mobile-menu-icon': MobileMenuIcon,
    'switches': Switches
  },
  data () {
    return {
      selectedParentMenu: '',
      searchKeyword: '',
      isMobileSearch: false,
      isSearchOver: false,
      fullScreen: false,
      menuHiddenBreakpoint,
      searchPath,
      localeOption,
      buyUrl,
      isDarkActive: false,
      profile: this.$store.getters.currentUser,
      addState: {
        pass_old: null,
        pass_new: null,
      },
      add: {
        pass_old: null,
        pass_new: null,
      },
    }
  },
  methods: {
    ...mapMutations(['changeSideMenuStatus', 'changeSideMenuForMobile']),
    ...mapActions(['setLang', 'signOut']),
    search () {
      if (this.searchKeyword === '') {
        return
      }
      if (this.searchKeyword === this.$route.query.keyword) {
        this.searchKeyword = ''
        return
      }
      this.$router.push({ path: `${this.searchPath}`, query: { keyword: `${this.searchKeyword}` } })
      this.searchKeyword = ''
    },
    searchClick () {
      if (window.innerWidth < this.menuHiddenBreakpoint) {
        if (!this.isMobileSearch) {
          this.isMobileSearch = true
        } else {
          this.search()
          this.isMobileSearch = false
        }
      } else {
        this.search()
      }
    },
    handleDocumentforMobileSearch () {
      if (!this.isSearchOver) {
        this.isMobileSearch = false
        this.searchKeyword = ''
      }
    },

    changeLocale (locale, direction) {
      const currentDirection = getDirection().direction
      if (direction !== currentDirection) {
        setDirection(direction)
      }
      this.setLang(locale)
    },
    logout () {
      this.signOut().then(() => {
        this.$router.push('/user/login')
      })
    },

    toggleFullScreen () {
      const isInFullScreen = this.isInFullScreen()
      let docElm = document.documentElement
      if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen()
        } else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen()
        } else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen()
        } else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      }
      this.fullScreen = !isInFullScreen
    },
    getThemeColor () {
      return localStorage.getItem('themeColor') ?
        localStorage.getItem('themeColor') :
        defaultColor
    },
    isInFullScreen: function () {
      return (
        (document.fullscreenElement && true) ||
        (document.webkitFullscreenElement && true) ||
        (document.mozFullScreenElement && true) ||
        (document.msFullscreenElement && true)
      )
    },
    showProfile (items) {
      setTimeout(() => {
        const h = this.$createElement
        const messageVNode = h('div', { class: ['foobar'] }, [
          h('b-img', {
            props: {
              src: 'http://imgsmartcity.namlongtekgroup.com/Avatar/' + this.currentUser.Avatar,
              thumbnail: true,
              center: true,
              fluid: true, rounded: 'circle'
            }
          }),
          h('p', { class: ['text-center', 'mt-4', 'text-uppercase'] }, [
            h('strong', items.UserFullName)]),
          h('p', { class: ['text-center'] }, [
            'Nhóm người dùng: ',
            h('strong', items.GroupName)]),
          h('p', { class: ['text-center'] }, [
            'Điện thoại: ',
            h('strong', items.UserPhone)]),
          h('p', { class: ['text-center'] }, [
            'Email: ',
            h('strong', items.UserEmail)]),
          h('p', { class: ['text-center'] }, [
            'Địa chỉ: ',
            h('strong', items.UserAddress)]),
        ])
        this.$bvModal.msgBoxOk([messageVNode], {
          buttonSize: 'md',
          centered: true, size: 'md'
        })
      }, 200)
    },
    changePassword () {
      this.$bvModal.show('modal-change')
    },
    checkFormValidity () {
      let valid = this.$refs.form.checkValidity()
      this.addState = {
        pass_old: document.getElementById('pass-old-input').checkValidity(),
        pass_new: document.getElementById('pass-new-input').checkValidity(),
      }
      return valid
    },
    resetModal () {
      this.addState = {
        pass_old: null,
        pass_new: null,
      }
      this.add = {
        pass_old: null,
        pass_new: null,
      }
    },
    handleOk (bvModalEvt) {
      bvModalEvt.preventDefault()
      this.handleSubmit()
    },
    handleSubmit () {
      if (!this.checkFormValidity()) {
        return
      }
      let body = {
        UserPassword: this.add.pass_old,
        UserPassNew: this.add.pass_new,
        UserID: this.profile.UserID,
      }
      methods.post("/api/authentication/ChangePasswordUser", body).then(val => {
        if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
          this.$bvModal.hide('modal-change')
          setTimeout(() => {
            this.makeToast('success', 'Thành công', 'Tự động đăng xuất sau 3s.')
            setTimeout(() => {
              this.signOut().then(() => {
                this.$router.push('/user/login')
              })
            }, 3000)
          }, 200)
        } else {
          this.$bvModal.hide('modal-change')
          setTimeout(() => {
            this.makeToast('danger', 'Thất bại', val.Message)
          }, 200)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    makeToast (variant = null, title, body) {
      this.$bvToast.toast(body, {
        title: title,
        variant: variant,
        solid: true,
        autoHideDelay: 1000
      })
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
      menuType: 'getMenuType',
      menuClickCount: 'getMenuClickCount',
      selectedMenuHasSubItems: 'getSelectedMenuHasSubItems'
    })
  },
  beforeDestroy () {
    document.removeEventListener('click', this.handleDocumentforMobileSearch)
  },
  created () {
    const color = this.getThemeColor()
    this.isDarkActive = color.indexOf('dark') > -1
  },
  watch: {
    '$i18n.locale' (to, from) {
      if (from !== to) {
        this.$router.go(this.$route.path)
      }
    },
    isDarkActive (val) {
      let color = this.getThemeColor()
      let isChange = false
      if (val && color.indexOf('light') > -1) {
        isChange = true
        color = color.replace('light', 'dark')
      } else if (!val && color.indexOf('dark') > -1) {
        isChange = true
        color = color.replace('dark', 'light')
      }
      if (isChange) {
        localStorage.setItem('themeColor', color)
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    },
    isMobileSearch (val) {
      if (val) {
        document.addEventListener('click', this.handleDocumentforMobileSearch)
      } else {
        document.removeEventListener(
          'click',
          this.handleDocumentforMobileSearch
        )
      }
    }
  }
}
</script>
