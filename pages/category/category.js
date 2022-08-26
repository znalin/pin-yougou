//引入发送请求的方法,路径要全
import {request} from "../../request/index"
Page({
  data: {
    // 左侧菜单数据
    leftMenyList:[],
    // 被点击的左侧索引
    currentIndex:0,
    // 右侧的商品数据
    rightContent:[],
    // 左侧滚动条距离顶部距离
    scrollTop:0
  },
  // 接口返回数据
  Cates:[],
  onLoad: function (options) {
    // 添加缓存
    // 1.在发送请求之前判断本地存储有无旧数据，没有发请求
    // {time:Date.now(),data:[...]}
    // 2.有旧数据且没有过期，使用存储旧数据
    // 3.web与小程序存储区别
    //web:localStorage.setItem("key","value") 存之前调toString()做类///型准换   localStorage.getItem("key")
    // 小程序中： wx.setStorageSync('key', "value") wx.
    //getStorageSync("key");
    //1.获取本地存储数据
    const Cates = wx.getStorageSync("cates");
    //2.判断
    if(!Cates){
      this.getCates();
    }else{
      if(Date.now()-Cates.time >1000*10){
        this.getCates();
      }else{
        this.Cates = Cates.data;
         // 构造数据
        let leftMenyList = this.Cates.map(v=>v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenyList,
          rightContent
        })
      }
    }
    
  },
  // 获取分类数据
  async getCates(){
    // request({
    //   url:"/categories"
    // }).then(res=>{
    //   this.Cates=res.data.message;
    //   // 将接口数据存入到本地存储中
    //   wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})
    //   // 构造左侧的大菜单数据
    //   let leftMenyList = this.Cates.map(v=>v.cat_name)
    //   this.setData({
    //     leftMenyList
    //   })
    //   // 构造右侧的商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     rightContent
    //   })
    // })
    // 使用es7 
    const res = await request({  url:"/categories"});// 如果没有请求到，以下代码不执行
      this.Cates=res;
      // 将接口数据存入到本地存储中
      wx.setStorageSync('cates', {time:Date.now(),data:this.Cates})
      let leftMenyList = this.Cates.map(v=>v.cat_name)
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenyList,
        rightContent
      })
  },
  // 左侧菜单点击事件回调
  handleItemTap(e){
    const {index}=e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  
    
  }

})