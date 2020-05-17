<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>用户</span>
    </div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用户数量</span>
          </div>
          <div class="text item">
            <el-row :gutter="0">
              <el-col :span="12">
                <svg-icon
                  icon-class="usersTotal"
                  class-name="card-panel-icon"
                  style="font-size:48px"
                />
              </el-col>
              <el-col :span="12">
                12580
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日新增</span>
          </div>
          <div class="text item">
            <el-row :gutter="0">
              <el-col :span="12">
                <svg-icon
                  icon-class="usersAdd"
                  class-name="card-panel-icon"
                  style="font-size:48px"
                />
              </el-col>
              <el-col :span="12">
                66
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>本周新增</span>
          </div>
          <div class="text item">
            <el-row :gutter="0">
              <el-col :span="12">
                <svg-icon
                  icon-class="usersAdd"
                  class-name="card-panel-icon"
                  style="font-size:48px"
                />
              </el-col>
              <el-col :span="12">
                380
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>本月新增</span>
          </div>
          <div class="text item">
            <el-row :gutter="0">
              <el-col :span="12">
                <svg-icon
                  icon-class="usersAdd"
                  class-name="card-panel-icon"
                  style="font-size:48px"
                />
              </el-col>
              <el-col :span="12">
                520
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'UsersTotal',
  components: {},
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style scoped>
.box-card .text {
  color: #666;
  font-size: 20px;
  line-height: 48px;
  font-weight: 700;
}
</style>
