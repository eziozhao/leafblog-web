<template>
  <div class="article-container">
    <el-header class="text-center" height="80px">
      <div class="title"> {{ article.title }}</div>
      <div>
        <span class="el-icon-time" style="margin-right: 30px">{{ article.edittime|formatCreateTime }}</span>
        <span class="el-icon-user">{{ username }}</span>
      </div>
    </el-header>
    <el-main>
      <div class="markdown-body" v-html="content" />
    </el-main>
  </div>
</template>

<script>
import { fetchById } from '@/api/article'
import { getUserById } from '@/api/user'
import { formatDate } from '@/utils'
import marked from 'marked'
export default {
  name: 'ArticleDetail',
  filters: {
    formatCreateTime(time) {
      const date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    }
  },
  data() {
    return {
      id: '',
      article: {},
      username: '',
      content: ''
    }
  },
  created() {
    this.id = this.$route.params.id
    fetchById(this.id).then(res => {
      this.article = res.data
      this.content = marked(this.article.mdcontent)
      getUserById({ id: res.data.uid }).then(res => {
        this.username = res.data.username
      })
    })
  },
  mounted() {
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = 'https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css'
    document.head.appendChild(link)
  }

}
</script>

<style scoped>
  .article-container {
    width: 60%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
    overflow: auto;
  }
  .title{
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
  }
</style>
