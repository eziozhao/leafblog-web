<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">

      <el-table-column width="180px" align="center" label="编辑日期">
        <template slot-scope="scope">
          <span>{{ scope.row.edittime | formatCreateTime }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-refresh-left" @click="handleRecover(scope.row.id)">
            还原
          </el-button>
          <el-button
            style="margin-left: 10px"
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.pageNum"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>
<script>
import { formatDate } from '@/utils'
import { fetchList, deleteArticle, recover } from '@/api/article'
import Pagination from '@/components/Pagination/index'

export default {
  name: 'Bin',
  components: { Pagination },
  filters: {
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
        pageSize: 5,
        keyword: null,
        state: 2
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleDelete(id) {
      this.$confirm('将彻底删除该文章，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = []
        ids.push(id)
        const params = new URLSearchParams()
        params.append('aids', ids)
        params.append('state', 3)
        deleteArticle(params).then(() => {
          this.$message.success('删除成功')
          this.getList()
        })
      })
    },
    handleRecover(id) {
      recover({ id: id }).then(() => {
        this.$message.success('恢复成功')
        this.getList()
      })
    }
  }
}
</script>

<style scoped>

</style>
