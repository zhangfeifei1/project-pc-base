<template>
  <div class="app-container wrapper">
    <el-tabs v-model="activeName" type="border-card" size="small" @tab-click="handleTabClick">
      <!-- 配置管理 -->
      <el-tab-pane label="配置管理" name="first">
        <el-row>
          <el-col :span="4">
            <el-button size="mini" type="primary" icon="el-icon-plus" style="margin-bottom:10px;" @click="handleAdd()">添 加</el-button>
          </el-col>
          <el-col :span="6" :offset="14">
            <el-input v-model="pageInfo.dataFlag" size="mini" placeholder="请输入标识">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch()" />
            </el-input>
          </el-col>
        </el-row>
        <!--数据详情-->
        <div class="tableStyle">
          <el-table :data="data" border :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
            <el-table-column prop="syncId" label="标识" width="180">
              <template slot-scope="scope">
                <a @click="handleShowByFlag(scope.row)">{{ scope.row.syncId }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="syncDesc" label="描述" width="300" />
            <el-table-column prop="syncType" label="维度" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.syncType === 0">用户</span>
                <span v-if="scope.row.syncType === 1">设备</span>
              </template>
            </el-table-column>
            <el-table-column prop="syncRange" label="同步范围" width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.syncRange === 0">全局同步</span>
                <span v-if="scope.row.syncRange === 1">指定同步</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="isInstant" label="持久化" width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.isInstant === 1">是</span>
                <span v-if="scope.row.isInstant === 0">否</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="status" label="已上线" width="170">
              <template slot-scope="scope">
                <el-badge v-if="scope.row.status===1" is-dot type="success" />
                <el-badge v-if="scope.row.status===0" is-dot type="danger" />
                <span v-if="scope.row.status===1">是</span>
                <span v-if="scope.row.status===0">否</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a @click="handleEdit(scope.row)">编辑</a>&nbsp;
                <!-- <a @click="handleTable(scope.row)">同步</a>&nbsp; -->
                <el-button type="text" size="small" :disabled="scope.row.status === 0 ?true:false" @click="handleTable(scope.row)">同步</el-button>
                <a v-if="scope.row.status==0" @click="handleONline(scope.row)">上线</a>
                <a v-if="scope.row.status==1" @click="handleOffline(scope.row)">下线</a>
                <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row>
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
        </el-row>
      </el-tab-pane>
      <!-- 数据查询 -->
      <el-tab-pane label="数据查询" name="second">
        <el-row style="margin-top:10px;">
          <el-col :span="3"><span style="font-size:16px">用户/设备状态查询</span></el-col>
          <el-col :span="3" :offset="13">
            <el-select v-model="searchM2.searchM2Type" size="small" style="width:100px">
              <el-option value="user" label="用户" />
              <el-option value="device" label="设备" />
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-input v-model="searchM2.searchM2Name" size="small" placeholder="请输入用户/设备名">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch2()" />
            </el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px;">
          <el-col :span="7" style="border-right:1px solid #cccccc">
            <el-row style="color:#707070;font-size:14px">{{ searchM2.searchM2Type=='user'?'用户名':'设备名' }}</el-row>
            <el-row
              v-if="searchM2.searchM2Type=='user'"
              style="padding:20px 0px 30px 0px;border-bottom:1px solid #cccccc"
            >
              {{ detailFrom.userName }}</el-row>
            <el-row
              v-if="searchM2.searchM2Type=='device'"
              style="padding:20px 0px 30px 0px;border-bottom:1px solid #cccccc"
            >
              {{ detailFrom.machineName }}</el-row>
            <el-row style="margin:10px 0px 10px -2px">
              <el-tooltip class="item" effect="light" content="标示用户是否连接到MSS服务" placement="right">
                <el-col style="color:#707070;font-size:14px" :span="3">状态</el-col>
              </el-tooltip>
            </el-row>
            <el-row style="color:#00a755;font-size:16px;">{{ detailFrom.status === 1?'在线':'离线' }}</el-row>
            <el-row style="margin:30px 0px 15px 0px;color:#707070;font-size:14px">近30天同步次数</el-row>
            <el-row>{{ detailFrom.pushTime }}</el-row>
            <el-row style="margin:20px 0px 15px 0px;color:#707070;font-size:14px">近30天同步到达次数</el-row>
            <el-row>{{ detailFrom.pushArrive }}</el-row>
          </el-col>
          <el-col :span="16" style="float:right">
            <div>
              <el-table :data="detaildata" border :cell-style="cellstyle" :header-cell-style="rowClass" size="small">
                <el-table-column prop="syncId" label="同步标识" />
                <el-table-column prop="syncTime" label="首次同步时间" width="220" />
                <el-table-column prop="ackTime" label="最终送达时间" width="220" />
                <el-table-column prop="status" label="是否送达" width="180">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status===1">同步成功</span>
                    <span v-if="scope.row.status===0">未同步</span>
                    <span v-if="scope.row.status===2">同步失败</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="padding:10px 0px 10px 0px">
              <el-pagination
                background
                :current-page="pageInfo2.page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageInfo2.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageInfo2.total"
                @size-change="handlePageSize2"
                @current-change="handlePage2"
              />
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 服务管理 -->
      <!-- <el-tab-pane label="服务管理" name="third">
        <div>
          <el-alert title="消息提示的文案" type="info" />
        </div>
        <div style="color:#707070;font-size:15px;margin:20px 0px 10px 30px">签名校验</div>
        <el-row>
          <el-col style="color:#707070;font-size:12px;margin:10px 0px 10px 40px" :span="19">
            对客户端到数据同步服务的建连请求进行验签，以验证调用者身份，保证安全
          </el-col>
          <el-col :span="4">
            <el-switch v-model="signValidate" active-color="#13ce66" inactive-color="#ff4949" @change="serviceChange()" />
          </el-col>
        </el-row>
      </el-tab-pane> -->
    </el-tabs>
    <!-- 添加配置 -->
    <el-dialog :visible.sync="drawer" :title="drawerTitle" width="60%" top="60px" :show-close="true">
      <div>
        <template>
          <el-form
            ref="submitModel"
            :model="submitModel"
            label-width="150px"
            label-position="left"
            :rules="ruleValidate"
            size="small"
          >
            <div class="greenarea" /><h4>基 础 配 置</h4>
            <el-form-item label="同步标识：" prop="syncId" class="inputframe1">
              <el-input
                v-model="submitModel.syncId"
                :disabled="drawerFlag != 'add'"
                placeholder="请输入标识"
                style="width:220px"
              />
            </el-form-item>
            <el-form-item label="同步范围：" prop="syncRange" class="inputframe1">
              <template>
                <el-radio-group v-model="submitModel.syncRange" :disabled="drawerFlag == 'detail'" style="width:220px">
                  <el-radio :label="0">全局同步</el-radio>
                  <el-radio :label="1">指定同步</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="同步说明：" prop="syncDesc" class="inputframe2">
              <el-input
                v-model="submitModel.syncDesc"
                :disabled="drawerFlag == 'detail'"
                placeholder="请输入同步说明"
                style="width:600px"
              />
            </el-form-item>
            <div v-if="submitModel.syncRange === 1" class="greenarea" />
            <div v-if="submitModel.syncRange === 1">
              <h4>同 步 对 象</h4>
            </div>
            <el-form-item v-if="submitModel.syncRange === 1 " label="同步对象：" prop="syncType" class="inputframe2">
              <template>
                <el-radio-group v-model="submitModel.syncType" :disabled="drawerFlag != 'add' && drawerFlag != 'edit'" style="width:220px">
                  <el-radio :label="0">用户</el-radio>
                  <el-radio :label="1">设备</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <!-- <el-tooltip
              v-if="submitModel.syncType=='USER'||submitModel.syncType==''"
              class="item"
              effect="dark"
              content="用户换设备后会重新收到已经推送的之前设备的数据"
              placement="left"
            > -->
            <el-form-item v-if="submitModel.syncType=='USER'||submitModel.syncType=='' && submitModel.syncRange === 1" prop="isMultiSync" class="inputframe2">
              <span slot="label">
                <span>多设备同步</span>
                <el-tooltip content="用户换设备后会重新收到已经推送的之前设备的数据" placement="bottom-start" effect="light">
                  <i class="el-icon-question" style="color:#606266" />
                </el-tooltip>
                <span>：</span>
              </span>
              <template>
                <el-radio-group
                  v-model="submitModel.isMultiSync"
                  :disabled="drawerFlag == 'detail'"
                  style="width:220px"
                >
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <!-- </el-tooltip> -->
            <!-- <div class="greenarea" /><h4>数 据 持 久 化</h4> -->
            <!-- <el-tooltip class="item" effect="dark" content="将数据保存至数据库，如果推送时用户/设备不在线，等用户/设备下一次在线后就会收到" placement="left"> -->
            <!-- <el-form-item label="数据持久化:" prop="isInstant">
              <span slot="label">
                <span>数据持久化</span>
                <el-tooltip content="将数据保存至数据库，如果推送时用户/设备不在线，等用户/设备下一次在线后就会收到" placement="bottom-start" effect="light">
                  <i class="el-icon-question" style="color:#606266" />
                </el-tooltip>
                <span>：</span>
              </span>
              <template>
                <el-radio-group v-model="submitModel.isInstant" :disabled="drawerFlag == 'detail'" style="width:220px">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </template>
            </el-form-item> -->

            <!-- <el-form-item v-if="submitModel.isInstant=='YES'||submitModel.isInstant==''" prop="repushType" class="inputframe1">
              <span slot="label">
                <span>重推方式</span>
                <el-tooltip content="表示仅推送阈值限定内的最新积压数据" placement="bottom-start" effect="light">
                  <i class="el-icon-question" style="color:#606266" />
                </el-tooltip>
                <span>：</span>
              </span>
              <template>
                <el-radio-group
                  v-model="submitModel.repushType"
                  :disabled="drawerFlag == 'detail'"
                  style="width:220px"
                >
                  <el-radio label="VALUE">阈值</el-radio>
                </el-radio-group>
              </template>
            </el-form-item> -->
            <!-- </el-tooltip> -->
            <!-- <el-form-item
              v-if="submitModel.isInstant=='YES'||submitModel.isInstant==''"
              label="重推阈值："
              prop="maxBacklog"
              class="inputframe1"
            >
              <el-input-number
                v-model="submitModel.maxBacklog"
                :disabled="drawerFlag == 'detail'"
                style="width:120px"
              /> -->
            <!-- </el-form-item> -->
            <!-- <div v-if="submitModel.syncType=='USER'||submitModel.syncType==''">
              <div class="greenarea" />
              <h4>安 全 控 制</h4>
              <el-form-item v-if="submitModel.syncType=='USER'||submitModel.syncType==''" label="用户一致性：" prop="userCons" class="inputframe1">
                <span slot="label">
                  <span>用户一致性</span>
                  <el-tooltip v-if="submitModel.syncType=='USER'||submitModel.syncType==''" content="通过回调租户接口验证用户的一致性" placement="bottom-start" effect="light">
                    <i class="el-icon-question" style="color:#606266" />
                  </el-tooltip>
                  <span>：</span>
                </span>
                <template>
                  <el-radio-group v-model="submitModel.userCons" :disabled="drawerFlag == 'detail'" style="width:220px">
                    <el-radio label="YES">是</el-radio>
                    <el-radio label="NO">否</el-radio>
                  </el-radio-group>
                </template>
              </el-form-item>
            </div> -->
            <!-- </el-tooltip> -->
            <div style="float:right;margin:15px 0px 30px 0px">
              <!-- <el-button v-if="drawerFlag=='detail'" size="small" long @click="handleEdit()">修 改</el-button> -->
              <el-button v-if="drawerFlag!='detail'" size="small" long @click="handleCancle()">取 消</el-button>
              <el-button v-if="drawerFlag!='detail'" size="small" type="primary" long @click="handleSubmit()">提 交</el-button>
            </div>
          </el-form>
        </template>
      </div>
    </el-dialog>
    <el-dialog title="新建同步" :visible.sync="dialogVisible" width="40%">
      <div>
        <template>
          <el-form
            ref="handleModel"
            :model="handleModel"
            label-width="100px"
            label-position="left"
            :rules="ruleValidate1"
          >
            <el-form-item v-if="rowModel.syncType==0&&rowModel.syncRange==1" label="用户ID:" prop="userId">
              <el-input v-model="handleModel.userId" size="mini" placeholder="请输入用户ID" style="width:220px" />
            </el-form-item>
            <el-form-item
              v-if="rowModel.syncType==1&&rowModel.syncRange==1"
              label="设备ID:"
              prop="deviceId"
            >
              <el-input v-model="handleModel.deviceId" size="mini" placeholder="请输入设备ID" style="width:220px" />
            </el-form-item>
            <el-form-item label="数据内容:" prop="content">
              <el-input
                v-model="handleModel.content"
                type="textarea"
                :rows="2"
                placeholder="请输入数据内容"
                style="width:220px"
              />
            </el-form-item>
            <el-tooltip
              v-if="rowModel.isInstant==0"
              class="item"
              effect="light"
              content="用于标示数据的唯一性，如果数据库中有相同ID的数据，后发送的数据会被丢弃"
              placement="top"
            >
              <!-- <el-form-item label="数据唯一ID:" prop="dataId">
                <template>
                  <el-input v-model="handleModel.dataId" size="mini" placeholder="请输入数据ID" style="width:220px" />
                </template>
              </el-form-item> -->
            </el-tooltip>
            <el-form-item label="系统:" prop="systemType">
              <template>
                <el-checkbox-group v-model="handleModel.systemType">
                  <el-checkbox label="ANDROID">ANDROID</el-checkbox>
                  <el-checkbox label="IOS">IOS</el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
            <el-form-item label="版本区间:" prop="versionMin">
              <el-input v-model="handleModel.versionMin" size="mini" style="width:100px" />
              <i class="el-icon-d-caret" style="transform:rotate(90deg);font-size:18px" />
              <el-input v-model="handleModel.versionMax" size="mini" style="width:100px" />
            </el-form-item>
            <el-form-item v-if="rowModel.isInstant==0" label="有效期:" prop="dateValue">
              <el-input-number v-model="handleModel.dateValue" :min="1" size="mini" style="width:120px" /> 天
            </el-form-item>
          </el-form>
        </template>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="addNew()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>>

<script>
import {
  getDataSynchroConfig,
  configONOFFline,
  configEdit,
  configAdd,
  configDelete,
  serviceSearch,
  serviceSwitch,
  configAddSynchro,
  dataSearchTable1,
  status
} from '@/api/dataSynchro'
export default {
  name: 'DataSynchro',
  filters: {
    typeFilter(data) {
      if (data === '0') {
        return '普通组'
      } else if (data === '1') {
        return '正则组'
      }
    }
  },
  data() {
    const validateId = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('同步标识不能为空'))
      } else if (value.trim().length < 2) {
        return callback(new Error('请至少输入2个字符'))
      } else {
        callback()
      }
    }
    const validatesyncDesc = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('推送说明不能为空'))
      } else if (value.trim().length < 2) {
        return callback(new Error('请至少输入2个字符'))
      } else {
        callback()
      }
    }
    const validateRepushThreshold = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('输入值不能为空'))
      } else if (value < 1 || value > 1000) {
        return callback(new Error('推送阈值必须介于1~1000'))
      } else {
        callback()
      }
    }
    const validateSix = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('数据内容不能为空'))
      } else if (value.trim().length < 6) {
        return callback(new Error('请至少输入6个字符'))
      } else {
        callback()
      }
    }
    const validateContent = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('数据内容不能为空'))
      } else {
        callback()
      }
    }
    const validateSixId = (rule, value, callback) => {
      if (!value.trim()) {
        return callback(new Error('数据ID不能为空'))
      } else if (value.trim().length < 6) {
        return callback(new Error('请至少输入6个字符'))
      } else {
        callback()
      }
    }
    const validateSixId1 = (rule, value, callback) => {
      if (!value.trim() || !this.handleModel.versionMax) {
        return callback(new Error('区块不能为空'))
      } else if (value.trim().length < 6 || this.handleModel.versionMax.length < 6) {
        return callback(new Error('请至少输入6个字符'))
      } else {
        callback()
      }
    }

    return {
      activeName: 'first',
      drawer: false,
      drawerTitle: '',
      drawerFlag: '',
      dialogVisible: false,
      signValidate: true,
      searchM2: {
        searchM2Type: 'user',
        searchM2Name: ''
      },
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        dataFlag: ''
      },
      pageInfo2: {
        total: 0,
        page: 1,
        limit: 10
      },
      rowModel: {},
      submitModel: {
        syncId: '',
        syncRange: '',
        syncDesc: '',
        syncType: '',
        isMultiSync: 0,
        isInstant: 0,
        // repushType: 'VALUE', // 需要删除
        maxBacklog: 1
        // userCons: '' // 需要删除
      },
      handleModel: {
        userId: '',
        deviceId: '',
        content: '',
        dataId: '',
        systemType: [],
        versionMin: '',
        versionMax: '',
        dateValue: ''
      },
      detailFrom: {
        userName: '',
        machineName: '',
        status: '',
        pushTime: '',
        pushArrive: ''
      },
      detaildata: [],
      data: [],
      ruleValidate: {
        syncId: [{
          required: true,
          validator: validateId,
          trigger: 'blur'
        }],
        syncRange: [{
          required: true,
          message: '推送范围不可为空！',
          trigger: 'change'
        }],
        syncDesc: [{
          required: true,
          validator: validatesyncDesc,
          trigger: 'blur'
        }],
        syncType: [{
          required: true,
          message: '推送对象不可为空！',
          trigger: 'change'
        }],
        isMultiSync: [{
          required: true,
          message: '多设备同步不可为空！',
          trigger: 'change'
        }],
        isInstant: [{
          required: true,
          message: '数据持久化不可为空！',
          trigger: 'change'
        }],
        // repushType: [{
        //   required: true,
        //   message: '重推方式不可为空！',
        //   trigger: 'change'
        // }],
        maxBacklog: [{
          required: true,
          validator: validateRepushThreshold,
          trigger: 'change'
        }]
        // userCons: [{
        //   required: true,
        //   message: '用户一致性不可为空！',
        //   trigger: 'change'
        // }]
      },
      ruleValidate1: {
        userId: [{
          required: true,
          validator: validateSix,
          trigger: 'blur'
        }],
        deviceId: [{
          required: true,
          validator: validateSix,
          trigger: 'blur'
        }],
        content: [{
          required: true,
          validator: validateContent,
          trigger: 'blur'
        }],
        dataId: [{
          required: true,
          validator: validateSixId,
          trigger: 'blur'
        }],
        systemType: [{
          required: true,
          message: '系统不能为空',
          trigger: 'blur'
        }],
        versionMin: [{
          required: true,
          validator: validateSixId1,
          // message: '区块不能为空',
          trigger: 'blur'
        }],
        versionMax: [{
          required: true,
          message: '区块不能为空',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.handleSearch()
  },
  methods: {
    // 查询
    handleSearch() {
      const params = {
        size: this.pageInfo.limit,
        current: this.pageInfo.page,
        syncId: this.pageInfo.dataFlag
      }
      getDataSynchroConfig(params).then(res => {
        console.log(JSON.stringify(res, null, 4), '分页1111111111')
        this.data = JSON.parse(JSON.stringify(res.data.records))
        this.pageInfo.total = parseInt(res.data.total)
      }).finally(() => {})
    },
    // 查询2表格
    handleSearch2() {
      // if (this.searchM2.searchM2Name === '') {
      //   alert('请输入id')
      // }
      if (this.searchM2.searchM2Type === 'user') {
        const params = {
          queryType: 'user',
          size: this.pageInfo2.limit,
          current: this.pageInfo2.page,
          sendId: this.searchM2.searchM2Name
        }
        dataSearchTable1(params).then(res => {
          this.detaildata = res.data.records
          this.pageInfo2.total = parseInt(res.data.total)
        }).finally(() => {})
        // 用户状态查询
        const data = {
          queryType: 'user',
          sendId: this.searchM2.searchM2Name
        }
        status(data).then(res => {
          console.log(res, '*8状态**')
          if (res.returnCode === '000000') {
            this.detailFrom.status = res.data.status
            this.detailFrom.userName = this.searchM2.searchM2Name
            this.detailFrom.pushTime = res.data.sendCount
            this.detailFrom.pushArrive = res.data.sendSuccessCount
          }
        })
      }
      if (this.searchM2.searchM2Type === 'device') {
        const params = {
          queryType: 'device',
          size: this.pageInfo2.limit,
          current: this.pageInfo2.page,
          sendId: this.searchM2.searchM2Name
        }
        dataSearchTable1(params).then(res => {
          this.detaildata = res.data.records
          this.pageInfo2.total = parseInt(res.data.total)
        }).finally(() => {})
        // 设备状态查询
        const data = {
          queryType: 'device',
          sendId: this.searchM2.searchM2Name
        }
        status(data).then(res => {
          console.log(res, '*8状态**')
          if (res.returnCode === '000000') {
            this.detailFrom.status = res.data.status
            this.detailFrom.userName = this.searchM2.searchM2Name
            this.detailFrom.pushTime = res.data.sendCount
            this.detailFrom.pushArrive = res.data.sendSuccessCount
          }
        })
      }
    },
    // 切换标题栏
    handleTabClick(tab, event) {
      console.log(tab.name)
      if (tab.name === 'first') {
        this.pageInfo.page = 1
        this.handleSearch()
      }
      if (tab.name === 'second') {
        this.pageInfo2.page = 1
      }
      if (tab.name === 'third') {
        serviceSearch().then(res => {
          if (res.data.configValue === 'YES') {
            this.signValidate = true
          } else {
            this.signValidate = false
          }
        }).finally(() => {})
      }
    },
    // 切换第三栏的签名开关
    serviceChange() {
      let params = ''
      if (this.signValidate === true) {
        params = {
          configValue: 'YES'
        }
      } else {
        params = {
          configValue: 'NO'
        }
      }
      serviceSwitch(params).then(res => {
        serviceSearch().then(res => {
          if (res.data.configValue === 'YES') {
            this.signValidate = true
          } else {
            this.signValidate = false
          }
        }).finally(() => {})
      }).finally(() => {})
    },
    // 添加功能
    handleAdd() {
      this.drawer = true
      this.drawerTitle = '新建同步配置'
      this.drawerFlag = 'add'
      this.$nextTick(() => {
        this.$refs['submitModel'].resetFields()
        this.submitModel = {
          id: '',
          syncRange: '',
          syncDesc: '',
          syncType: '',
          isMultiSync: 'YES',
          isInstant: 0,
          // repushType: 'VALUE',
          maxBacklog: 1
          // userCons: ''
        }
      })
    },
    // 表格内查看
    handleShowByFlag(val) {
      this.drawer = true
      this.drawerTitle = '同步配置详情'
      this.drawerFlag = 'detail'
      this.submitModel = JSON.parse(JSON.stringify(val))
    },
    // 修改
    handleEdit(val) {
      this.drawer = true
      this.drawerTitle = '编辑同步配置'
      this.drawerFlag = 'edit'
      this.submitModel = JSON.parse(JSON.stringify(val))
    },
    // 提交
    handleSubmit() {
      this.$refs['submitModel'].validate(valid => {
        if (valid) {
          const params = {
            syncId: this.submitModel.syncId,
            syncRange: this.submitModel.syncRange,
            syncDesc: this.submitModel.syncDesc,
            syncType: this.submitModel.syncType,
            isInstant: this.submitModel.isInstant
          }
          if (this.submitModel.syncType === 0) {
            params.isMultiSync = this.submitModel.isMultiSync
            // params.userCons = this.submitModel.userCons
          }
          // if (this.submitModel.isInstant === 'YES') {
          //   // params.repushType = this.submitModel.repushType
          //   params.maxBacklog = this.submitModel.maxBacklog
          // }
          if (this.drawerFlag === 'add') {
            configAdd(params).then(res => {
              if (res.data) {
                this.$message({
                  message: '新增成功！',
                  type: 'success'
                })
                this.handleSearch()
              }
            }).finally(() => {})
          }
          if (this.drawerFlag === 'edit') {
            configEdit(params).then(res => {
              if (res.data) {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                })
                this.handleSearch()
              }
            }).finally(() => {})
          }

          this.drawer = false
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 取消提交
    handleCancle() {
      this.drawer = false
    },
    // 表格内操作
    handleTable(val) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['handleModel'].resetFields()
        this.handleModel = {
          userId: '',
          deviceId: '',
          content: '',
          dataId: '',
          systemType: [],
          versionMin: '',
          versionMax: '',
          dateValue: ''
        }
      })

      this.rowModel = JSON.parse(JSON.stringify(val))
    },
    // 确认新建
    addNew() {
      this.$refs['handleModel'].validate(valid => {
        if (valid) {
          const params = {
            syncId: this.rowModel.syncId,
            content: this.handleModel.content,
            systemType: this.handleModel.systemType,
            versionMin: this.handleModel.versionMin,
            versionMax: this.handleModel.versionMax
          }
          if (this.rowModel.syncType === 0 && this.rowModel.syncRange === 1) {
            params.userId = this.handleModel.userId
          }
          if (this.rowModel.syncType === 1 && this.rowModel.syncRange === 1) {
            params.deviceId = this.handleModel.deviceId
          }
          // if (this.rowModel.isInstant === 0) {
          //   params.dataId = this.handleModel.dataId
          // }
          if (this.rowModel.isInstant === 0) {
            params.dateValue = this.handleModel.dateValue
          }
          if (params.systemType.indexOf('ANDROID') > -1) {
            if (params.systemType.indexOf('IOS') > -1) {
              params.systemType = 2
            } else {
              params.systemType = 0
            }
          } else {
            params.systemType = 1
          }

          configAddSynchro(params).then(res => {
            if (res.data) {
              this.$message({
                message: '提交成功！',
                type: 'success'
              })
              this.dialogVisible = false
            }
          }).finally(() => {})
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 下线
    handleOffline(val) {
      this.$confirm('确定下线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: val.id,
          status: 0,
          syncId: val.syncId
        }
        configONOFFline(params).then(res => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '下线成功!'
            })
            this.pageInfo.page = 1
            this.handleSearch()
          }
        }).finally(() => {})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 上线
    handleONline(val) {
      this.$confirm('确定上线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: val.id,
          status: 1
        }
        configONOFFline(params).then(res => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '上线成功!'
            })
            this.pageInfo.page = 1
            this.handleSearch()
          }
        }).finally(() => {})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 删除
    handleDelete(item) {
      console.log(item, '删除同步111111111')
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          configDelete(item)
            .then((res) => {
              console.log(res)
              if (res.returnCode === '000000') {
                this.$message.success('删除成功!')
                this.handleSearch()
              } else {
                this.$message.error('删除失败')
              }
            })
            .finally((res) => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
      return 'background:#ffffff;color:#515a6e;padding-left: 10px;padding-right: 10px;line-height: 23px;font-size:12px'
    },
    handlePage(current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize(size) {
      this.pageInfo.limit = size
      this.handleSearch()
    },
    handlePage2(current) {
      this.pageInfo2.page = current
      this.handleSearch2()
    },
    handlePageSize2(size) {
      this.pageInfo2.limit = size
      this.handleSearch2()
    }

  }
}

