// index.ts
// 获取应用实例
const app = getApp<IAppOption>();

Page({
    data: {
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
                ]
            },
            placeList: [],//位点列表，打开新增底盒时赋值
            exist: false,
            caseClazz: ["插座", "开关", "空面板"],
            fromplace: {
                name: "",
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
            name: "",
            device: "",
        },
        //控制器件列表
        deviceList: [
            "玄关射灯", "客厅主灯", "客厅条灯1", "客厅条灯2", "餐厅灯主灯", "餐厅小灯", "厕所灯", "卧室主灯", "卧室次灯", "小度开关", "电视",
        ],
        //区域列表所用数据
        roomList: [
            {
                name: "玄关",
                unfold: false,
                place: [],
            },
            {
                name: "卫生间",
                unfold: false,
                place: [
                    // 位点列表
                    {
                        name: "靠门",
                        case: [
                            // 盒子列表
                            {
                                id: 1,
                                way: "1",
                                unit: [
                                    // 开关列表
                                    {
                                        name: "照明开关",
                                    },
                                    {
                                        name: "照明开关",
                                    },
                                    {
                                        name: "照明开关",
                                    },
                                    {
                                        name: "照明开关",
                                    },
                                ],
                            },
                            {
                                id: 2,
                                way: "2",
                                unit: [
                                    {
                                        name: "热水器开关",
                                    },
                                    {
                                        name: "镜灯开关",
                                    },
                                    {
                                        name: "情景开关",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name: "房间",
                unfold: false,
                place: [
                    // 位点列表
                    {
                        name: "靠门床头",
                        case: [
                            // 盒子列表
                            {
                                id: 1,
                                way: "1",
                                unit: [
                                    // 开关列表
                                    {
                                        name: "零火开关",

                                    },
                                    {
                                        name: "零火开关",
                                    },
                                    {
                                        name: "零火开关",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: "靠窗床头",
                        case: [
                            // 盒子列表
                            {
                                id: 1,
                                way: "3",
                                unit: [
                                    // 开关列表
                                    {
                                        name: "夜灯开关",
                                    },
                                    {
                                        name: "电视开关",
                                    },
                                    {
                                        name: "睡眠情景开关",
                                    },
                                ],
                            },
                        ],
                    },
                ],
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
    //跳转到添加情景页面
    ToScence() {
        var deviceList = this.data.deviceList; // 要传递的数值
        wx.navigateTo({
            url: './scence/scence',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                acceptDataFromOpenedPage: function (data: any) {
                    console.log(data)
                },
                someEvent: function (data: any) {
                    console.log(data)
                },
            },
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', deviceList)
            }
        });
    },

    // ==========添加底盒弹窗部分==========
    // 打开新增底盒，传递数据
    openAddCase(e: any) {
        const { room } = e.currentTarget.dataset;
        const add = this.data.addCase;
        const placeList = room.place.map((pla: { name: string }) => pla.name);
        add.exist = true;
        add.room = room;
        add.placeList = placeList;
        this.setData({
            addCase: add,
        });
    },

    // 选择标签
    tabSelect(e: any) {
        const { id } = e.currentTarget.dataset;
        const add = this.data.addCase;
        add.TabCur = id;
        this.setData({
            addCase: add,
        });
    },
    //关闭新增底盒底部弹窗
    closeAddCase() {
        console.log(this.data.addCase);
        let add = this.data.addCase;
        add.exist = false;
        add.room = {
            name: "",
            unfold: false,
            place: [
            ]
        };
        add.placeList = [];
        add.TabCur = 1;
        add.fromplace.name = "";
        add.fromplace.case = {
            id: -1,
            way: 1,
            unit: [
            ]
        };
        this.setData({
            addCase: { ...add }
        });
        console.log(this.data.addCase);

    },
    //选择或新增位点
    addCaseropdownChange(e: any) {
        const placeName = e.detail.value;
        let add = this.data.addCase;
        add.fromplace.name = placeName
        this.setData({
            addCase: add,
        });
        console.log("位点：",this.data.addCase.fromplace.name);
        
    },

    // 单选事件处理
    radioChange(e: any) {
        const value = e.detail.value; // 获取选择的值
        // 根据选中的值执行相应的逻辑
        let add = this.data.addCase;
        if (value == 1) {
            add.fromplace.case.way = 1
        } else if (value == 2) {
            add.fromplace.case.way = 2
        } else if (value == 3) {
            add.fromplace.case.way = 3
        }
        this.setData({
            addCase: add
        })
        console.log("改变了选中的值",this.data.addCase.fromplace.case.way);
        
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
        add.device="";
        this.setData({
            addUnit: add,
        });
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
    //新增开关的开关名称输入框
    addUnitInput(e: any) {
        const add = this.data.addUnit;
        add.name = e.detail.value;
        this.setData({
            addUnit: add,
        });
    },
    //确认新增开关
    confirmAddUunit(e: any) {
        let add = this.data.addUnit;
        add.exist = false;
        // 遍历位点列表
        let deviceList = this.data.deviceList;
        let found = false;

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

        //加入开关
        let add2 = this.data.addCase;
        let unit = {
            name: add.name,
            device: add.device
        };
        (add2.fromplace.case.unit as string[]).push(unit);
        this.setData({
            addUnit: add,
            deviceList:deviceList,
            addCase: add2,
        });

    },
    confirmAddCase() {
        let from = this.data.addCase.fromplace;
        // 遍历位点列表
        let place = this.data.addCase.room.place;
        let found = false;

        for (let i = 0; i < place.length; i++) {
            if (place[i].name === from.name) {
                // 在相同名称的位点下添加开关
                let caes1 = {
                    id: place[i].case.length + 1,
                    way: from.case.way,
                    unit: from.case.unit
                };
                place[i].case.push(caes1);
                found = true;
            }
        }
        // 不同名称的位点下创建位点
        if (!found) {
            const newPlace = {
                name: from.name,
                case: [
                ]
            };
            newPlace.case.push(from.case);
            place.push(newPlace);
        }

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
        console.log(this.data.roomList);

    }

});
