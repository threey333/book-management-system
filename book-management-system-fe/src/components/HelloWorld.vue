<template>
  <div class="hello">
    <h1>wadsdklasjldjasljdlsja</h1>
    <button @click="show">点击</button>
  </div>
</template>

<script>
// import { getCurrentInstance } from 'vue'
export default {
  // setup (props, cxt) {
  //   const currentInstance = getCurrentInstance()
  //   const { $service } = currentInstance.appContext.config.globalProperties

  //   async function show () {
  //     console.log($service.auth.songURL)
  //     console.log($service.songURL)
  //     // const res = await $service.getSongURL({ songID: 405998841 })
  //     // console.log(res)
  //   }
  //   return {
  //     show
  //   }
  // }
  // // 方法一 end

  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    async show () {
      const id = 405998841
      const res = await this.$service.auth.getSongURL({ songID: id })
      console.log(res)
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
