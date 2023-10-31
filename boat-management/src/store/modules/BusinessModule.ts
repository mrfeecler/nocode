
function initialState() {
  return {
    convertedData:{}
  }
}

export default {
  namespaced: true,
  state: initialState(),
  mutations: {
    setFinalData(state, payload) {
      state.convertedData = payload
    },
    reset (state) {
      const s = initialState()
      Object.keys(s).forEach(key => {
        state[key] = s[key]
      })
    }
  },
  actions: {
    updateFormData({ commit }, newData) {
      commit('setFinalData', newData);
    },

    resetCardData({ commit }) {
      commit('reset');
    }
  }
}