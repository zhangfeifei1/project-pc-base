<template>
    <div class="bg">
        <div class="search">
            <el-select v-model="version" size="small" style="width: 180px">
                <el-option v-for="item in versions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="channel" size="small" style="width: 180px">
                <el-option v-for="item in channels"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="range" size="small" style="width: 220px">
                <el-option v-for="item in ranges"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="data">
            <div class="right">
                <span class="graytext">启动次数分布</span>
                <span class="graytext">次使用时长分布</span>
                <span class="graytext">日使用时长分布</span>
            </div>
        </div>
        <el-table :data="data" :loading="loading" size="small" >
            <el-table-column prop="date" label="启动次数" />
            <el-table-column prop="addUser" label="使用用户" width="150" />
            <el-table-column prop="firstDay" label="使用用户占比" width="150" />
        </el-table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loading: false,
            version: '选项一',
            channel: '选项一',
            range: '选项一',
            versions: [
                {
                    value: '选项一',
                    label: '全版本'
                }
            ],
            channels: [
                {
                    value: '选项一',
                    label: '全渠道'
                }
            ],
            ranges: [
                {
                    value: '选项一',
                    label: '最近7天'
                },
                {
                    value: '选项二',
                    label: '最近15天'
                },
                {
                    value: '选项三',
                    label: '最近30天'
                }
            ],
            data: []
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
    .data{
        position: relative;
        padding: 40px 20px 20px 20px;
        .right{
            position: absolute;
            right: 20px;
            top: 10px;
        }
    }
    .graytext{
        color: #888888; 
        font-size: 12px; 
        line-height: 14px;
        padding: 0 10px;
    }
    .el-table th{
        color: #333333;
        background: #fcfcfc;
    }
</style>