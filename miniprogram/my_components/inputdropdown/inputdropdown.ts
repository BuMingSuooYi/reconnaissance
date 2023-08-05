Component({
  properties: {
    options: {
      type: Array,
      value: [],
    },
    value:{
        type:String,
        value:""
    }
  },
  data: {
    selectedOption: '',
    inputValue: '',
    showOptions: false,
  },
  methods: {
    toggleOptions() {
      console.log(this.data);
      
      this.setData({
        showOptions: !this.data.showOptions,
      });
    },
    selectOption(e:any) {
      const option = e.currentTarget.dataset.option;
      this.setData({
        selectedOption: option.name,
        inputValue: option.name,
      });
      this.triggerEvent('change', { value: option.name });
    },
    inputChange(e:any) {
      const value = e.detail.value;
      this.setData({
        value:value,
        inputValue: value,
        selectedOption: '',
      });
      this.triggerEvent('change', { value });
    },
  },

  attached: function () {
    console.log('传入的数据：', this);
  },
});
