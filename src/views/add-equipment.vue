<template>
<div class='wrap'>
    <div class="head-title"><i class="el-icon-success"></i>&nbsp;{{isEdit?'编辑':'添加'}}设备</div>
    <ul class="equipmentInfo">
        <li>
            <label>设备分组</label>
            <el-select class="select" :disabled="isEdit" v-model="value" size="small" placeholder="选择设备组">
                <el-option v-for="(item, i) of group" :key="i" :value="item.groupName" :label="item.groupName"></el-option>
            </el-select>
            <el-button type="primary" v-show="!isEdit" @click="userEquipmentGroupShow = true" size="small"><i class="el-icon-plus"></i></el-button>
        </li>
        <li>
             <label>设备名称</label>
             <el-input class="select" v-model="equipmentName"  placeholder="请输入设备名称" size="small"></el-input>
        </li>
        <li>
            <label>传感器</label>
            <el-button type="primary" class="add-button" @click="addSensor(1)" size="small">添加</el-button>
            <el-button type="primary" class="add-button" @click="addSensor(2)" size="small" plain>批量添加</el-button>
            <div class="sensorList">
                <div class="sensor" v-for="(item, index) of sensorList" :key="index">
                    <el-input class="add-button" v-model="item.name" size="small" placeholder="传感器名称"></el-input>
                    <el-select class="add-button" v-model="item.type" size="small" placeholder="类型">
                        <el-option v-for="val of sensorType" :key="val.vlaue" :value="val.value" :label="val.type"></el-option>
                    </el-select>
                    <el-button type="danger" size="small" @click="deleteSensor(index)" plain>删除</el-button>
                </div>
            </div>
        </li>
        <li>
            <el-button type="primary" class="add-button" @click="onsmbmit" size="small">确定{{isEdit?'编辑':'添加'}}此设备</el-button>
        </li>
    </ul>
    <el-dialog
        title="批量添加传感器"
        :visible.sync="centerDialogVisible"
        width="375px"
        >
        <ul class="addLotSensor">
            <li>
                <span>数量：<small type="priamry">(必填)</small></span><el-input-number class="inputW" v-model="addNum" size="small" :min="1" :max="50"></el-input-number>
            </li>
            <li>
                <span>名称前缀：<small>(可选)</small></span><el-input class="inputW" v-model="addName" size="small"></el-input>
            </li>
            <li>
                <span>类型：<small>(必填)</small></span>
                <el-select class="inputW" v-model="addType" size="small" placeholder="类型">
                    <el-option v-for="val of sensorType" :key="val.value" :value="val.value" :label="val.type"></el-option>
                </el-select>
            </li>
        </ul>
        <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false" size="small">取 消</el-button>
            <el-button type="primary" @click="addLotSensor" size="small">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 离开提示 -->
    <el-dialog
        title="设备组"
        :visible.sync="equipmentWarn"
        width="30%">
        <span>设备未提交，是否提交？</span>
        <span slot="footer" class="dialog-footer">
            <el-button @click="onLeave">放弃提交</el-button>
            <el-button type="primary" @click="onsmbmit">提交设备</el-button>
        </span>
    </el-dialog>
    <!-- 创建设备组 -->
    <el-dialog
        title="设备组名称"
        :visible.sync="userEquipmentGroupShow"
        width="30%">
        <el-input v-model="groupName" placeholder="请输入设备组名称"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="userEquipmentGroupShow = false">取消</el-button>
            <el-button type="primary" @click="onAddEquipmentGroup">确定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
