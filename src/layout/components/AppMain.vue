<template>
  <section class="app-main" :style="{'padding-top':'0px'}">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="keepAlive">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  props: {
    height: {
      type: String,
      default: '0'
      // default: '50'
    }
  },
  data() {
    return {
      keepAlive: []
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  watch: {
    '$store.state.tagsView.visitedViews': {
      handler: function(newVal, oldVal) {
        var routeArr = []
        newVal.forEach(v => {
          routeArr.push(v.name)
        })
        this.keepAlive = routeArr
      }
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  background: #f4f9fa;
  min-height: calc(100vh - 80px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  /* padding-top: 50px; */
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
