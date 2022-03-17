<template>
  <div class="users-wrapper">
    <a-card>
      <h2>用户管理</h2>
      <a-divider />
      <space-between class="users-wrapper-actions">
        <div class="users-wrapper-actions-search">
          <a-input-search
            placeholder="根据账户搜索"
            v-model:value="keyword"
            enter-button
            @search="onSearch"
          />
          <a v-if="isBack" href="javascript:;" @click="backAll">返回</a>
        </div>
        <div class="users-wrapper-actions-btn">
          <a-button type="primary" @click="showAddDialog = true">添加用户</a-button>&nbsp;
          <a-upload
            @change="onUploadChange"
            action="http://localhost:9090/upload/file"
            :headers="headers"
          >
            <a-button type="primary" ghost>
              <UploadOutlined />上次 Excel 添加
            </a-button>
          </a-upload>
        </div>
      </space-between>
      <a-divider />

      <!-- 表格 -->
      <div class="users-wrapper-table">
        <a-table bordered :pagination="false" :columns="columns" :data-source="list">
          <template #createdAt="{ record }">{{ formatTimestamp(record.meta.createdAt) }}</template>

          <template #character="{ record }">
            <a href="javascript:;" @click="onEdit(record)" style="display:inline-block">
              <EditOutlined />
            </a>
            {{ getCharacterInfoById(record.character).title }}
          </template>

          <template #actions="{ record }">
            <a href="javascript:;" @click="reset(record)">重置密码</a>
            &nbsp;
            <a href="javascript:;" @click="remove(record)">删除</a>
          </template>
        </a-table>
      </div>

      <!-- 分页 -->
      <flex-end style="margin-top: 24px;" v-if="!isBack">
        <a-pagination
          v-model:current="curPage"
          :page-size="size"
          :total="userTotal"
          @change="setPage"
        ></a-pagination>
      </flex-end>
    </a-card>
    <AddOne v-model:show="showAddDialog" @getList="getUser" />

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :isCenter="false"
      :show="showEditCharacterDialog"
      @confirm-submission="submitUpdateCharacter"
      @close-dialog="closeEditCharacter"
    >
      <a-select v-model:value="editForm.character" style="width:160px">
        <a-select-option
          v-for="item in characterInfo"
          :key="item._id"
          :value="item._id"
        >{{ item.title }}</a-select-option>
      </a-select>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, reactive } from 'vue'
import { vueProperties, result, formatTimestamp, getCharacterInfoById } from '@/utils'
import { UploadOutlined, EditOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import AddOne from './components/add-one.vue'
import { getHeaders } from '@/utils/request.js'

import store from '@/store'

const columns = [
  {
    title: '账户',
    key: 'account',
    dataIndex: 'account'
  },
  {
    title: '创建日期',
    key: 'createdAt',
    dataIndex: 'createdAt',
    slots: {
      customRender: 'createdAt'
    }
  },
  {
    title: '角色',
    key: 'character',
    dataIndex: 'character',
    slots: {
      customRender: 'character'
    }
  },
  {
    title: '操作',
    key: 'actions',
    dataIndex: 'actions',
    slots: {
      customRender: 'actions'
    }
  }
]

export default defineComponent({
  name: 'Users',
  components: {
    AddOne,
    EditOutlined,
    UploadOutlined
  },
  setup () {
    const { $service } = vueProperties()
    const list = ref([]) // 用户列表
    const curPage = ref(1) // 分页默认是第一页
    const size = ref(4) // 每页默认显示大小为10条
    const userTotal = ref(0)
    const showAddDialog = ref(false)
    const keyword = ref('') // 账户关键字
    const isBack = ref(false) // 搜索过后是否进行返回
    const showEditCharacterDialog = ref(false)
    const editForm = reactive({
      character: '',
      current: {}
    })

    // 获取用户
    const getUser = async () => {
      const res = await $service.user.getUserList({
        page: curPage.value,
        size: size.value,
        keyword: keyword.value
      })
      result(res)
        .success((msg, { data: { list: resList, total: resTotal } }) => {
          list.value = resList.map((item) => {
            const key = item._id
            return { ...item, key }
          })
          userTotal.value = resTotal
          message.success(msg)
        })
    }
    onMounted(() => {
      getUser()
    })

    // 删除用户
    const remove = async ({ _id }) => {
      const res = await $service.user.removeUser({ id: _id })
      result(res)
        .success((msg) => {
          getUser()
          message.success(msg)
        })
    }

    // 翻页
    const setPage = (page) => {
      curPage.value = page
      getUser()
    }

    // 重置密码
    const reset = async ({ _id }) => {
      const res = await $service.user.resetPassword({ id: _id })
      result(res)
        .success((msg) => {
          message.success(msg)
        })
    }

    // 搜索
    const onSearch = () => {
      getUser()
      isBack.value = !!keyword.value
    }

    // 返回
    const backAll = () => {
      isBack.value = false
      keyword.value = ''
      getUser()
    }

    // 编辑角色
    const onEdit = (record) => {
      editForm.current = record
      editForm.character = record.character

      showEditCharacterDialog.value = true
    }

    // 提交修改角色
    const submitUpdateCharacter = async () => {
      const res = await $service.user.editCharacter({
        character: editForm.character,
        userId: editForm.current._id
      })
      result(res)
        .success((msg) => {
          message.success(msg)

          // 根据对象的引用特性，修改一处，另一处也会跟着改变
          editForm.current.character = editForm.character
          showEditCharacterDialog.value = false
        })
    }

    // 关闭编辑角色对话框
    const closeEditCharacter = () => {
      showEditCharacterDialog.value = false
    }

    // 上传文件
    const onUploadChange = ({ file }) => {
      if (file.response) {
        result(file.response)
          .success(async (msg, { data: key }) => {
            const res = await $service.user.addManyUser(key)

            result(res)
              .success((msg, { data: { addCount } }) => {
                message.success(`成功添加 ${addCount} 位用户`)

                getUser()
              })
          })
      }
    }

    return {
      list,
      curPage,
      size,
      userTotal,
      columns,
      showAddDialog,
      keyword,
      isBack,
      showEditCharacterDialog,
      editForm,
      characterInfo: store.state.characterInfo,
      headers: getHeaders(),

      formatTimestamp,
      remove,
      getUser,
      setPage,
      reset,
      onSearch,
      backAll,
      getCharacterInfoById,
      onEdit,
      submitUpdateCharacter,
      closeEditCharacter,
      onUploadChange
    }
  }
})

</script>

<style lang="scss" scoped>
.users-wrapper {
  &-actions-search {
    display: inline-flex;
    a {
      display: block;
      margin-left: 16px;
      min-width: 40px;
    }
  }
}
</style>
