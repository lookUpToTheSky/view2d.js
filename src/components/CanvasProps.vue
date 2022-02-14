<template>
  <div>
    <!-- 选中为空 -->
    <div v-if="!Node">
      <div class="title">基本设置</div>
      <div class="ph20 flex mt10">
        <label class="mr5">图文名称:</label>
        <el-input
          v-model="fileName"
          @change="onChangeFileName"
          size="small"
        ></el-input>
      </div>
      <div class="ph20 flex mt10">
        <label class="mr5">背景颜色:</label>
        <el-input
          v-model="bgColor"
          @change="onChangeColor"
          size="small"
        ></el-input>
        <el-color-picker v-model="bgColor" @change="onChangeColor" size="small"></el-color-picker>
      </div>
      <div class="ph20 flex mt10">
        <label class="mr5">背景图片:</label>
        <el-button type="info" @click.stop="chooseBgImg = true" size="mini" plain round>
          <i class="el-icon-picture-outline"></i>
        </el-button>
        <el-button type="danger" @click="onDeleBgImg" icon="el-icon-delete" size="mini" circle></el-button>
        <el-dialog title="选择背景图片" :visible.sync="chooseBgImg">
          <div class="bgImg">
            <div class="bgImgItem" @click="onSelectedImg(i)" v-for="(item, i) in bgList" :key="i">
              <el-image
              style="height: 160px"
              :src="item.url"
              fit="cover"></el-image>
              <span>{{item.name}}</span>
            </div>
          </div>
        </el-dialog>
      </div>
      <div class="ph20 flex mt10">
        <label class="mr5">背景网格:</label>
        <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-colori="#ccc"
          @change="changeGrid"
          :active-value="true"
          :inactive-value="false">
        </el-switch>
      </div>
    </div>
    <!-- 选中节点 -->
    <div v-else>
      <el-tabs v-model="activeName" :stretch="true" @tab-click="initData">
        <el-tab-pane label="显示设置" name="first">  
          <div class="itemBox">
            <div v-if="Node.type == 'node'">
              <div class="title">背景和边框</div>
              <div class="items flex column">
                <div class="flex middle mb5">
                  <label class="ml5 mr5" for="">绘制方式:</label>
                  <el-select v-model="Node.drawType" placeholder="请选择" size="small">
                    <el-option
                      v-for="item in [{label: '填充', value: 'fill'},{label: '轮廓', value: 'stroke'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </div>

                <div class="flex middle mb5" style="flex-wrap: wrap">
                  <label class="ml5 mr5" for="">背景颜色:</label>
                  <el-popover
                    placement="bottom"
                    width="230"
                    v-model="showSelectedColor[i]" 
                    @show="openSelected(i)"
                    v-for="(val, i) in Node.color" :key="i">
                    
                    <div class="flex middle mb5">
                      <label class="ml5 mr5" for="">背景类型:</label>
                      <el-select @change="selectedType(i)" v-model="backgroundType" placeholder="请选择" size="small">
                        <el-option
                          v-for="item in [{label: '单色背景', value: 0},{label: '线性渐变背景', value: 1},{label: '径向渐变背景', value: 2}]"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                    <div v-show="backgroundType == 0" class="flex middle mb5" v-if="typeof val == 'string' && showSelectedColor[i]">
                      <label class="ml5 mr5" for="">背景颜色:</label>
                      <el-color-picker show-alpha v-model="Node.color[i]" @change="onChangeColor" size="small"></el-color-picker>
                    </div>
                    <div v-show="backgroundType !== 0"  v-if="typeof val == 'object' && showSelectedColor[i]">
                        <div class="flex middle">
                        <span>渐变分向：</span>
                        <el-select v-if="backgroundType == 1" style="width: 140px" v-model="Node.color[i].direction" placeholder="请选择" size="small">
                          <el-option
                            v-for="item in [
                            {label: '水平渐变', value: 'to right'},{label: '垂直渐变', value: 'to bottom'},
                            {label: '左上到右下', value: '135deg'},{label: '左下到右上', value: '45deg'}
                            ]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>

                        <el-select v-else style="width: 140px" v-model="Node.color[i].direction" placeholder="请选择" size="small">
                          <el-option
                            v-for="item in [
                            {label: '中心渐变', value: 'center'},
                            {label: '顶部渐变', value: 'top'},
                            {label: '底部渐变', value: 'bottom'},
                            {label: '左侧渐变', value: 'left'},
                            {label: '右侧渐变', value: 'right'},
                            ]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>

                      </div>
                      <div class="flex middle">
                        <span>开始颜色：</span>
                        <el-color-picker show-alpha v-model="Node.color[i].gradient[0]" size="small"></el-color-picker>
                        <span>结束颜色：</span>
                        <el-color-picker show-alpha v-model="Node.color[i].gradient[1]" size="small"></el-color-picker>
                      </div>
                    </div>
                    
                    <span v-if="typeof val == 'string'" class="color-ball" slot="reference" :style="'background:' + val"></span>
                    <span v-if="typeof val == 'object' && val.type == 'linear'" class="color-ball" slot="reference" 
                    :style="'background:' + val.type + '-gradient('+val.direction +',' + val.gradient[0]+','+val.gradient[1]"></span>
                    <span v-if="typeof val == 'object' && val.type == 'radial'" class="color-ball" slot="reference" 
                      :style="'background:' + val.type + '-gradient('+ val.gradient[0]+','+val.gradient[1]"></span>
                    </el-popover>
                </div>
                <div class="flex middle mb5">
                  <label class="ml5 mr5" for="">边框显示:</label>
                  <el-switch
                    v-model="Node.border.show"
                    active-color="#13ce66"
                    inactive-colori="#ccc"
                    :active-value="true"
                    :inactive-value="false">
                  </el-switch>
                </div>
                <div v-show="Node.border.show">

                  <div class="flex middle mb5">
                    <label class="ml5 mr5" for="">边框颜色:</label>
                    <el-color-picker show-alpha v-model="Node.border.color" size="small"></el-color-picker>
                  </div> 

                  <div class="flex middle mb5">
                    <label class="ml5 mr5" for="">边框宽度:</label>
                    <el-input-number :min="1" style="flex: 1" controls-position="right" v-model="Node.border.lineWidth" size="small"></el-input-number>
                  </div>

                  <div class="flex middle mb5">
                    <label class="ml5 mr5" for="">线条样式:</label>
                    <el-select @change="lineDashChange" v-model="lineDash" placeholder="请选择" size="small">
                      <el-option
                        v-for="item in lineOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                
                <div class="flex middle mb5">
                  <label class="ml5 mr5" for="">阴影颜色:</label>
                  <el-color-picker show-alpha v-model="Node.shadowColor" size="small"></el-color-picker>
                </div>

                <div class="flex middle mb5">
                  <label class="ml5 mr5" for="">阴影大小:</label>
                  <el-input-number :min="0" style="flex: 1" controls-position="right" v-model="Node.shadowBlur" size="small"></el-input-number>
                </div>

                <div class="flex middle mb5">
                  <label class="ml5 mr5" for="">阴影X偏移:</label>
                  <el-input-number style="flex: 1" controls-position="right" v-model="Node.shadowOffsetX" size="small"></el-input-number>
                </div>
                
                <div class="flex middle mb5">
                  <label class="ml5 mr5" for="">阴影Y偏移:</label>
                  <el-input-number style="flex: 1" controls-position="right" v-model="Node.shadowOffsetY" size="small"></el-input-number>
                </div>
              </div>
            </div>
            <div v-if="Node.type !== 'line'">
              <div class="title">位置和变换</div>
              <div class="flex column mt5 mb5">
                <div class="flex middle mb5">
                  <label class="ml5 mr5" for="">X坐标:</label>
                  <el-input-number style="flex: 1" controls-position="right" @change="Node.translate(position)" v-model="position.x" size="small"></el-input-number>
                </div>
                <div class="flex middle mb5">
                  <label class="ml5 mr5" for="">Y坐标:</label>
                  <el-input-number style="flex: 1" controls-position="right" @change="Node.translate(position)" v-model="position.y" size="small"></el-input-number>
                </div>
                <div class="flex middle mb5">
                  <label class="ml5 mr5" for="">X缩放:</label>
                <el-input-number style="flex: 1" controls-position="right" :step="0.1" :min="0.1" @change="Node.scale(scaleVal.x, scaleVal.y)" v-model="scaleVal.x" size="small"></el-input-number>
                </div>
                <div class="flex middle mb5">
                  <label class="ml5 mr5" for="">Y缩放:</label>
                <el-input-number style="flex: 1" controls-position="right" :step="0.1" :min="0.1" @change="Node.scale(scaleVal.x, scaleVal.y)" v-model="scaleVal.y" size="small"></el-input-number>
                </div>
                <div class="flex middle mb5">
                  <label class="ml5 mr5" for="" v-html="'&ensp;旋转:'"></label>
                <el-input-number style="flex: 1" controls-position="right" @change="Node.rotate(rotateVal)" v-model="rotateVal" size="small"></el-input-number>
                </div>
              </div>
            </div>
          </div>
          <!-- 文本 -->
          <div class="itemBox" v-if="Node.type == 'node'">
            <div class="title">文本样式</div>
            <div class="flex column mt5 mb5">
              <div class="flex middle mb5">
                <label class="ml5 mr5" v-html="'内&emsp;&emsp;容:'" for=""></label>
                <el-input clearable style="flex: 1" v-model="Node.text.content" size="small"></el-input>
              </div>

              <div class="flex middle mb5" v-if="Node.src != undefined">
                <label class="ml5 mr5" v-html="'图片地址:'" for=""></label>
                <el-input clearable style="flex: 1" v-model="Node.src" size="small"></el-input>
              </div>

              <div class="flex middle mb5">
                  <label class="ml5 mr5" for="">字体颜色:</label>
                  <el-color-picker show-alpha v-model="Node.text.color" size="small"></el-color-picker>
                </div> 

              <div class="flex middle mb5">
                <label class="ml5 mr5" for="">字体大小:</label>
                <el-input-number :min="12" style="flex: 1" controls-position="right" v-model="Node.text.fontSize" size="small"></el-input-number>
              </div>
              
              <div class="flex middle mb5">
                <label class="ml5 mr5" for="">字体粗细:</label>
                <el-select class="select" v-model="Node.text.fontWeight" value-key="value" size="small" placeholder="选择设备组">
                  <el-option v-for="(item, i) of weightOption" :key="i" :value="item.value" :label="item.label"></el-option>
                </el-select>
              </div>
              <div class="flex middle mb5">
                <label class="ml5 mr5" for="">字体风格:</label>
                <el-select class="select" v-model="Node.text.fontStyle" value-key="value" size="small" placeholder="选择设备组">
                  <el-option v-for="(item, i) of fontStyleOption" :key="i" :value="item.value" :label="item.label"></el-option>
              </el-select>
              </div>

              <div class="flex middle mb5">
                <label class="ml5 mr5" for="">水平对齐:</label>
                <el-select class="select" v-model="Node.text.textAlign" value-key="value" size="small" placeholder="选择设备组">
                  <el-option v-for="(item, i) of textAlignOption" :key="i" :value="item.value" :label="item.label"></el-option>
              </el-select>
              </div>

              <div class="flex middle mb5">
                <label class="ml5 mr5" for="">垂直对齐:</label>
                <el-select class="select" v-model="Node.text.textVertical" value-key="value" size="small" placeholder="选择设备组">
                  <el-option v-for="(item, i) of textVerticalOption" :key="i" :value="item.value" :label="item.label"></el-option>
              </el-select>
              </div>

              <div class="flex middle mb5">
                <label class="ml5 mr5" for="">水平边距:</label>
                <el-input-number :min="0" style="flex: 1" controls-position="right" v-model="Node.text.padding[1]" size="small"></el-input-number>
              </div>

              <div class="flex middle mb5">
                <label class="ml5 mr5" for="">垂直边距:</label>
                <el-input-number :min="0" style="flex: 1" controls-position="right" v-model="Node.text.padding[0]" size="small"></el-input-number>
              </div>

            </div>
          </div>

          <div v-if="Node.type == 'line'">
            <div class="flex middle mb5" style="flex-wrap: wrap">
              <label class="ml5 mr5" for="">线条颜色:</label>
              <el-color-picker v-for="(val, i) in Node.color" :key="i" show-alpha v-model="Node.color[i]" size="small"></el-color-picker>
            </div> 

            <div class="flex middle mb5">
              <label class="ml5 mr5" for="">线条宽度:</label>
              <el-input-number :min="1" style="flex: 1" controls-position="right" v-model="Node.lineWidth" size="small"></el-input-number>
            </div>

            <div class="flex middle mb5">
              <label class="ml5 mr5" for="">线条样式:</label>
              <el-select @change="lineDashChange" v-model="lineDash" placeholder="请选择" size="small">
                <el-option
                  v-for="item in lineOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据连接" name="second">
          <div class="flex justify-around mt5 mb10">
            <label class="ml5">设备组:</label>
            <div class="flex mb10">
              <el-select class="select" v-model="equipment" value-key="value" size="small" placeholder="选择设备组">
                  <el-option v-for="(item, i) of group" :key="i" :value="item.equipmentList" :label="item.groupName"></el-option>
              </el-select>
            </div>
          </div>
          <div class="flex justify-around mt5 mb10">
            <label class="ml5">设备:</label>
            <div class="flex mb10">
              <el-select class="select" :disabled="!equipment.length" v-model="sensor" size="small" placeholder="请先选择设备组">
                  <el-option v-for="(item, i) of equipment" :key="i" :value="item.sensorList" :label="item.equipmentName"></el-option>
              </el-select>
            </div>
          </div>
          <div class="border-bottom flex justify-around mt5 mb10">
            <label class="ml5">传感器:</label>
            <div class="flex mb10">
              <el-select class="select" :disabled="!sensor.length" v-model="selectedSensor" size="small" placeholder="请先选择设备">
                  <el-option v-for="(item, i) of sensor" :key="i" :value="item.name" :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="flex justify-around mt10 mb10 ">
            <label class="ml5">类型设置:</label>
            <div class="flex mb10">
              <el-select class="select" v-model="selectedSensorType" @change="onSelectedSensor" size="small">
                  <el-option v-for="(item, i) of typeOption" :key="i" :value="item.value" :label="item.text"></el-option>
              </el-select>
            </div>
          </div>
          <div class="flex justify-around mt10 mb10">
            <el-button type="primary" style="width:100%" @click="onLinkSensor" size="small">确定连接</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="事件" name="third">
          <el-button @click="Node.events.push({params: {}})" style="width: 100%" type="primary" size="small">添加事件</el-button>
          <div class=" flex column" v-for="(item, i) in Node.events" :key="i">
            <h3 class="border-bottom pv10">
              <span class="mr15">事件</span>
              <el-button type="danger" icon="el-icon-delete" @click="Node.events.splice(i, 1)" size="mini" circle></el-button>
            </h3>
            <div class="mb10">
              <label>事件类型：</label>
              <el-select @change="onSelectEventDo(item, i)" v-model="item.events" size="mini">
                <el-option value="click" label="点击事件"></el-option>
                <el-option value="dblclick" label="双击事件"></el-option>
                <el-option value="hover" label="鼠标hover事件"></el-option>
              </el-select>
            </div>
            <!-- <div class="mb10 flex">
              <label>消息名称：</label>
              <el-input v-model="item.name" placeholder="消息名称" size="mini"></el-input>
            </div> -->
            <div class="mb10">
              <label>事件行为：</label>
              <el-select v-model="item.params.type" size="mini" @change="onSelectEventDo(item, i)">
                <el-option :value="0" label="打开链接"></el-option>
                <el-option :value="1" label="显示信息"></el-option>
                <el-option :value="2" label="执行自定义js代码"></el-option>
                <el-option :value="3" label="ajax异步请求"></el-option>
              </el-select>
            </div>
            <div class=" flex column mt10" v-if="item.params.type==3">
              <h3 class="ml5 mt5 mb10 border-bottom">自定义接口API</h3>
              <div>
                <label class="ml5 mt5 mb10">API地址:</label>
                <el-input
                  v-model="item.params.APIUrl"
                  placeholder="例如：http//www.xxxxx.com/api..."
                  size="small"
                  class="mb10"
                  @change="onSelectEventDo(item, i)"
                ></el-input>
              </div>
              <div>
                <label class="ml5 mt5 mb10">请求类型{{item.params.APIType}}:</label>
                <div class="flex mb10">
                  <el-select @change="onSelectEventDo(item, i)" v-model="item.params.APIType" size="small" class="mr5">
                    <el-option value="get" label="get"></el-option>
                    <el-option value="post" label="post"></el-option>
                  </el-select>
                </div>
              </div>
              <div>
                <label class="ml5 mt5 mb10">请求参数:</label>
                <div class="flex mb10">
                  <el-input @change="onSelectEventDo(item, i)" type="textArea" :rows="5" v-model="item.params.APIParams" placeholder="例如：{pmId: 10}" size="small" class="mr5"></el-input>
                  <el-button type="primary" size="mini" @click="onLinkAPI(Node, item)">查看接口数据</el-button>
                </div>
              </div>
              <div v-if="Node.data">
              </div>
              <div>
                <label class="ml5 mt5 mb10">绑定哪个字段:</label>
                <div class="flex gird">
                  <el-input @change="onSelectEventDo(item, i)" v-model="item.params.bindValue" class="mr5" placeholder="例如：data.name" size="small"></el-input>
                  <!-- <el-button type="primary" size="mini" @click="onBindAPI">绑定</el-button> -->
                </div>
              </div>
            </div>
            <div v-else-if="item.params.type!==1">
              <div class="mb10">
                <label v-if="item.params.type == 0">链接地址：</label>
                <label v-if="item.params.type == 2">自定js代码：</label>
                <el-input
                  type="textarea"
                  v-model="item.params.value"
                  @change="onSelectEventDo(item, i)"
                  :rows="(item.params.type == 2||item.params.type == 3) ? 15 : 1"
                  class="mb5" 
                ></el-input>
              </div>
              <!-- <div style="float: right">
                <el-button type="primary" size="mini" @click="addEvents">确定</el-button>
              </div> -->
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script >
import { Notification } from 'element-ui';
export default {
  data() {
    return {
      events: {
        type: 0,
        action: 0,
        value: '',
        params: '',
        APIType: 'get',
        bindValue: '',
      },
      group: [],
      equipment: [],
      sensor: [],
      backgroundType: 0,
      selectedSensor: null,
      showSelectedColor: [],
      drawType: 'fill',
      typeOption: [{value: 1, text: '开关'}, {value: 2, text: '文本信息'}, {value: 3, text: '状态显示'}],
      selectedSensorType: '',
      showData: null,
      animation: null,
      resData: null,
      textName: 'ptName',
      data: null,
      nodeId: null,
      nodeData: '',
      lineDash: 0,
      bgColor: "透明",
      activeName: 'first',
      nodeIsJson: false,
      chooseBgImg: false,
      position: {},
      scaleVal: {},
      rotateVal: 0,
      value: false,
      webscoketOption: {
        url:'ws://111.231.106.94:8088/websocket/25',
        animate: false,
        showInfo: false 
      },
      lineOption: [
        {label: '—————', value: 0},
        {label: '------------', value: 1},
        {label: '- - - - - - -', value: 2},
        {label: '- · - · - · - ·', value: 3},
      ],
      weightOption: [
        {label: '正常', value: 'normal'},
        {label: '加粗', value: 'bolder'},
      ],
      fontStyleOption:[
        {label: '正常', value: 'normal'},
        {label: '倾斜', value: 'italic'}
      ],
      textAlignOption: [
        {label: '居左', value: 'left'},
        {label: '居中', value: 'center'},
        {label: '居右', value: 'right'}
      ],
      textVerticalOption: [
        {label: '居顶', value: 'top'},
        {label: '居中', value: 'center'},
        {label: '居底', value: 'bottom'}
      ],
      APIUrl:'https://yun.kexsci.com/yun/api/echart/countProjectStatus',
      APIType: 'get',
      APIParams: '',
      bindValue: '',
      fileName: '',
      bgList:[
      {url:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3156148005,3827021055&fm=26&gp=0.jpg', name:'背景1'},
      {url:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1898783846,176692612&fm=26&gp=0.jpg', name: '背景2'},
      {url:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1242645534,4182724318&fm=26&gp=0.jpg', name: '背景3'},
      {url:'./img/star.jpg', name: '背景4'},
      {url:'./img/star1.jpg', name: '背景5'},
      {url:'./img/sky.jpg', name: '背景6'}
      ]
    }
  },
  props: {
    name: {
      type: String,
      default: 'kx-topo'
    },
    Node: {
      type: Object,
      require: true
    }
  },
  updated() {
  },
  watch: {
    name() {
      this.fileName = this.name
    },
    Node: {
      handler() {
        if(this.Node !== null) {
          this.position = {...this.Node.position}
          this.scaleVal = {...this.Node.scaleVal}
          this.rotateVal = this.Node.rotateVal
        }
      },  
      deep: true
    },
    'Node.ID'() {
      if(!this.Node) return false
      this.drawType = this.Node.drawType
      let lineDash = null
      if(this.Node.type == 'node') {
        lineDash = JSON.stringify(this.Node.border.lineDash)
      }else{
        lineDash = JSON.stringify(this.Node.lineDash) 
      }
      switch(lineDash) {
        case '[0,0]': this.lineDash = 0;
          break;
        case '[5,5]': this.lineDash = 1;
          break;
        case '[5,10]': this.lineDash = 2;
        break;
          case '[5,5,1,5]': this.lineDash = 3;
        break;
      }
    }
  },
  methods: {
    onchangePos() {
      this.Node.translate(this.position)
    },
    onSelectedSensor () {
      // console.log(this.selectedSensor)
    },
    openSelected(i) {
      if(typeof this.Node.color[i] == 'object'){
        this.backgroundType = this.Node.color[i].type == 'linear' ? 1 : 2
        this.Node.color[i] = {
          type: this.Node.color[i].type,
          direction: this.Node.color[i].direction, 
          gradient: [this.Node.color[i].gradient[0], this.Node.color[i].gradient[1]]
        }
      }else{
        this.backgroundType = 0
      }
    },
    selectedType(i) {
      if(this.backgroundType != 0) {
        let type = this.backgroundType == 1 ? 'linear' : 'radial'
        let direction = this.backgroundType == 1 ? 'to right' : 'center'
        this.$set(this.Node.color, i, {type, direction, gradient: ['#ff00ff', '#adccff']})
      }else{
        this.$set(this.Node.color, i,'#2cafe7')
      }
    },
    onLinkSensor () {
      if(!this.selectedSensor) {
        Notification({type: 'warning', message: '请选择传感器！', duration: 1500})
      }else if(!this.selectedSensorType){
        Notification({type: 'warning', message: '请设置类型！', duration: 1500})
      }else{
        Notification({type: 'success', message: '连接成功', duration: 1500})
        this.Node.title = this.selectedSensor
        switch(this.selectedSensorType*1) {
          case 1: 
            break;
          case 2: this.webscoketOption.showInfo = true; this.onLinkWebscoket();break;
          case 3: this.webscoketOption.animate = true; this.onLinkWebscoket();break;
        }
      }
      
    },
    initData () {
      this.APIUrl ='https://yun.kexsci.com/yun/api/echart/countProjectStatus';
      this.APIType = 'get';
      this.APIParams = '';
      this.Node.data = null;
      this.events = {type: 0, action: 0, value: '', params: '', APIType: 'get', bindValue: ''}
    },
    changeDrawType() {
      if(this.Node.type == 'node') {
        this.Node.drawType = this.drawType
      }else{
        this.Node.traverse( child => {
          if(child.type == 'node') {
            child.drawType = this.drawType
          }
        })
      }
    },
    onChangeFileName () {
      this.$store.commit('changeFileName', this.fileName);
    },
    onChangeColor (i) {
      if(this.backgroundType == 0) {
        this.$store.commit('changeBkColor', this.bgColor)
      }
    },
    lineDashChange() {
      let dash = [0,0]
      switch(this.lineDash) {
        case 0: dash = [0,0];
          break;
        case 1: dash = [5,5];
          break;
        case 2: dash = [5, 10];
        break;
          case 3: dash = [5,5,1,5];
        break;
      }
      if(this.Node.type !== 'line') {
        this.Node.border.lineDash = dash
      }else{
        this.Node.lineDash = dash
      }
    },
    onSelectedImg (index) {
        this.chooseBgImg = false;
        this.$store.commit('changeBkImage', this.bgList[index].url)
    },
    onDeleBgImg () {
      this.$store.commit('changeBkImage', '')
    },
    changeGrid () {
      this.$store.commit('changeGrid', this.value)
    },
    onChange(value) {
      // if (this.Node) {
      //   this.Node.data = this.nodeIsJson ? JSON.parse(this.nodeData) : this.nodeData;
      // }
      this.$emit('change', this.Node);
    },
    onSelected () {
      // this.Node.lineDash = [this.lineDash*1, this.lineDash*1];
      this.onChange()
    },
    onSelectEventDo(item, index) {
      // switch(item.params.type) {
      //   case 0: this.Node.events[index].callBack = () => {
      //       window.location.href = this.Node.events[index].params.value
      //     }
      //   break;
      //   case 1: ;
      //   break;
      //   case 2: this.Node.events[index].callBack = () => {
      //       console.log(this.Node)
      //         this.Node.events[index].params.value
      //     };
      //   break;
      //   case 3: this.Node.events[index].callBack = () => {
      //           eval(this.Node.events[index].params.value)
      //     };
      //   break;
      //   case 4: ;
      //   break;
      //   case 5: ;
      //   break;
      // }
    },
    changeExpand() {
      // this.props.expand = !this.props.expand;
    },
    isJson (obj) {
      return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    },
    onLinkWebscoket () {
      if(this.webscoketOption.url) {
        this.$store.commit('changeWebscoket', this.webscoketOption.url);
        this.$store.commit('resetWebScoket');
        this.addEvents();
      }else{
        this.$message({
          type: 'error',
          message: 'Url地址为空!',
          duration: 1500,
          center: true
        })
      }
    },
    offLinkWebscoket () {
      this.events.bindValue = '';
      this.Node.events.forEach((element, i) => {
        if(element.type == 2) {
          this.Node.events.splice(i, 1);
        }
      });
    },
    addEvents () {
      let isHas = false;
      this.events.value = this.webscoketFn();
      this.events.type = 2;
      this.events.action = 2;
      this.events.bindValue = this.textName;
    },
    async onLinkAPI (node, item) {
      if(!!item) {
        this.APIParams = item.APIParams
        this.APIUrl = item.APIUrl
        this.APIType = item.APIType
      }
      let params = !this.APIParams? {} : eval("(" + this.APIParams + ")")
      let res = null
      if(this.APIType == 'get') {
        res = await this.$axios.get(this.APIUrl, { params })
      }else{
        res = await this.$axios.post(this.APIUrl, params)
      }
      this.showData = node.data = JSON.stringify(res);
      if(item?item.bindValue: item) {
        node.text = eval('res.' + item.bindValue);
      }
    },
    onBindAPI () {
        this.onLinkAPI()
        let isHas = false;
        let APIEvent = {type: 200, action: 200, url: this.APIUrl, pramas: this.APIParams, bindValue: this.bindValue, method: this.APIType};
        this.Node.events.forEach( (item, i) => {
          if(item.type == 200) {
            this.Node.events[i] = APIEvent;
              isHas = true;
          }
        })
        if(!isHas) {
            this.Node.events.push(APIEvent);
        }
        this.$emit('change', this.Node);
    },
    webscoketFn() {
      if(!this.textName) return ''
      let code = ``;
      if(this.webscoketOption.showInfo) {
        code +=`
          let info = {name: params.ptName, status: params.ptStatus, data: params.deflection};
          pen.text = JSON.stringify(info)`
      }
      if(this.webscoketOption.animate) {
        code +=`
          switch(params.ptStatus*1){
            case 0: pen.fillStyle = '#eeeeee';
            break;
            case 1: pen.fillStyle = '#00ff00';
            break;
            case 2: pen.fillStyle = '#ff0000';
            break;
          }
          window['flash_animate'](pen);`
      }
      return `if(pen.title == params.${this.textName}){
          ${code}
          window['updateCanvasNode'](pen);
        }`
    },
    flash_animation (node) {
      node.animateFrames = [];
      const state = this.Node.cloneState(node);
      // 修改状态位置
      state.fillStyle = '#eeeeee';
      // state.rect.width = node.rect.width*1;
      // state.rect.height = node.rect.height*1;
      node.animateFrames.push({
        duration: 300,
        linear: true,
        state
      });
      // 回到初始状态
      const state2 = this.Node.cloneState(node);
      state2.fillStyle = node.fillStyle;
      // state2.rect.width = node.rect.width*1.05;
      // state2.rect.height = node.rect.height*1.05;
      node.animateFrames.push({
        duration: 300,
        linear: true,
        state: state2
      });
      node.animateDuration = 0;
      for (const item of node.animateFrames) {
        node.animateDuration += item.duration;
      }
      // // 2.A 设置开始播放属性（为当前时间）
      node.animateStart = Date.now();
      // // 2.B 停止播放
      // node.animateStart = 0
    }
  },
  mounted () {
    this.bgColor = this.$store.state.data.bkColor || '';
    this.value = this.$store.state.data.grid
    this.group = this.$store.state.userEquipment.userEquipmentGroup
  }
}
</script>

<style lang="scss" scoped>
.title {
  color: #0d1a26;
  font-weight: 600;
  padding: 0.05rem 0.15rem;
  border-bottom: 1px solid #ccc;
}
.bgImg {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .bgImgItem {
    width: 30%;
    height: 2rem;
    border-radius: 0.05rem;
    background: #67C23A;
    color: #fff;
    overflow: hidden;
    transition: all .5s;
    cursor: pointer;
    margin-left: 5%; 
    margin-bottom: 20px;
    &:nth-child(3n+1) {
      margin-left: 0; 
    }
    &:hover {
      box-shadow: 0 2px 2px 2px #888;
      transform: scale(1.05);
    }
    span {
      display: inline-block;
      width: 100%;
      text-align: center;
    }
  }
}
.itemBox, .border-bottom{
  border-bottom: 1px solid #ccc;
  .items {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin-top: 5px;
    .color-ball {
      cursor: pointer;
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1px solid #ccc;
      margin-right: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      &:hover {
        transform: scale(1.1);
      }
    }
    .el-input-number {
      width: 1.02rem;
    }
    .el-input__inner {
      padding: 0 0.05rem;
    }
    .expand-data {
      position: absolute;
      right: 0.15rem;
      width: 5rem;
      z-index: 999;
    }
  }
}
.custom-data{ 
  i {
    cursor: pointer;
    float: right;
    color: #409eff;
    height: 2em;
    line-height: 2em;
  }
}
/deep/.el-tabs__item {
  padding: 0 5px !important;
  font-size: 12px !important;
}
/deep/.el-tabs__item.is-top:nth-child(2) {
    padding-left: 0 !important;
} 
/deep/.el-color-picker__color, /deep/.el-color-picker__trigger {
  border: none;
  background: none;
}
</style>
