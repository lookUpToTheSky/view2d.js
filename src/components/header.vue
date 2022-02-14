<template>
    <!-- 顶部导航栏 -->
    <div class="headers">
      <el-menu class="menu" mode="horizontal" 
        @select="onMenu" 
        active-text-color="#409EFF"
        background-color="#2265ac"
        text-color="#fff">
        <el-menu-item class="logo">
          <router-link to="/">
            <!-- <img src="/favicon.ico" /> -->
            <div style="display: flex; align-items: center; justify-content: space-around">
              <i class="el-icon-arrow-left"></i>
              <span>返回</span>
            </div>
          </router-link>
        </el-menu-item>
        <el-submenu index="file">
          <template slot="title">文件</template>
          <el-menu-item index="open">打开本地文件（新建）</el-menu-item>
          <el-menu-item index="replace">导入本地文件...</el-menu-item>
          <el-menu-item class="separator">-------------------------------</el-menu-item>
          <el-menu-item index="save">保存到本地</el-menu-item>
          <el-menu-item index="savePng">下载为图片</el-menu-item>
        </el-submenu>
        <el-submenu index="edit">
          <template slot="title">编辑</template>
          <el-menu-item index="undo">撤消</el-menu-item>
          <el-menu-item index="redo">重做</el-menu-item>
          <el-menu-item class="separator">-------------------------------</el-menu-item>
          <el-menu-item index="copy">复制</el-menu-item>
          <el-menu-item index="cut">剪切</el-menu-item>
          <el-menu-item index="paste">粘贴</el-menu-item>
        </el-submenu>
        <el-submenu index="share">
          <template slot="title">社区</template>
          <el-menu-item index="about">咨询与建议</el-menu-item>
          <el-menu-item>
            <a href="" target="_blank">开源Github</a>
          </el-menu-item>
          <el-menu-item>
            <a href="" target="_blank">开发文档</a>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="help">
          <template slot="title">帮助</template>
          <el-menu-item>
            <a href="" target="_blank">在线官网</a>
          </el-menu-item>
          <el-menu-item index="license">许可与申明</el-menu-item>
          <el-menu-item index="joinin">资助与加入</el-menu-item>
          <el-menu-item index="about2">关于</el-menu-item>
        </el-submenu>
      </el-menu>
      <el-menu mode="horizontal" class="full" background-color="#2265ac" text-color="#fff"></el-menu>
      <el-menu mode="horizontal" @select="onMenu" background-color="#2265ac" active-text-color="#409EFF"  text-color="#fff">
        <el-menu-item index="show"><i class="el-icon-video-play"></i><span>预览</span></el-menu-item>
        
        <el-submenu index="scale" title="">
          <template slot="title">
            视图比例：{{scale}}%（鼠标滚轮）
          </template>
          <el-menu-item @click="resizeView('auto')">自适应</el-menu-item>
          <el-menu-item @click="resizeView('resize')">重置</el-menu-item>
        </el-submenu>
        <el-submenu index="state" title="默认连线类型">
          <template slot="title">
            <i :class="`iconfont icon-${lineName}`"></i>
          </template>
          <el-menu-item
            v-for="(item, index) in lineNames"
            :key="index"
            :index="`line-${item}`"
            @click="onState('lineName', item)"
          >
            <i :class="`iconfont icon-${item}`"></i>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-menu mode="horizontal" background-color="#2265ac" active-text-color="#409EFF"  text-color="#fff">
        <el-submenu index="state" title="默认起点箭头">
          <template slot="title">
            <i :class="`iconfont icon-from-${fromArrowType}`"></i>
          </template>
          <el-menu-item
            v-for="(item, index) in arrowTypes"
            :key="index"
            :index="`fromArrow-${item}`"
            @click="onState('fromArrowType', item)"
          >
            <i :class="`iconfont icon-from-${item}`"></i>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-menu mode="horizontal" background-color="#2265ac" active-text-color="#409EFF"  text-color="#fff">
        <el-submenu index="state" title="默认终点箭头">
          <template slot="title">
            <i :class="`iconfont icon-to-${toArrowType}`"></i>
          </template>
          <el-menu-item
            v-for="(item, index) in arrowTypes"
            :key="index"
            :index="`toArrow-${item}`"
            @click="onState('toArrowType', item)"
          >
            <i :class="`iconfont icon-to-${item}`"></i>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-menu mode="horizontal" background-color="#2265ac" active-text-color="#409EFF"  text-color="#fff">
        <el-submenu index="user" v-if="user">
          <template slot="title">
            <el-avatar
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              :size="24"
            ></el-avatar>
            {{user.username}}
          </template>
          <el-menu-item @click="onSignOut">退出</el-menu-item>
        </el-submenu>
        <el-menu-item v-if="!user">
          <!-- <a @click="onLogin">注册 / 登录</a> -->
        </el-menu-item>
      </el-menu>
    </div>
