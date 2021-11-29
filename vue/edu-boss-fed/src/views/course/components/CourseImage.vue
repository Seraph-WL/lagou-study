<template>
  <div class="course-image">
    <el-form-item :label="label">
      <!-- progress 组件 -->
      <el-progress
        v-if="isUploading"
        type="circle"
        :percentage="precentage"
        :width="178"
        :status="precentage === 100 ? 'success' : undefined"
      ></el-progress>
      <!-- upload 组件 -->
      <el-upload
        v-else
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :http-request="handleUpload"
      >
        <!-- img 为预览图片的显示位置 -->
        <img v-if="value" :src="value" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import { uploadCourseImage } from '@/services/course'

export default {
  name: 'CourseImage',
  props: {
    // 父组件 v-model 上传过来的课程封面地址和解锁封面地址
    value: {
      type: String
    },
    label: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      // 用于保存上传状态
      isUploading: false,
      // 用于保存上传进度百分比
      precentage: 0
    }
  },
  methods: {
    // 图片上传处理函数
    // - option 为上传的相关信息
    //   - option.file 为要上传的文件信息
    async handleUpload (option) {
      this.isUploading = true
      // 使用 FormData 对象处理
      const fd = new FormData()
      // 数据推入到 FormData 对象中
      fd.append('file', option.file)
      // 发送上传请求
      const { data } = await uploadCourseImage(fd, event => {
        this.precentage = Math.floor(event.loaded / event.total * 100)
      })
      if (data.code === '000000') {
        // data.data.name 服务端响应的，图片上传成功后的线上地址
        // 赋值给 value 传给父组件的 v-model
        this.$emit('input', data.data.name)
        this.isUploading = false
        // 上传成功后，设置进度信息归零，避免下次上传出现回退效果
        this.precentage = 0
      }
    },
    // 上传图片成功回调
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传前的回调
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < this.limit

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
// 深度作用选择器
// 如果你希望 scoped 样式中的一个选择器能够作用得“更深”，例如影响子组件，你可以使用 >>> 操作符
// 有些像 Sass 之类的预处理器无法正确解析 >>>。
// 这种情况下你可以使用 /deep/ 或 ::v-deep 操作符取而代之——两者都是 >>> 的别名，同样可以正常工作
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
