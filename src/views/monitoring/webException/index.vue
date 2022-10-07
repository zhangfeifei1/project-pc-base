<template>
    <div class="bg">
        <div class="search">
            <el-select v-model="condition" size="small" style="width: 500px;">
                <el-option v-for="item in conditions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <span class="text" style="margin-left:10px">1小时</span>
            <span class="text">1天</span>
            <span class="text">7天</span>
            <span class="text" style="margin-right:10px">30天</span>
            <el-date-picker type="date" v-model="date1" placeholder="请选择对比日期" style="width: 200px" size="small"></el-date-picker>
            <span>-</span>
            <el-date-picker type="date" v-model="date2" placeholder="请选择对比日期" style="width: 200px" size="small"></el-date-picker>
        </div>
        <div class="echart">
            <span class="blacktext">错误总数：{{number}}</span>
        </div>
        <el-table :data="data" :loading="loading" size="small" >
            <el-table-column type="selection" width="60" />
            <el-table-column prop="thirdDay" label="事件列表" />
            <el-table-column prop="fourthDay" label="错误类型" width="100" />
            <el-table-column prop="fivthDay" label="状态" width="100" />
            <el-table-column prop="sixthDay" label="时间" width="100" />
            <el-table-column prop="seventhDay" label="事件数" width="100"/>
            <el-table-column prop="fourtythDay" label="用户数" width="100"/>
            <el-table-column prop="thirdtythDay" label="版本" width="100"/>
        </el-table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loading: false,
            data: [],
            condition:'',
            date1: '',
            date2: '',
            number: 0,
            conditions: [
                {
                    value: '选项一',
                    label: '状态'
                },
                {
                    value: '选项二',
                    label: '分配'
                },
                {
                    value: '选项三',
                    label: '收藏'
                },
                {
                    value: '选项四',
                    label: '发行版本'
                },
                {
                    value: '选项五',
                    label: '应用版本'
                },
                {
                    value: '选项六',
                    label: '错误类型'
                },
                {
                    value: '选项七',
                    label: 'IP'
                },
                {
                    value: '选项八',
                    label: '文件名'
                },
                {
                    value: '选项九',
                    label: 'URL'
                },
                {
                    value: '选项十',
                    label: '浏览器'
                },
                {
                    value: '选项十一',
                    label: '操作系统'
                },
                {
                    value: '选项十二',
                    label: '设备'
                }
            ],
        }
    }
}
</script>
<style lang="less">
    .bg{
        margin: 20px;
        background: #ffffff;
    }
    .search{
        padding: 20px;
        border-bottom: 1px solid #eeeeee;
    }
    .echart{
        height: 200px;
        padding: 20px;
    }
    .text{
        color: #91a3ad; 
        font-size: 13px; 
        padding: 0 10px;
        line-height: 15px;
    }
    .blacktext{
        color:#333333; 
        font-size: 13px; 
        line-height: 15px;
        padding: 17px;
    }
    .el-table th{
        background: #fcfcfc;
    }
</style>