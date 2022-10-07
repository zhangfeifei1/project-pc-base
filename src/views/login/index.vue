<template>
  <div class="login-container">
    <el-form
      v-if="!ableScan"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h1 class="title1">LoongEasy</h1>
        <h1 class="title1">云原生应用运营平台</h1>
        <h3 class="title">后台管理系统</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user-solid" style="font-size:18px" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <i class="el-icon-unlock" style="font-size:18px" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <i :class="['iconfont',(passwordType === 'password')?'icon-yanjing_bi':'icon-yanjing_kai']" />
        </span>
      </el-form-item>
      <el-row>
        <el-form-item prop="captcha" class="picInput">
          <span class="svg-container">
            <!-- <svg-icon icon-class="user" /> -->
            <i class="el-icon-picture" style="font-size:18px" />
          </span>
          <el-input
            ref="captcha"
            v-model="loginForm.captcha"
            placeholder="图形验证码"
            name="captcha"
            type="text"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <div class="pictureGroup" @click="getCodepPicture">
          <img class="imgClass" :src="imgCode">
          <i class="el-icon-refresh" style="font-size:18px;font-weight:700;color:black;float:right;position: absolute;right:0;top:0" />
        </div>
      </el-row>
      <el-row>
        <el-checkbox v-model="loginForm.auto" style="margin:15px;font-size:14px;">自动登录</el-checkbox>
        <a href="#" style="float: right;margin:15px;font-size:14px;color:#000000!important;">忘记密码</a>
      </el-row>
      <el-button
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登 录</el-button>
    </el-form>
    <el-form
      v-if="ableScan"
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form2"
      auto-complete="on"
      label-position="left"
    >

      <div class="title-container">
        <h1 class="title1">LoongEasy</h1>
        <h1 class="title1">云原生应用运营平台</h1>
        <h3 class="title2">后台管理系统</h3>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="账户登录" name="first">
          <el-form-item prop="username">
            <span class="svg-container">
              <i class="el-icon-user-solid" style="font-size:18px" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="Username"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password" style="margin-top:10px;margin-bottom:22px">
            <span class="svg-container">
              <i class="el-icon-unlock" style="font-size:18px" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="Password"
              name="password"
              tabindex="2"
              auto-complete="on"
            />
            <span class="show-pwd" @click="showPwd">
              <i :class="['iconfont',(passwordType === 'password')?'icon-yanjing_bi':'icon-yanjing_kai']" />
            </span>
          </el-form-item>
          <el-row>
            <el-form-item prop="captcha" class="picInput">
              <span class="svg-container">
                <!-- <svg-icon icon-class="user" /> -->
                <i class="el-icon-picture" style="font-size:18px" />
              </span>
              <el-input
                ref="captcha"
                v-model="loginForm.captcha"
                placeholder="图形验证码"
                name="captcha"
                type="text"
                @keyup.enter.native="handleLogin"
              />
            </el-form-item>
            <div class="pictureGroup" @click="getCodepPicture">
              <img class="imgClass" :src="imgCode">
              <i class="el-icon-refresh" style="font-size:18px;font-weight:700;color:black;float:right;position: absolute;right:0;top:0" />
            </div>
          </el-row>
          <el-row>
            <el-checkbox v-model="loginForm.auto" style="margin:15px;font-size:14px;">自动登录</el-checkbox>
            <a href="#" style="float: right;margin:15px;font-size:14px;color:#000000!important;">忘记密码</a>
          </el-row>
          <el-button
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click.native.prevent="handleLogin"
          >登 录</el-button>
        </el-tab-pane>
        <el-tab-pane label="扫码登陆" name="secound">
          <div id="wx_reg" style="display:inline-block;margin-left:60px" />
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <el-dialog width="40%" top="120px" center :visible.sync="changePassWord" title="用户首次登陆需要重置密码！" :show-close="false" :before-close="cancelPasswordSubmit">
      <template>
        <el-form ref="changePassWord" :model="passwordChange" label-width="120px" :rules="changeRules">
          <el-form-item label="登录名:" prop="username" style="margin-top:30px">
            <el-input v-model="passwordChange.username" disabled style="width:220px" />
          </el-form-item>
          <el-form-item label="旧密码:" prop="oldPassword">
            <el-input v-model="passwordChange.oldPassword" type="password" placeholder="请输入旧密码！" style="width:220px" />
          </el-form-item>
          <el-form-item label="新密码:" prop="newPassword">
            <el-input v-model="passwordChange.newPassword" type="password" placeholder="请输入新密码！" style="width:220px" />
          </el-form-item>
          <el-form-item label="确认新密码:" prop="newPasswordConfirm" style="margin-bottom:50px">
            <el-input v-model="passwordChange.newPasswordConfirm" type="password" placeholder="请确认新密码！" style="width:220px" />
          </el-form-item>
        </el-form>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" size="small" @click="cancelPasswordSubmit">取消</el-button>
        <el-button type="primary" size="small" @click="passwordChangeSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
var ableScan = window.wxConfig.ableScan
if (ableScan) {
  window.onload = function() {
    window.WwLogin(window.wxConfig)
  }
}

