<template>
  <div>
    <div class="mainBack">
      <div class="logodiv" @click="toggleSideBar">
        <img class="logo" src="../../assets/newLogn/huaxiahenban.png">
      </div>
      <div class="morePic">
        <el-dropdown
          @command="handleCommand"
        >
          <div class="meClass">
            <div class="touxing">
              <img style="width:50px;border-radius: 50%;" src="../../assets/newLogn/tc.jpg">
            </div>
            <div style="nameclass">{{ username }}</div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">返回首页</el-dropdown-item>
            <el-dropdown-item command="b">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="logodiv2">
        <img class="logo2" src="@/assets/images/loongeasyLogo3.png">
      </div>
    </div>
    <div class="caitiao">
      <div class="caitiaodan" style="background-color:#2c3e50" />
      <div class="caitiaodan" style="background-color:#9857b2" />
      <div class="caitiaodan" style="background-color:#2c81ba" />
      <div class="caitiaodan" style="background-color:#5dc12e" />
      <div class="caitiaodan" style="background-color:#feb506" />
      <div class="caitiaodan" style="background-color:#e17c21" />
      <div class="caitiaodan" style="background-color:#bc382a" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'TopBar',
  data() {
    return {
      username: ''
    }
  },
  mounted() {
    this.username = this.$store.state.user.userName
  },
  created() {
  },
  methods: {
    toggleSideBar() {
      // 开启或关闭左侧菜单
      this.$store.dispatch('app/toggleSideBar')
    },
    // 登出交易 异步操作，需引用async函数
    async logout() {
      // async函数中使用await返回一个promise函数 等待返回后继续执行下面语句
      await this.$store.dispatch('user/handleLogout')
      this.$router.push('/login')
    },
    handleCommand(command) {
      if (command === 'a') {
        this.$router.push('/home')
      }
      if (command === 'b') {
        this.logout()
      }
    }
  }
}
</script>
<style scoped>
.mainBack{
    background-color: #FEFEFE;
    height: 84px;
}
.logodiv{
    float: left;
    display: flex;
    justify-content: right;
    align-items: center;
    width: 350px;
    height: 100%;
    margin-left: 14px;
    text-align: left;
    line-height: 100%;
}
.logo{
    height: 48px;
    display: inline-block;
}
.logodiv2{
    float: right;
    display: flex;
    justify-content: right;
    align-items: center;
    width: 100px;
    height: 100%;
    margin-left: 14px;
    text-align: left;
}
.logo2{
    height: 70%;
    display: inline-block;
}
.morePic{
    float: right;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 120px;
    height: 100%;
    margin-left: 0px;
    text-align: center;
    background-color: #F9F9F9;
    box-shadow: 5px 0 18px rgba(0, 0, 0, 0.3);
}
.meClass{
  flex: 1;
  font-size: 14px;
  color: #555555;
  cursor: pointer;
  text-align: center;
}
.touxing{
  display: inline-block;
}
.caitiao{
  display: flex;
  height: 6px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}
.caitiaodan{
  flex: 1;
}
.nameclass{
  display: inline-block;
}
</style>
