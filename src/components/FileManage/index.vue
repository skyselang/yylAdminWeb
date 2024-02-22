<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-row>
      <el-col class="mb-2">
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="搜索字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="unique" label="标识" />
          <el-option value="file_name" label="名称" />
          <el-option value="domain" label="域名" />
          <el-option value="remark" label="备注" />
          <el-option value="file_ext" label="后缀" />
          <el-option value="file_path" label="路径" />
          <el-option value="file_md5" label="MD5" />
          <el-option value="file_hash" label="散列" />
        </el-select>
        <el-select v-model="query.search_exp" class="ya-search-exp">
          <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
        </el-select>
        <el-input
          v-model="query.search_value"
          class="ya-search-value"
          placeholder="搜索内容"
          clearable
        />
        <el-select v-model="query.date_field" class="ya-date-field" placeholder="时间类型">
          <el-option value="create_time" label="添加时间" />
          <el-option value="update_time" label="修改时间" />
          <el-option v-if="recycle" value="delete_time" label="删除时间" />
        </el-select>
        <el-date-picker
          v-model="query.date_value"
          type="datetimerange"
          class="ya-date-value"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
          :default-time="[[new Date(2024, 1, 1, 0, 0, 0), new Date(2024, 1, 1, 23, 59, 59)]]"
        />
        <el-button type="primary" @click="search()">查询</el-button>
        <el-button title="重置" @click="refresh()">
          <svg-icon icon-class="refresh" />
        </el-button>
        <el-upload
          name="file"
          class="inline-block ml-[12px]"
          v-model:file-list="uploadFilelist"
          :limit="uploadLimit"
          :multiple="true"
          :show-file-list="false"
          :auto-upload="true"
          :action="uploadAction"
          :headers="uploadHeaders"
          :data="uploadData"
          :accept="uploadAccept"
          :before-upload="uploadBefore"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :on-change="uploadChange"
          :on-exceed="uploadExceed"
        >
          <el-button type="primary" title="上传文件" @click="uploadClear">上传</el-button>
        </el-upload>
        <el-button class="ml-[12px]" title="添加文件" @click="add()">添加</el-button>
        <el-button
          v-if="checkPermission(['admin/file.File/recycle'])"
          class="float-right"
          :type="recycle ? 'primary' : 'default'"
          @click="showRecycle"
        >
          回收站
        </el-button>
        <el-radio-group v-model="showMode" class="float-right" @change="showChange">
          <el-radio-button label="card">卡片</el-radio-button>
          <el-radio-button label="table">表格</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <!-- 操作 -->
    <el-row>
      <el-col>
        <el-checkbox
          border
          v-model="selectAll"
          class="!mr-[10px] top-[3px]"
          :indeterminate="selectAllInd"
          @change="selectAlls"
        >
          全选
        </el-checkbox>
        <el-button title="删除文件" @click="selectOpen('dele')">删除</el-button>
        <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
        <el-button title="修改分组" @click="selectOpen('editgroup')">分组</el-button>
        <el-button title="修改标签" @click="selectOpen('edittag')">标签</el-button>
        <el-button title="修改类型" @click="selectOpen('edittype')">类型</el-button>
        <el-button title="修改域名" @click="selectOpen('editdomain')">域名</el-button>
        <!-- 排序 -->
        <el-select
          v-model="query.sort_field"
          class="ya-search-field ya-margin-left"
          filterable
          clearable
          placeholder="排序字段"
          @change="sort"
        >
          <el-option :value="idkey" label="ID" />
          <el-option value="file_name" label="名称" />
          <el-option value="file_md5" label="MD5" />
          <el-option value="file_hash" label="散列" />
          <el-option value="file_ext" label="后缀" />
          <el-option value="file_size" label="大小" />
          <el-option value="is_disable" label="禁用" />
          <el-option value="sort" label="排序" />
          <el-option value="create_time" label="添加时间" />
          <el-option value="update_time" label="修改时间" />
          <el-option v-if="recycle" value="delete_time" label="删除时间" />
        </el-select>
        <el-select
          v-model="query.sort_value"
          class="ya-search-field"
          filterable
          clearable
          placeholder="排序类型"
          @change="sort"
        >
          <el-option value="asc" label="升序" />
          <el-option value="desc" label="降序" />
        </el-select>
        <!-- 分组筛选 -->
        <el-select
          v-model="query.group_id"
          class="ya-select-field ya-margin-left"
          filterable
          clearable
          placeholder="分组"
          @change="groupSelect"
        >
          <el-option
            v-for="(item, index) in groupData"
            :key="index"
            :value="item.group_id"
            :label="item.group_name"
          />
        </el-select>
        <el-tooltip :content="'添加' + groupName" effect="light">
          <svg-icon icon-class="plus" @click="groupAdd()" />
        </el-tooltip>
        <el-tooltip :content="'修改' + groupName" effect="light">
          <svg-icon icon-class="edit" @click="groupEdit()" />
        </el-tooltip>
        <el-tooltip :content="'删除' + groupName" effect="light">
          <svg-icon icon-class="delete" @click="groupDele()" />
        </el-tooltip>
        <!-- 标签筛选 -->
        <el-select
          v-model="query.tag_ids"
          class="ya-select-field ya-margin-left"
          filterable
          clearable
          multiple
          collapse-tags
          placeholder="标签"
          @change="tagSelect"
        >
          <el-option
            v-for="(item, index) in tagData"
            :key="index"
            :value="item.tag_id"
            :label="item.tag_name"
          />
        </el-select>
        <el-tooltip :content="'添加' + tagName" effect="light">
          <svg-icon icon-class="plus" @click="tagAdd()" />
        </el-tooltip>
        <el-tooltip :content="'修改' + tagName" effect="light">
          <svg-icon icon-class="edit" @click="tagEdit()" />
        </el-tooltip>
        <el-tooltip :content="'删除' + tagName" effect="light">
          <svg-icon icon-class="delete" @click="tagDele()" />
        </el-tooltip>
        <el-button v-if="recycle" type="primary" class="float-right" @click="selectOpen('reco')">
          恢复
        </el-button>
      </el-col>
    </el-row>
    <el-dialog
      v-model="selectDialog"
      :title="selectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
      append-to-body
    >
      <el-form label-width="120px">
        <el-form-item v-if="selectType === 'editgroup'" label="文件分组">
          <el-select v-model="group_id" clearable>
            <el-option
              v-for="(item, index) in groupData"
              :key="index"
              :value="item.group_id"
              :label="item.group_name"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'edittag'" label="文件标签">
          <el-select v-model="tag_ids" class="w-full" multiple clearable filterable>
            <el-option
              v-for="item in tagData"
              :key="item.tag_id"
              :label="item.tag_name"
              :value="item.tag_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'edittype'" label="文件类型" prop="file_type">
          <el-select v-model="file_type">
            <el-option
              v-for="(item, index) in file_types"
              :key="index"
              :value="index"
              :label="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'editdomain'" label="文件域名">
          <el-input v-model="domain" clearable />
          <span class="ya-margin-left">修改文件域名会影响文件的访问，请确认无误后修改！</span>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'disable'" label="是否禁用">
          <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          <span v-if="is_disable" class="ya-margin-left c-red">
            禁用会对已使用该文件的业务造成影响！
          </span>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'dele'">
          <span v-if="recycle" class="ya-margin-left c-red">
            确定要彻底删除选中的{{ name }}吗？删除后不可恢复！
          </span>
          <span v-else class="ya-margin-left c-red">
            确定要删除选中的{{ name }}吗？删除会对已使用该文件的业务造成影响！
          </span>
        </el-form-item>
        <el-form-item v-else-if="selectType === 'reco'">
          <span class="ya-margin-left">确定要恢复选中的{{ name }}吗？</span>
        </el-form-item>
        <el-form-item :label="name + 'ID'">
          <el-input v-model="selectIds" type="textarea" autosize disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="selectCancel">取消</el-button>
        <el-button type="primary" @click="selectSubmit">提交</el-button>
      </template>
    </el-dialog>
    <!-- 分组管理 -->
    <el-dialog
      v-model="groupDialog"
      :title="groupTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="groupCancel"
      append-to-body
    >
      <el-form ref="groupRef" :rules="groupRules" :model="groupModel" label-width="100px">
        <el-form-item label="名称" prop="group_name">
          <el-input v-model="groupModel.group_name" placeholder="请输入分组名称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="group_desc">
          <el-input v-model="groupModel.group_desc" type="textarea" autosize />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="groupModel.remark" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="groupModel.sort" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="groupCancel">取消</el-button>
        <el-button type="primary" @click="groupSubmit">提交</el-button>
      </template>
    </el-dialog>
    <!-- 标签管理 -->
    <el-dialog
      v-model="tagDialog"
      :title="tagTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="tagCancel"
      append-to-body
    >
      <el-form ref="tagRef" :rules="tagRules" :model="tagModel" label-width="100px">
        <el-form-item label="名称" prop="tag_name">
          <el-input v-model="tagModel.tag_name" placeholder="请输入标签名称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="tag_desc">
          <el-input v-model="tagModel.tag_desc" type="textarea" autosize />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="tagModel.remark" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="tagModel.sort" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="tagCancel">取消</el-button>
        <el-button type="primary" @click="tagSubmit">提交</el-button>
      </template>
    </el-dialog>
    <!-- 列表筛选 -->
    <el-row :gutter="3">
      <!-- 筛选 -->
      <el-col :span="2">
        <el-scrollbar native :height="height">
          <!-- 类型筛选 -->
          <el-row>
            <el-col>
              <el-text size="default">类型：</el-text>
            </el-col>
            <el-col class="ya-padding-left">
              <el-link
                :type="query.file_type === '' ? 'primary' : 'default'"
                :underline="false"
                @click="typeSelect('')"
              >
                全部
              </el-link>
            </el-col>
            <el-col v-for="(item, index) in file_types" :key="index" class="ya-padding-left">
              <el-link
                :type="query.file_type === index ? 'primary' : 'default'"
                :underline="false"
                @click="typeSelect(index)"
              >
                {{ item }}
              </el-link>
            </el-col>
          </el-row>
          <!-- 禁用筛选 -->
          <el-row>
            <el-col>
              <el-text size="default">禁用：</el-text>
            </el-col>
            <el-col class="ya-padding-left">
              <el-link
                :type="query.is_disable === '' ? 'primary' : 'default'"
                :underline="false"
                @click="disableSelect('')"
              >
                全部
              </el-link>
            </el-col>
            <el-col class="ya-padding-left">
              <el-link
                :type="query.is_disable === 0 ? 'primary' : 'default'"
                :underline="false"
                @click="disableSelect(0)"
              >
                已启用
              </el-link>
            </el-col>
            <el-col class="ya-padding-left">
              <el-link
                :type="query.is_disable === 1 ? 'primary' : 'default'"
                :underline="false"
                @click="disableSelect(1)"
              >
                已禁用
              </el-link>
            </el-col>
          </el-row>
          <!-- 上传筛选 -->
          <el-row>
            <el-col>
              <el-text size="default">上传：</el-text>
            </el-col>
            <el-col class="ya-padding-left">
              <el-link
                :type="query.is_front === '' ? 'primary' : 'default'"
                :underline="false"
                @click="frontSelect('')"
              >
                全部
              </el-link>
            </el-col>
            <el-col class="ya-padding-left">
              <el-link
                :type="query.is_front === 0 ? 'primary' : 'default'"
                :underline="false"
                @click="frontSelect(0)"
              >
                后台
              </el-link>
            </el-col>
            <el-col class="ya-padding-left">
              <el-link
                :type="query.is_front === 1 ? 'primary' : 'default'"
                :underline="false"
                @click="frontSelect(1)"
              >
                前台
              </el-link>
            </el-col>
          </el-row>
          <!-- 存储筛选 -->
          <el-row>
            <el-col>
              <el-text size="default">存储：</el-text>
            </el-col>
            <el-col class="ya-padding-left">
              <el-link
                :type="query.storage === '' ? 'primary' : 'default'"
                :underline="false"
                @click="storageSelect('')"
              >
                全部
              </el-link>
            </el-col>
            <el-col v-for="(item, index) in storages" :key="index" class="ya-padding-left">
              <el-link
                :type="query.storage === index ? 'primary' : 'default'"
                :underline="false"
                @click="storageSelect(index)"
              >
                <el-text size="default" truncated>{{ item }}</el-text>
              </el-link>
            </el-col>
          </el-row>
        </el-scrollbar>
      </el-col>
      <!-- 卡片展示 -->
      <template v-if="showMode == 'card'">
        <el-checkbox-group
          v-model="selection"
          style="display: contents; line-height: 1.5"
          @change="select"
        >
          <el-col v-if="count > 0" :span="22">
            <el-scrollbar native :height="height">
              <el-row v-loading="loading" :gutter="3" class="mt-[6px] !mr-0 !ml-0">
                <el-col
                  v-for="(item, index) in data"
                  :key="index"
                  :span="4"
                  style="margin-bottom: 6px; text-align: center"
                >
                  <el-card
                    :body-style="{
                      minWidth: '16.0%',
                      height: (height - height * 0.1) / 3 + 'px',
                      minHeight: '180px',
                      padding: '0 6px'
                    }"
                  >
                    <div style="text-align: left">
                      <el-checkbox :key="item[idkey]" :label="item[idkey]">
                        {{ item[idkey] }} ({{ item.file_size }}, {{ item.file_ext }}
                      </el-checkbox>
                    </div>
                    <div
                      :style="{
                        width: '100%',
                        height:
                          (height - height * 0.1) / 3 - ((height - height * 0.1) / 3) * 0.5 + 'px',
                        minHeight: '62px'
                      }"
                    >
                      <el-image
                        v-if="item.file_type === 'image'"
                        style="height: 100%"
                        :src="item.file_url"
                        :preview-src-list="fileImgPre"
                        :initial-index="imagePreIndex(item.file_url)"
                        fit="contain"
                        title="点击看大图"
                        lazy
                      />
                      <video v-else-if="item.file_type === 'video'" height="100%" controls>
                        <source :src="item.file_url" type="video/mp4" />
                        <object :data="item.file_url" height="100%">
                          <embed :src="item.file_url" height="100%" />
                        </object>
                      </video>
                      <audio
                        v-else-if="item.file_type === 'audio'"
                        height="100%"
                        style="width: 100%"
                        controls
                      >
                        <source :src="item.file_url" type="audio/mp3" />
                        <embed :src="item.file_url" height="100%" />
                      </audio>
                      <div v-else-if="item.file_type === 'word'">
                        <svg-icon icon-class="document" size="50px" />
                      </div>
                      <div v-else>
                        <svg-icon icon-class="folder" size="50px" />
                      </div>
                    </div>
                    <div :style="{ paddingTop: '5px', minHeight: '50px' }">
                      <p>
                        <el-text
                          :title="item.file_name + '.' + item.file_ext"
                          size="default"
                          truncated
                        >
                          {{ item.file_name }}.{{ item.file_ext }}
                        </el-text>
                      </p>
                      <div>
                        <el-link
                          v-if="item.is_disable"
                          class="mr-1"
                          :underline="false"
                          title="已禁用"
                        >
                          <svg-icon icon-class="warning-filled" />
                        </el-link>
                        <el-link v-else class="mr-1" :underline="false" title="已启用">
                          <svg-icon icon-class="warning" />
                        </el-link>
                        <el-link
                          v-if="recycle"
                          type="primary"
                          class="mr-1"
                          :underline="false"
                          @click="selectOpen('reco', [item.file_id])"
                        >
                          恢复
                        </el-link>
                        <el-link
                          type="primary"
                          class="mr-1"
                          :underline="false"
                          @click="fileDownload(item)"
                        >
                          下载
                        </el-link>
                        <el-link type="primary" class="mr-1" :underline="false" @click="edit(item)">
                          修改
                        </el-link>
                        <el-link
                          type="primary"
                          :underline="false"
                          @click="selectOpen('dele', [item.file_id])"
                        >
                          删除
                        </el-link>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
            </el-scrollbar>
          </el-col>
          <el-col v-else :span="22">
            <el-empty :description="'暂无' + name" />
          </el-col>
        </el-checkbox-group>
      </template>
      <!-- 表格展示 -->
      <template v-else>
        <el-col :span="22" class="mt-[6px] p-0">
          <el-table
            ref="table"
            v-loading="loading"
            :data="data"
            :height="height"
            @sort-change="sort"
            @selection-change="select"
            @cell-dblclick="cellDbclick"
          >
            <el-table-column type="selection" width="42" title="全选/反选" />
            <el-table-column :prop="idkey" label="ID" min-width="80" sortable="custom" />
            <el-table-column prop="unique" label="标识" min-width="80" show-overflow-tooltip />
            <el-table-column prop="file_url" label="文件" min-width="85">
              <template #default="scope">
                <FilePreview :file="scope.row" lazy />
              </template>
            </el-table-column>
            <el-table-column prop="file_type_name" label="类型" min-width="60" />
            <el-table-column
              prop="file_name"
              label="名称"
              min-width="110"
              sortable="custom"
              show-overflow-tooltip
            />
            <el-table-column
              prop="file_ext"
              label="后缀"
              min-width="85"
              sortable="custom"
              show-overflow-tooltip
            />
            <el-table-column
              prop="file_size"
              label="大小"
              min-width="90"
              sortable="custom"
              show-overflow-tooltip
            />
            <el-table-column prop="group_name" label="分组" min-width="110" show-overflow-tooltip />
            <el-table-column prop="tag_names" label="标签" min-width="110" show-overflow-tooltip />
            <el-table-column prop="is_disable" label="禁用" min-width="85" sortable="custom">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.is_disable"
                  :active-value="1"
                  :inactive-value="0"
                  @change="disable([scope.row])"
                />
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" min-width="85" sortable="custom" />
            <el-table-column prop="create_time" label="添加时间" width="165" sortable="custom" />
            <el-table-column
              v-if="recycle"
              prop="delete_time"
              label="删除时间"
              width="165"
              sortable="custom"
            />
            <el-table-column
              v-else
              prop="update_time"
              label="修改时间"
              width="165"
              sortable="custom"
            />
            <el-table-column label="操作" width="170">
              <template #default="scope">
                <el-link
                  v-if="recycle"
                  type="primary"
                  class="mr-1"
                  :underline="false"
                  @click="selectOpen('reco', [scope.row])"
                >
                  恢复
                </el-link>
                <el-link
                  type="primary"
                  class="mr-1"
                  :underline="false"
                  @click="fileDownload(scope.row)"
                >
                  下载
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
        </el-col>
      </template>
    </el-row>
    <!-- 分页 -->
    <pagination
      v-show="count > 0"
      v-model:total="count"
      v-model:page="query.page"
      v-model:limit="query.limit"
      @pagination="list"
    />
    <!-- 添加修改 -->
    <el-dialog
      v-model="dialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancel"
      top="5vh"
      append-to-body
    >
      <el-scrollbar native :height="height - 30">
        <el-form ref="ref" :rules="rules" :model="model" label-width="100px">
          <el-form-item label="标识" prop="unique">
            <el-input v-model="model.unique" placeholder="请输入标识（唯一）" clearable />
          </el-form-item>
          <el-form-item v-if="model.file_id" label="文件" prop="file_id">
            <FilePreview :file="model" :height="150" download />
          </el-form-item>
          <el-form-item
            label="文件名称"
            prop="file_name"
            :rules="{
              required: model.type == 'url' ? false : true,
              message: '请输入文件名称',
              trigger: 'blur'
            }"
          >
            <el-input v-model="model.file_name" placeholder="请输入文件名称" clearable />
          </el-form-item>
          <el-form-item label="文件分组" prop="group_id">
            <el-select v-model="model.group_id" clearable>
              <el-option
                v-for="(item, index) in groupData"
                :key="index"
                :value="item.group_id"
                :label="item.group_name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文件标签" prop="tag_ids">
            <el-select v-model="model.tag_ids" class="w-full" clearable filterable multiple>
              <el-option
                v-for="item in tagData"
                :key="item.tag_id"
                :label="item.tag_name"
                :value="item.tag_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文件类型" prop="file_type">
            <el-select v-model="model.file_type">
              <el-option
                v-for="(item, index) in file_types"
                :key="index"
                :value="index"
                :label="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="model.file_id" label="文件域名" prop="domain">
            <el-input v-model="model.domain" placeholder="请输入域名" clearable />
          </el-form-item>
          <el-form-item v-if="model.file_id" label="文件路径" prop="file_path">
            <el-input
              v-model="model.file_path"
              placeholder="请输入路径"
              :disabled="model.file_id ? true : false"
            />
          </el-form-item>
          <el-form-item label="文件链接" prop="file_url">
            <el-input
              v-model="model.file_url"
              placeholder="请输入链接"
              :disabled="model.file_id ? true : false"
              clearable
            />
          </el-form-item>
          <el-form-item label="存储方式" prop="storage">
            <el-select v-model="model.storage" :disabled="model.file_id ? true : false">
              <el-option
                v-for="(item, index) in storages"
                :key="index"
                :value="index"
                :label="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="model.remark" placeholder="请输入备注" clearable />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="model.sort" type="number" placeholder="250" clearable />
          </el-form-item>
          <el-form-item v-if="model.file_id" label="是否禁用" prop="is_disable">
            <el-switch v-model="model.is_disable" :active-value="1" :inactive-value="0" disabled />
          </el-form-item>
          <el-form-item v-if="model.file_id" label="文件大小" prop="file_size">
            <el-input v-model="model.file_size" placeholder="" disabled />
          </el-form-item>
          <el-form-item v-if="model.file_id" label="文件后缀" prop="file_ext">
            <el-input v-model="model.file_ext" placeholder="" disabled />
          </el-form-item>
          <el-form-item v-if="model.file_id" label="文件MD5" prop="file_md5">
            <el-input v-model="model.file_md5" placeholder="" disabled />
          </el-form-item>
          <el-form-item v-if="model.file_id" label="文件散列" prop="file_hash">
            <el-input v-model="model.file_hash" placeholder="" disabled />
          </el-form-item>
          <el-form-item v-if="model.file_id" label="添加时间" prop="create_time">
            <el-input v-model="model.create_time" disabled />
          </el-form-item>
          <el-form-item v-if="model.file_id" label="修改时间" prop="update_time">
            <el-input v-model="model.update_time" disabled />
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
    <!-- 文件管理操作 -->
    <el-row v-show="fileType">
      <el-col class="text-right mt-2">
        <el-button @click="fileCancel()">取消</el-button>
        <el-button type="primary" @click="fileSubmit(selection)">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import clip from '@/utils/clipboard'
