<template>
  <div v-loading="loadup" class="app-container">
    <!-- 查询/添加 -->
    <div class="filter-container">
      <el-row :gutter="0">
        <el-col :xs="24" :sm="20">
          <el-select v-model="query.search_field" class="filter-item" style="width:110px;" placeholder="">
            <el-option value="file_name" label="文件名称" />
            <el-option value="file_id" label="文件ID" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item" style="width:200px;" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="filter-item" style="width:110px;" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
          </el-select>
          <el-date-picker
            v-model="query.date_value"
            type="daterange"
            class="filter-item"
            style="width: 240px;"
            range-separator="-"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
          <el-button class="filter-item" type="primary" @click="search()">查询</el-button>
          <el-button class="filter-item" @click="refresh()">刷新</el-button>
        </el-col>
        <el-col :xs="24" :sm="4" style="text-align:right;">
          <el-button class="filter-item" style="margin-right:5px" title="回收站" @click="recover()">回收站</el-button>
          <el-upload
            name="file"
            class="filter-item"
            :limit="uploadLimit"
            :file-list="uploadFilelist"
            :multiple="true"
            :show-file-list="false"
            :auto-upload="true"
            :action="uploadAction"
            :headers="uploadHeaders"
            :data="uploadData"
            :before-upload="uploadBefore"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-change="uploadChange"
            :on-exceed="uploadExceed"
          >
            <el-button type="primary" title="上传文件" @click="uploadClear">上传</el-button>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <!-- 列表 -->
    <el-row :gutter="6">
      <!-- 筛选条件 -->
      <el-col :span="4">
        <el-row :gutter="0">
          <el-col :span="20"><el-button type="text" style="color:inherit">分组</el-button></el-col>
          <el-col :span="4"><el-button type="text" icon="el-icon-plus" title="添加分组" @click="groupAdd()" /></el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24" style="padding-left:10px">
            <el-link :type="query.group_id===''?'primary':''" :underline="false" style="height:26px;" @click="groupingSelect('')">全部</el-link>
          </el-col>
          <el-col :span="24" style="padding-left:10px">
            <el-link :type="query.group_id===0?'primary':''" :underline="false" style="height:26px;" @click="groupingSelect(0)">未分组</el-link>
          </el-col>
          <el-col v-for="item in group" :key="item.group_id" :span="24" style="padding-left:10px;height:26px;">
            <el-row :gutter="0">
              <el-col :span="16">
                <el-link :type="query.group_id==item.group_id?'primary':''" :underline="false" @click="groupingSelect(item.group_id)">{{ item.group_name }}</el-link>
              </el-col>
              <el-col :span="4">
                <el-link v-if="query.group_id==item.group_id" type="primary" icon="el-icon-edit" :underline="false" title="修改分组" @click="groupEdit(item)" />
              </el-col>
              <el-col :span="4">
                <el-link v-if="query.group_id==item.group_id" type="primary" icon="el-icon-delete" :underline="false" title="删除分组" @click="groupDele([item])" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24"><el-button type="text" style="color:inherit">类型</el-button></el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24" style="padding-left:10px">
            <el-link :type="query.file_type==''?'primary':''" :underline="false" style="height:26px;" @click="typeSelect('')">全部</el-link>
          </el-col>
          <el-col v-for="(item, index) in filetype" :key="index" :span="24" style="padding-left:10px">
            <el-link :type="query.file_type==index?'primary':''" :underline="false" style="height:26px;" @click="typeSelect(index)">{{ item }}</el-link>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24"><el-button type="text" style="color:inherit">状态</el-button></el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24" style="padding-left:10px">
            <el-link :type="query.is_disable===''?'primary':''" :underline="false" style="height:26px;" @click="disableSelect('')">全部</el-link>
          </el-col>
          <el-col :span="24" style="padding-left:10px">
            <el-link :type="query.is_disable===0?'primary':''" :underline="false" style="height:26px;" @click="disableSelect(0)">已启用</el-link>
          </el-col>
          <el-col :span="24" style="padding-left:10px">
            <el-link :type="query.is_disable===1?'primary':''" :underline="false" style="height:26px;" @click="disableSelect(1)">已禁用</el-link>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24"><el-button type="text" style="color:inherit">上传</el-button></el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24" style="padding-left:10px">
            <el-link :type="query.is_front===''?'primary':''" :underline="false" style="height:26px;" @click="frontSelect('')">全部</el-link>
          </el-col>
          <el-col :span="24" style="padding-left:10px">
            <el-link :type="query.is_front===0?'primary':''" :underline="false" style="height:26px;" @click="frontSelect(0)">后台</el-link>
          </el-col>
          <el-col :span="24" style="padding-left:10px">
            <el-link :type="query.is_front===1?'primary':''" :underline="false" style="height:26px;" @click="frontSelect(1)">前台</el-link>
          </el-col>
        </el-row>
      </el-col>
      <!-- 文件卡片 -->
      <el-col v-if="count > 0" :span="20" class="dialog-body" :style="{height:height-50+'px'}">
        <el-row :gutter="6">
          <el-checkbox-group v-model="checkedIds" @change="checkedChange">
            <el-col v-for="(item, index) in data" :key="index" :span="4" style="margin-bottom:6px;text-align:center">
              <el-card class="file-card" :body-style="{ minWidth:'16.5%', height:(height-80)/3+'px', padding:'0 6px' }">
                <div class="file-ext">
                  <span>{{ item.file_ext }}</span>
                </div>
                <div style="text-align:left">
                  <el-checkbox :key="item.file_id" :label="item.file_id" />
                </div>
                <div :style="{width:'100%',height:((height-80)/3)-((height-80)/3*0.33)+'px'}">
                  <el-image v-if="item.file_type=='image'" fit="contain" :src="item.file_url" :preview-src-list="[item.file_url]" title="点击查看大图" style="height:100%;" />
                  <video v-else-if="item.file_type=='video'" width="100%" height="100%" controls>
                    <source :src="item.file_url" type="video/mp4">
                    <object :data="item.file_url" width="100%" height="100%">
                      <embed :src="item.file_url" width="100%" height="100%">
                    </object>
                  </video>
                  <audio v-else-if="item.file_type=='audio'" width="100%" height="100%" controls>
                    <source :src="item.file_url" type="audio/mp3">
                    <embed :src="item.file_url" width="100%" height="100%">
                  </audio>
                  <el-image v-else-if="item.file_type=='word'" :src="item.file_url" style="width:100%; height:100%;">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-document" style="font-size:50px" />
                    </div>
                  </el-image>
                  <el-image v-else :src="item.file_url" style="width:100%; height:100%;">
                    <div slot="error" class="image-slot">
                      <i class="el-icon-folder" style="font-size:50px" />
                    </div>
                  </el-image>
                </div>
                <div style="padding-top:6px;">
                  <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;padding-right:0;font-size:14px;" :title="item.file_name">
                    {{ item.file_name }}
                  </span>
                  <div class="bottom clearfix">
                    <el-button size="mini" type="text" @click="edit(item,'name')">编辑</el-button>
                    <el-button size="mini" type="text" @click="edit(item,'url')">链接</el-button>
                    <el-button v-if="item.is_disable" size="mini" type="text" title="点击启用文件" @click="disable([item.file_id],0)">启用</el-button>
                    <el-button v-else size="mini" type="text" title="点击禁用文件" @click="disable([item.file_id],1)">禁用</el-button>
                    <el-button size="mini" type="text" @click="dele([item.file_id])">删除</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-checkbox-group>
        </el-row>
      </el-col>
      <el-col v-else :span="20">
        <el-empty description="暂无文件" />
      </el-col>
    </el-row>
    <!-- 批量操作 -->
    <el-row v-show="count > 0" :gutter="0">
      <el-col :span="24">
        <el-checkbox v-model="checkAll" border size="mini" :indeterminate="checkAllInd" @change="checkAllChange">全选</el-checkbox>
        <el-button size="mini" type="text" @click="grouping(checkedIds)">分组</el-button>
        <el-button size="mini" type="text" @click="disable(checkedIds,0)">启用</el-button>
        <el-button size="mini" type="text" @click="disable(checkedIds,1)">禁用</el-button>
        <el-button size="mini" type="text" @click="dele(checkedIds)">删除</el-button>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <pagination v-show="count > 0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 文件 -->
    <el-row v-show="fileType" :gutter="0">
      <el-col :span="24" style="text-align:right;margin-top:20px;">
        <el-button @click="fileCancel()">取消</el-button>
        <el-button type="primary" @click="fileSubmit(checkedIds)">确定</el-button>
      </el-col>
    </el-row>
    <!-- 修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" width="50%" top="1vh" :before-close="cancel">
      <el-form ref="ref" :rules="rules" :model="model" class="dialog-body" label-width="100px" :style="{height:height+'px'}">
        <el-form-item label="文件分组" prop="group_id">
          <el-select v-model="model.group_id" class="filter-item" placeholder="">
            <el-option v-for="(item, index) in group" :key="index" :value="item.group_id" :label="item.group_name" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件类型" prop="file_type">
          <el-select v-model="model.file_type" placeholder="">
            <el-option v-for="(item, index) in filetype" :key="index" :value="index" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁用" prop="is_disable">
          <el-select v-model="model.is_disable" class="filter-item" placeholder="">
            <el-option :value="0" label="否" />
            <el-option :value="1" label="是" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件排序" prop="sort">
          <el-input v-model="model.sort" type="number" placeholder="200" />
        </el-form-item>
        <el-form-item label="文件名称" prop="file_name">
          <el-input v-model="model.file_name" placeholder="" :title="model.file_name">
            <el-link slot="append" :href="model.file_url" :underline="false" :download="model.file_url" target="_blank">下载</el-link>
          </el-input>
        </el-form-item>
        <el-form-item label="文件路径" prop="file_path">
          <el-input v-model="model.file_path" placeholder="" :title="model.file_path" disabled>
            <el-button slot="append" @click="copy(model.file_path, $event)">复制</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="文件链接" prop="file_url">
          <el-input v-model="model.file_url" placeholder="" :title="model.file_url" disabled>
            <el-button slot="append" @click="copy(model.file_url, $event)">复制</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="存储方式" prop="storage">
          <el-select v-model="model.storage" placeholder="" disabled>
            <el-option v-for="(item, index) in storage" :key="index" :value="index" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件大小" prop="file_size">
          <el-input v-model="model.file_size" placeholder="" disabled />
        </el-form-item>
        <el-form-item label="文件后缀" prop="file_ext">
          <el-input v-model="model.file_ext" placeholder="" disabled />
        </el-form-item>
        <el-form-item label="文件哈希" prop="file_hash">
          <el-input v-model="model.file_hash" placeholder="" disabled />
        </el-form-item>
        <el-form-item v-if="model.file_id" label="添加时间" prop="create_time">
          <el-input v-model="model.create_time" disabled />
        </el-form-item>
        <el-form-item v-if="model.file_id" label="修改时间" prop="update_time">
          <el-input v-model="model.update_time" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 分组 -->
    <el-dialog title="文件分组" :visible.sync="groupingDialog">
      <el-form ref="groupingRef" class="dialog-body" label-width="100px">
        <el-form-item label="文件分组" prop="group_id">
          <el-select v-model="group_id" class="filter-item" placeholder="">
            <el-option v-for="(item, index) in group" :key="index" :value="item.group_id" :label="item.group_name" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupingCancel">取消</el-button>
        <el-button type="primary" @click="groupingSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 分组管理 -->
    <el-dialog :title="groupTitle" :visible.sync="groupDialog" :before-close="groupCancel">
      <el-form ref="groupRef" :rules="groupRules" :model="groupModel" label-width="100px" class="dialog-body">
        <el-form-item label="名称" prop="group_name">
          <el-input v-model="groupModel.group_name" placeholder="请输入分组名称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="group_desc">
          <el-input v-model="groupModel.group_desc" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="group_sort">
          <el-input v-model="groupModel.group_sort" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupCancel">取消</el-button>
        <el-button type="primary" @click="groupSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 回收站 -->
    <el-dialog :title="recoverDialogTitle" :visible.sync="recoverDialog" width="80%" top="1vh">
      <!-- 回收站查询 -->
      <div class="filter-container">
        <el-row :gutter="0">
          <el-col :xs="24" :sm="24">
            <el-select v-model="recoverQuery.search_field" class="filter-item" style="width:110px;" placeholder="">
              <el-option value="file_name" label="文件名称" />
              <el-option value="file_id" label="文件ID" />
            </el-select>
            <el-input v-model="recoverQuery.search_value" class="filter-item" style="width:200px;" placeholder="搜索内容" clearable />
            <el-select v-model="recoverQuery.date_field" class="filter-item" style="width:110px;" placeholder="时间类型">
              <el-option value="delete_time" label="删除时间" />
              <el-option value="update_time" label="修改时间" />
            </el-select>
            <el-date-picker
              v-model="recoverQuery.date_value"
              type="daterange"
              class="filter-item"
              style="width: 240px;"
              range-separator="-"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <el-button class="filter-item" type="primary" @click="recoverSearch()">查询</el-button>
            <el-button class="filter-item" @click="recoverRefresh()">刷新</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="6">
        <!-- 回收站分组、类型 -->
        <el-col :span="4">
          <el-row :gutter="0">
            <el-col :span="20"><el-button type="text" style="color:inherit">分组</el-button></el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="24" style="padding-left:10px">
              <el-link :type="recoverQuery.group_id==''?'primary':''" :underline="false" style="height:26px;" @click="recoverGroupSelect('')">全部</el-link>
            </el-col>
            <el-col v-for="item in group" :key="item.group_id" :span="24" style="padding-left:10px;height:26px;">
              <el-row :gutter="0">
                <el-col :span="16">
                  <el-link :type="recoverQuery.group_id==item.group_id?'primary':''" :underline="false" @click="recoverGroupSelect(item.group_id)">{{ item.group_name }}</el-link>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="24"><el-button type="text" style="color:inherit">类型</el-button></el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="24" style="padding-left:10px">
              <el-link :type="recoverQuery.file_type==''?'primary':''" :underline="false" style="height:26px;" @click="recoverTypeSelect('')">全部</el-link>
            </el-col>
            <el-col v-for="(item, index) in filetype" :key="index" :span="24" style="padding-left:10px">
              <el-link :type="recoverQuery.file_type==index?'primary':''" :underline="false" style="height:26px;" @click="recoverTypeSelect(index)">{{ item }}</el-link>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="24"><el-button type="text" style="color:inherit">状态</el-button></el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="24" style="padding-left:10px">
              <el-link :type="recoverQuery.is_disable===''?'primary':''" :underline="false" style="height:26px;" @click="recoverDisableSelect('')">全部</el-link>
            </el-col>
            <el-col :span="24" style="padding-left:10px">
              <el-link :type="recoverQuery.is_disable===0?'primary':''" :underline="false" style="height:26px;" @click="recoverDisableSelect(0)">已启用</el-link>
            </el-col>
            <el-col :span="24" style="padding-left:10px">
              <el-link :type="recoverQuery.is_disable===1?'primary':''" :underline="false" style="height:26px;" @click="recoverDisableSelect(1)">已禁用</el-link>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="24"><el-button type="text" style="color:inherit">上传</el-button></el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="24" style="padding-left:10px">
              <el-link :type="recoverQuery.is_front===''?'primary':''" :underline="false" style="height:26px;" @click="recoverFrontSelect('')">全部</el-link>
            </el-col>
            <el-col :span="24" style="padding-left:10px">
              <el-link :type="recoverQuery.is_front===0?'primary':''" :underline="false" style="height:26px;" @click="recoverFrontSelect(0)">后台</el-link>
            </el-col>
            <el-col :span="24" style="padding-left:10px">
              <el-link :type="recoverQuery.is_front===1?'primary':''" :underline="false" style="height:26px;" @click="recoverFrontSelect(1)">前台</el-link>
            </el-col>
          </el-row>
        </el-col>
        <!-- 回收站列表 -->
        <el-col :span="20" class="dialog-body" :style="{height:height-50+'px'}">
          <el-row v-if="recoverCount > 0" :gutter="6">
            <el-checkbox-group v-model="recoverCheckedIds" @change="recoverCheckedChange">
              <el-col v-for="(item, index) in recoverData" :key="index" :span="4" style="margin-bottom:6px;text-align:center">
                <el-card class="file-card" :body-style="{ minWidth:'16.5%', height:(height-80)/3+'px',padding:'0 6px' }">
                  <div class="file-ext">
                    <span>{{ item.file_ext }}</span>
                  </div>
                  <div style="text-align:left">
                    <el-checkbox :key="item.file_id" :label="item.file_id" />
                  </div>
                  <div :style="{width:'100%',height:((height-80)/3)-((height-80)/3*0.33)+'px'}">
                    <el-image v-if="item.file_type=='image'" fit="contain" :src="item.file_url" :preview-src-list="[item.file_url]" title="点击查看大图" style="height:100%;" />
                    <video v-else-if="item.file_type=='video'" width="100%" height="100%" controls>
                      <source :src="item.file_url" type="video/mp4">
                      <object :data="item.file_url" width="100%" height="100%">
                        <embed :src="item.file_url" width="100%" height="100%">
                      </object>
                    </video>
                    <audio v-else-if="item.file_type=='audio'" width="100%" height="100%" controls>
                      <source :src="item.file_url" type="audio/mp3">
                      <embed :src="item.file_url" width="100%" height="100%">
                    </audio>
                    <el-image v-else-if="item.file_type=='word'" :src="item.file_url" style="max-width:100%; max-height:100%;">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-document" style="font-size:50px" />
                      </div>
                    </el-image>
                    <el-image v-else :src="item.file_url" style="max-width:100%; max-height:100%;">
                      <div slot="error" class="image-slot">
                        <i class="el-icon-folder" style="font-size:50px" />
                      </div>
                    </el-image>
                  </div>
                  <div style="padding-top:6px;">
                    <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:block; padding-right:0; font-size:14px;" :title="item.file_name">
                      {{ item.file_name }}
                    </span>
                    <div class="bottom clearfix">
                      <el-button size="mini" type="text" @click="recoverReco([item.file_id])">恢复</el-button>
                      <el-button size="mini" type="text" @click="recoverDele([item.file_id])">删除</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-checkbox-group>
          </el-row>
          <el-row v-else :gutter="6">
            <el-col :span="24">
              <el-empty description="暂无文件" />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row v-show="recoverCount > 0" :gutter="0">
        <el-col :span="24">
          <el-checkbox v-model="recoverCheckAll" border size="mini" :indeterminate="recoverCheckAllInd" @change="recoverCheckAllChange">全选</el-checkbox>
          <el-button size="mini" type="text" @click="recoverReco(recoverCheckedIds)">恢复</el-button>
          <el-button size="mini" type="text" @click="recoverDele(recoverCheckedIds)">删除</el-button>
        </el-col>
      </el-row>
      <!-- 回收站分页 -->
      <pagination v-show="recoverCount > 0" :total="recoverCount" :page.sync="recoverQuery.page" :limit.sync="recoverQuery.limit" @pagination="recoverList" />
    </el-dialog>
  </div>
