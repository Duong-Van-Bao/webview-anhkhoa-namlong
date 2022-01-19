import L from "leaflet";

const requestWFS = {
  getDataType(value, layer) {
    let objectData = {
      url: 'http://tomcat.namlongtekgroup.com/geoserver/wfs',
      workspace: 'NLG-CanTho',
      urlWorkspace: 'nam-long-gis-can-tho',
      type: layer,
      data: {},
    }
    let keyID = layer.toLowerCase() + 'id'
    let keyLat = layer.toLowerCase() + 'lat'
    let keyLng = layer.toLowerCase() + 'lng'
    let keyName = layer.toLowerCase() + 'name'
    let keyAddress = layer.toLowerCase() + 'address'
    objectData.data[keyID] = value['StationID']
    objectData.data[keyLat] = value['StationLat']
    objectData.data[keyLng] = value['StationLong']
    objectData.data[keyName] = value['Name']
    objectData.data[keyAddress] = value['Address']
    return objectData
  },
  getDataTypeForm(value, layer) {
    let objectData = {
      url: 'http://tomcat.namlongtekgroup.com/geoserver/wfs',
      workspace: 'NLG-CanTho',
      urlWorkspace: 'nam-long-gis-can-tho',
      type: layer,
      data: {},
    }
    let keyID = layer.toLowerCase() + 'id'
    let keyLat = layer.toLowerCase() + 'lat'
    let keyLng = layer.toLowerCase() + 'lng'
    let keyName = layer.toLowerCase() + 'name'
    let keyAddress = layer.toLowerCase() + 'address'
    objectData.data[keyID] = value['StationID'][1]
    objectData.data[keyLat] = value['StationLat'][1]
    objectData.data[keyLng] = value['StationLong'][1]
    objectData.data[keyName] = value['Name'][1]
    objectData.data[keyAddress] = value['Address'][1]
    return objectData
  },
  getPoint(BBOX, type) {
    let rootUrl, defaultParameters, parameters
    if (BBOX === null) {
      rootUrl = 'http://tomcat.namlongtekgroup.com/geoserver/NLG-CanTho/ows';
      defaultParameters = {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'NLG-CanTho:' + type,
        outputFormat: 'application/json',
        SrsName: 'EPSG:4326',
      }
      parameters = L.Util.extend(defaultParameters)
    } else {
      rootUrl = 'http://tomcat.namlongtekgroup.com/geoserver/NLG-CanTho/ows';
      defaultParameters = {
        service: 'WFS',
        version: '1.0.0',
        request: 'GetFeature',
        typeName: 'NLG-CanTho:' + type,
        outputFormat: 'application/json',
        SrsName: 'EPSG:4326',
        bbox: BBOX
      }
      parameters = L.Util.extend(defaultParameters)
    }
    return rootUrl + L.Util.getParamString(parameters)
  },
  async insertPoint(url, workspace, urlWorkspace, data, layer) {
    let success = false
    let keyID = layer.toLowerCase() + 'id'
    let keyLat = layer.toLowerCase() + 'lat'
    let keyLng = layer.toLowerCase() + 'lng'
    let keyName = layer.toLowerCase() + 'name'
    let keyAddress = layer.toLowerCase() + 'address'
    let body =
      '<Transaction xmlns="http://www.opengis.net/wfs" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:' + workspace + '="' + urlWorkspace + '" xmlns:gml="http://www.opengis.net/gml" version="1.0.0" service="WFS" xsi:schemaLocation="http://www.opengis.net/wfs http://tomcat.namlongtekgroup.com/geoserver/schemas/wfs/1.0.0/WFS-transaction.xsd">\
        <Insert>\
          <' + workspace + ':' + layer + '>\
            <' + workspace + ':geom>\
              <gml:Point srsName="EPSG:4326">\
                <gml:coordinates decimal="." cs="," ts=" ">' + parseFloat(data[keyLng]) + ',' + parseFloat(data[keyLat]) + '</gml:coordinates>\
              </gml:Point>\
            </' + workspace + ':geom>\
            <' + workspace + ':' + keyID + '>' + data[keyID] + '</' + workspace + ':' + keyID + '>\
            <' + workspace + ':' + keyLat + '>' + parseFloat(data[keyLat]) + '</' + workspace + ':' + keyLat + '>\
            <' + workspace + ':' + keyLng + '>' + parseFloat(data[keyLng]) + '</' + workspace + ':' + keyLng + '>\
            <' + workspace + ':' + keyName + '>' + data[keyName] + '</' + workspace + ':' + keyName + '>\
            <' + workspace + ':' + keyAddress + '>' + data[keyAddress] + '</' + workspace + ':' + keyAddress + '>\
          </' + workspace + ':' + layer + '>\
        </Insert>\
       </Transaction>'
    await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      dataType: "xml",
      headers: {
        'Content-Type': 'text/xml'
      },
      body: body
    }).then(result => {
      if (result.status === 200) {
        success = true
      }
    })
      .catch(err => {
        console.log('ErrorInsertPoint', err)
      })
    return success
  },
  async updatePoint(url, workspace, urlWorkspace, data, layer, idLayer) {
    let success = false
    let deleteSuccess = await this.deletePoint(url, workspace, layer, idLayer)
    if (deleteSuccess === true) {
      let insertSuccess = await this.insertPoint(url, workspace, urlWorkspace, data, layer)
      if (insertSuccess === true) {
        success = true
      }
    }
    return success
  },
  async deletePoint(url, workspace, layer, idLayer) {
    let success = false
    let body =
      '<Transaction version="2.0.0" service="WFS" xmlns:fes="http://www.opengis.net/fes/2.0" xmlns:wfs="http://www.opengis.net/wfs/2.0"\
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs/2.0 http://schemas.opengis.net/wfs/2.0/wfs.xsd">\
        <Delete typeName="' + workspace + ':' + layer + '">\
          <fes:Filter>\
            <fes:ResourceId rid="' + idLayer + '"/>\
          </fes:Filter>\
        </Delete>\
      </Transaction>'
    await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      dataType: "xml",
      headers: {
        'Content-Type': 'text/xml'
      },
      body: body
    }).then(result => {
      if (result.status === 200) {
        success = true
      }
    })
      .catch(err => {
        console.log('ErrorDeletePoint', err)
      })
    return success
  }
}

export default requestWFS
