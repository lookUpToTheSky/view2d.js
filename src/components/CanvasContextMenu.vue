<template>
  <div class="menus" @click="$emit('closeMenu')">
    <div>
      <a :class="{disabled: Node.freeze}" @click="onTop()">置顶</a>
    </div>
    <div>
      <a :class="{disabled: Node.freeze}" @click="onBottom()">置底</a>
    </div>
    <div class="line"></div>
    <div>
      <a @click="Node.freeze = !Node.freeze">{{ Node.freeze ? '解冻' : '冻结' }}</a>
    </div>
    <div>
      <a :class="{disabled: Node.freeze}" @click="del()">删除</a>
    </div>
    <div v-show="Node.type!=='node'" class="line"></div>
    <div v-show="Node.type!=='node'">
      <a :class="{disabled: Node.freeze}" @click="onCombine()">{{Node.type == 'extraGroup' ? '组合' : '取消组合'}}</a>
    </div>
    <div class="line"></div>
    <div>
      <a :class="{disabled: Node.freeze}" @click="clone()" class="flex">
        <span class="full">克隆</span>
      </a>
    </div>
    <!-- <div>
      <a :class="{disabled: Node.freeze}" @click="scene.undo()" class="flex">
        <span class="full">撤消</span>
      </a>
    </div>
    <div>
      <a :class="{disabled: Node.freeze}" @click="reset()"> 
        恢复
      </a>
    </div> -->
    <!-- <div class="line"></div>
    <div>
      <a :class="{disabled: Node.freeze}" @click="scene.cut()" class="flex">
        <span class="full">剪切</span>
      </a>
    </div>
    <div>
      <a :class="{disabled: Node.freeze}" @click="onCopy" class="flex">
        <span class="full">复制</span>
      </a>
    </div>
    <div>
      <a :class="{disabled: Node.freeze}" @click="scene.paste()" class="flex">
        <span class="full">粘贴</span>
      </a>
    </div>
    <div class="line"></div>
    <div>
      <a :class="{disabled: Node.freeze}" @click="onCopyImage" class="flex">
        <span class="full">复制节点图片地址</span>
      </a>
    </div> -->
  </div>
</template>

<script >

export default {
  data() {
    return {}
  },
  props: {
    scene: {
      type: Object,
      require: true
    },
    Node: {
      type: Object,
      require: true
    }
  },
  methods: {
    onTop() {
      let max_zIndex = this.scene.children.sort((a,b) => b.zIndex - a.zIndex)[0].zIndex
      this.Node.zIndex = max_zIndex + 1
    },
    onBottom() {
      let min_zIndex = this.scene.children.sort((a,b) => a.zIndex - b.zIndex)[0].zIndex
      this.Node.zIndex = min_zIndex - 1
    },
    del() {
      this.scene.remove(this.Node)
    },
    clone() {
      let cloneNode = this.Node.clone()
      let {x, y} = cloneNode.position
      this.scene.add(cloneNode)
      cloneNode.translate({x: x + 10, y: y + 10})
      this.$emit("update", cloneNode)
    },
    onCombine() {
      if(this.Node.type == 'extraGroup') {
        this.Node.combine()
      }else{
        this.Node.unCombine()
      }
    },
    onCopyImage () {
      this.scene.toImage({

      })
    }
  }
}
</script>

<style lang="scss">
.menus {
  color: #000;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  min-width: 1.8rem;
  text-align: left;
  padding: 0.08rem 0;

  & > div {
    line-height: 2.2;
    a {
      color: #314659;
      display: block;
      padding: 0 0.2rem;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        color: #1890ff;
      }

      &.flex {
        display: flex;
      }

      &.disabled {
        color: #ccc;
        cursor: default;
        pointer-events: none;
      }
    }
  }

  .line {
    background-color: transparent !important;
    padding: 0;
    margin: 0.05rem 0;
    border-top: 1px solid #eee;
  }
}
</style>
