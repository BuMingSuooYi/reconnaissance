// pages/index/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caseSurveys:[],

  },

  toHome(e:any){
    let n=e.currentTarget.dataset.n;
    let caseSurveys=this.data.caseSurveys;//需要传递的数据
    wx.navigateTo({
      url: '../home/home',
      events: {
        //用于被打开的页面通过事件向本页面传递数据
        acceptDataFromOpenedPage: function (data: any) {
          console.log(data)
        },
        someEvent: function (data: any) {
          console.log(data)
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('OpencaseSurvey',caseSurveys[n]);
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
     //数据请求
     const caseSurvey = require('../../api/case-survey');
     caseSurvey.getAll().then((res: any) => {
       if (res.statusCode == 200) {
         // 请求成功的处理
         this.setData({
          caseSurveys:res.data
         })        
       } else {
         // 请求失败的处理
       }
     }).catch((res: any) => { })

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