const hint=(title:string)=>{
  wx.showToast({
    title: title, // 提示的内容
    icon: 'none', // 提示的图标，可选值：'success', 'loading', 'none'
    duration: 2000, // 提示的延迟时间，单位为毫秒，设置为0时提示不会自动消失
    mask: true, // 是否显示透明蒙层，防止触摸穿透，默认为 false
  })
}

export const  MyUtil={
  hint,
};
