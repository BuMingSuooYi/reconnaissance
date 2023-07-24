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
    url: baseURL+"/getByID/"+id,
    data: id,
    method: 'GET',
  })
}
//添加
const addCaseSurvey=()=>{

}

module.exports={
  getAll,
  getById,
  addCaseSurvey,
}

