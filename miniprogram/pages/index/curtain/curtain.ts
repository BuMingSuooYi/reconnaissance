// pages/index/curtain/curtain.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trackExist: false,
    fromCurtain: {
      name: "",
      case: [
        {
          name: "直轨",
          type: 1,
          crook: 1,
          electricalMachinery: 1,
          long: 3.25,
        }
      ]
    }
  },
  //字典翻译
  esc(track: any) {
    let crook = "";
    let electricalMachinery = "";
    let long = "";
    switch (track.crook) {
      case 1:
        crook = "左端弯处";
        break;
      case 1:
        crook = "右端弯处";
        break;
      case 1:
        crook = "未定弯处";
        break;
    };
    switch (track.electricalMachinery) {
      case 1:
        crook = "左端电机";
        break;
      case 1:
        crook = "右端电机";
        break;
      case 1:
        crook = "未定电机";
        break;
    }
    long = track.long + " m";
    let str =crook+" "+electricalMachinery+" "+long;
    console.log(str);
    
    return str;
  },


  //显示抽屉
  showModal() {
    let trackExist = true;

    this.setData({
      trackExist: trackExist,
    })
  },
  //隐藏抽屉
  hideModal() {
    let trackExist = false;

    this.setData({
      trackExist: trackExist,
    })
  },
  //保存导轨
  saveTrack() {
    this.hideModal()
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let room;
    const eventChannel = this.getOpenerEventChannel()
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    if (eventChannel) {
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        room = data;
      })
    }
    this.setData({
      room: room,
    })
    console.log(this.data.room);

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