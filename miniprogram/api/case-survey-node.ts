const request=require('../utils/request')

//模块基础URL
const baseURL='/case-survey-node';
// 获取全部
const getAll = (aid:number) => {
  return request.request({
    url: baseURL+"/"+aid,
    data: aid,
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

const updata=(id:number,data:any)=>{
  return request.request({
    url: baseURL+"/update/"+id,
    data: data,
    method: 'PATCH',
  });
}

const upNodeAneAppdata=(data:any)=>{
  return request.request({
    url: baseURL+"/upNodeAneAppdata",
    data: data,
    method: 'PATCH',
  });
}

// 在某实例中获取一个新的联排号
const addNewRawFrameSymbol=(id:number,data:any)=>{
  return request.request({
    url: baseURL+"/addNewRawFrameSymbol/"+id,
    data:data,
    method: 'Patch',
  });
}


export const  myNode={
  getAll,
  deleteById,
  add,
  updata,
  upNodeAneAppdata,
  addNewRawFrameSymbol
};

