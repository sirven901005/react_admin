import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import {connect} from 'react-redux'
import './index.less'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import { Menu, Icon } from 'antd';
import {setHeadTitle} from '../../redux/actions'

const { SubMenu } = Menu


// 左侧导航组件
class LeftNav extends Component {

    // 判断当前登录用户对item是否有权限
    hasAuth=(item) => {
        const {key,isPublic} = item
        const menus = this.props.user.role.menus
        const username = this.props.user.username
        // 1.如果当前用户是admin
        // 2.如果当前tiem是公开的
        // 3.当前用户有此tiem权限：key有没有在menus中
        if(username==='admin'||isPublic || menus.indexOf(key)!==-1){
            return true
        }else if(item.children){ //如果当前用户由此item的某个子item的权限
            return !!item.children.find(child=>menus.indexOf(child.key)!==-1)
        }
        return false
    }

    // 根据menu的数据数组生成对用的标签数组
    // 使用map() + 递归调用
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname

        return menuList.map(item => {
            // 如果当前用户有item对应的权限,才需要显示对应得菜单项
            if (this.hasAuth(item)) {
                if (!item.children) {
                    // 判断item是否是当前对应的item
                    if(item.key===path || path.indexOf(item.key)===0){
                        // 更新redux里headTitle状态
                        this.props.setHeadTitle(item.title)
                    }
                    return (
                        <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={()=> this.props.setHeadTitle(item.title)}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>

                        </Menu.Item>
                    )
                } else {

                    // 查找一个与当前请求路径匹配的子item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    // 如果存在，说明当前item子列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }

                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }

        })
    }

    // 在第一次render()之前执行一次,为第一次render()准备数据（必须是同步的）
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {

        // 得到当前请求路由路径
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) { //当前请求的是商品或子路由
            path = '/product'
        }
        // 得到需要打开菜单项的key
        const openKey = this.openKey

        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="" />
                    <h1>云联超市</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >

                    {
                        this.menuNodes
                    }

                </Menu>
            </div>
        )
    }
}


/*
    withRouter高阶组件
    包装非路由组件,返回一个新的组件
    新的组件向非路由组件传递三个属性：history,location,match
*/
export default connect(
    state=>({user:state.user}),
    {setHeadTitle}
)(withRouter(LeftNav)) 