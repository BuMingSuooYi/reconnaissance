// pages/index/index.ts
//引入勘测实例API
// const caseSurvey = require('../../api/case-survey');
import { caseSurvey } from '../../api/case-survey';
import {myNode} from '../../api/case-survey-node';
import { MyUtil } from '../../utils/myUtil';

 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //实例列表
    caseSurveys: [],
    //实例模板列表
    caseSurveyTemplates: [],
    //删除实例相关数据
    deletaCaseSurvey: {
      exist: false,//删除弹窗是否出现
      n: -1,//删除数索引为n的实例
    },
    addCaseSurvey: {
      exist: false,//删除弹窗是否出现
      data: {
        name: "",
        switchColorPreference: "",
        switchMaterialPreference: "",
        template: 0
      },
      defData: {//默认值
        switchColorPreference: "商务灰",
        switchMaterialPreference: "PLA",
        templateObject: {}
      },

    }


  },
  //点击跳转勘察实例
  toHome(e: any) {
    let n = e.currentTarget.dataset.n;
    let caseSurveys = this.data.caseSurveys;//需要传递的数据
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
        res.eventChannel.emit('OpencaseSurvey', caseSurveys[n]);
      },
    });
  },
  //点击新增勘察实例
  addCaseSurvey() {
    let addCaseSurvey = this.data.addCaseSurvey;
    addCaseSurvey.exist = true,
      this.setData({
        addCaseSurvey: addCaseSurvey,
      });
  },

  //地址输入
  CSnameInput(e: any) {
    const name = e.detail.value;
    let addCaseSurvey = this.data.addCaseSurvey;
    addCaseSurvey.data.name = name;
    this.setData({
      addCaseSurvey: addCaseSurvey
    })
  },
  //模板单选
  templateChange(e: any) {
    let index = e.detail.value;
    const caseSurveyTemplates = this.data.caseSurveyTemplates;
    let templateObject = caseSurveyTemplates[index];

    //模板选择
    let addCaseSurvey = this.data.addCaseSurvey;
    addCaseSurvey.data.template = templateObject.id;
    addCaseSurvey.defData.templateObject = templateObject;

    //继承模板的偏好
    addCaseSurvey.data.switchColorPreference = templateObject.switchColorPreference;
    addCaseSurvey.data.switchMaterialPreference = templateObject.switchMaterialPreference;

    this.setData({
      addCaseSurvey: addCaseSurvey
    })
  },
  //颜色输入
  CScolorInput(e: any) {
    const color = e.detail.value;
    let addCaseSurvey = this.data.addCaseSurvey;
    addCaseSurvey.data.switchColorPreference = color;
    this.setData({
      addCaseSurvey: addCaseSurvey
    })
  },
  //材质输入
  CSmaterialInput(e: any) {
    const material = e.detail.value;
    let addCaseSurvey = this.data.addCaseSurvey;
    addCaseSurvey.data.switchMaterialPreference = material;
    this.setData({
      addCaseSurvey: addCaseSurvey
    })
  },
  //关闭新增勘察弹窗
  closeAddCaseSurvey() {
    let addCaseSurvey = {
      exist: false,//删除弹窗是否出现
      data: {
        name: "",
        switchColorPreference: "",
        switchMaterialPreference: "",
        template: 0
      },
      defData: {//默认值
        switchColorPreference: "商务灰",
        switchMaterialPreference: "PLA",
        templateObject: {}
      },
    };
    this.setData({
      addCaseSurvey: addCaseSurvey,
    });
  },
  //确认新增勘察
  confirmAddCaseSurvey() {
    let data = this.data.addCaseSurvey.data;
    //地址非空处理
    if (data.name.trim() == "") {
      MyUtil.hint("地址不能为空");
      return;
    };
    // 默认值处理
    if (data.switchColorPreference.trim() == "") {
      data.switchColorPreference = this.data.addCaseSurvey.defData.switchColorPreference;
    }
    if (data.switchMaterialPreference.trim() == "") {
      data.switchMaterialPreference = this.data.addCaseSurvey.defData.switchMaterialPreference;
    }
    // 新增请求
    caseSurvey.addCaseSurvey(data).then((res: any) => {
      if (res.statusCode == 201) {
        // 请求成功,关闭新增弹窗，并重新加载实例列表
        this.closeAddCaseSurvey();
        this.getAllCaseSurvey();
      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })
  },

  //长按出现删除弹窗
  deleteCaseSurvey(e: any) {
    console.log("1.  n=", e.currentTarget.dataset.n);
    let n = parseInt(e.currentTarget.dataset.n)
    let deletaCaseSurvey = this.data.deletaCaseSurvey;
    deletaCaseSurvey.exist = true,
      deletaCaseSurvey.n = n,
      this.setData({
        deletaCaseSurvey: deletaCaseSurvey,
      });
    // let id = this.data.caseSurveys[this.data.deletaCaseSurvey.n].id;
    // caseSurvey.getById(id).then((res: any) => {
    //   if (res.statusCode == 200) {
    //     // 请求成功的处理
    //     console.log(res);
    //   } else {
    //     // 请求失败的处理
    //   }
    // }).catch((res: any) => { })
  },
  //关闭删除实例的弹窗
  closeDeletCaseSurvey() {
    let deletaCaseSurvey = {
      exist: false,
      n: -1,
    };
    this.setData({
      deletaCaseSurvey: deletaCaseSurvey,
    });
  },

  //确认删除实例
  confirmDeletCaseSurvey() {
    let id = this.data.caseSurveys[this.data.deletaCaseSurvey.n].id.toString();
    caseSurvey.deleteById(id).then((res: any) => {
      console.log("res.statusCode:", res.statusCode);
      if (res.statusCode == 200) {
        //请求成功，重新加载实例列表
        this.getAllCaseSurvey();
        this.closeDeletCaseSurvey();
      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })
  },

  //设置为模板
  setTemplate(e: any) {
    console.log("123456789");
    
    let survey = e.currentTarget.dataset.survey;
    survey.template = 1;
    // 新增请求
    caseSurvey.changeTemplate(survey).then((res: any) => {
      if (res.statusCode == 201) {
        // 请求成功,关闭新增弹窗，并重新加载实例列表
        this.closeDeletCaseSurvey();
        this.getAllCaseSurvey();
      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })
  },

  //取消模板
  cancelTemplate(e: any) {
    let survey = e.currentTarget.dataset.survey;
    survey.template = 0;
    // 新增请求
    caseSurvey.changeTemplate(survey).then((res: any) => {
      if (res.statusCode == 201) {
        // 请求成功,关闭新增弹窗，并重新加载实例列表
        this.closeDeletCaseSurvey();
        this.getAllCaseSurvey();
      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })
  },


  //数据请求，获取全部勘测实例,并区分出模板
  getAllCaseSurvey() {
    caseSurvey.getAll().then((res: any) => {
      if (res.statusCode == 200) {
        //筛选模板
        let surveysTemplates = [
          {
            id:0,
            name:'不需要模板'
          }
        ]
        surveysTemplates=surveysTemplates.concat(res.data.filter(item => item.template === 1));
        // 请求成功的处理
        this.setData({
          caseSurveys: res.data,
          caseSurveyTemplates: surveysTemplates
        })
      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    //数据请求
    this.getAllCaseSurvey();
    //删除未初始化底盒垃圾数据
    myNode.removeRubbishNode().then((res: any) => {
      if (res.statusCode == 200) {
        console.log("删除了垃圾数据");
        
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
    //数据请求
    this.getAllCaseSurvey();
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