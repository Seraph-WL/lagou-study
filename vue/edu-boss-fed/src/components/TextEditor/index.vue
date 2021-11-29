<template>
  <div class="text-editor" ref="editor"></div>
</template>

<script>
import { uploadCourseImage } from '@/services/course'
import E from 'wangeditor'

export default {
  name: 'TextEditor',
  props: {
    // 接收父组件的数据
    value: {
      type: String,
      default: ''
    }
  },
  mounted () {
    // 富文本编辑器初始化
    this.initEditor()
  },
  data () {
    return {
      // 进行声明
      editor: null,
      // 用于标记编辑的数据是否加载完毕
      isLoaded: false
    }
  },
  methods: {
    initEditor () {
      const editor = new E(this.$refs.editor)
      // 创建富文本编辑器之前，进行事件设置
      editor.config.onchange = value => {
        // 数据传出给父组件
        this.$emit('input', value)
      }
      // 配置自定义的图片上传功能
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        // 通过 FormData 格式上传
        const fd = new FormData()
        // 添加图片信息
        fd.append('file', resultFiles[0])
        // 得到图片线上地址
        const { data } = await uploadCourseImage(fd)
        if (data.code === '000000') {
          // 通过 inserImgFn 传回给富文本编辑器进行显示
          insertImgFn(data.data.name)
        }
      }
      // 创建富文本编辑器
      editor.create()
      // 设置内容
      editor.txt.html(this.value)
      // 把 editor 保存给 this ，这样才能在不同区域操作
      this.editor = editor
    }
  },
  // 通过 watch 来侦听 value 变化，并进⾏初始内容更新
  // 避免显示默认文本，而不是显示编辑的原有内容
  watch: {
    value () {
      if (this.isLoaded === false) {
        // 得到了加载的新数据，设置给富文本编辑器更新初始内容
        this.editor.txt.html(this.value)
        this.isLoaded = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
