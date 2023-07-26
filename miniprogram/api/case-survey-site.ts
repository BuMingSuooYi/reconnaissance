const request=require('../utils/request')

//模块基础URL
const baseURL='/case-survey-site';
// 获取全部
const getAll = (aid:number) => {
  return request.request({
    url: baseURL+"/"+aid,
    data: aid,
    method: 'GET',
  })
}
//按id获取位点下的窗帘、非联排底盒、联排底盒
const getDataById = (id:number) => {
  return request.request({
    url: baseURL+"/getOneData/"+id,
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
    url: baseURL,
    data: data,
    method: 'POST',
  })
}

export const  Site={
  getAll,
  getDataById,
  deleteById,
  add,
};

