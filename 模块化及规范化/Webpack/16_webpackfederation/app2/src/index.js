// 调用 app1 中的模块
import('appone/Sitename').then(res => {
  // res.default()
  const title = res.default('应用 B')
  document.body.append(title)
})