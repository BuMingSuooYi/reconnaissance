// pages/index/scence/scence.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceList : [],//控制元件列表，来自上一个页面
    deviceExist: false,//设置状态抽屉
    scenceList: [//情景列表，来自上一个页面和当前页面添加
      {
        name: '睡眠情景',
        devices: [
          {
            name: "xx开关",
            state: 1,
          }
        ]
      },
    ],
    scenceI: {//正在编写的情景
      scenceName:"",
      selectedDevice: [

      ]
    },
    indexList: [//选中的控制原件

    ],

  },
  //复选
  selectDevice(e: any) {
    let indexList=e.detail.value;
    indexList=indexList.sort((a, b) => a - b);
    this.setData({
      indexList: indexList
      // indexList: e.detail.value
    })
    console.log(this.data.indexList);
    // console.log(1,this.data.indexList.includes(1));
    // console.log('1',this.data.indexList.includes('1'));
  },
  //显示抽屉按钮
  showModal() {
    let scenceI = this.data.scenceI;
    // let selectedDevice=[];
    let deviceList_j = 0;
    let i = 0
    for (i = 0; i < this.data.indexList.length; i++) {
      if (scenceI.selectedDevice.length == deviceList_j
        || this.data.indexList[i] < scenceI.selectedDevice[deviceList_j].id) {
        let device = {
          id: this.data.indexList[i],
          name: this.data.deviceList[this.data.indexList[i]],
          state: false
        }
        scenceI.selectedDevice.splice(deviceList_j, 0, device);
        deviceList_j++;
        console.log("增加了：",this.data.indexList[i]);
      } else if (this.data.indexList[i] == scenceI.selectedDevice[deviceList_j].id) {
        console.log("跳过了：",scenceI.selectedDevice[deviceList_j].id);
        deviceList_j++;
      } else {
        // 删除元素
        console.log("删除了：",scenceI.selectedDevice[deviceList_j].id);
        scenceI.selectedDevice.splice(deviceList_j, 1)
        i--;
      }

      // let device = {
      //   name: this.data.deviceList[this.data.indexList[i]],
      //   state: false
      // }
      // selectedDevice.push(device);
    };
      // scenceI.selectedDevice=selectedDevice;
      scenceI.selectedDevice.splice(i)
    this.setData({
      scenceI: scenceI,
      deviceExist: true,
    })
  },
  //隐藏抽屉
  hideModal() {
    this.setData({
      deviceExist: false,
    })
  },
  //情景名称输入框
  scenceInput(e:any){
    let scenceI=this.data.scenceI;
    scenceI.scenceName=e.detail.value;
    this.setData({
      scenceI:scenceI,
    })
  },
  //保存情景
  comfirmScence(){
    let scenceI=this.data.scenceI
    let scence={
        name: scenceI.scenceName,
        devices: scenceI.selectedDevice,
    };
    let scenceList=this.data.scenceList;
    scenceList.push(scence);
    let indexList=[];
    scenceI.name="";
    this.setData({
      scenceList:scenceList,
      indexList:indexList,
      scenceI:scenceI,
    })
    this.hideModal();
  },
  //选择开关状态
  switchOnOff(e: any) {
    let index = e.currentTarget.dataset.index;
    let scenceI = this.data.scenceI;
    scenceI.selectedDevice[index].state = e.detail.value;
    this.setData({
      scenceI: scenceI,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let deviceList: never[] = [];
    const eventChannel = this.getOpenerEventChannel()
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    if(eventChannel){
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        deviceList = data;
      })
    }
    this.setData({
      deviceList: deviceList,
    })

    // eventChannel.emit('acceptDataFromOpenedPage', { data: '发过去的数据1' });
    // eventChannel.emit('someEvent', { data: '发过去的数据2' });
    // eventChannel.emit('a', { data: '发过去的数据3' });
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
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', { data: this.data.scenceList });
    // eventChannel.emit('someEvent', { data: '发过去的数据2' });
    // eventChannel.emit('a', { data: '发过去的数据3' });
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