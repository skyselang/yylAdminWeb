<template>
  <div class="app-container">
    <!-- 查询操作 -->
    <div class="filter-container">
      <!-- 查询 -->
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="查询字段">
            <el-option :value="idkey" label="ID" />
            <el-option value="unique" label="标识" />
            <el-option value="name" label="名称" />
            <el-option value="category_ids" label="分类" />
            <el-option value="tag_ids" label="标签" />
            <el-option value="is_top" label="置顶" />
            <el-option value="is_hot" label="热门" />
            <el-option value="is_rec" label="推荐" />
            <el-option value="is_disable" label="禁用" />
            <el-option value="title" label="标题" />
            <el-option value="keywords" label="关键词" />
            <el-option value="description" label="描述" />
            <el-option value="remark" label="备注" />
          </el-select>
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
          <el-cascader
            v-if="query.search_field === 'category_ids'"
            v-model="query.search_value"
            class="filter-item ya-search-value"
            :options="categoryData"
            :props="categoryProps"
            clearable
            filterable
            collapse-tags
          />
          <el-select v-else-if="query.search_field === 'tag_ids'" v-model="query.search_value" class="filter-item ya-search-value" clearable filterable multiple collapse-tags>
            <el-option v-for="item in tagData" :key="item.tag_id" :label="item.tag_name" :value="item.tag_id" />
          </el-select>
          <el-select
            v-else-if="query.search_field === 'is_top' || query.search_field === 'is_hot' || query.search_field === 'is_rec' || query.search_field === 'is_disable'"
            v-model="query.search_value"
            class="filter-item ya-search-value"
          >
            <el-option :value="1" label="是" />
            <el-option :value="0" label="否" />
          </el-select>
          <el-input v-else v-model="query.search_value" class="filter-item ya-search-value" placeholder="查询内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
            <el-option value="release_time" label="发布时间" />
          </el-select>
          <el-date-picker v-model="query.date_value" type="datetimerange" class="filter-item ya-date-value" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00','23:59:59']" value-format="yyyy-MM-dd HH:mm:ss" />
          <el-button class="filter-item" type="primary" title="查询/刷新" @click="search()">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" title="重置" @click="refresh()" />
        </el-col>
      </el-row>
      <!-- 选中操作 -->
      <el-row>
        <el-col>
          <el-button title="发布时间" @click="selectOpen('release')">发布时间</el-button>
          <el-button title="修改分类" @click="selectOpen('editcate')">分类</el-button>
          <el-button title="修改标签" @click="selectOpen('edittag')">标签</el-button>
          <el-button title="是否置顶" @click="selectOpen('istop')">置顶</el-button>
          <el-button title="是否热门" @click="selectOpen('ishot')">热门</el-button>
          <el-button title="是否推荐" @click="selectOpen('isrec')">推荐</el-button>
          <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
          <el-button title="删除" @click="selectOpen('dele')">删除</el-button>
          <el-button type="primary" @click="add()">添加</el-button>
        </el-col>
      </el-row>
      <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form ref="selectRef" label-width="120px">
          <el-form-item :label="name + 'ID'" prop="">
            <el-input v-model="selectIds" type="textarea" :autosize="{ minRows: 5, maxRows: 12 }" disabled />
          </el-form-item>
          <el-form-item v-if="selectType === 'editcate'" label="分类" prop="">
            <el-cascader v-model="category_ids" :options="categoryData" :props="categoryProps" class="ya-width-100p" clearable filterable />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'edittag'" label="标签" prop="">
            <el-select v-model="tag_ids" multiple clearable filterable class="ya-width-100p">
              <el-option v-for="item in tagData" :key="item.tag_id" :label="item.tag_name" :value="item.tag_id" />
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="selectType === 'istop'" label="是否置顶" prop="">
            <el-switch v-model="is_top" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'ishot'" label="是否热门" prop="">
            <el-switch v-model="is_hot" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'isrec'" label="是否推荐" prop="">
            <el-switch v-model="is_rec" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'disable'" label="是否禁用" prop="">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'release'" label="发布时间" prop="">
            <el-date-picker v-model="release_time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'dele'" label="" prop="">
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
    <el-table ref="table" v-loading="loading" :data="data" :height="height" @sort-change="sort" @selection-change="select">
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
      <el-table-column prop="unique" label="标识" min-width="80" show-overflow-tooltip />
      <el-table-column prop="image_url" label="图片" min-width="60" show-overflow-tooltip>
        <template slot-scope="scope">
          <div style="height:30px">
            <el-image
              v-if="scope.row.image_url"
              style="height:30px"
              fit="contain"
              :src="scope.row.image_url"
              :preview-src-list="[scope.row.image_url]"
              title="点击看大图"
              lazy
              scroll-container=".el-table__body-wrapper"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="category_names" label="分类" min-width="120" show-overflow-tooltip />
      <el-table-column prop="tag_names" label="标签" min-width="120" show-overflow-tooltip />
      <el-table-column prop="is_top" label="置顶" min-width="72" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_top" :active-value="1" :inactive-value="0" @change="istop([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_hot" label="热门" min-width="72" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_hot" :active-value="1" :inactive-value="0" @change="ishot([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_rec" label="推荐" min-width="72" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_rec" :active-value="1" :inactive-value="0" @change="isrec([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="is_disable" label="禁用" min-width="72" sortable="custom">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
        </template>
      </el-table-column>
      <el-table-column prop="hits" label="点击" min-width="72" show-overflow-tooltip sortable="custom" />
      <el-table-column prop="create_time" label="添加时间" width="155" sortable="custom" />
      <el-table-column prop="update_time" label="修改时间" width="155" sortable="custom" />
      <el-table-column prop="release_time" label="发布时间" width="155" sortable="custom" />
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button size="mini" type="text" title="信息/修改" @click="edit(scope.row)">修改</el-button>
          <el-button size="mini" type="text" @click="selectOpen('dele', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 添加修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{ height: height + 'px' }">
        <el-form-item label="标识" prop="unique">
          <el-input v-model="model.unique" placeholder="请输入标识（唯一）" clearable />
        </el-form-item>
        <el-form-item label="图片" prop="image_id">
          <el-col :span="12" style="height:100px">
            <el-image v-if="model.image_url" style="height:100px" fit="contain" :src="model.image_url" :preview-src-list="[model.image_url]" title="点击看大图">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-col>
          <el-col :span="12">
            <el-button size="mini" @click="fileUpload('image', 'image_id', '上传图片')">上传图片</el-button>
            <el-button size="mini" @click="fileDelete(0, 'image_id')">删除</el-button>
            <p>图片小于 200 KB，jpg、png格式。</p>
          </el-col>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="model.name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="分类" prop="category_ids">
          <el-cascader v-model="model.category_ids" :options="categoryData" :props="categoryProps" class="ya-width-100p" clearable filterable />
        </el-form-item>
        <el-form-item label="标签" prop="tag_ids">
          <el-select v-model="model.tag_ids" class="ya-width-100p" multiple clearable filterable>
            <el-option v-for="item in tagData" :key="item.tag_id" :label="item.tag_name" :value="item.tag_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="model.title" placeholder="title" clearable />
        </el-form-item>
        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="model.keywords" placeholder="keywords" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="model.description" type="textarea" autosize placeholder="description" clearable />
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-input v-model="model.source" placeholder="source" clearable />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="model.author" placeholder="author" clearable />
        </el-form-item>
        <el-form-item label="链接" prop="url">
          <el-input v-model="model.url" placeholder="url" clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="model.remark" placeholder="remark" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="model.sort" type="number" placeholder="sort" clearable />
        </el-form-item>
        <el-form-item label="初始点击" prop="hits_initial">
          <el-col :span="6">
            <el-input v-model="model.hits_initial" type="number" placeholder="初始点击量" clearable />
          </el-col>
          <el-col :span="3" class="ya-center">
            真实点击
          </el-col>
          <el-col :span="6">
            <el-input v-model="model.hits" type="number" placeholder="真实点击量" disabled />
          </el-col>
          <el-col :span="3" class="ya-center">
            展示点击
          </el-col>
          <el-col :span="6">
            <el-input :value="parseFloat(model.hits_initial) + parseFloat(model.hits)" type="number" placeholder="初始点击量" disabled />
          </el-col>
        </el-form-item>
        <el-form-item label="图片列表" prop="images">
          <el-row>
            <el-col :span="12">
              <el-button size="mini" @click="fileUpload('image', 'images', '上传图片')">上传图片</el-button>
            </el-col>
            <el-col :span="12">
              <span><el-button size="mini" @click="fileDelete('all', 'images')">全部删除</el-button>图片文件</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-for="(item, index) in model.images" :key="index" :span="6" class="ya-file">
              <el-image style="height:100px" fit="contain" :src="item.file_url" :preview-src-list="[item.file_url]" title="点击看大图" />
              <div>
                <span class="ya-file-name" :title="item.file_name + '.' + item.file_ext">{{ item.file_name }}.{{ item.file_ext }}</span>
                <el-button type="text" size="medium" icon="el-icon-d-arrow-left" title="向左移动" @click="fileRemoval(index, 'images', 'left')" />
                <el-button type="text" size="medium" icon="el-icon-d-arrow-right" title="向左移动" @click="fileRemoval(index, 'images', 'right')" />
                <el-button type="text" size="medium" icon="el-icon-download" title="下载" @click="fileDownload(item, $event)" />
                <el-button type="text" size="medium" icon="el-icon-delete" title="删除" @click="fileDelete(index, 'images')" />
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="视频列表" prop="videos">
          <el-row>
            <el-col :span="12">
              <el-button size="mini" @click="fileUpload('video', 'videos', '上传视频')">上传视频</el-button>
            </el-col>
            <el-col :span="12">
              <span><el-button size="mini" @click="fileDelete('all', 'videos')">全部删除</el-button>视频文件</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-for="(item, index) in model.videos" :key="index" :span="6" class="ya-file">
              <div :style="{ width: '100%', height: ((height - height * 0.1) / 3) - ((height - height * 0.1) / 3 * 0.5) + 'px' }">
                <video height="100%" controls>
                  <source :src="item.file_url" type="video/mp4">
                  <object :data="item.file_url" height="100%">
                    <embed :src="item.file_url" height="100%">
                  </object>
                </video>
              </div>
              <div>
                <span class="ya-file-name" :title="item.file_name + '.' + item.file_ext">{{ item.file_name }}.{{ item.file_ext }}</span>
                <el-button type="text" size="medium" icon="el-icon-d-arrow-left" title="向左移动" @click="fileRemoval(index, 'videos', 'left')" />
                <el-button type="text" size="medium" icon="el-icon-d-arrow-right" title="向左移动" @click="fileRemoval(index, 'videos', 'right')" />
                <el-button type="text" size="medium" icon="el-icon-download" title="下载" @click="fileDownload(item, $event)" />
                <el-button type="text" size="medium" icon="el-icon-delete" title="删除" @click="fileDelete(index, 'videos')" />
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="音频列表" prop="audios">
          <el-row>
            <el-col :span="12">
              <el-button size="mini" @click="fileUpload('audio', 'audios', '上传音频')">上传音频</el-button>
            </el-col>
            <el-col :span="12">
              <span><el-button size="mini" @click="fileDelete('all', 'audios')">全部删除</el-button>音频文件</span>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in model.audios" :key="index">
            <el-col :span="19" class="ya-file-name-audio">
              <i class="el-icon-headset" />
              <audio style="vertical-align: middle;" height="100%" controls>
                <source :src="item.file_url" type="audio/mp3">
                <embed :src="item.file_url" height="100%">
              </audio>
              <span style="margin-left:5px" :title="item.file_name + '.' + item.file_ext">{{ item.file_name }}.{{ item.file_ext }}</span>
            </el-col>
            <el-col :span="5" class="ya-file-name-audio">
              <el-button type="text" size="medium" icon="el-icon-top" title="向上移动" @click="fileRemoval(index, 'audios', 'left')" />
              <el-button type="text" size="medium" icon="el-icon-bottom" title="向下移动" @click="fileRemoval(index, 'audios', 'right')" />
              <el-button type="text" size="medium" icon="el-icon-download" title="下载" @click="fileDownload(item, $event)" />
              <el-button type="text" size="medium" icon="el-icon-delete" title="删除" @click="fileDelete(index, 'audios')" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="文档列表" prop="words">
          <el-row>
            <el-col :span="12">
              <el-button size="mini" @click="fileUpload('word', 'words', '上传文档')">上传文档</el-button>
            </el-col>
            <el-col :span="12">
              <span><el-button size="mini" @click="fileDelete('all', 'words')">全部删除</el-button>文档文件</span>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in model.words" :key="index">
            <el-col :span="19" class="ya-file-name">
              <i class="el-icon-document" />
              <span style="margin-left:5px" :title="item.file_name + '.' + item.file_ext">{{ item.file_name }}.{{ item.file_ext }}</span>
            </el-col>
            <el-col :span="5">
              <el-button type="text" size="medium" icon="el-icon-top" title="向上移动" @click="fileRemoval(index, 'words', 'left')" />
              <el-button type="text" size="medium" icon="el-icon-bottom" title="向下移动" @click="fileRemoval(index, 'words', 'right')" />
              <el-button type="text" size="medium" icon="el-icon-download" title="下载" @click="fileDownload(item, $event)" />
              <el-button type="text" size="medium" icon="el-icon-delete" title="删除" @click="fileDelete(index, 'words')" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="其它列表" prop="others">
          <el-row>
            <el-col :span="12">
              <el-button size="mini" @click="fileUpload('other', 'others', '上传其它')">上传其它</el-button>
            </el-col>
            <el-col :span="12">
              <span><el-button size="mini" @click="fileDelete('all', 'others')">全部删除</el-button>其它文件</span>
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in model.others" :key="index">
            <el-col :span="19" class="ya-file-name">
              <i v-if="item.file_type === 'image'" class="el-icon-picture" />
              <i v-else-if="item.file_type === 'audio'" class="el-icon-headset" />
              <i v-else-if="item.file_type === 'video'" class="el-icon-video-play" />
              <i v-else-if="item.file_type === 'word'" class="el-icon-document" />
              <i v-else class="el-icon-folder" />
              <span style="margin-left:5px" :title="item.file_name + '.' + item.file_ext">{{ item.file_name }}.{{ item.file_ext }}</span>
            </el-col>
            <el-col :span="5">
              <el-button type="text" size="medium" icon="el-icon-top" title="向上移动" @click="fileRemoval(index, 'others', 'left')" />
              <el-button type="text" size="medium" icon="el-icon-bottom" title="向下移动" @click="fileRemoval(index, 'others', 'right')" />
              <el-button type="text" size="medium" icon="el-icon-download" title="下载" @click="fileDownload(item, $event)" />
              <el-button type="text" size="medium" icon="el-icon-delete" title="删除" @click="fileDelete(index, 'others')" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <rich-editor v-model="model.content" />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
          <el-input v-model="model.delete_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 文件管理 -->
    <el-dialog :title="fileTitle" :visible.sync="fileDialog" width="80%" top="1vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <file-manage :file-type="fileType" @fileCancel="fileCancel" @fileSubmit="fileSubmit" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import FileManage from '@/components/FileManage'
import RichEditor from '@/components/RichEditor'
import clip from '@/utils/clipboard'
import { arrayColumn } from '@/utils/index'
import { list, info, add, edit, dele, editcate, edittag, istop, ishot, isrec, disable, release } from '@/api/content/content'

export default {
  name: 'ContentContent',
  components: { Pagination, FileManage, RichEditor },
  directives: {},
  data() {
    return {
      name: '内容',
      height: 680,
      loading: false,
      idkey: 'content_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: { page: 1, limit: 12, search_field: 'name', search_exp: 'like', date_field: 'create_time' },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        content_id: '',
        unique: '',
        category_ids: [],
        tag_ids: [],
        image_id: 0,
        image_url: '',
        name: '',
        title: '',
        keywords: '',
        description: '',
        content: '',
        source: '',
        author: '',
        url: '',
        remark: '',
        sort: 250,
        hits: 0,
        hits_initial: 0,
        images: [],
        videos: [],
        audios: [],
        words: [],
        others: []
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      tagData: [],
      categoryData: [],
      categoryProps: { checkStrictly: true, value: 'category_id', label: 'category_name', multiple: true, emitPath: false },
      selection: [],
      selectIds: '',
      selectTitle: '选中操作',
      selectDialog: false,
      selectType: '',
      category_ids: [],
      tag_ids: [],
      is_top: 0,
      is_hot: 0,
      is_rec: 0,
      is_disable: 0,
      release_time: '',
      fileDialog: false,
      fileTitle: '文件管理',
      fileType: 'image',
      fileField: ''
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
      list(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.categoryData = res.data.category
        this.tagData = res.data.tag
        this.exps = res.data.exps
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加修改
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row[this.idkey]
      var id = {}
      id[this.idkey] = row[this.idkey]
      info(id).then(res => {
        this.reset(res.data)
      }).catch(() => { })
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          if (this.model[this.idkey]) {
            edit(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => { })
          } else {
            add(this.model).then(res => {
              this.list()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => { })
          }
        } else {
          this.$message.error('请完善必填项*')
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
        this.$refs['ref'].clearValidate()
      }
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 刷新
    refresh() {
      const limit = this.query.limit
      this.query = this.$options.data().query
      this.$refs['table'].clearSort()
      this.query.limit = limit
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
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => { } })
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
        if (selectType === 'editcate') {
          this.selectTitle = this.name + '修改分类'
        } else if (selectType === 'edittag') {
          this.selectTitle = this.name + '修改标签'
        } else if (selectType === 'istop') {
          this.selectTitle = this.name + '是否置顶'
        } else if (selectType === 'ishot') {
          this.selectTitle = this.name + '是否热门'
        } else if (selectType === 'isrec') {
          this.selectTitle = this.name + '是否推荐'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '是否禁用'
        } else if (selectType === 'release') {
          this.selectTitle = this.name + '发布时间'
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
        if (selectType === 'editcate') {
          this.editcate(this.selection)
        } else if (selectType === 'edittag') {
          this.edittag(this.selection)
        } else if (selectType === 'istop') {
          this.istop(this.selection, true)
        } else if (selectType === 'ishot') {
          this.ishot(this.selection, true)
        } else if (selectType === 'isrec') {
          this.isrec(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'release') {
          this.release(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 修改分类
    editcate(row) {
      editcate({
        ids: this.selectGetIds(row),
        category_ids: this.category_ids
      }).then(res => {
        this.list()
        this.$message.success(res.msg)
      }).catch(() => {
        this.loading = false
      })
    },
    // 修改标签
    edittag(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        edittag({
          ids: this.selectGetIds(row),
          tag_ids: this.tag_ids
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 是否置顶
    istop(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_top = row[0].is_top
        if (select) {
          is_top = this.is_top
        }
        istop({
          ids: this.selectGetIds(row),
          is_top: is_top
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
        })
      }
    },
    // 是否热门
    ishot(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_hot = row[0].is_hot
        if (select) {
          is_hot = this.is_hot
        }
        ishot({
          ids: this.selectGetIds(row),
          is_hot: is_hot
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
        })
      }
    },
    // 是否推荐
    isrec(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_rec = row[0].is_rec
        if (select) {
          is_rec = this.is_rec
        }
        isrec({
          ids: this.selectGetIds(row),
          is_rec: is_rec
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
        })
      }
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
        disable({
          ids: this.selectGetIds(row),
          is_disable: is_disable
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
        })
      }
    },
    // 发布时间
    release(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        release({
          ids: this.selectGetIds(row),
          release_time: this.release_time
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
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
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 上传文件
    fileUpload(fileType, fileField = '', fileTitle = '文件管理') {
      this.fileType = fileType
      this.fileField = fileField
      this.fileTitle = fileTitle
      this.fileDialog = true
    },
    fileCancel() {
      this.fileType = 'image'
      this.fileField = ''
      this.fileTitle = '文件管理'
      this.fileDialog = false
    },
    fileSubmit(fileList) {
      this.fileDialog = false
      const fileField = this.fileField
      const fileLength = fileList.length
      if (fileLength) {
        if (fileField === 'image_id') {
          const i = fileLength - 1
          this.model.image_id = fileList[i]['file_id']
          this.model.image_url = fileList[i]['file_url']
        } else {
          for (let i = 0; i < fileLength; i++) {
            if (fileField === 'images') {
              this.model.images.push(fileList[i])
            } else if (fileField === 'videos') {
              this.model.videos.push(fileList[i])
            } else if (fileField === 'audios') {
              this.model.audios.push(fileList[i])
            } else if (fileField === 'words') {
              this.model.words.push(fileList[i])
            } else if (fileField === 'others') {
              this.model.others.push(fileList[i])
            }
          }
        }
      }
    },
    fileRemoval(index, field, direction) {
      const length = this.model[field].length
      var index1 = index
      if (direction === 'left') {
        if (index <= 0) {
          return false
        }
        --index1
      } else {
        if (index >= (length - 1)) {
          return false
        }
        ++index1
      }
      const value = this.model[field][index]
      const value1 = this.model[field][index1]
      this.model[field][index] = value1
      this.model[field][index1] = value
      this.$forceUpdate()
    },
    fileDownload(file, event) {
      clip(file.file_name, event, '文件名复制成功')
      setTimeout(() => { window.open(file.file_url, '_blank') }, 500)
    },
    fileDelete(index, field = '') {
      if (field === 'image_id') {
        this.model.image_id = 0
        this.model.image_url = ''
      } else if (field === 'images') {
        if (index === 'all') {
          this.model.images = []
        } else {
          this.model.images.splice(index, 1)
        }
      } else if (field === 'videos') {
        if (index === 'all') {
          this.model.videos = []
        } else {
          this.model.videos.splice(index, 1)
        }
      } else if (field === 'audios') {
        if (index === 'all') {
          this.model.audios = []
        } else {
          this.model.audios.splice(index, 1)
        }
      } else if (field === 'words') {
        if (index === 'all') {
          this.model.words = []
        } else {
          this.model.words.splice(index, 1)
        }
      } else if (field === 'others') {
        if (index === 'all') {
          this.model.others = []
        } else {
          this.model.others.splice(index, 1)
        }
      }
    }
  }
}
</script>

<style scoped>
.ya-file {
  text-align: center;
  border: 1px solid #dcdfe6;
}
.ya-file-name {
  display: block;
  height: 24px;
  line-height: 24px;
  padding: 0 4px;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ya-file-name-audio {
  display: block;
  height: 55px;
  line-height: 55px;
  padding: 0 4px;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ya-file-link {
  margin-right: 6px;
}
</style>
