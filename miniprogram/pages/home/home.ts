// index.ts
// 获取应用实例
import { myNode } from "../../api/case-survey-node";
import { MyApp } from "../../api/case-survey-app";
import { Area } from "../../api/case-survey-area";
import { Site } from "../../api/case-survey-site";
import { MyUtil } from "../../utils/myUtil"

Page({
  data: {

    //实例数据
    caseSurvey: {},
    //区域列表
    areas: [],
    //新增区域所用数据
    addArea: {
      exist: false,
      data: {
        surveyId: -1,
        name: "",
      }
    },

    /*点击区域展开时重新获取数据 */
    //展开的区域具体数据
    unfoldArea: {
      areaId: -1,//展开区域的id
      data: [
        // 区域数据的结构
        //窗帘信息
        // curtainData：{

        // }
        //位点信息
        // siteData：{
        //   site: {
        //   },
        //   nodeData: {
        //     // curtainData:[],//窗帘数据先不管
        //     T: [],//非联排的底盒
        //     N: {},//联排的底盒   // 联排号：[底盒1、底盒2]
        //   }
        // }
      ]

    },


    //新增节点所用数据
    addNode: {
      /*初始的默认数据 */
      caseClazz: ["插座", "开关", "面板"],

      /*打开底盒时需要填充的数据*/
      surveyId: -1,
      areaId: -1,
      exist: false,//新增Node界面是否显示
      allSites: [],//所在区域的全部位点
      init: false,//是否完成初始化（关闭底盒时是否需要删除新创建的底盒）

      /*打开添加开关时需要填充的数据 */
      switchExist: false,//新增app界面是否显示
      controlDevice: true,//新增app绑定的类型默认是智能器件
      TabCur: 1,//默认是开关页
      allSmartControls: [],//所在实例全部智能被控器件
      allSwitchs: [],//所在实例的开关

      /*在新增底盒时，选择位点后填充的数据*/
      //用于新增位点的数据
      newSiteData: {
        name: "",
        surveyId: -1,
        areaId: -1,
      },
      /*新增底盒过程中需要填写的数据 */
      //用于新增节点的数据
      newNodeData: {
        name: "默认名称",
        typeKey: "switch",
        powerType: 1,
        rawFrameSymbol: 0,
        surveyId: -1,
        areaId: -1,
        // siteId: undefined,
      },
    },

    /*只用于新增被控器件时填充的数据 */
    //用于新增智能被控器件的数据
    controlledApp: {
      name: "",
      typeKey: "smart_control",
      surveyId: -1,
      areaId: -1,
    },

    //用于批量新增开关的数据
    newSwitchs: {
      newData: {
        name: "",
        typeKey: "switch",
        bindAppId: -1,
        nodeId: -1,
        surveyId: -1,
        areaId: -1,
      },
      newSwitchList: []
    },

    //插座类型列表
    socketList: [
      "16A空调插座", "网络插座", "五孔插座", "一开五孔插座", "电话插座", "五孔多功能插座", "电话网络插座", "双电话插座", "智能五孔插座",
    ],
    nullList: [
      "空面板",
    ],
  },

  // 点击区域列表的伸缩
  xml_toStretch(e: any) {
    let areaId = e.currentTarget.dataset.areaid;
    let unfoldArea = this.data.unfoldArea;
    console.log("areaId!!!!", areaId);

    if (areaId == this.data.unfoldArea.areaId) {
      //重复点击，缩略
      unfoldArea.areaId = -1;
      this.setData({
        unfoldArea: unfoldArea
      })
    } else {
      this.toStretch(areaId);
    }
  },

  //展开区域
  async toStretch(areaId: number) {
    let unfoldArea = this.data.unfoldArea;
    //展开区域
    unfoldArea.areaId = areaId;
    console.log(unfoldArea.areaId);
    await Area.getDataById(unfoldArea.areaId).then((res: any) => {
      if (res.statusCode == 200) {
        // 请求成功,关闭新增弹窗，并重新加载实例列表
        unfoldArea.data = res.data;
        this.setData({
          unfoldArea: unfoldArea
        })

        console.log("unfoldArea=", this.data.unfoldArea);

      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })
  },

  // ==========添加区域弹窗部分==========

  closeAddArea() {
    // 关闭模态框
    const add = this.data.addArea;
    add.exist = false;
    console.log("add.exist:", add.exist);
    add.data.name = "";
    this.setData({
      addArea: add,
    });
  },

  openAddArea() {
    // 打开模态框
    const add = this.data.addArea;
    add.exist = true;
    this.setData({
      addArea: add,
    });
  },

  addAreaInput(e: any) {
    // 更新输入框的值
    const add = this.data.addArea;
    add.data.name = e.detail.value;
    this.setData({
      addArea: add,
    });
  },

  confirmAddArea() {
    // 添加一个新的区域
    if (this.data.addArea.data.name.trim() == "") {
      MyUtil.hint("区域名称不能为空");
      return;
    }
    //发送新增请求
    Area.add(this.data.addArea.data).then((res: any) => {
      console.log(res.statusCode);
      if (res.statusCode == 201) {
        // 请求成功,关闭新增弹窗，并重新加载区域列表
        this.closeAddArea();
        this.getAreas();
      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })
  },

  // ==========跳转到添加情景页面==========
  ToScence() {
    var areas = this.data.areas; // 要传递的数值
    wx.navigateTo({
      url: './scence/scence',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data: any) {
          console.log("data:!!!", data);
        }.bind(this), // 使用 bind(this) 绑定正确的上下文

        someEvent: function (data: any) {
          console.log(data)
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', areas)
      },

    });
  },

  // ==========跳转到增加窗帘页面部分==========
  ToCurtain(e: any) {
    let area = e.currentTarget.dataset.area;
    let data = {// 要传递的数值
      area: area,
      surveyId: this.data.caseSurvey.id,
    }
    wx.navigateTo({
      url: './curtain/curtain',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data: any) {
          let areaId = data.areaId;
          console.log("areaId::", areaId);
          this.toStretch(areaId);
        }.bind(this), // 使用 bind(this) 绑定正确的上下文

        someEvent: function (data: any) {
          console.log(data)
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', data)
      },
    });
  },

  // ==========添加底盒弹窗部分==========
  // 打开新增底盒，传递数据，初始化底盒
  async openAddNode(e: any) {
    const area = e.currentTarget.dataset.area;

    //赋值surveyId和areaId确定哪个区域添加底盒
    let addNode = this.data.addNode;
    addNode.surveyId = this.data.caseSurvey.id;
    addNode.areaId = area.id;
    addNode.newNodeData.surveyId = this.data.caseSurvey.id;
    addNode.newNodeData.areaId = area.id;
    addNode.exist = true;

    //获取该区域全部位点
    await Site.getAll(addNode.areaId).then((res: any) => {
      if (res.statusCode == 200) {
        addNode.allSites = res.data;
        // 请求成功的处理

      } else {
        // 请求失败的处理
      }

    }).catch((res: any) => { })

    const siteIndex = e.currentTarget.dataset.siteindex;
    console.log("siteIndex:::", siteIndex);

    //判断是从区域打开还是从位点打开，意味着是否可能创建位点和是否联排
    if (siteIndex != undefined) {//从位点打开
      //赋值位点
      addNode.newSiteData = addNode.allSites[siteIndex];
      addNode.newNodeData.siteId = addNode.allSites[siteIndex].id;
      //这里还需要赋值联排参数
      let node = e.currentTarget.dataset.node
      if (node.rawFrameSymbol != 0) {
        //原本就是联排
        addNode.newNodeData.rawFrameSymbol = node.rawFrameSymbol;
      } else {
        //加入新的联排
        await myNode.addNewRawFrameSymbol(node.id, node).then((res: any) => {
          console.log("新联排号：", res.statusCode);
          if (res.statusCode == 200) {
            node = res.data;
            addNode.newNodeData.rawFrameSymbol = node.rawFrameSymbol;
          } else {
            // 请求失败的处理
          }

        }).catch((res: any) => { })
      }

    }

    //创建底盒
    await myNode.add(addNode.newNodeData).then((res: any) => {
      console.log("res.statusCode:", res.statusCode);
      if (res.statusCode == 201) {
        addNode.newNodeData = res.data;
        console.log("创建完成返回：", res.data);

      } else {
        // 请求失败的处理
      }

    }).catch((res: any) => { })

    this.setData({
      addNode: addNode
    })

    console.log("弹出底盒时addNode：", this.data.addNode);

  },


  //关闭新增底盒底部弹窗
  async closeAddNode() {
    if (this.data.addNode.init == false) {
      //底盒未完成初始化，需要删除
      await myNode.deleteById(this.data.addNode.newNodeData.id).then((res: any) => {
        console.log("删除：res.statusCode:", res.statusCode);
        if (res.statusCode == 200) {
          console.log("已删除未初始化的底盒:", res.data);
        } else {
          // 请求失败的处理
        }

      }).catch((res: any) => { })
    }

    let addNode = {
      /*初始的默认数据 */
      caseClazz: ["插座", "开关", "面板"],

      /*打开底盒时需要填充的数据*/
      surveyId: -1,
      areaId: -1,
      exist: false,//新增Node界面是否显示
      allSites: [],//所在区域的全部位点
      init: false,//是否完成初始化（关闭底盒时是否需要删除新创建的底盒）

      /*打开添加开关时需要填充的数据 */
      switchExist: false,//新增app界面是否显示
      controlDevice: true,//新增app绑定的类型默认是智能器件
      TabCur: 1,//默认是开关页
      allSmartControls: [],//所在实例全部智能被控器件
      allSwitchs: [],//所在实例的开关

      /*在新增底盒时，选择位点后填充的数据*/
      //用于新增位点的数据
      newSiteData: {
        name: "",
        surveyId: -1,
        areaId: -1,
      },
      /*新增底盒过程中需要填写的数据 */
      //用于新增节点的数据
      newNodeData: {
        name: "默认名称",
        typeKey: "switch",
        powerType: 1,
        rawFrameSymbol: 0,
        surveyId: -1,
        areaId: -1,
        // siteId: undefined,
      },
    };

    let controlledApp = {
      name: "",
      typeKey: "smart_control",
      surveyId: -1,
      areaId: -1,
    };

    let newSwitchs = {
      newData: {
        name: "",
        typeKey: "switch",
        bindAppId: -1,
        nodeId: -1,
        surveyId: -1,
        areaId: -1,
      },
      newSwitchList: []
    };

    this.setData({
      addNode: addNode,
      controlledApp: controlledApp,
      newSwitchs: newSwitchs
    })

  },


  //选择或新增位点
  addNoderopdownChange(e: any) {
    const site = e.detail.object;
    console.log("site:", site);

    let addNode = this.data.addNode;
    addNode.newSiteData = site;
    this.setData({
      addNode: addNode,
    });
  },


  // 选择标签
  tabSelect(e: any) {
    let addNode = this.data.addNode;
    let newSwitchs = this.data.newSwitchs;
    const index = parseInt(e.currentTarget.dataset.index);
    if (index != addNode.TabCur) {
      addNode.TabCur = index;
      switch (index) {
        case 0:
          addNode.newNodeData.typeKey = "box.blank";
          break;
        case 1:
          addNode.newNodeData.typeKey = "box.switch";
          break;
        case 2:
          addNode.newNodeData.typeKey = "box.socket";
          break;
      };
      addNode.newNodeData.typeKey = "",
        //将准备新增的开关清空
        newSwitchs = {
          newData: {
            name: "",
            typeKey: "switch",
            bindAppId: -1,
            nodeId: -1,
            surveyId: -1,
            areaId: -1,
          },
          newSwitchList: []
        },
        this.setData({
          addNode: addNode,
          newSwitchs: newSwitchs,
        });
    }
  },


  // 单选事件处理
  radioChange(e: any) {
    const value = parseInt(e.detail.value); // 获取选择的值
    // 根据选中的值执行相应的逻辑
    let addNode = this.data.addNode;
    addNode.newNodeData.powerType = value

    this.setData({
      addNode: addNode
    })

  },
  // 插座单选
  socketChange(e: any) {
    const value = e.detail.value; // 获取选择的值

    let addNode = this.data.addNode;
    let newSwitchs = this.data.newSwitchs;
    newSwitchs.newSwitchList = [
      {
        name: this.data.socketList[value],
        typeKey: "smart_control",
        bindAppId: 0,
        nodeId: 0,
        surveyId: addNode.surveyId,
        areaId: addNode.areaId,
      }
    ];
    this.setData({
      addNode: addNode,
      newSwitchs: newSwitchs
    })
    console.log("插座:", this.data.newSwitchs);
  },
  //空面板单选
  nullChange(e: any) {
    const value = e.detail.value; // 获取选择的值
    let addNode = this.data.addNode;
    let newSwitchs = this.data.newSwitchs;
    newSwitchs.newSwitchList = [
      {
        name: this.data.nullList[value],
        typeKey: "smart_control",
        bindAppId: 0,
        nodeId: 0,
        surveyId: addNode.surveyId,
        areaId: addNode.areaId,
      }
    ];
    this.setData({
      addNode: addNode,
      newSwitchs: newSwitchs
    })
    console.log("空面板:", this.data.newSwitchs);
  },
  //新增开关
  async addUunit() {
    let addNode = this.data.addNode;
    addNode.switchExist = true;
    //获取开关列表
    await MyApp.getAll(addNode.surveyId).then((res: any) => {
      if (res.statusCode == 200) {
        // 请求成功的处理
        addNode.allSwitchs = res.data
      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })

    this.setData({
      addNode: addNode
    });
    this.getAreaSmartControl(this.data.areas.find((item) => item.id === addNode
      .areaId))
  },

  //关闭新增开关弹窗
  claseAddSwitch() {
    let addNode = this.data.addNode;
    addNode.switchExist = false;
    //绑定的器件清空
    let controlledApp = {
      name: "",
      typeKey: "smart_control",
      surveyId: -1,
      areaId: -1,
    };
    this.upDateDropdowninput(controlledApp);
    let newSwitchs = this.data.newSwitchs;
    newSwitchs.newData = {
      name: "",
      typeKey: "switch",
      bindAppId: -1,
      nodeId: -1,
      surveyId: -1,
      areaId: -1,
    };
    this.setData({
      newSwitchs: newSwitchs,
      addNode: addNode,
      controlledApp: controlledApp
    });
  },
  //多控选择控制器件还是开关
  deviceAndeswitch(e: any) {
    let addNode = this.data.addNode;
    addNode.controlDevice = e.detail.value;
    let controlledApp = {
      name: "",
      typeKey: "smart_control",
      surveyId: -1,
      areaId: -1,
    };
    let newSwitchs = this.data.newSwitchs;
    newSwitchs.newData = {
      name: "",
      typeKey: "switch",
      bindAppId: -1,
      nodeId: -1,
      surveyId: -1,
      areaId: -1,
    };
    this.setData({
      addNode: addNode,
      controlledApp: controlledApp,
      newSwitchs: newSwitchs,
    })
  },
  //新增开关的控制器件输入新增框
  addDeviceropdownChange(e: any) {
    const smartControlName = e.detail.value;
    let controlledApp = this.data.controlledApp;
    controlledApp.name = smartControlName;
    controlledApp.surveyId = this.data.addNode.surveyId;
    controlledApp.areaId = this.data.addNode.areaId;
    this.setData({
      controlledApp: controlledApp,
    });
  },

  //被控器件，第一层级选择，获取第二层数据集
  wxml_getAreaSmartControl(e: any) {
    const { option1 } = e.detail;
    this.getAreaSmartControl(option1);

  },
  getAreaSmartControl(option1: any) {
    console.log("option1:", option1);
    let aID = option1.id
    MyApp.findByAreaAndsmartControl(aID).then((res: any) => {
      console.log("res.statusCode:", res.statusCode);
      if (res.statusCode == 200) {
        //请求成功,初始化区域的智能被控列表
        let addNode = this.data.addNode;
        addNode.allSmartControls = res.data;
        this.setData({
          addNode: addNode,
        })
        console.log("区域的智能被控列表：", this.data.areas);

      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })
  },
  //被控器件，第二层级选择，获取或创建被控器件
  smartControlchange(e: any) {
    const { alloption } = e.detail;
    console.log("alloption:", alloption);
    //判断是否创建新的控制器件
    let controlledApp;
    if (alloption.option2.id == undefined) {
      //需要创建，先备注好信息
      controlledApp = {
        name: alloption.option2.name,
        typeKey: "smart_control",
        bindAppId: 0,
        bindSceneId: 0,
        // nodeId=,
        surveyId: this.data.addNode.surveyId,
        areaId: alloption.option1.id,
      };
    } else {
      //不需要创建
      controlledApp = alloption.option2;
    }
    this.setData({
      controlledApp: controlledApp
    })

  },
  // 新增开关的绑定开关单选框
  addSwitchChange(e: any) {
    let switchIndex = e.detail.value;
    let controlledApp = this.data.addNode.allSwitchs[switchIndex];
    console.log("controlledApp", controlledApp);
    this.setData({
      controlledApp: controlledApp,
    });
  },
  //新增开关的丝印输入框
  addAppInput(e: any) {
    let newSwitchs = this.data.newSwitchs;
    newSwitchs.newData.name = e.detail.value;
    this.setData({
      newSwitchs: newSwitchs,
    });
  },

  //确认新增开关
  async confirmAddapp() {
    let controlledApp = this.data.controlledApp;
    //判断是否需要创建新的被控器件
    if (controlledApp.id == undefined) {
      //避免新创建被控组件为空
      if (controlledApp.name.trim() == "") {
        MyUtil.hint("被控/开关 不能为空");
        return;
      }
      //需要创建新的被控器件
      await MyApp.add(controlledApp).then((res: any) => {
        if (res.statusCode == 201) {
          // 请求成功的处理
          controlledApp = res.data;
        } else {
          // 请求失败的处理
        }
      }).catch((res: any) => { })
    }

    //将新开关添加到待创建的开关列表中
    let newSwitchs = this.data.newSwitchs;
    if (newSwitchs.newData.name == "") {
      //默认名称是被控器件的名称
      newSwitchs.newData.name = controlledApp.name;
    }
    newSwitchs.newData.bindAppId = controlledApp.id;
    newSwitchs.newData.areaId = this.data.addNode.areaId;
    newSwitchs.newData.nodeId = this.data.addNode.newNodeData.id;
    newSwitchs.newData.surveyId = this.data.addNode.surveyId;

    console.log("newSwitchs.newData:", newSwitchs.newData);


    newSwitchs.newSwitchList.push(newSwitchs.newData);
    this.setData({
      newSwitchs: newSwitchs,
    })
    this.claseAddSwitch();
    this.upDateSubBox(newSwitchs.newSwitchList);
  },

  //确认添加底盒
  async confirmAddNode() {
    let addNode = this.data.addNode;

    if (this.data.newSwitchs.newSwitchList.length == 0) {
      MyUtil.hint("未添加开关");
      return;
    }

    //判断是否需要新增位点
    if (addNode.newSiteData.id == undefined) {
      if (addNode.newSiteData.name.trim() == "") {
        MyUtil.hint("位置 不能为空");
        return;
      }

      addNode.newSiteData.areaId = addNode.areaId;
      addNode.newSiteData.surveyId = addNode.surveyId;
      //新增位点
      await Site.add(addNode.newSiteData).then((res: any) => {
        if (res.statusCode == 201) {
          // 请求成功的处理
          addNode.newSiteData = res.data;
        } else {
          // 请求失败的处理
        }
      }).catch((res: any) => { })
    }
    //将位点id填入Node中，准备初始化
    addNode.newNodeData.siteId = addNode.newSiteData.id;

    //判断底盒类型
    if (addNode.TabCur == 0) {
      //插座
      addNode.newNodeData.typeKey = "box.socket"
      addNode.newNodeData.name = this.data.newSwitchs.newSwitchList[0].name;
    } else if (addNode.TabCur == 2) {
      //空面板
      addNode.newNodeData.typeKey = "box.blank"
      addNode.newNodeData.name = this.data.newSwitchs.newSwitchList[0].name;
    }
    //初始化底盒
    await myNode.updata(addNode.newNodeData.id, addNode.newNodeData).then((res: any) => {
      console.log("初始化res.statusCode：", res.statusCode);
      if (res.statusCode == 200) {
        // 请求成功的处理
        addNode.newNodeData = res.data;
        //完成初始化
        addNode.init = true;
        console.log("初始化成功");
      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })

    //批量创建switch类型的app，并将app和node关联
    await MyApp.createApps(this.data.newSwitchs.newSwitchList).then((res: any) => {
      console.log("批量添加开关res.statusCode：", res.statusCode);
      if (res.statusCode == 201) {
        // 请求成功的处理
        console.log("添加成功");
      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })

    this.setData({
      addNode: addNode
    })
    //关闭添加底盒弹框，清除缓存
    this.closeAddNode();
    //展开添加底盒的区域
    this.toStretch(addNode.areaId);
    console.log("展开区域：", addNode.areaId, "状态:", this.data.unfoldArea.areaId);
  },




  /*一些供调用的方法*/
  //通知自定义底盒更新数据
  upDateSubBox(subabaoxdata: object) {
    const component = this.selectComponent(".subbox");
    if (component) {
      component.updataBoxData(subabaoxdata);
    }
  },
  //通知自定义二级选填组件更新二级选填
  upDateDropdowninput(option2: object) {
    const component = this.selectComponent(".layerSelect");
    if (component) {
      component.setoption2(option2);
    }
  },

  //通过勘察实例获取区域列表
  getAreas() {
    console.log("getAreas survey:");
    console.log(this.data.caseSurvey);

    const sid = parseInt(this.data.caseSurvey.id);
    Area.getAll(sid).then((res: any) => {
      console.log("res.statusCode:", res.statusCode);
      if (res.statusCode == 200) {
        //请求成功，重新初始化区域列表、编辑区域表单
        let addArea = this.data.addArea;
        addArea.data.surveyId = sid,
          this.setData({
            areas: res.data,
            addArea: addArea,
          })
        console.log("区域：", this.data.areas);

      } else {
        // 请求失败的处理
      }
    }).catch((res: any) => { })
  },


  /**
    * 生命周期函数--监听页面加载
    */
  onLoad() {
    //进入页面，接收前页面的参数
    let caseSurvey;
    const eventChannel = this.getOpenerEventChannel();
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    if (eventChannel) {
      eventChannel.on('OpencaseSurvey', (data) => {
        console.log("收到数据：", data);
        caseSurvey = data;

        this.setData({
          caseSurvey: caseSurvey,
        });

        //通过勘察实例获取区域信息
        this.getAreas();
      })

    }
  }

});
