export const Pens = {
    title: '画笔图形',
    data: [{
        name: '矩形水容器',
        icon: require('../../assets/icon/pool.svg'),
        node: {
            shape: 'waterCapacity',
            drawType: 'fill',
            lineWidth: 2,
            isOn: true,
            speed: 0.2,
            waterHeight: 0.5,
            color: ['rgba(21,115,151,0.5)','#2cafe7'],
            linePath: [] 
        }
    },{
        name: '水管',
        icon: require('../../assets/icon/channel.svg'),
        node: {
            shape: 'channel',
            drawType: 'fill',
            lineWidth: 5,
            lineDash: [10, 20],
            isOn: true,
            speed: 0.2,
            color: ['#fff','#2cafe7'],
            linePath: [] 
        }
    },{
        name: '曲线',
        icon: require('../../assets/icon/line.svg'),
        node: {
            shape: 'bezierLine',
            drawType: 'stroke',
            lineWidth: 1,
            color: ['red'],
            linePath: [] 
        }
    }]
}

export const Tools = 
{   
    title: '基本图形',
    data: [
    {
        name: '圆',
        icon: require('../../assets/icon/arc.svg'),
        node: {
            shape: 'arc',
            drawType: 'fill',
            text: {
                content: '圆',
            },
            color: ['#2cafe7'],
            lineWidth: 1,
            params:{r: 50, start: 0,end: 2*Math.PI},
            position: {x: 0, y: 0}   
        }
    },{
        name: '矩形',
        icon: require('../../assets/icon/rect.svg'),
        node: {
            shape: 'rect',
            drawType: 'fill',
            lineWidth: 2,
            color: ['#2cafe7'],
            text: {
                content: '呜呼！楚虽三户能亡秦，岂有堂堂中国空无人！',
                padding: [0, 0],
                color: '',
                fontSize: 18,
                fontFamily: '',
                fontStyle: 'italic',
                textAlign: 'center',
                textVertical: 'top',
                textShadowColor: '#000',
                textShadowBlur: 3,
                textShadowOffsetX: 2,
                textShadowOffsetY: 2,
            },
            params:{w: 100, h: 100},
            position: {x: 0, y: 0}   
        }
    },{
        name: '三角形',
        icon: require('../../assets/icon/angle.svg'),
        node: {
            shape: 'polygon',
            drawType: 'fill',
            color: ['#2cafe7'],
            lineWidth: 1,
            params:{w: 50, h: 50, num: 3},
            position: {x: 0, y: 0}   
        }
    },{
        name: '菱形',
        icon: require('../../assets/icon/diamond.svg'),
        node: {
            shape: 'polygon',
            drawType: 'fill',
            color: ['#2cafe7'],
            lineWidth: 1,
            params:{w: 50, h: 50, num: 4},
            position: {x: 0, y: 0}   
        }
    },{
        name: '五边形',
        icon: require('../../assets/icon/fiveAngle.svg'),
        node: {
            shape: 'polygon',
            drawType: 'fill',
            color: ['#2cafe7'],
            text: {
                content: '五边形'
            }, 
            border: {
                show: false,
                color: 'red',
                lineWidth: 1,
                lineCap: 'square',
                lineJoin: 'round'
            },
            lineWidth: 1,
            params:{w: 50, h: 50, num: 5},
            position: {x: 0, y: 0}   
        }
    },{
        name: '八边形',
        icon: require('../../assets/icon/eightAngle.svg'),
        node: {
            shape: 'polygon',
            drawType: 'fill',
            color: ['#2cafe7'],
            lineWidth: 1,
            text: {
                content: '八边形'
            },
            params:{w: 50, h: 50, num: 8},
            position: {x: 0, y: 0}   
        }
    },{
        name: '五角星',
        icon: require('../../assets/icon/fivePointedStart.svg'),
        node: {
            shape: 'fivePointedStart',
            drawType: 'fill',
            color: ['#2cafe7'],
            params: {r: 50},
            position: {x: 0, y: 0}   
        }
    },{
    name: '闪灯',
    icon: require('../../assets/icon/light.svg'),
    node: {
        shape: 'light',
        drawType: 'fill',
        isOn: true,
        speed: 0.05,
        color: ["#ff0000", '#ff0000'],
        position: {x: 0, y: 0}   
    }
    },{
        name: '钟表',
        icon: require('../../assets/icon/clock.svg'),
        node: {
            shape: 'clock',
            drawType: 'stroke',
            isOn: true,
            color: ["#2cafe7", '#fff','#fff','red','#fff','#fff','red'],
            params: {w: 100, h: 150},
            position: {x: 0, y: 0}
        }
    },{
        name:'大风车',
        icon: require('../../assets/icon/windmill.svg'),
        node:{
            shape: 'windmill',
            color: ['#2cafe7', '#fff', '#2cafe7'],
            drawType: 'fill',
            speed: 0.1,
            params: {w: 80, h: 150},
            position: {x: 0, y: 0}
        }
    },{
        name: '视频',
        icon: require('../../assets/icon/video.svg'),
        node: {
            shape: 'drawVideo',
            drawType: 'fill',
            isOn: false,
            src: './img/mov_bbb.mp4',
            params:{w: 150, h: 100},
            position: {x: 0, y: 0}
        }
    },{
        name: '图片',
        icon: require('../../assets/icon/picture.svg'),
        node: {
            shape: 'drawImage',
            drawType: 'fill',
            src: 'https://img1.baidu.com/it/u=3632732758,1898142214&fm=26&fmt=auto',
            // src:'http://file.trump.kexsci.com/kexsci/images/1629163005446微信图片_20210817091134.png',
            // src: './img/123.png',
            color: ['rgba(0,0,0,0)'],
            params:{w: 150, h: 100},
            position: {x: 0, y: 0}  
        }
    },{
        name: '文本',
        icon: require('../../assets/icon/text.svg'),
        node: {
            shape: 'drawText',
            text: {
                content: '文本内容'
            }, 
            color: ['#2cafe7'],
            params:{w: 150, h: 100},
            position: {x: 0, y: 0}
        }
    },{
        name: '风扇',
        icon: require('../../assets/icon/fan.svg'),
        node: {
            shape: 'drawFan',
            drawType: 'fill',
            color: ['#2cafe7', '#fff'],
            speed: 0.3,
            params: {w: 80, h: 80},
            position: {x: 0, y: 0}  
        }
    },{
        name: '开关',
        icon: require('../../assets/icon/switch.svg'),
        node: {
            shape: 'drawSwitch',
            color: ['#2cafe7', '#fff', '#ccc'],
            isOn: true,
            position: {x: 0, y: 0},
            params: {w: 80, h: 40}
        }
    }]
}

