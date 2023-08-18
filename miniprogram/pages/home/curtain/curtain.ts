import { MyUtil } from "../../../utils/myUtil";
import { Curtain } from "../../../api/case-survey-curtain";

// pages/index/curtain/curtain.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //传来的基础数据，sId和area
    baseData: {
      area: {},
      surveyId: Number,
      curtain: {},

    },
    redact: false,
    //表单待填
    formCurtain: {
      surveyId: Number,
      areaId: Number,
      name: "默认窗帘名称",
      electromotor: [0],
      mainLength: 300,
      leftLength: 0,
      rightLength: 0,
      remark: "",
    },

    //绘制数据
    paintingData: {
      //画布宽高
      width: 300,
      height: 150,

      //以主轨道为准，放缩绘图
      startX: 50,
      startY: 30,
      ratioY: 0.63,//按照x向默认值3.14m对应200，得到y向1m对应63.7
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

  //返回绘制轨道和电机的参数
  getDrawParameter() {
    let formCurtain = this.data.formCurtain;
    let paintingData = this.data.paintingData;
    //获取主轨道尺寸
    let mainLength = formCurtain.mainLength;
    //重新计算y向的比例尺
    paintingData.ratioY = 200 / mainLength;

    //获取左轨道尺寸
    let leftLength = formCurtain.leftLength;
    //获取右轨道尺寸
    let rightLength = formCurtain.rightLength;

    //整体比例
    let scaling = 1;
    let left = paintingData.startY + leftLength * paintingData.ratioY;
    let right = paintingData.startY + rightLength * paintingData.ratioY;
    let max = Math.max(left, right);
    if (max > paintingData.height)
      scaling = 0.8 * paintingData.height / max;

    //要返回的数据      
    let typeData = {
      lineWidth: paintingData.lineWidth * scaling,
      electromotorSize: paintingData.electromotorSize * scaling,
      lane: [
        {
          x1: paintingData.startX,
          y1: paintingData.startY,
          x2: paintingData.startX + (mainLength * paintingData.ratioY) * scaling,
          y2: paintingData.startY
        },
        //无副轨道
      ],
      //左，右电机的位置
      electromotorSite: [
        { x: paintingData.startX, y: paintingData.startY },
        { x: paintingData.startX + (mainLength * paintingData.ratioY) * scaling, y: paintingData.startY },
      ],
    };

    let leftLane;
    let rightLane;

    //得到左轨道绘图数据
    leftLane = {
      x1: paintingData.startX,
      y1: paintingData.startY,
      x2: paintingData.startX,
      y2: paintingData.startY + (leftLength * paintingData.ratioY) * scaling,
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
      y2: paintingData.startY + (rightLength * paintingData.ratioY) * scaling,
    }
    typeData.lane.push(rightLane);
    typeData.electromotorSite[1] = {
      x: typeData.lane[2].x2,
      y: typeData.lane[2].y2,
    }
    return typeData;
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
        let drawData = this.getDrawParameter();
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
  //窗帘名称输入框
  trackNameInput(e: any) {
    let formCurtain = this.data.formCurtain;
    formCurtain.name = e.detail.value;
    this.setData({
      formCurtain: formCurtain,
    })
    console.log(this.data.formCurtain.name);
  },
  remarkNameInput(e: any) {
    let formCurtain = this.data.formCurtain;
    formCurtain.remark = e.detail.value;
    this.setData({
      formCurtain: formCurtain,
    })
    console.log(this.data.formCurtain.remark);
  },
  //电机位置复选框
  electricalChange(e: any) {
    console.log(e.detail.value);
    let formCurtain = this.data.formCurtain;
    formCurtain.electromotor = e.detail.value.map(str => parseInt(str, 10));
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
    formCurtain.mainLength =e.detail.value;
    console.log("formCurtain.mainLength:::", formCurtain.mainLength);

    this.setData({
      formCurtain: formCurtain,
    });
    this.drawMainLane();
    console.log("formCurtain.mainLength:", this.data.formCurtain.mainLength);
  },
  //左轨道尺寸输入框
  leftLineInput(e: any) {
    let formCurtain = this.data.formCurtain;
    formCurtain.leftLength = e.detail.value;
    this.setData({
      formCurtain: formCurtain,
    });
    this.drawMainLane();
    console.log("formCurtain.leftLength:", this.data.formCurtain.leftLength);
  },
  //右轨道尺寸输入框
  rightLineInput(e: any) {
    let formCurtain = this.data.formCurtain;
    formCurtain.rightLength = e.detail.value;
    this.setData({
      formCurtain: formCurtain,
    });
    this.drawMainLane();
    console.log("formCurtain.rightLength:", this.data.formCurtain.rightLength);
  },
  //确认 添加/编辑 窗帘按钮
  saveTrack() {
    let formCurtain = this.data.formCurtain;
    if ((formCurtain.mainLength == 0 || formCurtain.mainLength == undefined) && formCurtain.remark == "") {
      MyUtil.hint("特殊轨道 请填写备注");
      return;
    }

    if (formCurtain.name == "") {
      if (this.data.redact) {
        formCurtain.name = this.data.baseData.curtain.name;
      } else {
        formCurtain.name = this.data.baseData.area.name + "窗帘";
      }
    };

    //保存前尺寸转换为mm单位
    formCurtain=this.allCmToMm(formCurtain);

    if (this.data.redact) {
      console.log("这是编辑窗帘");
      Curtain.updata(formCurtain).then((res: any) => {
        if (res.statusCode == 200) {
          formCurtain = res.data;
          console.log("保存窗帘完成返回：", res.data);

          //跳转主页
          wx.navigateBack({
            delta: 1, // 返回的页面数，1 表示返回上一个页面
            success: function () {
            }
          });

        } else {
          // 请求失败，尺寸需要转换回cm单位
          formCurtain=this.allMmToCm(formCurtain);
        }
      }).catch((res: any) => { })
    } else {
      Curtain.add(formCurtain).then((res: any) => {
        if (res.statusCode == 201) {
          formCurtain = res.data;
          console.log("创建窗帘完成返回：", res.data);

          //跳转主页
          wx.navigateBack({
            delta: 1, // 返回的页面数，1 表示返回上一个页面
            success: function () {
            }
          });

        } else {
          // 请求失败，尺寸需要转换回cm单位
          formCurtain=this.allMmToCm(formCurtain);
        }
      }).catch((res: any) => { })
    }
  },

  allCmToMm(formCurtain:any) {
    //进行尺寸转换
    formCurtain.mainLength = this.cmToMm(formCurtain.mainLength);
    formCurtain.leftLength = this.cmToMm(formCurtain.leftLength);
    formCurtain.rightLength = this.cmToMm(formCurtain.rightLength);
    console.log("formCurtain:", formCurtain);
    return formCurtain;
  },

  // 厘米到毫米的转换，保留一位小数
  cmToMm(cm: number): number {
    return cm* 10 ; // 厘米 * 10 = 毫米
  },


  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    let baseData;
    let formCurtain = this.data.formCurtain
    let redact = this.data.redact;
    let paintingData = this.data.paintingData
    const eventChannel = this.getOpenerEventChannel()
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    if (eventChannel) {
      await eventChannel.on('acceptDataFromOpenerPage', function (data) {
        baseData = data;
        console.log("本地得到的数据：：", baseData);

        if (data.curtain != undefined) {
          let curtain = data.curtain;
          //编辑窗帘,初始化
          redact = true;
          paintingData.electromotor = [0, 0];
          formCurtain = {
            surveyId: curtain.surveyId,
            areaId: curtain.areaId,
            name: curtain.name,
            electromotor: [],
            mainLength: curtain.mainLength,
            leftLength: curtain.leftLength,
            rightLength: curtain.rightLength,
            remark: curtain.remark,
          }
          //绘制电机和复选框的参数
          formCurtain.id = curtain.id;
          if (curtain.leftCurtainMotorNodeId != 0) {
            formCurtain.electromotor.push(0);
            paintingData.electromotor[0] = 1;
          }
          if (curtain.rightCurtainMotorNodeId != 0) {
            formCurtain.electromotor.push(1);
            paintingData.electromotor[1] = 1;
          }
        } else {
          //新增窗帘
          console.log(baseData);
          formCurtain.surveyId = baseData.surveyId;
          formCurtain.areaId = baseData.area.id;
          formCurtain.name = baseData.area.name + "窗帘";
        }
      })

      this.setData({
        baseData: baseData,
        formCurtain: formCurtain,
        redact: redact,
        paintingData: paintingData
      });
      console.log(this.data.baseData);
    }
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
    console.log("第一次画轨道");

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
    let formCurtain = this.data.formCurtain;
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromOpenedPage', { areaId: formCurtain.areaId });
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