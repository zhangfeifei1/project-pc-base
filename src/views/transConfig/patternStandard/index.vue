<template>
  <div>
    <el-card shadow="always">
      <el-form ref="searchForm" :model="pageInfo" inline label-width="120px" size="small" class="demo-form-inline form-btn-box">
        <el-form-item label="验证字段描述:" prop="description">
          <el-input v-model="pageInfo.description" clearable type="text" placeholder="请输入验证字段描述" style="width:300px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch1(1)">查询</el-button>&nbsp;
          <el-button @click="handleResetForm('searchForm')">重置</el-button>
          <el-button type="primary" @click="handleAdd()">添加</el-button>
        </el-form-item>
      </el-form>

      <el-table border :data="data" :loading="loading" :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
        <el-table-column prop="name" width="150">
          <template #header>
            <span>字段名</span>
            <div class="sort-div" @click="sortTable('name')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='name'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='name'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" width="150">
          <template #header>
            <span>字段描述</span>
            <div class="sort-div" @click="sortTable('description')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='description'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='description'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" width="150">
          <template #header>
            <span>字段类型</span>
            <div class="sort-div" @click="sortTable('type')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='type'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='type'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="validationFlag" width="180">
          <template #header>
            <span>是否验证格式</span>
            <div class="sort-div" @click="sortTable('validation_flag')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='validation_flag'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='validation_flag'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
          <template slot-scope="scope">
            <el-badge v-if="scope.row.validationFlag==='1'" is-dot type="success" text="校验" />
            <el-badge v-if="scope.row.validationFlag==='2'" is-dot type="danger" text="不校验" />
            <span v-if="scope.row.validationFlag==='1'">校验</span>
            <span v-if="scope.row.validationFlag==='2'">不校验</span>
          </template>
        </el-table-column>
        <el-table-column prop="validationType" width="180">
          <template #header>
            <span>验证类型</span>
            <div class="sort-div" @click="sortTable('validation_type')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='validation_type'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='validation_type'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.validationType===1">正则</span>
            <span v-if="scope.row.validationType===2">标准数据</span>
            <span v-if="scope.row.validationType===3&&hasAuthority('huaxiaStandard')">华夏数据标准</span>
          </template>
        </el-table-column>
        <el-table-column prop="validationRule" label="格式验证规则" width="200">
          <template #header>
            <span>格式验证规则</span>
            <div class="sort-div" @click="sortTable('validation_rule')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='validation_rule'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='validation_rule'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="codeDescription" width="200">
          <template #header>
            <span>标准数据</span>
            <div class="sort-div" @click="sortTable('code_description')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='code_description'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='code_description'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="hasAuthority('huaxiaStandard')" prop="hxStandardName" label="华夏数据标准" width="200">
          <template #header>
            <span>华夏数据标准</span>
            <div class="sort-div" @click="sortTable('hxStandard_name')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='hxStandard_name'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='hxStandard_name'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="desensitizationName" label="脱敏规则名称" width="180">
          <template #header>
            <span>脱敏规则名称</span>
            <div class="sort-div" @click="sortTable('desensitizationName')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='desensitizationName'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='desensitizationName'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="validationPrompt" label="格式验证提示语" width="300">
          <template #header>
            <span>格式验证提示语</span>
            <div class="sort-div" @click="sortTable('validation_prompt')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='validation_prompt'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='validation_prompt'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="sensitiveFlag" label="是否敏感数据" width="150">
          <template #header>
            <span>是否敏感数据</span>
            <div class="sort-div" @click="sortTable('sensitive_flag')">
              <i
                :class="['el-icon-sort-down','sort-icon-down',
                         (pageInfo.sortField=='sensitive_flag'&&pageInfo.sortFieldValue=='desc'?'sortcolor':'')]"
              />
              <i
                :class="['el-icon-sort-up','sort-icon-up',
                         (pageInfo.sortField=='sensitive_flag'&&pageInfo.sortFieldValue=='asc'?'sortcolor':'')]"
              />
            </div>
          </template>
          <template slot-scope="scope">
            <el-badge v-if="scope.row.sensitiveFlag==='1'" is-dot type="success" text="是" />
            <el-badge v-else="" is-dot type="danger" text="否" />
            <span v-if="scope.row.sensitiveFlag==='1'">是</span>
            <span v-else="">否</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <a class="linkfont" style="margin-right:30px" @click="openDrawer(scope.row)">编辑</a>
            <a class="linkfont" @click="handleRemove(scope.row)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar">
        <el-pagination
          background
          :current-page="pageInfo.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageInfo.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.total"
          @size-change="handlePageSize"
          @current-change="handlePage"
        />
      </el-col>
    </el-card>
    <el-dialog width="60%" top="80px" :visible.sync="drawerEdit" title="编辑数据字典" :show-close="true">
      <div style="margin-left:40px">
        <template>
          <el-form ref="editForm" :model="currentEdit" label-width="120px" label-position="right" :rules="ruleValidate" size="small">
            <el-form-item label="字段名：" prop="name">
              <el-input v-model="currentEdit.name" placeholder="请输入字段名" style="width:500px" />
            </el-form-item>
            <el-form-item label="字段描述：" prop="description">
              <el-input v-model="currentEdit.description" placeholder="请输入字段描述" style="width:500px" />
            </el-form-item>
            <el-form-item label="字段类型：" prop="type">
              <el-select v-model="currentEdit.type" style="width:500px" placeholder="请选择">
                <el-option value="byte">byte</el-option>
                <el-option value="short">short</el-option>
                <el-option value="int">int</el-option>
                <el-option value="long">long</el-option>
                <el-option value="float">float</el-option>
                <el-option value="double">double</el-option>
                <el-option value="char">char</el-option>
                <el-option value="String">String</el-option>
                <el-option value="boolean">boolean</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="脱敏规则：" prop="desensitizationId">
              <el-select v-model="currentEdit.desensitizationId" style="width:500px" placeholder="请选择">
                <el-option
                  v-for="item in desensitList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否验证格式：" prop="validationFlag">
              <template>
                <el-radio-group v-model="currentEdit.validationFlag" style="width:300px">
                  <el-radio label="1">校验</el-radio>
                  <el-radio label="2">不校验</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item v-if="currentEdit.validationFlag==1" label="验证类型：" prop="validationType">
              <template>
                <el-radio-group v-model="currentEdit.validationType" style="width:300px" @change="editChange">
                  <el-radio :label="1">正则</el-radio>
                  <el-radio :label="2">标准数据</el-radio>
                  <el-radio v-if="hasAuthority('huaxiaStandard')" :label="3">华夏数据标准</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item v-if="currentEdit.validationType==1 && currentEdit.validationFlag==1" label="格式验证规则：" prop="validationRule">
              <el-input v-model="currentEdit.validationRule" placeholder="请输入字段的正则表达式" style="width:500px" />
            </el-form-item>
            <el-form-item v-if="currentEdit.validationType==2 && currentEdit.validationFlag==1" label="标准数据：" prop="codeId">
              <el-select v-model="currentEdit.codeId" style="width:500px" placeholder="请选择">
                <el-option
                  v-for="(item,index) in codeIdList"
                  :key="index"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="currentEdit.validationType==3 && currentEdit.validationFlag==1 && hasAuthority('huaxiaStandard')" label="华夏数据标准：" prop="standardId">
              <el-select v-model="currentEdit.standardId" style="width:300px" placeholder="请选择" filterable @change="getList(currentEdit.standardId)">
                <el-option
                  v-for="(item,index) in standardIdList"
                  :key="index"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="currentEdit.validationType==3 && hasAuthority('huaxiaStandard') && currentEdit.standardId!=='' && standardLevelOrValueList.length !== 0" prop="standardLevelOrValue">
              <el-select v-model="currentEdit.standardLevelOrValue" style="width:300px" placeholder="请选择">
                <el-option
                  v-for="(item,index) in standardLevelOrValueList"
                  :key="index"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="currentEdit.validationType === 1 && currentEdit.validationFlag==1" label="验证提示语：" prop="validationPrompt1">
              <el-input v-model="currentEdit.validationPrompt1" placeholder="请输入格式验证提示语" style="width:500px" />
            </el-form-item>
            <el-form-item v-if="currentEdit.validationType === 2 && currentEdit.validationFlag==1" label="验证提示语：" prop="validationPrompt2">
              <el-input v-model="currentEdit.validationPrompt2" placeholder="请输入格式验证提示语" style="width:500px" />
            </el-form-item>
            <el-form-item v-if="currentEdit.validationType === 3 && currentEdit.validationFlag==1" label="验证提示语：" prop="validationPrompt3">
              <el-input v-model="currentEdit.validationPrompt3" placeholder="请输入格式验证提示语" style="width:500px" />
            </el-form-item>
            <!-- <el-form-item label="是否敏感数据:" prop="sensitiveFlag">
              <template>
                <el-radio-group v-model="currentEdit.sensitiveFlag" style="width:500px">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="2">否</el-radio>
                </el-radio-group>
              </template>
            </el-form-item> -->
          </el-form>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="small" @click="drawerEdit=false">取消</el-button>
        <el-button type="primary" size="small" @click="editSubmit">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog width="60%" top="80px" :visible.sync="drawerAdd" title="添加数据字典" :show-close="true">
      <div style="margin-left:40px">
        <template>
          <el-form ref="addForm" :model="currentAdd" label-width="120px" label-position="right" :rules="ruleValidate" size="small">
            <el-form-item label="字段名：" prop="name">
              <el-input v-model="currentAdd.name" placeholder="请输入字段名" style="width:500px" />
            </el-form-item>
            <el-form-item label="字段描述：" prop="description">
              <el-input v-model="currentAdd.description" placeholder="请输入字段描述" style="width:500px" />
            </el-form-item>
            <el-form-item label="字段类型：" prop="type">
              <el-select v-model="currentAdd.type" style="width:500px" placeholder="请选择">
                <el-option value="byte">byte</el-option>
                <el-option value="short">short</el-option>
                <el-option value="int">int</el-option>
                <el-option value="long">long</el-option>
                <el-option value="float">float</el-option>
                <el-option value="double">double</el-option>
                <el-option value="char">char</el-option>
                <el-option value="String">String</el-option>
                <el-option value="boolean">boolean</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="脱敏规则：" prop="desensitizationId">
              <el-select v-model="currentAdd.desensitizationId" filterable style="width:500px" placeholder="请选择">
                <el-option
                  v-for="item in desensitList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否验证格式：" prop="validationFlag">
              <template>
                <el-radio-group v-model="currentAdd.validationFlag" style="width:500px">
                  <el-radio label="1">校验</el-radio>
                  <el-radio label="2">不校验</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item v-if="currentAdd.validationFlag==1" label="验证类型：" prop="validationType">
              <template>
                <el-radio-group v-model="currentAdd.validationType" style="width:300px" @change="addChange">
                  <el-radio :label="1">正则</el-radio>
                  <el-radio :label="2">标准数据</el-radio>
                  <el-radio v-if="hasAuthority('huaxiaStandard')" :label="3">华夏数据标准</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item v-if="currentAdd.validationType==1 && currentAdd.validationFlag==1" label="格式验证规则：" prop="validationRule">
              <el-input v-model="currentAdd.validationRule" placeholder="请输入字段的正则表达式" style="width:500px" />
            </el-form-item>
            <el-form-item v-if="currentAdd.validationType==2 && currentAdd.validationFlag==1" label="标准数据：" prop="codeId">
              <el-select v-model="currentAdd.codeId" style="width:500px" placeholder="请选择">
                <el-option
                  v-for="(item,index) in codeIdList"
                  :key="index"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="currentAdd.validationType==3 && hasAuthority('huaxiaStandard')" label="华夏数据标准：" prop="standardId">
              <el-select v-model="currentAdd.standardId" style="width:300px" placeholder="请选择" filterable @change="getList(currentAdd.standardId)">
                <el-option
                  v-for="(item,index) in standardIdList"
                  :key="index"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="currentAdd.validationType==3 && hasAuthority('huaxiaStandard') && currentAdd.standardId!== '' && standardLevelOrValueList.length !== 0" prop="standardLevelOrValue">
              <el-select v-model="currentAdd.standardLevelOrValue" style="width:300px" placeholder="请选择">
                <el-option
                  v-for="(item,index) in standardLevelOrValueList"
                  :key="index"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="currentAdd.validationType === 1 && currentAdd.validationFlag==1" label="验证提示语：" prop="validationPrompt1">
              <el-input v-model="currentAdd.validationPrompt1" placeholder="请输入格式验证提示语" style="width:500px" />
            </el-form-item>
            <el-form-item v-if="currentAdd.validationType === 2 && currentAdd.validationFlag==1" label="验证提示语：" prop="validationPrompt2">
              <el-input v-model="currentAdd.validationPrompt2" placeholder="请输入格式验证提示语" style="width:500px" />
            </el-form-item>
            <el-form-item v-if="currentAdd.validationType === 3 && currentAdd.validationFlag==1" label="验证提示语：" prop="validationPrompt3">
              <el-input v-model="currentAdd.validationPrompt3" placeholder="请输入格式验证提示语" style="width:500px" />
            </el-form-item>
            <!-- <el-form-item label="是否敏感数据:" prop="sensitiveFlag">
              <template>
                <el-radio-group v-model="currentAdd.sensitiveFlag" style="width:500px">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="2">否</el-radio>
                </el-radio-group>
              </template>
            </el-form-item> -->
          </el-form>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="small" @click="drawerAdd=false">取消</el-button>
        <el-button type="primary" size="small" @click="addSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  saveDictionary,
  editDictionary,
  deleteDictionaryById,
  getDictionaryPage
} from '@/api/patternStandardApi'
import { queryAllDesensitizationRule } from '@/api/desensiteApi'
import { getAllDateStandardItem } from '@/api/dataStandardApi'
import { getSimpleHxItem } from '@/api/hxStandardApi'
export default {
  name: 'PatternStandard',
  data() {
    return {
      drawerEdit: false,
      drawerAdd: false,
      currentEdit: {
        examine_type: 'edit', // 用于审核样式
        name: '',
        description: '',
        type: '',
        desensitizationId: '',
        validationFlag: '',
        validationType: '',
        codeId: '',
        validationRule: '',
        standardId: '',
        standardLevelOrValue: '',
        validationPrompt: '',
        validationPrompt1: '',
        validationPrompt2: '',
        validationPrompt3: '',
        sensitiveFlag: '',

        name_Old: '',
        description_Old: '',
        type_Old: '',
        validationFlag_Old: '',
        validationType_Old: '',
        codeId_Old: '',
        validationRule_Old: '',
        standardId_Old: '',
        standardLevelOrValue_Old: '',
        validationPrompt_Old: '',
        validationPrompt1_Old: '',
        validationPrompt2_Old: '',
        validationPrompt3_Old: '',
        sensitiveFlag_Old: '',

        name_Dec: '字段名',
        description_Dec: '字段描述',
        type_Dec: '字段类型',
        desensitizationId_Dec: '脱敏规则',
        validationFlag_Dec: '是否验证格式',
        validationType_Dec: '验证类型',
        codeId_Dec: '标准数据',
        validationRule_Dec: '格式验证规则',
        standardId_Dec: '华夏数据标准',
        standardLevelOrValue_Dec: '华夏标准数据级别或值',
        validationPrompt_Dec: '验证提示语'
      },
      currentAdd: {
        examine_type: 'add', // 用于审核样式
        name: '',
        description: '',
        type: '',
        desensitizationId: '',
        validationFlag: '1',
        validationType: 1,
        codeId: '',
        validationRule: '',
        standardId: '',
        standardLevelOrValue: '',
        validationPrompt: '',
        validationPrompt1: '',
        validationPrompt2: '',
        validationPrompt3: '',
        sensitiveFlag: '',

        name_Dec: '字段名',
        description_Dec: '字段描述',
        type_Dec: '字段类型',
        desensitizationId_Dec: '脱敏规则',
        validationFlag_Dec: '是否验证格式',
        validationType_Dec: '验证类型',
        codeId_Dec: '标准数据',
        validationRule_Dec: '格式验证规则',
        standardId_Dec: '华夏数据标准',
        standardLevelOrValue_Dec: '华夏标准数据级别或值',
        validationPrompt_Dec: '验证提示语'
      },
      currentDel: {
        examine_type: 'delete', // 用于审核样式
        name: '',
        description: '',
        type: '',
        validationFlag: '',
        validationType: '',
        codeId: '',
        validationRule: '',
        standardId: '',
        standardLevelOrValue: '',
        validationPrompt: '',
        validationPrompt1: '',
        validationPrompt2: '',
        validationPrompt3: '',
        sensitiveFlag: '',

        name_Old: '',
        description_Old: '',
        type_Old: '',
        validationFlag_Old: '',
        validationType_Old: '',
        codeId_Old: '',
        validationRule_Old: '',
        standardId_Old: '',
        standardLevelOrValue_Old: '',
        validationPrompt_Old: '',
        validationPrompt1_Old: '',
        validationPrompt2_Old: '',
        validationPrompt3_Old: '',
        sensitiveFlag_Old: '',

        name_Dec: '字段名',
        description_Dec: '字段描述',
        type_Dec: '字段类型',
        desensitizationId_Dec: '脱敏规则',
        validationFlag_Dec: '是否验证格式',
        validationType_Dec: '验证类型',
        codeId_Dec: '标准数据',
        validationRule_Dec: '格式验证规则',
        standardId_Dec: '华夏数据标准',
        standardLevelOrValue_Dec: '华夏标准数据级别或值',
        validationPrompt_Dec: '验证提示语'
      },
      desensitList: [],
      codeIdList: [],
      standardIdList: [],
      standardLevelOrValueList: [],
      loading: false,
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        description: '',
        sortField: '',
        sortFieldValue: ''
      },
      columns: [{
        title: '字段名',
        key: 'name',
        width: 150
      },
      {
        title: '字段描述',
        key: 'description',
        width: 150
      },
      {
        title: '字段类型',
        key: 'type',
        width: 150
      },
      {
        title: '是否验证格式',
        key: 'validationFlag',
        slot: 'isTestVali',
        width: 150
      },
      {
        title: '验证类型',
        key: 'validationType',
        width: 150
      },
      {
        title: '格式验证规则',
        key: 'validationRule',
        width: 220
      },
      {
        title: '标准数据',
        key: ' codeId',
        width: 150
      },
      {
        title: '华夏数据标准',
        key: ' hxStandardName',
        width: 150
      },
      {
        title: '格式验证提示语',
        key: 'validationPrompt',
        width: 220
      },
      {
        title: '是否敏感数据',
        key: 'sensitiveFlag',
        slot: 'isTestSen',
        width: 150
      },
      // {
      //   title: '是否加密传输',
      //   key: 'encryptionFlag',
      //   slot: 'isTestEnc',
      //   width: 150
      // },
      {
        title: '操作',
        slot: 'handle',
        fixed: 'right',
        width: 220
      }
      ],
      ruleValidate: {
        name: [{
          required: true,
          message: '字段名不能为空！',
          trigger: 'blur'
        }],
        description: [{
          required: true,
          message: '字段描述不能为空！',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '字段类型不能为空！',
          trigger: 'change'
        }],
        validationFlag: [{
          required: true,
          message: '是否验证格式不能为空！',
          trigger: 'change'
        }],
        validationType: [{
          required: true,
          message: '校验类型不能为空！',
          trigger: 'change'
        }],
        validationRule: [{
          required: true,
          message: '格式验证规则不能为空！',
          trigger: 'blur'
        }],
        codeId: [{
          required: true,
          message: '标准数据不能为空！',
          trigger: 'change'
        }],
        standardId: [{
          required: true,
          message: '华夏数据标准不能为空！',
          trigger: 'change'
        }],
        standardLevelOrValue: [{
          required: true,
          message: '华夏标准数据级别或值不能为空！',
          trigger: 'change'
        }],
        validationPrompt1: [{
          required: true,
          message: '格式验证提示语不能为空！',
          trigger: 'blur'
        }],
        validationPrompt2: [{
          required: true,
          message: '格式验证提示语不能为空！',
          trigger: 'blur'
        }],
        sensitiveFlag: [{
          required: true,
          message: '是否敏感数据不能为空！',
          trigger: 'change'
        }]
        // encryptionFlag: [{
        //   required: true,
        //   message: '是否加密传输不能为空！',
        //   trigger: 'change'
        // }],
      },
      data: [{}]
    }
  },
  mounted: function() {
    this.handleSearch()
    this.queryDesensitList()
    this.querycodeIdList()
    this.querystandardIdList()
  },
  methods: {
    /**
     * @description 设置上送数据的参数,为审核详情页提供原数据、修改数据、各数据标题
     * @param data 原上送数据
     * @param obj 改造数据变量名称
     * @param arr 添加的后缀名称数组 ['_Old','_Dec']
     */
    setExamineData(data, obj, arr) {
      for (const i in data) {
        this[obj][i] = data[i]
        for (const j in arr) {
          this[obj][i + arr[j]] = data[i]
        }
      }
    },
    queryDesensitList() {
      queryAllDesensitizationRule().then(res => {
        this.desensitList = [{ 'regex': '', 'createTime': '', 'name': '请选择', 'updateTime': 1605749882000, 'id': '', 'replacement': '' }]
        this.desensitList = this.desensitList.concat(res.data.data)
      })
    },
    querycodeIdList() {
      getAllDateStandardItem().then(res => {
        res.data.forEach(v => {
          const obj = {
            key: v.codeId,
            value: v.codeDescription + '(' + v.codeName + ')'
          }
          this.codeIdList.push(obj)
        })
      })
    },
    querystandardIdList() {
      if (this.hasAuthority('huaxiaStandard')) {
        getSimpleHxItem().then(res => {
          res.data.hxStandards.forEach(v => {
            const obj = {
              key: v.id,
              value: v.itemCode + ' ' + v.nameZh + ' ' + '(' + v.version + ')',
              newArr: v.levelOrValue
            }
            this.standardIdList.push(obj)
          })
        })
      }
    },
    getList(v) {
      this.setEmpty(v)
      this.currentAdd.standardLevelOrValue = ''
      this.currentEdit.standardLevelOrValue = ''
      this.currentEdit.validationPrompt3 = ''
    },
    setEmpty(v) {
      // this.$nextTick(() => {
      //   this.$refs.editForm.clearValidate()
      // })
      this.standardLevelOrValueList = []
      for (var i = 0; i < this.standardIdList.length; i++) {
        if (this.standardIdList[i].newArr !== '' && this.standardIdList[i].key === v) {
          this.standardLevelOrValueList = this.standardIdList[i].newArr.slice(1, -1).replace(/},{/g, '}//{').split('//')
          const temp = []
          for (const j in this.standardLevelOrValueList) {
            temp.push(JSON.parse(this.standardLevelOrValueList[j]))
          }
          this.standardLevelOrValueList = temp
        }
      }
    },
    handleSearch() {
      this.loading = true
      getDictionaryPage(this.pageInfo).then(res => {
        this.data = res.data.records
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {
        this.loading = false
      })
    },
    handleSearch1() {
      this.pageInfo.page = 1
      this.pageInfo.sortField = ''
      this.pageInfo.sortFieldValue = ''
      this.handleSearch()
    },
    sortTable(val) {
      if (this.pageInfo.sortField !== val) {
        this.pageInfo.sortFieldValue = ''
      }
      this.pageInfo.sortField = val
      if (this.pageInfo.sortFieldValue === '' || this.pageInfo.sortFieldValue === 'desc') {
        this.pageInfo.sortFieldValue = 'asc'
        this.handleSearch()
        return
      }
      if (this.pageInfo.sortFieldValue === 'asc') {
        this.pageInfo.sortFieldValue = 'desc'
        this.handleSearch()
        return
      }
    },
    handleAdd() {
      this.drawerAdd = true
      setTimeout(() => {
        this.$refs.addForm.resetFields()
      }, 0)
      this.currentAdd = {
        examine_type: 'add', // 用于审核样式
        name: '',
        description: '',
        type: '',
        desensitizationId: '',
        validationFlag: '1',
        validationType: 1,
        codeId: '',
        validationRule: '',
        standardId: '',
        standardLevelOrValue: '',
        validationPrompt: '',
        validationPrompt1: '',
        validationPrompt2: '',
        validationPrompt3: '',
        sensitiveFlag: '',
        name_Dec: '字段名',
        description_Dec: '字段描述',
        type_Dec: '字段类型',
        desensitizationId_Dec: '脱敏规则',
        validationFlag_Dec: '是否验证格式',
        validationType_Dec: '验证类型',
        codeId_Dec: '标准数据',
        validationRule_Dec: '格式验证规则',
        standardId_Dec: '华夏数据标准',
        standardLevelOrValue_Dec: '华夏标准数据级别或值',
        validationPrompt_Dec: '验证提示语'
      }
    },
    editSubmit() {
      if (this.currentEdit.validationType === 1) {
        this.currentEdit.validationPrompt = this.currentEdit.validationPrompt1
        this.currentEdit.validationPrompt2 = ''
        this.currentEdit.validationPrompt3 = ''
      } else if (this.currentEdit.validationType === 2) {
        this.currentEdit.validationPrompt = this.currentEdit.validationPrompt2
        this.currentEdit.validationPrompt3 = ''
        this.currentEdit.validationPrompt1 = ''
      } else {
        this.currentEdit.validationPrompt = this.currentEdit.validationPrompt3
        this.currentEdit.validationPrompt1 = ''
        this.currentEdit.validationPrompt2 = ''
      }
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const params = this.currentEdit
          if (params.codeId === null) {
            params.codeId = ''
          }
          if (params.desensitizationId === null) {
            params.desensitizationId = ''
          }
          // 加密传输暂时取消
          params.encryptionFlag = '1'
          editDictionary(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功！'
              })
            }
            this.drawerEdit = false
            this.handleSearch()
          }).catch(() => {
            this.drawerEdit = false
          }).finally(() => {

          })
        } else {
          this.$message({
            type: 'error',
            message: '验证不通过！'
          })
        }
      })
    },
    editChange() {
      if (this.currentEdit.validationType === 1) {
        this.currentEdit.validationPrompt2 = ''
        this.currentEdit.validationPrompt3 = ''
        this.$set(this.currentEdit, 'validationRule', '')
        this.$set(this.currentEdit, 'codeId', '')
        this.$set(this.currentEdit, 'standardId', '')
        this.$set(this.currentEdit, 'standardLevelOrValue', '')
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate('validationRule')
        })
      } else if (this.currentEdit.validationType === 2) {
        this.currentEdit.validationPrompt1 = ''
        this.currentEdit.validationPrompt3 = ''
        this.$set(this.currentEdit, 'codeId', '')
        this.$set(this.currentEdit, 'validationRule', '')
        this.$set(this.currentEdit, 'standardId', '')
        this.$set(this.currentEdit, 'standardLevelOrValue', '')
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate('codeId')
        })
      } else {
        this.currentEdit.validationPrompt1 = ''
        this.currentEdit.validationPrompt2 = ''
        this.$set(this.currentEdit, 'standardId', '')
        this.$set(this.currentEdit, 'standardLevelOrValue', '')
        this.$set(this.currentEdit, 'validationRule', '')
        this.$set(this.currentEdit, 'codeId', '')
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate('standardId')
          this.$refs.editForm.clearValidate('standardLevelOrValue')
        })
      }
    },
    addChange() {
      if (this.currentAdd.validationType === 1) {
        this.$set(this.currentAdd, 'validationRule', '')
        this.$set(this.currentAdd, 'codeId', '')
        this.$set(this.currentAdd, 'standardId', '')
        this.$set(this.currentAdd, 'standardLevelOrValue', '')
        this.$nextTick(() => {
          this.$refs.addForm.clearValidate('validationRule')
        })
      } else if (this.currentAdd.validationType === 2) {
        this.$set(this.currentAdd, 'codeId', '')
        this.$set(this.currentAdd, 'validationRule', '')
        this.$set(this.currentAdd, 'standardId', '')
        this.$set(this.currentAdd, 'standardLevelOrValue', '')
        this.$nextTick(() => {
          this.$refs.addForm.clearValidate('codeId')
        })
      } else {
        this.$set(this.currentAdd, 'standardId', '')
        this.$set(this.currentAdd, 'standardLevelOrValue', '')
        this.$set(this.currentAdd, 'validationRule', '')
        this.$set(this.currentAdd, 'codeId', '')
        this.$nextTick(() => {
          this.$refs.addForm.clearValidate('standardId')
          this.$refs.addForm.clearValidate('standardLevelOrValue')
        })
      }
    },
    addSubmit() {
      if (this.currentAdd.validationType === 1) {
        this.currentAdd.validationPrompt = this.currentAdd.validationPrompt1
        this.currentAdd.validationPrompt2 = ''
        this.currentAdd.validationPrompt3 = ''
      } else if (this.currentAdd.validationType === 2) {
        this.currentAdd.validationPrompt = this.currentAdd.validationPrompt2
        this.currentAdd.validationPrompt1 = ''
        this.currentAdd.validationPrompt3 = ''
      } else {
        this.currentAdd.validationPrompt = this.currentAdd.validationPrompt3
        this.currentAdd.validationPrompt1 = ''
        this.currentAdd.validationPrompt2 = ''
      }
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          const params = this.currentAdd
          // 加密传输暂时取消
          params.encryptionFlag = '1'
          saveDictionary(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '新增成功！'
              })
            }
            this.drawerAdd = false
            this.handleSearch()
          }).catch(() => {
            this.drawerAdd = false
          }).finally(() => {

          })
        } else {
          this.$message({
            type: 'error',
            message: '验证不通过！'
          })
        }
      })
    },
    handleRemove(data) {
      this.setExamineData(data, 'currentDel', ['_Old'])
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDictionaryById(this.currentDel).then(res => {
          if (res.code === 0) {
            this.pageInfo.page = 1
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          }
          this.handleSearch()
        }).catch(() => {
          this.handleSearch()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openDrawer(data) {
      this.setExamineData(data, 'currentEdit', ['_Old'])
      if (this.currentEdit.validationType === 1) {
        this.currentEdit.validationPrompt1 = this.currentEdit.validationPrompt
        this.currentEdit.validationPrompt2 = ''
        this.currentEdit.validationPrompt3 = ''
      } else if (this.currentEdit.validationType === 2) {
        this.currentEdit.validationPrompt2 = this.currentEdit.validationPrompt
        this.currentEdit.validationPrompt1 = ''
        this.currentEdit.validationPrompt3 = ''
      } else {
        this.currentEdit.validationPrompt3 = this.currentEdit.validationPrompt
        this.currentEdit.validationPrompt1 = ''
        this.currentEdit.validationPrompt2 = ''
      }
      this.drawerEdit = true
      this.setEmpty(this.currentEdit.standardId)
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    switchChangeAdd(status) {
      this.currentAdd.fieldOption = status
    },
    switchChangeEdit(status) {
      this.currentEdit.fieldOption = status
    },
    handleResetForm(form) {
      this.$refs[form].resetFields()
      this.handleSearch()
    },
    handlePage(current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize(size) {
      this.pageInfo.limit = size
      this.handleSearch()
    },
    /**
       * @description 设置el-table内容居中
       */
    cellstyle() {
      return 'padding-left: 10px;padding-right: 10px;'
    },
    /**
       * @description 设置el-table表头居中
       */
    rowClass() {
      return 'background:#ffffff;color:#515a6e;padding-left: 10px;padding-right: 10px;'
    }
  }
}

</script>

<style lang="less">
  .account-setting {
    &-con {
      height: ~"calc(100vh - 176px)";
      display: inline-block;
      vertical-align: top;
      position: relative;
      &.left-con {
        border-right: 1px solid #e6e6e6;
      }

      &.view-con {
        position: absolute;
        left: 264px;
        top: 16px;
        right: 16px;
        bottom: 16px;
        overflow: auto;
        padding: 12px 20px 0;
      }
    }
  }
</style>
