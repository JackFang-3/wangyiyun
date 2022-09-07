import PubSub from "pubsub-js"
import request from "../../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[],
    index:0
  },

  // 获取每日推荐歌曲数据
  async getRecommendData(){
    let recommendData=await request("/recommend/songs")
    this.setData({
      recommendList:recommendData.data.dailySongs
    })
  },
  // 跳转至详情页面
  toSongDetail(event){
    let {song,index}=event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      // 路由传参--query参数
      url: '/songPackage/pages/songDetail/songDetail?songId='+JSON.stringify(song.id)
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()+1
    })
    this.getRecommendData()
    // 订阅来自songDetail发布的消息
    PubSub.subscribe("switchType",(msg,type)=>{
      let {recommendList,index}=this.data
      if(type==="pre"){
        (index===0) && (index=recommendList.length)
        index-=1
      }
      else{
        (index===recommendList.length-1) && (index=-1)
        index+=1
      }
      this.setData({
        index
      })
      let musicId=recommendList[index].id
      // 发布musicId
      PubSub.publish("musicId",musicId)
    })
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