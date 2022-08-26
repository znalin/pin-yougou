/*
1.获取用户的收货地址
  1.点击事件
  2.调用小程序内置的api，获取用户的收货地址 wx.chooseAddress()
  3.将收货地址存入缓存
2.页面加载完毕
  0.页面会频繁打开  用onshow(将缓存数据展示和之前从后端拿数据性质不同)
  1.获取本地存储中的数据
  2.将数据设置给data中一个变量
3.onShow
  1.获取缓存中的购物车数组 赋值给data
  2.回到商品详情页面，第一次添加商品购物车  手动添加选中属性
4.全选的实现 数据的展示
  1.所有的商品都被选中  全选就被选中
5.总商品和总价格
  1.前提是商品被选中 才计算
  2. 获取购物车数组  遍历  判断商品是否被选中
  3. 总价格：+= 商品单价*商品数量
  4.总数量：+= 商品数量
  5.将计算后的总价格和总数量给data
6. 商品的选中
  1.绑定change事件
  2.获取到被修改的商品对象
  3.修改商品对象的选中状态取反
  4.将状态重新填回data中还有缓存中 
  5.重新计算全选  总数量 总价格...
7.全选 与 反选
  1. 全选复选框 添加绑定事件 change
  2. 获取data中的全选变量 allChecked 且取反
  3.遍历购物车  改变状态 
  4. 将购物车数据 与状态 设置回data中或者缓存中
8. 商品数量的编辑
  1."+""-"按钮 绑定同一个点击事件 区分的关键是自定义属性
  2. 传递被点击的商品id 
  3. 获取data 中的购物车数组  获取被修改的商品对象 修改num 
  4. 将新数据存在缓存中 data中
9.点击结算
  1.判断有没有收货信息  商品  无弹窗提示
  2.有支付结算
*/
import {showModal,showToast} from "../../utils/async"
Page({
  data: {
    address:{},// 地址
    cart:[],// 购物车商品
    allChecked:false,// 是否购物车全被选中
    totalPrice:0,// 总价
    totalNum:0 // 总数量
  },
  onShow:function(){
    // 1.获取缓存中的数据
    const address = wx.getStorageSync('address');
    // 1.获取缓存中的购物车数据
    const cart =wx.getStorageSync('cart') || [];
    // 1.计算全选 every()数组方法，接收一个回调函数，每一个回调都是true  结构为true
    // 反之  有一个是false 直接返false  every()方法是空数组  返回值也是true
    // 调用封装方法计算合计 全选 总数
    this.setData({
      address
    });
    this.setCart(cart);
  },
// 点击收货地址按钮事件
handleChooseAddress(){
  // 获取收获地址
  wx.chooseAddress({
    success: (result) => {
      // 存入缓存中
      let address = result;
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
      wx.setStorageSync('address', address)
      
    },
  })

},
// 商品的选中
handleItemChange(e){
  // 1.获取被修改的商品id
  const goods_id = e.currentTarget.dataset.id;
  // 2.获取购物车数组
  let {cart } =this.data;
  // 3.找到被修改的商品对象
  let index = cart.findIndex(v=>v.goods_id===goods_id);
   // 4.将选中状态取反
  cart[index].checked = !cart[index].checked;
  // 调用封装方法计算合计 全选 总数
  this.setCart(cart);
 
},
// 封装  计算全选 总价格 购买数量
setCart(cart){
  // 全选
  const allChecked = cart.length?cart.every(v=>v.checked):false;
  // 总价格  总数量
  let totalPrice = 0;
  let totalNum = 0;
  cart.forEach(v=>{
    if(v.checked){
      totalPrice += v.num*v.goods_price;
      totalNum += v.num;
    }
  })
// 将购物车的数据重新设置到data中和缓存中、
this.setData({
  cart,
  totalPrice,
  totalNum,
  allChecked
})
  wx.setStorageSync('cart', cart);
},
// 商品全选功能
handleItemAllChecked(){
  // 获取data中数据
  let {cart ,allChecked} = this.data;
  // 全选取反
  allChecked =!allChecked;
  // 循环修改数据
  cart.map(v=>v.checked=allChecked)
  // cart.forEach(v=>v.checked =allChecked)
  // 将修改后的值返给data与缓存
  this.setCart(cart);
},
// 按钮编辑商品数量
async handleItemNum(e){
      // 1 获取传递过来的参数
      const {operation,id} = e.currentTarget.dataset;
      // 2.获取购物车数组
      let {cart} =this.data;
      // 3.找到加减的购物商品对象索引
     let index = cart.findIndex(v=>v.goods_id ===id )
     // 修改数量之前判断是否删除
     if(cart[index].num ===1 && operation === -1){
        const res = await showModal({content:"您是否要删除？"});
            if(res.confirm){
            cart.splice(index,1);
            this.setCart(cart);
          }
      }else{
        // 4. 修改数量（注意数量减到0做提示）
        cart[index].num += operation;
        // 5.返回出去
        this.setCart(cart);
    }},
// 支付结算
async handlePay(){
  // 1.判断收货地址
  const {address,totalNum} =this.data;
  if(!address.userName){
     await showToast({title:"您还没有选择收货地址"});
     return;
  }
  // 2. 判断用户有无商品
  if(totalNum === 0){
    await showToast({title:"您还没有选购商品"});
    return;
 }
  // 3. 跳转支付页面
  wx.navigateTo({
    url: '/pages/pay/pay'
  })
  }
})