/*
商品收藏
  1.页面onShow的时候  加载缓存中商品收藏数据
  2.判断当前商品是否被收藏  是：修改页面图标     否：
  3.点击图标  判断该商品是否存在缓存中 是：删除 不是：加上
 */
//引入发送请求的方法,路径要全
import {request} from "../../request/index"
Page({
  data: {
    goodsObj:{},
    // 商品是否被收藏
    isCollect:false
  },
// 商品全局对象
  GoodsInfo:{},
  onShow:function(){
    // 获取数据用的
    let pages = getCurrentPages();
    let currentPage =  pages[pages.length-1];
    let options = currentPage.options;
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
    // 收藏用的
    //1.获取缓存中的收藏数组
    // let collect = wx.getStorageSync('collect') ||[];
    //2.判断当前的商品是否被收藏 some 只要有一个返回true  最后都返回true
    // let index = collect.every(v=>v.goods_id === this.GoodsInfo.goods_id)//goods_id是因为要请求接口获取，因为请求是异步所以goods_id先渲染 再执行之后代码获取goods_id，所以应该把这段代码放到请求中执行
  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({
      url:"/goods/detail",
      data:{goods_id}
    })
    this.GoodsInfo=goodsObj;
    //1.获取缓存中的收藏数组
    let collect = wx.getStorageSync('collect') ||[];
    //2.判断当前的商品是否被收藏 some 只要有一个返回true  最后都返回true
    let isCollect = collect.some(v=>v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      //只赋值需要的数据
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone部分手机不识别webp图片格式
        // 后台改  前端改：确保后台存在1.webp => 1.jpg
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
   
  },
  // 点击轮播图放大预览
  handlePrevewImage(e){
    // 1.先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
    // 接收需要展示的图片
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      urls,
      current,
    })
  },
  // 点击加入购物车
  handleCartAdd(){
    // 1.获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart') || [];
    // 2.判断商品支付存在购物车数组中
    let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
    if(index === -1){
      // 3.不存在 属于第一次添加
      this.GoodsInfo.num =1;
      this.GoodsInfo.checked = true;
      cart.push( this.GoodsInfo);
    }else{
      // 4.已经存在数据  num++ 
      cart[index].num ++;
    }
    // 5.无论有没有 都要将数据添加到缓存中
    wx.setStorageSync('cart', cart);
    // 6.弹框提示
    wx.showToast({
      title: '加入成功',
      icon:'success',
      // 防止用户手抖 疯狂点击
      mask:true
    })
  },
  //点击收藏
  handleCollect(){
    let isCollect =false;
    // 1.获取缓存中的商品数组
    let collect = wx.getStorageSync('collect') || [];
    // 2.判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
    // 3.当index!==-1 表示已经收藏
    if(index !== -1){
      // 收藏
      collect.splice(index,1);
      isCollect =false;
      wx.showToast({
        title: '取消收藏成功',
        icon:'success',
        mask:true
      })
    }else{
      // 未收藏
      collect.push(this.GoodsInfo);
      isCollect =true;
      wx.showToast({
        title: '添加收藏成功',
        icon:'success',
        mask:true
      })
    }
    // 4.将修改的数组存到缓存中
    wx.setStorageSync('collect', collect);
    // 5.修改data中的属性
    this.setData({
      isCollect 
    })
  }
})