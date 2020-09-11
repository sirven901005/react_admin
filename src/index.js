// 入口js

import React from 'react'
import ReactDOM from 'react-dom'
// import 'antd/dist/antd.css'
import {Provider} from 'react-redux'
import store from './redux/store'

import App from './App'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

// 读取本地保存的user并保存在内存
// const user = storageUtils.getUser()
// memoryUtils.user = user

// 将app组件标签渲染到index页面的div上
ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('root'))