export const Flow = {
    title: '流程图',
    data:[{
        name: '椭圆',
        icon: require('../../assets/icon/rect.svg'),
        node: {
            shape: 'oval',
            drawType: 'stroke',
            lineWidth: 1,
            text: {
                content: '开始',
                fontSize: 16,
                color: '#eee'
            }, 
            color: ['#eee'],
            params:{w: 80, h: 40},
            position: {x: 0, y: 0}
        }
    },{
        name: '长方形',
        icon: require('../../assets/icon/rect.svg'),
        node: {
            shape: 'rect',
            drawType: 'stroke',
            lineWidth: 1,
            text: {
                content: '过程',
                fontSize: 16,
                color: '#eee'
            }, 
            color: ['#eee'],
            params:{w: 100, h: 40},
            position: {x: 0, y: 0}
        }
    },{
        name: '菱形',
        icon: require('../../assets/icon/diamond.svg'),
        node: {
            shape: 'polygon',
            drawType: 'stroke',
            lineWidth: 1,
            text: {
                content: '决策',
                fontSize: 16,
                color: '#eee'
            }, 
            color: ['#eee'],
            params:{w: 40, h: 40, num: 4},
            position: {x: 0, y: 0}
        }
    },{
        name: '平行四边形',
        icon: require('../../assets/icon/rect.svg'),
        node: {
            shape: 'parallelogram',
            drawType: 'stroke',
            lineWidth: 1,
            text: {
                content: '数据',
                fontSize: 16,
                color: '#eee'
            }, 
            color: ['#eee'],
            params:{w: 80, h: 40},
            position: {x: 0, y: 0}
        }
    },{
        name: '六边形',
        icon: require('../../assets/icon/rect.svg'),
        node: {
            shape: 'polygon',
            drawType: 'stroke',
            lineWidth: 1,
            text: {
                content: '准备',
                fontSize: 16,
                color: '#eee'
            }, 
            color: ['#eee'],
            params:{w: 50, h: 20, num: 6},
            position: {x: 0, y: 0}
        }
    },{
        name: '箭头',
        icon: require('../../assets/icon/rect.svg'),
        node: {
            shape: 'arrow',
            drawType: 'stroke',
            lineWidth: 1,
            color: ['#eee'],
            params:{w: 200, h: 40},
            position: {x: 0, y: 0}
        }
    }]
}

