<template>
  <div class="page" :style="'width:'+ width">
    <div class="headTool">
      <home-header @change="changeSceneScale"></home-header>
    </div>
    <!-- 组件工具 -->
    <div class="tools">
      <div style="width: 100%">
        <el-collapse v-model="activeName" style="width: 100%">
          <el-collapse-item 
          v-for="(val, index) in tools" 
          :key="index" 
          :title="val.title+'('+ val.data.length + ')'" 
          :name="index">
            <div style="display: flex; flex-wrap: wrap;">
              <div class="item" 
              @dragstart="onDrag($event, item.node)" 
              :draggable="true" v-for="(item, index) in val.data" 
              :key="index">
                <img width="35" height="35" :src="item.icon" alt="" srcset="">
              </div> 
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div id="view2d-canvas" 
    @click="onClickBlank" 
    @drop="getData" 
    @dragover.prevent 
    class="full" 
    @contextmenu="onContextMenu($event)">
      <!-- 右键点击菜单 -->
      <div class="context-menu" v-if="contextmenu.left" :style="this.contextmenu">
        <CanvasContextMenu 
        @closeMenu="contextmenu.left = null" 
        @update="updateNode"
        :Node.sync="Node" 
        :scene="scene" ></CanvasContextMenu>
      </div>
    </div>
    <!-- 右侧菜单 -->
    <div class="props" :style="props.expand ? 'overflow: visible' : ''">
      <CanvasProps :Node="Node" :name.sync="topoName" @change="onUpdateProps"></CanvasProps>
    </div>
    <!-- 创建组态 -->
    <el-dialog
        title="新建组态"
        :visible.sync="topoShow"
        width="25%">
        <div class="topoName">
          <span class="nameLabel">组态名称：</span>
          <el-input v-model="topoName" placeholder="请输入设备组名称" size="small"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="topoShow = false">取消</el-button>
            <el-button type="primary" @click="onCreateTopo">确定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import View2d from '@/static/js/view2d'
import { Pens, Tools, Flow, LargeScreens, Echarts } from '@/static/js/tools'
import CanvasProps from '@/components/CanvasProps'
import CanvasContextMenu from '@/components/CanvasContextMenu'
import HomeHeader from '@/components/header'
import '@/assets/css/base.scss'
import axios from 'axios'

