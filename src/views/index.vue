<template>
<div class='wrap'>
    <div class="search">
        <el-input class="search-input" @input="filters" v-model="modelName" size="small" placeholder="搜索"></el-input>
    </div>
    <div class="list-product">
        <div class="title">我的组态</div>
        <ul class="list">
            <li v-for=" (item, index) of modelList" :key="index"> 
                <div>
                    <!-- <img @click="previewModel(item)" :src="item.icon" alt="" srcset=""> -->
                    <el-image
                    class="item"
                    @click="previewModel(item)"
                    :src="item.icon"
                    fit="cover"></el-image>
                    <div class="name">{{item.name}}</div>
                    <div class="option">
                        <button class="primary">发布</button>
                        <button @click.stop="editModel(item)" class="primary">编辑</button>
                        <button @click.stop="previewModel(item)" class="primary">预览</button>
                        <button class="danger">删除</button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
    data () {
        return {
            modelName: '',
            allModelList: [
                {name: '大屏展示', url: './json/View2d_data_48510781.json', icon: require('@/assets/img/0.png')},
                {name: '大屏布局', url: './json/View2d_data_14490622.json', icon: require('@/assets/img/1.png')},
                {name: '动态', url: './json/View2d_data_48227133.json', icon: require('@/assets/img/2.png')},
                {name: '在线监测大屏', url: './json/View2d_data_90474530.json', icon: require('@/assets/img/3.png')},
                {name: '水循环系统', url: './json/View2d_data_79261988.json', icon: require('@/assets/img/4.png')},
                {name: '多组系统展示', url: './json/View2d_data_31589026.json', icon: require('@/assets/img/5.png')},
            ],
            modelList: []
        }
    },
    methods: {
        filters () {
            if(this.modelName) {
                this.modelList = this.allModelList.filter( item => item.name.indexOf(this.modelName) != -1);
            }else{
                this.modelList = [...this.allModelList]
            }
        },
        async previewModel(item) {
            const data = await axios.get(item.url)
            this.$store.commit('addView', data)
            let pageData = JSON.stringify(data)
            this.$router.push({name:'preview', params:{pageData}})
        },
        async editModel(item) {
            const data = await axios.get(item.url)
            this.$store.commit('addView', data)
            let pageData = JSON.stringify(data)
            this.$router.push({name:'workspace', params:{pageData}})
        }
    },
    mounted () {
        this.modelList = [...this.allModelList]
    }
}
</script>

<style lang="scss" scoped>
    .wrap {
        height: 100vh;
        box-sizing: border-box;
        .search {
            display: flex;
            justify-content: flex-start;
            background-image: linear-gradient(45deg,#2265ac,#29c4ce);
            align-items: center;
            border-bottom: 2px solid #409EFF;
            padding: 12px;
            .search-input {
                width: 200px;
                margin-right: 20px;
            }
        } 
        .list-product {
            padding-left: 20px;
            .title {
                font-size: 16px;
                font-weight: 600;
                color: #409EFF;
            }
            .list {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
                flex-wrap: wrap;
                overflow: auto;
                padding-bottom: 30px;
                li {
                    padding: 10px;
                    height: 230px;
                    >div {
                        padding: 2px;
                        width: 200px;
                        height: 100%;
                        box-shadow: 5px 10px 50px #ccc;
                        .item {
                            width: 100%;
                            height: 150px;
                        }
                        .name {
                            font-size: 16px;
                            text-align: center;
                            color: #409EFF;
                        }
                        .option {
                            padding-top: 5px;
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: space-around;
                            .primary ,.danger {
                                font-size: 12px !important;
                                border: none;
                                color: #eee;
                                border-radius: 4px;
                                padding: 5px;
                                cursor: pointer;
                            }
                            .primary {
                                background: #409EFF;
                            }
                            .danger {
                                background: orangered;
                            }
                        }
                    }
                }
            }
        }
    }
    
</style>