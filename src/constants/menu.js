import methods from '../function/api'
import store from '../store/index'
import handling from '../function/handling'

let menuData = methods.post("/api/menu/GetMenuRightByGroupID",{
  GroupID: store.getters.currentUser.GroupID
})
let data = []
menuData.then(value => {
  if (value !== null && value !== '' && value !== undefined && value.StatusCode === 200 && value.Success === 1) {
    handling.recursiveMenuRight(value.Result, '0', data)
  }
})
export default data;
