// pages/index/scence/scence.ts
import { Scence } from "../../../api/case_survey_scence";
import { MyApp } from "../../../api/case-survey-app";
import { MyUtil } from "../../../utils/myUtil"


Page({

  /**
   * 页面的初始数据
   */
  data: {
    surveyData: {},
    //情景数据列表
    secences: [],
    //实例中全部的区域及其被控器件
    smartControls: [],
    //实例中提取出来的被控器件
    conList: [],
    redact: false,//是否处于编辑情景
    scenceI: {//正在编写的情景
      name: "",
      apps: [

      ],
      surveyId: 0,
      areaId: 0,
      area: {
        name: ""
      },//用于显示
    },

  },
  //点击编辑情景
  clickScence(e: any) {
    //先清除复选缓存
    this.clearSelect();
    let scence = e.target.dataset.scence;
    console.log("点击了", scence);
    let scenceI = this.data.scenceI;
    //所属区域
    const smartControls=this.data.smartControls;
    const smartControl= smartControls.find((obj) => obj.area.id === parseInt(scence.scene.areaId));
    //初始化数据
    scenceI.apps = scence.apps;
    scenceI.id=scence.scene.id;
    scenceI.name=scence.scene.name;
    scenceI.area =smartControl.area;
    scenceI.areaId=scenceI.area.id;

    this.setData({
      redact: true,
      scenceI: scenceI,
      deviceExist: true,
    })
  },
  //删除情景
  deleteScence(e: any) {
    let scence = e.target.dataset.scence;
    console.log("点击了删除（", scence.scene.name, "）");
    MyUtil.hint("删除情景，待开发")
  },


  //复选
  selectDevice(e: any) {
    let conIdList = e.detail.value;
    let conList = this.data.conList;
    let scenceI = this.data.scenceI;
    let apps: any = [];

    conIdList.forEach((conId: number) => {
      const con = conList.find((obj) => obj.id === parseInt(conId));
      let coni = {
        appId: con.id,
        name: con.name,
        actionKey: "turnOff",
        surveyId: con.surveyId,
        areaId: con.areaId
      }
      apps.push(coni);
    });
    scenceI.apps = apps;

    this.setData({
      scenceI: scenceI
    })
    console.log(this.data.scenceI);
  },

  //显示抽屉按钮
  showModal() {
    let scenceI = this.data.scenceI;
    //判断复选是否为空
    if (scenceI.apps.length == 0) {
      MyUtil.hint("请先选择情景控制的器件");
      return;
    }
    this.setData({
      scenceI: scenceI,
      deviceExist: true,
    })
  },
  //隐藏抽屉
  hideModal() {
    //如果处于编辑情景状态，隐藏抽屉则需要清除复选缓存
    if (this.data.redact)
      this.clearSelect()
    this.setData({
      deviceExist: false,
      redact: false,
    })
  },
  //情景名称输入框
  scenceInput(e: any) {
    let scenceI = this.data.scenceI;
    scenceI.name = e.detail.value;
    this.setData({
      scenceI: scenceI,
    })
  },

  //场景区域单选
  addareaChange(e: any) {
    let areaIndex = e.detail.value;
    let scenceI = this.data.scenceI
    scenceI.area = this.data.surveyData.areas[areaIndex];
    scenceI.areaId = scenceI.area.id;
    this.setData({
      scenceI: scenceI,
    });
  },

  //选择开关状态
  switchOnOff(e: any) {
    let index = e.currentTarget.dataset.index;
    let scenceI = this.data.scenceI;
    console.log("e.detail.value::", e.detail.value);
    if (e.detail.value == true) {
      scenceI.apps[index].actionKey = "turnOn";
    } else {
      scenceI.apps[index].actionKey = "turnOff";
    }
    this.setData({
      scenceI: scenceI,
    })
  },

  //保存情景
  async comfirmScence() {
    const smartControls = this.data.smartControls;
    let scenceI = this.data.scenceI
    let secences: never[] = [];
    //判断名称是否为空
    if (scenceI.name == "") {
      MyUtil.hint("请填写情景名称")
      return;
    }

    if (this.data.redact) {
      await Scence.updata(scenceI).then((res: any) => {
        if (res.statusCode == 200) {
          console.log("保存成功");
        } else {
          // 请求失败的处理
        }
      }).catch((res: any) => { })
    } else {
      //新增、保存情景
      Scence.add(this.data.scenceI).then((res: any) => {
        console.log("res.statusCode:", res.statusCode);
        if (res.statusCode == 201) {
          console.log("创建情景完成返回：", res.data);
          this.setData({
            smartControls: smartControls
          })
        } else {
          // 请求失败的处理
        }
      }).catch((res: any) => {
        console.log(res);
        return;
      })
    }
    //隐藏抽屉
    this.hideModal();
    //重新获取全部情景信息
    secences = await this.getAllScence(scenceI.surveyId)
    //清除复选缓存
    this.clearSelect();
    this.setData({
      scenceI: scenceI,
      secences: secences
    })
  },

  //清空复选缓存
  clearSelect() {
    let smartControls = this.data.smartControls;
    let scenceI = this.data.scenceI;
    //清除缓存
    smartControls.forEach(smartControl => {
      smartControl.control.forEach(control => {
        control.checked = false;
      });
    });
    // scenceI.areaId=0;
    // scenceI.area={name:""}
    scenceI.name = "";
    scenceI.apps = [];
    this.setData({
      smartControls: smartControls,
      scenceI: scenceI,
    })
  },

  //获取当前实例全部场景信息
  async getAllScence(surveyId: number) {
    let secences: never[] = [];
    await Scence.getAllData(surveyId).then((res: any) => {
      if (res.statusCode == 200) {
        // 请求成功
        secences = res.data;
        console.log("secences=", secences);
      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })
    return secences;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    let surveyData = {
      areas: [],
      caseSurvey: {}
    };
    let smartControls: never[] = [];
    let secences: never[] = [];
    let conList: never[] = [];
    const eventChannel = this.getOpenerEventChannel()
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    if (eventChannel) {
      await eventChannel.on('acceptDataFromOpenerPage', function (data) {
        surveyData = data;
      })
      console.log("surveyData:", surveyData);

      //获取实例全部智控器件
      await MyApp.getSmartControlByAreas(surveyData.areas).then((res: any) => {
        if (res.statusCode == 201) {
          // 请求成功,
          smartControls = res.data;
          console.log("smartControls=", smartControls);
        } else {
          // 请求失败的处理
        }
      }).catch((res: any) => { })

      // 使用map方法提取所有的control数组
      conList = smartControls.map(item => item.control);
      // 使用reduce方法将所有的con数组合并成一个新数组
      conList = conList.reduce((acc, curr) => acc.concat(curr), []);


      //获取实例全部情景数据
      secences = await this.getAllScence(surveyData.caseSurvey.id);
      console.log("secences::::::", secences);

    }

    let scenceI = this.data.scenceI;
    scenceI.surveyId = surveyData.caseSurvey.id;


    this.setData({
      surveyData: surveyData,
      smartControls: smartControls,
      secences: secences,
      conList: conList,
      scenceI: scenceI
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