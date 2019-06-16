import postUrlEnd from './interface';
import {
  get,
  post,
} from '../axiosConfig';
export default {
  login(params: any) {
    return post(postUrlEnd.login, params);
  },
  getCode(params: any) {
    return post(postUrlEnd.getCode, params);
  }
};