<template>
  <el-col :span="4">
    <el-input v-model="memberId" />
  </el-col>
  <el-col :span="15">
    <span v-if="memberId" class="truncate">昵称：{{ nickname }}，用户名: {{ username }}</span>
  </el-col>
  <el-col :span="5">
    <el-button @click="show">{{ $t('选择') }}</el-button>
    <el-button @click="dele">{{ $t('删除') }}</el-button>
  </el-col>
  <el-dialog v-model="dialog" :title="$t('选择会员')" center align-center append-to-body>
    <el-row>
      <el-col :span="12" :offset="4">
        <el-input v-model="keyword" clearable />
      </el-col>
      <el-col :span="8">
        <el-button type="primary" @click="list">{{ $t('查询') }}</el-button>
        <el-button @click="reset">{{ $t('重置') }}</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="data" :height="height" show-overflow-tooltip>
      <el-table-column label="选择" min-width="80">
        <template #default="scope">
          <el-radio v-model="selected.member_id" :value="scope.row.member_id" @click="select(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column prop="member_id" label="ID" min-width="80" />
      <el-table-column prop="avatar_id" :label="$t('头像')" min-width="68">
        <template #default="scope">
          <FileImage :file-url="scope.row.avatar_url" avatar lazy />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" :label="$t('昵称')" min-width="180" />
      <el-table-column prop="username" :label="$t('用户名')" min-width="150" />
    </el-table>
    <Pagination v-model:total="count" v-model:page="page" v-model:limit="limit" class="mt-4" @pagination="list" />
    <template #footer>
      <el-button @click="cancel">{{ $t('取消') }}</el-button>
      <el-button type="primary" @click="confirm">{{ $t('确定') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { screenHeight, getPageLimit } from '@/utils/index'
import { listApi } from '@/api/member/member'

defineOptions({
  name: 'MemberSelector'
})

const memberId = defineModel('memberId', { type: [Number, String] })
const nickname = defineModel('nickname', { type: [Number, String] })
const username = defineModel('username', { type: [Number, String] })

const height = screenHeight(450)
const dialog = ref(false)
const loading = ref(false)
const keyword = ref('')
const data = ref([])
const count = ref(0)
const page = ref(1)
const limit = ref(getPageLimit())
const selected = reactive({ member_id: '', nickname: '', username: '' })

const emit = defineEmits(['update:memberId', 'update:nickanme', 'update:username'])

function show() {
  dialog.value = true
  selected.member_id = memberId.value
  list()
}

function dele() {
  emit('update:memberId', '')
  emit('update:nickname', '')
  emit('update:username', '')
}

function list() {
  loading.value = true
  let params = { page: page.value, limit: limit.value, basedata: 0 }
  if (keyword.value) {
    params.search_mode = 'or'
    params.search = [
      {
        field: 'member_id',
        exp: '=',
        value: keyword.value
      },
      {
        field: 'nickname',
        exp: 'like',
        value: keyword.value
      },
      {
        field: 'username',
        exp: 'like',
        value: keyword.value
      }
    ]
  }
  listApi(params)
    .then((res) => {
      data.value = res.data.list
      count.value = res.data.count
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

function reset() {
  page.value = 1
  keyword.value = ''
  list()
}

function select(row) {
  selected.member_id = row.member_id
  selected.nickname = row.nickname
  selected.username = row.username
}

function cancel() {
  dialog.value = false
}

function confirm() {
  emit('update:memberId', selected.member_id)
  emit('update:nickname', selected.nickname)
  emit('update:username', selected.username)
  dialog.value = false
}
</script>
