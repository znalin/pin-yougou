// 登陆页面做的事就是获取用户信息
Page({
  data: {

  },
  onLoad: function (options) {

  },
  handleGetUserInfo(e){
    // 获取用户信息
    const {userInfo} = e.detail;
    wx.setStorageSync('userInfo', userInfo);
    // 成功后调转页面
    wx.navigateBack({
      delta:1
    });
  }
})