import axios from 'axios';
export default class BaseService {
  static getAxiosClient() {
    const axiosClient = axios.create({
      baseURL: process.env.VUE_APP_ROOT_API,
    });

    // can auth header check but as we are not using it so ignoring.
    axiosClient.defaults.headers.common = {
      Accept: 'application/json',
    };
    axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          return Promise.reject('Please check your internet');
        }

        // handle different status code errors.
        return Promise.reject(error);
      }
    );
    return axiosClient;
  }
}
