<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-bottom: 10px">
      <el-col :span="6">
        <el-input v-model="newCate" placeholder="输入新的分类名" />
      </el-col>
      <el-col :span="6">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">添加分类</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column
        prop="catename"
        label="名称"
        align="center"
      />
      <el-table-column
        prop="date"
        label="添加日期"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.date | formatCreateTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row.id)">
            编辑
          </el-button>
          <el-button style="margin-left: 10px" type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="修改分类名称" :visible.sync="dialogFormVisible" width="20%">
      <el-form ref="cateForm" :model="form" :rules="rule">
        <el-form-item label="分类名称" prop="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" style="width: 200px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { fetchList, update, deleteCate, add } from '@/api/category'
import { formatDate } from '@/utils'

export default {
  name: 'Category',
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
      dialogFormVisible: false,
      form: {
        name: ''
      },
      rule: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      formLabelWidth: '120px',
      updateId: '',
      newCate: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      fetchList().then(res => {
        this.list = res.data
        this.listLoading = false
      })
    },
    handleEdit(id) {
      this.updateId = id
      this.dialogFormVisible = true
    },
    handleDelete(id) {
      const ids = [id]
      const param = new URLSearchParams()
      param.append('ids', ids)
      deleteCate(param).then(() => {
        this.$message.success('删除成功')
      })
    },
    handleUpdate() {
      this.$refs['cateForm'].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
          update({ id: this.updateId, name: this.form.name }).then(() => {
            this.$message.success('分类更新成功')
          })
        } else {
          return false
        }
      })
    },
    handleAdd() {
      add({ name: this.newCate }).then(() => {
        this.$message.success('分类添加成功')
      })
    }
  }
}
</script>

<style scoped>

</style>
