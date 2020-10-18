<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-input v-model="listQuery.keyword" placeholder="输入角色名搜索" />
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
      <el-table-column align="center" label="角色名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="600px">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-menu" @click="handleAllocMenu(scope.row.id)">
            分配菜单
          </el-button>
          <el-button type="success" size="small" icon="el-icon-key" @click="handleAllocResource(scope.row.id)">
            分配资源
          </el-button>
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
      :title="isEdit?'编辑角色':'添加角色'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="roleForm"
        :model="role"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="角色名：" prop="name">
          <el-input v-model="role.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="备注：" prop="description">
          <el-input v-model="role.description" type="textarea" :rows="5" style="width: 250px" />
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
import { fetchRoleList, updateRole, addRole, deleteRole } from '@/api/role'
const defaultRole = {
  id: null,
  name: null,
  description: null
}
export default {
  name: 'Role',
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
        pageSize: 10,
        keyword: null
      },
      role: Object.assign({}, defaultRole),
      dialogVisible: false,
      isEdit: false,
      rules: { name: [{ required: true, message: '请输入角色名', trigger: 'blur' }] }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchRoleList(this.listQuery).then(res => {
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
      this.role = Object.assign({}, defaultRole)
    },
    handleAllocMenu(id) {},
    handleAllocResource(id) {},
    handleUpdate(role) {
      this.dialogVisible = true
      this.isEdit = true
      this.role = Object.assign({}, role)
    },
    handleDelete(id) {
      deleteRole({ roleId: id }).then(() => {
        this.$message.success('删除角色成功')
        this.getList()
      })
    },
    handleDialogConfirm() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            updateRole(this.role).then(() => {
              this.$message.success('更新角色成功')
              this.dialogVisible = false
              this.getList()
            })
          } else {
            addRole(this.role).then(() => {
              this.$message.success('添加角色成功')
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
