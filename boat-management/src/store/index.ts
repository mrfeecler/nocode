import { createStore } from "vuex";
import _ from "lodash";
import { checkUser, getInfo } from "@/firebase";
import BusinessModule from "./modules/BusinessModule";
import VuexPersist from "vuex-persist";
import router from "@/router/index";

const vuexLocalStorage = new VuexPersist({
  key: "vuex", // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
});

const store = createStore({
  modules: {
    business: BusinessModule,
  },
  state: {
    user: {
      loggedIn: false,
      data: null,
      justLogOut: null as any,
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
    SET_LOGOUT(state) {
      state.user.justLogOut = true;
    },
    reset(state) {
      state.user = {
        loggedIn: false,
        data: null,
        justLogOut: null,
      };
    },
  },
  actions: {
    async logIn(context, { email, password }) {
      const user: any = await checkUser(email, password);
      if (!_.isEmpty(user)) {
        user.company = "";

        if (user.infos_id) {
          const getCompany = await getInfo(user.infos_id);
          user.company = getCompany.company;
        }

        context.commit("SET_USER", user);
        context.commit("SET_LOGGED_IN", true);
        return true;
      } else {
        router.push("/");
        return false;
      }
    },

    logOut(context) {
      context.commit("SET_USER", null);
      context.commit("SET_LOGOUT");
      router.push("/");
    },
    reset({ commit }) {
      commit("reset");
    },
  },
  plugins: [vuexLocalStorage.plugin],
});

export default store;
