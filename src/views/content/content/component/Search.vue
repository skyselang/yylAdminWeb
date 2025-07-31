<template>
  <el-row class="mb-2">
    <el-col :span="3">
      <el-select v-model="query.search[0].field" :placeholder="$t('查询字段')">
        <el-option v-for="field in fields" :key="field.field" :value="field.field" :label="field.name" />
      </el-select>
    </el-col>
    <el-col :span="3">
      <el-select v-model="query.search[0].exp" :placeholder="$t('查询方式')">
        <el-option v-for="exp in basedata.exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
      </el-select>
    </el-col>
    <el-col :span="6">
      <SearchValue v-model="query.search[0]" :basedata="basedata" />
    </el-col>
    <el-col :span="6">
      <el-button :title="$t('更多条件')" :type="query.search.length > 1 ? 'primary' : ''" text @click="searchMore()">
        {{ $t('更多') }}
      </el-button>
      <el-button :title="$t('查询刷新')" type="primary" class="ml-0!" @click="search()">
        {{ $t('查询') }}
      </el-button>
      <el-button :title="$t('重置查询')" @click="reset()">{{ $t('重置') }}</el-button>
    </el-col>
  </el-row>

  <el-dialog
    v-model="dialog"
    :title="$t('更多条件查询', { name: name })"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
    draggable
    center
    align-center
  >
    <el-row class="mb-2">
      <el-col :span="4">
        <el-button text>{{ $t('匹配模式') }}：</el-button>
      </el-col>
      <el-col :span="6">
        <el-select v-model="query.search_mode">
          <el-option value="and" :label="$t('所有条件匹配')" />
          <el-option value="or" :label="$t('任一条件匹配')" />
        </el-select>
      </el-col>
      <el-col :span="2" :offset="4">
        <el-button class="ml-3" :title="$t('新增一行')" type="primary" @click="searchAdd()">
          {{ $t('新增') }}
        </el-button>
      </el-col>
      <el-col :span="4" :offset="4">
        <el-button class="ml-3" :title="$t('全部删除')" @click="searchDele(-1)">{{ $t('全删') }}</el-button>
      </el-col>
    </el-row>
    <el-scrollbar :height="height">
      <el-row v-for="(item, index) in query.search" :key="index" class="mb-2">
        <el-col :span="2">
          <el-button text>{{ index + 1 }}：</el-button>
        </el-col>
        <el-col :span="5">
          <el-select v-model="item.field" :placeholder="$t('查询字段')">
            <el-option v-for="field in fields" :key="field.field" :value="field.field" :label="field.name" />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select v-model="item.exp" :placeholder="$t('查询方式')">
            <el-option v-for="exp in basedata.exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <SearchValue v-model="query.search[index]" :basedata="basedata" />
        </el-col>
        <el-col :span="4">
          <el-button v-if="index > 0" class="ml-3" @click="searchDele(index)">{{ $t('删除') }}</el-button>
        </el-col>
      </el-row>
    </el-scrollbar>
    <template #footer>
      <el-button :loading="loading" @click="searchCancel">{{ $t('关闭') }}</el-button>
      <el-button :loading="loading" type="primary" @click="searchSubmit">{{ $t('查询') }}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { screenHeight, getPageLimit } from '@/utils/index'
import SearchValue from './SearchValue.vue'

export default {
  components: { SearchValue },
  props: {
    name: {
      type: String,
      default: ''
    },
    idkey: {
      type: String,
      default: ''
    },
    basedata: {
      type: Object,
      default() {
        return { categorys: [], categoryProps: [], tags: [] }
      }
    }
  },
  emits: ['search', 'reset'],
  data() {
    return {
      height: 600,
      loading: false,
      dialog: false,
      query: {
        page: 1,
        limit: getPageLimit(),
        search_mode: 'and',
        search: [{ field: 'name', exp: 'like', value: '' }]
      },
      fields: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.search()
      this.searchField()
      this.height = screenHeight(500)
    },
    reset() {
      const limit = this.query.limit
      this.query = this.$options.data().query
      this.query.limit = limit
      this.$emit('reset', this.query)
    },
    search() {
      this.query.page = 1
      this.$emit('search', this.query)
    },
    searchMore() {
      this.dialog = true
    },
    searchField() {
      this.fields = [
        { field: this.idkey, name: 'ID', exp: '=' },
        { field: 'unique', name: this.$t('编号'), exp: '=' },
        { field: 'name', name: this.$t('名称'), exp: 'like' },
        { field: 'category_ids', name: this.$t('分类'), exp: 'in' },
        { field: 'tag_ids', name: this.$t('标签'), exp: 'in' },
        { field: 'title', name: this.$t('标题'), exp: 'like' },
        { field: 'keywords', name: this.$t('关键词'), exp: 'like' },
        { field: 'description', name: this.$t('描述'), exp: 'like' },
        { field: 'is_top', name: this.$t('置顶'), exp: '=' },
        { field: 'is_hot', name: this.$t('热门'), exp: '=' },
        { field: 'is_rec', name: this.$t('推荐'), exp: '=' },
        { field: 'release_time', name: this.$t('发布时间'), exp: '>=' },
        { field: 'sort', name: this.$t('排序'), exp: 'between' },
        { field: 'is_disable', name: this.$t('禁用'), exp: '=' },
        { field: 'create_time', name: this.$t('添加时间'), exp: '>=' },
        { field: 'update_time', name: this.$t('修改时间'), exp: '>=' }
      ]
    },
    searchAdd() {
      const fields_length = this.fields.length
      const search_length = this.query.search.length
      let field = ''
      let exp = ''
      if (search_length <= fields_length) {
        field = this.fields[search_length - 1].field ?? ''
        exp = this.fields[search_length - 1].exp ?? 'like'
      }
      this.query.search.push({ field: field, exp: exp, value: '' })
    },
    searchDele(index) {
      if (index === -1) {
        this.query.search = this.$options.data().query.search
      } else {
        this.query.search.splice(index, 1)
      }
    },
    searchCancel() {
      this.dialog = false
    },
    searchSubmit() {
      this.dialog = false
      this.search()
    }
  }
}
</script>
