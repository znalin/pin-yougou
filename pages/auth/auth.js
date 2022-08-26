import {login} from '../../utils/async'
import {request} from "../../request/index"
Page({
// 获取用户信息
async handleGetUserInfo(e){
 try {
    // 获取用户信息
  // const {encryptedData,rawData,iv,signature} = e.detail;
  // 获取小程序登陆成功后的code值
  // const {code} = await login();
  // const loginParams = {encryptedData,rawData,iv,signature,code};
  // 发送请求  获取用户token
  // const {token}= await request({ url:"/users/wxlogin",data:loginParams,method:'POST' });
  // 把token 存在缓存中，且跳转到上一个页面
  // wx.setStorageSync('token', token)
  wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo')
  wx.navigateBack({
    delta: 1,
  });
 } catch(error){
   console.log(error)
 }
}

})