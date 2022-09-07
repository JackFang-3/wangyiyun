// pages/video/video.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],//导航接口数据
    navId:'',//点击的id
    videoList:[],
    videoId:[],
    videoUpdateTime:[],
    isTriggered:false,
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupListData()
  },

  // 跳转
  toSearch(){
    wx.navigateTo({url: "/pages/search/search"})
  },

  // 获取导航接口数据
   async getVideoGroupListData(){
    let videoGroupListData=await request("/video/group/list")
    this.setData({
      videoGroupList:videoGroupListData.data.slice(0,14),
      navId:videoGroupListData.data[0].id
    })

    this.getVideoList(this.data.navId)
  },
  // 获取视频接口数据
  async getVideoList(navId){
    let index=0
    let videoListData=await request("/video/group",{id:navId})
    // 关闭消息提示框
    wx.hideLoading()
    let videoList=videoListData.datas.map(item=>{
      item.id=index++
      return item
    })
    this.setData({
      videoList,
      // 关闭下拉刷新
      isTriggered:false
    })
  },
  // 点击切换导航的回调
  changeNav(event){
    let navId=event.currentTarget.id//通过id向event传参会自动将number转化为string
    this.setData({
      navId:navId*1,
      // 右移零位会将非number强制转换成number数据类型 navId>>>0
      videoList:[]
    })

    // 显示消息提示框
    wx.showLoading({
      title:"正在加载"
    })

    // 获取视频接口数据
    this.getVideoList(navId)
  },
  // 点击播放、继续播放视频的回调
  handlePlay(event){
    /*
     1.在点击播放视频的时候要找到上一个播放的视频
     2.在播放新的视频之前要关闭上一个播放的视频
     关键如何找上一个视频实例对象
         如何确认点击播放的视频和正在播放的视频不是同一个视频
    */
  //  创建控制video的实例对象
  let vid=event.currentTarget.id
  // 关闭上一个视频
  // this.vid!==vid && this.videoContext && this.videoContext.stop()
  // this.vid=vid
  this.setData({
    videoId:vid
  })
  this.videoContext=wx.createVideoContext(vid)
  // 判断当前视频之前是否播放过，是否有播放记录，有的话跳转指定位置
  let {videoUpdateTime}=this.data
  let videoItem=videoUpdateTime.find(item=>item.vid===vid)
  if(videoItem){
    wx.videoContext.seek(videoItem.currentTime)
  }
  this.videoContext.play()
  // videoContext.stop()
  },
  // 监听视频播放进度的回调
  handleTimeUpdate(event){
    let videoTimeObj={currentTime:event.detail.currentTime,vid:event.currentTarget.id}
    let {videoUpdateTime}=this.data
    /*
    思路：判断记录播放时长的videoUpdateTime数组中是否由当前视频的播放记录
    如果有，在原有播放记录继续播放
    如果没有，需要添加一条播放记录
    */
   let videoItem=videoUpdateTime.find(item=>item.vid===videoTimeObj.vid)
   if(videoItem){
    videoItem.currentTime=event.detail.currentTime
   }else{
     videoUpdateTime.push(videoTimeObj)
   }
    this.setData({
      videoUpdateTime
    })
  },
  // 视频播放结束时调用的回调
  handleEnded(event){
    // 移除当前播放视频记录
    let {videoUpdateTime}=this.data
    videoUpdateTime.splice(videoUpdateTime.findIndex(item=>item.vid===event.currentTarget.id),1)
    this.setData({
      videoUpdateTime
    })
  },
  // 自定义下拉刷新的回调
  handleFresherrefresh(){
    this.getVideoList(this.data.navId)
  },
  // 自定义上拉触底的回调
  async handleScrollTolower(){
    console.log("上拉触底")
    // 数据分页： 前端分页 后端分页
    console.log("发送请求||在前端截取最新的数据，追加到视频列表的后方")
    console.log("网易云音乐暂时没有提供分页的api")
    let {index,videoList}=this.data
    index++
    this.setData({
      index
    })
    let videoListData=await request("/video/group",{id:this.data.navId,offset:this.data.index})
    videoList.push(...videoListData.datas)
    this.setData({
      videoList
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
    console.log("页面下拉刷新")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log("页面上拉触底")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage({from}) {
    if(from==="button"){
      return {
        title:"来自button的转发",
        path:"/pages/video/video",
        imageUrl:"/static/images/nvsheng.jpg"
      }
    }
    else{
      return {
        title:"来自menu的转发",
        path:"/pages/video/video",
        imageUrl:"/static/images/nvsheng.jpg"
      }
    }
  }
})