export const LargeScreens = {
    title: '大屏组件',
    data:[{
        name: '头部',
        icon: require('../../assets/icon/header.svg'),
        node: {
            shape: 'L_header',
            drawType: 'fill',
            lineWidth: 2,
            text: {
                content: 'xxx在线监测系统',
                fontSize: 25,
                color: '#2cafe7'
            }, 
            color: ['#2cafe7','#2cafe7'],
            params:{w: 1200, h: 70},
            position: {x: 0, y: 0}
        }
    },{
        name: '左侧',
        icon: require('../../assets/icon/left.svg'),
        node: {
            shape: 'L_left',
            drawType: 'stroke',
            lineWidth: 2,
            text: {
                content: '左侧布局',
                fontSize: 25,
                color: '#fff'
            }, 
            color: ['#2cafe7','#2cafe7'],
            params:{w: 200, h: 400},
            position: {x: 0, y: 0}
        }
    },{
        name: '右侧',
        icon: require('../../assets/icon/right.svg'),
        node: {
            shape: 'L_right',
            drawType: 'fill',
            lineWidth: 2,
            text: {
                content: '右侧布局',
                fontSize: 25,
                color: '#fff'
            }, 
            color: ['#2cafe7','#2cafe7'],
            params:{w: 200, h: 400},
            position: {x: 0, y: 0}
        }
    },{
        name: '中心',
        icon: require('../../assets/icon/center.svg'),
        node: {
            shape: 'L_center',
            lineWidth: 2,
            text: {
                content: '中心布局',
                fontSize: 20,
                color: '#fff'
            }, 
            color: ['#2cafe7','#2cafe7'],
            params:{w: 800, h: 400},
            position: {x: 0, y: 0}
        }
    },{
        name: '底部',
        icon: require('../../assets/icon/center.svg'),
        node: {
            shape: 'L_bottom',
            lineWidth: 2,
            text: {
                content: '底部',
                fontSize: 25,
                color: '#fff'
            }, 
            color: ['#2cafe7','#2cafe7'],
            params:{w: 1200, h: 180},
            position: {x: 0, y: 0}
        }
    },{
        name: '头部',
        icon: require('../../assets/icon/header.svg'),
        node: {
            shape: 'L_box',
            drawType: 'fill',
            lineWidth: 1,
            text: {
                content: 'xxx在线监测系统',
                fontSize: 20,
                color: '#2cafe7',
                textVertical: 'top'
            }, 
            color: ['#2cafe7','#2cafe7','#2cafcc'],
            params:{w: 1280, h: 640},
            position: {x: 0, y: 0}
        }
    }]
}

