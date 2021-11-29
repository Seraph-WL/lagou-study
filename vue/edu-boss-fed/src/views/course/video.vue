<template>
  <div class="course-video">
    <el-card>
      <div slot="header">
        课程相关信息
      </div>
      <el-form>
        <el-form-item label="视频上传">
          <input type="file" ref="video-file">
        </el-form-item>
        <el-form-item label="封面上传">
          <input type="file" ref="image-file">
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleUpload"
          >开始上传</el-button>
          <el-button
            @click="$router.push({
              name: 'course-section',
              params: {
                courseId
              }
            })"
          >返回</el-button>
        </el-form-item>
        <el-form-item>
          <p v-if="uploadPercent !== 0">视频上传中: {{ uploadPercent }}%</p>
          <p v-if="isUploadSuccess">视频转码中：{{ isTranscodeSuccess ? '完成': '正在转码中...' }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import {
  aliyunImageUploadAddressAndAuth,
  aliyunVideoUploadAddressAndAuth,
  aliyunVideoTranscode,
  getAliyunTranscodePercent
} from '@/services/aliyun-upload'

export default {
  name: 'CourseVideo',
  props: {
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      // 图片上传后的地址，用于视频上传凭证请求
      imageURL: '',
      // 保存上传实例
      uploader: null,
      // 保存上传视频的 ID
      videoId: null,
      // 上传百分比
      uploadPercent: 0,
      // 上传完毕状态
      isUploadSuccess: false,
      // 转码完毕状态
      isTranscodeSuccess: false
    }
  },
  created () {
    // 初始化上传工具
    this.initUploader()
  },
  methods: {
    handleUpload () {
      // 考虑到可能重复使用某个组件进行上传处理，点击上传时，将数据重置
      this.uploadPercent = 0
      this.isUploadSuccess = false
      this.isTranscodeSuccess = false
      // 获取文件信息
      const videoFile = this.$refs['video-file'].files[0]
      const imageFile = this.$refs['image-file'].files[0]
      const uploader = this.uploader
      // 将要上传的文件添加到上传列表中
      uploader.addFile(imageFile)
      uploader.addFile(videoFile)
      // 开始上传 不是真正的上传，还需要凭证和地址的设置
      uploader.startUpload()
    },
    initUploader () {
      // this.uploader 这样别的作用域可以引用
      // 加上 window. 避免报错
      this.uploader = new window.AliyunUpload.Vod({
        // 阿里账号ID，必须有值
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        // 使用箭头函数，保证里面的 this 和上面的 this 同级
        onUploadstarted: async uploadInfo => {
          let uploadAddressAndAuth = null
          // 检测是图片或视频
          if (uploadInfo.isImage) {
            // 图片处理
            const { data } = await aliyunImageUploadAddressAndAuth()
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              this.imageURL = uploadAddressAndAuth.imageURL
            }
          } else {
            // 视频处理
            const { data } = await aliyunVideoUploadAddressAndAuth({
              fileName: uploadInfo.file.name,
              imageUrl: this.imageURL
            })
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
              // 下面上传结束需要用到
              this.videoId = data.data.videoId
            }
          }
          // 设置凭证与地址
          this.uploader.setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )
          // 此步设置完毕，上传进度开始执行
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          if (!uploadInfo.isImage) {
            this.uploadPercent = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          this.isUploadSuccess = true
          const lessonId = this.$route.query.lessonId
          // 发送视频转码请求
          const { data } = await aliyunVideoTranscode({
            lessonId,
            coverImageUrl: this.imageURL,
            fileId: this.videoId,
            fileName: this.$refs['video-file'].files[0].name
          })
          if (data.code === '000000') {
            // 轮询转码进度
            const timer = setInterval(async () => {
              const { data } = await getAliyunTranscodePercent(lessonId)
              if (data.code === '000000') {
                if (data.data === 100) {
                  this.isTranscodeSuccess = true
                  this.$message.success('视频转码成功')
                  clearInterval(timer)
                }
              }
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
