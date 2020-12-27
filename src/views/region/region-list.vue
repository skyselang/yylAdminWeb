<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :xm="24" :sm="18">
          <el-input v-model="regionQuery.region_name" class="filter-item" style="width: 200px;" placeholder="名称" clearable />
          <el-input v-model="regionQuery.region_pinyin" class="filter-item" style="width: 200px;" placeholder="拼音" clearable />
          <el-button class="filter-item" type="primary" @click="regionSearch()">查询</el-button>
          <el-button class="filter-item" @click="regionRefresh()">重置</el-button>
        </el-col>
        <el-col :xm="24" :sm="6" style="text-align:right;">
          <el-button class="filter-item" @click="regionRefresh()">刷新</el-button>
          <el-button class="filter-item" type="primary" @click="regionAddition('')">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- 地区列表 -->
    <el-table
      v-loading="loading"
      :data="regionData"
      :height="height+80"
      style="width: 100%"
      row-key="region_id"
      border
      lazy
      :load="regionListLoad"
      @sort-change="regionSort"
    >
      <el-table-column prop="region_name" label="名称" min-width="250" fixed="left" />
      <el-table-column prop="region_pinyin" label="拼音" min-width="250" sortable="custom" />
      <el-table-column prop="region_jianpin" label="简拼" min-width="120" sortable="custom" />
      <el-table-column prop="region_initials" label="首字母" min-width="90" sortable="custom" />
      <el-table-column prop="region_citycode" label="区号" min-width="80" sortable="custom" />
      <el-table-column prop="region_zipcode" label="邮编" min-width="80" sortable="custom" />
      <el-table-column prop="region_sort" label="排序" min-width="80" sortable="custom" />
      <el-table-column prop="region_id" label="地区ID" min-width="90" sortable="custom" />
      <el-table-column prop="region_pid" label="地区PID" min-width="80" />
      <el-table-column label="操作" width="220" fixed="right" align="right">
        <template slot-scope="{ row }">
          <el-button size="mini" type="primary" @click="regionAddition(row)">添加</el-button>
          <el-button size="mini" type="success" @click="regionModify(row)">修改</el-button>
          <el-button size="mini" type="danger" @click="regionDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 地区添加、修改 -->
    <el-dialog :title="regionDialogTitle" :visible.sync="regionDialog" top="1vh" :before-close="regionCancel">
      <el-form ref="regionRef" v-loading="regionDialogLoad" :rules="regionRules" :model="regionModel" class="dialog-body" label-width="100px" :style="{height:height+30+'px'}">
        <el-form-item label="父级" prop="region_pid">
          <el-cascader v-model="regionModel.region_pid" :options="regionTree" :props="regionProps" style="width:100%" clearable filterable placeholder="一级" @change="regionPidChange" />
        </el-form-item>
        <el-form-item label="名称" prop="region_name">
          <el-input v-model="regionModel.region_name" clearable placeholder="请输入名称：北京市" />
        </el-form-item>
        <el-form-item label="拼音" prop="region_pinyin">
          <el-input v-model="regionModel.region_pinyin" clearable placeholder="请输入拼音：Beijing" />
        </el-form-item>
        <el-form-item label="简拼" prop="region_jianpin">
          <el-input v-model="regionModel.region_jianpin" clearable placeholder="请输入简拼：BJ" />
        </el-form-item>
        <el-form-item label="首字母" prop="region_initials">
          <el-input v-model="regionModel.region_initials" clearable placeholder="请输入首字母：B" />
        </el-form-item>
        <el-form-item label="排序" prop="region_sort">
          <el-input v-model="regionModel.region_sort" clearable placeholder="请输入排序：1000" type="number" />
        </el-form-item>
        <el-form-item label="区号" prop="region_citycode">
          <el-input v-model="regionModel.region_citycode" clearable placeholder="请输入区号：010" />
        </el-form-item>
        <el-form-item label="邮编" prop="region_zipcode">
          <el-input v-model="regionModel.region_zipcode" clearable placeholder="请输入邮编：1000" />
        </el-form-item>
        <el-form-item label="经度" prop="region_longitude">
          <el-input v-model="regionModel.region_longitude" clearable placeholder="请输入经度：116.403263" />
        </el-form-item>
        <el-form-item label="纬度" prop="region_latitude">
          <el-input v-model="regionModel.region_latitude" clearable placeholder="请输入纬度：39.915156" />
        </el-form-item>
        <el-form-item label="添加时间" prop="">
          <el-col :span="10">
            <el-input v-model="regionModel.create_time" clearable placeholder="" disabled />
          </el-col>
          <el-col class="line" :span="4" style="text-align:center">更新时间</el-col>
          <el-col :span="10">
            <el-input v-model="regionModel.update_time" clearable placeholder="" disabled />
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
        <el-button @click="regionCancel">取消</el-button>
        <el-button type="primary" @click="regionSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import {
  regionList,
  regionAdd,
  regionEdit,
  regionDele
} from '@/api/region'

