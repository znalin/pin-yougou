 //1.发起异步请求，获取轮播图数据  优化技术通过es6 promise解决 
 //本来写在页面js文件onLoad中  
    //  wx.request({
    //    url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //    success: ({data:{message}}) => {
    //     this.setData({
    //       swiperList:message
    //     })
    //    },
    //  })


// 同时发送异步代码的次数
let ajaxTimes = 0;
export const request=(params)=>{
 // 判断url中是否带有/my/ 请求的是私有的路径  需要带上header  还有token
 let header ={...params.header};
 if(params.url.includes("/my/")){
   // 拼接header  带上token
   header["Authorization"] =wx.getStorageSync('token');
 }
  ajaxTimes++;
  //显示加载中效果
  wx.showLoading({
    title:'加载中',
    mask:true
  })
  // 定义公共url
  const baseUrl ="https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url:baseUrl+params.url,
      success:(res)=>{
        resolve(res.data.message);
      },
      fail:(error)=>{
        reject(error);
      },
      complete:()=>{
        ajaxTimes--;
        // 当一个页面有多个请求同时触发，最后一个出发后才关闭加载效果
        if(ajaxTimes === 0){
          // 关闭正在加载图标
          wx.hideLoading();
        }
       
      }
    });
  })
}