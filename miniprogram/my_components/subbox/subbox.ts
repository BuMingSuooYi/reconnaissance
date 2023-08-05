Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    boxDada: {
      type: Array,
      value: [
        // {
        //   "id": 2,
        //   "name": "房间灯开关",
        //   "typeKey": "switch",
        //   "bindAppId": 1,
        //   "bindSceneId": 0,
        //   "nodeId": 1,
        //   "areaId": 2,
        //   "surveyId": 21
        // }
      ],
    },
    //用于指定自定义组件的模式：0展示，1编辑，2删除
    pattern: {
      type: Number,
      value: 0,
    },
  },
  data: {
    // 这里是一些组件内部数据
    //用于指定底盒的样式，目前值定为开关的数量
    typeNum: Number,
    shakeClass: "",
  },
  methods: {
    //更新组件数据
    updataBoxData(boxDada: Object) {
      this.setData({
        typeNum: boxDada.length,
        boxDada: boxDada,
      })
      console.log("收到了通知,更新了数据");
    },
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
    //供绑定的点击事件
    click() {
      //在展示模式时点击事件才有效，主要提供编辑的绑定
      if (this, this.data.pattern == 0) {
        let boxData = this.data.boxDada;
        console.log("触发底盒点击事件,可用click绑定事件");
        this.triggerEvent('click', { value: boxData });
      }
    },
    //长按事件,出现或消失删除角标
    longPress() {
      if (this.data.pattern == 2) {
        this.changePattern(0);
        console.log("消失删除角标");
      }
      else {
        this.changePattern(2);
        console.log("出现删除角标");
      }
      //抖动动画
      this.setData({
        shakeClass: ""
      });
      this.setData({
        shakeClass: "shakeClass"
      });
    },
    //供绑定的删除角标点击事件
    delete() {
      console.log("触发底盒点击事件,可用delete绑定事件");

    }
  },


  lifetimes: {
    attached: function () {
      // data数据初始化
      let num = this.data.boxDada.length;

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