<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-input v-model="listQuery.keyword" placeholder="输入关键字搜索" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        type="index"
        width="50"
        label="编号"
        align="center"
      />
      <el-table-column align="center" label="资源名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="资源路径">
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">
            编辑
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
    <el-dialog
      :title="isEdit?'编辑资源':'添加资源'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="form"
        :model="resource"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="资源名称：" prop="name">
          <el-input v-model="resource.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="资源url：" prop="url">
          <el-input v-model="resource.url" style="width: 250px" />
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input v-model="resource.description" type="textarea" :rows="5" style="width: 250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { formatDate } from '@/utils'
import { fetchPage, add, deleteResource, update } from '@/api/resource'

const defaultResource = {
  id: null,
  name: null,
  url: null,
  description: null
}
export default {
  name: 'Resource',
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
        keyword: null
      },
      resource: Object.assign({}, defaultResource),
      isEdit: false,
      rules: {
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入资源url', trigger: 'blur' }]
      },
      dialogVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchPage(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
        this.listLoading = false
      })
    },
    handleSearch() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.resource = Object.assign({}, defaultResource)
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.isEdit = true
      this.resource = Object.assign({}, row)
    },
    handleDelete(id) {
      this.$confirm('资源删除后不可恢复,是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResource({ id: id }).then(() => {
          this.$message.success('资源删除成功')
        })
      })
    },
    handleDialogConfirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            update(this.resource).then(() => {
              this.$message.success('更新资源成功')
              this.dialogVisible = false
              this.getList()
            })
          } else {
            add(this.resource).then(() => {
              this.$message.success('添加资源成功')
              this.dialogVisible = false
              this.getList()
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
