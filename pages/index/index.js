//引入发送请求的方法,路径要全
import {request} from "../../request/index"
Page({
  data: {
    // 轮播图数组
    swiperList:[],
    // 导航 数组
    cateList:[],
    // 楼层数据
    floorList:[]
  },
  onLoad: function (options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
    },
  // 获取轮播图数据方法
  getSwiperList(){
    request({
      url: '/home/swiperdata',
    }).then(res=>{
      this.setData({ swiperList:res })
    })
  },
  // 获取导航数据方法
  getCateList(){
    request({
      url: '/home/catitems',
    }).then(res=>{
      this.setData({ cateList:res })
    })
  },
  // 获取楼层数据方法
  getFloorList(){
    request({
      url: '/home/floordata',
    }).then(res=>{
      this.setData({ floorList:res })
    })
  }
})