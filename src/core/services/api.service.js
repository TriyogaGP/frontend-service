import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { API_URL } from "@/core/config/app";

/**
 * Service to call HTTP request via Axios
 */

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = API_URL;

    // SET DEFAULT HEADER
    // this.setHeader();
    // INTERCEPTOR RESPONSE
    Vue.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async function (error) {
        if (typeof error.response == "undefined") {
          // network error
          let errorStatus = {
            status: "failed",
            statusText: "Network Error",
          };
          return Promise.reject(errorStatus);
        } else if (error.response.status === 401) {
          localStorage.clear();
          return Promise.reject(error);
        } else if (error.response.status === 404) {
          return Promise.reject(error);
        } else if (error.response.status === 405) {
          let errorStatus = {
            status: "bad request",
            statusText: "Method Not Allowed!",
          };
          return Promise.reject(errorStatus);
        } else if (
          error.response.status === 502 ||
          error.response.status === 503 ||
          error.response.status === 504 ||
          error.response.status === 501
        ) {
          let errorStatus = {
            status: "failed",
            statusText: "There's Something Wrong With Server",
          };
          return Promise.reject(errorStatus);
        }

        // return Error object with Promise
        return Promise.reject(error);
      }
    );
  },

  /**
   * Set the default HTTP request headers
   */
  setHeader: async() => {
    try {
      // Vue.axios.defaults.headers.common[
      //   "user_key"
      // ] = await userKey;
      Vue.axios.defaults.headers.common = {
        'Authorization': `Bearer ${await localStorage.getItem('user_token')}`
      }
      // const response = await Vue.axios.defaults.headers.common[
      //   "user_key"
      // ]
    } catch (error) {
      console.log(error);
    }
  },
  
  query(resource, token, body) {
    return Vue.axios.get(resource, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, body).catch((error) => {
      throw new Error(`[KT] ApiService ${error}`);
    });
  },

  /**
   * Send the GET HTTP request for Blob type
   * @param resource
   * @param slug
   * @returns {*}
   */
  blob(resource) {
    let headers = { method: "GET", url: resource };
    headers["responseType"] = "blob";
    return Vue.axios(headers);
  },

  /**
   * Send the GET HTTP request
   * @param resource
   * @param slug
   * @returns {*}
   */
  get(resource, token) {
    return Vue.axios.get(`${resource}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .catch((error) => {
      // throw new Error(`[KT] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param body
   * @returns {*}
   */
  post(resource, token, body) {
    return Vue.axios.post(`${resource}`, body, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .catch((error) => {
      // throw new Error(`[KT] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param body
   * @returns {*}
   */
  postLogin(resource, body) {
    return Vue.axios.post(`${resource}`, body)
    .catch((error) => {
      // throw new Error(`[KT] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Set the POST HTTP request
   * @param resource
   * @param body
   * @returns {*}
   */
  postFile(resource, body) {
    return Vue.axios.post(`${resource}`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
    .catch((error) => {
      // throw new Error(`[KT] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Send the UPDATE HTTP request
   * @param resource
   * @param body
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  update(resource, token, body) {
    return Vue.axios.put(`${resource}`, body, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .catch((error) => {
      // throw new Error(`[KT] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Send the PUT HTTP request
   * @param resource
   * @param body
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, token, body) {
    return Vue.axios.put(`${resource}`, body, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .catch((error) => {
      // throw new Error(`[KT] ApiService ${error}`);
      throw error;
    });
  },

  /**
   * Send the DELETE HTTP request
   * @param resource
   * @returns {*}
   */
  delete(resource, token) {
    return Vue.axios.delete(resource, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).catch((error) => {
      // throw new Error(`[RWV] ApiService ${error}`);
      throw error;
    });
  },
};

export default ApiService;
