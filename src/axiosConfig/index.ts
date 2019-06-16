import Vue from 'vue';
import axios from 'axios';
import qs from 'qs';
import store from '@/store';
import { message } from 'ant-design-vue'

// 响应时间
axios.defaults.timeout = 30 * 1000;
// 配置cookie
// axios.defaults.withCredentials = true
// 配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// axios.defaults.headers.common['Authorization'] = '1';
if (window.localStorage.getItem('token')) {
  axios.defaults.headers.common['version'] = '1.0';
  axios.defaults.headers.common['device'] = 'web';
  axios.defaults.headers.common['appname'] = 'postman';
}

// 静态资源
Vue.prototype.$static = '';

// 配置接口地址
axios.defaults.baseURL = '';

// var loadingInstance;
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use(
  config => {
    // loadingInstance = Loading.service({
    //   lock: true,
    //   text: '数据加载中，请稍后...',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // });
    store.commit('setLoading', true);

    if (window.localStorage.getItem('token')) {
      config.headers.common['Authorization'] = window.localStorage.getItem('token');
    }
    if (config.method === 'post') {
      if (window.sessionStorage.getItem('qs')) {
        config.data = qs.stringify(config.data);
        window.sessionStorage.removeItem('qs');
      }
    };
    return config;
  },
  err => {
    // loadingInstance.close();
    // Message.error('请求错误');
    message.error('请求错误');
    return Promise.reject(err);
  },
);
// 返回状态判断(添加响应拦截器) 12 权限过期
axios.interceptors.response.use(
  (res: any) => {
    if (res.data.result == 1 || res.data.access_token || res.data.Result == 1) {
      store.commit('setLoading', false);
      // loadingInstance.close();
      return res;
    } 
    else if(res.data.result == 12 || res.data.Result == 12){
      store.commit('setLoading', false);
      window.localStorage["logintoken"] = "";
      window.localStorage.removeItem('token');
      location.reload();
    }
     else {
      store.commit('setLoading', false);
      // loadingInstance.close();
      // Message.error(res.data.msg);
      message.error(res.data.msg || res.data.message || res.data.ErrorMsg);
    };
  },
  err => {
    store.commit('setLoading', false);
    // loadingInstance.close()
    // Message.error('请求失败，请稍后再试')
    if(err.response.status == '401'){
      store.commit('setLoading', false);
      window.localStorage["logintoken"] = "";
      window.localStorage.removeItem('token');
      location.reload();
    }
    message.error('请求失败，请稍后再试');
    return Promise.reject(err)
  },
);
// 发送请求
export function post(url: any, params: any) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(
        res => {
          resolve(res.data)
        },
        err => {
          reject(err.data)
        }
      )
      .catch(err => {
        reject(err.data)
      });
  });
};
export function get(url: any, params: any) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      });
  });
};
export function del(url: any, params: any) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      });
  });
};
export function patch(url: any, params: any) {
  return new Promise((resolve, reject) => {
    axios
      .patch(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      });
  });
};
export function delData(url: any, params: any) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        data: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      });
  });
};