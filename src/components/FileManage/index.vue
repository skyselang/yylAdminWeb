<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="filter-container">
      <el-row>
        <el-col>
          <el-select v-model="query.search_field" class="filter-item ya-search-field" placeholder="搜索字段">
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
          <el-select v-model="query.search_exp" class="filter-item ya-search-exp">
            <el-option v-for="exp in exps" :key="exp.exp" :value="exp.exp" :label="exp.name" />
          </el-select>
          <el-input v-model="query.search_value" class="filter-item ya-search-value" placeholder="搜索内容" clearable />
          <el-select v-model="query.date_field" class="filter-item ya-date-field" placeholder="时间类型">
            <el-option value="create_time" label="添加时间" />
            <el-option value="update_time" label="修改时间" />
            <el-option v-if="recycle" value="delete_time" label="删除时间" />
          </el-select>
          <el-date-picker v-model="query.date_value" type="datetimerange" class="filter-item ya-date-value" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00','23:59:59']" value-format="yyyy-MM-dd HH:mm:ss" />
          <el-button class="filter-item" type="primary" title="查询/刷新" @click="search()">查询</el-button>
          <el-button class="filter-item" icon="el-icon-refresh" title="重置" @click="refresh()" />
          <el-button v-if="checkPermission(['admin/file.File/recycle'])" style="float:right" :type="recycle?'primary':''" @click="showRecycle">回收站</el-button>
          <el-radio-group v-model="showMode" style="float:right" @change="showChange">
            <el-radio-button label="card">卡片</el-radio-button>
            <el-radio-button label="table">表格</el-radio-button>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>
    <!-- 选中操作 -->
    <el-row>
      <el-col>
        <el-checkbox v-model="selectAll" style="margin-right:10px;top:-2px" border :indeterminate="selectAllInd" @change="selectAlls">全选</el-checkbox>
        <el-button title="修改分组" @click="selectOpen('editgroup')">分组</el-button>
        <el-button title="修改标签" @click="selectOpen('edittag')">标签</el-button>
        <el-button title="修改类型" @click="selectOpen('edittype')">类型</el-button>
        <el-button title="修改域名" @click="selectOpen('editdomain')">域名</el-button>
        <el-button title="是否禁用" @click="selectOpen('disable')">禁用</el-button>
        <el-button title="删除文件" @click="selectOpen('dele')">删除</el-button>
        <el-button title="添加文件" @click="add()">添加</el-button>
        <el-button v-if="recycle" type="primary" @click="selectOpen('reco')">恢复</el-button>
        <el-upload v-else name="file" class="ya-upload" :limit="uploadLimit" :file-list="uploadFilelist" :multiple="true" :show-file-list="false" :auto-upload="true" :action="uploadAction" :headers="uploadHeaders" :data="uploadData" :accept="uploadAccept" :before-upload="uploadBefore" :on-success="uploadSuccess" :on-error="uploadError" :on-change="uploadChange" :on-exceed="uploadExceed">
          <el-button type="primary" title="上传文件" @click="uploadClear">上传</el-button>
        </el-upload>
        <!-- 排序 -->
        <el-select v-model="query.sort_field" class="filter-item ya-search-field ya-margin-left" filterable clearable placeholder="排序字段" @change="sort">
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
        <el-select v-model="query.sort_value" class="filter-item ya-search-field" filterable clearable placeholder="排序类型" @change="sort">
          <el-option value="asc" label="升序" />
          <el-option value="desc" label="降序" />
        </el-select>
        <!-- 分组筛选 -->
        <el-select v-model="query.group_id" class="filter-item ya-search-field ya-margin-left" filterable clearable placeholder="分组" @change="groupSelect">
          <el-option v-for="(item, index) in groupData" :key="index" :value="item.group_id" :label="item.group_name" />
        </el-select>
        <el-button-group>
          <el-button type="text" icon="el-icon-plus" :title="'添加'+groupName" @click="groupAdd()" />
          <el-button type="text" icon="el-icon-edit" :title="'修改'+groupName" @click="groupEdit()" />
          <el-button type="text" icon="el-icon-delete" :title="'删除'+groupName" @click="groupDele()" />
        </el-button-group>
        <!-- 标签筛选 -->
        <el-select v-model="query.tag_ids" class="filter-item ya-margin-left" filterable clearable multiple collapse-tags placeholder="标签" @change="tagSelect">
          <el-option v-for="(item, index) in tagData" :key="index" :value="item.tag_id" :label="item.tag_name" />
        </el-select>
        <el-button-group>
          <el-button type="text" icon="el-icon-plus" :title="'添加'+tagName" @click="tagAdd()" />
          <el-button type="text" icon="el-icon-edit" :title="'修改'+tagName" @click="tagEdit()" />
          <el-button type="text" icon="el-icon-delete" :title="'删除'+tagName" @click="tagDele()" />
        </el-button-group>
      </el-col>
    </el-row>
    <el-dialog :title="selectTitle" :visible.sync="selectDialog" top="20vh" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form label-width="120px">
        <el-form-item :label="name+'ID'" prop="">
          <el-input v-model="selectIds" type="textarea" :autosize="{minRows: 5, maxRows: 12}" disabled />
        </el-form-item>
        <el-form-item v-if="selectType==='editgroup'" label="文件分组" prop="">
          <el-select v-model="group_id" clearable>
            <el-option v-for="(item, index) in groupData" :key="index" :value="item.group_id" :label="item.group_name" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="selectType==='edittag'" label="文件标签" prop="">
          <el-select v-model="tag_ids" class="ya-width-100p" multiple clearable filterable>
            <el-option v-for="item in tagData" :key="item.tag_id" :label="item.tag_name" :value="item.tag_id" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="selectType==='edittype'" label="文件类型" prop="file_type">
          <el-select v-model="file_type">
            <el-option v-for="(item, index) in file_types" :key="index" :value="index" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="selectType==='editdomain'" label="文件域名" prop="">
          <el-input v-model="domain" clearable />
          <span class="ya-margin-left">修改文件域名会影响文件的访问，请确认无误后修改！</span>
        </el-form-item>
        <el-form-item v-else-if="selectType==='disable'" label="是否禁用" prop="">
          <el-switch v-model="is_disable" :active-value="1" :inactive-value="0" />
          <span v-if="is_disable" class="ya-margin-left" style="color:red">禁用会对已使用该文件的业务造成影响！</span>
        </el-form-item>
        <el-form-item v-else-if="selectType==='dele'" label="" prop="">
          <span v-if="recycle" class="ya-margin-left" style="color:red">确定要彻底删除选中的{{ name }}吗？删除后不可恢复！</span>
          <span v-else class="ya-margin-left" style="color:red">确定要删除选中的{{ name }}吗？删除会对已使用该文件的业务造成影响！</span>
        </el-form-item>
        <el-form-item v-else-if="selectType==='reco'" label="" prop="">
          <span class="ya-margin-left" style="color:red">确定要恢复选中的{{ name }}吗？</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectCancel">取消</el-button>
        <el-button type="primary" @click="selectSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 分组管理 -->
    <el-dialog :title="groupTitle" :visible.sync="groupDialog" :before-close="groupCancel" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="groupRef" :rules="groupRules" :model="groupModel" label-width="100px" class="dialog-body">
        <el-form-item label="名称" prop="group_name">
          <el-input v-model="groupModel.group_name" placeholder="请输入分组名称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="group_desc">
          <el-input v-model="groupModel.group_desc" type="textarea" autosize clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="groupModel.remark" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="groupModel.sort" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupCancel">取消</el-button>
        <el-button type="primary" @click="groupSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 标签管理 -->
    <el-dialog :title="tagTitle" :visible.sync="tagDialog" :before-close="tagCancel" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="tagRef" :rules="tagRules" :model="tagModel" label-width="100px" class="dialog-body">
        <el-form-item label="名称" prop="tag_name">
          <el-input v-model="tagModel.tag_name" placeholder="请输入标签名称" clearable />
        </el-form-item>
        <el-form-item label="描述" prop="tag_desc">
          <el-input v-model="tagModel.tag_desc" type="textarea" autosize clearable />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="tagModel.remark" placeholder="" clearable />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="tagModel.sort" type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tagCancel">取消</el-button>
        <el-button type="primary" @click="tagSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 列表筛选 -->
    <el-row :gutter="3">
      <!-- 筛选 -->
      <el-col :span="2" class="dialog-body" :style="{height:height+'px'}">
        <!-- 类型筛选 -->
        <el-row>
          <el-col>
            <el-button type="text" class="ya-color-inherit">类型：</el-button>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.file_type===''?'primary':''" :underline="false" class="ya-height-26" @click="typeSelect('')">全部</el-link>
          </el-col>
          <el-col v-for="(item, index) in file_types" :key="index" class="ya-padding-left">
            <el-link :type="query.file_type===index?'primary':''" :underline="false" class="ya-height-26" @click="typeSelect(index)">{{ item }}</el-link>
          </el-col>
        </el-row>
        <!-- 禁用筛选 -->
        <el-row>
          <el-col>
            <el-button type="text" class="ya-color-inherit">禁用：</el-button>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_disable===''?'primary':''" :underline="false" class="ya-height-26" @click="disableSelect('')">全部</el-link>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_disable===0?'primary':''" :underline="false" class="ya-height-26" @click="disableSelect(0)">已启用</el-link>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_disable===1?'primary':''" :underline="false" class="ya-height-26" @click="disableSelect(1)">已禁用</el-link>
          </el-col>
        </el-row>
        <!-- 上传筛选 -->
        <el-row>
          <el-col>
            <el-button type="text" class="ya-color-inherit">上传：</el-button>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_front===''?'primary':''" :underline="false" class="ya-height-26" @click="frontSelect('')">全部</el-link>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_front===0?'primary':''" :underline="false" class="ya-height-26" @click="frontSelect(0)">后台</el-link>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.is_front===1?'primary':''" :underline="false" class="ya-height-26" @click="frontSelect(1)">前台</el-link>
          </el-col>
        </el-row>
        <!-- 存储筛选 -->
        <el-row>
          <el-col>
            <el-button type="text" class="ya-color-inherit">存储：</el-button>
          </el-col>
          <el-col class="ya-padding-left">
            <el-link :type="query.storage===''?'primary':''" :underline="false" class="ya-height-26" @click="storageSelect('')">全部</el-link>
          </el-col>
          <el-col v-for="(item, index) in storages" :key="index" class="ya-padding-left">
            <el-link :type="query.storage===index?'primary':''" :underline="false" class="ya-height-26" @click="storageSelect(index)">{{ item }}</el-link>
          </el-col>
        </el-row>
      </el-col>
      <!-- 卡片展示 -->
      <div v-if="showMode=='card'">
        <el-col v-if="count>0" :span="22" class="dialog-body" :style="{height:height+'px'}">
          <el-row v-loading="loading" :gutter="3" style="margin-top:6px">
            <el-checkbox-group v-model="selection" @change="select">
              <el-col v-for="(item, index) in data" :key="index" :span="4" style="margin-bottom:6px;text-align:center">
                <el-card class="ya-file-card" :body-style="{minWidth:'16.5%', height:(height-height*0.1)/3+'px', minHeight:'126px', padding:'0 6px'}">
                  <div style="text-align:left">
                    <el-checkbox :key="item[idkey]" :label="item[idkey]">{{ item[idkey] }} ({{ item.file_size }}, {{ item.file_ext }}</el-checkbox>
                  </div>
                  <div :style="{width:'100%', height:((height-height*0.1)/3)-((height-height*0.1)/3*0.5)+'px', minHeight:'62px'}">
                    <el-image v-if="item.file_type==='image'" style="height:100%" fit="contain" :src="item.file_url" :preview-src-list="fileImgPre" title="点击看大图" lazy />
                    <video v-else-if="item.file_type==='video'" height="100%" controls>
                      <source :src="item.file_url" type="video/mp4">
                      <object :data="item.file_url" height="100%">
                        <embed :src="item.file_url" height="100%">
                      </object>
                    </video>
                    <audio v-else-if="item.file_type==='audio'" height="100%" controls>
                      <source :src="item.file_url" type="audio/mp3">
                      <embed :src="item.file_url" height="100%">
                    </audio>
                    <div v-else-if="item.file_type==='word'">
                      <i class="el-icon-document ya-file-icon" />
                    </div>
                    <div v-else>
                      <i class="el-icon-folder ya-file-icon" />
                    </div>
                  </div>
                  <div :style="{paddingTop:'5px', minHeight:'50px'}">
                    <span class="ya-file-name" :title="item.file_name+'.'+item.file_ext">{{ item.file_name }}.{{ item.file_ext }}</span>
                    <div class="bottom clearfix">
                      <el-button type="text" icon="el-icon-star-off" :title="'标识：'+item.unique+' (点击复制)'" @click="copy(item.unique, $event)" />
                      <el-button v-if="item.is_disable" type="text" icon="el-icon-warning" title="已禁用,点击修改" @click="selectOpen('disable',[item.file_id])" />
                      <el-button v-else type="text" icon="el-icon-warning-outline" title="已启用,点击修改" @click="selectOpen('disable',[item.file_id])" />
                      <el-button type="text" icon="el-icon-download" title="下载文件" @click="fileDownload(item, $event)" />
                      <el-button type="text" icon="el-icon-edit-outline" title="详情/修改" @click="edit(item)" />
                      <el-button type="text" icon="el-icon-delete" title="删除文件" @click="selectOpen('dele',[item.file_id])" />
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-checkbox-group>
          </el-row>
        </el-col>
        <el-col v-else :span="22">
          <el-empty :description="'暂无'+name" />
        </el-col>
      </div>
      <!-- 表格展示 -->
      <div v-else>
        <el-col :span="22" style="padding:0">
          <el-table ref="table" v-loading="loading" :data="data" :height="height" @sort-change="sort" @selection-change="select" @cell-dblclick="cellDbclick">
            <el-table-column type="selection" width="42" title="全选/反选" />
            <el-table-column :prop="idkey" label="ID" min-width="80" sortable="custom" />
            <el-table-column prop="unique" label="标识" min-width="80" show-overflow-tooltip />
            <el-table-column prop="file_url" label="文件" min-width="90">
              <template slot-scope="scope">
                <div style="height:30px">
                  <el-image v-if="scope.row.file_type==='image'" style="height:30px" fit="contain" :src="scope.row.file_url" :preview-src-list="fileImgPre" title="点击看大图" lazy scroll-container=".el-table__body-wrapper" />
                  <video v-else-if="scope.row.file_type==='video'" height="100%" controls>
                    <source :src="scope.row.file_url" type="video/mp4">
                    <object :data="scope.row.file_url" height="100%">
                      <embed :src="scope.row.file_url" height="100%">
                    </object>
                  </video>
                  <audio v-else-if="scope.row.file_type==='audio'" height="100%" controls>
                    <source :src="scope.row.file_url" type="audio/mp3">
                    <embed :src="scope.row.file_url" height="100%">
                  </audio>
                  <div v-else-if="scope.row.file_type==='word'">
                    <i class="el-icon-document" />
                  </div>
                  <div v-else>
                    <i class="el-icon-folder" />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="file_type_name" label="类型" min-width="55" />
            <el-table-column prop="file_name" label="名称" min-width="120" sortable="custom" show-overflow-tooltip />
            <el-table-column prop="file_ext" label="后缀" min-width="75" sortable="custom" show-overflow-tooltip />
            <el-table-column prop="file_size" label="大小" min-width="85" sortable="custom" show-overflow-tooltip />
            <el-table-column prop="group_name" label="分组" min-width="116" show-overflow-tooltip />
            <el-table-column prop="tag_names" label="标签" min-width="116" show-overflow-tooltip />
            <el-table-column prop="is_disable" label="禁用" min-width="73" sortable="custom">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.is_disable" :active-value="1" :inactive-value="0" @change="disable([scope.row])" />
              </template>
            </el-table-column>
            <el-table-column prop="sort" label="排序" min-width="73" sortable="custom" />
            <el-table-column prop="create_time" label="添加时间" width="152" sortable="custom" />
            <el-table-column v-if="recycle" prop="delete_time" label="删除时间" width="152" sortable="custom" />
            <el-table-column v-else prop="update_time" label="修改时间" width="152" sortable="custom" />
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-button v-if="recycle" type="text" size="mini" @click="selectOpen('reco',[scope.row])">恢复</el-button>
                <el-button type="text" size="mini" title="下载文件" @click="fileDownload(scope.row, $event)">下载</el-button>
                <el-button type="text" size="mini" title="详情/修改" @click="edit(scope.row)">修改</el-button>
                <el-button type="text" size="mini" title="删除文件" @click="selectOpen('dele',[scope.row])">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </div>
    </el-row>
    <!-- 分页 -->
    <pagination v-show="count>0" :total="count" :page.sync="query.page" :limit.sync="query.limit" @pagination="list" />
    <!-- 修改 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialog" top="5vh" :before-close="cancel" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="ref" :rules="rules" :model="model" label-width="100px" class="dialog-body" :style="{height:height+'px'}">
        <el-form-item label="标识" prop="unique">
          <el-input v-model="model.unique" placeholder="请输入标识（唯一）" clearable />
        </el-form-item>
        <el-form-item v-if="model.file_id" label="文件" prop="file">
          <el-col :span="18">
            <div style="height:200px">
              <el-image v-if="model.file_type==='image'" style="height:200px" fit="contain" :src="model.file_url" :preview-src-list="[model.file_url]" title="点击看大图" />
              <video v-else-if="model.file_type==='video'" height="100%" controls>
                <source :src="model.file_url" type="video/mp4">
                <object :data="model.file_url" height="100%">
                  <embed :src="model.file_url" height="100%">
                </object>
              </video>
              <audio v-else-if="model.file_type==='audio'" height="100%" controls>
                <source :src="model.file_url" type="audio/mp3">
                <embed :src="model.file_url" height="100%">
              </audio>
              <div v-else-if="model.file_type==='word'">
                <i class="el-icon-document ya-file-icon" />
              </div>
              <div v-else>
                <i class="el-icon-folder ya-file-icon" />
              </div>
            </div>
          </el-col>
          <el-col :span="6" class="ya-center">
            <el-button size="mini" title="下载文件" @click="fileDownload(model, $event)">下载</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="文件名称" prop="file_name" :rules="{ required: model.type=='url'?false:true, message: '请输入文件名称', trigger: 'blur' }">
          <el-input v-model="model.file_name" placeholder="请输入文件名称" :title="model.file_name" clearable>
            <el-button slot="append" icon="el-icon-copy-document" title="复制" @click="copy(model.file_name, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="文件分组" prop="group_id">
          <el-select v-model="model.group_id" clearable>
            <el-option v-for="(item, index) in groupData" :key="index" :value="item.group_id" :label="item.group_name" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件标签" prop="tag_ids">
          <el-select v-model="model.tag_ids" class="ya-width-100p" clearable filterable multiple>
            <el-option v-for="item in tagData" :key="item.tag_id" :label="item.tag_name" :value="item.tag_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件类型" prop="file_type">
          <el-select v-model="model.file_type">
            <el-option v-for="(item, index) in file_types" :key="index" :value="index" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="model.file_id" label="文件域名" prop="domain">
          <el-input v-model="model.domain" placeholder="请输入域名" clearable>
            <el-button slot="append" icon="el-icon-copy-document" title="复制" @click="copy(model.domain, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="model.file_id" label="文件路径" prop="file_path">
          <el-input v-model="model.file_path" placeholder="请输入路径" :title="model.file_path" :disabled="model.file_id?true:false">
            <el-button slot="append" icon="el-icon-copy-document" title="复制" @click="copy(model.file_path, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="文件链接" prop="file_url">
          <el-input v-model="model.file_url" placeholder="请输入链接" :title="model.file_url" clearable :disabled="model.file_id?true:false">
            <el-button slot="append" icon="el-icon-copy-document" title="复制" @click="copy(model.file_url, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item label="存储方式" prop="storage">
          <el-select v-model="model.storage" placeholder="" :disabled="model.file_id?true:false">
            <el-option v-for="(item, index) in storages" :key="index" :value="index" :label="item" />
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
          <el-input v-model="model.file_md5" placeholder="" disabled>
            <el-button slot="append" icon="el-icon-copy-document" title="复制" @click="copy(model.file_md5, $event)" />
          </el-input>
        </el-form-item>
        <el-form-item v-if="model.file_id" label="文件散列" prop="file_hash">
          <el-input v-model="model.file_hash" placeholder="" disabled>
            <el-button slot="append" icon="el-icon-copy-document" title="复制" @click="copy(model.file_hash, $event)" />
          </el-input>
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
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="submit">提交</el-button>
      </div>
    </el-dialog>
    <!-- 文件管理操作 -->
    <el-row v-show="fileType">
      <el-col style="text-align:right;margin-top:10px">
        <el-button @click="fileCancel()">取消</el-button>
        <el-button type="primary" @click="fileSubmit(selection)">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import screenHeight from '@/utils/screen-height'
import Pagination from '@/components/Pagination'
import clip from '@/utils/clipboard'
import store from '@/store'
import { arrayColumn } from '@/utils/index'
import { getAdminToken } from '@/utils/auth'
import { list, info, add, edit, dele, editgroup, edittag, edittype, editdomain, disable, recycle, recycleReco, recycleDele } from '@/api/file/file'
import { info as groupInfo, add as groupAdd, edit as groupEdit, dele as groupDele } from '@/api/file/group'
import { info as tagInfo, add as tagAdd, edit as tagEdit, dele as tagDele } from '@/api/file/tag'

export default {
  name: 'FileManage',
  components: { Pagination },
  directives: {},
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
      selectTitle: '选中操作',
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
    'isRecycle': {
      handler(value) {
        this.recycle = value
        this.list()
      }
    },
    'fileType': {
      handler(value) {
        this.recycle = this.isRecycle
        this.query.file_type = value
        this.query.page = 1
        this.list()
      }
    }
  },
  created() {
    this.height = screenHeight()
    this.recycle = this.isRecycle
    if (this.fileType) {
      this.query.is_disable = 0
      this.query.file_type = this.fileType
      this.height = this.height - 95
    }
    this.list()
    const tokenType = store.getters.tokenType
    const tokenName = store.getters.tokenName
    const tokenValue = getAdminToken()
    if (tokenType === 'header') {
      const uploadHeaders = {}
      uploadHeaders[tokenName] = tokenValue
      this.uploadHeaders = uploadHeaders
    } else {
      const uploadData = { group_id: 0 }
      uploadData[tokenName] = tokenValue
      this.uploadData = uploadData
    }
  },
  methods: {
    checkPermission,
    // 列表
    list() {
      this.loading = true
      if (this.recycle) {
        recycle(this.query).then(res => {
          this.listData(res.data)
        }).catch(() => {
          this.loading = false
        })
      } else {
        list(this.query).then(res => {
          this.listData(res.data)
        }).catch(() => {
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
          this.$message.success(res.msg)
        }
      } else {
        this.$message.error(res.msg)
        if (this.uploadNumber >= this.uploadCount) {
          this.loading = false
        }
      }
    },
    uploadError(res) {
      this.loading = false
      this.$message.error(res.msg || '上传出错')
    },
    uploadChange(file, fileList) {
      this.loading = true
      this.uploadCount = fileList.length
      if (this.uploadNumber >= this.uploadCount) {
        this.loading = false
      }
    },
    uploadExceed() {
      this.$message.error(`每次最多只能选择 ${this.uploadLimit} 个文件`)
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
      }).then(res => {
        this.reset(res.data)
      }).catch(() => {})
    },
    cancel() {
      this.dialog = false
      this.reset()
    },
    submit() {
      this.$refs['ref'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.model.file_id) {
            edit(this.model).then(res => {
              this.list()
              this.reset()
              this.dialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            add(this.model, 'url').then(res => {
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
        this.$refs['table'].clearSelection()
        this.$refs['table'].clearSort()
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
          this.$refs['table'].clearSelection()
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
      this.$alert('请选择需要操作的' + this.name, '提示', { type: 'warning', callback: action => { } })
    },
    selectOpen(selectType, selectRow = '') {
      if (selectRow) {
        if (this.showMode === 'card') {
          this.selection = []
        } else {
          if (this.$refs['table'] !== undefined) {
            this.$refs['table'].clearSelection()
          }
        }
        this.select(selectRow)
      }
      if (!this.selection.length) {
        this.selectAlert()
      } else {
        this.selectTitle = '选中操作'
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
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
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
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
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
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
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
        }).then(res => {
          this.list()
          this.reset()
          this.$message.success(res.msg)
        }).catch(() => {
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
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
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
          }).then(res => {
            this.list()
            this.reset()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        } else {
          dele({
            ids: this.selectGetIds()
          }).then(res => {
            this.list()
            this.reset()
            this.$message.success(res.msg)
          }).catch(() => {
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
        }).then(res => {
          this.list()
          this.$message.success(res.msg)
        }).catch(() => {
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
    // 文件下载
    fileDownload(file, event) {
      clip(file.file_name, event, '文件名复制成功')
      setTimeout(() => { window.open(file.file_url, '_blank') }, 500)
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
        this.$alert('请选择需要修改的' + this.groupName, '提示', { type: 'warning', callback: action => { } })
      } else {
        this.groupDialog = true
        this.groupTitle = this.groupName + '修改：' + this.query.group_id
        groupInfo({
          group_id: this.query.group_id
        }).then(res => {
          this.groupReset(res.data)
        }).catch(res => {
          this.groupDialog = false
        })
      }
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
              this.groupDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            groupAdd(this.groupModel).then(res => {
              this.groupList()
              this.groupDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    groupDele() {
      const group_id = this.query.group_id
      if (!group_id) {
        this.$alert('请选择需要删除的' + this.groupName, '提示', { type: 'warning', callback: action => { } })
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
        const message = '确定要删除' + this.groupName + ' <span style="color:red">' + group_name + ' </span>吗？'
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          groupDele({
            ids: [group_id]
          }).then(res => {
            this.groupList()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => { })
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
        this.$alert('请选择需要修改的' + this.tagName, '提示', { type: 'warning', callback: action => { } })
      } else {
        this.tagDialog = true
        this.tagTitle = this.tagName + '修改：' + tag_id
        tagInfo({
          tag_id: tag_id
        }).then(res => {
          this.tagReset(res.data)
        }).catch(res => {
          this.tagDialog = false
        })
      }
    },
    tagCancel() {
      this.tagDialog = false
      this.tagReset()
    },
    tagSubmit() {
      this.$refs['tagRef'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.tagModel.tag_id) {
            tagEdit(this.tagModel).then(res => {
              this.tagList()
              this.tagReset()
              this.tagDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
              this.loading = false
            })
          } else {
            tagAdd(this.tagModel).then(res => {
              this.tagList()
              this.tagReset()
              this.tagDialog = false
              this.$message.success(res.msg)
            }).catch(() => {
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
        this.$alert('请选择需要删除的' + this.tagName, '提示', { type: 'warning', callback: action => { } })
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
        const message = '确定要删除' + this.tagName + ' <span style="color:red">' + tag_name + ' </span>吗？'
        this.$confirm(message, title, { type: 'warning', dangerouslyUseHTMLString: true }).then(() => {
          this.loading = true
          tagDele({
            ids: [tag_id]
          }).then(res => {
            this.tagList()
            this.$message.success(res.msg)
          }).catch(() => {
            this.loading = false
          })
        }).catch(() => { })
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
        this.$alert('请选择文件')
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
    copy(text, event) {
      clip(text, event)
    },
    // 单元格双击复制
    cellDbclick(row, column, cell, event) {
      this.copy(row[column.property], event)
    }
  }
}
</script>

<style scoped>
.ya-height-26 {
  height: 26px;
}
.ya-margin-left {
  margin-left: 10px;
}
.ya-padding-left {
  padding-left: 10px;
}
.ya-color-inherit {
  color: inherit;
  padding: 10px 20px 0 0;
}
.ya-upload {
  display: inline-block;
  margin-left: 10px;
}
.ya-file-card {
  position: relative;
  overflow: hidden;
  background: #fff;
}
.ya-file-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  padding-right: 0;
  font-size: 14px;
}
.ya-file-icon {
  font-size: 50px;
}
.ya-file-img {
  width: 100%;
  height: 100%;
}
.ya-file-image {
  max-width: 100%;
  max-height: 100%;
}
</style>
