import { createStore } from 'vuex'
import { service } from '@/service'
import { result, getCharacterInfoById } from '@/utils'

export default createStore({
  state: {
    characterInfo: [],
    userInfo: {},
    userCharacter: {}
  },
  mutations: {
    setCharacterInfo (state, characterInfo) {
      state.characterInfo = characterInfo
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    setUserCharacter (state, userCharacter) {
      state.userCharacter = userCharacter
    }
  },
  actions: {
    async getCharacterInfo (ctx) {
      const res = await service.character.getCharacterList()
      result(res)
        .success((msg, { data }) => {
          ctx.commit('setCharacterInfo', data)
        })
    },
    async getUserInfo (ctx) {
      const res = await service.user.getUserInfo()
      result(res)
        .success((msg, { data }) => {
          ctx.commit('setUserInfo', data)
          ctx.commit('setUserCharacter', getCharacterInfoById(data.character))
        })
    }
  },
  modules: {
  }
})
