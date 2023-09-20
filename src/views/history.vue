<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Search } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模糊查询值
const searchValue = ref<string>('')

const tableColumn: Array<any> = [
    {
        label: '序号',
        prop: 'id'
    },
    {
        label: '日期',
        prop: 'date'
    },
    {
        label: '时间',
        prop: 'time'
    },
    {
        label: '名称',
        prop: 'name'
    },
    {
        label: '创建人',
        prop: 'createUser'
    }
]

const dataSource = ref<Array<any>>([])

onMounted(() => {
    getList()
})

// 监听分页变化重新请求数据
const currentPage = ref<number>(1)

watch(currentPage, () => {
    getList()
})

const loading = ref<Boolean>(false)
// 获取假数据
const getList = () => {
    loading.value = true
    setTimeout(() => {
        loading.value = false
        dataSource.value = [
            {
                id: 1,
                date: '2023-02-23',
                time: '16:23:00',
                name: '受电弓挂异物',
                createUser: '张志伟'
            },
            {
                id: 2,
                date: '2023-02-23',
                time: '16:23:00',
                name: '受电弓挂异物',
                createUser: '张志伟'
            },
            {
                id: 3,
                date: '2023-02-23',
                time: '16:23:00',
                name: '受电弓挂异物',
                createUser: '张志伟'
            },
            {
                id: 4,
                date: '2023-02-23',
                time: '16:23:00',
                name: '受电弓挂异物',
                createUser: '张志伟'
            },
            {
                id: 5,
                date: '2023-02-23',
                time: '16:23:00',
                name: '受电弓挂异物',
                createUser: '张志伟'
            },
            {
                id: 6,
                date: '2023-02-23',
                time: '16:23:00',
                name: '受电弓挂异物',
                createUser: '张志伟'
            },
            {
                id: 7,
                date: '2023-02-23',
                time: '16:23:00',
                name: '受电弓挂异物',
                createUser: '张志伟'
            },
            {
                id: 8,
                date: '2023-02-23',
                time: '16:23:00',
                name: '受电弓挂异物',
                createUser: '张志伟'
            },
            {
                id: 9,
                date: '2023-02-23',
                time: '16:23:00',
                name: '受电弓挂异物',
                createUser: '张志伟'
            },
            {
                id: 10,
                date: '2023-02-23',
                time: '16:23:00',
                name: '受电弓挂异物',
                createUser: '张志伟'
            },
        ]
    }, 2000)
}
</script>

<template>
    <div class="history">
        <el-input v-model="searchValue" class="search" placeholder="搜案顶案/教语/规卓/案例" :prefix-icon="Search"></el-input>

        <div class="table">
            <el-table max-height="26rem" v-loading="loading" empty-text="没有数据" header-cell-class-name="header" cell-class-name="cell" row-class-name="row" :data="dataSource">
                <el-table-column v-for="(item, index) in tableColumn" :key="index" v-bind="item"/>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button @click="() => router.push({path: '/makingView', query: {id: scope.row.id}})" class="btn" type="text"
                        >查看</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <span>共计: 12条数据</span><el-pagination small background v-model:current-page="currentPage" :pager-count="4" layout="prev, pager, next" :total="11" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scope>
.history {
    height: 100%;
    overflow: hidden;
    flex-shrink: 0;
    background: #08163c95;
    padding: 1.25rem 0;
    .search {
        margin: 0 1.25rem;
        width: 41.25rem;
        height: 3.375rem;
        flex-shrink: 0;
        background: #165DFF;
    }
    .table {
        margin-top: 2rem;
        .header {
            background: #0b1c43;
            height: 1.75rem;
            flex-shrink: 0;
            text-align: center;
        }
        .cell {
            text-align: center;
            padding-top: 0.075rem;
            padding-bottom: 0.075rem;
            .btn {
                color: #38FFFF;
                text-align: center;
                font-family: Alibaba PuHuiTi 2.0;
                font-size: 0.875rem;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
            }
        }
        .el-table__body-wrapper {
            --el-table-bg-color: rgba(22, 93, 255, 0.3)
        }
        .row:nth-child(odd) {
            background: rgba(11, 50, 141, 0.2);
            --el-table-row-hover-bg-color: #1e93bfbd
        }
        .row:nth-child(even) {
            background: rgba(7, 27, 71, 0.3);
            --el-table-row-hover-bg-color: #1e93bfbd
        }
        .pagination {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 2rem;
            align-items: center;
            color: #FFF;
            text-align: center;
            font-family: Alibaba PuHuiTi 2.0;
            font-size: 0.75rem;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            .el-pagination {
                margin-left: 1.5rem;
                button {
                    background: #172E6B;
                    color: #fff;
                    border-radius: 0;
                }
                button:disabled {
                    background: #29365b;
                    color: #ffffff88;
                }
                .number {
                    background: #172E6B;
                    color: #fff;
                    border-radius: 0;
                }
                .is-active {
                    background-color: rgba(22, 93, 255, 1);
                    color: #fff;
                }
            }
        }
    }
}
</style>