// 发起ajax请求
/*
  1.封装功能函数
   1.功能点明确
   2.函数内部应该保留固定代码
   3.将动态的数据抽取成形参，由使用者根据自身情况动态传入实参
   4.一个良好的功能函数应该设置形参的默认值（es6）
 2.封装功能组件
   1.功能点明确
   2.组件内部保留静态代码
   3.将动态数据抽取成props参数，由使用者根据自身情况以标签属性的形式动态传入props参数
   4.一个良好的组件应该设置组件的必要性以及数据类型
     props:{
         msg:{
             required:true,
             defalut:默认值,
             type:String
         }
     }
*/
import config from './config'
export default (url,data={},method='GET')=>{
    return new Promise((resolve,reject)=>{
        wx.request({
            url:config.mobileHost+url,
            data,
            method,
            success:(res)=>{
              resolve(res.data)
            },
            fail:(err)=>{
              reject(err)
            }
          })

    })

}