export const Echarts = {
    title: '数据图表',
    data: [
        {
            name: '折线图',
            icon: require('../../assets/icon/lineCharts.svg'),
            animate: false,
            node: {
                shape: 'drawEcharts',
                color: ['#fff'],
                params: {w: 300, h: 200},
                echartsOption: {
                    color: ['#409EFF'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        smooth: true
                    }]
                },
                position: {x: 0, y: 0}   
            }
        },{
            name: '柱状图',
            icon: require('../../assets/icon/barCharts.svg'),
            node: {
                shape: 'drawEcharts',
                color: ['#fff'],
                params: {w: 300, h: 200},
                echartsOption: {
                    color: ['#409EFF'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [120, 200, 150, 80, 70, 110, 130],
                        type: 'bar'
                    }]
                },
                position: {x: 0, y: 0}   
            }
        },{
            name: '雷达图',
            icon: require('../../assets/icon/radarCharts.svg'),
            node: {
                shape: 'drawEcharts',
                color: ['#fff'],
                params: {w: 300, h: 200},
                echartsOption: {
                    legend: {
                        data: ['预算分配', '实际开销'],
                        top: '20'
                    },
                    grid: {
                        left: '10%',
                        right: '10%',
                        top: 10,
                        bottom: 10
                    },
                    radar: {
                        // shape: 'circle',
                        indicator: [
                            { name: '销售', max: 6500},
                            { name: '管理', max: 16000},
                            { name: '信息技术', max: 30000},
                            { name: '客服', max: 38000},
                            { name: '研发', max: 52000},
                            { name: '市场', max: 25000}
                        ]
                    },
                    series: [{
                        name: '预算 vs 开销',
                        type: 'radar',
                        data: [
                            {
                                value: [4200, 3000, 20000, 35000, 50000, 18000],
                                name: '预算分配'
                            },
                            {
                                value: [5000, 14000, 28000, 26000, 42000, 21000],
                                name: '实际开销'
                            }
                        ]
                    }]
                },
                position: {x: 0, y: 0}   
            }
        },{
            name: '饼图',
            icon: require('../../assets/icon/pieCharts.svg'),
            node: {
                shape: 'drawEcharts',
                color: ['#fff'],
                params: {w: 300, h: 200},
                echartsOption:{
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        // orient: 'vertical',
                        left: 'center',
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '50%',
                            data: [
                                {value: 1048, name: '搜索引擎'},
                                {value: 735, name: '直接访问'},
                                {value: 580, name: '邮件营销'},
                                {value: 484, name: '联盟广告'},
                                {value: 300, name: '视频广告'}
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                },
                position: {x: 0, y: 0}   
            }
        },{
            name: '环形图',
            icon: require('../../assets/icon/circleCharts.svg'),
            node: {
                shape: 'drawEcharts',
                color: ['#fff'],
                params: {w: 300, h: 200},
                echartsOption:{
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        top: '2%',
                        left: 'left'
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                                borderColor: '#fff',
                                borderWidth: 2
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: [
                                {value: 1048, name: '搜索引擎'},
                                {value: 735, name: '直接访问'},
                                {value: 580, name: '邮件营销'},
                                {value: 484, name: '联盟广告'},
                                {value: 300, name: '视频广告'}
                            ]
                        }
                    ]
                },
                position: {x: 0, y: 0}   
            }
        },{
            name: '仪表盘',
            icon: require('../../assets/icon/gaugeCharts.svg'),
            node: {
                shape: 'drawEcharts',
                color: ['#fff'],
                params: {w: 300, h: 200},
                echartsOption: {
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
                            detail: {formatter: '{value}%'},
                            data: [{value: 50, name: '完成率'}]
                        }
                    ]
                },
                position: {x: 0, y: 0}   
            }
        }
    ]
}