// pages/search/search.js
import request from "../../utils/request"
let isSend=false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:"",
    hotList:[],
    searchContent:"",
    searchList:[],
    historyList:[]
  },

  // 获取初始化数据
  async getInitData(){
    let placeholderContentData=await request("/search/default")
    this.setData({
      placeholderContent:placeholderContentData.data.showKeyword
    })
  },
  // 获取热搜列表
  async getHotListData(){
    let hotListData=await request("/search/hot/detail")
    this.setData({
      hotList:hotListData.data
    })
  },
  // 模糊搜索匹配
  handleInputChange(event){
    this.setData({
      searchContent:event.detail.value.trim()
    })
    // 函数节流
    if(isSend){
      return
    }
    isSend=true
    this.getSearchList()
    setTimeout(()=>{
      isSend=false
    },300)
  },

  // 封装搜索功能函数
  async getSearchList(){
    let {historyList}=this.data
    if(!this.data.searchContent){
      return
    }
    let searchListData=await request("/search/suggest",{keywords:this.data.searchContent,type:"mobile"})
    let searchList=searchListData.result
    this.setData({
      searchList:searchList.allMatch || []
    })
    // 将搜索的历史记录添加进去
    if(historyList.indexOf(this.data.searchContent)!==-1){
      historyList.splice(historyList.indexOf(this.data.searchContent),1)
    }
    historyList.unshift(this.data.searchContent)
    this.setData({
      historyList
    })

    wx.setStorageSync("searchHistory", historyList);
  },
  // 获取本地历史搜索记录
  getSearchHistory(){
    let historyList=wx.getStorageSync('searchHistory')
    if(historyList){
      this.setData({
        historyList
      })
    }
  },
  // 清空搜索记录
  clearSearchContent(){
    this.setData({
      searchContent:"",
      searchList:[]
    })
  },
  // 清空搜索历史记录
  deleteSearchHistory(){
    wx.showModal({
      title:"确认清空历史记录吗",
      success:(res)=>{
        if(res.confirm){

          // 清空data中的数据
          this.setData({
            historyList:[]
          })
          // 清空本地缓存
          wx.removeStorageSync("searchHistory");
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInitData()
    this.getHotListData()
    this.getSearchHistory()
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