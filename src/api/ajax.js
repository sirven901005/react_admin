// 发送异步ajax请求的函数模块,封装的是axios库,函数返回值是promise对象

// 优化：统一处理请求异常：在外层报一个自己创建的promise对象
// 请求出错时,不reject(err)，而是显示错误提示
// 2.异步得到不是res，而是res.data,请求成功resolve时：resolve(res.data)

import axios from 'axios'
import {message} from 'antd'

export default function ajax(url,data = {},type='GET') {

    return new Promise((resolve,reject) => {
        let promise
        // 1.执行异步ajax请求
        if(type==='GET'){
            promise = axios.get(url,{ // 配置对象
                // 指定请求参数
                params: data
            })
        } else { // 发送post请求
            promise = axios.post(url,data)
        }
        // 2.成功调用resolve(value)
        promise.then(res => {
            resolve(res.data)
        }).catch(err => {
            message.error('请求出错了'+err.message)
        })
        // 3.失败不调用reject(reason)，而是提示一场信息
    })

    
}

// 请求登录接口
// ajax('/login',{username:'Tom',password: '12345'},'POST').then()
// 添加用户
// ajax('/manage/user/add',{username:'Tom',password: '12345',phone: '13712341234'},'POST').then()

