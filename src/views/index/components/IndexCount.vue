<template>
  <el-row :gutter="10" style="padding: 15px 15px 0 15px;">
    <el-col v-for="(item, index) in data" :key="index" :xs="24" :sm="4">
      <el-card class="card" :body-style="cardBodyStyle">
        <div slot="header" class="clearfix">
          <span>{{ item.name }}</span>
        </div>
        <div class="card-text">
          {{ item.count }}
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { count } from '@/api/index'

export default {
  name: 'IndexCount',
  components: { },
  data() {
    return {
      name: '总数统计',
      loading: false,
      data: [],
      cardBodyStyle: {
        padding: '10px 0px 5px 0px'
      }
    }
  },
  computed: {},
  created() {
    this.count()
  },
  mounted() {},
  methods: {
    count() {
      this.loading = true
      count().then(res => {
        this.data = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.card {
  text-align: center;
}
.card-text {
  color: #666;
  font-size: 20px;
  line-height: 32px;
  font-weight: 700;
  text-align: center;
}
</style>
