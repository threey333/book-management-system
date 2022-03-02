<template>
  <div>
    <a-card>
      <h2>图书列表</h2>
      <a-divider />
      <spaces-between>
        <a-input-search class="search" placeholder="根据书名搜索" enter-button />
        <a-button>添加一条</a-button>
      </spaces-between>
      <a-divider />

      <!-- 表格 -->
      <a-table :columns="columns" :data-source="dataSource"></a-table>
    </a-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

const columns = [
  {
    title: '名字',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '年龄',
    key: 'age',
    dataIndex: 'age'
  }
]

const data = [
  {
    key: '1',
    name: '小杨',
    age: 18
  },
  {
    key: '2',
    name: '小p',
    age: 20
  }
]

export default defineComponent({
  setup () {
    return {
      columns,
      dataSource: data
    }
  }
})

</script>

<style lang="scss" scoped>
.search {
  width: 200px;
}
</style>
