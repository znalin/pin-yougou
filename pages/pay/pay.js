/*
1. 页面加载的时候
  1.从缓存中获取购物车的数据  渲染到页面  渲染的数据checked=true
2. 微信支付
  1.哪些人 哪些账号可以实现微信支付
  （企业账号/  企业账号的小程序后台中必须要给开发者加上白名单 一个appid可以绑定多个开发者 可以共用appid的开发权限）
3.支付按钮
  1.先判断缓存中有没有token
  2.没有跳转授权页面  进行获取token
  3.有token...
  4. 有token 后创建订单  获取订单编号
  5.完成微信支付
  6.手动删除已经被选中的商品
  7.删除后的购物车数组 存回缓存
  8.再跳转页面
*/
import {request} from "../../request/index"
import {requestPayment} from "../../utils/async"
Page({
  data: {
    address:{},// 地址
    cart:[],// 购物车选中要买的商品
    totalPrice:0,// 总价
    totalNum:0 // 总数量
  },
  onShow:function(){
    // 1.获取缓存中的数据
    const address = wx.getStorageSync('address');
    // 1.获取缓存中的购物车数据
    let cart =wx.getStorageSync('cart') || [];
    // 过滤渲染的数据checked=true
    cart = cart.filter(v=>v.checked);
    this.setData({address});
     // 总价格  总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
        totalPrice += v.num*v.goods_price;
        totalNum += v.num;
    })
    // 将购物车的数据重新设置到data中和缓存中、
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })

  },
  // 点击支付的功能
  async handleOrderPay(){
   try {
       // 1.获取token
    const token =wx.getStorageSync('token');
    // 判断有无token
    if(!token){
      // 不存在跳转到授权页面  且返回
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    console.log("已经有token")
    // 2.创建订单  
    //      3.1准备请求头参数
    // const header = {Authorization	:token} // 已优化封装在请求中
    //       3.2准备请求体参数
    const order_price = this.data.totalPrice; //总价格
    const consignee_addr =this.data.address.all;// 地址
    const cart = this.data.cart; // 购物车
    let  goods = [];// 商品
    cart.forEach(v=>goods.push({
      goods_id:v. goods_id,
      goods_number:v.num,
      goods_price:v. goods_price
    }))
    const orderParams = {
      order_price,
      consignee_addr,
      goods
    };
    // 3.发送请求 调接口---获取订单编号
    const {order_number} = await request({url:"/my/orders/create",data:orderParams,match:"POST"});
    // 4.发起预支付  调接口--获取支付参数
    const {pay} = await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
    // 5.发起支付微信  用微信自带API将支付参数传入获取二维码  
    await requestPayment(pay);
    // 6.查询订单状态  调接口---看是否成功
    const res = await request({url:"/my/orders/chkOrder",data:{order_number},method:"POST"})
    // console.log(res)  支付成功
    // 7. 弹窗支付成功
    wx.showToast({
      title: '支付成功',
    })
    // 8.拿到缓存中全部商品  过滤掉已购买的商品 手动删除缓存中  已经支付了的商品
    let newCart = wx.getStorageSync('cart');
    newCart = newCart.filter(v=> !v.checked);
    wx.setStorageSync('cart', newCart);
    // 9.跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/order'
    })
   }catch(error){
    wx.showToast({
      title: '支付失败',
    })
   }
   
  }
})
