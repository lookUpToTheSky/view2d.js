<template>
<div class='wrap'>
    <div class="head-title">
        <el-button type="primary" plain size="small" @click="userEquipmentGroupShow = true; groupName = null">
            <i class="el-icon-circle-plus-outline"></i>
            &nbsp;新建设备组
        </el-button>
        <div>
            <el-input class="search-input" v-model="modelName" size="small" placeholder="设备名称"></el-input>
            <el-button type="primary" @click="filters" size="small"><i class="el-icon-search">搜索</i></el-button>
        </div>
    </div>
    <div class="table" 
        v-for="(child, index) of allEquipmentListGroup"
        :key="index">
        <div class="group">
            <div class="groupName">
                <i class="el-icon-menu"></i>
                &nbsp;{{child.groupName}}
                <el-button type="primary" size="small" plain 
                    @click="
                    userEquipmentGroupShow = true;
                    groupIndex = index;
                    groupName = child.groupName">
                    <i class="el-icon-edit"></i>
                </el-button>
            </div>
            <el-button type="danger" size="small" @click="onDeleteGroup(index)"><i class="el-icon-delete"></i>删除该组</el-button>
            <el-button type="primary" size="small" @click="onAddEquipment(child.groupName)"><i class="el-icon-circle-plus-outline"></i>该组添加设备</el-button>
        </div>
        <el-table 
            ref="multipleTable"
            :data="child.equipmentList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" fit="true"> </el-table-column>
            <el-table-column
                label="#"
                fit="true">
                <template slot-scope="scope">{{scope.$index+1}} </template>
            </el-table-column>
            <el-table-column
                label="设备名称"
                fit="true">
                <template slot-scope="scope">
                    <i class="el-icon-s-platform"></i>
                    {{scope.row.equipmentName}}
                </template>
            </el-table-column>
            <el-table-column
                prop="buildTime"
                label="创建时间"
                fit="true">  
            </el-table-column>
            <el-table-column
                label="传感器数量"
                fit="true">  
                 <template slot-scope="scope">
                    {{scope.row.sensorList.length}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="400">
                <template slot-scope="scope">
                    <el-button type="primary" @click="onChargeSensor(child.groupName, scope)" size="mini">管理传感器</el-button>  
                    <el-button type="primary" @click="onEditEquipment(child.groupName, scope)" size="mini">编辑设备</el-button>
                    <el-button type="primary" size="mini">启用</el-button>  
                    <el-button type="danger" @click="onDeleEquipment(child.groupName, scope)" size="mini">删除设备</el-button>  
                </template>  
            </el-table-column>
        </el-table>
    </div>
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
    <!-- 传感器管理 -->
    <el-dialog
        title="传感器管理"
        :visible.sync="sensorShow"
        top="8vh"
        width="90%">
        <div class="selecteEquipment">
            设备组：
            <el-select  :disabled="true" v-model="this.currentSensor.groupName" placeholder="未命名" size="small"></el-select>
            设备：
            <el-select :disabled="true" v-model="this.currentSensor.equipmentName" placeholder="未命名" size="small"></el-select>
        </div>
        <el-table 
            ref="multipleTable"
            :data="this.currentSensor.sensorList"
            tooltip-effect="dark"
            height="60vh"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" fit="true"> </el-table-column>
            <el-table-column
                label="#"
                fit="true">
                <template slot-scope="scope">{{scope.$index+1}} </template>
            </el-table-column>
            <el-table-column
                label="传感器名称"
                fit="true">
                <template slot-scope="scope">
                    <i class="el-icon-data-analysis"></i>
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column
                prop="buildTime"
                label="创建时间"
                fit="true">  
                2020-08-12
            </el-table-column>
            <el-table-column
                label="类型"
                fit="true">  
                <template slot-scope="scope">
                    <span v-if="scope.row.type === '1'">开关型</span>
                    <span v-else-if="scope.row.type === '2'">数值型</span>
                    <span v-else-if="scope.row.type === '3'">信息型</span>
                </template>
            </el-table-column>
            <el-table-column
                label="是否启用"
                fit="true"> 
                <template slot-scope="scope">
                    <el-switch
                    v-model="scope.row.state"
                    active-color="#13ce66"
                    inactive-color="#888">
                    </el-switch>
                </template>  
            </el-table-column>
            <el-table-column label="操作" :fit="true">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini">修改</el-button>
                    <el-button type="danger" size="mini">删除</el-button>  
                </template>  
            </el-table-column>
        </el-table>
    </el-dialog>
</div>  
</template>

<script>
export default {
    data() {
        return {
            modelName: null,
            groupName: null,
            groupIndex: null,
            currentSensor: [],
            sensorShow: false,
            equipmentListGroup: [],
            userEquipmentGroupShow: false,
            allEquipmentListGroup: [{equipmentName:'设备名称——001',  buildTime: '2020-9-8 11:00:00', sensorCount: 50}]
        }
    },
    methods: {
        filters () {
            if(this.modelName) {
                this.equipmentListGroup = this.allEquipmentListGroup.filter( item => item.name.indexOf(this.modelName) != -1);
            }else{
                this.equipmentListGroup = [...this.allEquipmentListGroup]
            }
        },
        handleSelectionChange () {

        },
        onAddEquipmentGroup () {
            if(this.groupIndex) {
                this.allEquipmentListGroup[this.groupIndex].groupName = this.groupName;
            }else{
                this.allEquipmentListGroup.unshift({groupName: this.groupName, equipmentList: []})
            }
            this.$store.commit('addEquipmentGroup', this.allEquipmentListGroup)
            this.userEquipmentGroupShow = false
            this.value = this.groupName
        },
        onEditGroupName () {

        },
        onDeleteGroup (index) {
            this.allEquipmentListGroup.splice(index, 1);
            this.$store.commit('addEquipmentGroup', this.allEquipmentListGroup)
        },
        onAddEquipment (name) {
            this.$router.push({path: '/add-equipment', query: {name}})
        },
        onEditEquipment (name, scope) {
            this.$router.push({path: '/add-equipment', query: {
                    groupName: name,
                    index: scope.$index,
                    equipment: JSON.stringify(scope.row)
                }})
        },
        onDeleEquipment (groupName, scope) {
            this.allEquipmentListGroup.forEach( (item, i) => {
                if(item.groupName == groupName) {
                    this.allEquipmentListGroup[i].equipmentList.splice(scope.$index, 1);
                }
            })
            this.$store.commit('addEquipmentGroup', this.allEquipmentListGroup)
        },
        onChargeSensor (groupName, scope) {
            let current = {...scope.row}
            current.groupName = groupName
            this.currentSensor = current
            this.sensorShow = true
        }
    },
    mounted () {
        this.equipmentListGroup = this.allEquipmentListGroup = [...this.$store.state.userEquipment.userEquipmentGroup]
    }
}
</script>

<style lang="scss" scoped>
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
        color: #409EFF;
        font-size: 18px;
        background: #fff;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #409EFF;
        background-image: linear-gradient(45deg,#2265ac,#29c4ce);
        .search-input {
            width: 200px;
            margin-right: 20px;
        }
    }
    .table {
        width:100%;
        .group {
            display: flex;
            align-items: center;
            margin: 10px 0;
            .groupName {
                font-size: 16px;
                margin-right: 20px;
            }
        }
    }
    .selecteEquipment {
        margin-bottom: 20px;
    }
}
</style>