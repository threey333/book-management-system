import { createStore } from 'vuex'
import { service } from '@/service'
import { result, getCharacterInfoById } from '@/utils'

export default createStore({
  state: {
    characterInfo: [], // 角色信息
    userInfo: {}, // 用户信息
    bookClassify: [],
    userCharacter: {} // 用户的角色信息
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
    },
    setBookClassify (state, bookClassify) {
      state.bookClassify = bookClassify
    }
  },
  actions: {
    // 获取图书分类
    async getBookClassify (ctx) {
      const res = await service.bookClassify.bookClassifyList()
      result(res)
        .success((msg, { data }) => {
          ctx.commit('setBookClassify', data)
        })
    },

    // 获取角色权限信息
    async getCharacterInfo (ctx) {
      const res = await service.character.getCharacterList()
      result(res)
        .success((msg, { data }) => {
          ctx.commit('setCharacterInfo', data)
        })
    },

    // 获取用户信息
    async getUserInfo (ctx) {
      const res = await service.user.getUserInfo()
      result(res)
        .success((msg, { data }) => {
          console.log(data)
          ctx.commit('setUserInfo', data)
          ctx.commit('setUserCharacter', getCharacterInfoById(data.character))
        })
    }
  },
  modules: {
  }
})
