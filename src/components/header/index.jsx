import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { Modal } from 'antd';
import LinkButton from '../link-button'
import { reqWeather } from '../../api'
import { formateDate } from '../../utils/dataUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'
import './index.less'


// 顶部组件
class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()), //当前时间啊字符串
        dayPictureUrl: '', //天气图片url
        weather: '', //天气文本
    }
    getTime = () => {
        // 每隔一秒获取当前时间,并更新状态数据currentTime
        this.timeId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }

    getWeather = async () => {
        // 调用接口请求异步获取数据
        const { dayPictureUrl, weather } = await reqWeather('武汉')
        // 更新状态
        this.setState({ dayPictureUrl, weather })
    }

    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) {//如果当前item对象的key与path一样,item的title就是需要显示的title
                title = item.title
            } else if (item.children) {
                // 在所有的子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                //    如果有值说明有匹配的
                if (cItem) {
                    //    取出他的title
                    title = cItem.title
                }
            }
        })
        return title
    }

    logout =() => {
        // 显示确认框
        Modal.confirm({
            
            title: '确定退出',
            onOk:() => {
            //   删除保存的user数据
                // storageUtils.removeUser()
                // memoryUtils.user = {}

                this.props.logout()

            // 跳转到login页面
                // this.props.history.replace('/login')
            }
          })
    }

    /*
        第一次render()之后执行一次
        一般在此执行异步操作: 发ajax请求/启动定时器
    */
    componentDidMount() {
        // 获取当前时间
        this.getTime()
        // 获取当前天气
        this.getWeather()
    }

    /*
        当前组件被销毁调用
    */
    componentWillUnmount(){
        // 清楚定时器
        clearInterval(this.timeId)
    }

    render() {
        // debugger
        const { currentTime, dayPictureUrl, weather } = this.state
        const username = this.props.user.username
        // 得到当前需压迫显示的titlle
        let title = this.props.headTitle
        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        {title}
                    </div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state=>({headTitle:state.headTitle,user:state.user}),
    {logout}
)(withRouter(Header)) 