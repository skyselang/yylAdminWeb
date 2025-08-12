<template>
  <el-form ref="ref" :model="model" :rules="rules" label-width="130px" :class="{ 'app-container': formclass }">
    <el-tabs>
      <el-tab-pane :label="$t('基本信息')">
        <el-scrollbar :height="height">
          <el-row>
            <el-col :md="rowcol.md" :lg="rowcol.lg" :xl="rowcol.xl">
              <el-form-item :label="$t('上级')" prop="region_pid">
                <el-cascader
                  v-model="model.region_pid"
                  :options="basedata.trees"
                  :props="basedata.props"
                  clearable
                  filterable
                  class="w-full"
                />
              </el-form-item>
              <el-form-item :label="$t('名称')" prop="region_name">
                <el-input v-model="model.region_name" clearable />
              </el-form-item>
              <el-form-item :label="$t('级别')" prop="level">
                <el-select v-model="model.level">
                  <el-option v-for="v in basedata.levels" :key="v.value" :value="v.value" :label="v.name" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('拼音')" prop="pinyin">
                <el-input v-model="model.pinyin" clearable />
              </el-form-item>
              <el-form-item :label="$t('简拼')" prop="jianpin">
                <el-input v-model="model.jianpin" clearable />
              </el-form-item>
              <el-form-item :label="$t('首字母')" prop="initials">
                <el-input v-model="model.initials" clearable />
              </el-form-item>
              <el-form-item :label="$t('区号')" prop="citycode">
                <el-input v-model="model.citycode" clearable />
              </el-form-item>
              <el-form-item :label="$t('邮编')" prop="zipcode">
                <el-input v-model="model.zipcode" clearable />
              </el-form-item>
              <el-form-item :label="$t('经度')" prop="longitude">
                <el-input v-model="model.longitude" clearable />
              </el-form-item>
              <el-form-item :label="$t('纬度')" prop="latitude">
                <el-input v-model="model.latitude" clearable />
              </el-form-item>
              <el-form-item :label="$t('备注')" prop="remark">
                <el-input v-model="model.remark" clearable />
              </el-form-item>
              <el-form-item :label="$t('排序')" prop="sort">
                <el-input v-model="model.sort" type="number" clearable />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('完整名称')" prop="region_fullname">
                <el-input v-model="model.region_fullname" disabled />
              </el-form-item>
              <el-form-item v-if="id" :label="$t('完整拼音')" prop="region_fullname_py">
                <el-input v-model="model.region_fullname_py" disabled />
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
          v-if="id && type === 'edit' && hasPerm(['admin/setting.Region/add'])"
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
import { infoApi, addApi, editApi } from '@/api/setting/region'

export default {
  components: {},
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
    },
    pid: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      name: '',
      height: 750,
      loading: false,
      idkey: 'region_id',
      rowcol: { md: 24, lg: 16, xl: 14 },
      formclass: true,
      model: {
        region_id: '',
        region_pid: 0,
        region_name: '',
        level: '',
        pinyin: '',
        jianpin: '',
        initials: '',
        citycode: '',
        zipcode: '',
        longitude: '',
        latitude: '',
        remark: '',
        sort: 2250,
        is_disable: 0,
        create_time: '',
        update_time: '',
        delete_time: ''
      },
      rules: {},
      resetTitle: '',
      resetText: '',
      basedata: {
        trees: [],
        props: { value: 'region_id', label: 'region_name', checkStrictly: true, emitPath: false },
        levels: []
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    init() {
      this.name = this.$t('地区')
      this.height = screenHeight()
      this.rules = { region_name: [{ required: true, message: this.$t('请输入名称'), trigger: 'blur' }] }
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
        this.basedata.trees = data.basedata.trees
        this.basedata.levels = data.basedata.levels
        delete data.basedata
        if (data[this.idkey]) {
          this.model = data
        } else {
          this.model = this.$options.data().model
        }
      } else {
        this.model = this.$options.data().model
      }
      if (this.pid) {
        this.model.region_pid = Number(this.pid)
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
    }
  }
}
</script>
