Component({
  properties: {
    options: {
      type: Array,
      value: [] as object[],
    },
  },
  data: {
    showOptions: false,
    selectedOption: '',
    dropdownStyle: '', // 用于动态设置下拉选择框的样式
  },
  methods: {
    toggleOptions() {
      this.setData({
        showOptions: !this.data.showOptions,
      }, 
      // () => {
      //   this.adjustDropdownPosition(); // 切换显示状态后调整位置
      // }
      );
    },
    selectOption(e: any) {
      const { option } = e.currentTarget.dataset;
      
      this.setData({
        selectedOption: option,
        showOptions: false,
      });
      console.log(":showOptions:",this.data.showOptions);
      
      this.triggerEvent('select', { option1: option });
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