</template>

<script>
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import permission from '@/directive/permission/index.js' // 权限判断指令
import clip from '@/utils/clipboard'
import { getAdminToken } from '@/utils/auth'
import { group, list, info, add, edit, dele, disable, grouping, recover, recoverReco, recoverDele } from '@/api/file/file'
import { info as groupInfo, add as groupAdd, edit as groupEdit, dele as groupDele } from '@/api/file/group'

export default {
  name: 'FileManage',
  components: { Pagination },
  directives: { permission },
  props: {
    groupId: { type: String, default: '' },
    fileType: { type: String, default: '' }
  },
  data() {
    return {
      name: '文件',
      height: 680,
      loadup: false,
      loading: false,
      query: {
        page: 1,
        limit: 18,
        group_id: '',
        file_type: '',
        is_disable: '',
        is_front: 0,
        search_field: 'file_name',
        date_field: 'create_time'
      },
      data: [],
      count: 1,
      dialog: false,
      dialogTitle: '',
      model: {
        file_id: '',
        group_id: '',
        file_name: '',
        file_type: '',
        file_url: '',
        sort: 200
      },
      group: [],
      storage: [],
      filetype: [],
      checkIds: [],
      checkAll: false,
      checkAllInd: false,
      checkedIds: [],
      groupingDialog: false,
      group_id: 0,
      uploadAction: add(),
      uploadHeaders: { AdminToken: getAdminToken() },
      uploadData: { group_id: 0 },
      uploadLimit: 9,
      uploadFilelist: [],
      rules: {
        file_name: [{ required: true, message: '请输入文件名称', trigger: 'blur' }]
      },
      groupDialog: false,
      groupTitle: '',
      groupModel: {
        group_id: '',
        group_name: '',
        group_desc: '',
        group_sort: 50
      },
      groupRules: {
        group_name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }]
      },
      recoverCheckIds: [],
      recoverCheckAll: false,
      recoverCheckAllInd: false,
      recoverCheckedIds: [],
      recoverDialog: false,
      recoverDialogTitle: '',
      recoverLoad: false,
      recoverData: [],
      recoverCount: 0,
      recoverQuery: {
        page: 1,
        limit: 18,
        group_id: '',
        file_type: '',
        is_disable: '',
        is_front: '',
        search_field: 'file_name',
        date_field: 'delete_time'
      },
      recoverSelection: []
    }
  },
  watch: {
    'fileType': function(val, oldval) {
      this.query.group_id = this.groupId
      this.query.file_type = this.fileType
      this.list()
    }
  },
  created() {
    if (this.groupId) {
      this.query.group_id = this.groupId
    }
    if (this.fileType) {
      this.query.file_type = this.fileType
      this.query.is_disable = 0
      this.height = screenHeight(310)
    } else {
      this.height = screenHeight()
    }
    this.groupList()
    this.list()
  },
  methods: {
    // 列表
    list() {
      this.loading = true
      list(this.query).then(res => {
        this.data = res.data.list
        this.count = res.data.count
        this.checkIds = res.data.ids
        this.filetype = res.data.filetype
        this.storage = res.data.storage
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询
    search() {
      this.query.page = 1
      this.list()
    },
    // 上传文件
    uploadBefore() {
      this.loadup = true
    },
    uploadSuccess(res) {
      if (res.code === 200) {
        this.refresh()
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
      this.loadup = false
    },
    uploadError(res) {
      this.$message.error(res.msg || '上传出错')
      this.loadup = false
    },
    uploadChange() {
    },
    uploadExceed() {
      this.$message.error(`每次最多选择 ${this.uploadLimit} 个文件`)
    },
    uploadClear() {
      this.uploadFilelist = []
    },
    // 修改
    edit(row) {
      this.dialog = true
      this.loading = true
      this.dialogTitle = this.name + '修改：' + row.file_id
      info({
        file_id: row.file_id
      }).then(res => {
        this.reset(res.data)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 删除
    dele(row) {
      if (row.length === 0) {
        this.checkAlert()
      } else {
        var title = '删除' + this.name
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 个' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0]
          message = '确定要删除' + this.name + '吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          dele({
            file_ids: row
          }).then(res => {
            this.list()
            this.reset()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
    },
    // 刷新
    refresh() {
      this.query = this.$options.data().query
      this.groupList()
      this.list()
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
          if (this.model.file_id) {
            edit(this.model, 'post').then(res => {
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
      this.group_id = 0
      this.checkedIds = []
      this.checkAll = false
      this.checkAllInd = false
      if (this.$refs['ref'] !== undefined) {
        this.$refs['ref'].resetFields()
      }
    },
    // 分组
    grouping(row, group_id = 0) {
      if (row.length === 0) {
        this.checkAlert()
      } else {
        this.groupingDialog = true
        this.checkedIds = row
        this.group_id = group_id
      }
    },
    groupingCancel() {
      this.reset()
      this.groupingDialog = false
    },
    groupingSubmit() {
      if (this.checkedIds.length === 0) {
        this.checkAlert()
      } else {
        this.loading = true
        grouping({
          file_ids: this.checkedIds,
          group_id: this.group_id
        }).then(res => {
          this.list()
          this.reset()
          this.groupingDialog = false
          this.$message.success(res.msg)
        }).catch(() => {
          this.list()
          this.loading = false
        })
      }
    },
    groupingSelect(group_id = '') {
      this.query.group_id = group_id
      this.uploadData.group_id = group_id
      this.list()
    },
    // 类型
    typeSelect(file_type = '') {
      this.query.file_type = file_type
      this.list()
    },
    // 状态
    disableSelect(is_disable = '') {
      this.query.is_disable = is_disable
      this.list()
    },
    // 上传
    frontSelect(is_front = '') {
      this.query.is_front = is_front
      this.list()
    },
    // 禁用启用
    disable(row, is_disable) {
      if (row.length === 0) {
        this.checkAlert()
      } else {
        if (is_disable === 1) {
          this.$confirm('禁用文件会对已使用该文件的业务造成影响！<br>确定要禁用文件吗？', '禁用文件', { type: 'warning', dangerouslyUseHTMLString: true }
          ).then(() => {
            this.loading = true
            disable({
              file_ids: row,
              is_disable: is_disable
            }).then(res => {
              this.list()
              this.reset()
              this.$message.success(res.msg)
            }).catch(() => {
              this.list()
              this.loading = false
            })
          }).catch(() => {})
        } else {
          this.loading = true
          disable({
            file_ids: row,
            is_disable: is_disable
          }).then(res => {
            this.list()
            this.reset()
            this.$message.success(res.msg)
          }).catch(() => {
            this.list()
            this.loading = false
          })
        }
      }
    },
    // 选择
    checkedChange(vals) {
      const checkedCount = vals.length
      this.checkAll = checkedCount === this.checkIds.length
      this.checkAllInd = checkedCount > 0 && checkedCount < this.checkIds.length
    },
    checkAllChange(val) {
      this.checkedIds = val ? this.checkIds : []
      this.checkAllInd = false
    },
    checkAlert(message = '') {
      this.$alert(message || '请选择需要操作的' + this.name, '提示', { confirmButtonText: '确定', type: 'warning', callback: action => {} })
    },
    // 复制
    copy(text, event) {
      clip(text, event)
    },
    // 分组管理
    groupList() {
      group().then(res => {
        this.group = res.data.list
      }).catch(res => {})
    },
    groupAdd() {
      this.groupDialog = true
      this.groupTitle = '分组添加'
      this.groupReset()
    },
    groupEdit(row) {
      this.groupDialog = true
      this.groupTitle = '分组修改：' + row.group_id
      groupInfo({
        group_id: row.group_id
      }).then(res => {
        this.groupReset(res.data)
      }).catch(res => {
        this.groupDialog = false
      })
    },
    groupCancel() {
      this.groupDialog = false
      this.groupReset()
    },
    groupSubmit() {
      this.$refs['groupRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.groupModel.group_id) {
            groupEdit(this.groupModel).then(res => {
              this.groupList()
              this.groupReset()
              this.groupDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            groupAdd(this.groupModel).then(res => {
              this.groupList()
              this.groupReset()
              this.groupDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    groupDele(row) {
      if (row.length === 0) {
        this.selectAlert()
      } else {
        var title = '删除分组'
        var message = '确定要删除选中的 <span style="color:red">' + row.length + ' </span> 条记录吗？'
        if (row.length === 1) {
          title = title + '：' + row[0].group_id
          message = '确定要删除分组 <span style="color:red">' + row[0].group_name + ' </span>吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          groupDele({
            group: row
          }).then(res => {
            this.groupList()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => {})
      }
    },
    groupReset(row) {
      if (row) {
        this.groupModel = row
      } else {
        this.groupModel = this.$options.data().groupModel
      }
    },
    // 回收站显示
    recover() {
      this.recoverDialog = true
      this.recoverDialogTitle = this.name + '回收站'
      this.recoverList()
    },
    // 回收站列表
    recoverList() {
      this.recoverLoad = true
      this.recoverReset()
      recover(this.recoverQuery).then(res => {
        this.recoverData = res.data.list
        this.recoverCount = res.data.count
        this.recoverCheckIds = res.data.ids
        this.recoverLoad = false
      }).catch(() => {
        this.recoverLoad = false
      })
    },
    // 回收站分组筛选
    recoverGroupSelect(group_id = '') {
      this.recoverQuery.group_id = group_id
      this.recoverList()
    },
    // 回收站类型筛选
    recoverTypeSelect(file_type = '') {
      this.recoverQuery.file_type = file_type
      this.recoverList()
    },
    // 回收站上传类型
    recoverFrontSelect(is_front = '') {
      this.recoverQuery.is_front = is_front
      this.recoverList()
    },
    // 回收站状态筛选
    recoverDisableSelect(is_disable = '') {
      this.recoverQuery.is_disable = is_disable
      this.recoverList()
    },
    // 回收站查询
    recoverSearch() {
      this.recoverQuery.page = 1
      this.recoverList()
    },
    // 回收站刷新
    recoverRefresh() {
      this.recoverQuery = this.$options.data().recoverQuery
      this.recoverList()
    },
    // 回收站排序
    recoverSort(sort) {
      this.recoverQuery.sort_field = sort.prop
      this.recoverQuery.sort_value = ''
      if (sort.order === 'ascending') {
        this.recoverQuery.sort_value = 'asc'
        this.recoverList()
      }
      if (sort.order === 'descending') {
        this.recoverQuery.sort_value = 'desc'
        this.recoverList()
      }
    },
    // 回收站选择
    recoverCheckedChange(vals) {
      const recoverCheckedCount = vals.length
      this.recoverCheckAll = recoverCheckedCount === this.recoverCheckIds.length
      this.recoverCheckAllInd = recoverCheckedCount > 0 && recoverCheckedCount < this.recoverCheckIds.length
    },
    // 回收站全选
    recoverCheckAllChange(val) {
      this.recoverCheckedIds = val ? this.recoverCheckIds : []
      this.recoverCheckAllInd = false
    },
    // 回收站选择提示
    recoverCheckAlert(message = '') {
      this.$alert(message || '请选择需要操作的' + this.name, '提示', { confirmButtonText: '确定', type: 'warning', callback: action => {} })
    },
    // 回收站恢复
    recoverReco(row) {
      if (row.length === 0) {
        this.recoverCheckAlert()
      } else {
        var title = '恢复' + this.name
        var message = '确定要恢复选中的 <span style="color:red">' + row.length + ' </span> 个' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0]
          message = '确定要恢复' + this.name + '吗？'
        }
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.recoverLoad = true
          recoverReco({
            file_ids: row
          }).then(res => {
            this.list()
            this.recoverList()
            this.$message.success(res.msg)
          }).catch(() => {
            this.recoverLoad = false
          })
        }).catch(() => {})
      }
    },
    // 回收站删除
    recoverDele(row) {
      if (row.length === 0) {
        this.recoverCheckAlert()
      } else {
        var title = '彻底删除' + this.name
        var message = '确定要彻底删除选中的 <span style="color:red">' + row.length + ' </span> 个' + this.name + '吗？'
        if (row.length === 1) {
          title = title + '：' + row[0]
          message = '确定要彻底删除' + this.name + '吗？'
        }
        message = '彻底删除文件会对已使用该文件的业务造成影响！<br>' + message
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.recoverLoad = true
          recoverDele({
            file_ids: row
          }).then(res => {
            this.recoverList()
            this.$message.success(res.msg)
          }).catch(() => {
            this.recoverLoad = false
          })
        }).catch(() => {})
      }
    },
    // 回收站重置
    recoverReset() {
      this.recoverCheckedIds = []
      this.recoverCheckAll = false
      this.recoverCheckAllInd = false
    },
    // 文件取消/确定
    fileCancel() {
      this.checkedIds = []
      this.$emit('file-lists', null)
    },
    fileSubmit(row) {
      if (row.length === 0) {
        this.recoverCheckAlert('请选择文件')
      } else {
        const files = []
        const data = this.data
        const data_len = data.length
        const row_len = row.length
        for (let i = 0; i < data_len; i++) {
          for (let j = 0; j < row_len; j++) {
            if (data[i].file_id === row[j]) {
              files.push(data[i])
            }
          }
        }
        this.checkedIds = []
        this.$emit('file-lists', files, this.fileType)
      }
    }
  }
}
</script>

<style scoped>
.file-card{
  position: relative;
  overflow: hidden;
  background: #fff;
}
.file-ext{
  position: absolute;
  width: 100px;
  height: 100px;
  top: -66px;
  right: -66px;
  transform: rotate(45deg);
  z-index: 1000;
}
.file-ext span{
  display: block;
  position: absolute;
  width: 100px;
  bottom: 0;
  text-align: center;
  font-size: 14px;
  color: #fff;
  background: #C0C4CC;
}
</style>
