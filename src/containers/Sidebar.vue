<template>
  <div
    class="sidebar"
    @mouseenter="isMenuOver=true"
    @mouseleave="isMenuOver=false"
    @touchstart="isMenuOver=true"
  >
    <div class="main-menu">
      <vue-perfect-scrollbar
        class="scroll"
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
      >
        <ul class="list-unstyled">
          <li
            v-for="(item,index) in items"
            :id="'tooltip-target-' + item.id"
            :class="{ 'active' : (selectedParentMenu === item.controller && viewingParentMenu === '') || viewingParentMenu === item.id}"
            :key="`parent_${item.id}`"
            :data-flag="item.id"
          >
            <template v-if="item.action.toUpperCase() === 'MANAGE'">
              <a
                v-if="item.subs && item.subs.length > 0"
                @click.prevent="openSubMenu($event, item)"
                :href="`#${item.to}`"
              >
                <i :class="item.icon" />
              </a>
              <router-link
                v-else
                @click.native="changeSelectedParentHasNoSubmenu(item.id)"
                :to="item.to"
              >
                <i :class="item.icon" />
              </router-link>
            </template>
            <template v-else>
              <router-link
                @click.native="openSubMenu($event, item)"
                :to="item.to"
              >
                <i :class="item.icon" />
              </router-link>
            </template>
            <b-tooltip
              :target="'tooltip-target-' + item.id"
              triggers="hover"
              placement="right"
            >
              <strong>{{ item.label.toUpperCase() }}</strong>
            </b-tooltip>
          </li>
        </ul>
      </vue-perfect-scrollbar>
    </div>
    <div class="sub-menu">
      <vue-perfect-scrollbar
        class="scroll"
        :settings="{ suppressScrollX: true, wheelPropagation: false }"
      >
        <ul
          v-for="(item,itemIndex) in items"
          :class="{'list-unstyled':true, 'd-block' : (selectedParentMenu === item.controller && viewingParentMenu === '') || viewingParentMenu === item.id }"
          :data-parent="item.id"
          :key="`sub_${item.id}`"
        >
          <li
            v-for="(sub,subIndex) in item.subs"
            :class="{'has-sub-item' : sub.subs && sub.subs.length > 0 , 'active' : $route.path.indexOf(sub.to)>-1}"
          >
            <template v-if="item.action.toUpperCase() === 'MANAGE'">
              <template v-if="sub.subs &&  sub.subs.length > 0">
                <b-link
                  v-b-toggle="`menu_${itemIndex}_${subIndex}`"
                  variant="link"
                  class="rotate-arrow-icon opacity-50"
                >
                  <i class="simple-icon-arrow-down"></i> <span class="d-inline-block">{{sub.label}}</span>
                </b-link>
                <b-collapse
                  visible
                  :id="`menu_${itemIndex}_${subIndex}`"
                >
                  <ul class="list-unstyled third-level-menu">
                    <li
                      v-for="(thirdLevelSub, thirdIndex) in sub.subs"
                      :key="`third_${itemIndex}_${subIndex}_${thirdIndex}`"
                      :class="{'third-level-menu':true , 'active' : $route.path === thirdLevelSub.to}"
                    >
                      <router-link :to="thirdLevelSub.to">
                        <i
                          :class="thirdLevelSub.icon"
                          style="width: 25px"
                        />
                        <span>{{ thirdLevelSub.label }}</span>
                      </router-link>
                    </li>
                  </ul>
                </b-collapse>
              </template>
              <router-link
                v-else
                :to="sub.to"
              >
                <i
                  :class="sub.icon"
                  style="width: 25px"
                />
                <span>{{ sub.label }}</span>
              </router-link>
            </template>
            <template v-else-if="item.action.toUpperCase() === 'MAP'">
              <template v-if="sub.subs &&  sub.subs.length > 0">
                <b-link
                  v-b-toggle="`menu_${itemIndex}_${subIndex}`"
                  variant="link"
                  class="rotate-arrow-icon opacity-50"
                >
                  <i class="simple-icon-arrow-down"></i> <span class="d-inline-block">{{sub.label}}</span>
                </b-link>
                <b-collapse
                  visible
                  :id="`menu_${itemIndex}_${subIndex}`"
                >
                  <ul class="list-unstyled third-level-menu">
                    <li
                      v-for="(thirdLevelSub, thirdIndex) in sub.subs"
                      :key="`third_${itemIndex}_${subIndex}_${thirdIndex}`"
                      :class="{'third-level-menu':true , 'active' : $route.path === thirdLevelSub.to}"
                      @click.prevent="checkLayer(thirdLevelSub.action, thirdLevelSub.to)"
                    >
                      <b-form-checkbox
                        class="itemCheck mb-3"
                        :checked="selectedLayer.includes(thirdLevelSub.to)"
                      >
                        <i
                          :class="thirdLevelSub.icon"
                          style="width: 25px; margin-right: 0"
                        />
                        <span>{{ thirdLevelSub.label }}</span>
                      </b-form-checkbox>
                    </li>
                  </ul>
                </b-collapse>
              </template>
              <span
                v-else
                @click.prevent="checkRegion(sub.to)"
              >
                <b-form-checkbox
                  class="itemCheck mb-3"
                  :checked="selectedType.includes(sub.to)"
                >
                  <i
                    :class="sub.icon"
                    style="width: 25px; margin-right: 0"
                  />
                  <span>{{ sub.label }}</span>
                </b-form-checkbox>
              </span>
            </template>
            <template v-else>
              <template v-if="sub.subs &&  sub.subs.length > 0">
                <b-link
                  v-b-toggle="`menu_${itemIndex}_${subIndex}`"
                  variant="link"
                  class="rotate-arrow-icon opacity-50"
                >
                  <i class="simple-icon-arrow-down"></i> <span class="d-inline-block">{{sub.label}}</span>
                </b-link>
                <b-collapse
                  visible
                  :id="`menu_${itemIndex}_${subIndex}`"
                >
                  <ul class="list-unstyled third-level-menu">
                    <li
                      v-for="(thirdLevelSub, thirdIndex) in sub.subs"
                      :key="`third_${itemIndex}_${subIndex}_${thirdIndex}`"
                      :class="{'third-level-menu':true , 'active' : $route.path === thirdLevelSub.to}"
                      @click.prevent="checkForecast(thirdLevelSub.to)"
                    >
                      <b-form-checkbox
                        class="itemCheck mb-3"
                        :checked="selectedForecast.includes(thirdLevelSub.to)"
                      >
                        <i
                          :class="thirdLevelSub.icon"
                          style="width: 25px; margin-right: 0"
                        />
                        <span>{{ thirdLevelSub.label }}</span>
                      </b-form-checkbox>
                    </li>
                  </ul>
                </b-collapse>
              </template>
              <span
                v-else
                @click.prevent="checkRegion(sub.to)"
              >
                <b-form-checkbox
                  class="itemCheck mb-3"
                  :checked="selectedType.includes(sub.to)"
                >
                  <i
                    :class="sub.icon"
                    style="width: 25px; margin-right: 0"
                  />
                  <span>{{ sub.label }}</span>
                </b-form-checkbox>
              </span>
            </template>
          </li>
        </ul>
      </vue-perfect-scrollbar>
    </div>
  </div>
