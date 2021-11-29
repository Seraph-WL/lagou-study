<template>
  <div class="course-create-or-edit">
    <el-card>
      <div slot="header">
        <!-- 步骤条 -->
        <el-steps :active="activeStep" simple>
          <!-- @click 加上 native 从自定义事件变成原生事件 绑定到 el-step 触发有效果 -->
          <el-step
            v-for="(item,i) in steps"
            :key="item.id"
            :title="item.title"
            :icon="item.icon"
            @click.native="activeStep = i"
          ></el-step>
        </el-steps>
      </div>
      <!-- 步骤对应的表单结构 -->
      <el-form label-width="80px">
        <!-- 基本信息 -->
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称">
            <el-input
              v-model="course.courseName"
            ></el-input>
          </el-form-item>
          <el-form-item label="课程简介">
            <el-input
              v-model="course.brief"
            ></el-input>
          </el-form-item>
          <el-form-item label="课程概述">
            <el-input
              v-model="course.previewFirstField"
              placeholder="概述1"
              style="width: 49%;min-width: 300px; margin-right: 15px;"
            >
              <template slot="append">{{ course.previewFirstField.length }}/20</template>
            </el-input>
            <el-input
              v-model="course.previewSecondField"
              placeholder="概述2"
              style="width: 49%;min-width: 300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input
              v-model="course.teacherDTO.teacherName"
            ></el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input
              v-model="course.teacherDTO.description"
            ></el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number
              v-model="course.sortNum"
              label="描述文字"
              controls-position="right"
            ></el-input-number>
          </el-form-item>
        </div>
        <!-- 课程封面 -->
        <div v-show="activeStep === 1">
          <!-- 封装为图片上传组件 -->
          <!-- courseListImg 为预览图片的显示位置 v-model有传入操作还有接收操作 -->
          <course-image
            v-model="course.courseListImg"
            label="课程封面"
            :limit="3"
          ></course-image>
          <course-image
            v-model="course.courseImgUrl"
            label="解锁封面"
          ></course-image>
        </div>
        <!-- 销售信息 -->
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格">
            <el-input
              v-model="course.discounts"
              type="number"
              :min="0"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input
              v-model="course.price"
              type="number"
              :min="0"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input
              v-model="course.sales"
              type="number"
              :min="0"
            >
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input
              v-model="course.discountsTag"
            ></el-input>
          </el-form-item>
        </div>
        <!-- 秒杀信息 -->
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关" label-width="120px">
            <el-switch
              v-model="course.activityCourse"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="course.activityCourseDTO.endTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input
                v-model="course.activityCourseDTO.amount"
                type="number"
                :min="0"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="库存">
              <el-input
                v-model="course.activityCourseDTO.stock"
                type="number"
                :min="0"
              >
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <!-- 课程详情 -->
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
              v-model="course.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleSave"
            >保存</el-button>
          </el-form-item>
        </div>
        <!-- 下一步按钮 -->
        <el-form-item v-if="activeStep !== steps.length - 1">
          <el-button
            @click="activeStep++"
          >下一步</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import CourseImage from './CourseImage'
import { saveOrUpdateCourse, getCourseById } from '@/services/course'
import TextEditor from '@/components/TextEditor'

export default {
  name: 'CourseCreateOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  components: {
    CourseImage,
    TextEditor
  },
  created () {
    // 检测当前是否为编辑功能，如果是，根据 courseId 请求课程数据
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  data () {
    return {
      // 步骤的进度
      activeStep: 0,
      // 步骤条的相关信息
      steps: [
        { id: 1, title: '基本信息', icon: 'el-icon-edit' },
        { id: 2, title: '课程封面', icon: 'el-icon-upload' },
        { id: 3, title: '销售信息', icon: 'el-icon-picture' },
        { id: 4, title: '秒杀信息', icon: 'el-icon-picture' },
        { id: 5, title: '课程详情', icon: 'el-icon-picture' }
      ],
      // 本地预览图片地址
      imageUrl: '',
      // 添加课程的相关信息
      //   - 将数据中与 ID 相关的数据去除，因为是编辑功能使用的
      course: {
        // id: 0,
        // 课程名称
        courseName: '',
        // 课程介绍
        brief: '',
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          // 讲师名称
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          // 讲师介绍
          description: ''
        },
        // 课程详情内容 要写上标签形式，纯文本内容会出现展示的问题
        courseDescriptionMarkDown: '<h3>默认值</h3>',
        // 商品原价
        price: 0,
        // 售卖价格
        discounts: 0,
        priceTag: '',
        // 活动标签
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        // 课程封面地址
        courseListImg: '',
        // 解锁封面地址
        courseImgUrl: '',
        // 课程排序
        sortNum: 0,
        // 概述1
        previewFirstField: '',
        // 概述2
        previewSecondField: '',
        // 上架状态，默认值 0 代表不上架，1 代表上架
        status: 0,
        // 销量
        sales: 0,
        // 参与秒杀活动的课程
        activityCourse: false,
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          // 秒杀活动开始时间
          beginTime: '',
          // 结束时间
          endTime: '',
          // 秒杀活动价格
          amount: 0,
          // 秒杀库存
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  methods: {
    // 编辑功能根据 ID 加载课程信息
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        // 避免编辑状态中秒杀按钮无法开启，因为其属性为 null 设置初始值就好了
        // - 判断当前课程是否为开启秒杀的状态，如果未开启秒杀，需要初始化数据
        if (!data.data.activityCourse) {
          data.data.activityCourseDTO = {
            // 秒杀活动开始时间
            beginTime: '',
            // 结束时间
            endTime: '',
            // 秒杀活动价格
            amount: 0,
            // 秒杀库存
            stock: 0
          }
        }
        this.course = data.data
      }
    },
    // 保存功能
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      if (data.code === '000000') {
        this.$message.success(`${this.isEdit ? '编辑' : '添加'}课程成功`)
        this.$router.push({
          name: 'course'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
</style>
