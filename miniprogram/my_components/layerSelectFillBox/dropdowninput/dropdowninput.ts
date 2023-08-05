Component({
  properties: {
    object:{
      type: Object,
      value: {},
    },
    options: {
      type: Array,
      value: [] as object[],
    },
    // 定义自定义事件,确定二级选项
    mychange: {
      type: Object, // 类型可以根据实际需求指定
    },
  },
  data: {
    showOptions: false,
  },
  methods: {
    onInput(e: any) {
      const { value } = e.detail;
      console.log("value:",value);
      let object={
        name:value
      }
      this.setData({
        object: object,
        // initData:object,
        showOptions: false,
      });
      this.triggerEvent('mychange',{ object: this.data.object } );
    },
    toggleOptions() {      
      this.setData({
        showOptions: !this.data.showOptions,
      });
    },
    selectOption(e: any) {      
      const { option } = e.currentTarget.dataset;
      console.log("option:",option);
      
      this.setData({
        object: option,
        initData:option,
        showOptions: false,
      });
      this.triggerEvent('mychange', { object: this.data.object });
    },
    adjustDropdownPosition() {
      const query = this.createSelectorQuery();
      query.select('.selected-option').boundingClientRect();
      query.selectViewport().boundingClientRect();
      query.exec((res: any) => {
        const selectedOptionRect = res[0];
        const viewportRect = res[1];

        if (selectedOptionRect && viewportRect) {
          const dropdownTop = selectedOptionRect.bottom;
          const dropdownHeight = this.data.options.length * 40; // 假设每个选项高度为 40px
          const dropdownBottom = dropdownTop + dropdownHeight;

          if (dropdownBottom > viewportRect.bottom) {
            // 下拉框超出视图底部，需要调整位置
            const diff = dropdownBottom - viewportRect.bottom;
            this.setData({
              dropdownStyle: `top: ${selectedOptionRect.top - diff}px;`,
            });
          } else {
            this.setData({
              dropdownStyle: `top: ${selectedOptionRect.top}px;`,
            });
          }
        }
      });
    },
  },
});
