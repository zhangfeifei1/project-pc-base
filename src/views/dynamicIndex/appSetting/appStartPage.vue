<template>
  <div class="app-container wrapper">
    <!-- form表单 -->
    <!-- <el-form>
      <el-form-item label="展示秒数">
        <el-input v-model="startPageForm.showtime" placeholder="请输入展示秒数" style="width:150px" />
        <el-button size="small" type="primary" @click="editSecond">确定</el-button>
      </el-form-item>
    </el-form> -->
    <!-- 添加按钮 -->
    <div>
      <el-button style="margin-bottom:20px" size="small" type="primary" @click="addStartPage">添加启动页</el-button>
    </div>
    <!-- 表格信息展示 -->
    <div>
      <el-table
        :data="startPageData"
        style="width:100%"
        border
        :cell-style="cellstyle"
        :header-cell-style="rowClass"
        size="small"
      >
        <el-table-column prop="startPageId" label="启动页ID" />
        <el-table-column prop="baseImg" label="启动页图片">
          <template slot-scope="scope">
            <img
              :src="'data:image/png;base64,'+scope.row.baseImg"
              height="50px"
              width="50px"
            >
          </template>
          <!-- <template slot-scope="scope">
            <el-upload
              ref="startPageUpload"
              action="/pmobile/dynamic/startPage/update"
              :headers="headersToken"
              :data="fileData"
              accept="image/*"
              list-type="picture"
              :file-list="startPageFileList"
              :auto-upload="false"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-exceed="handleExceed"
              :before-remove="beforeRemove"
            >
              <el-button size="small" type="primary">点击修改图片</el-button>
              <div slot="tip" class="el-upload__tip" style="color:#cccccc">需上传jpg/png文件</div>
            </el-upload>
          </template> -->
        </el-table-column>
        <el-table-column prop="startPageName" label="启动页名称" />
        <el-table-column prop="imgRatio" label="展示比例">
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.imgRatio" placeholder="请输入展示比例" />
          </template> -->
        </el-table-column>
        <el-table-column prop="showtime" label="展示秒数">
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.showtime" placeholder="请输入展示秒数" />
          </template> -->
        </el-table-column>
        <el-table-column prop="jumpUrl" label="URL" width="300px">
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.jumpUrl" placeholder="网址" />
          </template> -->
        </el-table-column>
        <el-table-column prop="action" label="打开方式">
          <template slot-scope="scope">
            <span v-if="scope.row.action===0">无需打开</span>
            <span v-if="scope.row.action===1">单独打开</span>
            <span v-if="scope.row.action===2">内部打开</span>
          </template>
          <!-- <template slot-scope="scope">
            <el-select v-model="scope.row.action" placeholder="请选择">
              <el-option
                v-for="item in styleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template> -->
        </el-table-column>
        <el-table-column label="操作" width="90px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEditPage(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDeletePage(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar" style="margin-bottom:20px">
        <el-pagination
          background
          :current-page="startPage.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="startPage.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="startPage.total"
          @size-change="handlePageSize"
          @current-change="handlePage"
        />
      </el-col>
    </div>
    <!-- 新建启动页弹框 -->
    <el-dialog title="新建启动页" :visible.sync="newStartPageVisible">
      <el-form
        ref="newStartPageForm"
        :model="newStartPageForm"
        :rules="newStartPageRules"
        label-width="110px"
      >
        <el-form-item label="启动页图片：" prop="newStartPagePicture">
          <img
            v-show="startPageIcon.fileValue"
            :src="'data:image/png;base64,'+startPageIcon.fileValue"
            style="width:50px;hight:50px"
          >
          <fileupload @getFile="getStartPagePicture" />
        </el-form-item>
        <el-form-item label="启动页名称：" prop="startPageName">
          <el-input v-model="newStartPageForm.startPageName" placeholder="请输入启动页名称" style="width:180px" />
        </el-form-item>
        <el-form-item label="展示比例：" prop="imgRatio">
          <el-input v-model="newStartPageForm.imgRatio" placeholder="请输入展示比例" style="width:180px" />
        </el-form-item>
        <el-form-item label="展示秒数：" prop="showTime">
          <el-input v-model="newStartPageForm.showTime" placeholder="请输入展示秒数" style="width:180px" />
        </el-form-item>
        <el-form-item label="URL：" prop="jumpUrl">
          <el-input v-model="newStartPageForm.jumpUrl" placeholder="请输入跳转URL" style="width:300px" />
        </el-form-item>
        <el-form-item label="打开方式：" prop="action">
          <el-select v-model="newStartPageForm.action" placeholder="请选择打开方式">
            <el-option
              v-for="item in styleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="default" size="small" style="margin-bottom: 20px" @click="handleReset">取消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit">保存</el-button>
      </div>
    </el-dialog>
    <!-- 编辑启动页弹框 -->
    <el-dialog title="编辑启动页" :visible.sync="editStartPageVisible">
      <el-form
        ref="editStartPageForm"
        :model="editStartPageForm"
        :rules="editStartPageRules"
        label-width="160px"
      >
        <el-form-item label="启动页ID：">
          <el-input v-model="editStartPageForm.startPageId" style="width:180px" disabled />
        </el-form-item>
        <el-form-item label="启动页图片：">
          <img
            v-show="editStartPageIcon.fileValue"
            :src="'data:image/png;base64,'+editStartPageIcon.fileValue"
            style="width:50px;hight:50px"
          >
          <fileupload @getFile="editStartPagePicture" />
        </el-form-item>
        <el-form-item label="启动页名称：" prop="editStartPageName">
          <el-input v-model="editStartPageForm.editStartPageName" style="width:180px" />
        </el-form-item>
        <el-form-item label="展示比例：" prop="editImgRatio">
          <el-input v-model="editStartPageForm.editImgRatio" style="width:180px" />
        </el-form-item>
        <el-form-item label="展示秒数：" prop="editShowTime">
          <el-input v-model="editStartPageForm.editShowTime" style="width:180px" />
        </el-form-item>
        <el-form-item label="URL：" prop="editJumpUrl">
          <el-input v-model="editStartPageForm.editJumpUrl" style="width:300px" />
        </el-form-item>
        <el-form-item label="打开方式：" prop="editAction">
          <el-select v-model="editStartPageForm.editAction" placeholder="请选择打开方式">
            <el-option
              v-for="item in styleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button type="default" size="small" style="margin-bottom: 20px" @click="cancelEditPage">取消</el-button>
        <el-button type="primary" size="small" @click="saveEditPage">保存</el-button>
      </div>
    </el-dialog>
    <!-- 按钮区域 -->
    <!-- <div style="text-align:center;">
      <el-button type="primary" style="margin-bottom:20px" size="small" @click="goBack">返回</el-button>
    </div> -->
  </div>
