<template>
  <div class="container">
    <div style="margin-top:60px;padding-left:230px">
      <div style="text-align:center">
        <el-card
          v-for="(item,index) in appSettingData"
          :key="index"
          shadow="always"
          class="appSettingCard"
        >
          <img
            :src="item.appSettingIcon"
            width="100px"
            height="100px"
            style="border-radius:50px;margin:0 auto;cursor:pointer"
            @click="gotoRouter(item.routerName)"
          >
          <div
            style="margin-top:15px;font-size:20px;font-weight:700;font-family:Microsoft YaHei"
          >{{ item.appSettingTitle }}</div>
        </el-card>
      </div>
      <div style="display:inline-block;margin-left:320px;margin-bottom:60px">
        <el-button type="primary" @click="goBack()">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      appSettingData: [
        {
          appSettingIcon: require('@/assets/newLogn/横版-标志-300-300.png'),
          appSettingTitle: 'APP组件管理',
          routerName: 'AppCompsManage'
        },
        {
          appSettingIcon: require('@/assets/newLogn/横版-标志-300-300.png'),
          appSettingTitle: 'StartPage设置',
          routerName: 'AppStartPage'
        },
        {
          appSettingIcon: require('@/assets/newLogn/横版-标志-300-300.png'),
          appSettingTitle: 'Page开发'
        },
        {
          appSettingIcon: require('@/assets/newLogn/横版-标志-300-300.png'),
          appSettingTitle: 'APP开发'
        },
        {
          appSettingIcon: require('@/assets/newLogn/横版-标志-300-300.png'),
          appSettingTitle: '路由配置',
          routerName: 'AppRouterConfig'
        },
        {
          appSettingIcon: require('@/assets/newLogn/横版-标志-300-300.png'),
          appSettingTitle: '基础信息修改',
          routerName: 'AppChangeInfo'
        },
        {
          appSettingIcon: require('@/assets/newLogn/横版-标志-300-300.png'),
          appSettingTitle: '主题管理',
          routerName: 'AppTheme'
        },
        {
          appSettingIcon: require('@/assets/newLogn/横版-标志-300-300.png'),
          appSettingTitle: 'APP智能管理',
          routerName: 'AppMagicConfig'
        },
        {
          appSettingIcon: require('@/assets/newLogn/横版-标志-300-300.png'),
          appSettingTitle: '发布管理'
        }
      ]
    }
  },
  created() {},
  methods: {
    gotoRouter(routerName) {
      this.$router.push({
        name: routerName
      })
    },
    goBack() {
      this.$router.push({
        name: 'DynamicIndex01'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.appSettingCard {
  float: left;
  width: 190px;
  height: 200px;
  border-radius: 20px;
  margin-right: 70px;
  margin-bottom: 35px;
}
</style>
