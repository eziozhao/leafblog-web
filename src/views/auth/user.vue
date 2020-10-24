<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-input v-model="listQuery.keyword" placeholder="输入用户名搜索" />
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
      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.regtime | formatCreateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="140" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.enabled"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success" size="small" icon="el-icon-user" @click="handleAllocRole(scope.row.id)">
            分配角色
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdateUser(scope.row)">
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
      :title="isEdit?'编辑用户':'添加用户'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="userForm"
        :model="user"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="user.username" style="width: 250px" />
        </el-form-item>
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="user.nickname" style="width: 250px" />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="user.email" style="width: 250px" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="user.password" type="password" style="width: 250px" />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="user.enabled">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="allocDialogVisible"
      width="30%"
    >
      <el-select v-model="allocRoleIds" multiple placeholder="请选择" size="small" style="width: 80%">
        <el-option
          v-for="item in allRoleList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="allocDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleAllocDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '@/utils'
import Pagination from '@/components/Pagination'
import { register } from '@/api/user'
import { fetchByUserId, fetchRoleList } from '@/api/role'
import { allocRole, changeStatus, deleteUser, fetchList, updateUser } from '@/api/admin'

const defaultUser = {
  id: null,
  username: null,
  password: null,
  nickname: null,
  email: null,
  enabled: 1
}
export default {
  name: 'User',
  components: { Pagination },
  filters: {
    formatCreateTime(time) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    const checkEmail = (rule, value, callback) => {
      const reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/
      if (!value || reg.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式错误'))
      }
    }
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 5,
        keyword: null
      },
      dialogVisible: false,
      user: Object.assign({}, defaultUser),
      isEdit: false,
      rules: {
        username: [{ required: true, message: '请输入帐号', trigger: 'blur' }],
        email: [{ message: '邮箱格式错误', trigger: 'blur', validator: checkEmail }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      allocDialogVisible: false,
      allocRoleIds: [],
      allRoleList: [],
      userId: null
    }
  },
  created() {
    this.getList()
    this.getRoles()
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
    getRoles() {
      fetchRoleList().then(res => {
        this.allRoleList = res.data
      })
    },
    fetchUserRole(id) {
      fetchByUserId({ userId: id }).then(res => {
        this.allocRoleIds = []
        const roles = res.data
        roles.forEach(el => this.allocRoleIds.push(el.id))
      })
    },
    handleSearch() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.user = Object.assign({}, defaultUser)
    },
    handleStatusChange(row) {
      const params = {
        userId: row.id,
        enable: row.enabled
      }
      changeStatus(params).then(() => {
        this.$message.success('修改用户状态成功')
      })
    },
    handleDelete(id) {
      deleteUser({ userId: id }).then(() => {
        this.$message.success('删除用户成功')
        this.getList()
      })
    },
    handleAllocRole(id) {
      this.allocDialogVisible = true
      this.userId = id
      this.fetchUserRole(id)
    },
    handleUpdateUser(row) {
      this.dialogVisible = true
      this.isEdit = true
      this.user = Object.assign({}, row)
    },
    handleDialogConfirm() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            updateUser(this.user).then(() => {
              this.$message.success('更新用户成功')
              this.dialogVisible = false
              this.getList()
            })
          } else {
            register(this.user).then(() => {
              this.$message.success('添加用户成功')
              this.dialogVisible = false
              this.getList()
            })
          }
        } else {
          return false
        }
      })
    },
    handleAllocDialogConfirm() {
      const params = new URLSearchParams()
      params.append('userId', this.userId)
      params.append('roleIds', this.allocRoleIds)
      allocRole(params).then(() => {
        this.$message.success('角色分配成功')
        this.allocDialogVisible = false
      })
    }
  }
}
</script>

<style scoped>

</style>
