<template>
  <el-dropdown ref="dropdown" trigger="click" @visible-change="change">
    <div>
      <el-badge :value="badge" :hidden="count === 0" type="danger">
        <Icons icon="Bell" :size="20" />
      </el-badge>
    </div>
    <template #dropdown>
      <el-card style="width: 66vh" shadow="never">
        <template #header>
          <el-text size="default">{{ title }}</el-text>
        </template>
        <el-row v-for="item in data" :key="item[idkey]" class="cursor-pointer" @click="info(item)">
          <el-col :span="17">
            <el-text size="default" truncated>
              <el-link underline="never" :type="item.is_read ? 'info' : 'default'">{{ item.message_title }}</el-link>
            </el-text>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-text size="default" truncated>
              <el-link underline="never" :type="item.is_read ? 'info' : 'default'">{{ item.create_time }}</el-link>
            </el-text>
          </el-col>
        </el-row>
        <template #footer>
          <el-text size="default" class="cursor-pointer" @click="more">{{ t('查看更多') }}</el-text>
        </template>
      </el-card>
    </template>
  </el-dropdown>
  <el-dialog
    v-model="dialog"
    :title="title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancel"
    draggable
    center
    align-center
    append-to-body
  >
    <el-scrollbar :height="height - 50">
      <el-form ref="ref" label-width="120px">
        <el-form-item :label="$t('标题')" prop="message_title">
          <span>{{ model.message_title }}</span>
        </el-form-item>
        <el-form-item :label="$t('时间')" prop="create_time">
          <span>{{ model.create_time }}</span>
        </el-form-item>
        <el-form-item :label="$t('内容')" prop="message_content">
          <div v-html="model.message_content"></div>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('关闭') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { messageListApi as listApi, messageInfoApi as infoApi } from '@/api/system/user-center'
import { screenHeight } from '@/utils/index'

const { t } = useI18n()
const router = useRouter()
const dropdown = ref(null)
const loading = ref(false)
const count = ref(0)
const data = ref([])
const idkey = 'user_message_id'
const badge = computed(() => (count.value > 0 ? count.value : ''))
const title = t('我的消息')
const dialog = ref(false)
const height = screenHeight()
const model = ref({})
let pollTimer = null
const POLL_INTERVAL = 60000

function change(visible) {
  if (visible) {
    stopPolling()
    list()
  } else {
    startPolling()
  }
}

function list() {
  loading.value = true
  listApi()
    .then((res) => {
      data.value = res?.data?.list || []
      count.value = res?.data?.unread_count || 0
    })
    .finally(() => {
      loading.value = false
    })
}

function info(item) {
  dropdown.value.handleClose()
  infoApi({ [idkey]: item[idkey] }).then((res) => {
    dialog.value = true
    model.value = res?.data || {}
  })
}

function cancel() {
  dialog.value = false
  list()
}

function submit() {
  dialog.value = false
  list()
}

function more() {
  dropdown.value.handleClose()
  router.push('/user-message')
}

onMounted(() => {
  list()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

function startPolling() {
  if (pollTimer) return
  pollTimer = setInterval(() => {
    list()
  }, POLL_INTERVAL)
}

function stopPolling() {
  if (!pollTimer) return
  clearInterval(pollTimer)
  pollTimer = null
}
</script>
