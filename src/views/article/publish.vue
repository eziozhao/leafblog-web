<template>
  <div class="components-container">
    <div class="editor-container">
      <markdown-editor v-model="content" height="600px" />
    </div>
  </div>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'
export default {
  name: 'Publish',
  components: { MarkdownEditor },
  data() {
    return {
      content: '开始编辑'
    }
  }
}
</script>

<style scoped>
  .editor-container{
    margin-bottom: 30px;
  }
</style>
