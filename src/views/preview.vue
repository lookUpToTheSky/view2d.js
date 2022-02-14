<template>
<div class='wrap'>
    <el-button @click="$router.go(-1)" type="primary" class="back" size="small">返回</el-button>
    <div id="topology-canvas"></div>
    <div class="previewType">
        <el-button @click="setSize(false)" :type="autoSize ? '': 'primary'" size="small">默认</el-button>
        <el-button @click="setSize(true)" :type="autoSize ? 'primary': ''" size="small">自适应</el-button>
    </div>
</div>
</template>

<script>
import { Notification } from 'element-ui';
import View2d from '@/static/js/view2d'
export default {
    name: 'preview',
    data () {
        return {
            data: null,
            canvasOptions: {},
            canvas: null,
            scene: null,
            autoSize: true,
            animationId: null
        }
    },
    beforeRouteEnter (to, from, next) { 
        if(!to.params.pageData) {
            next(vm => {
                vm.$router.push('/')
            })
        }else{
            let data = JSON.parse(to.params.pageData)
            if(Object.keys(data).length <= 0) {
                Notification({
                    title: '提示',
                    message: '没有创建视图, 无法预览！',
                    type: 'warning',
                    duration: 2000
                })
            }else{
                next();
            }    
        }
    },
    methods: {
        onMessage(event, data) {
            switch (event) {
                case 'dblclick': console.log(88);
                    break;
            }
        },
        async onLinkAPI (node, item) {
            let params = !item.pramas? {} : eval("(" + item.pramas + ")")
            let res = null
            if(item.method == 'get') {
                res = await this.$axios.get(item.url, { params })
            }else{
                res = await this.$axios.post(item.url, params)
            }
            node.data = JSON.stringify(res);
            if(item.bindValue) {
                node.text = JSON.stringify(eval('JSON.parse(node.data).' + item.bindValue));
            }
            this.canvas.updateProps(node);
        },
        resizeRect() {
            let rect = this.canvas.getRect();
            this.canvas.translate((window.innerWidth - rect.width )/2 - rect.x, (window.innerHeight - rect.height)/2 - rect.y);
        },
        findHttp () {
            if(!this.data.pens) return 
            let temp = [];
            let APINode = [];
            this.data.pens.forEach((element) => {
                temp = element.events.filter( item => item.type == 200)
                if(temp.length > 0) {
                    APINode.push({node: element, httpOption: temp})
                }
            });
            APINode.forEach(item => {
                this.onLinkAPI(item.node, item.httpOption[0])
            })
        },
        setSize(auto) {
            this.autoSize = auto
            if(!auto) {
                this.scene.scale(this.scene.position,1,1)
            }else{
                this.scene.resize()
            }
        },
        animation() {
            this.scene.update()
            this.animationId = requestAnimationFrame(this.animation)
        },
    },
    mounted () {
        this.data = this.$store.state.viewData;
        View2d.mode.type = 'preview'
        View2d.lock = true
        this.scene = new View2d.scene('#topology-canvas', this.data)
        this.animation()
        window.onresize = this.scene.resize
    },
    destroyed() {
        cancelAnimationFrame(this.animationId)
        View2d.lock = false
        View2d.mode.type = 'edit'
    }
}
</script>
<style lang="scss" scoped>
#topology-canvas {
    background: #f5f5f5;
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
}

.back {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 8888;
}
.previewType {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 8888;
}
</style>