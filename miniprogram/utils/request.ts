// ----http----
// 封装微信请求方法
const req = (params:any) => {
  // const apiUrl = "http://localhost:3000";// 公共的请求地址
  const apiUrl = "https://rs.starxy.cn";// 公共的请求地址
  let url = params.url;
  let data = params.data;
  let method = params.method;

  // 鉴权验证，获取登录之后后端返回的token，存在即在头部Authorization写token，具体的看后端需求
  // if (wx.getStorageSync("token")) {
  //   // header.Authorization = wx.getStorageSync("token");
  //   header.token = wx.getStorageSync("token");
  // }
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl + url, // api url
      method: method, // get/post
      data: data, // 请求参数
      success(res) {
        // 请求成功
        // 处理 API 响应数据
        resolve(res);
      },
      fail(err) {
        // 处理请求失败的情况
        reject(err);
      },
    });
  });
};

module.exports.request=req;

