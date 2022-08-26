// 业务逻辑
/*
1.页面被打开   onShow(订单页面需要频繁的被打开)
  1.获取url上的参数type 
  2.然后拿着这个值去发请求获取订单  且根据标题索引来激活选中标题数组
  3.渲染页面
2.点击不同的标题  也要重新发请求 获取并且渲染数据
*/
//引入发送请求的方法,路径要全
import {request} from "../../request/index"
Page({
  data: {
    tabs:[
      {id:0,
      value:"全部",
      isActive:true
      },
      {id:1,
      value:"待付款",
      isActive:false
      },
      {id:2,
      value:"待发货",
      isActive:false
      },
      {id:3,
        value:"退款/退货",
        isActive:false
     }
    ],
    orders:[]
  },
  //  根据标题索引来激活选中标题数组
  changeTitleByIndex(index){
     // 2.修改原数组 改变标题的颜色显示
     let {tabs} = this.data;
     tabs.forEach((v,i)=>i=== index?v.isActive=true:v.isActive=false);
     //3.将就改好的数组赋值
     this.setData({
       tabs
     })

  },
  //子组件传来 
  handleTabsTtemChange(e){
    // 1.获取被点击的标题索引
    const { index}= e.detail;
    this.changeTitleByIndex(index);
    // 2.发送请求 type=1 index=0
    this.getOrders(index+1);
   },
   onShow(){
     // 0.因为要请求  需要token 所以在渲染数据之前判断有无token
     const token = wx.getStorageSync('token')
     if(!token){
        wx.navigateTo({
          url: '/pages/auth/auth',
        })
        return;
     }
     // onShow获取不到页面type的值  onLoad上可以
     // 1.获取当前的小程序的页面栈--数组   长度最大10页面
     let pages = getCurrentPages();
     // 2.数组中索引最大的就是当前页面
     let currentPage =  pages[pages.length-1];
     // 3.获取url上的type参数
     const {type} = currentPage.options;
     // 4.根据type 激活选中页面标题
     this.changeTitleByIndex(type-1);
     // 根据type 发请求获取数据
     this.getOrders(type);
     
   },
   // 获取订单列表的方法
   async getOrders(type){
     const res = await request({url:"/my/orders/all",data:{ type} });
    this.setData({
      orders:res.orders.map(v=>({...v,create_time_cn:new Date(v.create_time*1000).toLocaleString()}))
    })

   }
})