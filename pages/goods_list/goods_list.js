//引入发送请求的方法,路径要全
import {request} from "../../request/index"
Page({
  data: {
    tabs:[
      {id:0,
      value:"综合",
      isActive:true
      },
      {id:1,
      value:"销量",
      isActive:false
      },
      {id:2,
      value:"价格",
      isActive:false
      }
    ],
    goodList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  // 总数
  totalPage:1,
  // 子组件传来
  handleTabsTtemChange(e){
   // 1.获取被点击的标题索引
   const { index}= e.detail;
   // 2.修改原数组
   let {tabs} = this.data;
   tabs.forEach((v,i)=>i=== index?v.isActive=true:v.isActive=false);
   //3.将就改好的数组赋值
   this.setData({
     tabs
   })
  },
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || '';
    this.QueryParams.query = options.query || '';
    this.getGoodsList();
  },
  // 获取商品列表数据
  async getGoodsList(){
   const res = await request({url:"/goods/search",data:this.QueryParams})
   const total = res.total;
   this.totalPage = total
   this.setData({
     // 拼接数组
     goodList:[...this.data.goodList,...res.goods]
   })
   // 关闭下拉刷新的窗口，如果没有调用下拉刷新窗口，直接关闭也不会报错
   wx.stopPullDownRefresh();
  },
  // 页面上滑触底事件
  onReachBottom(){
   // 当触底判断有无下一页，有加载下一页，无就弹出提示
    if(this.QueryParams.pagenum*this.QueryParams.pagesize >= this.totalPage){
      wx.showToast({
        title: '已经是最后一页',
      })
    }else{
      this.QueryParams.pagenum ++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh(){
    // 1.重置数组
    this.setData({
      goodList:[]
    })
    // 2.重置页码
    this.QueryParams.pagenum=1;
    // 3.发请求
    this.getGoodsList();
    // 4.在请求成功后关闭下拉效果
  }
})