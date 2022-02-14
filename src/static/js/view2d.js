(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.View2d = factory());
})(this, function () {
    'use strict';
    console.log('欢迎使用 View2d version: 1.0.0 - 官网：http://***')
    const View2d = {
        save: save,
        saveAsImage: saveAsImage,
        getData: getData,
        scene: null,
        Node: null,
        Group: null,
        $el: null,
        $template: null,
        ctx: null,
        nodes: [],
        lock: false,
        activeNode: null,
        pen: {
            drawPath: false,
            color: '#409EFF',
            showPath: false,
            data: null
        }, 
        mode: {
            type:'edit',
            center: true,
            scaleable: false,
            moveable: true,
            padding: [0,0],
            zoom: {max: 5, min: 0.20, rate: 1},
        },
        color: [ '#409EFF','#c23531', '#E6A23C', '#67C23A', '#91c7ae','#dddddd', '#bda29a', '#546570'],
        baseLine: {
            color: 'orange',
            lineWidth: 1,
            space: 5,
            x: [],
            y: []
        },
        checkbox: {
            show: false,
            checkboxGroup: null, //选中的后的节点组成group
            start: {x: 0, y: 0},
            end: {x: 0, y: 0},
            lineWidth: 2,
            color: '#1890ff',
            background: 'rgba(0,50,150,0.2)',
        },
        grid: {
            show: false,
            lineWidth: 0.5,
            color: 'rgba(225,225,225,0.8)',
            step: {x: 30,y: 30}
        },
        background: {
            color: '#000',
            image: ''
        }
    }
    function save(fileName) {
        let scene = View2d.nodes.find( item => item.constructor === View2d.scene)
        scene.scale(scene.position, 1,1)
        fileName = fileName || 'View2d_data_'+ Math.round(Math.random()*Math.pow(10, 6))
        let data = {
            baseLine: View2d.baseLine,
            grid: View2d.grid,
            background: View2d.background,
            nodes: View2d.nodes.filter(item => item.zIndex != null)
        }
        data = JSON.stringify(data, undefined, 4)
        let blob = new Blob([data], {type: 'text/json'})
        let a = document.createElement('a')
        a.href = window.URL.createObjectURL(blob)
        a.download = fileName + '.json'
        a.click()
    }
    function saveAsImage(name) {
        name = name || 'View2d_image_' +  Math.round(Math.random()*Math.pow(10, 6)) + '.png'
        let value = name.match(/^(.*)\.(.*)$/)
        let type = value[2] || 'png'
        var image = View2d.$el.toDataURL(type)
        var oA = document.createElement("a");
        oA.download = name;// 设置下载的文件名，默认是'下载'
        oA.href = image;
        document.body.appendChild(oA);
        oA.click();
        oA.remove(); // 下载之后把创建的元素删除
    }
    function getData() {
        let scene = View2d.nodes.find( item => item.constructor === View2d.scene)
        scene.scale(scene.position, 1,1)
        let data = {
            baseLine: View2d.baseLine,
            grid: View2d.grid,
            background: View2d.background,
            nodes: View2d.nodes.filter(item => item.zIndex != null)
        }
        return data
    }
    var templateMousedown = false
    // canvas场景创建
    View2d.scene = function(parentElement, option = {}) {
        parentElement = parentElement || document.body
        if (typeof parentElement === 'string') {
            parentElement = document.querySelector(parentElement);
        }
        this.scaleVal = {x: 1, y: 1}
        this.children = []
        this.zIndex = null
        View2d.nodes = []
        eventsList = []
        View2d.checkbox.checkboxGroup = new View2d.Group({type: 'extraGroup'})
        this.width = parentElement.clientWidth
        this.height = parentElement.clientHeight
        this.position = {x: this.width/2, y: this.height/2}
        View2d.$el = document.createElement('canvas')
        View2d.$el.style.display = 'block'
        View2d.$el.width = this.width
        View2d.$el.height = this.height 
        parentElement.appendChild(View2d.$el)
        View2d.ctx = View2d.$el.getContext('2d')

        //自定义图形事件
        View2d.$template = document.createElement('canvas')
        View2d.$template.style.display = 'none'
        View2d.$template.width = this.width
        View2d.$template.height = this.height
        View2d.$template.style.position = 'absolute'
        View2d.$template.style.top = '0'
        View2d.$template.style.left = '0'
        View2d.$template.style.zIndex = '2020'
        View2d.$template.style.background="rgba(0,0,0,0.3)"
        View2d.pen.ctx = View2d.$template.getContext('2d')
        parentElement.appendChild(View2d.$template)

        View2d.$template.addEventListener('mousedown', () => {
            if(View2d.pen.data !== null && event.buttons == 1) {
                templateMousedown = true
                let point = {x: event.offsetX, y: event.offsetY, type: event.ctrlKey ? 'curve' : 'straight'}
                View2d.pen.data.linePath.push(point)
            }
        })

        View2d.$template.addEventListener('mousemove', () => {
            if(View2d.pen.data !== null ) {
                let point = {x: event.offsetX, y: event.offsetY, type: event.ctrlKey ? 'curve' : 'straight'}
                View2d.pen.data.linePath.push(point)
                if(View2d.pen.data.linePath.length > 1) {
                    View2d.pen.data.linePath.splice(View2d.pen.data.linePath.length - 2, 1) 
                }
            }
            if(View2d.pen.data !== null) {
                View2d.$template.style.display = 'block'
            }
        })
        let that = this
        View2d.$template.addEventListener('contextmenu', () => {
            event.preventDefault();
            event.stopPropagation();
            View2d.$template.style.display = 'none'
            if(templateMousedown && View2d.pen.data.linePath.length > 2) {
                if(View2d.pen.data.shape == 'waterCapacity'&& View2d.pen.data.linePath.length <= 3) {
                    return false
                }
                View2d.pen.data.linePath.pop()
                // let xMax = 0,yMax = 0,xMin = 9999,yMin = 9999;
                // View2d.pen.data.linePath.forEach( item => {
                //     xMax = xMax > item.x ? xMax : item.x
                //     yMax = yMax > item.y ? yMax : item.y
                //     xMin = xMin < item.x ? xMin : item.x
                //     yMin = yMin < item.y ? yMin : item.y
                // })
                // let center = {
                //     x: xMin + (xMax - xMin)/2,
                //     y: yMin + (yMax - yMin)/2
                // }
                // View2d.pen.data.position = center
                // View2d.pen.data.linePath.forEach( (item, i) => {
                //     View2d.pen.data.linePath[i].x = item.x - center.x
                //     View2d.pen.data.linePath[i].y = item.y - center.y
                // })
                // let node = new View2d.Node(View2d.pen.data)
                // node.scale(1/this.scaleVal.x, 1/this.scaleVal.y)
                let line = new View2d.Line({...View2d.pen.data})
                that.add(line)
                templateMousedown = false
            }
            View2d.pen.data = null
        })
        View2d.$el.addEventListener('mousemove', () => {
            if(View2d.pen.data !== null) {
                View2d.$template.style.display = 'block'
            }else{
                View2d.$template.style.display = 'none'
            }
        })
        // View2d.$dom dom节点容器
        View2d.$dom = document.createElement('div')
        View2d.$dom.style.width = this.width + 'px'
        View2d.$dom.style.height = this.height + 'px'
        View2d.$dom.style.position = 'absolute'
        View2d.$dom.style.top = '0'
        View2d.$dom.style.left = '0'
        View2d.$dom.style.overflow = 'hidden'
        View2d.$dom.style.pointerEvents = 'none'
        parentElement.appendChild(View2d.$dom)
        let _this = this
        this.add = function(node) {
            if(node.vertex === undefined) return false
            node.parentId = undefined
            node.zIndex = node.zIndex || _this.children.length
            _this.children.push(node)
            
            // Line
            if(node.constructor === View2d.Line) {
                drawLine(node, true)
            }
            // Node
            if(node.constructor == View2d.Node){
                drawNode(node, true)
            }
            // Group
            if(node.constructor == View2d.Group) {
                node.traverse( child => {
                    if(child.constructor === View2d.Node) {
                        drawNode(child, true)
                    }
                    // Line
                    if(child.constructor === View2d.Line) {
                        drawLine(child, true)
                    }
                    if(child.shape == "drawEcharts") {
                        View2d.$dom.appendChild(child.element)
                    }
                })
            }
            if(!View2d.lock) {
                node.dragEvents = []
                node.on('drag')
            }
        }
        this.remove = function(node) {
            _this.children.forEach( (child, i) => {
                if(child.ID == node.ID) {
                    _this.children.splice(i, 1)
                    if(child.shape == "drawEcharts") {
                        View2d.$dom.removeChild(child.element)
                    }
                    if(child.constructor == View2d.Group) {
                        child.traverse( ele => {
                            if(ele.shape == "drawEcharts") {
                                View2d.$dom.removeChild(ele.element)
                            }
                        })
                    }
                }
            })
            View2d.nodes.forEach( (item, i) => {
                if(item.ID == node.ID) {
                    View2d.nodes[i].zIndex = null
                }
            })
            View2d.activeNode = null
        }
        this.getRectArea = function() {
            let xArr = [], yArr = []
            this.traverse( child => {
                if(child.type == 'line') {
                    child.linePath.forEach( item => {
                        xArr.push(item.x)
                        yArr.push(item.y)
                    })
                }else{
                    xArr.push(child.vertex[0].x, child.vertex[1].x, child.vertex[2].x, child.vertex[3].x)
                    yArr.push(child.vertex[0].y, child.vertex[1].y, child.vertex[2].y, child.vertex[3].y)   
                }
                
            })
            let xMin = Math.min(...xArr),xMax = Math.max(...xArr),yMin = Math.min(...yArr),yMax = Math.max(...yArr)
            let vertex = [
                {x: xMin, y: yMin}, {x: xMax, y: yMin},
                {x: xMax, y: yMax},{x: xMin, y: yMax}, 
            ]
            return vertex
        }
        this.resize = function() {
            _this.width = View2d.$el.parentElement.clientWidth
            _this.height = View2d.$el.parentElement.clientHeight
            View2d.$el.width = _this.width
            View2d.$el.height = _this.height
            View2d.$template.width = _this.width
            View2d.$template.height = _this.height
            View2d.$dom.style.width = _this.width + 'px'
            View2d.$dom.style.height = _this.height + 'px'

            let vertex = _this.getRectArea()
            let rectW = Math.round(vertex[1].x - vertex[0].x)
            let rectH = Math.round(vertex[2].y - vertex[0].y)
            let scaleX = rectW/(_this.width - View2d.mode.padding[0]) / _this.scaleVal.x
            let scaleY = rectH/(_this.height - View2d.mode.padding[1]) / _this.scaleVal.y
            let position = {
                x: vertex[0].x + rectW/2,
                y: vertex[0].y + rectH/2
            }
            let distance = {xl: _this.width/2 - position.x , yl: _this.height/2 - position.y}
            _this.traverse( child => {
                if( child.type !== 'line'){
                    child.position.x += distance.xl
                    child.position.y += distance.yl
                    child.vertex.forEach((item, i) => {
                        child.vertex[i].x += distance.xl
                        child.vertex[i].y += distance.yl
                    }) 
                }else{
                    child.linePath.forEach((item, i) => {
                        child.linePath[i].x += distance.xl
                        child.linePath[i].y += distance.yl
                    })  
                }
            })
            let scale = Math.max(scaleX, scaleY)
            _this.scale({x: _this.width/2, y: _this.height/2}, 1/scale,1/scale)
        }
        // 场景更新
        this.update = function() {
            if(View2d.pen.data !== null) {
                View2d.pen.ctx.clearRect(0,0,_this.width,_this.height)
            }
            let ctx = View2d.ctx 
            ctx.clearRect(0,0,_this.width,_this.height)
            _this.width = View2d.$el.parentElement.clientWidth
            _this.height = View2d.$el.parentElement.clientHeight
            View2d.$el.width = _this.width
            View2d.$el.height = _this.height
            View2d.$template.width = _this.width
            View2d.$template.height = _this.height
            View2d.$dom.style.width = _this.width + 'px'
            View2d.$dom.style.height = _this.height + 'px'
            drawBackground()
            if(View2d.grid.show) drawgrid();
            this.children.sort((a,b) => a.zIndex - b.zIndex)
            this.children.forEach( child => {
                ctx.strokeStyle = '#000'
                ctx.save()
                // ctx.translate(child.position.x, child.position.y)
                // Line
                if(child.constructor === View2d.Line) {
                    drawLine(child, true)
                }
                // Node
                if(child.constructor === View2d.Node) {
                    drawNode(child, true)
                }
                // Group
                if(child.constructor === View2d.Group) {
                    child.traverse( item => {
                        if(item.constructor === View2d.Node) {
                            drawNode(item, true)
                        }else if(item.constructor === View2d.Line){
                            drawLine(item, true)
                        }
                    })
                }
                ctx.restore()
                if(child.helperBox) setHeperBox(child) 
                if(child.freeze && View2d.mode.type == 'edit') setFreezeBk(child)
            })
            if(View2d.baseLine.x.length > 0) drawBaseLine(View2d.baseLine.x);
            if(View2d.baseLine.y.length > 0) drawBaseLine(View2d.baseLine.y);
            if(View2d.checkbox.show) darwCheckbox(View2d.checkbox.start, View2d.checkbox.end)
            if(View2d.pen.data !== null) darwLinePath()
        }
        this.scale = function(position, x,y) {
            const scale_x =  x/this.scaleVal.x
            const scale_y =  y/this.scaleVal.y
            this.position = {...position}
            this.traverse( child => {
                if(child.type !== 'line') {
                    let cX = accountNodeScale(child,scale_x,scale_y)
                    setVertexVal(cX, child)
                    let groupPos = { x: child.position.x - this.position.x, y: child.position.y - this.position.y}
                    let position = getRotatePos(groupPos, {x: 0, y: 0}, (-cX.rotateVal)*Math.PI/180)
                    position.x *= scale_x
                    position.y *= scale_y
                    groupPos = getRotatePos(position, {x: 0, y: 0}, cX.rotateVal*Math.PI/180)

                    resizeEchart(child)
                    let pos = {x: this.position.x + groupPos.x, y: this.position.y + groupPos.y }
                    let translateDistance = {
                        xl: pos.x - child.position.x, 
                        yl: pos.y - child.position.y
                    }
                    child.vertex.forEach((item, i) => {
                        child.vertex[i].x += translateDistance.xl
                        child.vertex[i].y += translateDistance.yl
                    })
                    child.position = pos   
                }else{
                    child.linePath.forEach( (item, i) => {
                        let translateDistance = {
                            xl: this.position.x - item.x, 
                            yl: this.position.y - item.y
                        }
                        child.linePath[i].x  += translateDistance.xl*(1 - scale_x)
                        child.linePath[i].y  += translateDistance.yl*(1 - scale_y)
                    })
                }
            })
            _this.scaleVal = {x, y}
        }
        // 循环子节点
        this.traverse = traverse
        View2d.nodes.push(this)

        if(View2d.$el.attachEvent){
            View2d.$el.attachEvent('onmousewheel',scrollScale);
        }
        if (View2d.$el.addEventListener){//FF,火狐浏览器会识别该方法 
            View2d.$el.addEventListener('DOMMouseScroll',scrollScale,false) 
        }
        View2d.$el.onmousewheel = View2d.$el.onmousewheel = scrollScale;//W3C   
        // 传入option时
        if(Object.keys(option).length > 0) {
            option.nodes = option.nodes.sort((a, b) => a.zIndex - b.zIndex)
            let g = this
            View2d.activeNode = null
            option.nodes.forEach( item => {
                if(item.zIndex !== null) {
                    let node = null
                    if(item.type == 'extraGroup') {
                        item.children.forEach( ele => {
                            if(View2d.mode.type == 'preview') {
                                ele.rotateVal += item.rotateVal
                                ele.scaleVal.x += ele.scaleVal.x * (item.scaleVal.x - 1)
                                ele.scaleVal.y += ele.scaleVal.y * (item.scaleVal.y - 1)  
                            }  
                            if(ele.children == undefined) {
                                if(ele.type == 'node') {
                                    node = new View2d.Node(ele)
                                }else{
                                    node = new View2d.Line(ele)
                                }
                                resizeEchart(node)
                                node.events.forEach(item => {
                                    if(!item.isDrag && item.events !== 'drag') {
                                        node.on(item.events, item.callBack,item.callBack1, item.callBack2)
                                    }
                                })
                            }else {
                                node = new View2d.Group(ele)
                                node = setToNode(node)
                            }
                            node.helperBox = false
                            node.zIndex = null
                            g.add(node) 
                        })
                    }else{
                        if(item.children == undefined) {
                            if(item.type == 'node') {
                                node = new View2d.Node(item)
                            }else{
                                node = new View2d.Line(item)
                            }
                            resizeEchart(node)
                            let events = []
                            node.events.forEach(item => {
                                if(!item.isDrag && item.events !== 'drag') {
                                    node.on(item.events, function(){
                                        eval(item.params.value)
                                    })
                                    events.push(item)
                                }
                            })
                            node.events = events
                        }else {
                            node = new View2d.Group(item)
                            node = setToNode(node)
                            node.events.forEach(item => {
                                if(!item.isDrag && item.events !== 'drag') {
                                    node.on(item.events,function(){
                                        eval(item.params.value)
                                    })
                                    events.push(item)
                                }
                            })
                            node.events = events
                        }
                        node.helperBox = false
                        node.zIndex = null
                        g.add(node)  
                    }
                }
            })

            this.resize()
            
            View2d.baseLine = option.baseLine
            View2d.background = option.background
            View2d.grid = option.grid
        }
    }
    function drawBackground() {
        let bgColor = View2d.background.color || '#000'
        let ctx = View2d.ctx
        ctx.fillStyle = bgColor
        ctx.fillRect(0,0,View2d.$el.width,View2d.$el.height)
        if(!!View2d.background.image) {
            let img = new Image()
            img.src = View2d.background.image
            ctx.drawImage(img,
                0,0,
                View2d.$el.width,
                View2d.$el.height)
        }
    }
    // 绘制grid
    function drawgrid() {
        let {lineWidth,color,step} =  View2d.grid
        let ctx = View2d.ctx
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = color
        for (let index = step.x + lineWidth; index < View2d.$el.width; index += step.x) {
            ctx.beginPath()
            ctx.moveTo(index, 0)
            ctx.lineTo(index, View2d.$el.height)
            ctx.stroke()
        }
        for (let index = step.y + lineWidth; index < View2d.$el.height; index += step.y) {
            ctx.beginPath()
            ctx.moveTo(0, index)
            ctx.lineTo( View2d.$el.width, index)
            ctx.stroke()
        }
    }
    // 绘制基准线
    function drawBaseLine(line) {
        let ctx = View2d.ctx
        ctx.save()
        ctx.strokeStyle =  View2d.baseLine.color
        ctx.lineWidth = View2d.baseLine.lineWidth
        ctx.beginPath()
        ctx.moveTo(line[0].x, line[0].y)
        ctx.lineTo(line[1].x, line[1].y)
        ctx.stroke()
        ctx.restore()
    }
    // 绘制框选box
    function darwCheckbox(start, end) {
        let ctx = View2d.ctx
        ctx.save()
        ctx.strokeStyle =  View2d.checkbox.color
        ctx.fillStyle =  View2d.checkbox.background
        ctx.lineWidth = View2d.checkbox.lineWidth  
        ctx.beginPath()
        ctx.rect(start.x, start.y, end.x - start.x,end.y - start.y)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }
    // 循环子节点
    function traverse(callBack) {
        this.children.forEach((child, i) => {
            if(child.constructor == View2d.Group && child.children.length > 0) {
                child.traverse(callBack)
                callBack(child)
            }else{
                callBack(child)
            }
        })
    }
    /** 
     * node（Node或Group）
     * boolean(false仅绘制路径不渲染图形， true绘制路径并渲染图形)
     * */
    function drawLine(node, boolean) {
        let ctx = View2d.ctx
        ctx.save()
        eval(node.shape + '(node, !!boolean)')
        ctx.restore()
    }
    let allRotate = 0, allScale = {x: 1,y: 1}
    function drawNode(node, boolean) {
        let ctx = View2d.ctx
        ctx.save()
        ctx.lineWidth = node.lineWidth || 1
        ctx.shadowOffsetX = node.shadowOffsetX || 0;
        ctx.shadowOffsetY = node.shadowOffsetY || 0;
        ctx.shadowColor = node.shadowColor || 'orange';
        ctx.shadowBlur = node.shadowBlur || 0;
        allRotate = 0
        let scene = View2d.nodes.find( item => item.constructor === View2d.scene)
        allScale = {...scene.scaleVal}
        parentTransform.call(node)
        let parent = node.findParent()
        // View2d.ctx.translate( node.position.x - parent.position.x,node.position.y - parent.position.y )
        // View2d.ctx.scale(allScale.x,allScale.y)
        // View2d.ctx.rotate(allRotate)
        ctx.setTransform(
            Math.cos(allRotate),
            Math.sin(allRotate),
            -Math.sin(allRotate), 
            Math.cos(allRotate), 
            node.position.x, node.position.y
        );
        ctx.scale(allScale.x,allScale.y)
        node.allScale = allScale
        node.allRotate = allRotate
        if( typeof node.createNode === 'function') {
            let str = node.createNode.toString()
            let reg = /\/\/(?=ctx.fill\(\)|ctx.stroke\(\))/g
            let nodeFunc = str.replace(reg, '')
            node.createNode = new Function('return '+ nodeFunc)()
            node.createNode( {ctx,node, x: node.originPosition.x, y: node.originPosition.y})
        }else{
            eval(node.shape + '(node, !!boolean)')
        }
        ctx.scale(1/allScale.x,1/allScale.y)
        autoText(node, scene)
        ctx.restore() 
    }
    function parentTransform() {
        if(this.parentId !== undefined) {
            let parentNode = View2d.nodes.find( item => item.ID == this.parentId)
            parentTransform.call(parentNode)
        }
        allRotate += this.rotateVal*Math.PI/180
        allScale = {x: this.scaleVal.x*allScale.x, y: this.scaleVal.y*allScale.y} 
    }
    // 绘制文本
    function autoText(node, scene) {
        let ctx = View2d.ctx
        ctx.textBaseline = "middle";
        let scale = {x: 1, y: 1}
        scale.x = scene.scaleVal.x
        scale.y = scene.scaleVal.y
        ctx.scale(scale.x,scale.y) 
        const {
            color,fontSize,fontFamily,
            lineHeight,fontWeight,fontStyle,
            textAlign,textVertical,padding,
            textShadowOffsetX,textShadowOffsetY,
            textShadowColor,textShadowBlur
        } = node.text
        ctx.fillStyle = color
        ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

        ctx.shadowOffsetX = textShadowOffsetX;
        ctx.shadowOffsetY = textShadowOffsetY;
        ctx.shadowColor = textShadowColor;
        ctx.shadowBlur = textShadowBlur;

        let delValX = node.vertex[0].x - node.vertex[1].x, delValY = node.vertex[0].y - node.vertex[1].y
        let nodeW = Math.sqrt(delValX * delValX + delValY * delValY) - padding[1]*2 * scale.x
        let delValX1 = node.vertex[1].x - node.vertex[2].x, delValY1 = node.vertex[1].y - node.vertex[2].y
        let nodeH = Math.sqrt(delValX1 * delValX1 + delValY1 * delValY1) - padding[0]*2 * scale.x

        let width = 0
        let text = node.text.content || ''
        let textW = ctx.measureText(text).width * scale.x
        let rows = Math.ceil(textW/nodeW)
        let spaceX = rows > 1 ? 0 : (nodeW - textW)/2
        let spaceY = (nodeH - rows*lineHeight * scale.x)/2
        switch(textVertical) {
            case 'top': spaceY = 0;
                break;
            case 'bottom': spaceY = 0;
                nodeH = -nodeH + rows*lineHeight * scale.x*2 + lineHeight * scale.x;
                break;
        }
        switch(textAlign) {
            case 'left': spaceX = 0;
                break;
            case 'right': spaceX = rows > 1 ? 0 : (nodeW - textW)
                break;
        }
        let startX = -nodeW/2 + spaceX; 
        let startY = -nodeH/2 + spaceY + lineHeight * scale.x/2
       
        ctx.beginPath()
        for(let i = 0; i < text.length; i++) {
            let w = ctx.measureText(text[i]).width * scale.x
            if(width + w >= nodeW) {
                width = 0
                startY += lineHeight * scale.x
                if(ctx.measureText(text.slice(i)).width * scale.x < nodeW && textAlign !== 'left') {
                    if(textAlign == 'center') {
                        startX = -ctx.measureText(text.slice(i)).width * scale.x/2
                    }else{
                        startX = nodeW/2 - ctx.measureText(text.slice(i)).width * scale.x
                    }
                }else{
                    startX = -nodeW/2
                }
            }
            ctx.fillText(text[i],startX/scale.x,startY/scale.x)
            startX += w  
            width += w
        }
    }
    // 节点选中时的边框
    function setHeperBox(node) {
        let ctx = View2d.ctx
        if(node.type !== 'line') {
            let parent = node.findParent()
            ctx.save()
            // 边框
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.strokeStyle = node.freeze ? '#ccc':'#2cafe7'
            ctx.fillStyle = '#fff'
            node.vertex.forEach( (item, i) => {
                ctx.save()
                ctx.translate(item.x, item.y)
                ctx.rotate(parent.rotateVal*Math.PI/180)
                ctx.lineTo(0, 0)
                ctx.restore()
            })
            ctx.closePath()
            ctx.stroke()
            // 旋转点
            let centerPoint = {
                x: node.vertex[0].x + (node.vertex[1].x - node.vertex[0].x)/2,
                y: node.vertex[0].y +(node.vertex[1].y - node.vertex[0].y)/2
            }
            ctx.strokeStyle =  node.freeze ? '#ccc':'#2cafe7'
            ctx.fillStyle = '#fff'
            ctx.beginPath()
            ctx.moveTo(centerPoint.x, centerPoint.y)
            ctx.lineTo(centerPoint.x + 50*Math.sin(node.rotateVal*Math.PI/180),
            centerPoint.y - 50*Math.cos(node.rotateVal*Math.PI/180))
            ctx.stroke()
            ctx.beginPath()
            ctx.arc(
                centerPoint.x + 50*Math.sin(node.rotateVal*Math.PI/180),
                centerPoint.y - 50*Math.cos(node.rotateVal*Math.PI/180),
            6, 0, 2*Math.PI)
            ctx.stroke()
            ctx.fill()
            // 控制点
            ctx.beginPath()
            ctx.strokeStyle = node.freeze ? '#ccc':'#2cafe7'
            ctx.fillStyle = '#fff'
            node.vertex.forEach( (item, i) => {
                ctx.save()
                ctx.translate(item.x, item.y)
                ctx.rotate(parent.rotateVal*Math.PI/180)
                ctx.lineTo(0, 0)
                ctx.strokeRect(-5,-5, 10, 10)
                ctx.fillRect(-5,-5, 10, 10)
                ctx.restore()

                ctx.save()
                let x, y;
                if( i !== node.vertex.length - 1) {
                    x = node.vertex[i].x - (node.vertex[i].x - node.vertex[i + 1].x)/2
                    y = node.vertex[i].y - (node.vertex[i].y - node.vertex[i + 1].y)/2
                }else{
                    x = node.vertex[i].x - (node.vertex[i].x - node.vertex[0].x)/2
                    y = node.vertex[i].y - (node.vertex[i].y - node.vertex[0].y)/2
                }
                ctx.translate(x, y)
                ctx.rotate(parent.rotateVal*Math.PI/180)
                ctx.strokeRect(-5,-5, 10, 10)
                ctx.fillRect(-5,-5, 10, 10)
                ctx.restore()
            })
            
            ctx.restore()
            if(node.constructor === View2d.Group) {
                node.traverse( child => {
                    ctx.lineWidth = 1
                    ctx.strokeStyle = node.freeze ? '#ccc':'#2cafe7'
                    ctx.beginPath()
                    child.vertex.forEach( item => {
                        ctx.lineTo(item.x, item.y)
                    })
                    ctx.closePath()
                    ctx.stroke()
                })
            }  
        }else{
            ctx.save()
            node.linePath.forEach( (item, i) => {
                let position = {x: item.x, y: item.y}
                if(item.id !== undefined) {
                    let data = getNodeById(item.id)
                    if(data !== undefined){ 
                        position = data.position
                    }else{
                        node.linePath[i].id = undefined
                    }
                    node.linePath[i].x = position.x
                    node.linePath[i].y = position.y
                }
                if(node.helperBox) {
                    ctx.fillStyle = node.freeze ? '#ccc': 'orange'
                    ctx.beginPath()
                    ctx.arc(position.x, position.y,5,0,2*Math.PI)
                    ctx.fill()
                }
            })
            ctx.restore()
        }
    }
    function getNodeById(id) {
        return View2d.nodes.find( node => node.ID == id)
    }
    // 图形路径
    function darwLinePath() {
        let ctx = View2d.pen.ctx
        let data = View2d.pen.data

        ctx.save()
        ctx.lineWidth = data.lineWidth || 1
        eval(data.shape + '(data, true, ctx)')
        ctx.restore()

        ctx.strokeStyle =  View2d.pen.color || '#fff'
        ctx.lineWidth = View2d.pen.lineWidth || 1
        if(View2d.pen.showPath || data.shape == 'waterCapacity') {
            ctx.save()
            ctx.beginPath()
            _darwlinePath(data.linePath, ctx)
            ctx.restore()
            ctx.stroke()  
        }
    }
    //冻结时变灰色
    function setFreezeBk(node) {
        let ctx = View2d.ctx
        ctx.save() 
        ctx.strokeStyle = '#ccc'
        ctx.beginPath()
        ctx.fillStyle = 'rgba(10,10,25,0.5)'
        node.vertex.forEach( item => {
            ctx.lineTo(item.x, item.y)
        })
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
        ctx.restore()
    }

    View2d.Line = function(data={}) {
        data.color = typeof data.color == 'undefined'? View2d.color : data.color
        data.color = [...data.color]
        this.type = 'line'
        this.name = 'line' + View2d.nodes.length + 1
        this.zIndex = null
        this.vertex = []  
        this.events = []
        this.helperBox = false
        this.dragEvents = []
        this.rotateVal = 0
        this.scaleVal = {x: 1, y: 1}
        this.linePath = []
        this.color = typeof data.color == 'undefined'? View2d.color : data.color
        this.color = [...this.color]
        data.linePath.forEach( item => {
            this.linePath.push({...item})
        })
        for( let k in data) {
            this[k] = this[k] || data[k]
        }
        this.ID = this.ID || uuid()
        View2d.nodes.push(this) //保存node节点 
    }
    View2d.Line.prototype.findParent = findParent
    View2d.Line.prototype.clone = clone
    View2d.Line.prototype.checkPointInPath = checkPointInPath
    View2d.Line.prototype.on = setEvents
    View2d.Line.prototype.off = offEvents
    View2d.Line.prototype.offAll = offAllEvents
    /**
     * 创建canvas图形group
     * 多个node或group进行组合
     * group.ID唯一标识id
     * group.name组合图形名称
     * group.zIndex设置组合图形层次
     * */
    View2d.Group = function(data={}) {
        if(data.vertex !== undefined) {
            data = deepClone(data)
            for( let k in data) {
                this[k] = data[k]
            } 
            this.name = 'group' + View2d.nodes.length + 1
            this.ID = this.ID || uuid()
            View2d.nodes.push(this)
            return false //clone时不需要继续操作
        }
        this.type="group"
        this.freeze = false
        this.children = []
        this.events = []
        this.dragEvents = []
        this.helperBox = false
        this.zIndex = null
        this.rotateVal = 0
        this.scaleVal = {x: 1, y: 1}
        this.groupPosition = {x: 0, y: 0}
        this.originPosition = {x: 0, y: 0}
        this.position = {x: 0, y: 0}
        this.DValue = {x: 0, y: 0}
        this.name = data.name || 'group' + View2d.nodes.length + 1
        if(Object.keys(data).length > 0) {
            this.originPosition = {...data.position}
            this.position = {...data.position}
            for( let k in data) {
                this[k] = data[k]
            }
        }
        this.ID = this.ID || uuid()
        View2d.nodes.push(this) //保存node节点 
    }
    View2d.Group.prototype.add = function(){
        this.scaleVal = {x: 1, y: 1}
        this.rotateVal = 0
        this.children.forEach( item => {
            item.rotateVal += this.rotateVal
            item.scaleVal.x += (this.scaleVal.x - 1)*item.scaleVal.x
            item.scaleVal.y += (this.scaleVal.y - 1)*item.scaleVal.y
        })
        let scene = View2d.nodes.find( item => item.constructor === View2d.scene)
        let xArr = [], yArr = []
        if(this.vertex !== undefined) {
            xArr = [this.vertex[0].x,this.vertex[1].x]
            yArr = [this.vertex[0].y,this.vertex[2].y]  
        }
        for (let i in arguments) {
            scene.children.forEach( child => {
                if(child.ID === arguments[i].ID) {
                    scene.remove(child)
                    if(child.shape=="drawEcharts") {
                        View2d.$dom.appendChild(child.element)
                    }
                }
            })
            this.children.push(arguments[i])
            arguments[i].parentId = this.ID
            /** 子节点Node的所有顶点 
             * 组和到数组
             * 然后找到组合数组的最值组和成新节点group的顶点
             * **/ 
            if(arguments[i].constructor === View2d.Group) {
                arguments[i].traverse( item => {
                    if(item.constructor === View2d.Node) {
                        xArr.push(...item.vertex.map(val => val.x))
                        yArr.push(...item.vertex.map(val => val.y))
                    }
                })
            }else{
                if(arguments[i].type !== 'line') {
                    xArr.push(...arguments[i].vertex.map(val => val.x))
                    yArr.push(...arguments[i].vertex.map(val => val.y))
                }else{
                    xArr.push(...arguments[i].linePath.map(val => val.x))
                    yArr.push(...arguments[i].linePath.map(val => val.y))
                }
            }
        }
        let xMin = Math.min(...xArr),xMax = Math.max(...xArr),yMin = Math.min(...yArr),yMax = Math.max(...yArr)
        this.vertex = [
          {x: xMin, y: yMin}, {x: xMax, y: yMin},
          {x: xMax, y: yMax},{x: xMin, y: yMax}, 
        ]
        // 设置中心点和设置vertex
        let center = {
            x: xMin + (xMax - xMin)/2,
            y: yMin + (yMax - yMin)/2
        }
        this.position = {...center}
        this.originPosition = {...center}
        let parent = this.findParent()
        center = {...parent.position}
        this.children.forEach( item => {
            item.groupPosition = {
                x: item.position.x - this.position.x, 
                y: item.position.y - this.position.y
            }
        })
    }
    View2d.Group.prototype.remove = function(){
        let xArr = [],yArr = []
        let temp = []
        this.children.forEach( (child, i) => {
            let select = false
            for(let k in arguments) {
                if(child.ID == arguments[k].ID) {
                    child.rotateVal += this.rotateVal
                    child.scaleVal.x += (this.scaleVal.x - 1)*child.scaleVal.x
                    child.scaleVal.y += (this.scaleVal.y - 1)*child.scaleVal.y
                    arguments[k].groupPosition = {x: 0, y: 0}
                    arguments[k].zIndex = null
                    arguments[k].parentId = undefined
                    select = true
                }
            }
            if(!select) temp.push(child)
        })
        this.children = temp
        this.traverse( item => {
            item.vertex.forEach( val => {
                xArr.push(val.x)
                yArr.push(val.y)
            }) 
        })
        let xMin = Math.min(...xArr),xMax = Math.max(...xArr),yMin = Math.min(...yArr),yMax = Math.max(...yArr)
        this.vertex = [
            {x: xMin, y: yMin}, {x: xMax, y: yMin},
            {x: xMax, y: yMax},{x: xMin, y: yMax}, 
        ]
        // 设置中心点和设置vertex
        let center = {
            x: xMin + (xMax - xMin)/2,
            y: yMin + (yMax - yMin)/2
        }
        this.position = {...center}
        this.traverse( item => {
            if(item.type !=='line') {
                item.rotateVal += this.rotateVal
                item.scaleVal.x += (this.scaleVal.x - 1)*item.scaleVal.x
                item.scaleVal.y += (this.scaleVal.y - 1)*item.scaleVal.y
                item.groupPosition = {
                    x: item.position.x - this.position.x, 
                    y: item.position.y - this.position.y
                }   
            }
        }) 
        this.scaleVal = {x: 1, y: 1}
        this.rotateVal = 0
    }
    //组合Group
    View2d.Group.prototype.combine = function () {
        if(this.type=='extraGroup') {
            let scene = View2d.nodes.find( item => item.constructor == View2d.scene)
            let children = this.children
            this.children = []
            let g = this.clone()
            children.forEach( child => {
                child.parentId = g.ID
            })
            g.children = children.sort( (a, b) => a.zIndex - b.zIndex)
            g.type = "group"
            scene.remove(this)   
            scene.add(g)
            View2d.activeNode = g
        }
    }
    //取消组合Group
    View2d.Group.prototype.unCombine = function () {
        let scene = View2d.nodes.find( item => item.constructor == View2d.scene)
        this.children.forEach( node => {
            scene.remove(this)
            if(node.type !== 'line') {
                node.rotateVal += this.rotateVal
                node.scaleVal.x += node.scaleVal.x * (this.scaleVal.x - 1)
                node.scaleVal.y += node.scaleVal.y * (this.scaleVal.y - 1)
            }
            if(node.type === 'group') {
                node.groupPosition = {x: 0, y: 0}
            }
            if(node.shape == "drawEcharts") {
                View2d.$dom.appendChild(node.element)
            }
            if(node.constructor == View2d.Group) {
                node.traverse( ele => {
                    if(ele.shape == "drawEcharts") {
                        View2d.$dom.appendChild(ele.element)
                    }
                })
            }
            scene.add(node)
        })
        this.children = []
    }
    View2d.Group.prototype.findParent = findParent
    View2d.Group.prototype.accountVertex = accountVertex
    View2d.Group.prototype.translate = translate
    View2d.Group.prototype.rotate = rotate
    View2d.Group.prototype.clone = clone
    View2d.Group.prototype.checkPointInPath = checkPointInPath
    View2d.Group.prototype.traverse = traverse
    View2d.Group.prototype.on = setEvents
    View2d.Group.prototype.scale = scale
    View2d.Group.prototype.off = offEvents
    View2d.Group.prototype.offAll = offAllEvents
    /**
     * 创建canvas图形node
     * node.ID唯一标识id
     * node.name图形名称
     * node.zIndex设置图形层次
    **/
    var eventsList = []
    var hasSetEvent = []
    var dragStartOffset = {}
    var dragNodeZIndex = null
    var isDrag = false
    View2d.Node = function(data) {
        if(data.linePath !== undefined && data.linePath.length < 2) {
            data.color = typeof data.color == 'undefined'? View2d.color : data.color
            data.color = [...data.color]
            View2d.pen.data = data
            return false
        }
        if(data.vertex !== undefined) {
            data = deepClone(data)
            for( let k in data) {
                if(data.hasOwnProperty(k) && data[k] !== undefined) {
                    this[k] = data[k]
                }
            } 
            handleElement(data, this)
            this.helperBox = false
            this.name = 'node' + View2d.nodes.length + 1
            this.ID = this.ID || uuid()
            View2d.nodes.push(this)
            return false //clone时不需要继续操作, 直接将对象转成View.node
        }
        this.events = []
        this.dragEvents = []
        this.type="node"
        this.rotateVal = data.rotateVal || 0
        this.scaleVal = {x: 1, y: 1}
        this.createNode = null
        this.freeze = false
        this.originPosition = {...data.position}
        this.color = typeof data.color == 'undefined'? View2d.color : data.color
        this.color = [...this.color]
        this.text = textDefault(data.text)
        this.shadowOffsetX = data.shadowOffsetX || 0;
        this.shadowOffsetY = data.shadowOffsetY || 0;
        this.shadowColor = data.shadowColor || 'orange';
        this.shadowBlur = data.shadowBlur || 0;
        this.border = borderDefault(data.border)
        if(data.position == undefined) this.originPosition = {x: 0, y: 0}
        this.position = {...data.position}
        this.name = data.name || 'node' + View2d.nodes.length + 1
        // this.nodeId = View2d.nodes.length + 1
        this.ID = this.ID || uuid()
        this.zIndex = null
        this.helperBox = false
        this.vertex = []
        this.groupPosition = data.groupPosition || {x: 0, y: 0}
        this.DValue = {x: 0, y: 0}//坐标差值
        let ctx = View2d.ctx
        ctx.save()
        // 封装的图形
        ctx.translate(this.position.x, this.position.y)
        ctx.rotate(this.rotateVal*Math.PI/180)
        ctx.scale(this.scaleVal.x,this.scaleVal.y)
        handleElement(data, this)
        if(typeof data !== 'function' && typeof data.createNode !== 'function' ) {
            this.drawType = data.drawType || 'fill'
            this.lineWidth = data.lineWidth || 1
            for( let k in data) {
                this[k] = this[k] || data[k]
            } 
            eval(data['shape'] + '(this, true)')
            this.accountVertex()  
            ctx.restore()
        }else{
            ctx.restore()
            // 用户自定义图形函数
            let reg = /(?=ctx.stroke\(\)|ctx.fill\(\))/g
            let reg1 = /(?=\/\/ctx.stroke\(\)|\/\/ctx.fill\(\))/g
            let nodeFunc = null
            if(typeof data == 'function') {
                nodeFunc = data.toString()
            }else{
                nodeFunc = data.createNode.toString()
                for( let k in data) {
                    this[k] = data[k]
                } 
                View2d.nodes.push(this)
            }
            nodeFunc = nodeFunc.replace(reg, '//')
            nodeFunc = nodeFunc.replace(reg1, 'this.accountVertex();')
            this.createNode = new Function('return '+ nodeFunc)()
            this.createNode( {ctx,node: this, x: 0, y: 0} )
            nodeFunc = nodeFunc.replace(/this.accountVertex\(\);/g, '')
            this.createNode = new Function('return '+ nodeFunc)()
        }
    }
    View2d.Node.prototype.accountVertex = accountVertex
    View2d.Node.prototype.translate = translate
    View2d.Node.prototype.rotate = rotate
    View2d.Node.prototype.scale = scale
    View2d.Node.prototype.clone = clone
    View2d.Node.prototype.findParent = findParent
    View2d.Node.prototype.checkPointInPath = checkPointInPath
    View2d.Node.prototype.linearGradient = linearGradient
    View2d.Node.prototype.radialGradient = radialGradient
    View2d.Node.prototype.on = setEvents
    View2d.Node.prototype.off = offEvents
    View2d.Node.prototype.offAll = offAllEvents
    function textDefault(text = {}) {
        let defaultVal = {}
        defaultVal.content = text.content || ''
        defaultVal.color = text.color || '#fff'
        defaultVal.fontSize = text.fontSize || 20
        defaultVal.fontFamily = text.fontFamily || 'Sans-serif'
        defaultVal.lineHeight = text.lineHeight || defaultVal.fontSize + 5
        defaultVal.fontWeight = text.fontWeight || 'normal'
        defaultVal.fontStyle = text.fontStyle || 'normal'
        defaultVal.textAlign = text.textAlign || 'center'
        defaultVal.textVertical = text.textVertical || 'center'
        defaultVal.padding = text.padding || [0,0]

        defaultVal.shadowOffsetX = text.textShadowOffsetX || 0;
        defaultVal.shadowOffsetY = text.textShadowOffsetY || 0;
        defaultVal.shadowColor = text.textShadowColor || 'orange';
        defaultVal.shadowBlur = text.textShadowBlur || 0;
        return defaultVal
    }
    function borderDefault(border={}) {
        let defaultVal = {}
        defaultVal.show = border.show || false,
        defaultVal.color = border.color || '#ccc'
        defaultVal.lineWidth = border.lineWidth || 1
        defaultVal.lineCap = border.lineCap || 'square'
        defaultVal.lineJoin = border.lineJoin || 'round'
        defaultVal.lineDash = border.lineDash || [0,0]
        return defaultVal
    }
    // 计算vertex
    function accountVertex() {
        this.params = this.params || {w: 500, h: 500}
        let nodeW = this.params.w || this.params.r
        let nodeH = this.params.h || this.params.r
        
        // let startX = (this.position.x - nodeW)
        // let endX = this.position.x + nodeW 
        
        // let startY = this.position.y - nodeH
        // let endY = this.position.y + nodeH
        View2d.nodes.push(this) //保存node节点
        let xMax = 0,yMax = 0,xMin = 9999,yMin = 9999;
        for(let i = 0; i<=View2d.$el.width; i+= 1) {
            for(let j = 0; j<=View2d.$el.height; j+= 1) {
                if(View2d.ctx.isPointInPath(i,j)) {
                    xMax = xMax > i ? xMax : i
                    yMax = yMax > j ? yMax : j
                    xMin = xMin < i ? xMin : i
                    yMin = yMin < j ? yMin : j
                }
            }
        } 

        let center = {
            x: xMin + (xMax - xMin)/2,
            y: yMin + (yMax - yMin)/2
        }
        if(Object.keys( this.position ).length == 0 || this.parentId == undefined) {
            // if(Object.keys( this.position ).length !== 0) {
            //     // 处理图形中心位置坐标不是position时,保存差值
            //     this.DValue = {x: this.position.x - center.x, y:  this.position.y - center.y}
            //     this.position = {x: center.x + this.DValue.x, y: center.y + this.DValue.y}
            //     this.originPosition = {...center}
            // }else{
            //     this.position = {...center}
            //     this.originPosition = {...center} 
            // }
            this.vertex = [
              {x: xMin, y: yMin}, {x: xMax, y: yMin},
              {x: xMax, y: yMax},{x: xMin, y: yMax}, 
            ]
        }else{
            this.groupPosition = {x: this.position.x - center.x, y:  this.position.y - center.y} 
            this.vertex = [
              {x: xMin+this.groupPosition.x, y: yMin+this.groupPosition.y}, 
              {x: xMax+this.groupPosition.x, y: yMin+this.groupPosition.y},
              {x: xMax+this.groupPosition.x, y: yMax+this.groupPosition.y},
              {x: xMin+this.groupPosition.x, y: yMax+this.groupPosition.y},
            ]
        }
        let scene = View2d.nodes.find( item => item.constructor === View2d.scene)
        this.scale(scene.scaleVal.x, scene.scaleVal.y)
        this.scaleVal = {x: 1, y:1}
    }
    function handleElement(data, that) {
        if(data.shape == 'drawEcharts') {
            let div = document.createElement('div')
            div.style.width = data.params.w + 'px'
            div.style.height = data.params.h + 'px'
            div.style.position = 'absolute'
            div.style.zIndex = 999
            div.style.display = View2d.mode.type == 'preview'?'block':'none'
            that.element = div
            View2d.$dom.appendChild(div)
            let myChart = echarts.init(div)
            data.echartsOption.color = data.echartsOption.color || View2d.color
            myChart.setOption(data.echartsOption, true) 
            setTimeout(() => {
                let caV = myChart.getDataURL()
                let img = new Image()
                img.src = caV
                that.canvasImg = img
            }, 500)
        }
        if(data.shape == 'drawVideo') {
            let video = document.createElement('video')
            video.autoplay = that.autoplay = data.autoplay
            video.src = that.src = data.src
            video.onerror = () => {  that.src = false}
            that.element = video
        }
        if(data.shape == 'drawImage') {
            let img = new Image()
            img.src = that.src = data.src
            img.setAttribute("crossOrigin",'anonymous')
            that.element = img
        } 
        if(data.shape == 'dom') {
            let div = document.createElement('div')
            div.style.width = data.params.w + 'px'
            div.style.height = data.params.h + 'px'
            div.style.position = 'absolute'
            div.style.zIndex = 999
            that.element = div
            View2d.$dom.appendChild(div)
        } 
    }
    function findParent() {
        let parent = {}
        if(this.parentId !== undefined) {
            let parentNode = View2d.nodes.find( item => item.ID == this.parentId)
            parent = parentNode.findParent()
        }else{
            parent = this
        }
        return parent
    }
    
    function uuid() {
        var s = [];
        var hexDigits =  "0123456789abcdef" ;
        for ( var  i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] =  "4" ;   // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);   // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] =  "-" ;
        var uuid = s.join("");
        return uuid;
    }
    function accountNodeScale(node,scaleX,scaleY) {
        nodeRotateVal = 0
        nodeRotate.call(node)
        let rotateVal = nodeRotateVal*180/Math.PI
        let vertex = node.vertex
        let delValX = vertex[0].x - vertex[1].x, delValY = vertex[0].y - vertex[1].y
        let xl = Math.sqrt(delValX * delValX + delValY * delValY)/2
        let delValX1 = vertex[1].x - vertex[2].x, delValY1 = vertex[1].y - vertex[2].y
        let yl = Math.sqrt(delValX1 * delValX1 + delValY1 * delValY1)/2

        let rx0 = xl*(scaleX - 1)
        let ry0 = yl*(scaleY - 1)

        let dx = Math.cos(rotateVal*Math.PI/180)*rx0
        let dy = Math.sin(rotateVal*Math.PI/180)*rx0

        let dx1 = Math.sin(rotateVal*Math.PI/180)*ry0
        let dy1 = Math.cos(rotateVal*Math.PI/180)*ry0

        return {dx, dx1, dy, dy1, rotateVal}  
    }
    let nodeRotateVal = 0
    function nodeRotate() {
        if(this.parentId !== undefined) {
            let parentNode = View2d.nodes.find( item => item.ID == this.parentId)
            nodeRotate.call(parentNode)
        }
        nodeRotateVal += this.rotateVal*Math.PI/180
    }
    function setVertexVal(data,node) {
        let {dx, dx1, dy, dy1} = data

        node.vertex[0].x += -dx + dx1;
        node.vertex[0].y += -dy - dy1;

        node.vertex[3].x += -dx - dx1;
        node.vertex[3].y += -dy + dy1;

        node.vertex[1].x += dx + dx1;
        node.vertex[1].y += dy - dy1;

        node.vertex[2].x += dx - dx1;
        node.vertex[2].y += dy + dy1; 
    }
      /**
    * node.scale 节点缩放函数
    * */
    function scale(scaleX, scaleY) {
        scaleX = Number(scaleX.toFixed(2))
        scaleY = Number(scaleY.toFixed(2))
        const scale_x =  scaleX/this.scaleVal.x
        const scale_y =  scaleY/this.scaleVal.y
        let pX = accountNodeScale(this,scale_x,scale_y)
        setVertexVal(pX, this)
       
        // 改变子顶点位置
        if(this.constructor == View2d.Group) {
            this.traverse( child => {
                if(child.type !== 'line') {
                    let cX = accountNodeScale(child,scale_x,scale_y)
                    setVertexVal(cX, child)
                    let parentNode = View2d.nodes.find( item => item.ID == child.parentId)
                    let position = getRotatePos(child.groupPosition, {x: 0, y: 0}, (-cX.rotateVal)*Math.PI/180)
                    position.x *= scale_x
                    position.y *= scale_y
                    child.groupPosition = getRotatePos(position, {x: 0, y: 0}, cX.rotateVal*Math.PI/180)
                    child.translate({x: parentNode.position.x + child.groupPosition.x, y: parentNode.position.y + child.groupPosition.y })
                    resizeEchart(child)  
                }else{
                    nodeRotateVal = 0
                    nodeRotate.call(child)
                    child.linePath.forEach( (item, i) => {
                        let point = getRotatePos(item, this.position, -nodeRotateVal)
                        let translateDistance = {
                            xl: this.position.x - point.x, 
                            yl: this.position.y - point.y
                        }
                        point.x  += translateDistance.xl*(1 - scale_x)
                        point.y  += translateDistance.yl*(1 - scale_y)
                        child.linePath[i] = {
                            type: item.type,
                            id: item.id,
                            ...getRotatePos(point, this.position, nodeRotateVal)
                        }
                    })
                    nodeRotateVal = 0
                }
            })
        }
        this.scaleVal = {x: scaleX,y: scaleY}
        resizeEchart(this)
    }
    function resizeEchart(node) {
       if(!!node.echartsOption) {
           setTimeout(() => {
                let myChart = echarts.init(node.element)
                myChart.resize()
           }, 50);
        } 
    }
    /**
     * node.rotate 节点旋转函数
     * */
    let rotateTimer = null
    function rotate(angle) {
      if(!!rotateTimer) return 
      rotateTimer = setTimeout(() => {
        let rx0 = this.position.x
        let ry0 = this.position.y
        let a = (angle - this.rotateVal)*Math.PI/180
        this.rotateVal = angle
        this.vertex.forEach( (item, i) => {
          let x = (item.x - rx0)*Math.cos(a) - (item.y - ry0)*Math.sin(a) + rx0 ;
          let y = (item.x - rx0)*Math.sin(a) + (item.y - ry0)*Math.cos(a) + ry0 ;
          this.vertex[i] = {x, y}
        })
        // 改变子顶点位置
        if(this.constructor == View2d.Group) {
            this.traverse( child => {
                if(child.type !== 'line') {
                    let xArr = [],yArr = []
                    child.vertex.forEach((item, i) => {
                        let x = (item.x - rx0)*Math.cos(a) - (item.y - ry0)*Math.sin(a) + rx0 ;
                        let y = (item.x - rx0)*Math.sin(a) + (item.y - ry0)*Math.cos(a) + ry0 ;
                        child.vertex[i] = {x, y}
                        xArr.push(x)
                        yArr.push(y)
                        // 设置中心点和设置vertex
                    })
                    let xMin = Math.min(...xArr),xMax = Math.max(...xArr),yMin = Math.min(...yArr),yMax = Math.max(...yArr)
                    child.position = {
                        x: xMin + (xMax - xMin)/2,
                        y: yMin + (yMax - yMin)/2
                    }
                    // + child.DValue.x*View2d.activeNode.scaleVal.x
                    child.groupPosition = getRotatePos(child.groupPosition, {x: 0, y: 0}, a)   
                }else{
                    child.linePath.forEach((item, i) => {
                        child.linePath[i] ={ 
                            type: item.type,
                            id: item.id,
                            ...getRotatePos(item, this.position, a)
                         }  
                    })
                }
            })
        }
        rotateTimer = null
      }, 30)
    }
    /**
     * 
     * node.translate 节点平移函数
     * */
    function translate(position) {
        let translateDistance = {
            xl: position.x - this.position.x, 
            yl: position.y - this.position.y
        }
        this.vertex.forEach((item, i) => {
          this.vertex[i].x += translateDistance.xl
          this.vertex[i].y += translateDistance.yl
        })
        this.position.x = position.x
        this.position.y = position.y
        // 改变子节点位置
        if(this.constructor == View2d.Group) {
            this.traverse( child => {
                if(child.type !== 'line') {
                    child.position.x += translateDistance.xl
                    child.position.y += translateDistance.yl
                    child.vertex.forEach((item, i) => {
                        child.vertex[i].x += translateDistance.xl
                        child.vertex[i].y += translateDistance.yl
                    })
                }else{
                    child.linePath.forEach((item, i) => {
                        child.linePath[i].x += translateDistance.xl
                        child.linePath[i].y += translateDistance.yl
                    })
                }
            })
        }
    }
     /**
     * node.clone 节点克隆（深拷贝）
     * */
    function clone() {
        let cloneNode = {}
        cloneNode = deepClone(this)
        cloneNode.zIndex = null
        cloneNode.ID = uuid()
        if(cloneNode.children === undefined) {
            if(cloneNode.type == 'node') {
                cloneNode = new View2d.Node(cloneNode)
            }else{
                cloneNode = new View2d.Line(cloneNode)
            }
        }else{
            cloneNode = new View2d.Group(cloneNode)
            cloneNode = setToNode(cloneNode)
        }
        return cloneNode
    }
    // 深拷贝
    function deepClone(data) {
        let temp = null
        if(data instanceof Object 
        && typeof data !== 'function' 
        && data.constructor !== RegExp) {
            temp = Array.isArray(data) ? [] : {} 
            for(let k in data) {
                if(k !== 'element' && k !== 'color' && k !== 'canvasImg') {
                    if(data instanceof Array || data.hasOwnProperty(k)) {
                        temp[k] = deepClone(data[k]) 
                    }  
                }else{
                    temp[k] = data[k]
                }
            }
            return temp
        }
        return data
    }
    // 对象转成View2d.Node
    function setToNode(cloneNode) {
        cloneNode.children.forEach( (child, i) => {
            child.parentId = cloneNode.ID
            child.ID = uuid()
            if(child.children == undefined) {
                if(child.type == 'node') {
                    cloneNode.children[i] = new View2d.Node(child)
                }else{
                    cloneNode.children[i] = new View2d.Line(child)
                }
                return cloneNode
            }else{
                cloneNode.children[i] = new View2d.Group(child)
                cloneNode.children[i] = setToNode(cloneNode.children[i])
            }
        })
        return cloneNode
    }
    /**
     * node.on节点移除事件
    * **/
    function offEvents(events) {
        let eventTypesList = this.events.map( item => item.events)
        if(eventTypesList.indexOf(events) > -1) this.events.split(eventTypesList.indexOf(events), 1)
        eventsList = eventsList.filter( item =>{ 
            if(events === 'drag') {
                return this.ID !== item.node.ID && !(this.ID == item.node.ID && item.isDrag)
            }else{
                return !(this.ID == item.node.ID && item.events === events)
            }
        })
        if(events !== 'hover' && events !== 'drag') {
            View2d.$el.removeEventListener(events, eval(events + 'Fun'))
            View2d.$el.addEventListener(events, eval(events + 'Fun'))  
        }else{
            View2d.$el.removeEventListener('mousemove', eval(events + 'Fun'))
            View2d.$el.addEventListener('mousemove', eval(events + 'Fun'))  
        }
    }
    /**
     * node.on节点移除所有事件
    * **/
    function offAllEvents() {
        this.events = []
        eventsList = eventsList.filter( item => this.ID !== item.node.ID)
        let temp = []
        eventsList.forEach( item => {
            if(!temp.includes(item.events)) {
                temp.push(item.events)
            }
        })
        temp.forEach( events => {
            if(events !== 'hover' && events !== 'drag') {
                View2d.$el.removeEventListener(events, eval(events + 'Fun'))
                View2d.$el.addEventListener(events, eval(events + 'Fun'))  
            }else{
                View2d.$el.removeEventListener('mousemove', eval(events + 'Fun'))
                View2d.$el.addEventListener('mousemove', eval(events + 'Fun'))  
            } 
        })
    }
    // 处理鼠标移出canvas如何触发mouseup 时需要把选中的节点isMousedown, mousedownVertex改为false
    window.addEventListener("mouseup", () => {
        if(!!View2d.activeNode) {
            View2d.activeNode.isMousedown = false
            hoverVertex = -1
            mousedownVertex = false
        }
        // 框选结束
        checkboxEnd()
    })
    /**
     * node节点设置事件
     * hover,click,dblclick,mousedown,mouseup
     * **/
    function setEvents(events,callBack, callBack1, callBack2) {
        let params = {}
         = this.events.filter( item => {
            if(item.events !== events) {
                return item
            }else{
                params = item.params
            }
        })
        eventsList = eventsList.filter( item => {
            return item.events !== events || (item.events == events && item.node.ID !== this.ID)
        })//去除同一节点 同一事件重复保存
        if(events !== 'hover' && events !== 'drag') {
            if(isDrag) {
                this.dragEvents.push({events, isDrag: isDrag, isHover: false, callBack, params})
            }else{
                this.events.push({events, isDrag: isDrag, isHover: false, callBack, params})
            }
            // 其他事件
            eventsList.unshift({events, isDrag: isDrag, isHover: false, callBack, node: this})
            if(hasSetEvent.includes(events)) {
                View2d.$el.removeEventListener(events, eval(events + 'Fun'))  
                hasSetEvent = hasSetEvent.filter(item => item.events != events)
            }
            View2d.$el.addEventListener(events, eval(events + 'Fun'))
            hasSetEvent.push(events) 
        }else{
            if(events == 'drag' || isDrag) {
                this.dragEvents.push({events, isDrag: true, isHover: false, callBack, params})
            }else{
                this.events.push({events, isDrag: false, isHover: false, callBack, callBack1, params})
            }
            // hover事件
            eventsList.unshift({events, callBack,callBack1, callBack2, node: this})
            if(hasSetEvent.includes(events)) {
                View2d.$el.removeEventListener('mousemove', eval(events + 'Fun'))  
                hasSetEvent = hasSetEvent.filter(item => item.events != events)
            }
            View2d.$el.addEventListener('mousemove', eval(events + 'Fun'))
            hasSetEvent.push(events) 

            if(events == 'drag') {
                isDrag = true
                // dragstart
                this.on('mousedown', (e) => {
                    dragNodeZIndex = this.zIndex
                    let maxIndex = View2d.nodes.sort((a, b) => b.zIndex - a.zIndex)[0].zIndex
                    this.zIndex = maxIndex + 1
                    dragStartOffset = {
                        offsetX: e.clientX - this.position.x,
                        offsetY: e.clientY - this.position.y,
                    }
                    this.isMousedown = true;
                    if(this.type == 'line' && pointIndex !== -1){
                        mousedownVertex = true
                        let x = event.clientX - View2d.$el.getBoundingClientRect().left
                        let y = event.clientY - View2d.$el.getBoundingClientRect().top
                        View2d.activeNode.linePath[pointIndex] ={
                            type: View2d.activeNode.linePath[pointIndex].type,
                            x,
                            y
                        }
                    }
                    if(typeof callBack == 'function') callBack.call(this,event)
                })
                // dragend
                this.on('mouseup',() => {
                    if(this.isMousedown) {
                        this.isMousedown = false;
                        if(this.type == 'line' && pointIndex !== -1) {
                            let x = event.clientX - View2d.$el.getBoundingClientRect().left
                            let y = event.clientY - View2d.$el.getBoundingClientRect().top
                            let nodeList = View2d.nodes.filter( item => item.zIndex !== null)
                            nodeList.sort((a, b) => b.zIndex - a.zIndex)
                            let trigger = nodeList.filter( item => item.checkPointInPath(x,y))
                            findCenter(trigger, x, y)
                            mousedownVertex = false
                            pointIndex = -1
                        }
                        if(typeof callBack2 == 'function') callBack2.call(this,event)
                        this.zIndex = dragNodeZIndex
                        View2d.baseLine.x = []
                        View2d.baseLine.y = []
                    }
                })
                isDrag = false
            }
        }
    }
    function hoverFun() {
        let list = eventsList.filter( item => item.events == 'hover')
        eventHandle(list, event)
    }
    function dragFun() {
        let list = eventsList.filter( item => item.events == 'drag')
        eventHandle(list, event)
    }
    function clickFun() {
        let list = eventsList.filter( item => item.events == 'click')
        eventHandle(list, event)
    }
    function dblclickFun() {
        let list = eventsList.filter( item => item.events == 'dblclick')
        eventHandle(list, event)
    }
    function mouseupFun() {
        let list = eventsList.filter( item => item.events == 'mouseup')
        eventHandle(list, event)
    }
    function mousedownFun() {
        let list = eventsList.filter( item => item.events == 'mousedown')
        eventHandle(list, event)
    }
    function checkPointInPath(x,y) {
        if( this.vertex == undefined) return
        let ctx = View2d.ctx
        let pointInPath = false
        ctx.beginPath()
        if(this.type !== 'line') {
            this.vertex.forEach( point => {  
                ctx.lineTo(point.x, point.y) 
            }) 
            pointInPath = ctx.isPointInPath(x, y)
        }else{
            ctx.lineWidth = 10
            _darwlinePath(this.linePath, ctx)
            this.linePath.forEach( point => {  
                ctx.arc(point.x, point.y, 8, 0 , 2*Math.PI)
            }) 
            pointInPath = this.shape !== 'waterCapacity'? ctx.isPointInStroke(x, y):ctx.isPointInPath(x, y)
        }
        return pointInPath
    }
    // 该值是否在此区间
    function isRangeIn(val,maxNum,minNum) {
        var num = parseFloat(val);
        if(num <= maxNum && num >= minNum){
            return true;
        }
        return false;
    }
    var mousedownVertex = false
    var start = {}, end = {}
    var hoverVertex = -1, pointIndex = -1
    function eventHandle(list, event) {
        let scene = View2d.nodes.find(item => item.constructor === View2d.scene)
        if(list.length === 0 || scene.children.length === 0) {
            View2d.$el.style.cursor = "default"
            return false
        }
        let temp = []
        scene.traverse( child => {
            temp.push(child.ID)
        })
        let currentEventList = list.filter( item => temp.includes(item.node.ID))
        let hadTrigger = false//控制同类事件执行
        let x = event.clientX - View2d.$el.getBoundingClientRect().left
        let y = event.clientY - View2d.$el.getBoundingClientRect().top
        let nodeList = View2d.nodes.filter( item => item.zIndex !== null)
        nodeList.sort((a, b) => b.zIndex - a.zIndex)
        let trigger = nodeList.filter( item => item.checkPointInPath(x,y))
        // 锁定后不能移动元素
        if(View2d.lock && currentEventList[0].events == 'drag') {
            View2d.$el.style.cursor = "default"
            return false
        }
        // 判断node节点重叠时或者无节点时或者如果当前事件最上层(node.zIndex最大)的节点未设置该事件则直接return
        if(trigger.length > 1) {
            let nodeEvents = trigger[0].events.concat(trigger[0].dragEvents)
            if(!nodeEvents.map(ele => ele.events).includes(currentEventList[0].events)) {
                let childIsSet = false //判断group子节点是否设置该事件
                if(trigger[0].constructor === View2d.Group) {
                    nodeEvents.traverse( event => {
                        if(event.includes(currentEventList[0].events)) {
                            childIsSet = true
                        }
                    })
                }
                if(!childIsSet) {
                    let hoverNode = currentEventList.filter(ele => ele.events === 'hover')[0]
                    if(!!hoverNode) {
                        if(hoverNode.events === 'hover' && hoverNode.isHover && !!hoverNode.callBack1) {
                            hoverNode.callBack1.call(ele.node, event)
                            hoverNode.isHover = false
                        } 
                    }
                    return false 
                }  
            }
            
        }
        if(!View2d.lock) controler(x,y,trigger);
        // 变换时不继续执行
        if(hoverVertex > -1) return false
        // 预览模式不支持变换
        if(View2d.mode.type !== "preview") {
            // 点击显示变换框
            if(event.type === 'mousedown' && hoverVertex == -1) {
                if(trigger.length > 0) {
                    if(event.ctrlKey && View2d.activeNode !== null && View2d.activeNode.ID !== trigger[0].ID) {//同时按下ctrl键选择节点时-临时组合
                        let includeNode = View2d.checkbox.checkboxGroup.children
                        if(includeNode.length == 0){ 
                            includeNode.push(View2d.activeNode, trigger[0])
                            shortTimeCombine(includeNode)
                        }else{
                            View2d.checkbox.checkboxGroup.add(trigger[0])
                        }
                    }else{
                        nodeList.forEach( item => {
                            item.helperBox = false
                        })
                        trigger[0].helperBox = true
                        View2d.activeNode = trigger[0]  
                    }
                }else{
                    nodeList.forEach( item => {
                        item.helperBox = false
                    })
                    View2d.activeNode = null
                    unShortTimeCombine()
                }
            }
            // 框选
            if(trigger.length == 0 && currentEventList[0].events == 'mousedown') {
                checkboxStart(x,y)
            }
            if(currentEventList[0].events == 'mouseup' && View2d.checkbox.show) {
                event.stopPropagation()
                checkboxEnd(x,y)
            }
            if(currentEventList[0].events == 'drag' && View2d.checkbox.show) {
                checkboxMove(x,y)
            }  
        }
        // 循环设置所有节点的事件函数
        currentEventList.sort((a, b) => b.node.zIndex - a.node.zIndex)
        currentEventList.forEach( ele => {
            let scene = View2d.nodes.find( item => item.constructor === View2d.scene)
            if(!View2d.nodes.some(item => item.ID === ele.node.ID)) return false
            if((ele.node.checkPointInPath(x,y) && !hadTrigger) || ele.node.isMousedown) {
                hadTrigger = true
                if(ele.events !== 'drag') {
                    if(!ele.isHover || ele.events !=='hover') {
                        ele.callBack.call(ele.node, event)
                        if(ele.events == 'click') {
                            ele.node.isOn = !ele.node.isOn
                        } 
                        if(ele.events === 'hover') {
                            ele.isHover = true
                        }
                    }  
                }else{// dragmove
                    if(typeof ele.callBack1 == 'function' && !ele.node.freeze) ele.callBack1.call(ele.node, event)
                    if(ele.node.isMousedown && !ele.node.freeze) {
                        if(ele.node.type != 'line') {
                            let x = event.clientX - dragStartOffset.offsetX
                            let y = event.clientY - dragStartOffset.offsetY
                            ele.node.translate({x,y})
                            findVertex(x, y)
                        }else if(ele.node.type == 'line' && mousedownVertex) {
                            let x = event.clientX - View2d.$el.getBoundingClientRect().left
                            let y = event.clientY - View2d.$el.getBoundingClientRect().top
                            ele.node.linePath[pointIndex].x = x
                            ele.node.linePath[pointIndex].y = y
                        }
                    }
                }
            }else if(ele.events === 'hover' && ele.isHover){
                if(typeof ele.callBack1 == 'function') ele.callBack1.call(ele.node, event)
                ele.isHover = false
            }
            // 解决拖拽节点时，鼠标超出节点后，出现节点不能继续移动的问题
            if(!(ele.node.checkPointInPath(x,y)) && ele.events == 'drag') {
                if(ele.node.isMousedown && !ele.node.freeze) {
                    if(ele.node.type != 'line') {    
                        let x = event.clientX - dragStartOffset.offsetX
                        let y = event.clientY - dragStartOffset.offsetY
                        ele.node.translate({x,y})
                        findVertex(x, y)
                    }else if(ele.node.type == 'line' && mousedownVertex) {
                        let x = event.clientX - View2d.$el.getBoundingClientRect().left
                        let y = event.clientY - View2d.$el.getBoundingClientRect().top
                        ele.node.linePath[pointIndex].x = x
                        ele.node.linePath[pointIndex].y = y
                    }
                }
            }
        })
    }
    // 吸附点
    function findVertex(x, y) {
        let X_line = false, Y_line = false
        let translateTo = {x: 0, y: 0}
        let nodeList = View2d.nodes.filter( item => item.zIndex !== null)
        if(View2d.activeNode == null || View2d.mode.type == 'preview') return false
        let active = {
          xMin: View2d.activeNode.vertex[0].x, 
          xMax: View2d.activeNode.vertex[1].x, 
          yMin: View2d.activeNode.vertex[0].y, 
          yMax: View2d.activeNode.vertex[2].y
        }
        let space = View2d.baseLine.space || 5
        nodeList.forEach( item => {
            if(View2d.activeNode.ID !== item.ID && item.type !== 'line') {
                let xMin = item.vertex[0].x, xMax = item.vertex[1].x, yMin = item.vertex[0].y, yMax = item.vertex[2].y
                for(let k in active) {
                    if(/^x/.test(k)) {
                        if(isRangeIn(active[k], xMin+space, xMin-space)) { 
                            if(translateTo.y == 0) translateTo.y = y
                            translateTo.x = x + xMin - active[k]
                            View2d.baseLine.x = [{x: xMin,y: 0}, {x: xMin, y: View2d.$el.height}]
                            X_line = true
                        }
                        if(isRangeIn(active[k], xMax+space, xMax-space) ) {
                            if(translateTo.y == 0) translateTo.y = y
                            translateTo.x = x+ xMax - active[k]
                            View2d.baseLine.x = [{x: xMax,y: 0}, {x: xMax, y: View2d.$el.height}]
                            X_line = true
                        }
                    }
                    if(/^y/.test(k)) {
                        if(isRangeIn(active[k], yMin+space, yMin-space) ){
                            if(translateTo.x == 0) translateTo.x = x
                            translateTo.y = y + yMin - active[k]
                            View2d.baseLine.y = [{x: 0,y: yMin}, {x: View2d.$el.width, y: yMin}]
                            Y_line = true
                        }
                        if( isRangeIn(active[k], yMax+space, yMax-space) ) {
                            if(translateTo.x == 0) translateTo.x = x
                            translateTo.y = y + yMax - active[k]
                            View2d.baseLine.y = [{x: 0,y: yMax}, {x: View2d.$el.width, y: yMax}]
                            Y_line = true
                        }
                    }
                }
            }
        })
        if(X_line || Y_line) View2d.activeNode.translate(translateTo)
        if(!X_line) View2d.baseLine.x = []
        if(!Y_line) View2d.baseLine.y = []
    }
    function findCenter(trigger, x, y) {
        if(trigger.length <= 1) return false
        if(trigger[1].type !== 'line') {
            View2d.activeNode.linePath[pointIndex] ={
                type: View2d.activeNode.linePath[pointIndex].type,
                id: trigger[1].ID,
                ...trigger[1].position
            }
        }else{

        }

    }
    function getCenterPoint(p1,p2) {
        let point = {x: p1.x - (p1.x - p2.x)/2, y: p1.y - (p1.y - p2.y)/2}
        return point
    }
    function getRotatePos(item, {x: rx0,y: ry0}, a) {
        let x = (item.x - rx0)*Math.cos(a) - (item.y - ry0)*Math.sin(a) + rx0 ;
        let y = (item.x - rx0)*Math.sin(a) + (item.y - ry0)*Math.cos(a) + ry0 ;
        return {x,y}
    }
    
    var RESIZECUR = []
    function sortResizeCur() {
        let n = Math.abs(Math.round((View2d.activeNode.rotateVal % 360) / 45))
        switch(n){
            case 0: RESIZECUR = ['nw','s','ne','e','nw','s','ne','e'];
                break;
            case 1: RESIZECUR = ['s','ne','e','nw','s','ne','e','nw'];
                break; 
            case 2: RESIZECUR = ['ne','e','nw','s','ne','e','nw','s'];
                break; 
            case 3: RESIZECUR = ['e','nw','s','ne','e','nw','s','ne'];
                break; 
            case 4: RESIZECUR = ['nw','s','ne','e','nw','s','ne','e'];
                break;
            case 5: RESIZECUR = ['s','ne','e','nw','s','ne','e','nw'];
                break; 
            case 6: RESIZECUR = ['ne','e','nw','s','ne','e','nw','s'];
                break;  
            case 7: RESIZECUR = ['e','nw','s','ne','e','nw','s','ne'];
                break;    
            case 8: RESIZECUR = ['nw','s','ne','e','nw','s','ne','e'];
                break;  
        }
    }


    // 设置图形变换控件
    function controler(x,y,trigger) {
        if(View2d.mode.type == 'preview') return false
        // 添加变化控件
        if(!mousedownVertex) hoverVertex = -1
        if(hoverVertex == -1 && !mousedownVertex){
            View2d.$el.style.cursor = '';
            if(trigger.length > 0 
                && !trigger[0].freeze 
                && trigger[0].dragEvents.map(ele => ele.events).includes('drag')
                && trigger[0].type !=='line'
            ) {
                View2d.$el.style.cursor = 'move'
            }
        }
        if(View2d.activeNode !== null) {
            if(View2d.activeNode.type != 'line') {
                if(View2d.activeNode.freeze) return false
                let vertex = JSON.parse(JSON.stringify(View2d.activeNode.vertex))
                let centerPoint = {
                    x: vertex[0].x + (vertex[1].x - vertex[0].x)/2,
                    y: vertex[0].y +(vertex[1].y - vertex[0].y)/2
                }
                let xArr = vertex.map(item => item.x).sort((a, b) => a - b)
                let yArr = vertex.map(item => item.y).sort((a, b) => a - b)
                let active = {
                xMin: xArr[0], 
                xMax: xArr[3], 
                yMin: yArr[0], 
                yMax: yArr[3]
                }
                let { xMin, xMax, yMin, yMax } = active
                if(hoverVertex == -1) {
                    sortResizeCur()
                    // 顶点控制点
                    if(isRangeIn(x,vertex[0].x+5,vertex[0].x-5) && isRangeIn(y,vertex[0].y+5,vertex[0].y-5)) {
                        hoverVertex = 0
                        View2d.$el.style.cursor = RESIZECUR[0] + '-resize'
                    }
                    if(isRangeIn(x,vertex[1].x+5,vertex[1].x-5) && isRangeIn(y,vertex[1].y+5,vertex[1].y-5)) {
                        hoverVertex = 1
                        View2d.$el.style.cursor = RESIZECUR[2] + '-resize'
                    }
                    if(isRangeIn(x,vertex[2].x+5,vertex[2].x-5) && isRangeIn(y,vertex[2].y+5,vertex[2].y-5)) {
                        hoverVertex = 2
                        View2d.$el.style.cursor = RESIZECUR[4] + '-resize'
                    }
                    if(isRangeIn(x,vertex[3].x+5,vertex[3].x-5) && isRangeIn(y,vertex[3].y+5,vertex[3].y-5)) {
                        hoverVertex = 3
                        View2d.$el.style.cursor = RESIZECUR[6] + '-resize'
                    }
                    // 边控制点
                    let center = getCenterPoint(vertex[0], vertex[1])
                    if(isRangeIn(x,center.x+5,center.x-5) && isRangeIn(y,center.y+5,center.y-5)) {
                        hoverVertex = 0.5
                        View2d.$el.style.cursor =  RESIZECUR[1] + '-resize'
                    }
                    center = getCenterPoint(vertex[1], vertex[2])
                    if(isRangeIn(x,center.x+5,center.x-5) && isRangeIn(y,center.y+5,center.y-5)) {
                        hoverVertex = 1.5
                        View2d.$el.style.cursor = RESIZECUR[3] + '-resize'
                    }
                    center = getCenterPoint(vertex[2], vertex[3])
                    if(isRangeIn(x,center.x+5,center.x-5) && isRangeIn(y,center.y+5,center.y-5)) {
                        hoverVertex = 2.5
                        View2d.$el.style.cursor = RESIZECUR[5] + '-resize'
                    }
                    center = getCenterPoint(vertex[3], vertex[0])
                    if(isRangeIn(x,center.x+5,center.x-5) && isRangeIn(y,center.y+5,center.y-5)) {
                        hoverVertex = 3.5
                        View2d.$el.style.cursor = RESIZECUR[7] + '-resize'
                    }
                    // 旋转控制点
                    let a = 50*Math.sin(View2d.activeNode.rotateVal*Math.PI/180)
                    let b = 50*Math.cos(View2d.activeNode.rotateVal*Math.PI/180)
                    if(
                        isRangeIn(x,centerPoint.x + 5 + a,centerPoint.x-5 + a) 
                        && isRangeIn(y,centerPoint.y + 5 - b,centerPoint.y - 5 - b)) {
                        hoverVertex = 4
                        View2d.$el.style.cursor = 'url(./img/rotate.ico) 16 16,default'
                    }
                }
                if(event.type === 'mousedown' && hoverVertex > -1) {
                    mousedownVertex = true
                    start = {x,y}
                }
                // 缩放变化
                if(mousedownVertex) {
                    var rotateVal = View2d.activeNode.rotateVal*Math.PI/180
                    let distance = {xl: x-start.x, yl: y-start.y}
                    var xScaleVal = View2d.activeNode.scaleVal.x , yScaleVal = View2d.activeNode.scaleVal.y
                    start = {x,y} 
                    
                    let controlTriangleAngle = Math.atan2(distance.yl, distance.xl);//拉伸点相对x轴角度
                    let cornerHypotenuse = Math.sqrt(distance.xl * distance.xl + distance.yl * distance.yl);//拉伸距离
                    let newTheta = controlTriangleAngle - rotateVal;
                    
                    let delValX = vertex[0].x - vertex[1].x, delValY = vertex[0].y - vertex[1].y
                    let xRate = Math.cos(newTheta)*cornerHypotenuse / Math.sqrt(delValX * delValX + delValY * delValY)
                    delValX = vertex[1].x - vertex[2].x, delValY = vertex[1].y - vertex[2].y
                    let yRate = Math.sin(newTheta)*cornerHypotenuse / Math.sqrt(delValX * delValX + delValY * delValY)
                    let dx, dy, dx1, dy1;

                    let scaleValDistance = {
                        xl: Math.cos(newTheta)*cornerHypotenuse/2,
                        yl: Math.sin(newTheta)*cornerHypotenuse/2
                    }

                    dx = Math.cos(rotateVal)*scaleValDistance.xl
                    dy = Math.sin(rotateVal)*scaleValDistance.xl

                    dx1 = Math.sin(rotateVal)*scaleValDistance.yl
                    dy1 = Math.cos(rotateVal)*scaleValDistance.yl

                    let translate = {xl: 0, yl: 0,}
                    
                    switch(hoverVertex) {
                        // 顶点控制点
                        case 0:
                        {
                            xScaleVal = View2d.activeNode.scaleVal.x - xRate*View2d.activeNode.scaleVal.x
                            yScaleVal = View2d.activeNode.scaleVal.y - yRate*View2d.activeNode.scaleVal.y
                            if(xScaleVal < 0.1 || yScaleVal < 0.1) {
                                break; 
                            } 
                            translate.xl -= dx1 - dx;
                            translate.yl += dy1 + dy;
                        }
                            break;
                        case 1:
                            {
                                xScaleVal = View2d.activeNode.scaleVal.x + xRate*View2d.activeNode.scaleVal.x
                                yScaleVal = View2d.activeNode.scaleVal.y - yRate*View2d.activeNode.scaleVal.y
                                if(xScaleVal < 0.1 || yScaleVal < 0.1) {
                                    break; 
                                }
                                translate.xl -= dx1 - dx;
                                translate.yl += dy1 + dy;
                            }
                            break;
                        case 2: 
                        {
                            xScaleVal = View2d.activeNode.scaleVal.x + xRate*View2d.activeNode.scaleVal.x
                            yScaleVal = View2d.activeNode.scaleVal.y + yRate*View2d.activeNode.scaleVal.y 
                            if(xScaleVal < 0.1 || yScaleVal < 0.1) {
                                break; 
                            }
                            translate.xl -= dx1 - dx;
                            translate.yl += dy1 + dy;
                        }
                        break;
                        case 3:
                            {
                                xScaleVal = View2d.activeNode.scaleVal.x - xRate*View2d.activeNode.scaleVal.x
                                yScaleVal = View2d.activeNode.scaleVal.y + yRate*View2d.activeNode.scaleVal.y 
                                if(xScaleVal < 0.1 || yScaleVal < 0.1) {
                                    break; 
                                }
                                translate.xl -= dx1 - dx;
                                translate.yl += dy1 + dy;
                            }
                        break;
                        // 边控制点
                        case 0.5: 
                        {
                            yScaleVal = View2d.activeNode.scaleVal.y - yRate*View2d.activeNode.scaleVal.y
                            if(yScaleVal < 0.1) {
                                break; 
                            }
                            translate.xl -= dx1;
                            translate.yl += dy1;
                        }
                        break;
                        case 1.5: 
                        {
                                xScaleVal = View2d.activeNode.scaleVal.x + xRate*View2d.activeNode.scaleVal.x
                                if(xScaleVal < 0.1) {
                                    break; 
                                }
                                translate.xl += dx;
                                translate.yl += dy;
                            }
                        break;
                        case 2.5: 
                            {
                                yScaleVal = View2d.activeNode.scaleVal.y + yRate*View2d.activeNode.scaleVal.y
                                if(yScaleVal < 0.1) {
                                    break; 
                                }
                                translate.xl -= dx1;
                                translate.yl += dy1;
                            }
                        break;
                        case 3.5:
                            {
                                xScaleVal = View2d.activeNode.scaleVal.x - xRate*View2d.activeNode.scaleVal.x
                                if(xScaleVal < 0.1) {
                                    break; 
                                } 
                                translate.xl += dx;
                                translate.yl += dy;
                            }
                        break;
                        // 旋转
                        case 4: 
                            let xl = x - View2d.activeNode.position.x
                            let yl = y - View2d.activeNode.position.y
                            let a = -Math.atan(xl/yl)*180/Math.PI
                            if( y <= (active.yMin + (active.yMax - active.yMin)/2)
                            && x >= (active.xMin + (active.xMax - active.xMin)/2)
                            ){
                                View2d.activeNode.rotate(a);
                            }else if(
                                y <= (active.yMin + (active.yMax - active.yMin)/2)
                                && x <= (active.xMin + (active.xMax - active.xMin)/2)
                            ){  
                                View2d.activeNode.rotate( 360 + a )
                            }else{
                                View2d.activeNode.rotate( 180 + a );
                            }
                        break;
                    }
                    if(hoverVertex !== 4) {
                        View2d.activeNode.scale(xScaleVal, yScaleVal)

                        View2d.activeNode.translate({
                            x: View2d.activeNode.position.x + translate.xl,
                            y: View2d.activeNode.position.y + translate.yl
                        })

                        if(!!View2d.activeNode.echartsOption) {
                            let myChart = echarts.init(View2d.activeNode.element)
                            myChart.resize()
                        }
                    }     
                }
                if(event.type === 'mouseup' && mousedownVertex) {
                    mousedownVertex = false
                    end = {x,y}
                }
                if(mousedownVertex) return  
            }else{
                if(!mousedownVertex) pointIndex = -1 
                View2d.activeNode.linePath.forEach( (item, i) => {
                    if(isRangeIn(x,item.x+5,item.x-5) && isRangeIn(y,item.y+5,item.y-5)) {
                        View2d.$el.style.cursor = 'pointer'
                        pointIndex = i
                    }  
                })
            }
        }
    }

    // 框选开始
    function checkboxStart(x,y) {
        View2d.checkbox.show = true
        View2d.checkbox.start = {x,y}
        View2d.checkbox.end = {x,y}
    }
    // 框选开始
    function checkboxMove(x,y) {
        View2d.checkbox.end = {x,y}
    }
    // 框选结束End
    function checkboxEnd(x,y) {
        if(View2d.checkbox.show) {
            let nodesList = checkboxIncludeNode()
            View2d.checkbox.show = false
            View2d.checkbox.start = {x: 0,y: 0}
            View2d.checkbox.end = {x: 0,y: 0}  
        }
    }
    // 节点是否在框内
    function checkboxIncludeNode() {
        let includeNode = []
        let { start, end } = View2d.checkbox
        let xMin = Math.min(start.x, end.x),xMax = Math.max(start.x, end.x)
        let yMin = Math.min(start.y, end.y),yMax = Math.max(start.y, end.y)
        View2d.nodes.forEach( node => {
            if(node.zIndex !== null && node.type !== 'line') {
                let vertex = {
                    xMin: node.vertex[0].x, 
                    xMax: node.vertex[1].x, 
                    yMin: node.vertex[0].y, 
                    yMax: node.vertex[2].y
                }
                if((xMin < vertex.xMax && xMax > vertex.xMin) 
                && (yMin <  vertex.yMax && yMax > vertex.yMin) ) {
                    includeNode.push(node)
                }
            }else if(node.zIndex !== null && node.type == 'line') {
                let ctx = View2d.ctx
                let isSelected = false
                if(node.linePath.length == 2) {
                    ctx.lineTo(node.linePath[0].x, node.linePath[0].y)
                    ctx.lineTo(node.linePath[1].x, node.linePath[1].y)
                }else{
                    _darwlinePath(node.linePath, ctx)
                }
                for(let i = xMin; i < xMax; i++) {
                    for(let j = yMin; j < yMax; j++) {
                        let isInPath = ctx.isPointInPath(i, j)
                        if(isInPath) {
                            isSelected = true
                            break;
                        }
                    }
                    if(isSelected) break;
                }
                if(isSelected) includeNode.push(node)
            }
        })
        if(includeNode.length > 0) {
            if(includeNode.length > 1) {
                shortTimeCombine(includeNode)   
            }else if(includeNode.length == 1) {
                View2d.activeNode = includeNode[0]
                includeNode[0].helperBox = true
            }
        }
        
        return includeNode
    }
    // 预览模式下开启 整体缩放
    function scrollScale () {
        var delta = 0;
        if (!event) event = window.event;
        if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
            delta = event.wheelDelta/120; 
            if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
        } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
            delta = -event.detail/3;
        }
        let scene = View2d.nodes.find( item => item.constructor === View2d.scene)
        let {x,y} = scene.scaleVal
        if (delta){
            x = Number((x + delta*View2d.mode.zoom.rate*0.1).toFixed(2))
            y = Number((y + delta*View2d.mode.zoom.rate*0.1).toFixed(2))

            if(delta < 0 && x > View2d.mode.zoom.max || delta > 0 && x < View2d.mode.zoom.min){
                scene.scale({x: event.offsetX, y: event.offsetY}, x,y)
            }
            if ( x >= View2d.mode.zoom.min && x < View2d.mode.zoom.max
                ||
                x > View2d.mode.zoom.min && x <= View2d.mode.zoom.max){
                scene.scale({x: event.offsetX, y: event.offsetY}, x,y)
            }
        }
    }
    //临时组合Group
    function shortTimeCombine(includeNode) {
        let scene = View2d.nodes.find( item => item.constructor == View2d.scene)
        includeNode = includeNode.filter( item => !item.freeze)
        includeNode = includeNode.sort( (a, b) => a.zIndex - b.zIndex)
        let g = View2d.checkbox.checkboxGroup
        g.children = []
        g.vertex = undefined
        g.add(...includeNode)
        g.helperBox = true
        View2d.activeNode = g
        scene.add(g)   
    }
    //取消所有临时组合Group
    function unShortTimeCombine() {
        let scene = View2d.nodes.find( item => item.constructor == View2d.scene)
        View2d.nodes.forEach( item => {
            if(item.zIndex !== null) {
                if(item.type == "extraGroup") {
                    scene.remove(item)
                    item.children.forEach( node => {
                        if(node.type !== 'line') {
                            node.rotateVal += item.rotateVal
                            node.scaleVal.x += node.scaleVal.x * (item.scaleVal.x - 1)
                            node.scaleVal.y += node.scaleVal.y * (item.scaleVal.y - 1)
                        }
                            node.freeze = item.freeze
                        if(node.type === 'group') {
                            node.groupPosition = {x: 0, y: 0}
                        }
                        if(node.shape == "drawEcharts") {
                            View2d.$dom.appendChild(node.element)
                        }
                        if(node.constructor == View2d.Group) {
                            node.traverse( ele => {
                                if(ele.shape == "drawEcharts") {
                                    View2d.$dom.appendChild(ele.element)
                                }
                            })
                        }
                        scene.add(node)
                    })
                    item.freeze = false
                    item.children = []
                }
            }
        })
    }
    // 设置径向渐变
    function radialGradient() {
        if(this.vertex.length == 0) return false
        let gradient =  null
        let {xMin, xMax, yMin, yMax} = {
            xMin: this.vertex[0].x/this.allScale.x, 
            xMax: this.vertex[1].x/this.allScale.x, 
            yMin: this.vertex[0].y/this.allScale.x, 
            yMax: this.vertex[2].y/this.allScale.x
          }
        let point = [
            {x: (xMin - xMax)/2, y: (yMin - yMax)/2},
            {x: (xMax - xMin)/2, y: (yMin - yMax)/2},
            {x: (xMax - xMin)/2, y: (yMax - yMin)/2},
            {x: (xMin - xMax)/2, y: (yMax - yMin)/2}
        ]
        let width = Math.abs(xMin - xMax)/2
        let option = ['center','top', 'bottom','left','right','left top','right top','left bottom', 'right bottom']
        switch(arguments[0]) {
            case 'center': point = [0,0,width/5, 0,0,width];break;
            case 'top': point = [0,-width,width/5,0,-width, width*2];break;
            case 'bottom': point = [0,width,width/5,0,width, width*2];break;
            case 'left': point = [-width,0,width/5,-width,0, width*2];break;
            case 'right': point = [width,0,width/5,width,0, width*2];break;

            case 'left top': point = [point[0].x,point[0].y,width/5, point[0].x,point[0].y,width*2];break;
            case 'right top': point = [point[1].x,point[1].y,width/5, point[1].x,point[1].y,width*2];break;
            case 'left bottom': point = [point[3].x,point[3].y,width/5, point[3].x,point[3].y,width*2];break;
            case 'right bottom': point = [point[2].x,point[2].y,width/5, point[2].x,point[2].y,width*2];break;
            default: point = [0,0,width/5, 0,0,width];break;
        }
        gradient = View2d.ctx.createRadialGradient( ...point ) 
        let index = 0
        if(option.includes(arguments[0])) index = 1;
        for(let i in arguments) {
            if(!option.includes(arguments[i])) {
                gradient.addColorStop(( Number(i) - index )*1/(arguments.length-1-index),arguments[i]);
            }
        }
        return gradient
    }
    // 设置线性渐变
    function linearGradient() {
        if(this.vertex.length == 0) return false
        let gradient =  null
        let {xMin, xMax, yMin, yMax} = {
            xMin: this.vertex[0].x/this.allScale.x, 
            xMax: this.vertex[1].x/this.allScale.x, 
            yMin: this.vertex[0].y/this.allScale.y, 
            yMax: this.vertex[2].y/this.allScale.y
          }
        let point = [
            {x: (xMin - xMax)/2, y: (yMin - yMax)/2},
            {x: (xMax - xMin)/2, y: (yMin - yMax)/2},
            {x: (xMax - xMin)/2, y: (yMax - yMin)/2},
            {x: (xMin - xMax)/2, y: (yMax - yMin)/2}
        ]
        switch(arguments[0]) {
            case 'to bottom': point = [point[0].x,point[0].y, point[3].x,point[3].y];break;
            case 'to right': point = [point[0].x,point[0].y, point[1].x,point[1].y];break;
            case '45deg': point = [point[3].x,point[3].y, point[1].x,point[1].y];break;
            case '135deg': point = [point[0].x,point[0].y, point[2].x,point[2].y];break;
            default: point = [point[0].x,point[0].y, point[1].x,point[1].y];break;
        }
        gradient = View2d.ctx.createLinearGradient( ...point ) 
        let index = 0
        let option = ['to bottom', 'to right','45deg', '135deg']
        if(option.includes(arguments[0])) index = 1;
        for(let i in arguments) {
            if(!option.includes(arguments[i])) {
                gradient.addColorStop(( Number(i) - index )*1/(arguments.length-1-index),arguments[i]); 
            }
        }
        return gradient
    }

    function nodeSetColor(node) {
        let color = []
        node.color.forEach( item => {
            if(typeof item === 'object') {
                color.push(eval(node[item.type + 'Gradient'](item.direction, item.gradient[0], item.gradient[1])))
            }else{
                color.push(item)
            }
        })
        return color
    }
    //多边形
    function polygon(data, add)
    {
        var i,ang;
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ang = Math.PI*2/data.params.num //旋转的角度
        ctx.fillStyle = ctx.strokeStyle = color[0]
        ctx.save()
        ctx.beginPath();
            for(i = 0;i < data.params.num; i ++)
        {
            ctx.rotate(ang)//旋转
            ctx.lineTo( 0, -data.params.w);//据中心r距离处连线
        }
        ctx.closePath();
        ctx.restore()
        if(add) ctx[data.drawType]()
        _setTopoBorder(data, add)
        ctx.rect(
            - data.params.w/2,
            - data.params.h/2,
            data.params.w,
            data.params.h)
    }
    // draw图形节点
    function arc(data, add) {//圆
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.fillStyle = ctx.strokeStyle = color[0]
        ctx.beginPath()
        ctx.arc( 
            0,
            0,
            data.params.r,
            data.params.start,
            data.params.end)
        if(add) ctx[data.drawType]()
        _setTopoBorder(data, add)
    }
    function rect(data, add) {//矩形
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.fillStyle = ctx.strokeStyle = color[0]
        ctx.beginPath()
        ctx.rect(
            - data.params.w/2,
            - data.params.h/2,
            data.params.w,
            data.params.h)
        if(add) ctx[data.drawType]()
        _setTopoBorder(data, add)
    }
    function fivePointedStart(data, add) {//五角星
        var x1,x2,y1,y2;
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.fillStyle = ctx.strokeStyle = color[0]
        ctx.beginPath()
        for(var i=0;i<5;i++){
            ctx.lineTo(
                Math.cos((18+i*72)/180*Math.PI)*data.params.r,
                -Math.sin((18+i*72)/180*Math.PI)*data.params.r
            );
            ctx.lineTo(
                Math.cos((54+i*72)/180*Math.PI)*data.params.r/2.5,
                -Math.sin((54+i*72)/180*Math.PI)*data.params.r/2.5
            );
        }
        ctx.closePath()
        if(add) ctx[data.drawType]()
        _setTopoBorder(data, add)
    }
    // 管道流水
    function channel(data, add, pen) {
        let ctx = pen || View2d.ctx
        data.offset = data.offset || 0
        if(!!data.isOn) data.offset += data.speed || 0.2
        ctx.lineWidth = data.lineWidth || 20
        let color = nodeSetColor(data)
        let lineDash = data.lineDash || [ctx.lineWidth, ctx.lineWidth*2]
        ctx.strokeStyle = color[0] 
        ctx.lineCap = "square"; 
        ctx.lineJoin = 'round'
        ctx.beginPath()
        _darwlinePath(data.linePath, ctx)
        ctx.stroke()
        ctx.strokeStyle = color[1]
        if( !!data.lineWidth) {
            ctx.lineWidth = data.lineWidth - data.lineWidth/2.5
        }else{
            ctx.lineWidth = 14
        }
        ctx.setLineDash( lineDash );
        ctx.lineDashOffset -= data.offset*5
        ctx.stroke()
    }
    /** 自定义水容器 **/
    function waterCapacity(data, add, pen) {
        // 位置变化
        let ctx = pen || View2d.ctx
        let xArr = [], yArr = []
        let color = nodeSetColor(data)
        data.linePath.forEach( point => {
            xArr.push(point.x)
            yArr.push(point.y)
        })
        ctx.beginPath()
        ctx.lineWidth = data.lineWidth || 2
        ctx.fillStyle = ctx.strokeStyle = color[0]
        _darwlinePath(data.linePath, ctx)
        ctx.clip()
        ctx.closePath()
        if(!!add) ctx[data.drawType]()

        let xMax,xMin,yMax,yMin
        xMax = Math.max(...xArr) + 200
        xMin = Math.min(...xArr) - 200
        yMax = Math.max(...yArr) + 200
        yMin = Math.min(...yArr) - 200
        ctx.fillStyle = color[1]
        data.offset = data.offset || 1
        if(!!data.isOn) data.offset += data.speed || 0.2
        ctx.beginPath()
        let vertex = [
            {x: xMin, y: yMin}, {x: xMax, y: yMin},
            {x: xMax, y: yMax},{x: xMin, y: yMax}, 
        ]
        let linePath = [...vertex].reverse()
        linePath.forEach( (point, index) => {
            if(index == 2) {
                let count = 0
                for(let i= xMax; i > xMin; i-= (xMax - xMin)/200) {
                    count ++
                    if(count === 200) i = xMin
                    ctx.lineTo(i, yMax -  (yMax-yMin)*data.waterHeight + Math.sin( 0.1*i+data.offset/5 ) * 2)
                } 
            }else{
                ctx.lineTo( point.x, point.y)
            }
        })
        ctx.closePath()
        if(!!add) ctx[data.drawType]()
        ctx.beginPath()
        _darwlinePath(data.linePath, ctx)
    }
    // 多媒体(图片)
    function drawImage(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.strokeStyle = ctx.fillStyle = color[0] || '#000'
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        if(add) ctx[data.drawType]()
        ctx.strokeStyle = ctx.fillStyle = color[1] || '#fff'
        if(!data.element || !data.src) {
            ctx.beginPath()
            ctx.font = '18px kaiTi'
            ctx.textAlign = "center"
            ctx.fillText('图片加载失败',0,9)
            if(add) ctx[data.drawType]()
            ctx.rect( 
                - data.params.w/2,
                - data.params.h/2,
                data.params.w, data.params.h)
            if(add) ctx.stroke()
        }
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        if(add && !!data.element && !!data.src){ 
            data.element.src = data.src
            ctx.drawImage(data.element,
            -data.params.w/2,
            -data.params.h/2,
            data.params.w, data.params.h)
        }
    }
    // 多媒体(视频)
    function drawVideo(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.fillStyle = color[0] || '#000'
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        if(add) ctx[data.drawType]()
        if(add && !!data.src){ 
            ctx.drawImage(data.element,
            -data.params.w/2,
            -data.params.h/2,
            data.params.w, data.params.h)
        }
        if(!!data.isOn && !!data.src) {
            data.element.play()
        }else if(!!data.src){
            data.element.pause()
            ctx.fillStyle = color[1] || '#fff'
            ctx.beginPath()
            ctx.lineTo(10/data.scaleVal.x, 0)
            ctx.lineTo(-10/data.scaleVal.x, -15/data.scaleVal.y)
            ctx.lineTo(-10/data.scaleVal.x, 15/data.scaleVal.y)
            if(add) ctx.fill()
        }else{
            ctx.fillStyle = '#fff'
            ctx.beginPath()
            ctx.font = '18px kaiTi'
            ctx.textAlign = "center"
            ctx.fillText('视频加载失败',0,9)
        }
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
    } 
    // 文本
    function drawText(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.fillStyle = ctx.strokeStyle = color[0] || '#fff'
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        ctx.clip()
        if(add) ctx[data.drawType]()
        _setTopoBorder(data, add)
    }
    // echarts
    function drawEcharts(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        if(!!data.element && View2d.mode.type == 'preview') {
            let left = data.position.x - data.params.w/2
            let top = data.position.y - data.params.h/2
            let rotate = data.rotateVal, scaleX = data.scaleVal.x, scaleY = data.scaleVal.y
            if(data.allScale !== undefined) {
                scaleX = data.allScale.x
                scaleY = data.allScale.y
                rotate = data.allRotate*180/Math.PI
            }
                
            data.element.style.left = left - (scaleX - 1)*data.params.w/2  + 'px'
            data.element.style.top = top - (scaleY - 1)*data.params.h/2 + 'px'
            data.element.style.width = scaleX * data.params.w + 'px'
            data.element.style.height = scaleY * data.params.h + 'px'
            data.element.style.pointerEvents = View2d.mode.type == 'preview' ? 'auto' : 'none'
            data.element.style.transform = `rotateZ(${rotate}deg)`
        }
        ctx.fillStyle = ctx.strokeStyle = color[0]
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        if(add) ctx[data.drawType]()

        if(add && !!data.canvasImg && View2d.mode.type !== 'preview' ){ 
            ctx.drawImage(data.canvasImg,
            -data.params.w/2,
            -data.params.h/2,
            data.params.w, data.params.h)
        }
        _setTopoBorder(data, add)
        
    }
    // switch 开关
    function drawSwitch (data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.beginPath()
        ctx.fillStyle = ctx.strokeStyle = data.isOn ? color[0] : '#ccc'
        ctx.save()
        let { w, h } = data.params 
        for(let i = 0; i < 2; i++) {
            ctx.rotate(Math.PI*i)
            ctx.lineTo(0,h/2)
            ctx.arc( -w/2 + h/2, 0, h/2, 0.5*Math.PI, 1.5*Math.PI)
            ctx.lineTo(0,-h/2)
        }  
        ctx.closePath()
        ctx.restore()
        if(add) {
            ctx[data.drawType]()
        }
        _setTopoBorder(data, add)
        ctx.beginPath()
        ctx.fillStyle = color[1] || '#fff'
        let offsetX = data.isOn? (w/2 - h/2): (-w/2 + h/2)
        ctx.arc(offsetX,0,h/2-2,0,2*Math.PI)
        if(add)ctx.fill()
        ctx.beginPath()
        ctx.fillStyle = color[2] || '#000'
        ctx.font="18px Kaiti"
        ctx.textAlign="center"
        if(add) ctx.fillText( data.isOn?'on' : 'off', offsetX, 5)
        
        ctx.beginPath()
        ctx.save()
        for(let i = 0; i < 2; i++) {
            ctx.rotate(Math.PI*i)
            ctx.lineTo(0,h/2)
            ctx.arc( -w/2 + h/2, 0, h/2, 0.5*Math.PI, 1.5*Math.PI)
            ctx.lineTo(0,-h/2)
        }
        ctx.restore()
    }
    //风扇
    function drawFan(data,add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        data.offset = data.offset || 0
        data.offset += data.speed || 0.8
        ctx.rotate(data.offset*20 * Math.PI/180)
        for(let i = 0; i < 4; i++) {
            ctx.rotate(360/4 * Math.PI/180)
            ctx.fillStyle = ctx.strokeStyle = color[0]
            ctx.beginPath()
            ctx.arc(-data.params.w/2, -data.params.w/4, data.params.w/3, 0, 1.25*Math.PI)
            ctx.closePath()
            if(add) ctx[data.drawType]()
        }
        ctx.fillStyle = ctx.strokeStyle = color[1]
        ctx.beginPath()
        ctx.arc(0,0,data.params.w/3,0,2*Math.PI)
        if(add) ctx[data.drawType]()
        ctx.beginPath()
        ctx.arc(0, 0, data.params.w, 0, 2*Math.PI)
        if(add && data.border.show) {
            ctx.lineWidth = data.border.lineWidth || 2
            ctx.strokeStyle = data.border.color || 'red'
            ctx.lineCap = data.border.lineCap || 'butt'
            ctx.lineJoin = data.border.lineJoin || 'miter'
            ctx.setLineDash(data.border.lineDash || [0, 0])
            ctx.stroke()
        }
    }
    //风车
    function windmill(data, add) {
        data.offset = data.offset || 0
        data.offset += data.speed || 0.2
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.save()
        ctx.fillStyle = ctx.strokeStyle = color[0]
        ctx.translate(0, -data.params.h/2 + data.params.w/2)
        ctx.rotate(data.offset*10 * Math.PI/180)
        for(let i = 0; i < 3; i++) {
            ctx.rotate((360)/3 * Math.PI/180)
            ctx.beginPath()
            ctx.lineTo(-5,-5)
            ctx.lineTo(5,-5)
            ctx.lineTo(0.5,-data.params.w)
            ctx.lineTo(-0.5,-data.params.w)
            ctx.closePath()
            if(add) ctx[data.drawType]()
        }
        ctx.restore()
        

        ctx.fillStyle = ctx.strokeStyle = color[2]
        ctx.beginPath()
        ctx.rect(-3, -data.params.h/2 + data.params.w/2, 6, data.params.h)
        if(add) ctx[data.drawType]()
        
        ctx.fillStyle = ctx.strokeStyle = color[1]
        ctx.beginPath()
        ctx.arc(0,-data.params.h/2 + data.params.w/2,8,0,2*Math.PI)
        if(add) ctx[data.drawType]()
        ctx.beginPath()
        ctx.rect(
            -data.params.w, 
            -data.params.h + data.params.w/2, 
            data.params.w*2, 
            data.params.h + data.params.w
        )
        if(add && data.border.show) {
            ctx.lineWidth = data.border.lineWidth || 2
            ctx.strokeStyle = data.border.color || 'red'
            ctx.lineCap = data.border.lineCap || 'butt'
            ctx.lineJoin = data.border.lineJoin || 'miter'
            ctx.setLineDash(data.border.lineDash || [0, 0])
            ctx.stroke()
        }

    }
    // 时钟
    function clock(data, add) {
        let date = new Date()
        let milliseconds = date.getMilliseconds()
        let seconds = date.getSeconds()*1000 + milliseconds
        let minutes = date.getMinutes()*60*1000 + seconds
        let hours = date.getHours()*60*60*1000 + minutes
        if(hours > 12) hours -= 12*60*60*1000
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.lineCap = 'round'
        //外圆
        ctx.fillStyle = ctx.strokeStyle = color[0]
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.arc(0,0,data.params.w,0,2*Math.PI)
        if(!!add) {
            ctx[data.drawType]()
            ctx.stroke()
        }
        
        let angle = 360/12
        ctx.lineWidth = 3
        // 时钟刻度
        for(let i = 1; i <= 12; i ++) {
            ctx.save()
            ctx.textAlign ="center"
            ctx.font = "12px blod"
            ctx.fillStyle = ctx.strokeStyle = color[1]
            ctx.beginPath()
            ctx.rotate(angle*i*Math.PI/180)
            ctx.lineTo(0, -data.params.w)
            ctx.lineTo(0, -data.params.w*18/20)
            if(!!add) ctx.stroke()
            ctx.fillStyle = ctx.strokeStyle = color[2]
            ctx.translate(0, -data.params.w*16/20)
            ctx.rotate(-angle*i*Math.PI/180)
            ctx.fillText(i, 0, 5)
            ctx.restore()
        }
        let angle1 = 360/60
        ctx.lineWidth = 1
        // 分钟刻度
        for(let i = 1; i <= 60; i ++) {
            ctx.fillStyle = ctx.strokeStyle = color[1]
            ctx.save()
            ctx.beginPath()
            ctx.rotate(angle1*i*Math.PI/180)
            ctx.lineTo(0, -data.params.w)
            ctx.lineTo(0, -data.params.w*19/20)
            if(!!add) ctx.stroke()
            ctx.restore()
        }

        // 时针
        let h_angle = 360/12/3600/1000
        ctx.save()
        ctx.fillStyle = ctx.strokeStyle = color[5]
        ctx.lineWidth = 5
        ctx.rotate(h_angle*hours*Math.PI/180)
        ctx.beginPath()
        ctx.lineTo(0, 5)
        ctx.lineTo(0, -data.params.w/2.5)
        if(!!add) ctx.stroke()
        ctx.restore()
        // 分针
        let m_angle = 360/3600/1000
        ctx.save()
        ctx.fillStyle = ctx.strokeStyle = color[4]
        ctx.lineWidth = 3
        ctx.rotate(m_angle*minutes*Math.PI/180)
        ctx.beginPath()
        ctx.lineTo(0, 5)
        ctx.lineTo(0, -data.params.w/2)
        if(!!add) ctx.stroke()
        ctx.restore()

         // 秒针
        let s_angle = 360/60/1000
        ctx.save()
        ctx.fillStyle = ctx.strokeStyle = color[3]
        ctx.lineWidth = 2
        ctx.rotate(s_angle*seconds*Math.PI/180)
        ctx.beginPath()
        ctx.lineTo(0, 5)
        ctx.lineTo(0, -data.params.w/1.5)
        if(!!add) ctx.stroke()
        ctx.restore()
       
        // 中心点
        ctx.fillStyle = ctx.strokeStyle = color[6]
        ctx.beginPath()
        ctx.arc(0,0,3,0,2*Math.PI)
        if(!!add) ctx.fill()
        ctx.beginPath()
        ctx.arc(0,0,data.params.w,0,2*Math.PI)
        _setTopoBorder(data, add)
    }
    //信号灯
    function light(data, add) {
        data.offset = data.offset || 0
        if(!!data.isOn) {
            if(data.offset > 6) data.offset = 0
            data.offset += data.speed || 0.1
        }
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.beginPath()
        ctx.fillStyle = ctx.strokeStyle = color[0]
        ctx.arc(0,0,8,0,2*Math.PI)
        if(!!add) ctx[data.drawType]()
        ctx.fillStyle = ctx.strokeStyle = color[1]
        ctx.save()
        ctx.beginPath()
        ctx.arc(0,0,8 + 2*data.offset,0,2*Math.PI)
        if(!!add) ctx.stroke() 
        ctx.restore()
        ctx.beginPath()
        ctx.arc(0,0, 20,0,2*Math.PI)
    }
    //dom节点
    function dom(data, add) {
        let ctx = View2d.ctx
        if(!!data.element) {
            let left = data.position.x - data.params.w/2
            let top = data.position.y - data.params.h/2
            let rotate = data.rotateVal, scaleX = data.scaleVal.x, scaleY = data.scaleVal.y
            if(data.parentId !== undefined) {
                parent = data.findParent()
                scaleX += scaleX*(parent.scaleVal.x - 1)
                scaleY += scaleY*(parent.scaleVal.y - 1)
            }
            data.element.style.left = left  + 'px'
            data.element.style.top = top  + 'px'
            data.element.style.pointerEvents = View2d.mode.type == 'preview' ? 'auto' : 'none'
            data.element.style.transform = `rotateZ(${rotate}deg) scale(${scaleX}, ${scaleY})`
        }
        let color = nodeSetColor(data)
        ctx.fillStyle = color[0]
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        if(add) ctx.fill()
    }
    // 曲线
    function bezierLine(data, add, pen) {
        let ctx = pen || View2d.ctx
        let points = []
        ctx.lineWidth = data.lineWidth || 1
        ctx.lineCap = data.lineCap || 'rect'
        let lineDash = data.lineDash || [0,0]
        ctx.setLineDash( lineDash );
        let color = nodeSetColor(data)
        ctx.fillStyle = color[1]
        ctx.strokeStyle = color[0]
        if(data.helperBox) {
            ctx.shadowBlur = 5
            ctx.shadowColor = data.freeze ? '#ccc': 'red'
        }
        _darwlinePath(data.linePath, ctx)
        if(add) ctx[data.drawType]()
    }
    function _darwlinePath(lineData,ctx) {
        let points = []
        lineData.forEach( (item, i) => {
            if(item.id !== undefined) {
                let node = getNodeById(item.id)
                let position = {x: 0, y: 0}
                if(node !== undefined){
                    position = node.position
                }else{
                    position = {x: item.x, y: item.y}
                }
                points.push({
                    type: item.type || 'straight',
                    ...position
                })  
            }else{
                points.push({type: item.type || 'straight',...item})
            }
        })
        let len = points.length
        if (len < 2) return false
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        if (len === 2) {
            ctx.lineTo(points[1].x, points[1].y)
        }else {
            let controlPoint = []
            for (let i = 1; i < len - 1; i++) {
                controlPoint = controlPoint.concat(_getControlpoint([points[i - 1], points[i], points[i + 1]]))
            }
            let i = 2
            if(points[1].type=='curve') {
                ctx.quadraticCurveTo(controlPoint[0].x, controlPoint[0].y, points[1].x, points[1].y)
            }else {
                ctx.lineTo(points[1].x,points[1].y)
            }
            for (i; i < len - 1; i++) {
                if(points[i].type=='curve') {
                    ctx.bezierCurveTo(
                        controlPoint[(i - 2) * 2 + 1].x,
                        controlPoint[(i - 2) * 2 + 1].y,
                        controlPoint[(i - 1) * 2].x,
                        controlPoint[(i - 1) * 2].y,
                        points[i].x,
                        points[i].y
                    )
                }else {
                    ctx.lineTo(points[i].x,points[i].y)
                }
            }
            if(points[i].type=='curve') {
                ctx.quadraticCurveTo(
                    controlPoint[(i - 2) * 2 + 1].x,
                    controlPoint[(i - 2) * 2 + 1].y,
                    points[i].x,
                    points[i].y
                )
            }else {
                ctx.lineTo(points[i].x,points[i].y)
            }
        }
    }
    function _getDistance(p1, p2) {
        return Math.sqrt(
            Math.pow(p1.x + p2.x, 2)
            +
            Math.pow(p1.y + p1.y, 2)
        )
    }
    function _getControlpoint(points) {//三个点出两个控制点
        const p01 = _getDistance(points[0], points[1])
        const p12 = _getDistance(points[1], points[2])
        const p02 = p01 + p12
        let vector = [points[2].x - points[0].x, points[2].y - points[0].y]
        return [
            {
                x: points[1].x - vector[0] * 0.5 * p01 / p02,
                y: points[1].y - vector[1] * 0.5 * p01 / p02
            },
            {
                x: points[1].x + vector[0] * 0.5 * p01 / p02,
                y: points[1].y + vector[1] * 0.5 * p01 / p02
            }
        ]
    }
    function _setTopoBorder(data, add) {
        let ctx = View2d.ctx
        if(add && data.border.show) {
            ctx.lineWidth = data.border.lineWidth || 1
            ctx.strokeStyle = data.border.color || 'red'
            ctx.lineCap = data.border.lineCap || 'butt'
            ctx.lineJoin = data.border.lineJoin || 'miter'
            ctx.setLineDash(data.border.lineDash || [0, 0])
            ctx.stroke()
        }
    }

    // 大屏
    function L_header(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        // ctx.clip()
        ctx.save()
        let scene = View2d.nodes.find( item => item.constructor === View2d.scene)
        
        ctx.font = `${data.text.fontStyle} ${data.text.fontWeight} ${data.text.fontSize}px ${data.text.fontFamily}`;
        let allScale = data.allScale || {x: 1,y: 1}
        let textW = ctx.measureText(data.text.content).width/allScale.x*scene.scaleVal.x
        for(let i=0; i<2; i++) {
            if(i == 1) {
                ctx.scale(1, -1)
                ctx.rotate(Math.PI)  
            }
            ctx.beginPath()
            ctx.fillStyle = ctx.strokeStyle = color[1] || '#4eddcc'
            ctx.lineTo(0,20)
            ctx.lineTo(-textW/2,20)
            ctx.lineTo(-textW/2 - 30,-20)
            ctx.lineTo(0,-20)
            if(add) {
                ctx.stroke()
            }
            ctx.beginPath()
            ctx.fillStyle = ctx.strokeStyle = color[0] || '#4eddcc'
            ctx.lineTo(0,25)
            ctx.lineTo(-textW/2-2,25)
            ctx.lineTo(-textW/2 - 36,-20)
            ctx.lineTo(-textW/2-data.params.w/5,-20)
            ctx.lineTo(-textW/2-data.params.w/4,20)
            ctx.lineTo(-data.params.w/2,20)
            if(add) ctx.stroke()
        }
        ctx.restore()   

        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        _setTopoBorder(data, add)
    }
    function L_left(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.fillStyle = ctx.strokeStyle = color[0] || '#fff'
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        // ctx.clip()
        ctx.save()
        for(let i=0; i<2; i++) {
            if(i == 1) {
                ctx.scale(-1, 1)
                ctx.rotate(Math.PI)  
            }
            ctx.beginPath()
            ctx.lineTo(-data.params.w/2+20,0)
            ctx.lineTo(-data.params.w/2+20,100)
            ctx.lineTo(-data.params.w/2,150)
            ctx.lineTo(-data.params.w/2,data.params.h/2)
            ctx.lineTo(data.params.w/2,data.params.h/2)
            ctx.lineTo(data.params.w/2,0)
            if(!!add) ctx.stroke()  
        }
        ctx.restore()
        ctx.beginPath()

        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        _setTopoBorder(data, add)
    }
    function L_right(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.fillStyle = ctx.strokeStyle = color[0] || '#fff'
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        // ctx.clip()
        ctx.save()
        for(let i=0; i<2; i++) {
            if(i == 1) {
                ctx.scale(-1, 1)
                ctx.rotate(Math.PI)  
            }
            ctx.beginPath()
            ctx.lineTo(data.params.w/2-20,0)
            ctx.lineTo(data.params.w/2-20,100)
            ctx.lineTo(data.params.w/2,150)
            ctx.lineTo(data.params.w/2,data.params.h/2)
            ctx.lineTo(-data.params.w/2,data.params.h/2)
            ctx.lineTo(-data.params.w/2,0)
            if(!!add) ctx.stroke()  
        }
        ctx.restore()
        ctx.beginPath()

        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        _setTopoBorder(data, add)
    }
    function L_center(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.fillStyle = ctx.strokeStyle = color[0] || '#fff'
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        // ctx.clip()
        ctx.save()
        for(let i=0; i<2; i++) {
            if(i == 1) {
                ctx.scale(-1, 1)
                ctx.rotate(Math.PI)  
            }
            ctx.beginPath()
            ctx.lineTo(data.params.w/2,0)
            ctx.lineTo(data.params.w/2,data.params.h/2)
            ctx.lineTo(-data.params.w/2,data.params.h/2)
            ctx.lineTo(-data.params.w/2,0)
            if(!!add) ctx.stroke()  
        }
        ctx.restore()
        ctx.beginPath()

        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        _setTopoBorder(data, add)
    }
    function L_bottom(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.fillStyle = ctx.strokeStyle = color[0] || '#fff'
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        // ctx.clip()
        ctx.save()
        for(let i=0; i<2; i++) {
            if(i == 1) {
                ctx.scale(-1, 1)
                ctx.rotate(Math.PI)  
            }
            ctx.beginPath()
            ctx.lineTo(data.params.w/2,0)
            ctx.lineTo(data.params.w/2,data.params.h/2)
            ctx.lineTo(-data.params.w/2,data.params.h/2)
            ctx.lineTo(-data.params.w/2,0)
            if(!!add) ctx.stroke()  
        }
        ctx.restore()
        ctx.beginPath()

        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        _setTopoBorder(data, add)
    }
    function L_box(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        // ctx.clip()
        ctx.save()
        let scene = View2d.nodes.find( item => item.constructor === View2d.scene)
        
        ctx.font = `${data.text.fontStyle} ${data.text.fontWeight} ${data.text.fontSize}px ${data.text.fontFamily}`;
        let allScale = data.allScale || {x: 1,y: 1}
        let textW = ctx.measureText(data.text.content).width/allScale.x*scene.scaleVal.x
        for(let i=0; i<2; i++) {
            if(i == 1) {
                ctx.scale(1, -1)
                ctx.rotate(Math.PI)  
            }
            ctx.beginPath()
            ctx.fillStyle = ctx.strokeStyle = color[0] || '#4eddcc'
            ctx.lineTo(0,40 - data.params.h/2)
            ctx.lineTo(-textW/2-8,40 - data.params.h/2)
            ctx.lineTo(-textW/2 - 20,30 - data.params.h/2)
            ctx.lineTo(-textW/2 - 70,30 - data.params.h/2)
            ctx.lineTo(-textW/2 - 100,5 - data.params.h/2)
            ctx.lineTo(-textW/2 - 120,5 - data.params.h/2)
            ctx.lineTo(-textW/2 - 150,5- data.params.h/2)
            ctx.lineTo(-data.params.w/2+30,5- data.params.h/2)
            ctx.arc(-data.params.w/2+10,15- data.params.h/2, 5, 0 ,2*Math.PI)
            ctx.lineTo(-data.params.w/2+5,5- data.params.h/2+30)
            ctx.lineTo(-data.params.w/2+5,-130)
            ctx.lineTo(-data.params.w/2+20,-100)
            ctx.lineTo(-data.params.w/2+20,100)
            ctx.lineTo(-data.params.w/2+5,130)
            ctx.lineTo(-data.params.w/2+5,data.params.h/2-30)
            ctx.lineTo(-data.params.w/2+30,data.params.h/2-5)
            ctx.lineTo(0,data.params.h/2-5)
            if(add) ctx.stroke()
            ctx.beginPath()
            ctx.fillStyle = ctx.strokeStyle = color[1] || '#4eddcc'
            ctx.lineTo(0,30 - data.params.h/2)
            ctx.lineTo(-textW/2,30 - data.params.h/2)
            ctx.lineTo(-textW/2 - 10,20 - data.params.h/2)
            ctx.lineTo(-textW/2 - 60,20 - data.params.h/2)
            ctx.lineTo(-textW/2 - 80,- data.params.h/2)
            ctx.lineTo(-textW/2 - 150,- data.params.h/2)
            ctx.lineTo(-data.params.w/2,- data.params.h/2)
            ctx.lineTo(-data.params.w/2,- data.params.h/2)
            ctx.lineTo(-data.params.w/2,data.params.h/2)
            ctx.lineTo(0,data.params.h/2)
            if(add) ctx.stroke()
            ctx.fillStyle = ctx.strokeStyle = color[2] || '#4eddcc'
            for(let j=0; j<3;j++){
                ctx.beginPath()
                ctx.lineTo(-textW/2 - 10,15-5*j - data.params.h/2)
                ctx.lineTo(-textW/2 - 55-5*j,15-5*j - data.params.h/2)
                ctx.lineTo(-textW/2 - 60-5*j,13-5*j - data.params.h/2)
                ctx.lineTo(-textW/2 - 10,13-5*j - data.params.h/2)
                ctx.closePath()
                if(add) ctx.fill()
            }
        }
        ctx.restore()   

        ctx.beginPath()
        ctx.rect( 
        - data.params.w/2,
        - data.params.h/2,
        data.params.w, data.params.h)
        _setTopoBorder(data, add)
    }

    function oval(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.beginPath()
        ctx.fillStyle = ctx.strokeStyle = color[0]
        ctx.save()
        let { w, h } = data.params 
        for(let i = 0; i < 2; i++) {
            ctx.rotate(Math.PI*i)
            ctx.lineTo(0,h/2)
            ctx.arc( -w/2 + h/2, 0, h/2, 0.5*Math.PI, 1.5*Math.PI)
            ctx.lineTo(0,-h/2)
        } 
        ctx.closePath()
        ctx.restore()
        if(add) {
            ctx[data.drawType]()
        }
        _setTopoBorder(data, add)
    }
    function parallelogram(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.fillStyle = ctx.strokeStyle = color[0]
        ctx.beginPath()
        ctx.save()
        ctx.transform(1,0,-25*Math.PI/180,1,0,0); 
        ctx.rect(
            - data.params.w/2,
            - data.params.h/2,
            data.params.w,
            data.params.h)
        if(add) ctx[data.drawType]()
        ctx.restore()
        _setTopoBorder(data, add)
    }
    function arrow(data, add) {
        let ctx = View2d.ctx
        let color = nodeSetColor(data)
        ctx.beginPath()
        ctx.fillStyle = ctx.strokeStyle = color[0]
        ctx.lineTo(-data.params.w/2, 0)
        ctx.lineTo(data.params.w/2 - 30, 0)
        ctx.lineTo(data.params.w/2 - 30, 10)
        ctx.lineTo(data.params.w/2, 0)
        ctx.lineTo(data.params.w/2 - 30, -10)
        ctx.lineTo(data.params.w/2 - 30, 0)
        if(!!add) ctx.stroke()
        
        ctx.beginPath()
        ctx.rect(
            -data.params.w/2,
            -data.params.h/2,
            data.params.w,
            data.params.h
        )
    }
    return View2d
})