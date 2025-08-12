<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('用户')" prop="user_id">
                <el-select-v2
                  v-model="model.user_id"
                  :options="basedata.users"
                  :props="{ value: 'user_id', label: 'nickname' }"
                  clearable
                  filterable
                >
                  <template #default="{ item }">
                    <span>[{{ item.user_id }}] {{ item.nickname }} ({{ item.username }})</span>
                  </template>
                </el-select-v2>
              </el-form-item>
              <el-form-item :label="$t('消息')" prop="message_id">
                <el-select-v2
                  v-model="model.message_id"
                  :options="basedata.messages"
                  :props="{ value: 'message_id', label: 'title' }"
                  clearable
                  filterable
                  @change="messageChange"
                >
                  <template #default="{ item }">
                    <span>[{{ item.message_id }}] {{ item.title }}</span>
                  </template>
                </el-select-v2>
              </el-form-item>
              <el-form-item :label="$t('消息内容')" prop="message_content">
                <div v-html="model.message_content"></div>
              </el-form-item>
              <el-form-item :label="$t('已读')" prop="is_read">
                <ElSwitchWhether v-model="model.is_read" />
              </el-form-item>
              <el-form-item :label="$t('已读时间')" prop="read_time">
                <ElDatePickerDatetime v-model="model.read_time" />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('禁用')" prop="is_disable">
                <ElSwitchWhether v-model="model.is_disable" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('添加时间')" prop="create_time">
                <el-input v-model="model.create_time" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('修改时间')" prop="update_time">
                <el-input v-model="model.update_time" disabled />
              </el-form-item>
              <el-form-item v-if="model.delete_time" :label="$t('删除时间')" prop="delete_time">
                <el-input v-model="model.delete_time" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
    <el-form-item>
      <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
        <el-button :loading="loading" @click="reset">{{ resetText }}</el-button>
        <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
        <el-button
          v-if="id && type === 'edit' && hasPerm(['admin/system.UserMessage/add'])"
          :loading="loading"
          :title="$t('修改将会变成添加')"
          class="float-right"
          @click="submit('add')"
        >
          {{ $t('添加') }}
        </el-button>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
import { screenHeight, addEditSuccessAlert, hasPerm } from '@/utils/index'
import { infoApi, addApi, editApi } from '@/api/system/user-message'

export default {
  props: {
    id: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'edit'
    },
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: '',
      height: 750,
      loading: false,
      idkey: 'user_message_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        user_message_id: '',
        user_id: '',
        user_nickname: '',
        message_id: '',
        message_title: '',
        message_content: '',
        is_read: 0,
        read_time: '',
        is_disable: 0,
        create_time: '',
        update_time: '',
        delete_time: ''
      },
      rules: {},
      resetTitle: '',
      resetText: '',
      basedata: { users: [], messages: [] }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('用户消息')
      this.height = screenHeight()
      this.rules = {
        user_id: [{ required: true, message: this.$t('请选择用户'), trigger: 'blur' }],
        message_id: [{ required: true, message: this.$t('请选择消息'), trigger: 'blur' }]
      }
      if (this.dialog) {
        this.height = this.height - 100
        this.rowcol = { md: 23, lg: 23, xl: 23 }
        this.formclass = false
      }
      if (this.id) {
        this.resetText = this.$t('刷新')
        this.edit()
      } else {
        this.resetText = this.$t('清空')
        this.add()
      }
    },
    add() {
      addApi({}, 'get')
        .then((res) => {
          this.data(res.data)
        })
        .catch(() => {})
    },
    edit(ismsg = false) {
      let api = editApi
      if (this.type === 'info') {
        api = infoApi
      }
      api({ [this.idkey]: this.id }, 'get')
        .then((res) => {
          this.data(res.data)
          if (ismsg) {
            ElMessage.success(res.msg)
          }
        })
        .catch(() => {})
    },
    data(data) {
      if (data) {
        this.basedata.users = data.basedata.users
        this.basedata.messages = data.basedata.messages
        delete data.basedata
        if (data[this.idkey]) {
          this.model = data
        } else {
          this.model = this.$options.data().model
        }
      } else {
        this.model = this.$options.data().model
      }
      this.$refs['ref'].resetFields()
      this.$refs['ref'].clearValidate()
    },
    reset() {
      this.loading = true
      if (this.id) {
        this.edit(true)
      } else {
        this.data()
      }
      this.loading = false
    },
    submit(type = '') {
      this.$refs['ref'].validate((valid) => {
        if (!valid) {
          ElMessage.error(this.$t('请完善必填项'))
        } else {
          this.loading = true
          let api = addApi
          if (this.id) {
            if (type === 'add') {
              api = addApi
            } else {
              api = editApi
            }
          }
          api(this.model)
            .then((res) => {
              this.success(res, type)
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    success(res, type = '') {
      this.loading = false
      ElMessage.success(res.msg)
      if (this.dialog) {
        this.$emit('close')
      } else {
        const id = type === 'add' ? '' : this.id
        addEditSuccessAlert(id, this.name, this.$route)
      }
    },
    messageChange(value) {
      if (this.id) {
        editApi({ message_id: value }, 'get')
          .then((res) => {
            this.model.message_content = res.data?.content
          })
          .catch(() => {})
      } else {
        addApi({ message_id: value }, 'get')
          .then((res) => {
            this.model.message_content = res.data?.content
          })
          .catch(() => {})
      }
    }
  }
}
</script>
