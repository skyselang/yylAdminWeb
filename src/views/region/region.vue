<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row>
        <el-col :xm="24" :sm="22">
          <el-input v-model="query.region_id" class="filter-item" style="width: 200px;" placeholder="ID" clearable />
          <el-input v-model="query.region_name" class="filter-item" style="width: 200px;" placeholder="名称" clearable />
          <el-input v-model="query.region_pinyin" class="filter-item" style="width: 200px;" placeholder="拼音" clearable />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
        <el-col :xm="24" :sm="2" style="text-align:right;">
          <el-button class="filter-item" type="primary" @click="add('')">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-table
      v-loading="loading"
      :data="data"
      :height="height+80"
      style="width: 100%"
      row-key="region_id"
      border
      lazy
      :load="listLoad"
      @sort-change="sort"
    >
      <el-table-column prop="region_name" label="名称" min-width="250" fixed="left" />
      <el-table-column prop="region_pinyin" label="拼音" min-width="250" sortable="custom" />
      <el-table-column prop="region_jianpin" label="简拼" min-width="120" sortable="custom" />
      <el-table-column prop="region_initials" label="首字母" min-width="90" sortable="custom" />
      <el-table-column prop="region_citycode" label="区号" min-width="80" sortable="custom" />
      <el-table-column prop="region_zipcode" label="邮编" min-width="80" sortable="custom" />
      <el-table-column prop="region_sort" label="排序" min-width="80" sortable="custom" />
      <el-table-column prop="region_id" label="ID" min-width="100" sortable="custom" />
      <el-table-column prop="region_pid" label="PID" min-width="100" />
      <el-table-column label="操作" width="215" fixed="right" align="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="add(row)">添加</el-button>
          <el-button size="mini" type="success" @click="edit(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="dele(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加、修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="1vh" :before-close="cancel">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item label="父级" prop="region_pid">
          <el-cascader
            v-model="model.region_pid"
            :options="regionTree"
            :props="regionProps"
            style="width:100%"
            clearable
            filterable
            placeholder="一级"
            @change="pidChange"
          />
        </el-form-item>
        <el-form-item label="名称" prop="region_name">
          <el-input v-model="model.region_name" clearable placeholder="请输入名称：北京市" />
        </el-form-item>
        <el-form-item label="拼音" prop="region_pinyin">
          <el-input v-model="model.region_pinyin" clearable placeholder="请输入拼音：Beijing" />
        </el-form-item>
        <el-form-item label="简拼" prop="region_jianpin">
          <el-input v-model="model.region_jianpin" clearable placeholder="请输入简拼：BJ" />
        </el-form-item>
        <el-form-item label="首字母" prop="region_initials">
          <el-input v-model="model.region_initials" clearable placeholder="请输入首字母：B" />
        </el-form-item>
        <el-form-item label="排序" prop="region_sort">
          <el-input v-model="model.region_sort" clearable placeholder="请输入排序：1000" type="number" />
        </el-form-item>
        <el-form-item label="区号" prop="region_citycode">
          <el-input v-model="model.region_citycode" clearable placeholder="请输入区号：010" />
        </el-form-item>
        <el-form-item label="邮编" prop="region_zipcode">
          <el-input v-model="model.region_zipcode" clearable placeholder="请输入邮编：1000" />
        </el-form-item>
        <el-form-item label="经度" prop="region_longitude">
          <el-input v-model="model.region_longitude" clearable placeholder="请输入经度：116.403263" />
        </el-form-item>
        <el-form-item label="纬度" prop="region_latitude">
          <el-input v-model="model.region_latitude" clearable placeholder="请输入纬度：39.915156" />
        </el-form-item>
        <el-form-item label="添加时间" prop="">
          <el-col :span="10">
            <el-input v-model="model.create_time" clearable placeholder="" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">修改时间</el-col>
          <el-col :span="10">
            <el-input v-model="model.update_time" clearable placeholder="" disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="" prop="">
          <el-col :span="12">
            <el-link type="info" href="https://www.ip138.com/post/" target="_blank">查询区号邮编</el-link>
          </el-col>
          <el-col :span="12">
            <el-link type="info" href="http://api.map.baidu.com/lbsapi/getpoint/index.html" target="_blank">查询经度纬度</el-link>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import { list, info, add, edit, dele } from '@/api/region'

export default {
  name: 'Region',
  components: { },
  data() {
    return {
      height: 680,
      loading: false,
      data: [],
      count: 0,
      query: {},
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
        region_sort: 1000
      },
      regionTree: [],
      regionProps: {
        expandTrigger: 'click',
        checkStrictly: true,
        value: 'region_id',
        label: 'region_name'
      },
      rules: {
        region_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      this.data = []
      list(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加
    add(row) {
      this.dialog = true
      this.dialogTitle = '地区添加'
      list({ type: 'tree' }).then(res => {
        if (row) {
          this.model = this.$options.data().model
          this.model.region_pid = row.region_id
        } else {
          this.reset()
        }
        this.regionTree = res.data
      })
    },
    // 修改
    edit(row) {
      this.dialog = true
      this.dialogTitle = '地区修改：' + row.region_id
      list({ type: 'tree' }).then(res => {
        this.regionTree = res.data
      })
      info({
        region_id: row.region_id
      }).then(res => {
        this.model = res.data
      })
    },
    // 删除
    dele(row) {
      this.$confirm('确定要删除地区 <span style="color:red">' + row.region_name + ' </span>吗？',
        '删除地区：' + row.region_id,
        { type: 'warning', dangerouslyUseHTMLString: true }
      ).then(() => {
        this.loading = true
        dele({
          region_id: row.region_id
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 取消
    cancel() {
      this.dialog = false
      this.reset()
    },
    // 提交
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.region_id) {
            edit(this.model).then(res => {
              this.list()
              this.reset()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model).then(res => {
              this.list()
              this.reset()
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
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 刷新
    refresh() {
      this.query = {}
      this.list()
    },
    // 排序
    sort(sort) {
      this.query.sort_field = sort.prop
      this.query.sort_type = ''
      if (sort.order === 'ascending') {
        this.query.sort_type = 'asc'
        this.list()
      }
      if (sort.order === 'descending') {
        this.query.sort_type = 'desc'
        this.list()
      }
    },
    // 加载
    listLoad(tree, treeNode, resolve) {
      list({
        region_pid: tree.region_id
      }).then(res => {
        resolve(res.data.list)
      })
    },
    // 父级选择
    pidChange(value) {
      if (value) {
        this.model.region_pid = value[value.length - 1]
      }
    }
  }
}
</script>
