<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        type="index"
        width="50"
        label="编号"
        align="center"
      />

      <el-table-column width="180px" align="center" label="编辑日期">
        <template slot-scope="scope">
          <span>{{ scope.row.edittime | formatCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column width="180px" align="center" label="发布日期">
        <template slot-scope="scope">
          <span>{{ scope.row.publishdate | formatCreateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            {{ stateMap[row.state] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <router-link :to="'/article/detail/'+row.id" class="link-type">
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <router-link :to="'/article/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </router-link>
          <el-button style="margin-left: 10px" type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { formatDate } from '@/utils'
import { fetchList, deleteArticle } from '@/api/article'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'List',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info'
      }
      return statusMap[status]
    },
    formatCreateTime(time) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        keywords: null
      },
      stateMap: {
        0: '草稿',
        1: '已发表'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
        this.listLoading = false
      })
    },
    handleDelete(id) {
      const ids = []
      ids.push(id)
      const params = new URLSearchParams()
      params.append('aids', ids)
      params.append('state', 2)
      deleteArticle(params).then(() => {
        this.$message.success('删除成功')
      })
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
</style>
