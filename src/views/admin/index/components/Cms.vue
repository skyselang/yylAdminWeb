<template>
  <div>
    <el-card v-loading="loading" class="box-card">
      <el-row :gutter="10">
        <el-col :sm="8">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>内容</span>
            </div>
            <div class="text">
              <el-row :gutter="0">
                <el-col :span="24" class="color-tot" title="总数">
                  {{ count.content }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="8">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>分类</span>
            </div>
            <div class="text">
              <el-row :gutter="0">
                <el-col :span="24" class="color-tot" title="总数">
                  {{ count.category }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :sm="8">
          <el-card class="box-card" :body-style="cardBodyStyle">
            <div slot="header" class="clearfix">
              <span>点击量</span>
            </div>
            <div class="text">
              <el-row :gutter="0">
                <el-col :span="24" class="color-tot" title="总数">
                  {{ count.hits }}
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <back-to-top transition-name="fade" />
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import BackToTop from '@/components/BackToTop'
import { cms } from '@/api/admin/index'

export default {
  name: 'Cms',
  components: { BackToTop },
  data() {
    return {
      height: 680,
      loading: false,
      count: {
        category: '-',
        content: '-',
        hits: '-'
      },
      cardBodyStyle: {
        padding: '10px 0px 0px 0px'
      }
    }
  },
  computed: {},
  created() {
    this.height = screenHeight(180)
    this.cms()
  },
  mounted() {},
  methods: {
    cms() {
      this.loading = true
      cms().then(res => {
        this.count = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.box-card {
  text-align: center;
}
.box-card .text {
  color: #666;
  font-size: 20px;
  line-height: 32px;
  font-weight: 700;
  text-align: center;
}
.el-row {
  margin-bottom: 10px;
}
.color-tot {
  color: #1890ff;
}
</style>
