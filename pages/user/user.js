
Page({
  data: {
    userinfo:{},
    // 被收藏的商品数量
    collectNums:0
  },
  onShow(){
    // 从缓存中拿个人信息
    const userinfo = wx.getStorageSync('userInfo');
    // 获取缓存中的收藏
    const collect = wx.getStorageSync('collect')|| [];
    this.setData({
    userinfo,
    collectNums:collect.length
    })
    
  }
})