<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-input v-model="listQuery.keyword" placeholder="输入角色名搜索" clearable />
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
    <el-dialog
      title="分配菜单"
      :visible.sync="menuDialogVisible"
      width="40%"
    >
      <el-card v-loading="menuLoading" shadow="never">
        <el-tree
          ref="tree"
          :data="menuTreeList"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
        />
        <div style="margin-top: 20px" align="center">
          <el-button type="primary" @click="handleMenuSave()">保存</el-button>
          <el-button @click="handleMenuClear()">清空</el-button>
        </div>

      </el-card>
    </el-dialog>
    <el-dialog
      title="分配资源"
      :visible.sync="resourceDialogVisible"
      width="40%"
    >
      <el-card v-loading="resourceLoading" shadow="never">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="checkedResources" @change="handleCheckedResourcesChange">
          <el-checkbox v-for="item in resourceOptions" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
        </el-checkbox-group>
        <div style="margin-top: 20px" align="center">
          <el-button type="primary" @click="handleResourceSave">保存</el-button>
          <el-button @click="handleResourceClear">清空</el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { formatDate } from '@/utils'
import { fetchRoleList, updateRole, addRole, deleteRole, fetchRoleMenu, fetchRoleResource } from '@/api/role'
import { allocMenu, allocResource } from '@/api/admin'
import { fetchMenuTree } from '@/api/menu'
import { fetchList } from '@/api/resource'
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
        pageSize: 5,
        keyword: null
      },
      menuTreeList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      roleId: null,
      role: Object.assign({}, defaultRole),
      dialogVisible: false,
      menuDialogVisible: false,
      resourceDialogVisible: false,
      menuLoading: true,
      resourceLoading: true,
      isEdit: false,
      rules: { name: [{ required: true, message: '请输入角色名', trigger: 'blur' }] },
      checkAll: false,
      checkedResources: [],
      resourceOptions: [],
      resourceIds: [],
      isIndeterminate: false
    }
  },
  created() {
    this.getList()
    this.getTreeList()
    this.getResourceList()
  },
  methods: {
    getList() {
      fetchRoleList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
        this.listLoading = false
      })
    },
    getResourceList() {
      fetchList().then(res => {
        this.resourceOptions = res.data
        res.data.forEach(el => this.resourceIds.push(el.id))
      })
    },
    getRoleResource(id) {
      fetchRoleResource({ roleId: id }).then(res => {
        res.data.forEach(el => this.checkedResources.push(el.id))
        this.resourceLoading = false
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
    handleAllocMenu(id) {
      this.menuDialogVisible = true
      this.menuLoading = true
      this.roleId = id
      this.getRoleMenu(id)
    },
    handleAllocResource(id) {
      this.resourceDialogVisible = true
      this.resourceLoading = true
      this.roleId = id
      this.checkedResources = []
      this.getRoleResource(id)
    },
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
    },
    getTreeList() {
      fetchMenuTree().then(res => {
        this.menuTreeList = res.data
      })
    },
    getRoleMenu(roleId) {
      fetchRoleMenu({ roleId: roleId }).then(res => {
        const menuList = res.data
        const checkedMenuIds = []
        if (menuList != null && menuList.length > 0) {
          menuList.forEach(menu => {
            checkedMenuIds.push(menu.id)
          })
        }
        this.$refs.tree.setCheckedKeys(checkedMenuIds)
        this.menuLoading = false
      })
    },
    handleMenuSave() {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      const checkedMenuIds = new Set()
      if (checkedNodes != null && checkedNodes.length > 0) {
        checkedNodes.forEach(checkedNode => {
          checkedMenuIds.add(checkedNode.id)
          if (checkedNode.parentId !== 0) {
            checkedMenuIds.add(checkedNode.parentId)
          }
        })
      }
      this.$confirm('是否分配菜单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('roleId', this.roleId)
        params.append('menuIds', Array.from(checkedMenuIds))
        allocMenu(params).then(res => {
          this.$message.success('菜单分配成功')
          this.menuDialogVisible = false
        })
      })
    },
    handleMenuClear() {
      this.$refs.tree.setCheckedKeys([])
    },
    handleCheckAllChange(val) {
      this.checkedResources = val ? this.resourceIds : []
      this.isIndeterminate = false
    },
    handleCheckedResourcesChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.resourceOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.resourceOptions.length
    },
    handleResourceSave() {
      this.$confirm('是否分配资源？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('roleId', this.roleId)
        params.append('resourceIds', this.checkedResources)
        allocResource(params).then(() => {
          this.$message.success('资源分配成功')
          this.resourceDialogVisible = false
        })
      })
    },
    handleResourceClear() {}
  }
}
</script>

<style scoped>

</style>