import { Notification , MessageBox} from 'element-ui';
export default {
    data () {
        return {
            value: null,
            isEdit: false,
            index: 0,
            centerDialogVisible: false,
            equipmentWarn: false,
            userEquipmentGroupShow: false,
            sensorList: [],
            group: [],
            groupName: null,
            equipmentName: '',
            addNum: 5,
            addName: null,
            addType: '1',
            goPath: '',
            sensorType: [{value: '1', type: '开关型'},{value: '2', type: '数字型'},
            {value: '3', type: '信息型'}]
        }
    },
    methods: {
        onAddEquipmentGroup () {
            this.group.push({groupName: this.groupName, equipmentList: []})
            this.$store.commit('addEquipmentGroup', this.group)
            this.userEquipmentGroupShow = false
            this.value = this.groupName
        },
        addSensor (num) {
            if(num === 1) {
                this.sensorList.unshift({name: '', type: '1'})
            }else{
                this.centerDialogVisible = true
                this.addNum = 5
                this.addType = '1'
                 this.addName = null
            }
        },
        addLotSensor () {
            let sensor = {name: this.addName, type: this.addType, state: 0};
            if(this.addNum && this.addType) {
                for(let i = 0; i < this.addNum; i++) {
                    this.sensorList.unshift({...sensor})
                }
                this.centerDialogVisible = false
            }else{
                Notification({type: 'warning', message:'添加失败！必填项未完成！'})
            }
        },
        deleteSensor (index) {
            this.sensorList.splice(index, 1)
        },
        //提交添加设备
        onsmbmit () {
            this.group.forEach( (item, i) => {
                if(item.groupName === this.value) {
                    if(this.isEdit) {
                        this.group[i].equipmentList[this.index] = {
                            equipmentName: this.equipmentName,
                            buildTime: new Date().getTime(),
                            sensorList: this.sensorList
                        }
                    }else{
                        this.group[i].equipmentList.unshift({
                            equipmentName: this.equipmentName,
                            buildTime: new Date().getTime(),
                            sensorList: this.sensorList})
                        }
                    }
            })
            if(!this.isEdit) this.sensorList = [];
            this.$store.commit('addEquipmentGroup', [...this.group])
            Notification({type: 'success', message:'提交成功'})
            if(this.goPath) this.onLeave();
        },
        onLeave () {
            this.equipmentWarn = false
            this.sensorList = []
            this.$router.push(this.goPath)
        }
    },
    beforeRouteEnter(to, from, next) {
        if(to.query.name) {
            next(vm => {
                vm.value = to.query.name
            })
        }else if(to.query.equipment){
            next(vm => { 
                vm.isEdit = true;
                let equipment = JSON.parse(to.query.equipment)
                vm.index = to.query.index
                vm.value = to.query.groupName
                vm.equipmentName = equipment.equipmentName
                vm.sensorList = equipment.sensorList
            });
        }else{
            next()
        }
    },
    beforeRouteLeave(to, from, next) {
        if(this.sensorList.length > 0 && !this.isEdit) {
            this.goPath = to.path
            this.equipmentWarn = true
        }else{
            next()
        }
    },
    mounted () {
        this.group = this.$store.state.userEquipment.userEquipmentGroup
    }
}
</script>

<style scoped lang="scss">
    .wrap {
        padding: 20px;
        padding-top: 80px;
        height: 100vh;
        box-sizing: border-box;
        position: relative;
        .head-title {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            color: #fff;
            background-image: linear-gradient(45deg,#2265ac,#29c4ce);
            font-size: 18px;
            padding: 10px;
            border-bottom: 2px solid #409EFF;
        }
        .equipmentInfo {
            list-style: none;
            margin: 0;
            padding: 0;
            li {
                padding: 15px;
                align-items: center;
                margin-bottom: 20px;
                background: #fff;
                label {
                    width: 80px;
                    display: inline-block;
                    font-size: 16px;
                    color: #000;
                    margin-right: 20px;
                    text-align: end;
                }
                .select {
                    width: 320px;
                    margin-right: 10px;
                }
                .add-button {
                    width: 155px;
                }
                .sensorList {
                    .sensor {
                        display: flex;
                        margin-left: 30px;
                        margin-top: 10px;
                    }
                    .add-button {
                        margin-right: 10px;
                    }
                }
            }
        }
        .addLotSensor {
            li {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                >span {
                    display: inline-block;
                    width: 120px;
                }
            }
        }
        .inputW {
            width: 240px !important;
        }
    }
</style>