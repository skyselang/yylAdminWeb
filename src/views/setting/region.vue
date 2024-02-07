<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-row>
      <el-col class="mb-2">
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="查询字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="region_pid" label="上级" />
          <el-option value="region_name" label="名称" />
          <el-option value="region_pinyin" label="拼音" />
          <el-option value="region_jianpin" label="简拼" />
          <el-option value="region_initials" label="首字母" />
          <el-option value="region_citycode" label="区号" />
          <el-option value="region_zipcode" label="邮编" />
        </el-select>
        <el-select v-model="query.search_exp" class="ya-search-exp">
          <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
        </el-select>
        <el-cascader
          v-if="query.search_field === 'region_pid'"
          v-model="query.region_pid"
          :options="trees"
          :props="props"
          class="ya-search-value"
          clearable
          filterable
        />
        <el-input
          v-else
          v-model="query.search_value"
          class="ya-search-value"
          placeholder="查询内容"
          clearable
        />
        <el-select v-model="query.date_field" class="ya-date-field" placeholder="时间类型">
          <el-option value="create_time" label="添加时间" />
          <el-option value="update_time" label="修改时间" />
        </el-select>
        <el-date-picker
          v-model="query.date_value"
          type="datetimerange"
          class="ya-date-value"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="[new Date(2024, 1, 1, 0, 0, 0), new Date(2024, 1, 1, 23, 59, 59)]"
        />
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button title="重置" @click="refresh()">
          <svg-icon icon-class="refresh" />
        </el-button>
        <el-button type="primary" @click="add()">添加</el-button>
      </el-col>
    </el-row>
    <!-- 操作 -->
    <el-row>
      <el-col>
        <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
        <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
        <el-button title="修改上级" @click="selectOpen('editpid')">上级</el-button>
        <el-button title="修改区号" @click="selectOpen('citycode')">区号</el-button>
        <el-button title="修改邮编" @click="selectOpen('zipcode')">邮编</el-button>
      </el-col>
    </el-row>
    <el-dialog
      v-model="selectDialog"
      :title="selectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
      destroy-on-close
    >
      <el-form ref="selectRef" label-width="120px">
        <el-form-item v-if="selectType === 'editpid'" label="上级">
          <el-cascader
            v-model="region_pid"
            :options="trees"
            :props="props"
            class="w-full"
            placeholder="一级地区"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'citycode'" label="区号">
          <el-input v-model="region_citycode" placeholder="请输入区号，eg：010" clearable />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'zipcode'" label="邮编">
          <el-input v-model="region_zipcode" placeholder="请输入邮编，eg：1000" clearable />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'disable'" label="是否禁用">
          <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-else-if="selectType === 'dele'">
          <span class="c-red">确定要删除选中的{{ name }}吗？</span>
        </el-form-item>
        <el-form-item :label="name + 'ID'">
          <el-input v-model="selectIds" type="textarea" autosize disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :loading="loading" @click="selectCancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
      </template>
    </el-dialog>
    <!-- 列表 -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :height="height"
      :row-key="idkey"
      :lazy="true"
      :load="load"
      @sort-change="sort"
      @selection-change="select"
      @cell-dblclick="cellDbclick"
    >
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="region_name" label="名称" min-width="250" show-overflow-tooltip />
      <el-table-column prop="region_pinyin" label="拼音" min-width="250" show-overflow-tooltip />
      <el-table-column prop="region_citycode" label="区号" min-width="80" />
      <el-table-column prop="region_zipcode" label="邮编" min-width="80" />
      <el-table-column prop="region_longitude" label="经度" min-width="110" />
      <el-table-column prop="region_latitude" label="纬度" min-width="110" />
      <el-table-column prop="is_disable" label="禁用" width="85">
        <template #default="scope">
          <el-switch
            v-model="scope.row.is_disable"
            :active-value="1"
            :inactive-value="0"
            @change="disable([scope.row])"
          />
        </template>
      </el-table-column>
      <el-table-column :prop="idkey" label="ID" min-width="95" />
      <el-table-column prop="sort" label="排序" min-width="80" />
      <el-table-column label="操作" width="130">
        <template #default="scope">
          <el-link
            type="primary"
            class="mr-1"
            :underline="false"
            title="添加下级"
            @click="add(scope.row)"
          >
            添加
          </el-link>
          <el-link type="primary" class="mr-1" :underline="false" @click="edit(scope.row)">
            修改
          </el-link>
          <el-link type="primary" :underline="false" @click="selectOpen('dele', [scope.row])">
            删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-descriptions title="" :column="12" :colon="false">
        <el-descriptions-item>共 {{ count }} 条</el-descriptions-item>
      </el-descriptions>
    </el-row>
    <!-- 添加修改 -->
    <el-dialog
      v-model="dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      top="5vh"
    >
      <el-scrollbar native :height="height - 50">
        <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
          <el-form-item label="上级" prop="region_pid">
            <el-cascader
              v-model="model.region_pid"
              :options="trees"
              :props="props"
              class="w-full"
              placeholder="一级地区"
              clearable
              filterable
            />
          </el-form-item>
          <el-form-item label="名称" prop="region_name">
            <el-input v-model="model.region_name" placeholder="请输入名称，eg：北京市" clearable>
              <template #append>
                <el-button title="复制" @click="copy(model.region_name)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="拼音" prop="region_pinyin">
            <el-input v-model="model.region_pinyin" placeholder="请输入拼音，eg：Beijing" clearable>
              <template #append>
                <el-button title="复制" @click="copy(model.region_pinyin)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="简拼" prop="region_jianpin">
            <el-input v-model="model.region_jianpin" placeholder="请输入简拼，eg：BJ" clearable>
              <template #append>
                <el-button title="复制" @click="copy(model.region_jianpin)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="首字母" prop="region_initials">
            <el-input v-model="model.region_initials" placeholder="请输入首字母，eg：B" clearable>
              <template #append>
                <el-button title="复制" @click="copy(model.region_initials)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="区号" prop="region_citycode">
            <el-input v-model="model.region_citycode" placeholder="请输入区号，eg：010" clearable>
              <template #append>
                <el-button title="复制" @click="copy(model.region_citycode)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="邮编" prop="region_zipcode">
            <el-input v-model="model.region_zipcode" placeholder="请输入邮编，eg：1000" clearable>
              <template #append>
                <el-button title="复制" @click="copy(model.region_zipcode)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="经度" prop="region_longitude">
            <el-input
              v-model="model.region_longitude"
              placeholder="请输入经度（高德），eg：116.403263"
              clearable
            >
              <template #append>
                <el-button title="复制" @click="copy(model.region_longitude)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="region_latitude">
            <el-input
              v-model="model.region_latitude"
              placeholder="请输入纬度（高德），eg：39.915156"
              clearable
            >
              <template #append>
                <el-button title="复制" @click="copy(model.region_latitude)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input
              v-model="model.sort"
              type="number"
              placeholder="请输入排序，eg：2250"
              clearable
            >
              <template #append>
                <el-button title="复制" @click="copy(model.sort)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="完整名称" prop="region_fullname">
            <el-input v-model="model.region_fullname" placeholder="" disabled>
              <template #append>
                <el-button title="复制" @click="copy(model.region_fullname)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="完整拼音" prop="region_fullname_py">
            <el-input v-model="model.region_fullname_py" placeholder="" disabled>
              <template #append>
                <el-button title="复制" @click="copy(model.region_fullname_py)">
                  <svg-icon icon-class="copy-document" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
            <el-input v-model="model.create_time" placeholder="" disabled />
          </el-form-item>
          <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
            <el-input v-model="model.update_time" placeholder="" disabled />
          </el-form-item>
          <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
            <el-input v-model="model.delete_time" disabled />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import clip from '@/utils/clipboard'
