Component({
  properties: {
    title:{
      type:String,
      value:"标题："
    },
    dataSet1: {
      type: Array,
      value: [],
    },
    dataSet2: {
      type: Array,
      value: [],
    },
    hint: {
      type: String,
      value: "",
    },
    option1:{
      type: Object,
      value: {},
    },
    option2:{
      type: Object,
      value: {},
    },
    // 定义自定义事件,确定一级选项
    conf1: {
      type: Object, // 类型可以根据实际需求指定
    },
    // 定义自定义事件,确定二级选项
    conf2: {
      type: Object, // 类型可以根据实际需求指定
    },
  },

  data: {
    // option1:{},
    // option2:{}
  },
  methods: {
    //页面使用的事件：通知组件，清除一级选项缓存（应该不需要）

    //页面使用的事件2：通知组件，调用子组件事件，设置二级选项(用来清除选项缓存)
    setoption2(option2:any){
      this.setData({
        option2:option2
      })
    },
    //确定一级选项后，发送一级选项，以便确定二级数据集
    onDropdownSelect(e: any) {      
      const { option1 } = e.detail;
      this.setData({
        option1:option1,
        option2:{}
      })      
      //发送数据集，用于获取设置二级数据集
      this.triggerEvent('conf1', { option1: this.data.option1 });
    },
    
    //确定二级选项
    onDropdowninputChange(e:any){
      //处理
      let option2=e.detail.object;
      this.setData({
        option2:option2
      })
      let alloption={
        option1:this.data.option1,
        option2:option2,
      }
      //发送事件
      this.triggerEvent('conf2', { alloption: alloption });
    },
  },
});
