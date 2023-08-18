Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    boxDada: {
      type: Object,
      value: {
        name: "",
        // apps:{
        //   "id": 2,
        //   "name": "房间灯开关",
        //   "typeKey": "switch",
        //   "bindAppId": 1,
        //   "bindSceneId": 0,
        //   "nodeId": 1,
        //   "areaId": 2,
        //   "surveyId": 21
        // }
        apps: [],

      }
    },
    //用于指定自定义组件的模式：0展示，1编辑，2删除
    pattern: {
      type: Number,
      value: 0,
    },
  },
  observers: {
    //监控取电方式属性
    'boxDada.powerType': function (powerType: number) {
      let mark = this.data.mark;

      //发生变化时，该函数会被调用
      switch (powerType) {
        case 1:
          mark = "零"; break;
        case 2:
          mark = "单"; break;
        case 3:
          mark = "电"; break;
      }

      this.setData({
        mark: mark,
      })
    }
    ,//监控取电方式属性
    'boxDada.apps': function (apps: Array<object>) {
      let typeNum = this.data.typeNum;
      //发生变化时，该函数会被调用
      if (typeNum != apps.length) {
        typeNum = apps.length;
        this.setData({
          typeNum: typeNum,
        })
      }
    }
  },
  data: {
    // 这里是一些组件内部数据
    //用于指定底盒的样式，目前值定为开关的数量
    typeNum: 0,
    shakeClass: "",
    mark: "",
  },
  methods: {
    // //更新组件数据
    // updataBoxData() {
    //   console.log("测试",this.data.boxDada);
    //   this.setData({
    //     typeNum: this.data.boxDada.apps.length,
    //   })
    //   console.log("收到了通知,更新了数据,",this.data.typeNum);
    // },
    //改变组件状态
    changePattern(pattern: Number) {
      switch (this.data.pattern) {
        case 0:
          this.setData({
            pattern: pattern
          });
          break
        case 1:
          this.setData({
            pattern: pattern
          });
          break
        case 2:
          this.setData({
            shakeClass: "",
            pattern: pattern
          });
          break;
      }
    },
    // app按键的绑定事件
    appclick(e: any) {
      console.log("模式：", this.data.pattern);
      //在编辑模式时点击事件才有效，主要提供编辑app
      if (this, this.data.pattern == 1) {
        console.log("app数据", e.target.dataset.item);
        this.triggerEvent('appclick', { value: e.target.dataset.item });
      }
    },

    //供绑定的点击事件
    click() {
      //在展示模式时点击事件才有效，主要提供编辑的绑定
      if (this, this.data.pattern == 0) {
        let boxData = this.data.boxDada;
        console.log("点击事件触发");
        this.triggerEvent('click', { value: boxData });
      }
    },
    //长按事件,出现或消失删除角标
    longPress() {
      if (this.data.pattern == 2 && this.data.pattern != 1) {
        this.changePattern(0);
        console.log("消失删除角标");
        //抖动动画
        this.setData({
          shakeClass: ""
        });
        this.setData({
          shakeClass: "shakeClass"
        });
      }
      else if (this.data.pattern == 0 && this.data.pattern != 1) {
        this.changePattern(2);
        console.log("出现删除角标");
        //抖动动画
        this.setData({
          shakeClass: ""
        });
        this.setData({
          shakeClass: "shakeClass"
        });
      }
    },
    //供绑定的删除角标点击事件
    delete() {
      let boxData = this.data.boxDada;
      console.log("触发底盒点击事件,可用delete绑定事件");
      this.triggerEvent('delete', { value: boxData });
    }
  },


  lifetimes: {
    attached: function () {
      // data数据初始化
      let num = this.data.boxDada.apps.length;

      this.setData({
        typeNum: num,
      })
      console.log("typeNum:", this.data.typeNum);
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行

    },
  },
})