import { useSettingsStoreHook } from '@/store/modules/settings'
import { useUserStoreHook } from '@/store/modules/user'
import { arrayColumn } from '@/utils/index'
import {
  list,
  info,
  add,
  edit,
  dele,
  editgroup,
  edittag,
  edittype,
  editdomain,
  disable,
  recycle,
  recycleReco,
  recycleDele
} from '@/api/file/file'
import {
  info as groupInfo,
  add as groupAdd,
  edit as groupEdit,
  dele as groupDele
} from '@/api/file/group'
import { info as tagInfo, add as tagAdd, edit as tagEdit, dele as tagDele } from '@/api/file/tag'

export default {
  name: '',
  components: { Pagination },
  props: {
    isRecycle: { type: Number, default: 0 },
    fileType: { type: String, default: '' }
  },
  data() {
    return {
      name: '文件',
      recycle: 0, // 是否回收站
      height: 680,
      loading: false,
      idkey: 'file_id',
      exps: [],
      query: {
        page: 1,
        limit: 18,
        storage: '',
        file_type: '',
        is_front: 0,
        is_disable: '',
        search_field: 'file_name',
        search_exp: 'like',
        date_field: 'create_time',
        sort_field: 'file_id',
        sort_value: ''
      },
      data: [],
      count: 0,
      showMode: 'card',
      dialog: false,
      dialogTitle: '',
      model: {
        type: 'upl',
        file_id: '',
        unique: '',
        group_id: '',
        tag_ids: [],
        storage: 'local',
        domain: '',
        file_md5: '',
        file_hash: '',
        file_name: '',
        file_type: '',
        file_path: '',
        file_size: '',
        file_ext: '',
        file_url: '',
        remark: '',
        sort: 250,
        is_front: 0,
        is_disable: 0,
        is_delete: 0
      },
      rules: {
        file_type: [{ required: true, message: '请选择文件类型', trigger: 'blur' }],
        file_url: [{ required: true, message: '请输入文件链接', trigger: 'blur' }]
      },
      fileIds: [],
      storages: [],
      file_types: [],
      fileImgPre: [],
      selectAll: false,
      selectAllInd: false,
      selection: [],
      selectIds: '',
      selectTitle: '操作',
      selectDialog: false,
      selectType: '',
      group_id: 0,
      tag_ids: [],
      domain: '',
      file_type: 'image',
      is_disable: 0,
      uploadAction: add(),
      uploadHeaders: {},
      uploadData: {},
      uploadLimit: 9,
      uploadAccept: '',
      uploadFilelist: [],
      uploadCount: 0,
      uploadNumber: 0,
      groupPk: 'group_id',
      groupName: '分组',
      groupData: [],
      groupDialog: false,
      groupTitle: '',
      groupModel: {
        group_id: '',
        group_name: '',
        group_desc: '',
        remark: '',
        sort: 250
      },
      groupRules: {
        group_name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
      },
      tagPk: 'tag_id',
      tagName: '标签',
      tagData: [],
      tagDialog: false,
      tagTitle: '',
      tagModel: {
        tag_id: '',
        tag_name: '',
        tag_desc: '',
        remark: '',
        sort: 250
      },
      tagRules: {
        tag_name: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    isRecycle: {
      handler(value) {
        this.recycle = value
        this.list()
      }
    },
    fileType: {
      handler(value) {
        this.recycle = this.isRecycle
        this.query.file_type = value
        this.query.page = 1
        this.list()
      }
    }
  },
  created() {
    this.height = screenHeight() - 10
    this.recycle = this.isRecycle
    if (this.fileType) {
      this.query.is_disable = 0
      this.query.file_type = this.fileType
      if (this.fileType == 'all') {
        this.query.file_type = ''
      }
      this.height = this.height - 145
    }
    const settingsStore = useSettingsStoreHook()
    const userStore = useUserStoreHook()
    const tokenType = settingsStore.tokenType
    const tokenName = settingsStore.tokenName
    const tokenValue = userStore.token
    if (tokenType === 'header') {
      const uploadHeaders = {}
      uploadHeaders[tokenName] = tokenValue
      this.uploadHeaders = uploadHeaders
    } else {
      const uploadData = { group_id: 0 }
      uploadData[tokenName] = tokenValue
      this.uploadData = uploadData
    }
    this.query.limit = 18
    this.list()
  },
  methods: {
    checkPermission,
    // 列表
    list() {
      this.loading = true
      if (this.recycle) {
        recycle(this.query)
          .then((res) => {
            this.listData(res.data)
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        list(this.query)
          .then((res) => {
            this.listData(res.data)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    listData(data) {
      this.data = data.list
      this.count = data.count
      this.fileIds = data.ids
      this.uploadLimit = data.setting.limit_max
      this.uploadAccept = data.setting.accept_ext
      this.storages = data.setting.storages
      this.file_types = data.setting.file_types
      this.groupData = data.group
      this.tagData = data.tag
      this.exps = data.exps
      this.imagePreview(data.list)
      this.loading = false
    },
    // 上传
    uploadBefore() {
      this.loading = true
      this.model.type = 'upl'
    },
    uploadSuccess(res) {
      this.uploadNumber++
      if (res.code === 200) {
        if (this.uploadNumber >= this.uploadCount) {
          this.uploadNumber = this.uploadCount = 0
          this.query = this.$options.data().query
          this.list()
          ElMessage.success(res.msg)
        }
      } else {
        ElMessage.error(res.msg)
        if (this.uploadNumber >= this.uploadCount) {
          this.loading = false
        }
      }
    },
    uploadError(res) {
      this.loading = false
      ElMessage.error(res.msg || '上传出错')
    },
    uploadChange(file, fileList) {
      this.loading = true
      this.uploadCount = fileList.length
      if (this.uploadNumber >= this.uploadCount) {
        this.loading = false
      }
    },
    uploadExceed() {
      ElMessage.error(`每次最多只能选择 ${this.uploadLimit} 个文件`)
    },
    uploadClear() {
      this.uploadNumber = this.uploadCount = 0
      this.uploadFilelist = []
    },
    // 添加修改
    add() {
      this.dialog = true
      this.dialogTitle = this.name + '添加'
      this.reset()
      this.model.type = 'url'
    },
    edit(row) {
      this.dialog = true
      this.dialogTitle = this.name + '修改：' + row.file_id
      info({
        file_id: row.file_id
      })
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
          if (this.model.file_id) {
            edit(this.model)
              .then((res) => {
                this.list()
                this.reset()
                this.dialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            add(this.model, 'url')
              .then((res) => {
                this.list()
                this.reset()
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
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 刷新
    refresh() {
      const limit = this.query.limit
      this.query = this.$options.data().query
      this.query.limit = limit
      this.reset()
      this.list()
    },
    // 排序
    sort(sort) {
      if (this.showMode === 'card') {
        if (this.query.sort_value && this.query.sort_value) {
          this.list()
        }
      } else {
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
      }
    },
    // 重置
    reset(row) {
      if (row) {
        this.model = row
      } else {
        this.model = this.$options.data().model
      }
      this.selection = []
      this.selectIds = ''
      this.selectAll = false
      this.selectAllInd = false
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
      }
      if (this.$refs['table'] !== undefined) {
        try {
          this.$refs['table'].clearSelection()
          this.$refs['table'].clearSort()
        } catch (error) {}
      }
    },
    // 展示切换
    showChange() {
      this.selectAlls(false)
    },
    // 回收站
    showRecycle() {
      this.recycle = !this.recycle
      this.list()
    },
    // 选择操作
    select(selection) {
      this.selection = selection
      this.selectIds = this.selectGetIds().toString()
      this.selectAll = selection.length === this.fileIds.length
      this.selectAllInd = selection.length > 0 && selection.length < this.fileIds.length
    },
    selectAlls(value) {
      if (value) {
        this.selection = this.fileIds
        if (this.$refs['table'] !== undefined) {
          this.$refs['table'].toggleAllSelection()
        }
      } else {
        this.selection = []
        if (this.$refs['table'] !== undefined) {
          try {
            this.$refs['table'].clearSelection()
          } catch (error) {}
        }
      }
      this.select(this.selection)
    },
    selectGetIds() {
      if (this.showMode === 'card') {
        return this.selection
      } else {
        return arrayColumn(this.selection, this.idkey)
      }
    },
    selectAlert() {
      ElMessageBox.alert('请选择需要操作的' + this.name, '提示', {
        type: 'warning',
        callback: () => {}
      })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        if (this.showMode === 'card') {
          this.selection = []
        } else {
          if (this.$refs['table'] !== undefined) {
            try {
              this.$refs['table'].clearSelection()
            } catch (error) {}
          }
        }
        this.select(selectRow)
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '操作'
        if (selectType === 'editgroup') {
          this.selectTitle = this.name + '修改分组'
        } else if (selectType === 'edittag') {
          this.selectTitle = this.name + '修改标签'
        } else if (selectType === 'edittype') {
          this.selectTitle = this.name + '修改类型'
        } else if (selectType === 'editdomain') {
          this.selectTitle = this.name + '修改域名'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '是否禁用'
        } else if (selectType === 'dele') {
          this.selectTitle = this.name + '删除'
        } else if (selectType === 'reco') {
          this.selectTitle = this.name + '恢复'
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
        if (selectType === 'editgroup') {
          this.editgroup()
        } else if (selectType === 'edittag') {
          this.edittag(this.selection)
        } else if (selectType === 'edittype') {
          this.edittype()
        } else if (selectType === 'editdomain') {
          this.editdomain()
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele()
        } else if (selectType === 'reco') {
          this.reco()
        }
        this.selectDialog = false
      }
    },
    // 修改分组
    editgroup() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        editgroup({
          ids: this.selectGetIds(),
          group_id: this.group_id
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
    // 修改标签
    edittag() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        edittag({
          ids: this.selectGetIds(),
          tag_ids: this.tag_ids
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
    // 修改类型
    edittype() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        edittype({
          ids: this.selectGetIds(),
          file_type: this.file_type
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
    // 修改域名
    editdomain() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        editdomain({
          ids: this.selectGetIds(),
          domain: this.domain
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
        this.select(row)
        disable({
          ids: this.selectGetIds(),
          is_disable: is_disable
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.list()
          })
      }
    },
    // 删除
    dele() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        if (this.recycle) {
          recycleDele({
            ids: this.selectGetIds()
          })
            .then((res) => {
              this.list()
              this.reset()
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          dele({
            ids: this.selectGetIds()
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
      }
    },
    // 恢复
    reco() {
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.loading = true
        recycleReco({
          ids: this.selectGetIds()
        })
          .then((res) => {
            this.list()
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 图片预览
    imagePreview(list) {
      var preview = []
      const length = list.length
      for (let index = 0; index < length; index++) {
        if (list[index]['file_type'] === 'image') {
          preview.push(list[index]['file_url'])
        }
      }
      this.fileImgPre = preview
    },
    imagePreIndex(fileUrl) {
      return this.fileImgPre.indexOf(fileUrl)
    },
    // 文件下载
    fileDownload(file) {
      clip(file.file_name, '文件名复制成功')
      setTimeout(() => {
        window.open(file.file_url, '_blank')
      }, 500)
    },
    // 分组筛选
    groupSelect() {
      this.uploadData.group_id = this.query.group_id
      this.list()
    },
    // 标签筛选
    tagSelect() {
      this.uploadData.tag_ids = this.query.tag_ids
      this.list()
    },
    // 类型筛选
    typeSelect(file_type = '') {
      this.query.file_type = file_type
      this.list()
    },
    // 禁用筛选
    disableSelect(is_disable = '') {
      this.query.is_disable = is_disable
      this.list()
    },
    // 上传筛选
    frontSelect(is_front = '') {
      this.query.is_front = is_front
      this.list()
    },
    // 存储筛选
    storageSelect(storage = '') {
      this.query.storage = storage
      this.list()
    },
    // 分组管理
    groupList(group) {
      if (group) {
        this.group = group
      } else {
        this.query.is_extra = 1
        this.list()
      }
    },
    groupAdd() {
      this.groupDialog = true
      this.groupTitle = this.groupName + '添加'
      this.groupReset()
    },
    groupEdit() {
      const group_id = this.query.group_id
      if (!group_id) {
        ElMessageBox.alert('请选择需要修改的' + this.groupName, '提示', {
          type: 'warning',
          callback: () => {}
        })
      } else {
        this.groupDialog = true
        this.groupTitle = this.groupName + '修改：' + this.query.group_id
        groupInfo({
          group_id: this.query.group_id
        })
          .then((res) => {
            this.groupReset(res.data)
          })
          .catch(() => {
            this.groupDialog = false
          })
      }
    },
    groupCancel() {
      this.groupDialog = false
      this.groupReset()
    },
    groupSubmit() {
      this.$refs['groupRef'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.groupModel.group_id) {
            groupEdit(this.groupModel)
              .then((res) => {
                this.groupList()
                this.groupDialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            groupAdd(this.groupModel)
              .then((res) => {
                this.groupList()
                this.groupDialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    groupDele() {
      const group_id = this.query.group_id
      if (!group_id) {
        ElMessageBox.alert('请选择需要删除的' + this.groupName, '提示', {
          type: 'warning',
          callback: () => {}
        })
      } else {
        const group = this.group
        const grouplen = group.length
        const title = this.groupName + '删除：' + group_id
        let group_name = ''
        for (let i = 0; i < grouplen; i++) {
          if (group[i].group_id === group_id) {
            group_name = group[i].group_name
            break
          }
        }
        const message =
          '确定要删除' + this.groupName + ' <span style="color:red">' + group_name + ' </span>吗？'
        ElMessageBox.confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true })
          .then(() => {
            this.loading = true
            groupDele({
              ids: [group_id]
            })
              .then((res) => {
                this.groupList()
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          })
          .catch(() => {})
      }
    },
    groupReset(row) {
      if (row) {
        this.groupModel = row
      } else {
        this.groupModel = this.$options.data().groupModel
      }
    },
    // 标签管理
    tagList(tag) {
      if (tag) {
        this.tag = tag
      } else {
        this.query.is_extra = 1
        this.list()
      }
    },
    tagAdd() {
      this.tagDialog = true
      this.tagTitle = this.tagName + '添加'
      this.tagReset()
    },
    tagEdit() {
      const tag_ids = this.query.tag_ids
      const tag_id = tag_ids[0]
      if (!tag_id) {
        ElMessageBox.alert('请选择需要修改的' + this.tagName, '提示', {
          type: 'warning',
          callback: () => {}
        })
      } else {
        this.tagDialog = true
        this.tagTitle = this.tagName + '修改：' + tag_id
        tagInfo({
          tag_id: tag_id
        })
          .then((res) => {
            this.tagReset(res.data)
          })
          .catch(() => {
            this.tagDialog = false
          })
      }
    },
    tagCancel() {
      this.tagDialog = false
      this.tagReset()
    },
    tagSubmit() {
      this.$refs['tagRef'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.tagModel.tag_id) {
            tagEdit(this.tagModel)
              .then((res) => {
                this.tagList()
                this.tagReset()
                this.tagDialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            tagAdd(this.tagModel)
              .then((res) => {
                this.tagList()
                this.tagReset()
                this.tagDialog = false
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      })
    },
    tagDele() {
      const tag_ids = this.query.tag_ids
      const tag_id = tag_ids[0]
      if (!tag_id) {
        ElMessageBox.alert('请选择需要删除的' + this.tagName, '提示', {
          type: 'warning',
          callback: () => {}
        })
      } else {
        const tag = this.tag
        const taglen = tag.length
        const title = this.tagName + '删除：' + tag_id
        let tag_name = ''
        for (let i = 0; i < taglen; i++) {
          if (tag[i].tag_id === tag_id) {
            tag_name = tag[i].tag_name
            break
          }
        }
        const message =
          '确定要删除' + this.tagName + ' <span style="color:red">' + tag_name + ' </span>吗？'
        ElMessageBox.confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true })
          .then(() => {
            this.loading = true
            tagDele({
              ids: [tag_id]
            })
              .then((res) => {
                this.tagList()
                ElMessage.success(res.msg)
              })
              .catch(() => {
                this.loading = false
              })
          })
          .catch(() => {})
      }
    },
    tagReset(row) {
      if (row) {
        this.tagModel = row
      } else {
        this.tagModel = this.$options.data().tagModel
      }
    },
    // 文件管理操作
    fileCancel() {
      this.reset()
      this.$emit('fileCancel')
    },
    fileSubmit(row) {
      if (!row.length) {
        ElMessageBox.alert('请选择文件')
      } else {
        const files = []
        const data = this.data
        const row_len = row.length
        const data_len = data.length
        for (let i = 0; i < row_len; i++) {
          for (let j = 0; j < data_len; j++) {
            if (this.showMode === 'card') {
              if (row[i] === data[j][this.idkey]) {
                files.push(data[j])
                break
              }
            } else {
              if (row[i][this.idkey] === data[j][this.idkey]) {
                files.push(data[j])
                break
              }
            }
          }
        }
        this.reset()
        this.$emit('fileSubmit', files, this.fileType)
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