import {
  randomLenNum
} from '@/utils/index'
// eslint-disable-next-line no-unused-vars
import { WwLogin } from '@/utils/wx'
import { getCodepPicture, firstChangePassword, adminToken } from '@/api/loginApi'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('用户名不为可空！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('密码不可以为空！'))
      } else if (value.length < 6) {
        callback(new Error('请输入至少6位的密码！'))
      } else {
        callback()
      }
    }
    const validatePicture = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('验证码不可为空！'))
      } else if (value.length !== 5) {
        callback(new Error('请输入5位图形验证码！'))
      } else {
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      const reg2 = /^.{8,12}$/
      const reg3 = /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{8,12}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== '' && !reg2.test(value)) {
        callback(new Error('长度8到12个字符'))
      } else if (!reg3.test(value)) {
        callback(new Error('密码复杂度不符合要求，必须包含数字和字母'))
      } else {
        callback()
      }
    }
    const validatePassConfirm = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error('密码不可以为空！'))
      } else if (value !== this.passwordChange.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        auto: false
      },
      ableScan: ableScan,
      activeName: 'first',
      changePassWord: false,
      passwordChange: {
        username: '',
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
      },
      imgCode: '',
      code: '',
      codeImg: '',
      randomStr: '',
      loginRules: {
        username: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }],
        captcha: [{
          required: true,
          trigger: 'blur',
          validator: validatePicture
        }]
      },
      changeRules: {
        username: [{
          required: true,
          trigger: 'blur',
          validator: validateUsername
        }],
        oldPassword: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }],
        newPassword: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword2
        }],
        newPasswordConfirm: [{
          required: true,
          trigger: 'blur',
          validator: validatePassConfirm
        }]
      },
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.randomStr = randomLenNum(4, true)
    // this.getCodepPicture()

    if (this.$route.query.code) {
      adminToken(2, this.$route.query.code).then((response) => {
        const params = {
          access_token: response.data.access_token
        }
        this.codeLogin(params)
      })
    }
  },
  methods: {
    tttt() {
      this.changePassWord = true
      this.passwordChange.username = this.loginForm.username
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    getCodepPicture() {
      getCodepPicture({}).then(res => {
        const blob = new Blob([res])
        const url = window.URL.createObjectURL(blob)
        this.imgCode = url
      }).catch(() => {
        this.$message.error('获取图形验证码失败！')
      })
    },
    cancelPasswordSubmit() {
      this.changePassWord = false
      this.$nextTick(() => {
        this.passwordChange = {
          username: '',
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: ''
        }
        this.$refs.changePassWord.resetFields()
      })
    },
    passwordChangeSubmit() {
      this.$refs.changePassWord.validate((valid) => {
        if (valid) {
          const params = {
            username: this.passwordChange.username,
            oldPassword: this.passwordChange.oldPassword,
            newPassword: this.passwordChange.newPassword
          }
          firstChangePassword(params).then(res => {
            if (res.returnCode === '000000') {
              this.$message.success('修改密码成功，请用新密码登陆！')
            }
            this.changePassWord = false
          }).catch(() => {
            this.$message.error('修改密码失败！')
            // this.changePassWord = false
          })
        } else {
          this.$message.error('验证不通过！')
        }
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const params = {
            username: this.loginForm.username,
            password: this.loginForm.password,
            captcha: this.loginForm.captcha,
            lastRev: window.sessionStorage.getItem('lastRev')
          }
          this.$store.dispatch('user/handleLogin', params).then((response) => {
            sessionStorage.setItem('t', response.data.access_token)
            this.$router.push({
              path: this.redirect || '/home'
            })
            // location.reload()
          }).catch((response) => {
            if (response.returnCode === '040007') {
              this.changePassWord = true
              this.passwordChange.username = this.loginForm.username
            }
            this.getCodepPicture()
          })
        } else {
          return false
        }
      })
    },
    // 登录方法
    codeLogin(params) {
      const token = params.access_token
      const auto = true
      this.$store.commit('user/setToken', { token, auto })
      this.$router.push({
        path: '/home'
      })
      location.reload()
    }
  }
}

</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */

  $bg:#E5E5E5;
  $light_gray:#454545;
  $cursor: #000000;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }

</style>

<style lang="scss" scoped>
  $bg:#283538;
  $dark_gray:#000000;
  $light_gray:#002929;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: #000000;
    background-image: url('../../assets/login_bg_201.png');
    background-size: cover;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 500px;
      height: 600px;
      background: #ffffff;
      max-width: 100%;
      padding: 50px 35px 0;
      border-radius: 10px;
      margin: 0 auto;
      top:70px;
      overflow: hidden;
    }
    .login-form2 {
      position: relative;
      width: 500px;
      height: 650px;
      background: #ffffff;
      max-width: 100%;
      padding: 40px 35px 0;
      border-radius: 10px;
      margin: 0 auto;
      top:70px;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title2 {
        font-size: 20px;
        color: $light_gray;
        margin: 0px auto 20px auto;
        text-align: center;
        font-weight: bold;
      }
      .title {
        font-size: 20px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .title1 {
        font-size: 30px;
        color: $light_gray;
        margin: 0px auto 20px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
.el-button--primary {
    color: #FFF;
    background-color: #000000!important;
    border-color: #000000!important;
}
.el-button--text {
  color:  #000000!important;
}
.el-button:focus, .el-button:hover {
  color: #000000!important;
  border-color: #000000!important;
  background-color: #eff9ff !important;
}
.picInput{
  width: 300px;
  float: left;
}
.pictureGroup{
  width: 110px;
  height: 52px;
  background: skyblue;
  float: right;
  cursor: pointer;
  position: relative;
  border-radius: 5px;
  overflow: hidden;
}
.imgClass{
  width: 110px;
  height: 52px;
}
.el-input.is-disabled {
    background-color: #F5F7FA;
    border-color: #E4E7ED;
}
/deep/ .el-form-item__label {
    line-height: 45px!important;
}
/deep/ .el-input.is-disabled .el-input__inner {
    background-color: #E5E5E5!important;
    border-color: #E5E5E5!important;
    color: #000000;
    cursor: not-allowed;
}
/deep/ .el-tabs__header {
    margin-bottom: 30px!important;
}
</style>
