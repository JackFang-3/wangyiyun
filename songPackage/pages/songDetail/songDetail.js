import Pubsub from "pubsub-js"
import moment from "moment"
import request from "../../../utils/request"
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    songDetail:{},
    musicLink:"",
    currentTime:"00:00",
    durationTime:"00:00",
    currentWidth:0
  },

  // 点击播放或者暂停的回调函数
  handleMusicPlay(){
    let isPlay=!this.data.isPlay
    // 修改状态
    // this.setData({
    //   isPlay
    // })
    this.musicControl(isPlay,this.data.songDetail.id,this.data.musicLink)
  },

  // 控制音乐播放暂停函数
  async musicControl(isPlay,musicId,musicLink){
    if(isPlay){
      // 获取音乐播放链接
      if(!musicLink){
        let musicLinkData=await request("/song/url",{id:musicId})
        musicLink=musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src=musicLink
      this.backgroundAudioManager.title=this.data.songDetail.name
    }else{
      this.backgroundAudioManager.pause()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options 用于接受路由传参的query参数
    this.getSongDetail(options.songId)
    // 判断是否是当前音乐在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId===options.songId){
      this.setData({
        isPlay:true
      })
    }
    
    // 问题：用户在操作系统播放或者暂停的时候页面不更新
    // 创建音频播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    // 监听音乐播放暂停停止
    this.backgroundAudioManager.onPlay(()=>{
      // this.setData({
      //   isPlay:true
      // })
      // // 修改全局音乐播放的状态
      // appInstance.globalData.isMusicPlay=true
      this.getBackgroundAudioManagerDetail(true)
      appInstance.globalData.musicId=options.songId
    })

    this.backgroundAudioManager.onPause(()=>{
      // this.setData({
      //   isPlay:false
      // })
      // appInstance.globalData.isMusicPlay=false
      this.getBackgroundAudioManagerDetail(false)
    })

    this.backgroundAudioManager.onStop(()=>{
      // this.setData({
      //   isPlay:false
      // })
      // appInstance.globalData.isMusicPlay=false
      this.getBackgroundAudioManagerDetail(false)
    })

    // 监听背景音乐实时播放进度
    this.backgroundAudioManager.onTimeUpdate(()=>{
      // console.log("总时长",this.backgroundAudioManager.duration)
      // console.log("实时时长",this.backgroundAudioManager.currentTime)
      // 格式化实时时间
      let currentTime=moment(this.backgroundAudioManager.currentTime*1000).format("mm:ss")
      let currentWidth=(this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration) * 100
      this.setData({
        currentTime,
        currentWidth
      })
    })

    // 监听音乐结束
    this.backgroundAudioManager.onEnded(()=>{
      // 切换下一首音乐，并且自动播放
      Pubsub.publish("switchType","next")
      // 进度条变为0
      this.setData({
        currentWidth:0,
        currentTime:"00:00"
      })
    })

  },

  // 提取监听函数
  getBackgroundAudioManagerDetail(isPlay){
    this.setData({
      isPlay
    })
    // 修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay=isPlay
  },
 
  // 获取歌曲详情接口
  async getSongDetail(ids){
    let songDetail=await request("/song/detail",{ids})
    let durationTime=moment(songDetail.songs[0].dt).format("mm:ss")
    this.setData({
      songDetail:songDetail.songs[0],
      durationTime
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title:songDetail.songs[0].name
    })
  },

  // 点击切换上一首下一首
  handleSwitch(event){
    let type=event.currentTarget.id
    // 关闭当前播放音乐
    this.backgroundAudioManager.stop()
    // 订阅musicId
    Pubsub.subscribe("musicId",(msg,musicId)=>{
      console.log(musicId)
      // 获取音乐详情信息
      this.getSongDetail(musicId)
      // 音乐自动播放
      this.musicControl(true,musicId)

      // 取消订阅
      Pubsub.unsubscribe("musicId")
    })
  //  发布消息
  Pubsub.publish("switchType",type)
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