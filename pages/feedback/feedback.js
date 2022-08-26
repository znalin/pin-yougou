/*
1.点击按钮添加图片
  1.调用小程序内置的选择图片的api
  2.获取图片路径  数组
  3.将图片路径存入data 
  4.页面将图片循环显示 自定义组件
2.点击自定义组件 删除
  1.获取被点击元素的索引
  2.获取data中图片数组  删除
  3.将数组重新设置回data中
3.提交
  1.获取文本内容
  2.合法性验证内容
  3.用户选择的图片上传到专门的图片服务器  返回图片外网的链接
    1.遍历图片数组
    2.挨个上传
    3.自己再维护图片数组   存放 图片上传后的外网的链接
  4.文本域和外网的图片路径一起提交到服务器中（前端模拟）
  5.清空当前页面
  6.返回上一页
 */
Page({
  data: {
    tabs:[
      {id:0,
      value:"体验问题",
      isActive:true
      },
      {id:1,
      value:"商品、商家投诉",
      isActive:false
      }
    ],
    // 被选中的图片路径
    chooseImages:[],
    // 文本域的内容
    textValue:'',
    // 外网的图片路径数组
    uploadImages:[]


  },
  //子组件传来 
  handleTabsTtemChange(e){
    // 1.获取被点击的标题索引
    const { index}= e.detail;
    // 2.修改原数组 改变标题的颜色显示
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i=== index?v.isActive=true:v.isActive=false);
    //3.将就改好的数组赋值
    this.setData({
      tabs
    })
   },
  // 点击"+"按钮 选择图片
   handleChooseImg(e){
     // 1.调用小程序内置的api
     wx.chooseImage({
      // 限制数量
      count: 5,
      // 图片格式  原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源  相册 照相机
      sourceType: ['album', 'camera'],
      success: (res)=> {
       console.log(res);
       this.setData({
        chooseImages:[...this.data.chooseImages,...res.tempFilePaths]
       })
      }
    })

   },
  // 点击自定义的图片
  handleRemoveImg(e){
    // 1.获取被点击图片索引
    const {index} = e.currentTarget.dataset;
    // 2.获取原图片数组
    let {chooseImages} = this.data;
    // 3.删除
    chooseImages.splice(index,1);
    // 4.最后数据返回data
    this.setData({
      chooseImages
    })
  },
  // 文本域的输入
  handleTextInput(e){
    this.setData({
      textValue:e.detail.value
    })
  },
  // 表单提交
  handleFormSubmit(){
    // 1.获取文本域内容,图片数组
    const {textValue,chooseImages} = this.data;
    // 2.合法性验证
    if(!textValue.trim()){
      // 为空 不合法  return 不再往下执行
      wx.showToast({
        title: '输入不合法',
        icon:"none",
        mask:true
      })
      return;
    }
    // 3.将图片上传到专门的图片服务器(此API无法支持多个文件同时上传---》遍历数组挨个上传)
    // 显示正在等待的图片
    wx.showLoading({
      title:'正在上传中',
      mask:true
    });
    // 判断有没有需要上传数组
    if(chooseImages.length !=0 ){
      chooseImages.forEach((v,i)=>{
        wx.uploadFile({
          // 被上传的文件路径
          filePath: v,
          // 上传的文件的名称 后台来获取文件  file(自定义)
          name: 'image',
          // 上传到哪
          url: 'https://img.coolcr.cn/api/upload',
          // 顺带的文本信息
          formData:{},
          success:(res)=>{
            console.log(res);
            // 获取url
            let url = JSON.parse(res.data).data.url;
            this.data.uploadImages.push(url);
            console.log(this.data.uploadImages);
            // 所有图片都上传玩再与文本提交
            if(i === chooseImages.length-1){
              // 关闭加载
              wx.hideLoading();
              console.log("把文本内容与图片数组  提交给后台");
              //提交成功
              // 重置页面
              this.setData({
                textValue:'',
                chooseImages:[]
              })
              //返回上一个页面
              wx.navigateBack({
                delta:1
              })
            }
          }
        })
      })
    }else{
      wx.hideLoading();
      console.log('只提交文本');
      wx.navigateBack({ delta:1 });
    }
  }
})