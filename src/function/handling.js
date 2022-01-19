import moment from 'moment'

const convert_data = {
  recursiveMenuRight(a, i, r) {
    a.forEach(element => {
      if (element['ParentID'] !== i) {
        return;
      }
      let n = [];
      convert_data.recursiveMenuRight(a, element['MenuID'], n);
      if (n.length > 0) {
        r.push({
          id: element['MenuID'],
          icon: element['MenuIcon'],
          label: element['MenuName'],
          to: element['Link'],
          action: element['MenuAction'],
          controller: element['MenuController'],
          access: element['AccessWrite'],
          subs: n
        });
      } else {
        r.push({
          id: element['MenuID'],
          icon: element['MenuIcon'],
          label: element['MenuName'],
          to: element['Link'],
          action: element['MenuAction'],
          controller: element['MenuController'],
          access: element['AccessWrite'],
          subs: []
        });
      }
    });
  },
  recursiveMenuRightEdit(a, i, r) {
    a.forEach(element => {
      if (element['ParentID'] !== i) {
        return;
      }
      let n = [];
      convert_data.recursiveMenuRightEdit(a, element['MenuID'], n);
      let access_boolean = false;
      if (element['AccessWrite'] === 1) {
        access_boolean = true
      }
      if (n.length > 0) {
        r.push({
          id: element['MenuID'],
          label: element['MenuName'],
          menuSelected: element['IsSelected'],
          menuAccess: access_boolean,
          subs: n
        });
      } else {
        r.push({
          id: element['MenuID'],
          label: element['MenuName'],
          menuSelected: element['IsSelected'],
          menuAccess: access_boolean,
          subs: []
        });
      }
    });
  },
  recursiveMenu(a, i, r) {
    a.forEach(element => {
      if (element['ParentID'] !== i) {
        return;
      }
      let n = [];
      convert_data.recursiveMenu(a, element['MenuID'], n);
      let active_boolean = false;
      if (element['IsActive'] === 1) {
        active_boolean = true
      }
      if (n.length > 0) {
        r.push({
          id: element['MenuID'],
          label: element['Name'],
          active: active_boolean,
          subs: n
        });
      } else {
        r.push({
          id: element['MenuID'],
          label: element['Name'],
          active: active_boolean,
          subs: []
        });
      }
    });
  },
  recursiveTreeSelect(a, i, r) {
    a.forEach(element => {
      if (element['ParentID'] !== i) {
        return;
      }
      let n = []
      convert_data.recursiveTreeSelect(a, element['TreeRouteID'], n);
      if (n.length > 0) {
        r.push({
          id: element['TreeRouteID'],
          label: element['TreeRouteName'],
          children: n
        })
      } else {
        r.push({
          id: element['TreeRouteID'],
          label: element['TreeRouteName'],
        })
      }
    })
  },
  mergeTableAndData(fArray, sArray) {
    if (fArray === null || fArray === undefined || sArray === null || sArray === undefined) {
      return
    }
    if (fArray.length > 0 && sArray.length > 0) {
      let nArray = []
      for (let i = 0; i < fArray.length; i++) {
        let object = {
          key: fArray[i],
          sortable: true,
          tdClass: 'text-right pt-3',
        }
        let active = false;
        for (let j = 0; j < sArray.length; j++) {
          if (sArray[j]['ClName'].toUpperCase() === fArray[i].toUpperCase()){
            const row = {
              label: sArray[j]['ShwName'],
            };
            if (sArray[j]['TypeCol'] === 'Number') {
              object.tdClass = 'text-right pt-3'
            } else if (sArray[j]['TypeCol'] === 'MutedNumber') {
              object.tdClass = 'text-right text-muted pt-3'
            } else if (sArray[j]['TypeCol'] === 'MutedNumberCenter') {
              object.tdClass = 'text-center text-muted pt-3'
            } else if (sArray[j]['TypeCol'] === 'String') {
              object.tdClass = 'text-left pt-3'
            } else if (sArray[j]['TypeCol'] === 'MutedString') {
              object.tdClass = 'text-left text-muted pt-3'
            } else if (sArray[j]['TypeCol'] === 'MutedStringCenter') {
              object.tdClass = 'text-center text-muted pt-3'
            } else if (sArray[j]['TypeCol'] === 'Phone') {
              object.tdClass = 'text-center text-muted pt-3'
            } else if (sArray[j]['TypeCol'] === 'Email') {
              object.tdClass = 'text-center text-muted pt-3'
            } else {
              object.tdClass = 'text-center'
              object.sortable = false
            }
            Object.assign(object, row);
            active = true;
            break
          }
        }
        if (active === true) {
          nArray.push(object);
        }
      }
      return nArray
    }
  },
  convertDataBitToBoolean(data){
    let array = []
    data.forEach(element => {
      switch (element['IsActive']) {
        case 1:
          element['IsActive'] = true
          break
        case 0:
          element['IsActive'] = false
          break
        default:
          break
      }
      switch (element['IsClose']) {
        case 1:
          element['IsClose'] = true
          break
        case 0:
          element['IsClose'] = false
          break
        default:
          break
      }
      array.push(element)
    })
    return array
  },
  convertBooleanToBit(value) {
    return value ? 1 : 0
  },
  convertBitToBoolean(value) {
    return !!value
  },
  convertDate(string){
    let date = moment(string, "YYYY-MM-DD'T'HH:mm:ss")
    return date.format('DD/MM/YYYY')
  },
  convertDateForm(string){
    let date = moment(string, "YYYY-MM-DD'T'HH:mm:ss")
    return date.format('YYYY-MM-DD')
  },
  showExtensionFormInfoCategory(items, sArray){
    if (items === null || items === undefined || sArray === null || sArray === undefined) {
      return
    }
    if (items.length > 0 && sArray.length > 0) {
      let nObject = {}
      for (let i = 0; i < Object.keys(items[0]).length; i++){
        let key
        let obj = {}
        let active = false
        for (let j = 0; j < sArray.length; j++) {
          if (sArray[j]['ClName'].toUpperCase() === Object.keys(items[0])[i].toUpperCase()){
            key = Object.keys(items[0])[i]
            obj[key] = [sArray[j]['ShwName'], items[0][key], sArray[j]['TypeCol']]
            active = true
            break
          }
        }
        if (active === true) {
          Object.assign(nObject, obj);
        }
      }
      return nObject
    }
  },
  showExtensionFormAddCategory(fArray) {
    if (fArray === null || fArray === undefined ) {
      return
    }
    if (fArray.length > 0) {
      let nObject = {}
      let key
      for (let i = 0; i < fArray.length; i++) {
        if (fArray[i]['IsHide'] === 0) {
          key = fArray[i]['ClName']
          if (fArray[i]['TypeCol'].toUpperCase() === 'DATE') {
            nObject[key] = [fArray[i]['ShwName'], moment(new Date()).format("YYYY-MM-DD"), fArray[i]['TypeCol']]
          } else if (fArray[i]['TypeCol'].toUpperCase().search('NUMBER') > -1) {
            nObject[key] = [fArray[i]['ShwName'], 0, fArray[i]['TypeCol']]
          } else if (fArray[i]['TypeCol'].toUpperCase() === 'KEY') {
            nObject[key] = [fArray[i]['ShwName'], 'AUTO' , fArray[i]['TypeCol']]
          }  else {
            nObject[key] = [fArray[i]['ShwName'], null, fArray[i]['TypeCol']]
          }
        }
      }
      return nObject
    }
  },
  showExtensionFormEditCategory(data){
    if (data === null || data === undefined) {
      return
    }
    let nObject = {}
    for (let i = 0; i < data['Properties'].length; i++){
      if (data['Properties'][i]['IsHide'] === 0) {
        let key = data['Properties'][i]['ClName']
        if (data['Properties'][i]['TypeCol'].toUpperCase() === 'DATE') {
          nObject[key] = [data['Properties'][i]['ShwName'], this.convertDateForm(data[key]), data['Properties'][i]['TypeCol']]
        } else if (data['Properties'][i]['TypeCol'].toUpperCase().search('NUMBER') > -1){
          nObject[key] = [data['Properties'][i]['ShwName'], parseInt(data[key]), data['Properties'][i]['TypeCol']]
        } else {
          nObject[key] = [data['Properties'][i]['ShwName'], data[key], data['Properties'][i]['TypeCol']]
        }
      }
    }
    return nObject
  },
  showExtensionFormAddFunction(fArray, sObject) {
    if (fArray === null || fArray === undefined) {
      return
    }
    if (fArray.length > 0) {
      let Objects = {}
      let key
      for (let i = 0; i < fArray.length; i++) {
        if (fArray[i]['IsHide'] === 0) {
          key = fArray[i]['ClName']
          if (sObject[key]) {
            if (fArray[i]['TypeCol'].toUpperCase() === 'SELECT-TREE') {
              Objects[key] = [fArray[i]['ShwName'], sObject[key][0]['id'] , fArray[i]['TypeCol']]
            } else {
              Objects[key] = [fArray[i]['ShwName'], sObject[key][0]['value'] , fArray[i]['TypeCol']]
            }
          } else {
            if (fArray[i]['TypeCol'].toUpperCase() === 'DATE') {
              Objects[key] = [fArray[i]['ShwName'], moment(new Date()).format("YYYY-MM-DD") , fArray[i]['TypeCol']]
            } else if (fArray[i]['TypeCol'].toUpperCase().search('NUMBER') > -1) {
              Objects[key] = [fArray[i]['ShwName'], 0 , fArray[i]['TypeCol']]
            } else if (fArray[i]['TypeCol'].toUpperCase() === 'KEY') {
              Objects[key] = [fArray[i]['ShwName'], 'AUTO' , fArray[i]['TypeCol']]
            } else {
              Objects[key] = [fArray[i]['ShwName'], null , fArray[i]['TypeCol']]
            }
          }
        }
      }
      return Objects
    }
  },
  showExtensionFormEditFunction(sObject){
    if (sObject === null || sObject === undefined) {
      return
    }
    let Objects = {}
    for (let i = 0; i < sObject['Properties'].length; i++){
      if (sObject['Properties'][i]['IsHide'] === 0) {
        let key = sObject['Properties'][i]['ClName']
        if (sObject['Properties'][i]['TypeCol'].toUpperCase() === 'DATE') {
          Objects[key] = [sObject['Properties'][i]['ShwName'], this.convertDateForm(sObject[key]), sObject['Properties'][i]['TypeCol']]
        } else if (sObject['Properties'][i]['TypeCol'].toUpperCase().search('NUMBER') > -1) {
          Objects[key] = [sObject['Properties'][i]['ShwName'], parseInt(sObject[key]), sObject['Properties'][i]['TypeCol']]
        } else {
          Objects[key] = [sObject['Properties'][i]['ShwName'], sObject[key], sObject['Properties'][i]['TypeCol']]
        }
      }
    }
    return Objects
  },
}

export default convert_data