</template>

<script >

export default {
  data() {
    return {
      about: false,
      license: false,
      joinin: false,
      lineNames: ['curve', 'polyline', 'line'],
      arrowTypes: [
        '',
        'triangleSolid',
        'triangle',
        'diamondSolid',
        'diamond',
        'circleSolid',
        'circle',
        'line',
        'lineUp',
        'lineDown'
      ],
      user: null
    }
  },
  created() {
    // this.getUser();
    // console.log(this.$store, 12)
  },
  computed: {
    scale() {
      return Math.ceil(this.$store.state.data.scale * 100)
    },
    lineName() {
      return this.$store.state.data.lineName
    },
    fromArrowType() {
      return this.$store.state.data.fromArrowType
    },
    toArrowType() {
      return this.$store.state.data.toArrowType
    },
    error() {
      return this.$store.state.error
    }
  },
  watch: {
    error(curVal) {
      this.$notify({
        title: '错误',
        type: 'error',
        message: curVal.text
      })
    }
  },
  methods: {
    resizeView(type) {
        this.$emit('change', type)
    },
    onMenu(key, keyPath) {
      if (!key || key.indexOf('/') === 0) {
        return
      }
      switch (key) {
        case 'new':
          // this.$router.push('/workspace')
          break
        case 'open':
            this.$store.commit('emit', {name: key})
          break
        case 'about':
        case 'about2':
          this.about = true
          break
        case 'license':
          this.license = true
          break
        case 'joinin':
          this.joinin = true
          break
        case 'show': this.$store.commit('emit', {name: key})
          break;
        default: 
          this.$store.commit('emit', {
            name: key
          })
          break
      }
    },
    onState(key, value) {
      this.$store.commit('emit', {
        name: 'state',
        data: {
          key,
          value
        }
      })
    },
    async getUser() {
      if (this.$cookies.get('token')) {
        this.user = await this.$axios.$get('/api/user/profile')
      }
    },
    onLogin() {
      if (process.client) {
        location.href = `https://account.le5le.com?cb=${encodeURIComponent(
          location.href
        )}`
      }
    },
    onSignOut() {
      this.$cookies.remove('token')
      this.user = null
    }
  },
}
</script>

<style lang="scss">

.headers {
  display: flex;
  font-size: 0.13rem;
  height: 0.4rem;
  .full {
    flex: 1;
  }
  .logo {
    img {
      height: 0.22rem;
      position: relative;
      top: -0.04rem;
    }
  }
  .el-submenu__title,
  .el-menu-item{
    font-size: 0.13rem;
    padding: 0 0.1rem;
    color: #eee !important;
    height: 0.39rem !important;
    line-height: 0.39rem !important;
    a {
      text-decoration: none;
      color: #eee !important;
    }
    .iconfont {
      color: #eee !important;
      font-size: 0.26rem;
    }
    i{
      color: #eee !important;
    }
  }
}
.el-submenu__title,
.el-menu-item {
  .iconfont {
    font-size: 0.26rem;
  }
  i{
    color: #eee ;
  }
}

</style>
