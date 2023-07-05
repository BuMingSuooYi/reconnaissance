Component({
  properties: {
    options: {
      type: Array,
      value: [],
    },
  },
  data: {
    selectedOption: '',
    inputValue: '',
    showOptions: false,
  },
  methods: {
    toggleOptions() {
      this.setData({
        showOptions: !this.data.showOptions,
      });
    },
    selectOption(e:any) {
      const option = e.currentTarget.dataset.option;
      this.setData({
        selectedOption: option,
        inputValue: option,
      });
      this.triggerEvent('change', { value: option });
    },
    inputChange(e:any) {
      const value = e.detail.value;
      this.setData({
        inputValue: value,
        selectedOption: '',
      });
      this.triggerEvent('change', { value });
    },
  },
});