import { arrayColumn } from '@/utils/index'
import {
  list,
  info,
  add,
  edit,
  dele,
  editpid,
  citycode,
  zipcode,
  disable as disableApi
} from '@/api/setting/region'

export default {
  name: 'SettingRegion',
  data() {
    return {
      name: '地区',
      height: 680,
      loading: false,
      idkey: 'region_id',
      tbKey: 1,
      exps: [{ exp: 'like', name: '包含' }],
      query: { search_field: 'region_name', search_exp: 'like', date_field: 'create_time' },
      data: [],
      dialog: false,
      dialogTitle: '',
      model: {
        region_id: '',
        region_pid: 0,
        region_name: '',
        region_pinyin: '',
        region_jianpin: '',
        region_initials: '',
        region_citycode: '',
        region_zipcode: '',
        region_longitude: '',
        region_latitude: '',
        sort: 2250
      },
      rules: {
        region_name: [{ required: true, message: '请输入地区名称', trigger: 'blur' }]
      },
      trees: [],
      props: {
        expandTrigger: 'click',
        checkStrictly: true,
        value: 'region_id',
        label: 'region_name',
        emitPath: false
      },
      selection: [],
      selectIds: '',
      selectTitle: '操作',
      selectDialog: false,
      selectType: '',
      region_pid: 0,
      region_citycode: '',
      region_zipcode: '',
      is_disable: 0,
      count: ''
    }
  },
  created() {
    this.height = screenHeight(290)
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query)
        .then((res) => {
          this.data = res.data.list
          this.trees = res.data.tree
          this.exps = res.data.exps
          this.count = res.data.count
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 懒加载
    load(row, treeNode, resolve) {
      list({
        region_pid: row[this.idkey]
      }).then((res) => {
        resolve(res.data.list)
      })
    },
    // 添加修改
    add(row) {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
      if (row) {
        this.model.region_pid = row[this.idkey]
      }
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id)
        .then((res) => {
          this.reset(res.data)
        })
        .catch(() => {})
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.model[this.idkey]) {
            edit(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            add(this.model)
              .then((res) => {
                this.list()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      if (this.$refs['ref'] !== undefined) {
        try {
          this.$refs['ref'].resetFields()
          this.$refs['ref'].clearValidate()
        } catch (error) {}
      }
    },
    // 查询
    search() {
      this.list()
    },
    // 刷新
    refresh() {
      const limit = this.query.limit
      this.query = this.$options.data().query
      this.$refs['table'].clearSort()
      this.query.limit = limit
      this.list()
      ++this.tbKey
    },
    // 排序
    sort(sort) {
      this.query.sort_field = sort.prop
      this.query.sort_value = ''
      if (sort.order === 'ascending') {
        this.query.sort_value = 'asc'
        this.list()
      }
      if (sort.order === 'descending') {
        this.query.sort_value = 'desc'
        this.list()
      }
    },
    // 操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds(selection).toString()
    },
    selectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    selectAlert() {
      ElMessageBox.alert('请选择需要操作的' + this.name, '提示', {
        type: 'warning',
        callback: () => {}
      })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['table'].clearSelection()
        const selectRowLen = selectRow.length
        for (let i = 0; i < selectRowLen; i++) {
          this.$refs['table'].toggleRowSelection(selectRow[i], true)
        }
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '操作'
        if (selectType === 'editpid') {
          this.selectTitle = this.name + '修改上级'
        } else if (selectType === 'citycode') {
          this.selectTitle = this.name + '修改区号'
        } else if (selectType === 'zipcode') {
          this.selectTitle = this.name + '修改邮编'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '是否禁用'
        } else if (selectType === 'dele') {
          this.selectTitle = this.name + '删除'
        }
        this.selectDialog = true
        this.selectType = selectType
      }
    },
    selectCancel() {
      this.selectDialog = false
    },
    selectSubmit() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        const selectType = this.selectType
        if (selectType === 'editpid') {
          this.editpid(this.selection)
        } else if (selectType === 'citycode') {
          this.citycode(this.selection)
        } else if (selectType === 'zipcode') {
          this.zipcode(this.selection)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 修改上级
    editpid(row) {
      editpid({
        ids: this.selectGetIds(row),
        region_pid: this.region_pid
      })
        .then((res) => {
          this.list()
          this.reset()
          this.selectDialog = false
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 修改区号
    citycode(row) {
      citycode({
        ids: this.selectGetIds(row),
        region_citycode: this.region_citycode
      })
        .then((res) => {
          this.list()
          this.reset()
          this.selectDialog = false
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 修改邮编
    zipcode(row) {
      zipcode({
        ids: this.selectGetIds(row),
        region_zipcode: this.region_zipcode
      })
        .then((res) => {
          this.list()
          this.reset()
          this.selectDialog = false
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 是否禁用
    disable(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_disable = row[0].is_disable
        if (select) {
          is_disable = this.is_disable
        }
        disableApi({
          ids: this.selectGetIds(row),
          is_disable: is_disable
        })
          .then((res) => {
            this.list()
            this.reset()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
      }
    },
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        dele({
          ids: this.selectGetIds(row)
        })
          .then((res) => {
            this.list()
            this.reset()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 复制
    copy(text) {
      clip(text)
    },
    // 单元格双击复制
    cellDbclick(row, column) {
      this.copy(row[column.property])
    }
  }
}
</script>
