<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-row v-if="!articleId">
          <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
            发表
          </el-button>
          <el-button v-loading="loading" type="warning" @click="draftForm">
            保存到草稿
          </el-button>
        </el-row>
        <el-button v-else v-loading="loading" type="success" @click="updateForm">更新</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                Title
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="分类:" class="postInfo-container-item">
                    <el-select
                      v-model="postForm.category"
                      placeholder="请输入关键词"
                    >
                      <el-option v-for="(item,index) in categoryList" :key="index" :label="item.catename" :value="item.id" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="标签:" class="postInfo-container-item">
                    <el-tag
                      v-for="tag in postForm.dynamicTags"
                      :key="tag"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(tag)"
                    >
                      {{ tag }}
                    </el-tag>
                    <el-input
                      v-if="inputVisible"
                      ref="saveTagInput"
                      v-model="inputValue"
                      class="input-new-tag"
                      size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    />
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <markdown-editor v-model="postForm.content" height="600px" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '@/components/Sticky'
import MarkdownEditor from '@/components/MarkdownEditor'
import MDinput from '@/components/MDinput'
import { add, fetchById, update } from '@/api/article'
import { fetchList } from '@/api/category'

export default {
  name: 'Publish',
  components: { MarkdownEditor, Sticky, MDinput },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      categoryList: [],
      articleId: null,
      postForm: {
        content: '',
        category: '',
        title: '',
        status: 'draft',
        dynamicTags: []
      },
      rules: {
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        category: [{ validator: validateRequire }]
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  watch() {

  },
  created() {
    this.articleId = this.$route.params.id
    this.fetchCateList()
    if (this.articleId !== undefined) {
      fetchById(this.articleId).then(res => {
        this.postForm.category = res.data.cid
        this.postForm.title = res.data.title
        this.postForm.content = res.data.mdcontent
      })
    }
  },
  methods: {
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const article = {
            title: this.postForm.title,
            state: 1,
            mdcontent: this.postForm.content
          }
          const tags = this.postForm.dynamicTags
          const categoryId = this.postForm.category
          const params = {
            article: article,
            tags: tags,
            categoryId: categoryId
          }
          add(params).then(() => {
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          return false
        }
      })
    },
    draftForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const article = {
            title: this.postForm.title,
            state: 0,
            mdcontent: this.postForm.content
          }
          const tags = this.postForm.dynamicTags
          const categoryId = this.postForm.category
          const params = {
            article: article,
            tags: tags,
            categoryId: categoryId
          }
          add(params).then(() => {
            this.$notify({
              title: '成功',
              message: '保存草稿成功',
              type: 'success',
              duration: 2000
            })
          })
          this.postForm.status = 'draft'
          this.loading = false
        } else {
          return false
        }
      })
    },
    updateForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          const article = {
            title: this.postForm.title,
            state: 0,
            mdcontent: this.postForm.content
          }
          const tags = this.postForm.dynamicTags
          const categoryId = this.postForm.category
          const params = {
            article: article,
            tags: tags,
            categoryId: categoryId
          }
          update(params).then(() => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
          this.postForm.status = 'draft'
          this.loading = false
        } else {
          return false
        }
      })
    },
    fetchCateList() {
      fetchList().then(res => {
        this.categoryList = res.data
      })
    },
    handleClose(tag) {
      this.postForm.dynamicTags.splice(this.postForm.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.postForm.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }
    }
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

</style>
