const request=require('../utils/request')

//模块基础URL
const baseURL='/case-survey-app';
// 获取全部
const getAll = (sid:number) => {
  return request.request({
    url: baseURL+"/findSwitch/"+sid,
    data: sid,
    method: 'GET',
  })
}
//按区域获取智能被控器件
const findByAreaAndsmartControl=(aid:number)=>{
  return request.request({
    url: baseURL+"/findByAreaAndsmartControl/"+aid,
    data: aid,
    method: 'GET',
  })
}

//按id获取
const getDataById = (id:number) => {
  return request.request({
    url: baseURL+"/getOneDate/"+id,
    data: id,
    method: 'GET',
  })
}
//按id删除
const deleteById = (id:number) => {
  return request.request({
    url: baseURL+"/"+id,
    // data: JSON.stringify(id),
    method: 'DELETE',
  })
}

//添加
const add=(data:any)=>{
  return request.request({
    url: baseURL+"/createApp",
    data: data,
    method: 'POST',
  })
}

//批量添加switch类型的app
const createApps=(data:any)=>{
  return request.request({
    url: baseURL+"/createApps",
    data: data,
    method: 'POST',
  })
}

export const  MyApp={
  getAll,
  findByAreaAndsmartControl,
  getDataById,
  deleteById,
  add,
  createApps,
};

