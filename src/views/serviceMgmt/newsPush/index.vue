<template>
  <div class="app-container wrapper">
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleTabClick">
      <!-- 消息列表 -->
      <el-tab-pane label="消息列表" name="first">
        <el-row>
          <el-col :span="3">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd()">新建推送消息</el-button>
          </el-col>
          <el-col :span="5" :offset="10" style="padding-right:10px">
            <el-input v-model="pageInfo.targetId" size="small" placeholder="输入完整设备ID或用户ID" />
          </el-col>
          <el-col :span="6" style="padding-right:10px">
            <el-input v-model="pageInfo.bussMsgId" size="small" placeholder="输入完整业务方消息ID">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch(1)" />
            </el-input>
          </el-col>
        </el-row>
        <div style="margin:15px 0px 15px 0px">
          <el-alert
            title="消息列表默认展示极简推送、模板推送的最近30天历史消息记录；支持查询极简推送、模板推送、批量推送的最近30天历史消息记录"
            type="warning"
            show-icon
          />
        </div>
        <!--数据详情-->
        <div class="tableStyle">
          <el-table
            :data="data"
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
          >
            <!-- <el-table-column prop="bussMsgId" label="业务方消息 ID" width="200" /> -->
            <el-table-column prop="targetType" label="维度" width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.targetType==='0'">用户</span>
                <span v-if="scope.row.targetType==='1'">设备</span>
              </template>
            </el-table-column>
            <el-table-column prop="targetId" label="推送目标 ID" width="200">
              <template slot="header">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="推送目标 ID 分为用户标识及设备标识两种"
                  placement="top"
                >
                  <span>推送目标 ID</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="msgType" label="推送类型" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.msgType==='0'">极简推送</span>
                <span v-if="scope.row.msgType==='1'">模板推送</span>
                <span v-if="scope.row.msgType==='2'">批量推送</span>
                <span v-if="scope.row.msgType==='3'">群发推送</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="推送标题" width="200" />
            <el-table-column prop="createTime" label="消息创建时间" sortable width="200" />
            <el-table-column prop="id" label="消息 ID" width="200">
              <template slot="header">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="消息 ID 是指在整个推送平台内部不区分应用唯一的消息标识，当需要协助排查时，提供该标识即可。"
                  placement="top"
                >
                  <span>消息 ID</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="消息推送状态" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.status===0">待推送</span>
                <span v-if="scope.row.status===1">成功</span>
                <span v-if="scope.row.status===2">失败</span>
                <span v-if="scope.row.status===3">异常</span>
                <span v-if="scope.row.status===4">未知</span>
              </template>
            </el-table-column>
            <el-table-column prop="expireTime" label="消息过期时间" width="200" />
            <el-table-column prop="updateTime" label="消息变更时间" width="200">
              <template slot="header">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="消息变更时间分为三种情况，分别是即时成功、即时失败、超时失败"
                  placement="top"
                >
                  <span>消息变更时间</span>
                </el-tooltip>
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
      <!-- 使用分析 -->
      <!-- <el-tab-pane label="使用分析" name="second">
        <el-row style="margin:14px 0px 10px 0px">
          <el-col :span="3">
            <template>
              <el-select v-model="secondSearch.platform" size="small" placeholder="所有平台" clearable>
                <el-option
                  v-for="item in platformOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-col>
          <el-col :span="3" style="margin:0px 20px 0px 20px">
            <template>
              <el-select v-model="secondSearch.edition" size="small" placeholder="所有版本" clearable>
                <el-option
                  v-for="item in editionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-col>
          <el-col :span="3">
            <template>
              <el-select
                v-model="secondSearch.pushChannel"
                size="small"
                placeholder="所有推送渠道"
                clearable
              >
                <el-option
                  v-for="item in pushChannelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-col>
          <el-col :span="3" style="margin:0px 20px 0px 20px">
            <template>
              <el-select
                v-model="secondSearch.pushType"
                size="small"
                placeholder="所有推送类型"
                clearable
              >
                <el-option
                  v-for="item in pushTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-col>
          <el-col :span="7">
            <template>
              <el-date-picker
                v-model="secondSearch.time"
                size="small"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </template>
          </el-col>
        </el-row> -->
      <!--推送核心指标-->
      <!-- <div class="tableStyle">
          <h5 style="margin-top:30px">推送核心指标</h5>
          <el-row style="height:110px;" type="flex" justify="center">
            <el-col :span="5" style="background-color:#F0F6FE;margin-right:10px">
              <div style="float:left;margin-right:15px;margin-left:20px">
                <i
                  class="el-icon-data-line"
                  style="line-height:110px;font-size:80px;font-weight:300;color:#5f9bf1"
                />
              </div>
              <div style="float:left;padding-top:10px">
                <h5 style="margin:30px 0px 10px 0px">推送成功数</h5>
                <span style="font-size:20px;font-weight:700;color:#5f9bf1">123123</span>
                <span style="color:#707070">67%</span>
              </div>
            </el-col>
            <el-col :span="5" style="background-color:#F0F6FE;margin-right:10px">
              <div style="float:left;margin-right:15px;margin-left:20px">
                <i
                  class="el-icon-data-line"
                  style="line-height:110px;font-size:80px;font-weight:300;color:#5f9bf1"
                />
              </div>
              <div style="float:left;padding-top:10px">
                <h5 style="margin:30px 0px 10px 0px">推送成功数</h5>
                <span style="font-size:20px;font-weight:700;color:#5f9bf1">123123</span>
                <span style="color:#707070">66%</span>
              </div>
            </el-col>
            <el-col :span="5" style="background-color:#F0F6FE;margin-right:10px">
              <div style="float:left;margin-right:15px;margin-left:20px">
                <i
                  class="el-icon-data-line"
                  style="line-height:110px;font-size:80px;font-weight:300;color:#5f9bf1"
                />
              </div>
              <div style="float:left;padding-top:10px">
                <h5 style="margin:30px 0px 10px 0px">推送成功数</h5>
                <span style="font-size:20px;font-weight:700;color:#5f9bf1">123123</span>
                <span style="color:#707070">65%</span>
              </div>
            </el-col>
            <el-col :span="5" style="background-color:#F0F6FE">
              <div style="float:left;margin-right:15px;margin-left:20px">
                <i
                  class="el-icon-data-line"
                  style="line-height:110px;font-size:80px;font-weight:300;color:#5f9bf1"
                />
              </div>
              <div style="float:left;padding-top:10px">
                <h5 style="margin:30px 0px 10px 0px">推送成功数</h5>
                <span style="font-size:20px;font-weight:700;color:#5f9bf1">123123</span>
                <span style="color:#707070">64%</span>
              </div>
            </el-col>
          </el-row> -->
      <!-- 图表选项 -->
      <!-- <div style="margin-top:30px;">
            <div style="display:inline-block">
              <el-radio-group v-model="searchRadio1" size="small" @change="searchRadio1Change()">
                <el-radio-button label="按数量查询" />
                <el-radio-button label="按比例查询" />
              </el-radio-group>
            </div>
            <div style="float:right">
              <el-radio-group v-model="searchRadio2" size="small" @change="searchRadio2Change()">
                <el-radio-button label="分钟" />
                <el-radio-button label="小时" />
                <el-radio-button label="日" />
              </el-radio-group>
            </div>
          </div> -->
      <!-- 图表 -->
      <!-- <el-row style="margin-top:30px;" type="flex" justify="center"> -->
      <!--创建一个echarts的容器-->
      <!-- <div ref="echart" style="width:1000px;height:400px" />
          </el-row> -->
      <!--详细数据-->
      <!-- <h5 style="margin-top:30px">详细数据</h5>
          <el-table
            :data="secondData"
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
          >
            <el-table-column prop="pushExplain" label="时间" />
            <el-table-column prop="pushExplain" label="推送成功数" width="250" />
            <el-table-column prop="pushExplain" label="到达数（到达率）" width="250" />
            <el-table-column prop="pushExplain" label="打开数（打开率）" width="250" />
            <el-table-column prop="pushExplain" label="忽略数（忽略率）" width="250" />
          </el-table>
        </div>
      </el-tab-pane> -->
      <!-- 消息模板 -->
      <el-tab-pane label="消息模板" name="third">
        <el-row>
          <el-col :span="4">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-plus"
              style="margin-bottom:10px"
              @click="thirdAdd()"
            >创建模板</el-button>
          </el-col>
        </el-row>
        <!--数据详情-->
        <div class="tableStyle">
          <el-table
            :data="thirddata"
            border
            :cell-style="cellstyle"
            :header-cell-style="rowClass"
            size="small"
          >
            <el-table-column prop="templateName" label="模板名称" width="220" />
            <el-table-column prop="templateDesc" label="模板描述" width="250" />
            <el-table-column prop="content" label="模板正文" width="250" />
            <el-table-column prop="createTime" label="创建日期" width="220" />
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a @click="thirdTable(scope.row)">查看</a>&nbsp;
                <a @click="thirdDelete(scope.row)">删除</a>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-row>
          <el-col :span="24" class="toolbar">
            <el-pagination
              background
              :current-page="thirdpageInfo.page"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="thirdpageInfo.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="thirdpageInfo.total"
              @size-change="thirdhandlePageSize"
              @current-change="thirdhandlePage"
            />
          </el-col>
        </el-row>
      </el-tab-pane>
      <!-- 推送配置 -->
      <el-tab-pane label="推送配置" name="fourth">
        <el-card style="margin-bottom:20px">
          <div slot="header">
            <span>FCM 推送渠道</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="fourthConfigure1()"
            >配置</el-button>
          </div>
          <div>
            <el-row v-if="!fourthConfigureFlag1" type="flex" justify="center">
              <h5>mPaaS 移动推送服务接入了 FCM 推送渠道，可以在安装有 Google Play 服务的手机上建立系统级长连接，极大提高了海外手机设备的消息送达率。</h5>
            </el-row>
            <el-row v-if="!fourthConfigureFlag1" type="flex" justify="center" style="margin:20px 0">
              <el-button size="small">接入文档</el-button>
            </el-row>
            <el-row v-if="fourthConfigureFlag1" type="flex" justify="center">
              <div>
                <template>
                  <el-form
                    ref="fourthConfig"
                    :model="fourthConfig"
                    label-width="200px"
                    label-position="right"
                    :rules="fourthConfigRules"
                    size="small"
                  >
                    <el-form-item label="状态：" prop="status">
                      <el-switch v-model="fourthConfig.status" />
                    </el-form-item>
                    <el-form-item label="FCM 服务器密钥：" prop="FCMKey">
                      <el-input v-model="fourthConfig.FCMKey" style="width:400px" />
                    </el-form-item>
                  </el-form>
                  <el-button
                    type="primary"
                    style="margin-left:230px"
                    size="small"
                    @click="handleFourthConfig()"
                  >确 定</el-button>
                </template>
              </div>
            </el-row>
          </div>
        </el-card>
        <el-card>
          <div slot="header">
            <span>iOS 推送证书</span>
          </div>
          <div>
            <el-row type="flex" justify="center">
              <div>
                <template>
                  <el-form
                    ref="IOSFrom"
                    :model="IOSFrom"
                    label-width="120px"
                    label-position="right"
                    :rules="IOSFromRules"
                    size="small"
                  >
                    <el-form-item label="选择证书文件：">
                      <template>
                        <el-upload
                          ref="IOSFromUpload"
                          class="upload-demo"
                          action="/pmobile/mobilepush/mobilePushConfig/saveOrUpdate"
                          :data="uploadData"
                          :headers="headersToken"
                          :file-list="IOSFileList"
                          :auto-upload="false"
                          :on-change="IOSUploadChange"
                          :on-remove="IOSUploadRemove"
                          :on-success="IOSSuccessCallback"
                          :on-error="IOSErrorCallback"
                        >
                          <el-button slot="trigger" class="el-icon-upload2">点击上传</el-button>
                          <el-button class="el-icon-download" @click="downIOSFile()">下载证书</el-button>
                        </el-upload>
                      </template>
                    </el-form-item>
                    <el-form-item label="证书密码：" prop="certPwd">
                      <el-input v-model="IOSFrom.certPwd" style="width:400px" />
                    </el-form-item>
                    <el-form-item label="证书环境：" prop="certEnv">
                      <el-select
                        v-model="IOSFrom.certEnv"
                        style="width:260px"
                        @change="IOSChange()"
                      >
                        <el-option label="APNS2.0生产环境" value="1" />
                        <el-option label="APNS2.0开发环境" value="2" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="BundleId：" prop="BundleId">
                      <el-input v-model="IOSFrom.BundleId" style="width:400px" />
                    </el-form-item>
                    <el-form-item required label="主机：" prop="host">
                      <el-input v-model="IOSFrom.host" disabled style="width:400px" />
                    </el-form-item>
                    <el-form-item required label="端口：" prop="port">
                      <el-input v-model="IOSFrom.port" disabled style="width:400px" />
                    </el-form-item>
                  </el-form>
                  <el-button
                    type="primary"
                    style="margin-left:146px"
                    size="small"
                    @click="handleIOS()"
                  >确 定</el-button>
                </template>
              </div>
            </el-row>
          </div>
        </el-card>
      </el-tab-pane>
      <!-- 密钥管理 -->
      <!-- <el-tab-pane label="密钥管理" name="fifth">
        <el-card style="margin-bottom:20px">
          <div slot="header">
            <span>推送 API 接口配置</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="fifthConfigure1()">配置</el-button>
          </div>
          <div>
            <el-row v-if="!fifthConfigureFlag1" type="flex" justify="center">
              <h5>移动推送服务提供了 Rest 接口，为保证安全性，需要对调用者的身份进行验证；所以调用者在进行 API 调用时，需要根据规定的方式对参数进行加签。
              </h5>
            </el-row>
            <el-row v-if="!fifthConfigureFlag1" type="flex" justify="center" style="margin:20px 0">
              <el-button size="small">接入文档</el-button>
            </el-row>
            <el-row v-if="fifthConfigureFlag1" type="flex" justify="center">
              <div>
                <template>
                  <el-form ref="fifthConfig" :model="fifthConfig" label-width="200px" label-position="right" size="small">
                    <el-form-item required="" label="状态：" prop="status">
                      <el-switch v-model="fifthConfig.status" />
                    </el-form-item>
                    <el-form-item label="调用接口加密方式：" prop="APIENCType">
                      <template>
                        <el-radio-group v-model="fifthConfig.APIENCType" style="width:280px">
                          <el-radio label="MD5">MD5算法</el-radio>
                          <el-radio label="RSA">RSA算法</el-radio>
                        </el-radio-group>
                      </template>
                    </el-form-item>
                    <el-form-item v-if="fifthConfig.APIENCType=='MD5'" label="MD5 算法密钥：" prop="MDKey">
                      <el-input v-model="fifthConfig.MDKey" style="width:400px" />
                    </el-form-item>
                    <el-form-item v-if="fifthConfig.APIENCType=='RSA'" label="RSA 算法公钥：" prop="RSAKey">
                      <el-input v-model="fifthConfig.RSAKey" style="width:400px" />
                    </el-form-item>
                  </el-form>
                  <el-button size="small" type="primary" style="margin-left:230px" @click="handlefifthConfig()">确 定
                  </el-button>
                </template>
              </div>
            </el-row>
          </div>
        </el-card>
        <el-card style="margin-bottom:20px">
          <div slot="header">
            <span>推送回调接口配置</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="fifthConfigure2()">配置</el-button>
          </div>
          <div>
            <el-row v-if="!fifthConfigureFlag2" type="flex" justify="center">
              <h5>移动推送服务针对消息提供了回调机制，如果需要移动推送服务回调，请打开回调开关，并配置回调地址。为保证安全性，在回调时会对请求进行签名。
              </h5>
            </el-row>
            <el-row v-if="!fifthConfigureFlag2" type="flex" justify="center" style="margin:20px 0">
              <el-button size="small">接入文档</el-button>
            </el-row>
            <el-row v-if="fifthConfigureFlag2" type="flex" justify="center">
              <div>
                <template>
                  <el-form ref="fifthConfig2" :model="fifthConfig2" label-width="200px" label-position="right" size="small">
                    <el-form-item required label="状态：" prop="status">
                      <el-switch v-model="fifthConfig2.status" />
                    </el-form-item>
                    <el-form-item required label="回调接口 URL 地址：" prop="callURL">
                      <el-input v-model="fifthConfig2.callURL" style="width:400px">
                        <template slot="prepend">http://</template>
                        <template slot="append">?sign=</template>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="回调接口加密方式：" prop="callbackENCType">
                      <el-input v-model="fifthConfig2.callbackENCType" style="width:400px" />
                    </el-form-item>
                    <el-form-item label="RSA 算法公钥：" prop="RSAPubKey">
                      <el-input
                        v-model="fifthConfig2.RSAPubKey"
                        type="textarea"
                        :autosize="{ minRows: 5, maxRows: 10}"
                        style="width:400px"
                      />
                    </el-form-item>
                  </el-form>
                  <el-button size="small" type="primary" style="margin-left:230px" @click="handlefifthConfig2()">确 定
                  </el-button>
                </template>
              </div>
            </el-row>
          </div>
        </el-card>
      </el-tab-pane>-->
      <!-- 渠道配置 -->
      <el-tab-pane label="渠道配置" name="sixth">
        <el-card style="margin-bottom:20px">
          <div slot="header">
            <span>小米推送渠道</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="sixthConfigure1()"
            >配置</el-button>
          </div>
          <div>
            <el-row v-if="!sixthConfigureFlag1" type="flex" justify="center">
              <h5>mPaaS 移动推送服务接入了小米推送渠道，可以在小米手机上建立系统级长连接，极大提高小米手机的消息送达率。</h5>
            </el-row>
            <el-row v-if="!sixthConfigureFlag1" type="flex" justify="center" style="margin:20px 0">
              <el-button size="small">接入文档</el-button>
            </el-row>
            <el-row v-if="sixthConfigureFlag1" type="flex" justify="center">
              <div>
                <template>
                  <el-form
                    ref="sixthConfig1"
                    :model="sixthConfig1"
                    label-width="200px"
                    label-position="right"
                    size="small"
                  >
                    <el-form-item required label="状态：" prop="status">
                      <el-switch v-model="sixthConfig1.status" />
                    </el-form-item>
                    <el-form-item required label="包名：" prop="baoming">
                      <el-input v-model="sixthConfig1.baoming" style="width:400px" />
                    </el-form-item>
                    <el-form-item required label="密码：" prop="password">
                      <el-input v-model="sixthConfig1.password" style="width:400px" />
                    </el-form-item>
                  </el-form>
                  <el-button
                    size="small"
                    type="primary"
                    style="margin-left:230px"
                    @click="handleSixthConfig1()"
                  >确 定</el-button>
                </template>
              </div>
            </el-row>
          </div>
        </el-card>
        <el-card style="margin-bottom:20px">
          <div slot="header">
            <span>华为推送渠道</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="sixthConfigure2()"
            >配置</el-button>
          </div>
          <div>
            <el-row v-if="!sixthConfigureFlag2" type="flex" justify="center">
              <h5>mPaaS 移动推送服务接入了华为推送渠道，可以在华为手机上建立系统级长连接，极大提高华为手机的消息送达率。</h5>
            </el-row>
            <el-row v-if="!sixthConfigureFlag2" type="flex" justify="center" style="margin:20px 0">
              <el-button size="small">接入文档</el-button>
            </el-row>
            <el-row v-if="sixthConfigureFlag2" type="flex" justify="center">
              <div>
                <template>
                  <el-form
                    ref="sixthConfig2"
                    :model="sixthConfig2"
                    label-width="200px"
                    label-position="right"
                    size="small"
                  >
                    <el-form-item required label="状态：" prop="status">
                      <el-switch v-model="sixthConfig2.status" />
                    </el-form-item>
                    <el-form-item required label="包名：" prop="baoming">
                      <el-input v-model="sixthConfig2.baoming" style="width:400px" />
                    </el-form-item>
                    <el-form-item required label="华为应用 ID：" prop="huaweiID">
                      <el-input v-model="sixthConfig2.huaweiID" style="width:400px" />
                    </el-form-item>
                    <el-form-item required label="华为应用密钥：" prop="huaweiKey">
                      <el-input v-model="sixthConfig2.huaweiKey" style="width:400px" />
                    </el-form-item>
                  </el-form>
                  <el-button
                    size="small"
                    type="primary"
                    style="margin-left:230px"
                    @click="handleSixthConfig2()"
                  >确 定</el-button>
                </template>
              </div>
            </el-row>
          </div>
        </el-card>
        <el-card style="margin-bottom:20px">
          <div slot="header">
            <span>OPPO推送渠道</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="sixthConfigure3()"
            >配置</el-button>
          </div>
          <div>
            <el-row v-if="!sixthConfigureFlag3" type="flex" justify="center">
              <h5>mPaaS 移动推送服务接入了OPPO推送渠道，可以在OPPO手机上建立系统级长连接，极大提高OPPO手机的消息送达率。</h5>
            </el-row>
            <el-row v-if="!sixthConfigureFlag3" type="flex" justify="center" style="margin:20px 0">
              <el-button size="small">接入文档</el-button>
            </el-row>
            <el-row v-if="sixthConfigureFlag3" type="flex" justify="center">
              <div>
                <template>
                  <el-form
                    ref="sixthConfig3"
                    :model="sixthConfig3"
                    label-width="200px"
                    label-position="right"
                    size="small"
                  >
                    <el-form-item required label="状态：" prop="status">
                      <el-switch v-model="sixthConfig3.status" />
                    </el-form-item>
                    <el-form-item required label="AppKey：" prop="AppKey">
                      <el-input v-model="sixthConfig3.AppKey" style="width:400px" />
                    </el-form-item>
                    <el-form-item required label="MasterSecret：" prop="MasterSecret">
                      <el-input v-model="sixthConfig3.MasterSecret" style="width:400px" />
                    </el-form-item>
                  </el-form>
                  <el-button
                    size="small"
                    type="primary"
                    style="margin-left:230px"
                    @click="handleSixthConfig3()"
                  >确 定</el-button>
                </template>
              </div>
            </el-row>
          </div>
        </el-card>
        <el-card style="margin-bottom:20px">
          <div slot="header">
            <span>VIVO推送渠道</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="sixthConfigure4()"
            >配置</el-button>
          </div>
          <div>
            <el-row v-if="!sixthConfigureFlag4" type="flex" justify="center">
              <h5>mPaaS 移动推送服务接入了VIVO推送渠道，可以在VIVO手机上建立系统级长连接，极大提高VIVO手机的消息送达率。</h5>
            </el-row>
            <el-row v-if="!sixthConfigureFlag4" type="flex" justify="center" style="margin:20px 0">
              <el-button size="small">接入文档</el-button>
            </el-row>
            <el-row v-if="sixthConfigureFlag4" type="flex" justify="center">
              <div>
                <template>
                  <el-form
                    ref="sixthConfig4"
                    :model="sixthConfig4"
                    label-width="200px"
                    label-position="right"
                    size="small"
                  >
                    <el-form-item required label="状态：" prop="status">
                      <el-switch v-model="sixthConfig4.status" />
                    </el-form-item>
                    <el-form-item required label="APP ID：" prop="APPID">
                      <el-input v-model="sixthConfig4.APPID" style="width:400px" />
                    </el-form-item>
                    <el-form-item required label="AppKey：" prop="AppKey">
                      <el-input v-model="sixthConfig4.AppKey" style="width:400px" />
                    </el-form-item>
                    <el-form-item required label="MasterSecret：" prop="MasterSecret">
                      <el-input v-model="sixthConfig4.MasterSecret" style="width:400px" />
                    </el-form-item>
                  </el-form>
                  <el-button
                    size="small"
                    type="primary"
                    style="margin-left:230px"
                    @click="handleSixthConfig4()"
                  >确 定</el-button>
                </template>
              </div>
            </el-row>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 新建推送消息弹窗 -->
    <el-dialog title="新建推送消息弹窗" :visible.sync="isAddNewPush" width="60%" top="50px">
      <template>
        <el-tabs v-model="newPushActive" @tab-click="newPushClick">
          <el-tab-pane label="极简推送" name="newPushFirst" />
          <el-tab-pane label="模板推送" name="newPushSecond" />
          <el-tab-pane label="批量推送" name="newPushThird" />
          <el-tab-pane label="群发推送" name="newPushFourth" />
        </el-tabs>
        <el-row>
          <el-col :span="14">
            <el-card shadow="hover">
              <el-collapse v-model="colName" accordion>
                <el-collapse-item name="col1">
                  <template slot="title">基础信息（必填）</template>
                  <div>
                    <template>
                      <el-form
                        ref="colModel"
                        :model="colModel"
                        label-width="120px"
                        label-position="left"
                        :rules="colValidate"
                      >
                        <el-form-item
                          label="目标ID类型:"
                          prop="targetType"
                        >
                          <el-select
                            v-model="colModel.targetType"
                            size="mini"
                            style="width:260px"
                            @change="tragetIDTypeChange()"
                          >
                            <el-option label="UserId" value="0" />
                            <el-option label="DeviceId" value="1" />
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          v-if="colModel.targetType=='1'||newPushActive=='newPushFourth'"
                          label="推送平台:"
                          prop="pushFramework"
                        >
                          <el-select
                            v-model="colModel.pushFramework"
                            size="mini"
                            style="width:260px"
                            @change="pushPlatformChange()"
                          >
                            <el-option label="小米" :value="2" />
                            <el-option label="华为" :value="1" />
                            <el-option label="IOS" :value="0" />
                          </el-select>
                        </el-form-item>
                        <!-- <el-form-item
                          v-if="newPushActive!='newPushThird'"
                          label="业务方消息ID:"
                          prop="bussMsgId"
                        >
                          <el-input v-model="colModel.bussMsgId" size="mini" style="width:260px">
                            <template v-if="newPushActive!='newPushFourth'" slot="prepend">console_</template>
                            <template
                              v-if="newPushActive=='newPushFourth'"
                              slot="prepend"
                            >broadcast_</template>
                          </el-input>
                        </el-form-item> -->
                        <el-form-item
                          v-if="newPushActive=='newPushFirst'||newPushActive=='newPushSecond'"
                          label="目标ID:"
                          prop="targetId"
                        >
                          <el-input v-model="colModel.targetId" size="mini" style="width:260px" />
                        </el-form-item>
                        <el-form-item
                          v-if="newPushActive!='newPushFirst'"
                          label="推送模板:"
                          prop="template"
                        >
                          <el-select
                            v-model="colModel.template"
                            size="mini"
                            style="width:260px"
                            @change="mubanChange()"
                          >
                            <el-option
                              v-for="(item,index) in pushMubanOptions"
                              :key="index"
                              :value="item.id"
                              :label="item.templateName"
                            />
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          v-if="newPushActive=='newPushThird'"
                          label="机型:"
                          prop="deviceType"
                        >
                          <el-select
                            v-model="colModel.deviceType"
                            size="mini"
                            style="width:260px"
                          >
                            <el-option label="小米" value="xiaomi" />
                            <el-option label="华为" value="huawei" />
                            <el-option label="苹果" value="ios" />
                          </el-select>
                        </el-form-item>
                        <el-form-item
                          v-if="newPushActive=='newPushThird'"
                          label="选择推送人群:"
                          prop="userGroup"
                        >
                          <template>
                            <el-radio-group
                              v-model="colModel.userGroup"
                              style="width:280px"
                              @change="pushManChange()"
                            >
                              <el-radio label="uploadUser">手动上传人群</el-radio>
                              <el-radio :disabled="pushManFlag" label="tagUser">移动分析人群</el-radio>
                            </el-radio-group>
                          </template>
                        </el-form-item>
                        <el-form-item
                          v-if="colModel.userGroup=='uploadUser'&&newPushActive=='newPushThird'"
                        >
                          <template>
                            <el-upload
                              ref="uploadFile"
                              class="upload-demo"
                              action="/pmobile/mobilepush/mobilePushMsg/add"
                              :data="uploadForm"
                              :headers="headersToken"
                              :file-list="uploadList"
                              :auto-upload="false"
                              :on-change="handleUploadChange"
                              :on-remove="handleUploadRemove"
                              :on-success="uploadSuccessCallback"
                              :on-error="uploadErrorCallback"
                            >
                              <el-button size="small" class="el-icon-upload2">点击上传</el-button>
                            </el-upload>
                          </template>
                          <el-alert
                            style="margin-top:10px"
                            title="上传 UTF-8 编码类型的文件，文件格式：推送目标 ID, 业务方消息 ID仅限上传txt文件。上传完成后，可点击文件图标进行预览。"
                            type="warning"
                          />
                        </el-form-item>
                        <el-form-item
                          v-if="colModel.userGroup=='tagUser'&&newPushActive=='newPushThird'"
                          prop="templateId"
                        >
                          <template>
                            <el-select
                              v-model="colModel.templateId"
                              size="mini"
                              style="width:260px"
                            >
                              <el-option
                                v-for="(item,index) in pushMan2Options"
                                :key="index"
                                :value="item.id"
                                :label="item.groupName"
                              />
                            </el-select>
                          </template>
                        </el-form-item>
                        <el-tooltip
                          v-if="colModel.pushFramework!='IOS'"
                          class="item"
                          effect="dark"
                          content="已接入的厂商通道消息走对应的厂商通道服务，未接入的厂商通道消息走MPS自建通道"
                          placement="top"
                        >
                          <el-form-item label="安卓消息通道:" prop="notifyType">
                            <template>
                              <el-radio-group v-model="colModel.notifyType" style="width:280px">
                                <el-radio :disabled="AndPathFlag" label="defaul">默认通道</el-radio>
                                <el-radio label="mps">MPS自建通道</el-radio>
                              </el-radio-group>
                            </template>
                          </el-form-item>
                        </el-tooltip>
                        <el-form-item label="展示类型:" prop="viewType">
                          <template>
                            <el-radio-group
                              v-model="colModel.viewType"
                              :disabled="newPushActive!='newPushFirst'"
                              style="width:280px"
                              @change="showTypeChange()"
                            >
                              <el-radio label="notiMsg">展示消息(通知栏消息)</el-radio>
                              <el-radio label="sileMsg">静默消息</el-radio>
                            </el-radio-group>
                          </template>
                        </el-form-item>
                        <el-form-item
                          v-if="colModel.pushFramework!='IOS'"
                          label="点击后操作:"
                          prop="action"
                        >
                          <template>
                            <el-radio-group
                              v-model="colModel.action"
                              :disabled="newPushActive!='newPushFirst'"
                              style="width:280px"
                            >
                              <el-radio label="activity">打开Intent Activity</el-radio>
                              <el-radio label="webUrl">打开Web URL</el-radio>
                            </el-radio-group>
                          </template>
                        </el-form-item>
                        <el-form-item
                          v-if="newPushActive=='newPushFirst'"
                          label="推送标题:"
                          prop="title"
                        >
                          <el-input v-model="colModel.title" size="mini" style="width:260px" />
                        </el-form-item>
                        <el-form-item
                          v-if="newPushActive=='newPushFirst'"
                          label="推送文本:"
                          prop="content"
                        >
                          <el-input
                            v-model="colModel.content"
                            type="textarea"
                            :rows="2"
                            style="width:260px"
                          />
                        </el-form-item>
                      </el-form>
                    </template>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="col2">
                  <template slot="title">高级信息（选填）</template>
                  <div style="margin-top:12px">
                    <template>
                      <el-form
                        ref="seniorModel"
                        :model="seniorModel"
                        label-width="120px"
                        label-position="left"
                      >
                        <el-form-item
                          v-if="newPushActive=='newPushFirst'"
                          label="跳转地址:"
                          prop="jumpUrl"
                        >
                          <el-input v-model="seniorModel.jumpUrl" size="mini" style="width:260px" />
                        </el-form-item>
                        <el-form-item label="消息有效期:" prop="expDate">
                          <el-input-number v-model="seniorModel.expDate" :min="0" :max="259200" size="mini" />( s )
                        </el-form-item>
                        <el-alert
                          style="margin-bottom:20px"
                          title="消息有效期不得超过 72 小时。"
                          type="warning"
                        />
                        <el-form-item
                          v-if="newPushActive=='newPushFourth'"
                          label="推送登录状态:"
                          prop="loginStatus"
                        >
                          <template>
                            <el-radio-group
                              v-model="seniorModel.loginStatus"
                              @change="pushTypeChange()"
                            >
                              <el-radio label="login">登录用户</el-radio>
                              <el-radio label="loginout">登录用户+登出用户</el-radio>
                            </el-radio-group>
                          </template>
                        </el-form-item>
                        <el-form-item
                          v-if="newPushActive=='newPushFourth'&&seniorModel.loginStatus=='loginout'"
                          label="退出登录时长:"
                          prop="logoutTime"
                        >
                          <el-select
                            v-model="seniorModel.logoutTime"
                            size="mini"
                            style="width:260px"
                          >
                            <el-option label="7天" value="7d" />
                            <el-option label="15天" value="15d" />
                            <el-option label="60天" value="60d" />
                            <el-option label="永久" value="-1" />
                          </el-select>
                        </el-form-item>
                        <el-form-item label="扩展参数:" prop="extStatus">
                          <el-switch v-model="seniorModel.extStatus" />
                        </el-form-item>
                        <el-alert title="自定义扩展参数最多不能超过 5 个。" type="warning" />
                      </el-form>
                      <div v-if="seniorModel.extStatus==true" class="tableStyle">
                        <el-table
                          :data="extParam"
                          border
                          :cell-style="cellstyle"
                          :header-cell-style="rowClass"
                        >
                          <el-table-column prop="key" label="key" width="160">
                            <template slot-scope="scope">
                              <el-input v-model="scope.row.key" size="mini" />
                            </template>
                          </el-table-column>
                          <el-table-column prop="value" label="value" width="160">
                            <template slot-scope="scope">
                              <el-input v-model="scope.row.value" size="mini" />
                            </template>
                          </el-table-column>
                          <el-table-column label="操作">
                            <template slot-scope="scope">
                              <a @click="deleteExpand(scope.row)">删除</a>
                            </template>
                          </el-table-column>
                        </el-table>
                        <el-button
                          size="mini"
                          style="width:300px;margin:10px 0px 10px 100px"
                          plain
                          type="primary"
                          icon="el-icon-plus"
                          @click="addExpand()"
                        >增加参数</el-button>
                      </div>
                    </template>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-col>
          <el-col :span="10">
            <el-card shadow="hover">
              <el-tabs v-model="muban" @tab-click="mubanClick">
                <el-tab-pane label="通知" name="muban1">
                  <div
                    style="padding:30px;margin:10px 0px 10px 0px;width:85%;background-color:#cbdaf1"
                  >
                    <div
                      style="height:400px;border:3px solid #000000;border-radius:16px;background-color:#A0A0A0"
                    >
                      <div style="margin:30px 0px 30px 20px">
                        <i
                          class="el-icon-message"
                          style="margin:10px 10px 0px 0px;float:left;font-size:22px;font-weight:700;color:green"
                        />
                        <div style="float:left;height:50px;width:70px;">
                          <span
                            style="font-size:12px;display:inline-block;width:70px;margin-bottom:10px"
                          >{{ showMessagetitle }}</span>
                          <span style="font-size:12px">{{ showMessagetext }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="苹果消息体" name="muban2">
                  <div
                    style="padding:30px;margin:10px 0px 10px 0px;width:85%;background-color:#cbeef1"
                  >
                    <div style="padding:30px 20px 30px 20px;background-color:#f7f7f7">
                      <pre
                        style="white-space:pre-wrap;line-height:22px;font-family:Microsoft YaHei;"
                      >{{ IOSMessage }}</pre>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="安卓消息体" name="muban3">
                  <div
                    style="padding:30px;margin:10px 0px 10px 0px;width:85%;background-color:#cef1cb"
                  >
                    <div style="padding:30px 20px 30px 20px;background-color:#f7f7f7">
                      <pre
                        style="white-space:pre-wrap;line-height:22px;font-family:Microsoft YaHei;"
                      >{{ androidMessage }}</pre>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isAddNewPush = false">取 消</el-button>
        <el-button size="small" type="primary" @click="addNewPushSubmit()">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 创建消息模板弹窗 -->
    <el-dialog :title="thirdDialog" :visible.sync="isAddMuban" width="50%">
      <el-alert
        v-if="thirdDialog=='创建模板'"
        style="margin-bottom:20px"
        title="模板由模板主体、模板属性、占位符组成。使用占位符可以让消息具备个性化能力。您可以在模板标题、模板正文、跳转地址中以 #占位符名称# 的写法来标识模板中的动态化部分。"
        type="info"
        show-icon
      />
      <el-form
        ref="thirdFrom"
        :model="thirdFrom"
        label-width="110px"
        label-position="left"
        :rules="thirdFromRules"
      >
        <el-form-item label="模板名称:" prop="templateName">
          <el-input
            v-model="thirdFrom.templateName"
            :disabled="thirdDialog=='查看模板'"
            maxlength="200"
            size="mini"
            placeholder="模板名称，请不要填写特殊字符，且不要超过200个字符"
            style="width:500px"
          />
        </el-form-item>
        <el-form-item label="模板描述:" prop="templateDesc">
          <el-input
            v-model="thirdFrom.templateDesc"
            :disabled="thirdDialog=='查看模板'"
            maxlength="200"
            size="mini"
            placeholder="模板描述，请不要填写特殊字符，且不要超过200个字符"
            style="width:500px"
          />
        </el-form-item>
        <el-form-item label="模板标题:" prop="title">
          <el-input
            v-model="thirdFrom.title"
            :disabled="thirdDialog=='查看模板'"
            maxlength="200"
            size="mini"
            placeholder="模板标题，请不要填写特殊字符，且不要超过200个字符"
            style="width:500px"
          />
        </el-form-item>
        <el-form-item label="模板正文:" prop="content">
          <el-input
            v-model="thirdFrom.content"
            :disabled="thirdDialog=='查看模板'"
            maxlength="200"
            type="textarea"
            :autosize="{ minRows: 3 }"
            size="mini"
            placeholder="模板中文，请不要填写特殊字符，占位符不要使用特殊符号，示例：恭喜#name#中了#money#元"
            style="width:500px"
          />
        </el-form-item>
        <el-form-item label="点击后操作:" prop="action">
          <template>
            <el-radio-group v-model="thirdFrom.action" :disabled="thirdDialog=='查看模板'" size="mini">
              <el-radio :label="0">打开Intent Activity</el-radio>
              <el-radio :label="1">打卡Web URL</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="跳转地址:" prop="jumpUrl">
          <el-input
            v-model="thirdFrom.jumpUrl"
            :disabled="thirdDialog=='查看模板'"
            maxlength="200"
            size="mini"
            placeholder="模板中文，请不要填写特殊字符，且不要超过200个字符"
            style="width:500px"
          />
        </el-form-item>
        <el-form-item label="展示类型:" prop="viewType">
          <template>
            <el-radio-group
              v-model="thirdFrom.viewType"
              :disabled="thirdDialog=='查看模板'"
              size="mini"
            >
              <el-radio :label="0">展示消息（通知栏消息）</el-radio>
              <el-radio :label="1">静默消息</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="thirdDialog=='创建模板'" size="small" @click="isAddMuban = false">返 回</el-button>
        <el-button
          v-if="thirdDialog=='查看模板'"
          size="small"
          type="primary"
          @click="isAddMuban = false"
        >确 定</el-button>
        <el-button
          v-if="thirdDialog=='创建模板'"
          size="small"
          type="primary"
          @click="clickAddmuban()"
        >创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addNewsPush,
  searchMubanAll,
  searchGroupMuban,
  newsListSearch,
  mubanPageSearch,
  addMuban,
  deleteMuban,
  pushConfig,
  keyConfig,
  channelConfig,
  allConfig,
  // searchFile,
  numEchart,
  scaleEchart,
  fileDownload
} from '@/api/newsPush'
import { getToken } from '@/utils/util'
var echarts = require('echarts')
export default {
  name: 'NewsPush',
  filters: {},
  data() {
    return {
      headersToken: {},
      isAddNewPush: false,
      isAddMuban: false,
      thirdDialog: '',
      activeName: 'first',
      colName: 'col1',
      searchRadio1: '按数量查询',
      searchRadio2: '小时',
      newPushActive: 'newPushFirst',
      muban: 'muban1',
      IOSUploadFlag: false,
      AndPathFlag: false, // 安卓消息通道选项禁用
      pushManFlag: false, // 推送人群选项禁用
      fourthConfigureFlag1: false,
      fifthConfigureFlag1: false,
      fifthConfigureFlag2: false,
      sixthConfigureFlag1: false,
      sixthConfigureFlag2: false,
      sixthConfigureFlag3: false,
      sixthConfigureFlag4: false,
      secondData: [],
      thirddata: [],
      changeFile: false,
      fourthConfig: {
        type: 'push',
        configItem: 'push-fcm',
        status: false,
        FCMKey: ''
      },
      fourthConfigRules: {
        FCMKey: [
          {
            required: true,
            message: '服务器密钥不可为空！',
            trigger: 'blur'
          }
        ]
      },
      fifthConfig: {
        type: 'secret',
        item: 'secret-api',
        status: false,
        APIENCType: '',
        MDKey: '',
        RSAKey: ''
      },
      fifthConfig2: {
        type: 'secret',
        configItem: 'secret-callback',
        status: false,
        callURL: '',
        callbackENCType: '',
        RSAPubKey: ''
      },
      sixthConfig1: {
        type: 'channel',
        configItem: 'channel-xiaomi',
        status: false,
        baoming: '',
        password: ''
      },
      sixthConfig2: {
        type: 'channel',
        configItem: 'channel-huawei',
        status: false,
        baoming: '',
        huaweiID: '',
        huaweiKey: ''
      },
      sixthConfig3: {
        type: 'channel',
        configItem: 'channel-oppo',
        status: false,
        AppKey: '',
        MasterSecret: ''
      },
      sixthConfig4: {
        type: 'channel',
        configItem: 'channel-vivo',
        status: false,
        APPID: '',
        AppKey: '',
        MasterSecret: ''
      },
      uploadData: {},
      uploadForm: {},
      IOSFrom: {
        IOSFile: '',
        type: 'push',
        configItem: 'push-ios',
        certPwd: '',
        certEnv: '',
        BundleId: '',
        host: '103.160.55.78',
        port: '443'
      },
      IOSFileList: [],
      fileID: '',
      IOSFromRules: {
        certPwd: [
          {
            required: true,
            message: '证书密码不可为空！',
            trigger: 'blur'
          }
        ],
        certEnv: [
          {
            required: true,
            message: '证书环境不可为空！',
            trigger: 'change'
          }
        ],
        BundleId: [
          {
            required: true,
            message: 'BundleId不可为空！',
            trigger: 'blur'
          }
        ]
      },
      secondSearch: {
        platform: '',
        edition: '',
        pushChannel: '',
        pushType: '',
        time: ''
      },
      thirdFrom: {
        templateName: '',
        templateDesc: '',
        title: '',
        content: '',
        action: '',
        jumpUrl: '',
        viewType: ''
      },
      thirdFromRules: {
        templateName: [
          {
            required: true,
            message: '模板名称不可为空！',
            trigger: 'blur'
          }
        ],
        templateDesc: [
          {
            required: true,
            message: '模板描述不可为空！',
            trigger: 'blur'
          }
        ],
        title: [
          {
            required: true,
            message: '模板标题不可为空！',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '模板正文不可为空！',
            trigger: 'blur'
          }
        ],
        action: [
          {
            required: true,
            message: '点击后操作不可为空！',
            trigger: 'change'
          }
        ],
        jumpUrl: [
          {
            required: true,
            message: '跳转地址不可为空！',
            trigger: 'blur'
          }
        ],
        viewType: [
          {
            required: true,
            message: '展示类型不可为空！',
            trigger: 'change'
          }
        ]
      },
      colModel: {
        targetType: '0',
        pushFramework: 'Android',
        bussMsgId: '',
        targetId: '',
        notifyType: '',
        viewType: 'notiMsg',
        action: 'webUrl',
        title: '',
        content: '',
        userGroup: '',
        template: '',
        deviceType: ''
      },
      uploadList: [],
      pushMubanOptions: [],
      pushMan2Options: [],
      platformOptions: [
        {
          value: '123',
          label: '123'
        },
        {
          value: '456',
          label: '456'
        }
      ],
      editionOptions: [
        {
          value: '123',
          label: '123'
        },
        {
          value: '456',
          label: '456'
        }
      ],
      pushChannelOptions: [
        {
          value: '123',
          label: '123'
        },
        {
          value: '456',
          label: '456'
        }
      ],
      pushTypeOptions: [
        {
          value: '123',
          label: '123'
        },
        {
          value: '456',
          label: '456'
        }
      ],
      seniorModel: {
        expDate: '',
        extStatus: false
      },
      colValidate: {
        targetType: [
          {
            required: true,
            message: '目标ID不可为空！',
            trigger: 'change'
          }
        ],
        deviceType: [
          {
            required: true,
            message: '机型不可为空！',
            trigger: 'change'
          }
        ],
        pushFramework: [
          {
            required: true,
            message: '推送平台不可为空！',
            trigger: 'change'
          }
        ],
        bussMsgId: [
          {
            required: true,
            message: '业务方消息ID不可为空！',
            trigger: 'blur'
          }
        ],
        targetId: [
          {
            required: true,
            message: '目标ID不可为空！',
            trigger: 'blur'
          }
        ],
        template: [
          {
            required: true,
            message: '推送模板不可为空！',
            trigger: 'change'
          }
        ],
        userGroup: [
          {
            required: true,
            message: '推送人群不可为空！',
            trigger: 'change'
          }
        ],
        notifyType: [
          {
            required: true,
            message: '安卓消息通道不可为空！',
            trigger: 'change'
          }
        ],
        viewType: [
          {
            required: true,
            message: '展示类型不可为空！',
            trigger: 'change'
          }
        ],
        action: [
          {
            required: true,
            message: '点击后操作不可为空！',
            trigger: 'change'
          }
        ],
        title: [
          {
            required: true,
            message: '推送标题不可为空！',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '推送文本不可为空！',
            trigger: 'blur'
          }
        ]
      },
      pageInfo: {
        total: 0,
        page: 1,
        limit: 10,
        targetId: '',
        bussMsgId: ''
      },
      thirdpageInfo: {
        total: 0,
        page: 1,
        limit: 10
      },
      data: [],
      extParam: []
    }
  },
  computed: {
    showMessagetitle() {
      if (
        this.colModel.template !== undefined &&
        this.colModel.template !== ''
      ) {
        let res = ''
        this.pushMubanOptions.forEach((v) => {
          if (v.id === this.colModel.template) {
            res = v.title
          }
        })
        return res
      } else {
        if (this.colModel.title === '' || this.colModel.title === undefined) {
          return '消息标题'
        } else {
          return this.colModel.title
        }
      }
      // eslint-disable-next-line no-unreachable
      return '消息标题'
    },
    showMessagetext() {
      if (
        this.colModel.template !== undefined &&
        this.colModel.template !== ''
      ) {
        let res = ''
        this.pushMubanOptions.forEach((v) => {
          if (v.id === this.colModel.template) {
            res = v.content
          }
        })
        return res
      } else {
        if (
          this.colModel.content === '' ||
          this.colModel.content === undefined
        ) {
          return '消息文本'
        } else {
          return this.colModel.content
        }
      }
      // eslint-disable-next-line no-unreachable
      return '消息文本'
    },
    IOSMessage() {
      const res = {
        aps: {},
        t: '-',
        uri: ''
      }
      if (this.colModel.viewType === 'notiMsg') {
        this.$set(res.aps, 'sound', 'default')
      }
      if (this.colModel.viewType === 'sileMsg') {
        this.$set(res, 'content', 'undefined')
        this.$set(res.aps, 'content-available', '1')
      }
      if (this.colModel.title !== '' && this.colModel.title !== undefined) {
        if (this.colModel.viewType === 'notiMsg') {
          if (res.aps.alert === undefined) {
            this.$set(res.aps, 'alert', {})
          }
          this.$set(res.aps.alert, 'title', this.colModel.title)
        }
      }
      if (this.colModel.content !== '' && this.colModel.content !== undefined) {
        if (this.colModel.viewType === 'notiMsg') {
          if (res.aps.alert === undefined) {
            this.$set(res.aps, 'alert', {})
          }
          this.$set(res.aps.alert, 'body', this.colModel.content)
        }
        if (this.colModel.viewType === 'sileMsg') {
          this.$set(res, 'content', this.colModel.content)
        }
      }
      if (
        this.seniorModel.jumpUrl !== '' &&
        this.seniorModel.jumpUrl !== undefined
      ) {
        res.uri = this.seniorModel.jumpUrl
      }
      if (this.extParam.length !== 0) {
        this.$set(res, 'params', {})
        this.extParam.forEach((v) => {
          if (v.key !== '') {
            res.params[v.key] = v.value
          }
        })
      }
      if (
        this.colModel.template !== undefined &&
        this.colModel.template !== ''
      ) {
        if (res.aps.alert === undefined) {
          this.$set(res.aps, 'alert', {})
        }
        this.pushMubanOptions.forEach((v) => {
          if (v.id === this.colModel.template) {
            res.uri = v.jumpUrl
            this.$set(res.aps.alert, 'title', v.title)
            this.$set(res.aps.alert, 'content', v.content)
          }
        })
      }
      return res
    },
    androidMessage() {
      const res = {
        k: '-',
        bData: {
          action: '0',
          silent: false
        }
      }
      if (
        this.colModel.template !== undefined &&
        this.colModel.template !== ''
      ) {
        this.pushMubanOptions.forEach((v) => {
          if (v.id === this.colModel.template) {
            this.$set(res.bData, 'title', v.title)
            this.$set(res.bData, 'content', v.content)
            this.$set(res.bData, 'url', v.jumpUrl)
          }
        })
      }
      if (this.colModel.viewType === 'notiMsg') {
        res.bData.silent = false
      }
      if (this.colModel.viewType === 'sileMsg') {
        res.bData.silent = true
      }
      if (this.colModel.action === 'activity') {
        res.bData.action = '1'
      }
      if (this.colModel.action === 'webUrl') {
        res.bData.action = '0'
      }
      if (this.colModel.title !== '' && this.colModel.title !== undefined) {
        this.$set(res.bData, 'title', this.colModel.title)
      }
      if (this.colModel.content !== '' && this.colModel.content !== undefined) {
        this.$set(res.bData, 'content', this.colModel.content)
      }
      if (
        this.seniorModel.jumpUrl !== '' &&
        this.seniorModel.jumpUrl !== undefined
      ) {
        this.$set(res.bData, 'url', this.seniorModel.jumpUrl)
      }
      if (this.extParam.length !== 0) {
        this.$set(res, 'params', {})
        this.extParam.forEach((v) => {
          if (v.key !== '') {
            res.params[v.key] = v.value
          }
        })
      }
      return res
    }
  },
  created() {
    this.handleSearch()

    const token1 = getToken()
    this.headersToken = {
      Authorization: 'Bearer ' + token1,
      appid: '1552274783265'
    }
  },
  mounted() {},
  methods: {
    // 切换标题栏
    handleTabClick(tab, event) {
      if (tab.name === 'first') {
        this.handleSearch()
      }
      if (tab.name === 'second') {
        this.createEchart('Num')
      }
      if (tab.name === 'third') {
        this.thirdSearch()
      }
      if (tab.name === 'fourth') {
        this.fourthConfigureFlag1 = false
        this.fourthSearch()
      }
      if (tab.name === 'fifth') {
        this.fifthConfigureFlag1 = false
        this.fifthConfigureFlag2 = false
      }
      if (tab.name === 'sixth') {
        this.sixthConfigureFlag1 = false
        this.sixthConfigureFlag2 = false
        this.sixthConfigureFlag3 = false
        this.sixthConfigureFlag4 = false
      }
    },
    // 查询表格1
    handleSearch(val) {
      if (val) {
        this.pageInfo.page = val
      }
      const params = {
        size: this.pageInfo.limit,
        current: this.pageInfo.page,
        targetId: this.pageInfo.targetId
        // bussMsgId: this.pageInfo.bussMsgId
      }
      newsListSearch(params)
        .then((res) => {
          console.log(res, '++++++pageList++++++++++++')
          this.data = res.data.records
          this.pageInfo.total = parseInt(res.data.total)
        })
        .finally(() => {})
    },
    // 查询表格2
    secondHandleSearch() {},
    // 查询表格3
    thirdSearch() {
      const params = {
        size: this.thirdpageInfo.limit,
        current: this.thirdpageInfo.page
      }
      mubanPageSearch(params)
        .then((res) => {
          this.thirddata = res.data.records
          this.thirdpageInfo.total = parseInt(res.data.total)
        })
        .finally(() => {})
    },
    // 第三表格查看
    thirdTable(val) {
      this.thirdDialog = '查看模板'
      this.isAddMuban = true
      this.thirdFrom = JSON.parse(JSON.stringify(val))
    },
    // 第三表格删除
    thirdDelete(val) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: val.id
          }
          deleteMuban(params)
            .then((res) => {
              if (res.data) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
            .finally(() => {
              this.thirdSearch()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // 第三创建模板提交
    clickAddmuban() {
      this.$refs['thirdFrom'].validate((valid) => {
        if (valid) {
          const params = JSON.parse(JSON.stringify(this.thirdFrom))
          addMuban(params)
            .then((res) => {
              if (res.data) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                })
              }
            })
            .finally(() => {
              this.isAddMuban = false
              this.thirdSearch()
            })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 第三打开创建模板天窗
    thirdAdd() {
      this.thirdDialog = '创建模板'
      this.isAddMuban = true
      this.$nextTick(() => {
        this.$refs['thirdFrom'].resetFields()
        this.thirdFrom = {
          templateName: '',
          templateDesc: '',
          title: '',
          content: '',
          action: '',
          jumpUrl: '',
          viewType: ''
        }
      })
    },
    // 第四配置 查寻
    fourthSearch() {
      // 只做IOS的查询
      this.$refs.IOSFromUpload.clearFiles()
      const params = {
        type: 'push',
        configItem: 'push-ios'
      }
      pushConfig(params)
        .then((res) => {
          console.log(res, '查询接口数据')
          this.IOSFrom = Object.assign(this.IOSFrom, res.data[0])
          this.fileID = res.data[0].id
          var info = { name: '' }
          info.name = res.data[0].fileName
          // this.IOSFileList.push(info)

          // console.log('ddddddddd>' + JSON.stringify(this.IOSFileList))
          // this.IOSFileList[0].name = res.data[0].fileName
          // const pp = {
          //   // id: res.data.id,
          //   name: res.data.fileName
          //   // url: res.data.resUrl
          // }
          this.IOSFileList = []
          this.IOSFileList.push(info)
          // if (this.IOSFileList.length === 0) {
          //   this.IOSFileList.push(info)
          // }
        })
        .finally(() => {
          // if (this.IOSFrom.IOSFile === '') {
          //   return
          // } else {
          //   const iosparams = {
          //     id: this.IOSFrom.IOSFile
          //   }
          //   searchFile(iosparams).then(res => {
          //     console.log(res, '查询结果数据')
          //     const pp = {
          //       id: res.data.id,
          //       name: res.data.resName,
          //       url: res.data.resUrl
          //     }
          //     if (this.IOSFileList.length === 0) {
          //       this.IOSFileList.push(pp)
          //     }
          //   }).finally(() => {})
          // }
        })
    },
    // 第四配置1 查询
    fourthConfigure1() {
      this.fourthConfigureFlag1 = this.fourthConfigureFlag1 === false
      if (this.fourthConfigureFlag1 === false) {
        return
      }
      // 这里做FCM查询
      const params = {
        type: 'push',
        configItem: 'push-fcm'
      }

      pushConfig(params)
        .then((res) => {
          res.data[0].status = res.data[0].status === 'true'
          this.fourthConfig = Object.assign(this.fourthConfig, res.data[0])
        })
        .finally(() => {})
    },
    // 第四提交配置1
    handleFourthConfig() {
      this.$refs['fourthConfig'].validate((valid) => {
        if (valid) {
          const params = this.fourthConfig
          allConfig(params)
            .then((res) => {
              if (res.data) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                })
              }
            })
            .finally(() => {
              this.fourthConfigure1()
            })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 第四 IOS环境切换
    IOSChange() {
      if (this.IOSFrom.IOSEnvir === '1') {
        this.IOSFrom.host = 'api.push.apple.com'
      }
      if (this.IOSFrom.IOSEnvir === '2') {
        this.IOSFrom.host = 'api.development.push.apple.com'
      }
    },
    // 文件转base64格式
    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        let fileResult = ''
        reader.readAsDataURL(file)
        reader.onload = function() {
          const data = reader.result.split(',')
          fileResult = data[1]
        }
        reader.onerror = function(err) {
          reject(err)
        }
        reader.onloadend = function() {
          resolve(fileResult)
        }
      })
    },
    // 第四IOS上传证书
    handleIOS() {
      this.$refs['IOSFrom'].validate((valid) => {
        if (valid) {
          console.log(this.IOSFrom)
          if (this.IOSFileList.length === 0) {
            this.$message.error('必须上传IOS证书文件！')
            return
          }
          // const fileUrl = ''
          if (this.changeFile === true) {
            this.getBase64(this.IOSFileList[0].raw).then((res) => {
              this.uploadData.certificate = res
              this.uploadData.fileName = this.IOSFileList[0].name
              this.uploadData.certPwd = this.IOSFrom.certPwd
              this.uploadData.certEnv = this.IOSFrom.certEnv
              this.uploadData.BundleId = this.IOSFrom.BundleId
              this.uploadData.host = this.IOSFrom.host
              this.uploadData.port = this.IOSFrom.port
              this.uploadData.type = 'push'
              this.uploadData.configItem = 'push-ios'
              if (this.fileID === '') {
                this.uploadData.id = ''
              } else {
                this.uploadData.id = this.fileID
              }
              this.$refs.IOSFromUpload.submit()
              // 首先处理IOS文件的上传问题
            }).catch(res => {
              console.log(res)
            })
          } else {
            this.uploadData.fileName = this.IOSFileList[0].name
            this.uploadData.certPwd = this.IOSFrom.certPwd
            this.uploadData.certEnv = this.IOSFrom.certEnv
            this.uploadData.BundleId = this.IOSFrom.BundleId
            this.uploadData.type = 'push'
            this.uploadData.configItem = 'push-ios'
            this.uploadData.id = this.fileID
            const params = this.uploadData
            allConfig(params).then(res => {
              if (res.data) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                })
              }
            }).finally(() => {
              this.fourthSearch()
            })
          }
          // 其他属性的处理  成功后的回调函数中
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 下载IOS证书
    downIOSFile() {
      if (this.fileID) {
        this.$confirm('确定要下载IOS证书文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // const link = document.createElement('a')
            // const url = '/pmobile/diffpackage/mpaas/sys/download?id=' + this.IOSFileList[0].id
            // link.href = url
            // document.body.appendChild(link)
            // link.click()
            // document.body.removeChild(link)
            const params = {
              id: this.fileID
            }
            fileDownload(params).then((res) => {
              this.downloadFile(this.IOSFileList[0].name, res)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else {
        this.$message({
          type: 'error',
          message: '离线文件不支持下载！'
        })
      }
    },
    // 2进制文件流下载转文件
    downloadFile(fileName, content) {
      const link = document.createElement('a') // 创建a标签
      link.style.display = 'none'
      link.setAttribute('download', fileName) // 必须指明下载文件类型，否则会乱码
      const objectUrl = URL.createObjectURL(content)
      link.href = objectUrl
      link.click()
      URL.revokeObjectURL(objectUrl)
    },
    // 第五 1 API配置 查询
    fifthConfigure1() {
      this.fifthConfigureFlag1 = this.fifthConfigureFlag1 === false
      if (this.fifthConfigureFlag1 === false) {
        return
      }
      // 这里做API接口配置查询
      const params = {
        type: 'secret',
        item: 'secret-api'
      }

      keyConfig(params)
        .then((res) => {
          res.data[0].status = res.data[0].status === 'true'
          this.fifthConfig = Object.assign(this.fifthConfig, res.data[0])
        })
        .finally(() => {})
    },
    // 第五 2 回调接口配置 查询
    fifthConfigure2() {
      this.fifthConfigureFlag2 = this.fifthConfigureFlag2 === false
      if (this.fifthConfigureFlag2 === false) {
        return
      }
      // 这里做回调接口配置查询
      const params = {
        type: 'secret',
        item: 'secret-callback'
      }

      keyConfig(params)
        .then((res) => {
          res.data[0].status = res.data[0].status === 'true'
          this.fifthConfig2 = Object.assign(this.fifthConfig2, res.data[0])
        })
        .finally(() => {})
    },
    // 第五配置1 提交
    handlefifthConfig() {
      this.$refs['fifthConfig'].validate((valid) => {
        if (valid) {
          const params = this.fifthConfig
          allConfig(params)
            .then((res) => {
              if (res.data) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                })
              }
            })
            .finally(() => {
              this.fifthConfigure1()
            })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 第五配置2 提交
    handlefifthConfig2() {
      this.$refs['fifthConfig2'].validate((valid) => {
        if (valid) {
          const params = this.fifthConfig2
          allConfig(params)
            .then((res) => {
              if (res.data) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                })
              }
            })
            .finally(() => {
              this.fifthConfigure2()
            })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 第六 1 配置 查询
    sixthConfigure1() {
      this.sixthConfigureFlag1 = this.sixthConfigureFlag1 === false
      if (this.sixthConfigureFlag1 === false) {
        return
      }
      const params = {
        type: 'channel',
        configItem: 'channel-xiaomi'
      }

      channelConfig(params)
        .then((res) => {
          res.data[0].status = res.data[0].status === 'true'
          this.sixthConfig1 = Object.assign(this.sixthConfig1, res.data[0])
        })
        .finally(() => {})
    },
    // 第六配置1 提交
    handleSixthConfig1() {
      this.$refs['sixthConfig1'].validate((valid) => {
        if (valid) {
          const params = this.sixthConfig1
          allConfig(params)
            .then((res) => {
              if (res.data) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                })
              }
            })
            .finally(() => {
              this.sixthConfigure1()
            })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 第六 2 配置 查询
    sixthConfigure2() {
      this.sixthConfigureFlag2 = this.sixthConfigureFlag2 === false
      if (this.sixthConfigureFlag2 === false) {
        return
      }
      const params = {
        type: 'channel',
        configItem: 'channel-huawei'
      }

      channelConfig(params)
        .then((res) => {
          res.data[0].status = res.data[0].status === 'true'
          this.sixthConfig2 = Object.assign(this.sixthConfig2, res.data[0])
        })
        .finally(() => {})
    },
    // 第六配置2 提交
    handleSixthConfig2() {
      this.$refs['sixthConfig2'].validate((valid) => {
        if (valid) {
          const params = this.sixthConfig2
          allConfig(params)
            .then((res) => {
              if (res.data) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                })
              }
            })
            .finally(() => {
              this.sixthConfigure2()
            })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 第六 3 配置 查询
    sixthConfigure3() {
      this.sixthConfigureFlag3 = this.sixthConfigureFlag3 === false
      if (this.sixthConfigureFlag3 === false) {
        return
      }
      const params = {
        type: 'channel',
        configItem: 'channel-oppo'
      }

      channelConfig(params)
        .then((res) => {
          res.data[0].status = res.data[0].status === 'true'
          this.sixthConfig3 = Object.assign(this.sixthConfig3, res.data[0])
        })
        .finally(() => {})
    },
    // 第六配置3 提交
    handleSixthConfig3() {
      this.$refs['sixthConfig3'].validate((valid) => {
        if (valid) {
          const params = this.sixthConfig3
          allConfig(params)
            .then((res) => {
              if (res.data) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                })
              }
            })
            .finally(() => {
              this.sixthConfigure3()
            })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 第六 4 配置 查询
    sixthConfigure4() {
      this.sixthConfigureFlag4 = this.sixthConfigureFlag4 === false
      if (this.sixthConfigureFlag4 === false) {
        return
      }
      const params = {
        type: 'channel',
        configItem: 'channel-vivo'
      }

      channelConfig(params)
        .then((res) => {
          res.data[0].status = res.data[0].status === 'true'
          this.sixthConfig4 = Object.assign(this.sixthConfig4, res.data[0])
        })
        .finally(() => {})
    },
    // 第六配置4 提交
    handleSixthConfig4() {
      this.$refs['sixthConfig4'].validate((valid) => {
        if (valid) {
          const params = this.sixthConfig4
          allConfig(params)
            .then((res) => {
              if (res.data) {
                this.$message({
                  message: '提交成功！',
                  type: 'success'
                })
              }
            })
            .finally(() => {
              this.sixthConfigure4()
            })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 模板切换时 改变展示类型点击后操作
    mubanChange() {
      this.pushMubanOptions.forEach((v) => {
        if (v.id === this.colModel.template) {
          this.colModel.viewType = v.viewType
          this.colModel.action = v.action
        }
      })
    },
    // 新建推送消息
    handleAdd() {
      this.isAddNewPush = true
      // 推送模板
      this.pushMubanOptions = []
      // 置空操作

      this.$nextTick(() => {
        this.$refs['colModel'].resetFields()
        this.$refs['seniorModel'].resetFields()

        this.colModel = {
          notifyType: '',
          viewType: 'notiMsg',
          action: 'webUrl'
        }
        this.seniorModel = {
          expDate: '',
          extStatus: false
        }
        this.extParam = []
      })

      if (this.newPushActive !== 'newPushFourth') {
        this.$set(this.colModel, 'targetType', '0')
      }
      if (this.newPushActive === 'newPushFourth') {
        this.$set(this.colModel, 'pushFramework', 'Android')
      }
      if (this.newPushActive !== 'newPushThird') {
        this.$set(this.colModel, 'bussMsgId', '')
      }
      if (
        this.newPushActive === 'newPushFirst' ||
        this.newPushActive === 'newPushSecond'
      ) {
        this.$set(this.colModel, 'targetId', '')
      }
      if (this.newPushActive !== 'newPushFirst') {
        this.$set(this.colModel, 'template', '')
      }
      if (this.newPushActive === 'newPushThird') {
        this.$set(this.colModel, 'userGroup', '')
      }
      if (this.newPushActive === 'newPushFirst') {
        this.$set(this.colModel, 'title', '')
        this.$set(this.colModel, 'content', '')
      }
      if (this.newPushActive === 'newPushFirst') {
        this.$set(this.seniorModel, 'jumpUrl', '')
      }
      if (this.newPushActive === 'newPushFourth') {
        this.$set(this.seniorModel, 'loginStatus', '')
      }
      // 查询模板文件
      searchMubanAll()
        .then((res) => {
          this.pushMubanOptions = res.data
        })
        .finally(() => {})
    },
    // 切换新建内部标题栏
    newPushClick(tab, event) {
      this.$nextTick(() => {
        this.$refs['colModel'].resetFields()
        this.$refs['seniorModel'].resetFields()
        this.colModel = {
          notifyType: '',
          viewType: 'notiMsg',
          action: 'webUrl'
        }
        this.seniorModel = {
          expDate: '',
          extStatus: false
        }
        this.extParam = []
      })

      if (this.newPushActive !== 'newPushFourth') {
        this.$set(this.colModel, 'targetType', '0')
      }
      if (this.newPushActive === 'newPushFourth') {
        this.$set(this.colModel, 'pushFramework', 'Android')
      }
      if (this.newPushActive !== 'newPushThird') {
        this.$set(this.colModel, 'bussMsgId', '')
      }
      if (
        this.newPushActive === 'newPushFirst' ||
        this.newPushActive === 'newPushSecond'
      ) {
        this.$set(this.colModel, 'targetId', '')
      }
      if (this.newPushActive !== 'newPushFirst') {
        this.$set(this.colModel, 'template', '')
      }
      if (this.newPushActive === 'newPushThird') {
        this.$set(this.colModel, 'userGroup', '')
      }
      if (this.newPushActive === 'newPushFirst') {
        this.$set(this.colModel, 'title', '')
        this.$set(this.colModel, 'content', '')
      }
      if (this.newPushActive === 'newPushFirst') {
        this.$set(this.seniorModel, 'jumpUrl', '')
      }
      if (this.newPushActive === 'newPushFourth') {
        this.$set(this.seniorModel, 'loginStatus', '')
      }
      console.log(tab.name)
    },
    // 切换展示模板
    mubanClick(tab, event) {
      console.log(tab.name)
    },
    // 新建推送消息提交
    addNewPushSubmit() {
      this.$refs['colModel'].validate((valid) => {
        if (valid) {
          if (this.newPushActive === 'newPushFirst') {
            this.$set(this.colModel, 'msgType', 0)
          }
          if (this.newPushActive === 'newPushSecond') {
            this.$set(this.colModel, 'msgType', 1)
          }
          if (this.newPushActive === 'newPushThird') {
            this.$set(this.colModel, 'msgType', 2)
          }
          if (this.newPushActive === 'newPushFourth') {
            this.$set(this.colModel, 'msgType', 3)
          }
          if (this.colModel.userGroup === 'uploadUser' && this.newPushActive === 'newPushThird') {
            if (this.uploadList.length === 0) {
              this.$message.error('必须上传文件！')
              return
            } else {
              this.uploadForm.msgType = this.colModel.msgType
              this.uploadForm.file = this.uploadList[0].raw
              this.uploadForm.targetType = this.colModel.targetType
              this.uploadForm.deviceType = this.colModel.deviceType
              this.uploadForm.template = this.colModel.template
              this.uploadForm.userGroup = this.colModel.userGroup
              this.uploadForm.notifyType = this.colModel.notifyType
              this.uploadForm.viewType = this.colModel.viewType
              this.uploadForm.action = this.colModel.action
              this.uploadForm.expDate = this.seniorModel.expDate
              this.uploadForm.extStatus = this.seniorModel.extStatus
              this.$refs.uploadFile.submit()
              this.$nextTick(() => {
                this.isAddNewPush = false
              })
            }
          } else {
            const params1 = JSON.parse(JSON.stringify(this.colModel))
            const params2 = JSON.parse(JSON.stringify(this.seniorModel))
            const params = Object.assign(params1, params2)
            if (params.extStatus === true) {
              this.$set(params, 'extParam', this.extParam)
            }
            addNewsPush(params).then((res) => {
              if (res.data) {
                this.$message({
                  type: 'success',
                  message: '新增推送消息成功!'
                })
              }
            }).finally(() => {
              this.isAddNewPush = false
            })
          }
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    // 高级配置增加参数
    addExpand() {
      var newE = {
        key: '',
        value: ''
      }
      this.extParam.push(newE)
    },
    // 删除扩展参数
    deleteExpand(val) {
      var index = this.extParam.indexOf(val)
      if (index > -1) {
        this.extParam.splice(index, 1)
      }
    },
    // 目标ID类型改变
    tragetIDTypeChange() {
      if (
        this.colModel.targetType === '1' &&
        this.newPushActive === 'newPushThird'
      ) {
        this.pushManFlag = true
        this.$set(this.colModel, 'userGroup', 'uploadUser')
      }
      if (
        this.colModel.targetType === '0' &&
        this.newPushActive === 'newPushThird'
      ) {
        this.$set(this.colModel, 'userGroup', '')
        this.pushManFlag = false
      }
      if (this.colModel.targetType === '1') {
        this.$set(this.colModel, 'pushFramework', 'Android')
      }
      this.$nextTick(() => {
        this.$refs.colModel.clearValidate()
      })
    },
    // 推送平台改变
    pushPlatformChange() {
      if (this.colModel.pushFramework === 'Android') {
        this.$set(this.colModel, 'notifyType', '')
        this.$set(this.colModel, 'action', 'webUrl')
      }
      if (this.colModel.pushFramework === 'IOS') {
        delete this.colModel.notifyType
        delete this.colModel.action
      }
    },
    // 推送人群改变
    pushManChange() {
      if (
        this.colModel.userGroup === 'tagUser' &&
        this.newPushActive === 'newPushThird'
      ) {
        this.$set(this.colModel, 'templateId', '')
        // 推送人群
        this.pushMan2Options = []
        // 获取推送人群
        searchGroupMuban()
          .then((res) => {
            this.pushMan2Options = res.data
          })
          .finally(() => {})
      }
      if (
        this.colModel.userGroup === 'uploadUser' &&
        this.newPushActive === 'newPushThird'
      ) {
        this.$refs.upload.clearFiles()
        this.uploadList = []
        delete this.colModel.templateId
        this.pushMan2Options = []
      }
    },
    // 展示类型改变
    showTypeChange() {
      if (this.colModel.viewType === 'sileMsg') {
        this.colModel.notifyType = 'mps'
        this.AndPathFlag = true
      } else {
        this.colModel.notifyType = ''
        this.AndPathFlag = false
      }
    },
    // 高级拓展 推送登录状态 改变
    pushTypeChange() {
      if (
        this.seniorModel.loginStatus === 'loginout' &&
        this.newPushActive === 'newPushFourth'
      ) {
        this.$set(this.seniorModel, 'logoutTime', '')
      }
      if (
        this.seniorModel.loginStatus === 'login' &&
        this.newPushActive === 'newPushFourth'
      ) {
        if (this.seniorModel.logoutTime) {
          delete this.seniorModel.logoutTime
        }
      }
    },
    // 上传文件
    handleUploadChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift()
      }
      if (fileList.length === 0) {
        this.uploadList = []
      } else {
        this.uploadList = [fileList[fileList.length - 1]]
      }
    },
    // 移除文件
    handleUploadRemove() {
      this.uploadList = []
    },
    // 上传成功后回调
    uploadSuccessCallback(response) {
      this.$refs.uploadFile.clearFiles()
      this.uploadList = []
      this.$message.success('提交成功')
    },
    // 上传失败后回调
    uploadErrorCallback() {
      this.$refs.uploadFile.clearFiles()
      this.uploadList = []

      this.$message({
        message: '文件上传失败！',
        type: 'error'
      })
    },
    // IOS上传文件
    IOSUploadChange(file, fileList) {
      this.changeFile = true
      console.log('============Change')
      if (fileList.length > 1) {
        fileList.shift()
      }
      if (fileList.length === 0) {
        this.IOSFileList = []
      } else {
        this.IOSFileList = [fileList[fileList.length - 1]]
      }
    },
    // IOS移除文件
    IOSUploadRemove() {
      console.log('============Remove')
      this.$refs.IOSFromUpload.clearFiles()
      this.IOSFileList = []
    },
    // IOS上传成功后回调
    IOSSuccessCallback(response) {
      response = JSON.parse(response.response)
      this.IOSFrom.IOSFile = response.data.id
      this.IOSUploadFlag = true
      this.$refs.IOSFromUpload.clearFiles()
      this.IOSFileList = []
      // this.$message.success('上传成功')
      this.$nextTick(() => {
        if (this.IOSUploadFlag === false) {
          return
        }
        // 其他属性处理
        this.fourthSearch()
        // const params = this.IOSFrom
        // allConfig(params).then(res => {
        //   if (res.data) {
        //     this.$message({

        //       message: '提交成功！',
        //       type: 'success'
        //     })
        //   }
        // }).finally(() => {
        //   this.fourthSearch()
        // })
      })
      this.$message.success('保存成功')
    },
    // IOS上传失败后回调
    IOSErrorCallback() {
      console.log('============Error')
      this.IOSUploadFlag = false
      this.$refs.IOSFromUpload.clearFiles()
      this.IOSFileList = []
      this.$message({
        message: 'IOS证书文件上传失败！',
        type: 'error'
      })
    },
    handlePage(current) {
      this.pageInfo.page = current
      this.handleSearch()
    },
    handlePageSize(size) {
      this.pageInfo.limit = size
      this.handleSearch()
    },
    thirdhandlePage(current) {
      this.thirdpageInfo.page = current
      this.thirdSearch()
    },
    thirdhandlePageSize(size) {
      this.thirdpageInfo.limit = size
      this.thirdSearch()
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
    },
    searchRadio1Change() {
      if (this.searchRadio1 === '按数量查询') {
        this.createEchart('Num')
      }
      if (this.searchRadio1 === '按比例查询') {
        this.createEchart('Scale')
      }
    },
    searchRadio2Change() {},
    // 创建数量统计表
    createEchart(val) {
      // 在创建之前销毁
      echarts.init(this.$refs.echart).dispose() // 销毁实例
      // 基于准备好的dom，初始化echarts实例
      var echart = echarts.init(this.$refs.echart)
      // 绘制图表
      if (val === 'Num') {
        let echartOption = JSON.parse(JSON.stringify({}))

        echartOption = {
          title: {
            text: '统计数量指标'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            // data: ['推送成功数', '到达', '打开', '忽略']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: [],
            axisLabel: {
              // X轴刻度配置
              interval: 'auto' // 0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '',
              type: 'line',
              data: []
            },
            {
              name: '',
              type: 'line',
              data: []
            },
            {
              name: '',
              type: 'line',
              data: []
            },
            {
              name: '',
              type: 'line',
              data: []
            }
          ]
        }
        numEchart()
          .then((res) => {
            this.$set(echartOption.xAxis, 'data', res.data.time)
            Object.assign(echartOption.series, res.data.data)
            echartOption.series.forEach((v) => {
              this.$set(v, 'type', 'line')
            })
          })
          .finally(() => {
            echart.setOption(echartOption)
          })
      }
      if (val === 'Scale') {
        let echartOption = JSON.parse(JSON.stringify({}))

        echartOption = {
          title: {
            text: '某站点用户访问来源',
            subtext: '纯属虚构',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          legend: {
            orient: 'vertical',
            left: 'left'
            // data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '70%',
              center: ['50%', '60%'],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        scaleEchart()
          .then((res) => {
            this.$set(echartOption.series[0], 'data', res.data.data)
          })
          .finally(() => {
            echart.setOption(echartOption)
          })
      }
    }
  }
}
</script>>

<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-top: 10px !important;
}

/deep/ .el-collapse-item__header {
  background-color: #f6f8fb !important;
  padding-left: 10px;
}

.wrapper {
  .margin-b20 {
    margin-bottom: 20px;
  }

  .add-white-line {
    display: flex;
    margin-bottom: 20px;

    .add-white_label {
      width: 120px;
    }

    .add-white_cont {
      flex: 1;

      font {
        font-size: 12px;
        color: #606266;
        margin-top: 7px;
        display: inline-block;
      }
    }
  }
}
/deep/ .el-form-item {
  margin-top: 22px;
}
</style>
