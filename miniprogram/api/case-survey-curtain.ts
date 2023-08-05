const request=require('../utils/request')

//模块基础URL
const baseURL='/case-survey-curtain';

//添加
const add=(data:any)=>{
  return request.request({
    url: baseURL,
    data: data,
    method: 'POST',
  })
}

export const  Curtain={
  add,
};

