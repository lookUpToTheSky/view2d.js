import { register as registerFlow } from '@topology/flow-diagram'
import { register as registerActivity } from '@topology/activity-diagram'
import { register as registerSequence } from '@topology/sequence-diagram'

import { register as registerClass } from '@/class-diagram/index'

import { register as registerChart } from '@topology/chart-diagram';

export function canvasRegister() {
  registerFlow()
  registerActivity()
  registerSequence()
  registerClass()
  registerChart()
}
const color =  ['#52ffff','#FFAE00','#e36159','#0088cc','#00ff7f',
'#bc1717','#ff7f00','#db7093','#b87333',
'#ff2400','#215e21','#ff00ff','#99cc32',
'#23238e','#5340cc']

export const Tools = [
  {
    group: '基本形状',
    children: [
      {
        name: 'rectangle',
        icon: 'icon-rect',
        data: {
          text: '矩形',
          rect: {
            width: 150,
            height: 150
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          name: 'rectangle',
        }
      },
      {
        name: 'rectangle',
        icon: 'icon-rectangle',
        data: {
          text: '圆角矩形',
          rect: {
            width: 200,
            height: 50
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 0.1,
          name: 'rectangle'
        }
      },
      {
        name: 'circle',
        icon: 'icon-circle',
        data: {
          text: '圆',
          rect: {
            width: 100,
            height: 100
          },
          name: 'circle',
          textMaxLine: 1
        }
      },
      {
        name: 'triangle',
        icon: 'icon-triangle',
        data: {
          text: '三角形',
          rect: {
            width: 100,
            height: 100
          },
          name: 'triangle'
        }
      },
      {
        name: 'diamond',
        icon: 'icon-diamond',
        data: {
          text: '菱形',
          rect: {
            width: 100,
            height: 100
          },
          name: 'diamond'
        }
      },
      {
        name: 'pentagon',
        icon: 'icon-pentagon',
        data: {
          text: '五边形',
          rect: {
            width: 100,
            height: 100
          },
          name: 'pentagon'
        }
      },
      {
        name: 'hexagon',
        icon: 'icon-hexagon',
        data: {
          text: '六边形',
          rect: {
            width: 100,
            height: 100
          },
          paddingTop: 10,
          paddingBottom: 10,
          name: 'hexagon'
        }
      },
      {
        name: 'pentagram',
        icon: 'icon-pentagram',
        data: {
          text: '五角星',
          rect: {
            width: 100,
            height: 100
          },
          name: 'pentagram'
        }
      },
      {
        name: 'leftArrow',
        icon: 'icon-arrow-left',
        data: {
          text: '左箭头',
          rect: {
            width: 200,
            height: 100
          },
          name: 'leftArrow'
        }
      },
      {
        name: 'rightArrow',
        icon: 'icon-arrow-right',
        data: {
          text: '右箭头',
          rect: {
            width: 200,
            height: 100
          },
          name: 'rightArrow'
        }
      },
      {
        name: 'twowayArrow',
        icon: 'icon-twoway-arrow',
        data: {
          text: '双向箭头',
          rect: {
            width: 200,
            height: 100
          },
          name: 'twowayArrow'
        }
      },
      {
        name: 'line',
        icon: 'icon-line',
        data: {
          text: '直线',
          rect: {
            width: 100,
            height: 100
          },
          name: 'line'
        }
      },
      {
        name: 'cloud',
        icon: 'icon-cloud',
        data: {
          text: '云',
          rect: {
            width: 100,
            height: 100
          },
          name: 'cloud'
        }
      },
      {
        name: 'message',
        icon: 'icon-msg',
        data: {
          text: '消息框',
          rect: {
            width: 100,
            height: 100
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          name: 'message'
        }
      },
      {
        name: 'file',
        icon: 'icon-file',
        data: {
          text: '文档',
          rect: {
            width: 80,
            height: 100
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          name: 'file'
        }
      },
      {
        name: 'text',
        icon: 'icon-text',
        data: {
          text: 'le5le-topology / 乐吾乐',
          rect: {
            width: 160,
            height: 30
          },
          name: 'text'
        }
      },
      {
        name: 'image',
        icon: 'icon-image',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 200
          },
          name: 'image',
          image: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.cnww1985.com%2Fupload%2F201912%2F04%2F201912041006121852.gif&refer=http%3A%2F%2Fwww.cnww1985.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619057670&t=9cc51fe942548275ae7f3d8be7ef711a'
        }
      },
      {
        name: 'cube',
        icon: 'icon-cube',
        data: {
          rect: {
            width: 50,
            height: 70
          },
          is3D: true,
          z: 10,
          zRotate: 15,
          fillStyle: '#41ddaa',
          name: 'cube',
          icon: '\ue63c',
          iconFamily: 'topology',
          iconColor: '#666',
          iconSize: 30
        }
      },
      {
        name: 'people',
        icon: 'icon-people',
        data: {
          rect: {
            width: 70,
            height: 100
          },
          name: 'people'
        }
      },
      {
        name: '视频/网页',
        icon: 'icon-pc',
        data: {
          text: '视频/网页',
          rect: {
            width: 200,
            height: 200
          },
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          paddingBottom: 10,
          strokeStyle: 'transparent',
          name: 'div'
        }
      }
    ]
  },
  {
    group: '流程图',
    children: [
      {
        name: '开始/结束',
        icon: 'icon-flow-start',
        data: {
          text: '开始',
          rect: {
            width: 120,
            height: 40
          },
          borderRadius: 0.5,
          name: 'rectangle'
        }
      },
      {
        name: '流程',
        icon: 'icon-rectangle',
        data: {
          text: '流程',
          rect: {
            width: 120,
            height: 40
          },
          name: 'rectangle'
        }
      },
      {
        name: '判定',
        icon: 'icon-diamond',
        data: {
          text: '判定',
          rect: {
            width: 120,
            height: 60
          },
          name: 'diamond'
        }
      },
      {
        name: '数据',
        icon: 'icon-flow-data',
        data: {
          text: '数据',
          rect: {
            width: 120,
            height: 50
          },
          name: 'flowData'
        }
      },
      {
        name: '准备',
        icon: 'icon-flow-ready',
        data: {
          text: '准备',
          rect: {
            width: 120,
            height: 50
          },
          name: 'hexagon'
        }
      },
      {
        name: '子流程',
        icon: 'icon-flow-subprocess',
        data: {
          text: '子流程',
          rect: {
            width: 120,
            height: 50
          },
          name: 'flowSubprocess'
        }
      },
      {
        name: '数据库',
        icon: 'icon-db',
        data: {
          text: '数据库',
          rect: {
            width: 80,
            height: 120
          },
          name: 'flowDb'
        }
      },
      {
        name: '内部存储',
        icon: 'icon-internal-storage',
        data: {
          text: '内部存储',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowInternalStorage'
        }
      },
      {
        name: '外部存储',
        icon: 'icon-extern-storage',
        data: {
          text: '外部存储',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowExternStorage'
        }
      },
      {
        name: '队列',
        icon: 'icon-flow-queue',
        data: {
          text: '队列',
          rect: {
            width: 100,
            height: 100
          },
          name: 'flowQueue'
        }
      },
      {
        name: '手动输入',
        icon: 'icon-flow-manually',
        data: {
          text: '手动输入',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowManually'
        }
      },
      {
        name: '展示',
        icon: 'icon-flow-display',
        data: {
          text: '展示',
          rect: {
            width: 120,
            height: 80
          },
          name: 'flowDisplay'
        }
      },
      {
        name: '并行模式',
        icon: 'icon-flow-parallel',
        data: {
          text: '并行模式',
          rect: {
            width: 120,
            height: 50
          },
          name: 'flowParallel'
        }
      },
      {
        name: '注释',
        icon: 'icon-flow-comment',
        data: {
          text: '注释',
          rect: {
            width: 100,
            height: 100
          },
          name: 'flowComment'
        }
      }
    ]
  },
  {
    group: '活动图',
    children: [
      {
        name: '开始',
        icon: 'icon-inital',
        data: {
          text: '',
          rect: {
            width: 30,
            height: 30
          },
          name: 'circle',
          fillStyle: '#555',
          strokeStyle: 'transparent'
        }
      },
      {
        name: '结束',
        icon: 'icon-final',
        data: {
          text: '',
          rect: {
            width: 30,
            height: 30
          },
          name: 'activityFinal',
        }
      },
      {
        name: '活动',
        icon: 'icon-action',
        data: {
          text: '活动',
          rect: {
            width: 120,
            height: 50
          },
          borderRadius: 0.25,
          name: 'rectangle'
        }
      },
      {
        name: '决策/合并',
        icon: 'icon-diamond',
        data: {
          text: '决策',
          rect: {
            width: 120,
            height: 50
          },
          name: 'diamond'
        }
      },
      {
        name: '水平泳道',
        icon: 'icon-swimlane-h',
        data: {
          text: '水平泳道',
          rect: {
            width: 500,
            height: 200
          },
          name: 'swimlaneH'
        }
      },
      {
        name: '垂直分岔/汇合',
        icon: 'icon-fork-v',
        data: {
          text: '',
          rect: {
            width: 10,
            height: 150
          },
          name: 'forkV',
          fillStyle: '#555',
          strokeStyle: 'transparent'
        }
      },
      {
        name: '水平分岔/汇合',
        icon: 'icon-fork',
        data: {
          text: '',
          rect: {
            width: 150,
            height: 10
          },
          name: 'forkH',
          fillStyle: '#555',
          strokeStyle: 'transparent'
        }
      }
    ]
  },
  {
    group: '时序图和类图',
    children: [
      {
        name: '生命线',
        icon: 'icon-lifeline',
        data: {
          text: '生命线',
          rect: {
            width: 150,
            height: 400
          },
          name: 'lifeline'
        }
      },
      {
        name: '激活',
        icon: 'icon-focus',
        data: {
          text: '',
          rect: {
            width: 12,
            height: 200
          },
          name: 'sequenceFocus'
        }
      },
      {
        name: '简单类',
        icon: 'icon-simple-class',
        data: {
          text: 'Topolgoy',
          rect: {
            width: 270,
            height: 200
          },
          paddingTop: 40,
          font: {
            fontFamily: 'Arial',
            color: '#222',
            fontWeight: 'bold'
          },
          fillStyle: '#ffffba',
          strokeStyle: '#7e1212',
          name: 'simpleClass',
          children: [
            {
              text: '- name: string\n+ setName(name: string): void',
              name: 'text',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: 0,
                width: '100%',
                height: '100%',
                rotate: 0
              },
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'left',
                textBaseline: 'top'
              }
            }
          ]
        }
      },
      {
        name: '类',
        icon: 'icon-class',
        data: {
          text: 'Topolgoy',
          rect: {
            width: 270,
            height: 200
          },
          paddingTop: 40,
          font: {
            fontFamily: 'Arial',
            color: '#222',
            fontWeight: 'bold'
          },
          fillStyle: '#ffffba',
          strokeStyle: '#7e1212',
          name: 'interfaceClass',
          children: [
            {
              text: '- name: string',
              name: 'text',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: 0,
                width: '100%',
                height: '50%',
                rotate: 0
              },
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'left',
                textBaseline: 'top'
              }
            },
            {
              text: '+ setName(name: string): void',
              name: 'text',
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 10,
              paddingBottom: 10,
              rectInParent: {
                x: 0,
                y: '50%',
                width: '100%',
                height: '50%',
                rotate: 0
              },
              font: {
                fontFamily: 'Arial',
                color: '#222',
                textAlign: 'left',
                textBaseline: 'top'
              }
            }
          ]
        }
      }
    ]
  },
  {
    group: '图表控件',
    children: [
      {
        name: '折线图',
        icon: 'icon-line-chart',
        data: {
          text: '',
          rect: {
            width: 300,
            height: 200
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                color: color,
                tooltip: {
                  trigger: "axis",
                  transitionDuration: 0.3,
                  backgroundColor: 'rgba(90, 239, 249, .3)',
                },
                title: {
                  text: '统计',
                  x: 'center',
                  y: '10',
                  textStyle: {
                      color: '#52FFFF'
                  }
                },
                grid: {
                  top: 50,
                  left: 65,
                  right: 50,
                  bottom: 50
                },
                xAxis: {
                  type: 'category',
                  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  boundaryGap: false,
                  axisLabel: {
                      textStyle: {
                      color: "#0088cc" //刻度颜色
                      }
                  },
                  axisTick: {
                      show: true
                  },
                  axisLine: {
                      lineStyle: {
                          color: '#0088cc'
                      }
                  },
                  splitLine: {
                      // show: false,
                      lineStyle: {
                          color: '#888'
                      }
                  }
                },
                yAxis: {
                  type: 'value',
                  axisTick: {
                      show: true
                  },
                  offset: 10,
                  axisLabel: {
                      textStyle: {
                          color: "#0088cc", //刻度颜色
                          fontSize: 12 ,//刻度大小
                      }
                  },
                  axisLine: {
                      show: true,
                      lineStyle: {
                          color: '#0088cc'
                      }
                  },
                  splitLine: {
                      show: false,
                      lineStyle: {
                          color: '#888'
                      }
                  }
                },
                series: [
                  {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true
                  }
                ]
              }
            }
          }
        }
      },
      {
        name: '柱状图',
        icon: 'icon-bar-chart',
        data: {
          text: '',
          rect: {
            width: 300,
            height: 200
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                color: color,
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ],
                series: [
                  {
                    name: '直接访问',
                    type: 'bar',
                    barWidth: '40%', 
                    roundCap: true,
                    data: [10, 52, 200, 334, 390, 330, 220],
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(25, 238, 241, 1)'
                            }, {
                                offset: 1,
                                color: 'rgba(235, 238, 241, 0.6)'
                            }]),
                        }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        name: '饼图',
        icon: 'icon-pie-chart',
        data: {
          text: '',
          rect: {
            width: 300,
            height: 200
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                color: color,
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                  orient: 'vertical',
                  x: 'right',
                  data: [
                    '直接访问',
                    '邮件营销',
                    '联盟广告',
                    '视频广告',
                    '搜索引擎'
                  ]
                },
                series: [
                  {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['40%', '50%'],
                    avoidLabelOverlap: false,
                    label: {
                      normal: {
                        show: false,
                        position: 'center'
                      },
                      emphasis: {
                        show: true,
                        textStyle: {
                          fontSize: '30',
                          fontWeight: 'bold'
                        }
                      }
                    },
                    labelLine: {
                      normal: {
                        show: false
                      }
                    },
                    data: [
                      { value: 335, name: '直接访问' },
                      { value: 310, name: '邮件营销' },
                      { value: 234, name: '联盟广告' },
                      { value: 135, name: '视频广告' },
                      { value: 1548, name: '搜索引擎' }
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      {
        name: '仪表盘',
        icon: 'icon-dashboard-chart',
        data: {
          text: '仪表盘',
          rect: {
            width: 300,
            height: 300
          },
          name: 'echarts',
          data: {
            echarts: {
              option: {
                color: color,
                tooltip: {
                  formatter: '{a} <br/>{b} : {c}%'
                },
                toolbox: {
                  feature: {
                    restore: {},
                    saveAsImage: {}
                  }
                },
                series: [
                  {
                    name: '业务指标',
                    type: 'gauge',
                    detail: { formatter: '{value}%' },
                    data: [{ value: 50, name: '完成率' }]
                  }
                ]
              }
            }
          }
        }
      }
    ]
  },
  {
    group: '控件',
    children: [{
      name: 'image',
      icon: 'icon-kaiguanguan2',
      data: {
        text: '',
        rect: {
          width: 100,
          height: 50
        },
        name: 'image',
        image: './img/off-btn.png'
      }
    },{
      name: 'image',
      icon: 'icon-icon_xuanzhong_dianyuankaiguan',
      data: {
        text: '',
        rect: {
          width: 100,
          height: 100
        },
        name: 'image',
        image: './img/btn.png'
      }
    }]
  },
  {
    group: '设备',
    children: [
      {
        name: 'image',
        icon: 'icon-04-chuanganqimoniliang-zaixian',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 200
          },
          name: 'image',
          image: './img/sensor.png'
        }
      },
      {
        name: 'image',
        icon: 'icon-05-chuanganqikaiguanliang-zaixian-kai',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 200
          },
          name: 'image',
          image: './img/online-sensor.png'
        }
      },
      {
        name: 'image',
        icon: 'icon-05-chuanganqikaiguanliang-lixian',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 200
          },
          name: 'image',
          image: './img/offline-sensor.png'
        }
      },
      {
        name: 'image',
        icon: 'icon-04-chuanganqimoniliang-baojing',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 200
          },
          name: 'image',
          image: './img/warning-sensor.png'
        }
      },
      {
        name: 'image',
        icon: 'icon-wenduchuanganqi',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 200
          },
          name: 'image',
          image: './img/tem-sensor.png'
        }
      },
      {
        name: 'image',
        icon: 'icon-deng',
        data: {
          text: '',
          rect: {
            width: 200,
            height: 200
          },
          name: 'image',
          image: './img/light-sensor.png'
        }
      }
    ]
  }
]
