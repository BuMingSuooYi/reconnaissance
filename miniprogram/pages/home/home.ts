// index.ts
// 获取应用实例
const app = getApp<IAppOption>();

Page({
  data: {
    //实例
    caseSurvey:{},
    //新增区域所用数据
    addRoom: {
      exist: false,
      name: "",
    },
    //新增底盒所用数据
    addCase: {
      TabCur: 1, // 默认是开关页
      room: {
        name: "",
        unfold: false,
        place: [

        ],
      },
      placeList: [],//位点列表，打开新增底盒时赋值
      exist: false,
      caseClazz: ["插座", "开关", "空面板"],
      fromplace: {
        name: "",
        conneceIndex: -1,
        socket: 0,
        case: {
          id: 1,
          way: 1,
          unit: [
          ]
        }
      },
    },
    //新增开关所用数据
    addUnit: {
      exist: false,
      controlDevice: true,
      name: "",
      device: "",
    },
    //控制器件列表
    deviceList: [
      "玄关射灯", "客厅主灯", "客厅条灯1", "客厅条灯2", "餐厅灯主灯", "餐厅小灯", "厕所灯", "卧室主灯", "卧室次灯", "小度开关", "电视",
    ],
    //开关列表列表

    switchList: [

    ],
    //插座类型列表
    socketList: [
      "16A空调插座", "网络插座", "五孔插座", "一开五孔插座", "电话插座", "五孔多功能插座", "电话网络插座", "双电话插座", "智能五孔插座",
    ],
    nullList: [
      "空面板",
    ],
    //区域列表所用数据
    roomList: [
      {
        name: "玄关",
        unfold: false,
        place: [],
        connect: [
        ]
      },
      {
        name: "卫生间",
        unfold: false,
        place: [
          // 位点列表
          {
            name: "靠门",
            connect: [
              {
                case: [
                  // 盒子列表
                  {
                    id: 1,
                    way: "1",
                    unit: [
                      // 开关列表
                      {
                        name: "照明1",
                      },
                      {
                        name: "照明2",
                      },
                      {
                        name: "照明3",
                      },
                      {
                        name: "照明4",
                      },
                    ],
                  },
                  {
                    id: 2,
                    way: "2",
                    unit: [
                      {
                        name: "热水器",
                      },
                      {
                        name: "镜灯",
                      },
                      {
                        name: "情景",
                      },
                    ],
                  },
                ],

              },
              {
                case: [
                  // 盒子列表
                  {
                    id: 1,
                    way: "1",
                    unit: [
                      {
                        name: "开关5",
                      },
                      {
                        name: "开关6",
                      },
                    ],
                  },
                ],
              }
            ],
            curtain: [
            ],
          },
        ],
        curtain: [],

      },
      {
        name: "房间",
        unfold: false,
        place: [
          // 位点列表
          {
            name: "靠门床头",
            connect: [
              {
                case: [
                  // 盒子列表
                  {
                    id: 1,
                    way: "1",
                    unit: [
                      // 开关列表
                      {
                        name: "零火",

                      },
                      {
                        name: "零火",
                      },
                      {
                        name: "零火",
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: "靠窗床头",
            connect: [
              {
                case: [
                  // 盒子列表
                  {
                    id: 1,
                    way: "3",
                    unit: [
                      // 开关列表
                      {
                        name: "夜灯",
                      },
                      {
                        name: "电视",
                      },
                      {
                        name: "睡眠情景",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        curtain: [],
      },
    ],
  },

  // 区域列表的伸缩
  toStretch(e: any) {
    const index = e.currentTarget.dataset.index;
    const list = this.data.roomList;
    const unfold = list[index].unfold;
    list[index].unfold = !unfold;
    this.setData({
      roomList: list,
    });
  },

  // ==========添加区域弹窗部分==========
  closeAddRoom() {
    // 关闭模态框
    const add = this.data.addRoom;
    add.exist = false;
    add.name = "";
    this.setData({
      addRoom: add,
    });
  },

  openAddRoom() {
    // 打开模态框
    const add = this.data.addRoom;
    add.exist = true;
    this.setData({
      addRoom: add,
    });
  },

  addRoomInput(e: any) {
    // 更新输入框的值
    const add = this.data.addRoom;
    add.name = e.detail.value;
    this.setData({
      addRoom: add,
    });
  },

  confirmAddRoom() {
    // 添加一个新的区域
    if (this.data.addRoom.name !== "") {
      const newRoom = {
        name: this.data.addRoom.name,
        unfold: false,
        place: [],
        curtain: []
      };
      const updatedRoomList = [...this.data.roomList, newRoom];
      const add = this.data.addRoom;
      add.exist = false;
      add.name = "";
      this.setData({
        roomList: updatedRoomList,
        addRoom: add,
      });
    } else {
      // 提示填写添加区域名称
    }
  },

  // ==========跳转到添加情景页面==========
  ToScence() {
    var deviceList = this.data.deviceList; // 要传递的数值
    wx.navigateTo({
      url: './scence/scence',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data: any) {
          let deviceList = this.data.deviceList;
          for (let i = 0; i < data.data.length; i++) {
            deviceList.push(data.data[i].name)
          };
          this.setData({
            deviceList: deviceList
          })

        }.bind(this), // 使用 bind(this) 绑定正确的上下文

        someEvent: function (data: any) {
          console.log(data)
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', deviceList)
      },

    });
  },

  // ==========跳转到增加窗帘页面部分==========
  ToCurtain(e: any) {
    let room = e.currentTarget.dataset.room; // 要传递的数值
    wx.navigateTo({
      url: './curtain/curtain',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data: any) {
          let room = data.data;
          console.log("data:", data.data);

          let roomList = this.data.roomList;
          const index = roomList.findIndex(obj => obj.name === room.name);
          if (index !== -1) {
            roomList.splice(index, 1, room);
          }
          this.setData({
            roomList: roomList
          });
          console.log(this.data.roomList);
        }.bind(this), // 使用 bind(this) 绑定正确的上下文

        someEvent: function (data: any) {
          console.log(data)
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', room)
      },

    });
  },

  // ==========添加底盒弹窗部分==========
  // 打开新增底盒，传递数据
  openAddCase(e: any) {
    const room = e.currentTarget.dataset.room;
    const add = this.data.addCase;

    const placeList = room.place.map((pla: { name: string }) => pla.name);

    add.exist = true;
    add.room = room;
    add.placeList = placeList;

    const placeIndex = e.currentTarget.dataset.placeindex;
    const connectIndex = e.currentTarget.dataset.connectindex;
    //判断是从位点处打开新增底盒还是从房间处打开底盒
    console.log("connectIndex:", connectIndex);
    if (placeIndex != undefined && connectIndex != undefined) {
      add.fromplace.name = add.placeList[placeIndex];
      add.fromplace.conneceIndex = connectIndex;
    };

    console.log("fromplace.conneceIndex:", this.data.addCase.fromplace.conneceIndex);


    this.setData({
      addCase: add,
    });
  },

  // 选择标签
  tabSelect(e: any) {
    const { id } = e.currentTarget.dataset;
    const add = this.data.addCase;
    if (id != add.TabCur) {
      add.TabCur = id;
      add.fromplace.case.unit = [];
      this.setData({
        addCase: add,
      });
    }
  },
  //关闭新增底盒底部弹窗
  closeAddCase() {
    let addCase = {
      TabCur: 1, // 默认是开关页
      room: {
        name: "",
        unfold: false,
        place: [

        ],
      },
      placeList: [],//位点列表，打开新增底盒时赋值
      exist: false,
      caseClazz: ["插座", "开关", "空面板"],
      fromplace: {
        name: "",
        conneceIndex: -1,
        socket: 0,
        case: {
          id: 1,
          way: 1,
          unit: [
          ]
        }
      },
    };
    this.setData({
      addCase: addCase

    });
    console.log("关闭新增底盒", this.data.addCase.fromplace.conneceIndex);

  },
  //选择或新增位点
  addCaseropdownChange(e: any) {
    const placeName = e.detail.value;
    let add = this.data.addCase;
    add.fromplace.name = placeName
    this.setData({
      addCase: add,
    });
  },

  // 单选事件处理
  radioChange(e: any) {
    const value = e.detail.value; // 获取选择的值
    // 根据选中的值执行相应的逻辑
    let add = this.data.addCase;
    add.fromplace.case.way = value

    this.setData({
      addCase: add
    })

  },
  //插座单选
  socketChange(e: any) {
    const value = e.detail.value; // 获取选择的值
    let add = this.data.addCase;
    let unit = [
      {
        name: this.data.socketList[value]
      }
    ];
    add.fromplace.socket = value;
    add.fromplace.case.unit = unit;
    this.setData({
      addCase: add
    })
    console.log("插座:", this.data.addCase.fromplace);
  },
  //空面板单选
  nullChange(e: any) {
    const value = e.detail.value; // 获取选择的值
    let add = this.data.addCase;
    let unit = [
      {
        name: this.data.nullList[value]
      }
    ];
    add.fromplace.socket = value;
    add.fromplace.case.unit = unit;
    this.setData({
      addCase: add
    })
    console.log("空面板:", this.data.addCase.fromplace);
  },
  //新增开关
  addUunit() {
    let add = this.data.addUnit;
    add.exist = true;
    add.name = "";
    this.setData({
      addUnit: add,
    });
  },
  //关闭新增开关弹窗
  claseAddUunit() {
    let add = this.data.addUnit;
    add.exist = false;
    add.name = "";
    add.device = "";
    this.setData({
      addUnit: add,
    });
  },
  //多控选择控制器件还是开关
  deviceAndeswitch(e: any) {
    let add = this.data.addUnit;
    add.controlDevice = e.detail.value;
    add.device = "";
    this.setData({
      addUnit: add,
    })
    console.log(add.controlDevice);

  },
  //新增开关的控制器件输入新增框
  addDeviceropdownChange(e: any) {
    const device = e.detail.value;
    let add = this.data.addUnit;
    add.device = device
    this.setData({
      addUnit: add,
    });
  },
  // 新增开关的绑定开关单选框
  addSwitchChange(e: any) {
    const device = e.detail.value;
    let add = this.data.addUnit;
    add.device = this.data.switchList[device];
    this.setData({
      addUnit: add,
    });
  },
  //新增开关的丝印输入框
  addUnitInput(e: any) {
    const add = this.data.addUnit;
    add.name = e.detail.value;
    this.setData({
      addUnit: add,
    });
  },
  //确认新增开关
  confirmAddUunit() {
    let add = this.data.addUnit;
    add.exist = false;
    // 遍历位点列表
    let deviceList = this.data.deviceList;
    let found = false;

    if (add.controlDevice == true) {
      for (let i = 0; i < deviceList.length; i++) {
        if (deviceList[i] === add.device) {
          // 已经存在的被控器件，不做处理
          found = true;
        }
      }
      // 不存在的被控器件，则将器件加入器件列表
      if (!found) {
        deviceList.push(add.device);
      }
    } else if (add.device == "*待定*") {
      add.name = add.name + "*";
    }

    //是否输入丝印，未输入则默认用器件名称
    if (add.name == "") {
      add.name = add.device
    }

    //加入开关
    let add2 = this.data.addCase;
    let unit = {
      name: add.name,
      device: add.device
    };
    (add2.fromplace.case.unit as string[]).push(unit);
    this.setData({
      addUnit: add,
      deviceList: deviceList,
      addCase: add2,
    });
    this.claseAddUunit();
    this.upDateSubBox(add2.fromplace.case);
  },
  //确认添加底盒
  confirmAddCase() {
    let from = this.data.addCase.fromplace;

    // 遍历位点列表
    let place = this.data.addCase.room.place;
    let found = false;


    for (let i = 0; i < place.length; i++) {
      if (place[i].name === from.name) {
        console.log("place[i].name:", place[i].name);
        // 在相同名称的位点下添加开关
        let connect;
        //判断是添加联排的底盒还是创建联排并创建底盒
        if (from.conneceIndex == -1) {
          // 创建联排并创建底盒
          connect = [
            {
              case: [
                {
                  id: 1,
                  way: from.case.way,
                  unit: from.case.unit
                }
              ]
            }
          ];
          place[i].connect = connect;
        } else {
          // 添加联排的底盒
          let case1 = {
            id: place[i].connect[from.conneceIndex].length + 1,
            way: from.case.way,
            unit: from.case.unit
          };
          place[i].connect[from.conneceIndex].case.push(case1);
        }
        found = true;
      }
    }
    // 不同名称的位点下创建位点
    if (!found) {
      const newPlace = {
        name: from.name,
        connect: [
          {
            case: [
              {
                id: 1,
                way: from.case.way,
                unit: from.case.unit
              }
            ]
          }
        ],
      };
      place.push(newPlace);
    }

    console.log("place:", place);


    //将roomList中的room替换为新的
    let room = this.data.addCase.room;
    room.place = place;
    room.unfold = true;
    let roomList = this.data.roomList;
    const index = roomList.findIndex(obj => obj.name === room.name);
    if (index !== -1) {
      roomList.splice(index, 1, room);
    }
    this.setData({
      roomList: roomList
    });
    this.closeAddCase();
    console.log("room:", room);
  },

  /*一些供调用的方法*/
  //通知自定义底盒更新数据
  upDateSubBox(subabaoxdata: object) {
    const component = this.selectComponent(".subbox");
    if (component) {
      component.updataBoxData(subabaoxdata);
    }
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
      eventChannel.on('OpencaseSurvey', function (data) {
        console.log("收到数据：",data);
        caseSurvey=data;
      })
    }
    this.setData({
      caseSurvey:caseSurvey,
    });

    //写入开关列表数据
    const roomList = this.data.roomList;
    const switchList = [];
    switchList.push("*待定*")
    roomList.forEach((room) => {
      room.place.forEach((place) => {
        place.connect.forEach((connection) => {
          connection.case.forEach((box) => {
            box.unit.forEach((unit) => {
              switchList.push(unit.name);
            });
          });
        });
      });
    });

    // console.log("开关列表:", switchList);
    this.setData({
      switchList: switchList,
    })
  }

});
