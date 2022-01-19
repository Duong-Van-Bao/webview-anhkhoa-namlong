import Vue from 'vue'
import App from './App'

import BootstrapVue from 'bootstrap-vue'
import router from './router'
import store from './store'
import en from './locales/en.json'
import vn from './locales/vn.json'
import VueI18n from 'vue-i18n'
import { defaultLocale, localeOption, firebaseConfig } from './constants/config'
import Notifications from './components/Common/Notification'
import Breadcrumb from './components/Common/Breadcrumb'
import RefreshButton from './components/Common/RefreshButton'
import Colxx from './components/Common/Colxx'
import vuePerfectScrollbar from 'vue-perfect-scrollbar'
import ContentMenu from 'v-contextmenu'
import VueLineClamp from 'vue-line-clamp'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import VueScrollTo from 'vue-scrollto'
import firebase from 'firebase/app'
import 'firebase/auth'
import '@fortawesome/fontawesome-free/css/all.css'
import vueShortKey from 'vue-shortkey'


Vue.use(BootstrapVue);
Vue.use(VueI18n);

const messages = { vn: vn, en: en };
const locale = (localStorage.getItem('currentLanguage') && localeOption.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) ? localStorage.getItem('currentLanguage') : defaultLocale;
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'vn',
  messages
});

Vue.use(Notifications);
Vue.component('piaf-breadcrumb', Breadcrumb);
Vue.component('b-refresh-button', RefreshButton);
Vue.component('b-colxx', Colxx);
Vue.component('vue-perfect-scrollbar', vuePerfectScrollbar);
Vue.use(vueShortKey);
Vue.use(ContentMenu);
Vue.use(VueLineClamp, {
  importCss: true
})
import Axios from 'axios'

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = "Bearer " + token
}
if (locale) {
  Vue.prototype.$http.defaults.headers.common['Language'] = locale
}

Vue.use(VCalendar, {
  firstDayOfWeek: 2,
  formats: {
    title: 'MMM YY',
    weekdays: 'WW',
    navMonths: 'MMMM',
    input: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
    dayPopover: 'L'
  },
  datePickerShowDayPopover: false,
  popoverExpanded: true,
  popoverDirection: 'bottom'
});
Vue.use(VueScrollTo);

firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false

export default new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
