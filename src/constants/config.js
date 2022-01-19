import methods from '../function/api'

export const defaultMenuType = 'menu-default'
export const searchPath = '/app/pages/miscellaneous/search'
export const buyUrl = 'https://1.envato.market/nEyZa'

export const subHiddenBreakpoint = 1440
export const menuHiddenBreakpoint = 768

let localeOptionData = methods.post("/api/config/ChoseLanguage",{})
function getLocale(data){
  let array = []
  data.then(val => {
    if (val !== null && val !== '' && val !== undefined && val.StatusCode === 200 && val.Success === 1) {
      for (let i = 0; i < val.Result.length; i++) {
        array.push({ id: val.Result[i].Code, name: val.Result[i].LanguageName, direction: 'ltr', icon: val.Result[i].Icon })
      }
    }
  }).catch(err =>{
    console.log(err);
  })
  return array
}

export const defaultLocale = 'vn'
export const defaultDirection = 'ltr'
export const localeOption = new getLocale(localeOptionData)

export const firebaseConfig = {
  // apiKey: "AIzaSyDe94G7L-3soXVSpVbsYlB5DfYH2L91aTU",
  // authDomain: "piaf-vue-login.firebaseapp.com",
  // databaseURL: "https://piaf-vue-login.firebaseio.com",
  // projectId: "piaf-vue-login",
  // storageBucket: "piaf-vue-login.appspot.com",
  // messagingSenderId: "557576321564",
  // appId: "1:557576321564:web:bc2ce73477aff5c2197dd9"
};

export const themeRadiusStorageKey = 'theme_radius'
export const defaultColor = 'light.orange'
export const colors = [
  'light.purple',
  'dark.purple',
  'light.blue',
  'dark.blue',
  'light.green',
  'dark.green',
  'light.orange',
  'dark.orange',
  'light.red',
  'dark.red'
]
