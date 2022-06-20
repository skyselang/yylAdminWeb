<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
            <el-option value="region_name" label="名称" />
            <el-option value="region_pinyin" label="拼音" />
            <el-option value="region_pid" label="上级" />
            <el-option value="region_jianpin" label="简拼" />
            <el-option value="region_initials" label="首字母" />
            <el-option value="region_citycode" label="区号" />
            <el-option value="region_zipcode" label="邮编" />
            <el-option :value="idkey" label="ID" />
          </el-select>
          <el-cascader
            v-if="query.search_field==='region_pid'"
            v-model="query.region_pid"
            :options="trees"
            :props="props"
            class="filter-item ya-search-value"
            placeholder="请选择"
            clearable
            filterable
            @change="pidQuery"
          />
          <el-input v-else v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="filter-item ya-date-value"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button title="修改上级" @click="selectOpen('editpid')">上级</el-button>
          <el-button title="修改区号" @click="selectOpen('citycode')">区号</el-button>
          <el-button title="修改邮编" @click="selectOpen('zipcode')">邮编</el-button>
          <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add('')">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false" destroy-on-close>
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name+'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 2, maxRows: 12}" disabled />
          </el-form-item>
          <el-form-item v-if="selectType==='editpid'" label="上级" prop="">
            <el-cascader
              v-model="region_pid"
              :options="trees"
              :props="props"
              style="width:100%"
              placeholder="一级地区"
              clearable
              filterable
              @change="pidSelect"
            />
          </el-form-item>
          <el-form-item v-else-if="selectType==='citycode'" label="区号" prop="">
            <el-input v-model="region_citycode" placeholder="请输入区号，eg：010" clearable />
          </el-form-item>
          <el-form-item v-else-if="selectType==='zipcode'" label="邮编" prop="">
            <el-input v-model="region_zipcode" placeholder="请输入邮编，eg：1000" clearable />
          </el-form-item>
          <el-form-item v-else-if="selectType==='dele'" label="" prop="">
            <span style="color:red">确定要删除选中的{{ name }}吗？</span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="loading" @click="selectCancel">取消</el-button>
          <el-button :loading="loading" type="primary" @click="selectSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 列表 -->
    <el-table
      ref="table"
      :key="tbKey"
      v-loading="loading"
      :data="data"
      :height="height"
      :row-key="idkey"
      lazy
      :load="load"
      @sort-change="sort"
      @selection-change="select"
      @cell-dblclick="cellDbclick"
    >
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column prop="region_name" label="名称" min-width="250" />
      <el-table-column prop="region_pinyin" label="拼音" min-width="250" sortable="custom" />
      <el-table-column prop="region_citycode" label="区号" min-width="80" sortable="custom" />
      <el-table-column prop="region_zipcode" label="邮编" min-width="80" sortable="custom" />
      <el-table-column prop="region_longitude" label="经度" min-width="110" sortable="custom" />
      <el-table-column prop="region_latitude" label="纬度" min-width="110" sortable="custom" />
      <el-table-column :prop="idkey" label="ID" min-width="95" sortable="custom" />
      <el-table-column prop="region_pid" label="PID" min-width="95" />
      <el-table-column prop="region_sort" label="排序" min-width="80" sortable="custom" />
      <el-table-column label="操作" width="130" fixed="right" align="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="text" title="添加下级" @click="add(row)">添加</el-button>
          <el-button size="mini" type="text" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele',row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height-50+'px'}">
        <el-form-item label="上级" prop="region_pid">
          <el-cascader
            v-model="model.region_pid"
            :options="trees"
            :props="props"
            style="width:100%"
            placeholder="一级地区"
            clearable
            filterable
            @change="pidEdit"
          />
        </el-form-item>
        <el-form-item label="名称" prop="region_name">
          <el-input v-model="model.region_name" placeholder="请输入名称，eg：北京市" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.region_name, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="拼音" prop="region_pinyin">
          <el-input v-model="model.region_pinyin" placeholder="请输入拼音，eg：Beijing" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.region_pinyin, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="简拼" prop="region_jianpin">
          <el-input v-model="model.region_jianpin" placeholder="请输入简拼，eg：BJ" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.region_jianpin, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="首字母" prop="region_initials">
          <el-input v-model="model.region_initials" placeholder="请输入首字母，eg：B" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.region_initials, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="区号" prop="region_citycode">
          <el-input v-model="model.region_citycode" placeholder="请输入区号，eg：010" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.region_citycode, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="region_zipcode">
          <el-input v-model="model.region_zipcode" placeholder="请输入邮编，eg：1000" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.region_zipcode, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="经度" prop="region_longitude">
          <el-input v-model="model.region_longitude" placeholder="请输入经度，eg：116.403263" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.region_longitude, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="region_latitude">
          <el-input v-model="model.region_latitude" placeholder="请输入纬度，eg：39.915156" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.region_latitude, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="region_sort">
          <el-input v-model="model.region_sort" type="number" placeholder="请输入排序，eg：2250" clearable>
            <el-button slot="append" icon="el-icon-document-copy" title="复制" @click="copy(model.region_sort, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-link type="info" href="https://www.ip138.com/post/" style="margin-right:10px" target="_blank">查询区号邮编</el-link>
          <el-link type="info" href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank">查询经度纬度</el-link>
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" placeholder="" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" placeholder="" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import clip from '@/utils/clipboard'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, pid, citycode, zipcode, dele } from '@/api/setting/region'

