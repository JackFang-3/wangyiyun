// pages/login/login.js
import request from '../../utils/request'
/*
  登录流程：
    1.收集表单数据
    2.前端验证
     1） 验证用户信息（账号密码）是否合法
     2） 前端验证不通过提示用户，不需要发请求
     3） 前端验证通过，发请求（携带账号密码）给服务器
    3.后端验证
     1） 验证用户是否存在
     2） 用户不存在直接返回，告诉前端用户不存在
     3） 用户存在需要验证密码是否正确
     4） 密码不正确返回前端密码不正确
     5)  密码正确返回前端数据，提示用户登录成功（会携带用户相关信息）
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 获取用户数据
  handleInput(event){
    // let type=event.currentTarget.id   id传值
    let type=event.currentTarget.dataset.type
    this.setData({
      [type]:event.detail.value
    })
  },
  // 登录
  async login(){
    // 1.收集表单数据
    let {phone,password}=this.data
    // 2.前端验证
    /*
      手机号验证：1.内容为空
                 2.手机格式不正确
                 3.手机格式正确，验证通过
    */
   if(!phone){
    //  提示用户
     wx.showToast({
       title:'手机号不能为空',
       icon:'none'
     })
     return
   }

   let phoneReg=/^1(3|4|5|6|7|8|9)\d{9}$/
   if(!phoneReg.test(phone)){
    wx.showToast({
      title:'手机号格式错误',
      icon:'none'
    })
    return
   }

   if(!password){
    wx.showToast({
      title:'密码不能为空',
      icon:'none'
    })
    return
   }

  //  后端验证
  let result=await request('/login/cellphone',{phone,password})
  if(result.code===200){ //登陆成功
    wx.showToast({
      title:'登陆成功'
    })
    // 将用户信息存储到本地
    wx.setStorageSync('userInfo',JSON.stringify(result.profile))
    // 跳转到个人中心
    wx.reLaunch({
      url:'/pages/personal/personal'
    })

  }else if(result.code===400){
    wx.showToast({
      title:'手机号错误',
      icon:'none'
    })
  }else if(result.code===502){
    wx.showToast({
      title:'密码错误',
      icon:'none'
    })
  }else{
    wx.showToast({
      title:'登陆失败，请重新登录',
      icon:'none'
    })
    console.log(result.code)
  }
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})