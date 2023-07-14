Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    boxDada: {
      type: Object,
      value: {
        id: 1,
        way: "1",
        unit: [],
      },
    }
  },
  data: {
    // 这里是一些组件内部数据
    typeNum: Number,

  },
  methods: {
    //更新组件数据
    updataBoxData(boxDada: Object) {  
      this.setData({
        typeNum: boxDada.unit.length,
      boxDada: boxDada,
      })
      console.log("收到了通知,更新了数据");
      
    }

  },
  lifetimes: {
    attached: function () {
      // data数据初始化
      let num = this.data.boxDada.unit.length;

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