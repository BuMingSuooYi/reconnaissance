const request=require('../utils/request')

//模块基础URL
const baseURL='/case-survey-area';
// 获取全部
const getAll = (sid:number) => {
  return request.request({
    url: baseURL+"/"+sid,
    data: sid,
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
    url: baseURL,
    data: data,
    method: 'POST',
  })
}

export const  Area={
  getAll,
  getDataById,
  deleteById,
  add,
};