export default {
  name: 'RegionList',
  components: { },
  data() {
    return {
      height: 680,
      loading: false,
      regionData: [],
      regionCount: 0,
      regionQuery: {},
      regionDialog: false,
      regionDialogLoad: false,
      regionDialogTitle: '',
      regionProps: {
        expandTrigger: 'click',
        checkStrictly: true,
        value: 'region_id',
        label: 'region_name'
      },
      regionModel: {
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
      regionRules: {
        region_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.regionList()
  },
  methods: {
    // 地区列表
    regionList() {
      this.loading = true
      this.regionData = []
      regionList(this.regionQuery).then(res => {
        this.regionData = res.data.list
        this.regionCount = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 地区排序
    regionSort(sort) {
      this.regionQuery.sort_field = sort.prop
      this.regionQuery.sort_type = ''
      if (sort.order === 'ascending') {
        this.regionQuery.sort_type = 'asc'
        this.regionList()
      }
      if (sort.order === 'descending') {
        this.regionQuery.sort_type = 'desc'
        this.regionList()
      }
    },
    // 地区查询
    regionSearch() {
      this.regionQuery.page = 1
      this.regionList()
    },
    // 地区加载
    regionListLoad(tree, treeNode, resolve) {
      regionList({
        region_pid: tree.region_id
      }).then(res => {
        resolve(res.data.list)
      })
    },
    // 地区刷新
    regionRefresh() {
      this.regionQuery = {}
      this.regionList()
    },
    // 地区添加
    regionAddition(row) {
      this.regionDialog = true
      this.regionDialogLoad = false
      this.regionDialogTitle = '地区添加'
      regionAdd().then(res => {
        this.regionDialogLoad = false
        if (row) {
          this.regionModel = this.$options.data().regionModel
          this.regionModel.region_pid = row.region_id
        } else {
          this.regionReset()
        }
        this.regionTree = res.data.region_tree
      })
    },
    // 地区修改
    regionModify(row) {
      this.regionDialog = true
      this.regionDialogLoad = false
      this.regionDialogTitle = '地区修改：' + row.region_name
      regionEdit({
        region_id: row.region_id
      }).then(res => {
        this.regionDialogLoad = false
        this.regionModel = res.data.region_info
        this.regionTree = res.data.region_tree
      })
    },
    // 地区删除
    regionDelete(row) {
      this.$confirm('确定要删除地区 <span style="color:red">' + row.region_name + ' </span>吗？',
        '删除：' + row.region_id,
        {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        this.loading = true
        regionDele({
          region_id: row.region_id
        }).then(res => {
          this.regionList()
          this.regionReset()
          this.loading = false
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {})
    },
    // 地区父级选择
    regionPidChange(value) {
      if (value) {
        this.regionModel.region_pid = value[value.length - 1]
      }
    },
    // 地区信息重置
    regionReset(row) {
      if (row) {
        this.regionModel = row
      } else {
        this.regionModel = this.$options.data().regionModel
      }
      if (this.$refs['regionRef'] !== undefined) {
        this.$refs['regionRef'].resetFields()
      }
    },
    // 地区添加、修改取消
    regionCancel() {
      this.regionDialog = false
      this.regionReset()
    },
    // 地区添加、修改提交
    regionSubmit() {
      this.$refs['regionRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.regionModel.region_id) {
            regionEdit(this.regionModel, 'post').then(res => {
              this.regionList()
              this.regionReset()
              this.regionDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            regionAdd(this.regionModel, 'post').then(res => {
              this.regionList()
              this.regionReset()
              this.regionDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    }
  }
}
</script>
