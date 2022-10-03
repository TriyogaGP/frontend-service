import Vue from 'vue';
import Vuex from 'vuex';

import api from './api.module';
import auth from './auth.module';
import authUser from './authUser.module';
import upload from './upload.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    api,
    auth,
    authUser,
    upload,
  },
});