export default {
  name: 'SettingRegion',
  components: { },
  data() {
    return {
      name: '地区',
      height: 680,
      loading: false,
      idkey: 'region_id',
      tbKey: 1,
      query: {
        search_field: 'region_name',
        date_field: 'create_time'
      },
      data: [],
      trees: [],
      props: { expandTrigger: 'click', checkStrictly: true, value: 'region_id', label: 'region_name' },
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
        region_sort: 2250
      },
      rules: {
        region_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      region_pid: 0,
      region_citycode: '',
      region_zipcode: ''
    }
  },
  created() {
    this.height = screenHeight(210)
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      this.data = []
      list(this.query).then(res => {
        this.data = res.data.list
        this.trees = res.data.tree
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 懒加载
    load(row, treeNode, resolve) {
      list({
        region_pid: row[this.idkey]
      }).then(res => {
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
      this.reset()
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
        this.model = res.data
      })
    },
    cancel() {
      this.dialog = false
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model[this.idkey]) {
            edit(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
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
        this.$refs['ref'].resetFields()
      }
      if (this.$refs['table'] !== undefined) {
        this.$refs['table'].doLayout()
      }
    },
    // 查询
    search() {
      this.list()
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.list()
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
    // 选中操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds(selection).toString()
    },
    selectGetIds(selection) {
      return arrayColumn(selection, this.idkey)
    },
    selectAlert() {
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => {} })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        this.$refs['table'].clearSelection()
        this.$refs['table'].toggleRowSelection(selectRow)
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '选中操作'
        if (selectType === 'editpid') {
          this.selectTitle = '修改上级'
        } else if (selectType === 'citycode') {
          this.selectTitle = '修改区号'
        } else if (selectType === 'zipcode') {
          this.selectTitle = '修改邮编'
        } else if (selectType === 'dele') {
          this.selectTitle = '删除' + this.name
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
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 修改上级
    editpid(row) {
      pid({
        ids: this.selectGetIds(row),
        region_pid: this.region_pid
      }).then(res => {
        this.list()
        ++this.tbKey
        this.selectDialog = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 修改区号
    citycode(row) {
      citycode({
        ids: this.selectGetIds(row),
        region_citycode: this.region_citycode
      }).then(res => {
        this.list()
        this.selectDialog = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 修改邮编
    zipcode(row) {
      zipcode({
        ids: this.selectGetIds(row),
        region_zipcode: this.region_zipcode
      }).then(res => {
        this.list()
        this.selectDialog = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    dele(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        dele({
          ids: this.selectGetIds(row)
        }).then(res => {
          this.list()
          ++this.tbKey
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 上级选择
    pidEdit(value) {
      if (value) {
        this.model.region_pid = value[value.length - 1]
      }
    },
    pidQuery(value) {
      if (value) {
        this.query.region_pid = value[value.length - 1]
      }
    },
    pidSelect(value) {
      if (value) {
        this.region_pid = value[value.length - 1]
      }
    },
    // 复制
    copy(text, event) {
      clip(text, event)
    },
    // 单元格双击复制
    cellDbclick(row, column, cell, event) {
      this.copy(row[column.property], event)
    }
  }
}
</script>
