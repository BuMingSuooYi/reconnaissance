const request = require('../utils/request')

//模块基础URL
const baseURL = '/case-survey-scene';

//获取区域列表下的全部智能控件（包括窗帘）
const getSmartControlByAreas = (data: any) => {
  return request.request({
    url: baseURL+"/findSmartControlByAreas",
    data: data,
    method: 'POST',
  })
}

// 获取该实例全部情景数据
const getAllData = (surverid: number) => {
  return request.request({
    url: baseURL + "/" + surverid,
    method: 'GET',
  })
}

//按id删除
const deleteById = (id: number) => {
  return request.request({
    url: baseURL + "/" + id,
    // data: JSON.stringify(id),
    method: 'DELETE',
  })
}
//创建场景，并创建场景和智控关系
const add = (data: any) => {
  return request.request({
    url: baseURL,
    data: data,
    method: 'POST',
  })
}

const updata = (id: number, data: any) => {
  return request.request({
    url: baseURL + "/" + id,
    data: data,
    method: 'PATCH',
  });
}


export const Scence = {
  getSmartControlByAreas,
  getAllData,
  deleteById,
  add,
  updata,
};