</template>

<script>
import {
  mapGetters,
  mapMutations
} from 'vuex'
import {
  menuHiddenBreakpoint,
  subHiddenBreakpoint
} from '../constants/config'
import menuItems from '../constants/menu'
import { timer } from "../constants/services";

export default {
  data () {
    return {
      selectedParentMenu: '',
      isMenuOver: false,
      items: null,
      viewingParentMenu: '',
      selectedType: [],
      selectedLayer: [],
      selectedForecast: []
    }
  },
  mounted () {
    if (this.$route.query.type) {
      this.selectedType.push(this.$route.query.type)
    }
    if (this.$route.query.layers) {
      switch (typeof this.$route.query.layers) {
        case "string":
          this.selectedLayer.push(this.$route.query.layers)
          break
        case "object":
          let object = this.$route.query.layers
          for (let i = 0; i < object.length; i++) {
            this.selectedLayer.push(object[i])
          }
          break
        default:
          break
      }
    }
    if (this.$route.query.forecast) {
      this.selectedForecast.push(this.$route.query.forecast)
    }
    setTimeout(() => {
      this.items = menuItems[0].subs
      this.selectMenu()
      window.addEventListener('resize', this.handleWindowResize)
      if (this.$route.path !== '/admin/map' && this.$route.path !== '/admin/forecast') {
        document.addEventListener('click', this.handleDocumentClick)
      }
      this.handleWindowResize()
    }, timer)
  },
  beforeDestroy () {
    if (this.$route.path !== '/admin/map' && this.$route.path !== '/admin/forecast') {
      document.addEventListener('click', this.handleDocumentClick)
    }
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    ...mapMutations(['changeSideMenuStatus', 'addMenuClassname', 'changeSelectedMenuHasSubItems']),
    selectMenu () {
      const currentParentUrl = this.$route.path.split('/').filter(x => x !== '')[1]
      if (currentParentUrl !== undefined || currentParentUrl !== null) {
        this.selectedParentMenu = currentParentUrl.toLowerCase()
      } else {
        this.selectedParentMenu = 'dashboards'
      }
      this.isCurrentMenuHasSubItem();
    },
    isCurrentMenuHasSubItem () {
      const menuItem = this.items.find(x => x.controller === this.selectedParentMenu)
      const isCurrentMenuHasSubItem = menuItem && menuItem.subs && menuItem.subs.length > 0 ? true : false
      if (isCurrentMenuHasSubItem !== this.selectedMenuHasSubItems) {
        if (!isCurrentMenuHasSubItem) {
          this.changeSideMenuStatus({
            step: 0,
            classNames: this.menuType,
            selectedMenuHasSubItems: false
          })
        }
      }
      return isCurrentMenuHasSubItem;
    },
    changeSelectedParentHasNoSubmenu (parentMenu) {
      this.selectedParentMenu = parentMenu
      this.viewingParentMenu = parentMenu
      this.changeSelectedMenuHasSubItems(false)
      this.changeSideMenuStatus({
        step: 0,
        classNames: this.menuType,
        selectedMenuHasSubItems: false
      })
    },
    openSubMenu (e, menuItem) {
      const selectedParent = menuItem.id;
      const hasSubMenu = menuItem.subs && menuItem.subs.length > 0;
      this.changeSelectedMenuHasSubItems(hasSubMenu);
      if (!hasSubMenu) {
        this.viewingParentMenu = selectedParent;
        this.selectedParentMenu = selectedParent;
        this.toggle();
      } else {
        const currentClasses = this.menuType ?
          this.menuType.split(' ').filter(x => x !== '') :
          '';
        if (!currentClasses.includes('menu-mobile')) {
          if (
            currentClasses.includes('menu-sub-hidden') &&
            (this.menuClickCount === 2 || this.menuClickCount === 0)
          ) {
            this.changeSideMenuStatus({
              step: 3,
              classNames: this.menuType,
              selectedMenuHasSubItems: hasSubMenu
            });
          } else if (
            currentClasses.includes('menu-hidden') &&
            (this.menuClickCount === 1 || this.menuClickCount === 3)
          ) {
            this.changeSideMenuStatus({
              step: 2,
              classNames: this.menuType,
              selectedMenuHasSubItems: hasSubMenu
            });
          } else if (
            currentClasses.includes('menu-default') &&
            !currentClasses.includes('menu-sub-hidden') &&
            (this.menuClickCount === 1 || this.menuClickCount === 3)
          ) {
            this.changeSideMenuStatus({
              step: 0,
              classNames: this.menuType,
              selectedMenuHasSubItems: hasSubMenu
            });
          }
        } else {

          this.addMenuClassname({
            classname: 'sub-show-temporary',
            currentClasses: this.menuType
          });
        }
        this.viewingParentMenu = selectedParent;
      }
    },
    handleDocumentClick (e) {
      if (!this.isMenuOver) {
        let cont = true
        var path = e.path || (e.composedPath && e.composedPath())
        path.map(p => {
          if (p.nodeName !== 'svg' && p.nodeName !== 'rect' && p.className !== undefined && p.className.indexOf('menu-button') > -1) {
            cont = false
          }
        })
        this.viewingParentMenu = '';
        this.selectMenu()
        if (cont || !this.selectedMenuHasSubItems) {
          this.toggle()
        }
      }
    },
    toggle () {
      const currentClasses = this.menuType.split(' ').filter(x => x !== '')
      if (currentClasses.includes('menu-sub-hidden') && this.menuClickCount === 3) {
        this.changeSideMenuStatus({
          step: 2,
          classNames: this.menuType,
          selectedMenuHasSubItems: this.selectedMenuHasSubItems
        })
      } else if (currentClasses.includes('menu-hidden') || currentClasses.includes('menu-mobile')) {
        if (!(this.menuClickCount === 1 && !this.selectedMenuHasSubItems)) {
          this.changeSideMenuStatus({
            step: 0,
            classNames: this.menuType,
            selectedMenuHasSubItems: this.selectedMenuHasSubItems
          })
        }
      }
    },
    handleWindowResize (event) {
      if (event && !event.isTrusted) {
        return
      }
      let nextClasses = this.getMenuClassesForResize(this.menuType)
      this.changeSideMenuStatus({
        step: 0,
        classNames: nextClasses.join(' '),
        selectedMenuHasSubItems: this.selectedMenuHasSubItems
      })
    },
    getMenuClassesForResize (classes) {
      let nextClasses = classes.split(' ').filter(x => x !== '')
      const windowWidth = window.innerWidth
      if (windowWidth < menuHiddenBreakpoint) {
        nextClasses.push('menu-mobile')
      } else if (windowWidth < subHiddenBreakpoint) {
        nextClasses = nextClasses.filter(x => x !== 'menu-mobile')
        if (
          nextClasses.includes('menu-default') &&
          !nextClasses.includes('menu-sub-hidden')
        ) {
          nextClasses.push('menu-sub-hidden')
        }
      } else {
        nextClasses = nextClasses.filter(x => x !== 'menu-mobile')
        if (
          nextClasses.includes('menu-default') &&
          nextClasses.includes('menu-sub-hidden')
        ) {
          nextClasses = nextClasses.filter(x => x !== 'menu-sub-hidden')
        }
      }
      return nextClasses
    },
    checkRegion (region) {
      if (!this.selectedType.includes(region)) {
        this.selectedType = []
        this.selectedType.push(region)
        this.$router.push({ path: this.$route.path, query: { type: region, layers: this.$route.query.layers } })
      }
    },
    checkForecast (forecast) {
      if (!this.selectedForecast.includes(forecast)) {
        this.selectedForecast = []
        this.selectedForecast.push(forecast)
        this.$router.push({ path: this.$route.path, query: { type: this.$route.query.type, forecast: forecast } })
      }
    },
    checkLayer (action, layer) {
      if (!this.selectedLayer.includes(layer)) {
        this.selectedLayer.push(layer)
      } else {
        this.selectedLayer.splice(this.selectedLayer.indexOf(layer), 1);
      }
      if (this.selectedLayer.length > 0) {
        this.$router.push({ path: this.$route.path, query: { type: this.$route.query.type, layers: this.selectedLayer } })
      } else {
        this.$router.push({ path: this.$route.path, query: { type: this.$route.query.type } })
      }
    },
  },
  computed: {
    ...mapGetters({
      menuType: 'getMenuType',
      menuClickCount: 'getMenuClickCount',
      selectedMenuHasSubItems: 'getSelectedMenuHasSubItems'
    }),
  },
  watch: {
    '$route' (to, from) {
      if (to.path !== from.path) {
        const toParentUrl = to.path.split('/').filter(x => x !== '')[1];
        if (toParentUrl !== undefined || true) {
          this.selectedParentMenu = toParentUrl.toLowerCase()
        } else {
          this.selectedParentMenu = 'dashboards'
        }
        this.selectMenu()
        this.toggle();
        this.changeSideMenuStatus({
          step: 0,
          classNames: this.menuType,
          selectedMenuHasSubItems: this.selectedMenuHasSubItems
        })
        window.scrollTo(0, top)
        this.selectedLayer = []
        this.selectedType = []
        this.selectedForecast = []
        if (to.query.type) {
          this.selectedType.push(to.query.type)
        }
        if (to.query.layers) {
          this.selectedLayer.push(to.query.layers)
        }
        if (to.query.forecast) {
          this.selectedForecast.push(to.query.forecast)
        }
      } else {
        if (to.fullPath === '/admin/map') {
          this.$router.push({ path: this.$route.fullPath, query: { type: 'CanTho2D' } })
          this.selectedLayer = []
          this.selectedType = []
          if (!to.query.type) {
            this.selectedType.push('CanTho2D')
          }
        }
        if (to.fullPath === '/admin/forecast') {
          this.$router.push({ path: this.$route.fullPath, query: { type: 'CanTho2D', forecast: 'Salinity-3-day' } })
          this.selectedForecast = []
          this.selectedType = []
          if (!to.query.type) {
            this.selectedType.push('CanTho2D')
          }
          if (!to.query.forecast) {
            this.selectedForecast.push('Salinity-3-day')
          }
        }
      }
    }
  },
  updated () {
    console.log('data', this.items);
  }
}
</script>
<style scoped>
.sidebar .main-menu {
  padding-top: 0;
}
</style>