</script>>

<style lang="scss" scoped>
  .wrapper {

    // height:90vh;
    // overflow: hidden;
    .border-1 {
      border: solid 1px #eee;
    }

    .border-radius-4 {
      border-radius: 4px;
    }

    .margin-b25 {
      margin-bottom: 25px;
    }

    .package-aside {
      border-right: 1px solid #e6e6e6;

      .package-aside_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        padding: 0 20px;
        background: #eef1f6;
        margin-bottom: 16px;
      }

      .package-aside_list {
        .package-aside_input {
          padding: 0 20px;
          margin-bottom: 10px;
        }

        .package-aside_list_menu {
          font-size: 14px;
          color: #303133;

          .menu_list_item {
            padding: 0 20px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            div:nth-child(1) {
              flex: 1;
            }

            div {
              line-height: 56px;
            }

            i {
              display: inline-block;
              margin-left: 10px;
            }
          }

          .active {
            background: #ecf5ff;
            cursor: pointer;
          }

          .isactive {
            color: #015252;
            background: #ecf5ff;
            cursor: pointer;
          }
        }
      }
    }

    .package-main {
      .package-main_line {
        margin-bottom: 20px;
      }

      .table_row_status {
        position: relative;
      }

      .table_row_status:before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        position: absolute;
        left: -10px;
        top: 50%;
        margin-top: -5px;
        background: #015252;
        border-color: #015252;
      }

      .el-table_expand {
        padding: 20px;
        display: flex;
        align-items: center;

        div {
          margin-right: 30px;

          .link_font {
            margin-right: 20px;
          }
        }

        >div:nth-child(3) {
          margin-right: 60px;
        }
      }
    }

    .configure-mgt {
      padding: 25px 50px;

      .el-form-item {
        position: relative;

        .el-form-item_label_self {
          position: absolute;
          left: -10px;
        }
      }
    }
  }
  .greenarea{
    width: 5px;
    height: 16px;
    float: left;
    background-color: #015252;
    margin-right: 10px;
  }
  .inputframe1{
    width: 50%;
    height: 40px;
    border: 0;
    float: left;
  }
  .inputframe2{
    width: 100%;
    height: 40px;
    border: 0;
    float: left;
  }
  /deep/ .el-dialog__body {
    padding: 0 0 10px 0;
    overflow: hidden;
  }
</style>
