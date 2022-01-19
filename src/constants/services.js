import axi from 'axios'

export const timer = 500
const url = "http://apismartcitycantho.namlongtekgroup.com"
const api_key = "664106681A98FAA1BA91BC90F44F72F5"
const header = {
  'accept': 'text/plain',
  'Content-Type': 'application/json-patch+json',
  'Cache-Control': 'no-cache',
  'APIKEY': api_key
}
const method = axi.create({
  baseURL: url,
  timeout: 5000,
  headers: header
})
method.interceptors.response.use((response) => {
  return response
}, (error) => {
  if (error.response.status === 401) {
    let user = JSON.parse(localStorage.getItem('user'))
    method.post(url + '/api/authentication/RefreshToken', {
      refreshToken: user.RefreshToken
    }, {
      headers: header
    }).then(response => {
      if (response.data !== null && response.data !== undefined && response.data !== '' && response.data.StatusCode === 200 && response.data.Success === 1) {
        localStorage.setItem('token', response.data.Result.Token)
        let users = {
          CreateDate: user.CreateDate,
          GroupDescription: user.GroupDescription,
          GroupID: user.GroupID,
          GroupName: user.GroupName,
          RefreshToken: response.data.Result.RefreshToken,
          Token: response.data.Result.Token,
          UserAddress: user.UserAddress,
          UserDescription: user.UserDescription,
          UserEmail: user.UserEmail,
          UserFullName: user.UserFullName,
          UserID: user.UserID,
          UserName: user.UserName,
          UserPhone: user.UserPhone
        }
        localStorage.setItem('user', JSON.stringify(users))
        axi.defaults.headers.common['Authorization'] = "Bearer " + response.data.Result.Token
        location.reload();
      } else {
        localStorage.removeItem('user')
        localStorage.removeItem('token');
        delete axi.defaults.headers.common['Authorization']
        location.reload();
      }
    }).catch(error => {
      console.log(error);
    });
  }
  return Promise.reject(error);
})
export const postMethod = (path, body) => {
  return new Promise((resolve, reject) => {
    method.post(url + path, body, {
      headers: header
    }).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error.status)
    });
  });
}