export default {
  data() {
    return {
      tools: [Pens,Tools,Flow,LargeScreens,Echarts],
      activeName: [0,1,2],
      animationId: null,
      canvas: null,
      scene: null,
      topoShow: false,
      topoName: '1231',
      darwLine: false,
      props: {
        node: null,
        line: null,
        nodes: null,
        multi: false,
        expand: false,
        locked: false
      },
      Node: null,
      contextmenu: {
        left: null,
        top: null,
        bottom: null
      },
      lastTime: 0
    }
  },
  components: {
    CanvasProps,
    CanvasContextMenu,
    HomeHeader
  },
  computed: {
    width() {
        return this.$store.state.collapse ? 'calc(100vw)': 'calc(100vw)'
    },
    event() {
      return this.$store.state.event
    },
    bkImage () {
      return this.$store.state.data.bkImage
    },
    bkColor () {
      return this.$store.state.data.bkColor
    },
    grid () {
      return this.$store.state.data.grid
    },
    websocket () {
      return this.$store.state.resetLink.count
    },
    changeNode() {
      return View2d.activeNode.name
    }
  },
  watch: {
    'scene.scaleVal'(newVal) {
      this.$store.commit('dataScale', newVal.x)
    },
    event(newVal) {
      if (this['handle_' + newVal.name]) {
        // const data = {
        //     baseLine: View2d.baseLine,
        //     grid: View2d.grid,
        //     background: View2d.background,
        //     nodes: View2d.nodes
        // }
        const data = View2d.getData()
        this['handle_' + newVal.name](data)
      }
    },
    grid(newVal) {
      View2d.grid.show = newVal
    },
    bkImage(newVal) {
      View2d.background.image = newVal
    },
    bkColor(newVal) {
      View2d.background.color = newVal
    },
    websocket() {
      if(this.$store.state.data.websocket) {
          // this.canvas.openSocket(this.$store.state.data.websocket)
          this.canvas.data.websocket = this.$store.state.data.websocket
          this.canvas.render()
      }
    },
    $route(val) {
      this.open()
    }
  },
  created() {
    this.$store.commit('changeGrid', View2d.grid.show)
    this.$store.commit('changeBkColor', View2d.background.color)
    this.$store.commit('changeBkImage', View2d.background.image)
  },
  methods: {
    onDrag(event, node) {
      event.dataTransfer.setData('shape', JSON.stringify(node))
    },
    getData() {
        try {
            var json = event.dataTransfer.getData('shape');
            let data = JSON.parse(json)
            data.position = {x: event.offsetX, y: event.offsetY}
            this.createNode(data)
            event.preventDefault();
        }
        catch (_a) { }
    },
    changeSceneScale(type) {
      if(type == 'resize') {
        this.scene.scale(this.scene.position,1,1)
      }else{
        this.scene.resize()
      }
    },
    initScene(data) {
        this.data = this.$store.state.viewData;
        this.scene = new View2d.scene('#view2d-canvas', data)
    },
    animation() {
        this.scene.update()
        this.lastTime = new Date().getTime()
        this.animationId = requestAnimationFrame(this.animation)
    },
    createNode(data) {
      let _this = this
      let node = new View2d.Node(data)
      this.scene.add(node)
      // node.on('hover', function() {
      //   this.color[0] = 'red'
      // }, function(){
      //   this.color[0] = 'green'
      // })
      // console.log(node)
      this.darwLine = false
    },
    updateNode(node) {
      this.Node = node
      View2d.activeNode.helperBox = false
      View2d.activeNode = this.Node
      View2d.activeNode.helperBox = true
    },
    onClickBlank() {
       this.Node = View2d.activeNode
       this.contextmenu.left = null
    },
    getLocked(data) {
      let locked = true
      if (data.nodes && data.nodes.length) {
        for (const item of data.nodes) {
          if (!item.locked) {
            locked = false
            break
          }
        }
      }
      if (locked && data.lines) {
        for (const item of data.lines) {
          if (!item.locked) {
            locked = false
            break
          }
        }
      }
      return locked
    },
    onUpdateProps(node) {
      // 如果是node属性改变，需要传入node，重新计算node相关属性值
      // 如果是line属性改变，无需传参
      this.canvas.updateProps(node)
    },
    handle_new(data) {
      this.canvas.open({ nodes: [], lines: [] })
    },

    handle_open(data) {
      this.handle_replace(data)
    },

    handle_replace(data) {
      const input = document.createElement('input')
      input.type = 'file'
      input.onchange = event => {
        const elem = event.srcElement || event.target
        if (elem.files && elem.files[0]) {
          const name = elem.files[0].name.replace('.json', '')
          const reader = new FileReader()
          reader.onload = e => {
            const text = e.target.result + ''
            try {
              const data = JSON.parse(text)
              if (
                data &&
                Array.isArray(data.pens)
              ) {
                this.canvas.open(data)
              }
            } catch (e) {
              return false
            }
          }
          reader.readAsText(elem.files[0])
        }
      }
      input.click()
    },

    handle_save() {
      View2d.save()
    },

    handle_savePng(data) {
      View2d.saveAsImage()
    },

    handle_saveSvg(data) {
      const ctx = new C2S(this.canvas.canvas.width + 200, this.canvas.canvas.height + 200)
      // for (const item of this.canvas.data.nodes) {
      //   item.render(ctx)
      // }
      // for (const item of this.canvas.data.lines) {
      //   item.render(ctx)
      // }
      let mySerializedSVG = ctx.getSerializedSvg()
      mySerializedSVG = mySerializedSVG.replace(
        '<defs/>',
        `<defs>
    <style type="text/css">
      @font-face {
        font-family: 'topology';
        src: url('http://at.alicdn.com/t/font_1331132_h688rvffmbc.ttf?t=1569311680797') format('truetype');
      }
    </style>
    </defs>`
      )
      mySerializedSVG = mySerializedSVG.replace(/--le5le--/g, '&#x')

      const urlObject = window.URL || window
      const export_blob = new Blob([mySerializedSVG])
      const url = urlObject.createObjectURL(export_blob)

      const a = document.createElement('a')
      a.setAttribute('download', this.$store.state.file.name + '.svg')
      a.setAttribute('href', url)
      const evt = document.createEvent('MouseEvents')
      evt.initEvent('click', true, true)
      a.dispatchEvent(evt)
    },

    handle_undo(data) {
      this.canvas.undo()
    },

    handle_redo(data) {
      console.log(87)
    },

    handle_copy(data) {
      this.canvas.activeLayer.pens = this.copyNode()
      this.canvas.copy()
    },
    copyNode() {
      var that = this.canvas;
      let selectedObj = deepCopy(this.canvas.activeLayer.pens);
      that.clipboard = [];
      let pens = [];
      selectedObj.forEach( item => {
        let a = this.Node.cloneState(item);
        pens.push(a)
      })
      return pens
      function deepCopy(obj) {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object' && obj[key]!==null) {
              result[key] = deepCopy(obj[key]);   //递归复制
            } else {
              result[key] = obj[key];
            }
          }
        }
        return result
      }
    },
    handle_cut(data) {
      this.canvas.cut()
    },

    handle_paste(data) {
      this.canvas.paste()
    },

    handle_state(data) {
      this.canvas.data[data.key] = data.value
      this.$store.commit('change', {
        scale: this.canvas.data.scale || 1,
        lineName: this.canvas.data.lineName,
        fromArrowType: this.canvas.data.fromArrowType,
        toArrowType: this.canvas.data.toArrowType,
        fromArrowlockedType: this.canvas.data.locked,
        bkColor: this.canvas.data.bkColor,
        bkImage: this.canvas.data.bkImage,
        gird: this.canvas.data.gird || true,
        websocket: this.canvas.data.websocket
      })
    },

    handle_show(data) {
      this.$store.commit('addView', data)
      let pageData = JSON.stringify(data)
      this.$router.push({name:'preview', params:{pageData}})
    },
    onContextMenu(event) {
      event.preventDefault()
      event.stopPropagation()
      if(View2d.activeNode !== null) {
        this.Node = View2d.activeNode
        if (event.clientY + 360 < document.body.clientHeight) {
          this.contextmenu = {
            left: event.clientX + 'px',
            top: event.clientY + 'px'
          }
        } else {
          this.contextmenu = {
            left: event.clientX + 'px',
            bottom: document.body.clientHeight - event.clientY + 'px'
          }
        }
      }else{
        this.contextmenu = {
          left: null,
          top: null
        }
      }
    },
    onCreateTopo () {
      this.topoShow = false
      this.$store.commit('changeFileName', this.topoName);
    },
    async getJsonData() {
      const data = await axios.get('./json/View2d_data_48227133.json')
    }
  },
  mounted() {
      let data = this.$store.state.viewData
      this.initScene(data)
      this.animation()
      window.onresize = this.scene.resize
  },
  destroyed() {
    cancelAnimationFrame(this.animationId)
  },
  // beforeRouteEnter (to, from, next) {
  //   next( vm => {
  //     if(!vm.$store.state.file.name){
  //        vm.topoShow = true
  //     }else{
  //       vm.topoName = vm.$store.state.file.name
  //     }
  //   })
  // }
}
</script>

<style lang="scss">
.page {
  display: flex;
  padding-top: 40px;
  height: 100vh;
  box-sizing: border-box;
  position: relative;
  .headTool {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    z-index: 99;
  }
  .tools {
    flex-shrink: 0;
    width: 220px;
    background-image: linear-gradient(45deg,#29c4ce, #2265ac);
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 2.5px;
    .item {
      width: 50px;
      height: 50px;
      margin: 2.5px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      background-color: #f8f8f8;
      cursor: pointer;
      > p {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .full {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #fff;
  }
  .props {
    flex-shrink: 0;
    width: 2.8rem;
    padding: 0 0.05rem;
    box-sizing: border-box;
    background-image: linear-gradient(45deg,#29c4ce, #2265ac);
    color: #fff;
    overflow-y: auto;
    position: relative;
  }
  .context-menu {
    position: fixed;
    z-index: 9999;
  }
  .topoName {
    display: flex;
    .nameLabel {
       width: 110px;
    }
  }
}
.el-collapse-item__content {
  padding-bottom: 5px !important;
}
.el-collapse-item__wrap, .el-collapse-item__header {
  color: #fff !important;
  background-color: rgba(0, 0, 0, 0) !important;
}
.el-collapse {
  border: none !important;
}
</style>
