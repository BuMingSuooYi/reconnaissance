const request=require('../utils/request')

//模块基础URL
const baseURL='/case-survey';
// 获取全部
const getAll = () => {
  return request.request({
    url: baseURL,
    data: null,
    method: 'GET',
  })
}
//按id获取
const getById = (id:any) => {
  return request.request({
    url: baseURL+"/"+id,
    data: id,
    method: 'GET',
  })
}
//按id删除
const deleteById = (id:any) => {
  return request.request({
    url: baseURL+"/"+id,
    // data: JSON.stringify(id),
    method: 'DELETE',
  })
}
//添加
const addCaseSurvey=(data:any)=>{
  return request.request({
    url: baseURL,
    data: data,
    method: 'POST',
  })
}

//修改模板字段
const changeTemplate=(data:any)=>{
  return request.request({
    url: baseURL+"/changeTemplate",
    data: data,
    method: 'POST',
  })
}

export const  caseSurvey={
  getAll,
  getById,
  deleteById,
  addCaseSurvey,
  changeTemplate,
};

