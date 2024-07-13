<template>
  <div class="app-container">
    <!-- 查询 -->
    <el-row>
      <el-col class="mb-2">
        <el-select v-model="query.search_field" class="ya-search-field" placeholder="查询字段">
          <el-option :value="idkey" label="ID" />
          <el-option value="nickname" label="昵称" />
          <el-option value="username" label="用户名" />
          <el-option value="phone" label="手机" />
          <el-option value="email" label="邮箱" />
          <el-option value="tag_ids" label="标签" />
          <el-option value="group_ids" label="分组" />
          <el-option value="is_super" label="超会" />
          <el-option value="is_disable" label="禁用" />
          <el-option value="remark" label="备注" />
          <el-option value="name" label="姓名" />
          <el-option value="gender" label="性别" />
          <el-option value="region_id" label="所在地" />
          <el-option value="platform" label="注册平台" />
          <el-option value="application" label="注册应用" />
        </el-select>
        <el-select v-model="query.search_exp" class="ya-search-exp">
          <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
        </el-select>
        <el-select
          v-if="query.search_field === 'tag_ids'"
          v-model="query.search_value"
          class="ya-search-value"
          clearable
          filterable
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in tagData"
            :key="item.tag_id"
            :label="item.tag_name"
            :value="item.tag_id"
          />
        </el-select>
        <el-select
          v-else-if="query.search_field === 'group_ids'"
          v-model="query.search_value"
          class="ya-search-value"
          clearable
          filterable
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in groupData"
            :key="item.group_id"
            :label="item.group_name"
            :value="item.group_id"
          />
        </el-select>
        <el-select
          v-else-if="query.search_field === 'is_super' || query.search_field === 'is_disable'"
          v-model="query.search_value"
          class="ya-search-value"
          clearable
        >
          <el-option :value="1" label="是" />
          <el-option :value="0" label="否" />
        </el-select>
        <el-select
          v-else-if="query.search_field === 'platform'"
          v-model="query.search_value"
          class="ya-search-value"
          clearable
        >
          <el-option v-for="(item, index) in platforms" :key="index" :label="item" :value="index" />
        </el-select>
        <el-select
          v-else-if="query.search_field === 'application'"
          v-model="query.search_value"
          class="ya-search-value"
          clearable
        >
          <el-option
            v-for="(item, index) in applications"
            :key="index"
            :label="item"
            :value="index"
          />
        </el-select>
        <el-cascader
          v-else-if="query.search_field === 'region_id'"
          v-model="query.search_value"
          class="ya-search-value"
          :options="regionData"
          :props="regionQueryProps"
          clearable
          filterable
          collapse-tags
        />
        <el-select
          v-else-if="query.search_field === 'gender'"
          v-model="query.search_value"
          class="ya-search-value"
          clearable
        >
          <el-option v-for="(item, index) in genders" :key="index" :label="item" :value="index" />
        </el-select>
        <el-input
          v-else
          v-model="query.search_value"
          class="ya-search-value"
          placeholder="查询内容"
          clearable
        />
        <el-select v-model="query.date_field" class="ya-date-field" placeholder="时间字段">
          <el-option value="create_time" label="注册时间" />
          <el-option value="login_time" label="登录时间" />
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
        <el-button title="修改标签" @click="selectOpen('edittag')">标签</el-button>
        <el-button title="修改分组" @click="selectOpen('editgroup')">分组</el-button>
        <el-button title="重置密码" @click="selectOpen('repwd')">密码</el-button>
        <el-button title="是否超会" @click="selectOpen('super')">超会</el-button>
        <el-button title="修改所在地" @click="selectOpen('region')">所在地</el-button>
        <el-button title="导出" class="float-right" @click="selectOpen('export')">导出</el-button>
        <el-tooltip content="表头：昵称，用户名，手机，邮箱，密码" effect="dark" placement="left">
          <excel-import
            v-if="checkPermission(['admin/member.Member/export'])"
            title="导入"
            @on-import="imports"
          />
        </el-tooltip>
      </el-col>
    </el-row>
    <el-dialog
      v-model="selectDialog"
      :title="selectTitle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="20vh"
    >
      <el-scrollbar native :height="height - 200">
        <el-form label-width="120px">
          <el-form-item v-if="selectType === 'region'" label="所在地">
            <el-cascader
              v-model="region_id"
              :options="regionData"
              :props="regionProps"
              class="w-full"
              clearable
              filterable
            />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'edittag'" label="标签">
            <el-select v-model="tag_ids" class="w-full" clearable filterable multiple>
              <el-option
                v-for="item in tagData"
                :key="item.tag_id"
                :label="item.tag_name"
                :value="item.tag_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="selectType === 'editgroup'" label="分组">
            <el-select v-model="group_ids" class="w-full" clearable filterable multiple>
              <el-option
                v-for="item in groupData"
                :key="item.group_id"
                :label="item.group_name"
                :value="item.group_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-else-if="selectType === 'super'" label="是否超会">
            <el-switch v-model="is_super" :active-value="1" :inactive-value="0" />
            <el-text v-if="is_super" size="default"> 超级会员，拥有所有权限。</el-text>
          </el-form-item>
          <el-form-item v-else-if="selectType === 'disable'" label="是否禁用">
            <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
            <el-text size="default" v-if="is_disable" type="danger"> 禁用后无法登录！</el-text>
          </el-form-item>
          <el-form-item v-else-if="selectType === 'repwd'" label="新密码">
            <el-input v-model="password" placeholder="请输入新密码" clearable />
          </el-form-item>
          <el-form-item v-else-if="selectType === 'dele'">
            <el-text size="default" type="danger">确定要删除选中的{{ name }}吗？</el-text>
          </el-form-item>
          <div v-else-if="selectType === 'export'">
            <el-form-item label="文件名称">
              <el-input v-model="exportFileName" placeholder="请输入文件名称" clearable />
            </el-form-item>
            <el-form-item label="文件类型">
              <el-select v-model="exportBookType">
                <el-option
                  v-for="item in ['xlsx', 'csv', 'txt']"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="自动宽度">
              <el-switch v-model="exportAutoWidth" :active-value="true" :inactive-value="false" />
              <span> 宽度是否自适应</span>
            </el-form-item>
          </div>
          <el-form-item :label="name + 'ID'">
            <el-input v-model="selectIds" type="textarea" autosize disable />
          </el-form-item>
        </el-form>
      </el-scrollbar>
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
      @sort-change="sort"
      @selection-change="select"
      @cell-dblclick="cellDbclick"
    >
      <el-table-column type="selection" width="42" title="全选/反选" />
      <el-table-column :prop="idkey" label="ID" width="80" sortable="custom" />
      <el-table-column prop="avatar_id" label="头像" min-width="62">
        <template #default="scope">
          <FileImage :file-url="scope.row.avatar_url" avatar lazy />
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="昵称"
        min-width="170"
        sortable="custom"
        show-overflow-tooltip
      />
      <el-table-column
        prop="username"
        label="用户名"
        min-width="170"
        sortable="custom"
        show-overflow-tooltip
      />
      <el-table-column
        prop="phone"
        label="手机"
        min-width="112"
        sortable="custom"
        show-overflow-tooltip
      />
      <el-table-column
        prop="email"
        label="邮箱"
        min-width="200"
        sortable="custom"
        show-overflow-tooltip
      />
      <el-table-column prop="tag_names" label="标签" min-width="130" show-overflow-tooltip />
      <el-table-column prop="group_names" label="分组" min-width="135" show-overflow-tooltip />
      <el-table-column prop="is_super" label="超会" min-width="85" sortable="custom">
        <template #default="scope">
          <el-switch
            v-model="scope.row.is_super"
            :active-value="1"
            :inactive-value="0"
            @change="issuper([scope.row])"
          />
        </template>
      </el-table-column>
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
      <el-table-column prop="sort" label="排序" width="85" sortable="custom" />
      <el-table-column prop="create_time" label="注册时间" width="165" sortable="custom" />
      <el-table-column label="操作" width="95">
        <template #default="scope">
          <el-link type="primary" class="mr-1" :underline="false" @click="edit(scope.row)">
            修改
          </el-link>
          <el-link type="primary" :underline="false" @click="selectOpen('dele', [scope.row])">
            删除
          </el-link>
        </template>
      </el-table-column>
    </el-table>
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
    >
      <el-form ref="ref" :model="model" :rules="rules" label-width="100px">
        <el-tabs>
          <el-tab-pane label="基础信息">
            <el-scrollbar native :height="height - 80">
              <el-form-item label="头像" prop="avatar_id">
                <FileImage
                  v-model="model.avatar_id"
                  :file-url="model.avatar_url"
                  file-title="上传头像"
                  file-tip="图片小于200KB，jpg、png格式，宽高 1:1。"
                  :height="100"
                  avatar
                  upload
                />
              </el-form-item>
              <el-form-item label="昵称" prop="nickname">
                <el-input
                  key="nickname"
                  v-model="model.nickname"
                  placeholder="请输入昵称"
                  clearable
                />
              </el-form-item>
              <el-form-item label="用户名" prop="username">
                <el-input
                  key="username"
                  v-model="model.username"
                  placeholder="请输入用户名"
                  clearable
                />
              </el-form-item>
              <el-form-item v-if="model.member_id == ''" label="密码" prop="password">
                <el-input
                  key="password"
                  v-model="model.password"
                  placeholder="请输入密码"
                  clearable
                  show-password
                />
              </el-form-item>
              <el-form-item label="手机" prop="phone">
                <el-input v-model="model.phone" clearable />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="model.email" clearable />
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="model.name" clearable />
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-select v-model="model.gender">
                  <el-option
                    v-for="(item, index) in genders"
                    :key="index"
                    :label="item"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="所在地" prop="region_id">
                <el-cascader
                  v-model="model.region_id"
                  class="w-full"
                  :options="regionData"
                  :props="regionProps"
                  clearable
                />
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input v-model="model.sort" type="number" />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="model.remark" clearable />
              </el-form-item>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="权限信息">
            <el-scrollbar native :height="height - 80">
              <el-form-item label="超会" prop="is_super">
                <el-switch
                  v-model="model.is_super"
                  :active-value="1"
                  :inactive-value="0"
                  disabled
                />
              </el-form-item>
              <el-form-item label="禁用" prop="is_disable">
                <el-switch
                  v-model="model.is_disable"
                  :active-value="1"
                  :inactive-value="0"
                  disabled
                />
              </el-form-item>
              <el-form-item label="标签" prop="tag_ids">
                <el-select v-model="model.tag_ids" class="w-full" multiple clearable filterable>
                  <el-option
                    v-for="item in tagData"
                    :key="item.tag_id"
                    :label="item.tag_name"
                    :value="item.tag_id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="分组(角色)" prop="group_ids">
                <el-select v-model="model.group_ids" class="w-full" clearable filterable multiple>
                  <el-option
                    v-for="item in groupData"
                    :key="item.group_id"
                    :label="item.group_name"
                    :value="item.group_id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="接口(权限)" prop="api_ids">
                <el-col :span="24">
                  <el-checkbox v-model="apiExpandAll" @change="apiExpandAllChange">
                    展开
                  </el-checkbox>
                </el-col>
                <el-tree
                  ref="apiRef"
                  :data="model.api_tree"
                  :props="apiProps"
                  :default-checked-keys="model.api_ids"
                  :expand-on-click-node="true"
                  :default-expand-all="false"
                  :check-strictly="true"
                  node-key="api_id"
                  highlight-current
                >
                  <template #default="scope">
                    <span class="custom-tree-node">
                      <span>
                        {{ scope.node.label }}
                        <i v-if="scope.data.is_check" style="color: #1890ff" title="已分配">
                          <svg-icon icon-class="check" />
                        </i>
                      </span>
                      <span>
                        <i
                          v-if="scope.data.api_url"
                          style="margin-left: 10px"
                          :title="scope.data.api_url"
                        >
                          <svg-icon icon-class="link" />
                        </i>
                        <i v-else style="margin-left: 10px; color: #fff">
                          <svg-icon icon-class="link" />
                        </i>
                        <i v-if="scope.data.is_group" style="margin-left: 10px" title="分组">
                          <svg-icon icon-class="s-custom" />
                        </i>
                        <i v-else style="margin-left: 10px; color: #fff">
                          <svg-icon icon-class="s-custom" />
                        </i>
                        <i v-if="scope.data.is_unauth" style="margin-left: 10px" title="免权">
                          <svg-icon icon-class="unlock" />
                        </i>
                        <i v-else style="margin-left: 10px; color: #fff">
                          <svg-icon icon-class="unlock" />
                        </i>
                        <i v-if="scope.data.is_unlogin" style="margin-left: 10px" title="免登">
                          <svg-icon icon-class="user" />
                        </i>
                        <i v-else style="margin-left: 10px; color: #fff">
                          <svg-icon icon-class="user" />
                        </i>
                      </span>
                    </span>
                  </template>
                </el-tree>
              </el-form-item>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="登录注册">
            <el-scrollbar native :height="height - 80">
              <el-form-item v-if="model[idkey]" label="登录IP" prop="login_ip">
                <el-input v-model="model.login_ip" disabled />
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="登录地区" prop="login_region">
                <el-input v-model="model.login_region" disabled />
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="登录时间" prop="login_time">
                <el-input v-model="model.login_time" disabled />
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="登录次数" prop="login_num">
                <el-input v-model="model.login_num" disabled />
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="注册平台" prop="platform_name">
                <el-input v-model="model.platform_name" disabled />
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="注册应用" prop="application_name">
                <el-input v-model="model.application_name" disabled />
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="注册时间" prop="create_time">
                <el-input v-model="model.create_time" disabled />
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="修改时间" prop="update_time">
                <el-input v-model="model.update_time" disabled />
              </el-form-item>
              <el-form-item v-if="model[idkey]" label="退出时间" prop="logout_time">
                <el-input v-model="model.logout_time" disabled />
              </el-form-item>
              <el-form-item v-if="model.delete_time" label="删除时间" prop="delete_time">
                <el-input v-model="model.delete_time" disabled />
              </el-form-item>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="第三方账号">
            <el-scrollbar native :height="height - 80">
              <el-table v-if="model[idkey]" :data="model.thirds">
                <el-table-column prop="third_id" label="ID" width="80" />
                <el-table-column prop="headimgurl" label="头像" min-width="62">
                  <template #default="scope">
                    <FileImage :file-url="scope.row.headimgurl" avatar lazy />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="nickname"
                  label="昵称"
                  min-width="100"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="platform_name"
                  label="平台"
                  min-width="80"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="application_name"
                  label="应用"
                  min-width="110"
                  show-overflow-tooltip
                />
                <el-table-column prop="is_disable" label="禁用" min-width="85">
                  <template #default="scope">
                    <el-switch
                      v-model="scope.row.is_disable"
                      :loading="thirdUnbindLoad"
                      :active-value="1"
                      :inactive-value="0"
                      @change="thirdDisable(scope.row)"
                    />
                  </template>
                </el-table-column>
                <el-table-column prop="create_time" label="添加/绑定时间" min-width="165" />
                <el-table-column prop="login_time" label="登录时间" width="165" />
                <el-table-column label="操作" width="70">
                  <template #default="scope">
                    <el-link type="primary" :underline="false" @click="thirdUnbindBtn(scope.row)">
                      解绑
                    </el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <el-button :loading="loading" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </template>
    </el-dialog>
    <!-- 第三方账号解绑 -->
    <el-dialog v-model="thirdUnbindDialog" title="会员第三方账号解绑" width="25%" top="20vh">
      <el-text size="default" type="danger">
        解绑后该会员无法再通过该第三方账号登录，确定要解绑吗？
      </el-text>
      <template #footer>
        <el-button :loading="thirdUnbindLoad" @click="thirdUnbindDialog = false">取消</el-button>
        <el-button :loading="thirdUnbindLoad" type="primary" @click="thirdUnbindSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination/index.vue'
