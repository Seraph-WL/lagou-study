// 声明站点名称
export default (name) => {
  console.log('来自 App1 的共用模块')

  const ele = document.createElement('h3')
  ele.textContent = name

  return ele
}