import axios from "axios";

let http = axios.create({
  baseURL: "http://39.102.32.251:800/",
  withCredentials: false,
  timeout: 10000
});

http.interceptors.request.use(
  config => {
    if (config.method === "POST") {
      config.headers["Content-Type"] = "application/json;charset=utf-8";
    }
    if (localStorage.getItem("token")) {
      config.headers.Authorization = localStorage.getItem("token");
    }
    return config;
  },
  error => {
    alert("错误的传参");
    return Promise.reject(error);
  }
);

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
