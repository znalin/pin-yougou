import { request } from "../../request/index";

/*
1.输入框绑定  值改变事件 input事件
  1.获取输入框值  判断
  2.发后台 返回数据渲染页面
2.防抖(定时器)
 1.防抖---输入框---防止短时间内多次请求
 2.节流---页面上拉  下拉

*/
Page({
  data: {
    goods:[],
    // 取消按钮是否显示
    isFocus:false,
    inValue:''
  },
  TimeId:-1,
  // 输入框
  handleInput(e){
    //1.获取输入框的值
    const {value} = e.detail;
    // 2.合法验证
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      // 不合法
      return;
    }
    // 3.合法发请求（防抖）
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(()=>{
      this.getSearch(value);
    },1000)
  
  },
  // 发送请求
  async  getSearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}});
    this.setData({
      goods:res
    })
  },
  // 取消按钮
  handleCancel(){
    this.setData({
      inValue:'',
      goods:[],
      isFocus:false
    })
  }
})