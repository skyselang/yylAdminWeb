<template>
  <el-row>
    <el-col :span="6">
      <el-button v-if="hasPerm(['admin/setting.Carousel/add'])" type="primary" @click="add()">
        {{ $t('添加') }}
      </el-button>
      <el-button v-if="hasPerm(['admin/setting.Carousel/edit'])" @click="edit()">{{ $t('修改') }}</el-button>
      <el-button v-else-if="hasPerm(['admin/setting.Carousel/info'])" @click="edit()">{{ $t('信息') }}</el-button>
      <el-button v-if="hasPerm(['admin/setting.Carousel/dele'])" @click="update('is_delete')">
        {{ $t('删除') }}
      </el-button>
      <el-button v-if="hasPerm(['admin/setting.Carousel/disable'])" @click="update('is_disable')">
        {{ $t('禁用') }}
      </el-button>
    </el-col>
    <el-col :span="14">
      <template v-if="hasPerm(['admin/setting.Carousel/update'])">
        <el-button :title="$t('修改编号')" @click="update('unique')">{{ $t('编号') }}</el-button>
        <el-button :title="$t('修改备注')" @click="update('remark')">{{ $t('备注') }}</el-button>
        <el-button :title="$t('修改排序')" @click="update('sort')">{{ $t('排序') }}</el-button>
        <el-button :title="$t('修改位置')" @click="update('position')">{{ $t('位置') }}</el-button>
        <el-button :title="$t('修改文件')" @click="update('file_id')">{{ $t('文件') }}</el-button>
      </template>
    </el-col>
    <el-col :span="4">
      <Exports
        v-if="hasPerm(['admin/setting.Carousel/export'])"
        :name="name"
        :api="exportApi"
        :query="query"
        :ids="ids"
      />
      <Imports v-if="hasPerm(['admin/setting.Carousel/import'])" :name="name" :api="importApi" />
    </el-col>
  </el-row>
  <el-dialog
    v-model="dialog"
    :title="name + '：' + title"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    draggable
    center
    align-center
  >
    <el-scrollbar :height="height">
      <el-form ref="ref" label-width="120px">
        <el-form-item v-if="field === 'is_delete'" :label="$t('删除')">
          <el-text size="default" type="danger">{{ $t('确定要删除选中的吗', { name: name }) }}</el-text>
        </el-form-item>
        <el-form-item v-else-if="field === 'is_disable'" :label="$t('禁用')">
          <ElSwitchWhether v-model="value" />
        </el-form-item>
        <el-form-item v-else-if="field === 'unique'" :label="$t('编号')">
          <el-col><el-input v-model="value" :placeholder="$t('前缀起始数')" clearable /></el-col>
          <el-col>
            <el-text size="default">eg：SN,001；{{ $t('根据ID顺序进行前缀和起始数递增生成编号') }}</el-text>
          </el-col>
        </el-form-item>
        <el-form-item v-else-if="field === 'remark'" :label="$t('备注')">
          <el-input v-model="value" :placeholder="$t('请输入备注')" clearable />
        </el-form-item>
        <el-form-item v-else-if="field === 'sort'" :label="$t('排序')">
          <el-col><el-input v-model="value" :placeholder="$t('排序步长')" clearable /></el-col>
          <el-col>
            <el-text size="default">eg：250,-10；{{ $t('根据ID顺序进行步长递增或递减生成排序') }}</el-text>
          </el-col>
        </el-form-item>
        <el-form-item v-else-if="field === 'position'" :label="$t('位置')">
          <el-input v-model="value" :placeholder="$t('请输入位置')" clearable />
        </el-form-item>
        <el-form-item v-else-if="field === 'file_id'" :label="$t('文件')">
          <el-input v-model="value" :placeholder="$t('请输入文件ID')" clearable />
        </el-form-item>
        <el-form-item label="ID">
          <el-col>
            <el-text size="default">{{ ids.toString() }}</el-text>
          </el-col>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button :loading="loading" @click="cancel">{{ $t('取消') }}</el-button>
      <el-button :loading="loading" type="primary" @click="submit">{{ $t('提交') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { hasPerm, screenHeight } from '@/utils/index'
import { deleApi, disableApi, updateApi, exportApi, importApi } from '@/api/setting/carousel'

export default {
  components: {},
  props: {
    name: {
      type: String,
      default: ''
    },
    ids: {
      type: Array,
      default() {
        return []
      }
    },
    query: {
      type: Object,
      default() {
        return {}
      }
    },
    basedata: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  emits: ['list', 'add', 'edit'],
  data() {
    return {
      height: 600,
      loading: false,
      dialog: false,
      title: '',
      field: '',
      value: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    hasPerm,
    exportApi,
    importApi,
    init() {
      this.title = this.$t('批量操作')
      this.height = screenHeight(550)
    },
    update(field) {
      this.value = ''
      if (this.ids.length) {
        this.dialog = true
        this.field = field
      } else {
        this.alert()
      }
    },
    cancel() {
      this.dialog = false
      this.loading = false
      this.value = ''
    },
    submit() {
      this.loading = true
      let api = updateApi
      let data = { ids: this.ids, field: this.field, value: this.value }
      if (this.field === 'is_delete') {
        api = deleApi
        data = { ids: this.ids }
      } else if (this.field === 'is_disable') {
        api = disableApi
        data = { ids: this.ids, is_disable: this.value ? 1 : 0 }
      }
      api(data)
        .then((res) => {
          ElMessage.success(res.msg)
          this.dialog = false
          this.loading = false
          this.$emit('list')
        })
        .catch(() => {
          this.loading = false
        })
    },
    add() {
      this.$emit('add')
    },
    edit() {
      this.$emit('edit')
    },
    alert() {
      ElMessageBox.alert(this.$t('请选择需要操作的', { name: this.name }), this.$t('提示'), {
        type: 'warning',
        center: true,
        callback: () => {}
      })
    }
  }
}
</script>