import ExcelImport from '@/components/ExcelImport/index.vue'
import clip from '@/utils/clipboard'
import { arrayColumn } from '@/utils/index'
import { getPageLimit } from '@/utils/settings'
import {
  list,
  info,
  add,
  edit,
  dele,
  region,
  edittag,
  editgroup,
  repwd,
  issuper,
  disable,
  imports
} from '@/api/member/member'

export default {
  name: 'Member',
  components: { Pagination, ExcelImport },
  data() {
    return {
      name: '会员',
      height: 680,
      loading: false,
      idkey: 'member_id',
      exps: [{ exp: 'like', name: '包含' }],
      query: {
        page: 1,
        limit: getPageLimit(),
        search_field: 'nickname',
        search_exp: 'like',
        date_field: 'create_time'
      },
      data: [],
      count: 0,
      dialog: false,
      dialogTitle: '',
      model: {
        member_id: '',
        avatar_id: 0,
        avatar_url: '',
        tag_ids: [],
        group_ids: [],
        nickname: '',
        username: '',
        password: '',
        phone: '',
        email: '',
        name: '',
        gender: 0,
        region_id: '',
        remark: '',
        sort: 250,
        api_ids: [],
        thirds: []
      },
      rules: {
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      genders: [],
      platforms: [],
      applications: [],
      regionData: [],
      regionProps: {
        checkStrictly: true,
        value: 'region_id',
        label: 'region_name',
        emitPath: false
      },
      regionQueryProps: {
        checkStrictly: true,
        value: 'region_id',
        label: 'region_name',
        multiple: true,
        emitPath: false
      },
      tagData: [],
      groupData: [],
      selection: [],
      selectIds: '',
      selectTitle: '操作',
      selectDialog: false,
      selectType: '',
      region_id: 0,
      tag_ids: [],
      group_ids: [],
      password: '',
      is_super: 0,
      is_disable: 0,
      exportFileName: '',
      exportBookType: 'xlsx',
      exportAutoWidth: false,
      apiProps: { label: 'api_name', children: 'children' },
      apiCheckAll: false,
      apiExpandAll: false,
      thirdUnbindDialog: false,
      thirdUnbindModel: {},
      thirdUnbindLoad: false
    }
  },
  created() {
    this.height = screenHeight()
    this.list()
  },
  methods: {
    checkPermission,
    // 列表
    list() {
      this.loading = true
      list(this.query)
        .then((res) => {
          this.data = res.data.list
          this.count = res.data.count
          this.genders = res.data.genders
          this.platforms = res.data.platforms
          this.applications = res.data.applications
          this.regionData = res.data.region
          this.tagData = res.data.tag
          this.groupData = res.data.group
          this.exps = res.data.exps
          this.loading = false
        })
        .catch(() => {
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
          this.model.api_tree = []
          this.model.thirds = []
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
        } else {
          ElMessage.error('请完善必填项（带红色星号*）')
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
      this.apiExpandAll = false
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
        if (selectType === 'region') {
          this.selectTitle = this.name + '修改所在地'
        } else if (selectType === 'edittag') {
          this.selectTitle = this.name + '修改标签'
        } else if (selectType === 'editgroup') {
          this.selectTitle = this.name + '修改分组'
        } else if (selectType === 'repwd') {
          this.selectTitle = this.name + '重置密码'
        } else if (selectType === 'super') {
          this.selectTitle = this.name + '是否超会'
        } else if (selectType === 'disable') {
          this.selectTitle = this.name + '是否禁用'
        } else if (selectType === 'dele') {
          this.selectTitle = this.name + '删除'
        } else if (selectType === 'export') {
          var date = new Date()
          var month = date.getMonth() + 1
          month = month < 10 ? '0' + month : month
          this.exportFileName = this.name + date.getFullYear() + '-' + month + '-' + date.getDate()
          this.selectTitle = this.name + '导出'
        } else if (selectType === 'import') {
          this.selectTitle = this.name + '导入'
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
        if (selectType === 'region') {
          this.region(this.selection)
        } else if (selectType === 'edittag') {
          this.edittag(this.selection)
        } else if (selectType === 'editgroup') {
          this.editgroup(this.selection)
        } else if (selectType === 'repwd') {
          this.repwd(this.selection)
        } else if (selectType === 'super') {
          this.issuper(this.selection, true)
        } else if (selectType === 'disable') {
          this.disable(this.selection, true)
        } else if (selectType === 'dele') {
          this.dele(this.selection)
        } else if (selectType === 'export') {
          this.export(this.selection)
        } else if (selectType === 'import') {
          this.import(this.selection)
        }
        this.selectDialog = false
      }
    },
    // 修改所在地
    region(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        region({
          ids: this.selectGetIds(row),
          region_id: this.region_id
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
    // 修改标签
    edittag(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        edittag({
          ids: this.selectGetIds(row),
          tag_ids: this.tag_ids
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
    // 修改分组
    editgroup(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        editgroup({
          ids: this.selectGetIds(row),
          group_ids: this.group_ids
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
    // 重置密码
    repwd(row) {
      if (!row.length) {
        this.selectAlert()
      } else {
        if (!this.password) {
          ElMessage.error('请输入新密码')
        } else {
          this.loading = true
          repwd({
            ids: this.selectGetIds(row),
            password: this.password
          })
            .then((res) => {
              this.list()
              ElMessage.success(res.msg)
            })
            .catch(() => {
              this.loading = false
            })
        }
      }
    },
    // 是否超会
    issuper(row, select = false) {
      if (!row.length) {
        this.selectAlert()
      } else {
        this.loading = true
        var is_super = row[0].is_super
        if (select) {
          is_super = this.is_super
        }
        issuper({
          ids: this.selectGetIds(row),
          is_super: is_super
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
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 导入，results数据，header表头
    imports({ results, header }) {
      this.loading = true
      imports({
        import: results
      })
        .then((res) => {
          this.list()
          ElMessage.success(res.msg)
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 导出
    export(row) {
      this.loading = true
      import('@/components/ExcelExport/index').then((excel) => {
        const header = [
          { member_id: 'ID' },
          { nickname: '昵称' },
          { username: '用户名' },
          { phone: '手机' },
          { email: '邮箱' },
          { is_super: '超会' },
          { is_disable: '禁用' },
          { remark: '备注' },
          { create_time: '注册时间' }
        ]
        excel.excelExport(
          row,
          header,
          this.exportFileName,
          this.exportBookType,
          this.exportAutoWidth
        )
        this.loading = false
      })
    },
    // 权限展开
    apiExpandAllChange() {
      const expanded = this.apiExpandAll
      const length = this.$refs.apiRef.store._getAllNodes().length
      for (let i = 0; i < length; i++) {
        this.$refs.apiRef.store._getAllNodes()[i].expanded = expanded
      }
    },
    // 第三方账号解绑
    thirdUnbindBtn(row) {
      this.thirdUnbindDialog = true
      this.thirdUnbindModel = row
    },
    thirdUnbindSubmit() {
      const row = this.thirdUnbindModel
      if (!row) {
        ElMessageBox.alert('请选择需要操作的' + this.name + '第三方账号', '提示', {
          type: 'warning',
          callback: () => {}
        })
      } else {
        this.thirdUnbindLoad = true
        dele({
          ids: [row.third_id],
          type: 'third'
        })
          .then((res) => {
            var id = {}
            id[this.idkey] = row[this.idkey]
            info(id)
              .then((res) => {
                this.model.thirds = res.data.thirds
              })
              .catch(() => {})
            this.thirdUnbindLoad = false
            this.thirdUnbindDialog = false
            ElMessage.success(res.msg)
          })
          .catch(() => {
            this.thirdUnbindLoad = false
          })
      }
    },
    // 第三方账号是否禁用
    thirdDisable(row) {
      var id = {}
      id[this.idkey] = row[this.idkey]
      disable({
        ids: [row.third_id],
        is_disable: row.is_disable,
        type: 'third'
      })
        .then((res) => {
          info(id)
            .then((res) => {
              this.model.thirds = res.data.thirds
            })
            .catch(() => {})
          ElMessage.success(res.msg)
        })
        .catch(() => {
          info(id)
            .then((res) => {
              this.model.thirds = res.data.thirds
            })
            .catch(() => {})
        })
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
