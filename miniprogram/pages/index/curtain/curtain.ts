// pages/index/curtain/curtain.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //传来的房间
    room: [],
    //表单待填
    formCurtain: {
      name: "",
      type: 0,//默认直导轨
      electromotor: [0],
      mainLineSize: "",
      leftLineSize: "",
      rightLineSize: "",
    },
    //类型选择
    typeList: [
      '直轨道', "左 L 轨", "右 L 轨", "U型轨",
    ],
    //默认数据
    defaultNum: {
      name: "默认窗帘名称",
      mainLineSize: "3.14",
      leftLineSize: "1",
      rightLineSize: "1",
    },
    //绘制数据
    paintingData: {
      //画布宽高
      width: 300,
      height: 150,

      //以主轨道为准，放缩绘图
      startX: 50,
      startY: 30,
      ratioY: 63.7,//按照x向默认值3.14m对应200，得到y向1m对应63.7
      lineWidth: 5,//绘制线条宽度

      electromotorSize: 30,//绘制电机大小
      electromotor: [1, 0],//左、右电机是否需要
      //绘制电机图片
      electromotorURL: [
        "../../../image/electromotor0.png",
        "../../../image/electromotor1.png",
      ],
    },


  },


  //窗帘名称输入框
  trackNameInput(e: any) {
    let formCurtain = this.data.formCurtain;
    formCurtain.name = e.detail.value;
    this.setData({
      formCurtain: formCurtain,
    })
    console.log(this.data.formCurtain.name);
  },
  //类型下拉框选择
  typeChange(e: any) {

    let formCurtain = this.data.formCurtain;
    formCurtain.type = e.detail.value;
    this.setData({
      formCurtain: formCurtain,
    })
    this.drawMainLane();

  },
  //返回绘制轨道和电机的参数
  getDrawParameter(data: Number) {
    data = Number(data);
    let formCurtain = this.data.formCurtain;
    let paintingData = this.data.paintingData;
    //获取主轨道尺寸
    let mainLineSize;
    if (isNaN(mainLineSize = parseFloat(formCurtain.mainLineSize))) {
      formCurtain.mainLineSize = "";
      mainLineSize = Number(this.data.defaultNum.mainLineSize);
    }
    //重新计算y向的比例尺
    paintingData.ratioY = 200 / mainLineSize;
    //获取左轨道尺寸
    let leftLineSize;
    if (isNaN(leftLineSize = parseFloat(formCurtain.leftLineSize))) {
      formCurtain.leftLineSize = "";
      leftLineSize = Number(this.data.defaultNum.leftLineSize);
    };
    //获取右轨道尺寸
    let rightLineSize;
    if (isNaN(rightLineSize = parseFloat(formCurtain.rightLineSize))) {
      formCurtain.rightLineSize = "";
      rightLineSize = Number(this.data.defaultNum.rightLineSize);
    }

    //比例
    let scaling = 1;
    let left = paintingData.startY + leftLineSize * paintingData.ratioY;
    let right = paintingData.startY + rightLineSize * paintingData.ratioY;
    let max = Math.max(left, right);
    if (max > paintingData.height)
      scaling = 0.8 * paintingData.height / max;

    //要返回的数据      
    let typeData = {
      lineWidth: paintingData.lineWidth * scaling / 67 * paintingData.ratioY,
      electromotorSize: paintingData.electromotorSize * scaling / 67 * paintingData.ratioY,
      lane: [
        {
          x1: paintingData.startX,
          y1: paintingData.startY,
          x2: (paintingData.startX + mainLineSize * paintingData.ratioY) * scaling,
          y2: paintingData.startY
        },
        //无副轨道
      ],
      //左，右电机的位置
      electromotorSite: [
        { x: paintingData.startX, y: paintingData.startY },
        { x: (paintingData.startX + mainLineSize * paintingData.ratioY) * scaling, y: paintingData.startY },
      ],
    };
    let leftLane;
    let rightLane;
    switch (data) {
      case 0:
        console.log("0数据");
        return typeData;
      case 1:
        console.log("1数据");
        //得到左轨道绘图数据
        leftLane = {
          x1: paintingData.startX,
          y1: paintingData.startY,
          x2: paintingData.startX,
          y2: (paintingData.startY + leftLineSize * paintingData.ratioY) * scaling,
        }
        typeData.lane.push(leftLane);
        typeData.electromotorSite[0] = {
          x: typeData.lane[1].x2,
          y: typeData.lane[1].y2,
        }
        return typeData;
      case 2:
        console.log("2数据");
        //得到右轨道绘图数据
        rightLane = {
          x1: typeData.lane[0].x2,
          y1: paintingData.startY,
          x2: typeData.lane[0].x2,
          y2: (paintingData.startY + rightLineSize * paintingData.ratioY) * scaling,
        }
        typeData.lane.push(rightLane);
        typeData.electromotorSite[1] = {
          x: typeData.lane[1].x2,
          y: typeData.lane[1].y2,
        }
        return typeData;
      case 3:
        console.log("3数据");
        //得到左轨道绘图数据
        leftLane = {
          x1: paintingData.startX,
          y1: paintingData.startY,
          x2: paintingData.startX,
          y2: (paintingData.startY + leftLineSize * paintingData.ratioY) * scaling,
        }
        typeData.lane.push(leftLane);
        typeData.electromotorSite[0] = {
          x: typeData.lane[1].x2,
          y: typeData.lane[1].y2,
        }
        //得到右轨道绘图数据
        rightLane = {
          x1: typeData.lane[0].x2,
          y1: paintingData.startY,
          x2: typeData.lane[0].x2,
          y2: (paintingData.startY + rightLineSize * paintingData.ratioY) * scaling,
        }
        typeData.lane.push(rightLane);
        typeData.electromotorSite[1] = {
          x: typeData.lane[2].x2,
          y: typeData.lane[2].y2,
        }
        return typeData;
      default:
        return typeData;
    }
  },

  //绘制轨道和电机
  drawMainLane() {
    wx.createSelectorQuery()
      .select('#myCanvas') // 在 WXML 中填入的 id
      .fields({ node: true, size: true })
      .exec((res) => {
        // Canvas 对象
        const canvas = res[0].node
        // Canvas 绘制上下文
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        //获取绘图数据
        let drawData = this.getDrawParameter(this.data.formCurtain.type);
        console.log(drawData);

        //画轨道
        for (let i = 0; i < drawData.lane.length; i++) {
          ctx.beginPath();
          ctx.moveTo(drawData.lane[i].x1, drawData.lane[i].y1);
          ctx.lineTo(drawData.lane[i].x2, drawData.lane[i].y2);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = drawData.lineWidth;
          ctx.stroke();
        }
        console.log("完成轨道");
        //画电机
        let paintingData = this.data.paintingData;
        for (let i = 0; i < paintingData.electromotor.length; i++) {
          const image = canvas.createImage()
          image.onload = () => {
            // 设置绘图时的透明度
            if (paintingData.electromotor[i] == 0)
              ctx.globalAlpha = 0.6;
            ctx.drawImage(
              image,
              drawData.electromotorSite[i].x - drawData.electromotorSize / 2,
              drawData.electromotorSite[i].y - drawData.electromotorSize / 2,
              drawData.electromotorSize,
              drawData.electromotorSize,
            )
            // 恢复透明度为默认值
            ctx.globalAlpha = 1;
          }
          //用不同的图片绘制电机，表示是否需要
          image.src = paintingData.electromotorURL[paintingData.electromotor[i]];
          console.log("画次电机");
        }
      })
  },
  //电机位置复选框
  electricalChange(e: any) {
    console.log(e.detail.value);
    let formCurtain = this.data.formCurtain;
    formCurtain.electromotor = e.detail.value;
    let paintingData = this.data.paintingData;
    paintingData.electromotor.fill(0);
    for (let i = 0; i < formCurtain.electromotor.length; i++) {
      paintingData.electromotor[formCurtain.electromotor[i]] = 1;
    }
    this.setData({
      formCurtain: formCurtain,
      paintingData: paintingData,
    })
    this.drawMainLane();
    console.log("formCurtain.electromotor:", formCurtain.electromotor);
    console.log("paintingData.electromotor", paintingData.electromotor);
  },
  //主轨道尺寸输入框
  mainLineInput(e: any) {
    let formCurtain = this.data.formCurtain;
    formCurtain.mainLineSize = e.detail.value;
    this.setData({
      formCurtain: formCurtain,
    });
    this.drawMainLane();
    console.log("formCurtain.mainLineSize:", this.data.formCurtain.mainLineSize);
  },
  //左轨道尺寸输入框
  leftLineInput(e: any) {
    let formCurtain = this.data.formCurtain;
    formCurtain.leftLineSize = e.detail.value;
    this.setData({
      formCurtain: formCurtain,
    });
    this.drawMainLane();
    console.log("formCurtain.leftLineSize:", this.data.formCurtain.leftLineSize);
  },
  //右轨道尺寸输入框
  rightLineInput(e: any) {
    let formCurtain = this.data.formCurtain;
    formCurtain.rightLineSize = e.detail.value;
    this.setData({
      formCurtain: formCurtain,
    });
    this.drawMainLane();
    console.log("formCurtain.rightLineSize:", this.data.formCurtain.rightLineSize);
  },
  //确认添加窗帘按钮
  saveTrack() {
    let formCurtain = this.data.formCurtain;
    let defaultNum = this.data.defaultNum;
    if (formCurtain.name == "")
      formCurtain.name = defaultNum.name;
    let type = Number(formCurtain.type);
    let describe;
    switch (type) {
      case 0:
        if (formCurtain.mainLineSize == "")
          formCurtain.mainLineSize = defaultNum.mainLineSize;
        describe = "直导轨，" + formCurtain.mainLineSize;
        break;
      case 1:
        if (formCurtain.mainLineSize == "")
          formCurtain.mainLineSize = defaultNum.mainLineSize;
        if (formCurtain.leftLineSize == "")
          formCurtain.leftLineSize = defaultNum.leftLineSize;
        describe = "左L导轨，" + formCurtain.mainLineSize +
          "，" + formCurtain.leftLineSize;
        break;
      case 2:
        if (formCurtain.mainLineSize == "")
          formCurtain.mainLineSize = defaultNum.mainLineSize;
        if (formCurtain.rightLineSize == "")
          formCurtain.rightLineSize = defaultNum.rightLineSize;
        describe = "右L导轨，" + formCurtain.mainLineSize +
          "，" + formCurtain.rightLineSize;
        break;
      case 3:
        if (formCurtain.mainLineSize == "")
          formCurtain.mainLineSize = defaultNum.mainLineSize;
        if (formCurtain.leftLineSize == "")
          formCurtain.leftLineSize = defaultNum.leftLineSize;
        if (formCurtain.rightLineSize == "")
          formCurtain.rightLineSize = defaultNum.rightLineSize;
        describe = "U导轨，" + formCurtain.mainLineSize +
          "，" + formCurtain.leftLineSize +
          "，" + formCurtain.rightLineSize;
        break;
      default:
        if (formCurtain.mainLineSize == "")
          formCurtain.mainLineSize = defaultNum.mainLineSize;
        break;
    }
    for (let i = 0; i < formCurtain.electromotor.length; i++) {
      if (formCurtain.electromotor[i] == 0)
        describe = describe + "，左电机"
      if (formCurtain.electromotor[i] == 1)
        describe = describe + "，右电机"
    }
    formCurtain.describe = describe;
    let room = this.data.room;
    room.curtain.push(formCurtain);
    this.setData({
      room: room,
    })
    //跳转主页
    wx.navigateBack({
      delta: 1, // 返回的页面数，1 表示返回上一个页面
      success: function () {
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let room;
    let defaultNum = this.data.defaultNum;
    const eventChannel = this.getOpenerEventChannel()
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    if (eventChannel) {
      eventChannel.on('acceptDataFromOpenerPage', function (data) {
        room = data;
        if (room.curtain == undefined) {
          room.curtain = [];
        };
        defaultNum.name = data.name + "窗帘" + (data.curtain.length + 1);
        
      })
    }

    this.setData({
      room: room,
      defaultNum: defaultNum,
    });
    console.log(this.data.room);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.createSelectorQuery()
      .select('#myCanvas') // 在 WXML 中填入的 id
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        // 渲染上下文
        const ctx = canvas.getContext('2d')

        // Canvas 画布的实际绘制宽高
        const width = res[0].width
        const height = res[0].height

        // 初始化画布大小
        const dpr = wx.getWindowInfo().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        console.log("画布大小：", canvas.width, "*", canvas.height);
      });
    this.drawMainLane();
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
    let room = this.data.room;
    room.unfold = true;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', { data: this.data.room });
    console.log("页面被卸载了");

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