</template>
<script>
import { getToken } from '@/utils/util'
import fileupload from '@/components/FileUpload/fileupload.vue'
import { list, createStartPage, editStartPageApi, deleteStartPage } from '@/api/dynamicPageApi'
export default {
  // name: 'StartPage',
  // components: {},
  // props: {
  //   dialogStartPage: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  components: {
    fileupload
  },
  data() {
    // const validatePagePicture = (rule, value, callback) => {
    //   if (!value || !value.trim()) {
    //     return callback(new Error('启动页图片不能为空'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePageImgRatio = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('展示比例不能为空'))
      } else {
        callback()
      }
    }
    const validatePageShowTime = (rule, value, callback) => {
      let valueInt = -1
      if (value === undefined || value === '') {
        valueInt = -1
      } else {
        valueInt = value * 1
      }
      if (valueInt === -1) {
        return callback(new Error('展示秒数不能为空'))
      } else {
        callback()
      }
    }
    const validatePageJumpUrl = (rule, value, callback) => {
      if (!value || !value.trim()) {
        return callback(new Error('跳转路径不能为空'))
      } else {
        callback()
      }
    }
    return {
      // startPageForm: {
      //   showtime: ''
      // },
      // showTimeId: '', // 展示秒数需要的id
      startPageFileList: [],
      startPageUploadFlag: false,
      startPageData: [],
      startPage: {
        total: 0,
        page: 1,
        limit: 10
      },
      styleOptions: [
        {
          value: 0,
          label: '无需打开'
        },
        {
          value: 1,
          label: '单独打开'
        },
        {
          value: 2,
          label: '内部打开'
        }
      ],
      id: '', // 参数id
      fileData: {},
      newStartPageVisible: false, // 添加启动页弹框
      editStartPageVisible: false, // 编辑启动页弹框
      newStartPageForm: {},
      newStartPageRules: {
        // newStartPagePicture: [
        //   { required: true, validator: validatePagePicture, trigger: 'change' }
        // ],
        startPageName: [
          { required: true, message: '启动名称不能为空', trigger: 'blur' }
        ],
        imgRatio: [
          { required: true, validator: validatePageImgRatio, trigger: 'blur' }
        ],
        showTime: [
          { required: true, validator: validatePageShowTime, trigger: 'blur' }
        ],
        jumpUrl: [
          { required: true, validator: validatePageJumpUrl, trigger: 'blur' }
        ],
        action: [
          { required: true, message: '请选择打开方式', trigger: 'change' }
        ]
      },
      editStartPageForm: {
        startPageId: '',
        editStartPageName: '',
        editImgRatio: '',
        editShowTime: '',
        editJumpUrl: '',
        editAction: ''
      },
      editStartPageRules: {
        editStartPageName: [
          { required: true, message: '启动名称不能为空', trigger: 'blur' }
        ],
        editImgRatio: [
          { required: true, validator: validatePageImgRatio, trigger: 'blur' }
        ],
        editShowTime: [
          { required: true, validator: validatePageShowTime, trigger: 'blur' }
        ],
        editJumpUrl: [
          { required: true, validator: validatePageJumpUrl, trigger: 'blur' }
        ],
        editAction: [
          { required: true, message: '请选择打开方式', trigger: 'change' }
        ]
      },
      startPageIcon: {}, // 新建启动页图片
      editStartPageIcon: {}// 编辑启动页图片
    }
  },
  created() {
    const token1 = getToken()
    this.headersToken = {
      Authorization: 'Bearer ' + token1
    }
    // 获取启动页列表
    this.getStartPageList()

    // 获取展示秒数
    // this.getSecond()
  },
  methods: {
    // 获取启动页列表
    getStartPageList() {
      const params = {
        appId: sessionStorage.getItem('startPageId'),
        current: this.startPage.page,
        size: this.startPage.limit
      }
      list(params).then(res => {
        console.log(res, '启动页列表')
        if (res.returnCode === '000000') {
          this.startPageData = res.data.records
          // for (var i = 0; i < res.data.length; i++) {
          //   this.editStartPageIcon.fileValue = res.data.records[i].baseImg
          // }
          this.startPage.total = res.data.total * 1
        }
      })
    },
    addStartPage() { // 打开添加弹框
      this.newStartPageVisible = true
    },
    handleSubmit() { // 确定添加启动页
      console.log('================' + (this.$refs.newStartPageForm === undefined))
      this.$refs.newStartPageForm.validate((valid) => {
        if (valid) {
          const params = {
            appId: sessionStorage.getItem('startPageId'),
            startPageName: this.newStartPageForm.startPageName,
            imgRatio: this.newStartPageForm.imgRatio,
            jumpUrl: this.newStartPageForm.jumpUrl,
            showTime: this.newStartPageForm.showTime,
            action: this.newStartPageForm.action,
            startPageImg: this.startPageIcon.fileValue
          }
          createStartPage(params).then(res => {
            if (res.returnCode === '000000') {
              this.$message.success('新建成功')
              this.newStartPageVisible = false
              this.getStartPageList()
              this.newStartPageForm = {}
              this.startPageIcon.fileValue = ''
            }
          })
        } else {
          this.$message.error('验证不通过')
        }
      })
    },
    handleReset() { // 取消添加弹框
      this.newStartPageVisible = false
    },
    getStartPagePicture(val) { // 添加启动页图片
      this.startPageIcon = val[0]
    },
    handleEditPage(row) { // 打开编辑启动页弹框
      this.editStartPageVisible = true
      this.id = row.id
      this.editStartPageForm.startPageId = row.startPageId
      this.editStartPageForm.editStartPageName = row.startPageName
      this.editStartPageIcon.fileValue = row.baseImg
      this.editStartPageForm.editImgRatio = row.imgRatio
      this.editStartPageForm.editShowTime = row.showtime
      this.editStartPageForm.editJumpUrl = row.jumpUrl
      this.editStartPageForm.editAction = row.action
    },
    editStartPagePicture(val) { // 编辑启动页图片
      this.editStartPageIcon = val[0]
    },
    saveEditPage() { // 提交编辑启动页
      console.log('================' + (this.$refs.editStartPageForm === undefined))
      this.$refs.editStartPageForm.validate((valid) => {
        if (valid) {
          const params = {
            appId: sessionStorage.getItem('startPageId'),
            id: this.id,
            startPageName: this.editStartPageForm.editStartPageName,
            action: this.editStartPageForm.editAction,
            imgRatio: this.editStartPageForm.editImgRatio,
            showTime: this.editStartPageForm.editShowTime,
            startPageId: this.editStartPageForm.startPageId,
            jumpUrl: this.editStartPageForm.editJumpUrl,
            startPageImg: this.editStartPageIcon.fileValue
          }
          editStartPageApi(params).then(res => {
            if (res.returnCode === '000000') {
              this.$message.success('保存成功')
              this.editStartPageVisible = false
              this.getStartPageList()
            } else {
              this.$message.error('更新失败')
            }
          })
        } else {
          this.$message.error('验证不通过')
        }
      })

    //   this.fileData.id = item.id
    //   this.fileData.action = item.action
    //   this.fileData.picName = item.picName
    //   this.fileData.imgRatio = item.imgRatio
    //   this.fileData.showtime = item.showtime
    //   this.fileData.startPageId = item.startPageId
    //   this.fileData.jumpUrl = item.jumpUrl
    },
    cancelEditPage() { // 关闭编辑弹框
      this.editStartPageVisible = false
    },
    // handlePreview(file, fileList) {
    //   // 上传文件
    //   if (fileList.length > 1) {
    //     fileList.shift()
    //   }
    //   if (fileList.length === 0) {
    //     this.startPageFileList = []
    //   } else {
    //     this.startPageFileList = [fileList[fileList.length - 1]]
    //   }
    //   console.log(this.startPageFileList, '********')
    // },

    // handleRemove() {
    //   // 移除文件
    //   this.startPageFileList = []
    // },

    // handleExceed(files, fileList) {
    //   this.message.warning(`当前选择一个文件，本次选择了${files.length}个文件，共选择了${files.length + fileList.length}个文件`
    //   )
    // },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${file.name}?`)
    // },
    // 保存编辑启动页列表
    // saveEditPage(item) {
    //   this.fileData.appId = this.$store.state.dynamic.dynamicPageData.appId
    //   this.fileData.id = item.id
    //   this.fileData.action = item.action
    //   this.fileData.picName = item.picName
    //   this.fileData.imgRatio = item.imgRatio
    //   this.fileData.showtime = item.showtime
    //   this.fileData.startPageId = item.startPageId
    //   this.fileData.jumpUrl = item.jumpUrl
    //   this.$refs.startPageUpload.submit()
    // },
    // handleSuccess(response, file, fileList) {
    //   this.$refs.startPageUpload.clearFiles()
    //   this.startPageFileList = []
    //   this.$message.success('保存成功')
    // },
    // 删除启动页列表
    handleDeletePage(item) {
      const params = {
        id: item.id
      }
      this.$confirm('确定删除该启动页吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStartPage(params).then(res => {
          console.log(res)
          if (res.returnCode === '000000') {
            this.$message.success('删除成功!')
            this.getStartPageList()
          } else {
            this.$message.error('删除失败')
          }
        }).finally(res => {

        })
      }).catch(() => {
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
      return 'text-align:center'
    },
    /**
     * @description 设置el-table表头居中
     */
    rowClass() {
      return 'background:#ffffff;color:#515a6e;text-align:center'
    },
    handlePage(current) {
      this.startPage.page = current
    },
    handlePageSize(size) {
      this.startPage.limit = size
    },
    goBack() { // 返回
      // EventBus.$emit('handleCloseStartPage')
    }
  }
}
</script>
<style lang="scss" scoped>
.startPageCard {
  float: left;
  width: 170px;
  height: 250px;
  margin-right: 50px;
  margin-bottom: 35px;
}
.startPageCard:hover {
  box-shadow: 2px 4px 12px 5px rgba(42, 110, 238, 0.308);
}
// /deep/.el-form-item__label {
//     text-align: right;
//     vertical-align: middle;
//     float: left;
//     font-size: 12px;
//     color: #515a6e;
//     line-height: 40px;
//     padding: 0 12px 0 0;
//     -webkit-box-sizing: border-box;
//     box-sizing: border-box;
// }
</style>
