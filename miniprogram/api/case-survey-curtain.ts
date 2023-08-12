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

const updata=(data:any)=>{
  return request.request({
    url: baseURL,
    data: data,
    method: 'PATCH',
  });
}

//按id删除
const deleteById = (id:number) => {
  return request.request({
    url: baseURL+"/"+id,
    method: 'DELETE',
  })
}

export const  Curtain={
  add,
  updata,
  deleteById,
};

