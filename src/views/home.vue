<template>
<div class="content">
    <div class="pageMenu" ref="pageMenu" v-show="this.$route.path !== '/workspace'">
        <el-menu
            :default-active="this.$route.path"
            class="el-menu-vertical-demo"
            background-color="#2265ac"
            text-color="#fff"
            active-text-color="#409EFF"
            @select="onSelecte"
            :collapse="collapse"
            :router="true">
            <el-menu-item index="/">
                <i class="el-icon-menu"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="0">
                <template slot="title">
                    <i class="el-icon-s-platform"></i>
                    <span>设备管理</span>
                </template>
                <el-menu-item index="/add-equipment">添加设备</el-menu-item>
                <el-menu-item index="/list-equipment">设备列表</el-menu-item>
            </el-submenu>
            <el-menu-item index="/workspace">
                <i class="el-icon-s-tools"></i>
                <span slot="title">云组态</span>
            </el-menu-item>
        </el-menu> 
    </div>
    <div class="item-page">
        <router-view></router-view>
    </div>
</div>
</template>

<script>
export default {
    computed: {
        collapse() {
            return this.$store.state.collapse
        }
    },
    watch: {
       '$route.path'() {
            this.onSelecte(this.$route.path)
       } 
    },
    methods: {
      onSelecte(path) {
        if(path === '/workspace') {
            this.$store.state.collapse = true
            this.$refs.pageMenu.style.width = 64 + 'px'
        }else{
            this.$store.state.collapse = false
            this.$refs.pageMenu.style.width = 200 + 'px'
        }
      }
    },
    mounted () {
        this.onSelecte(this.$route.path)
    }
}
</script>

<style scoped lang="scss">  
.content {
    display: flex;
    .pageMenu {
        width: 64px;
        height: 100vh;
        background: #2265ac;
        transition: width .2s;
        box-sizing: border-box;
    }
    .item-page {
        flex: 1;
        background: #f5f5f5;
    }
}
.el-submenu__title i, .el-menu-item i{
    color: #fff;
}
/deep/.el-menu {
    border: none;
}   
</style>