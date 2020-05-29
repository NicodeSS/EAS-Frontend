import axios from "axios";

let http = axios.create({
  baseURL: "http://www.nicode.top:10080/",
  withCredentials: false,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  },
  transformRequest: [
    function(data) {
      let newData = "";
      for (let i in data) {
        if (data.hasOwnProperty(i) === true) {
          newData +=
            encodeURIComponent(i) + "=" + encodeURIComponent(data[i]) + "&";
        }
      }
      return newData;
    }
  ]
});

export default {
  get: function(url, params) {
    return new Promise((resolve, reject) => {
      http({
        method: "GET",
        url: url,
        params: params
      })
        .then(function(res) {
          !res.data.status ? resolve(res) : reject(res);
        })
        .catch(function(err) {
          reject(err);
        });
    });
  },
  post: function(url, params) {
    return new Promise((resolve, reject) => {
      http({
        method: "POST",
        url: url,
        data: params
      })
        .then(function(res) {
          !res.data.status ? resolve(res) : reject(res);
        })
        .catch(function(err) {
          reject(err);
        });
    });
  },
  put: function(url, params) {
    return new Promise((resolve, reject) => {
      http({
        method: "PUT",
        url: url,
        data: params
      })
        .then(function(res) {
          !res.data.status ? resolve(res) : reject(res);
        })
        .catch(function(err) {
          reject(err);
        });
    });
  },
  delete: function(url, params) {
    return new Promise((resolve, reject) => {
      http({
        method: "DELETE",
        url: url,
        params: params
      })
        .then(function(res) {
          !res.data.status ? resolve(res) : reject(res);
        })
        .catch(function(err) {
          reject(err);
        });
    });
  }
};
