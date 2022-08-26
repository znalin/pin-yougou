import { reject } from "async"
// promise形式的  showModal
export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title:'提示',
            content: content,
            success:(res)=>{
                resolve(res);
            },
            fali:(err)=>{
                reject(err);
            }
          })
    })
}
// promise形式的  showToast
export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title:title,
            icon:'none',
            success:(res)=>{
                resolve(res);
            },
            fali:(err)=>{
                reject(err);
            }
          })
    })
}
// promise形式的  login 获取登陆后的code
export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout: 10000,
            success:(resule)=>{
                resolve(resule)
            },
            fail:(err)=>{
                reject(err)
            }
          })
    })
}
// promise形式的  微信支付
export const requestPayment=({pay})=>{
    return new Promise((resolve,reject)=>{
        wx.requestPayment({
           ...pay,
           success:(res)=>{
            resolve(res)
           },
           fail:(err)=>{
            reject(err)
           }
          })
    })
}


