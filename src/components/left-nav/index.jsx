import React, { Component } from 'react';
import { Link,withRouter } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import './index.less'
import menuList from '../../config/menuConfig'

import { Menu, Icon } from 'antd';

const { SubMenu } = Menu


// 左侧导航组件
class LeftNav extends Component {

    // 根据menu的数据数组生成对用的标签数组
    // 使用map() + 递归调用
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname

        return menuList.map(item => {
            /*
                {
                    title: '首页', //菜单标题名称
                    key: '/home', //对应的path
                    icon: 'home' //图标名称
                    children: [], //可能有，也可能没有
                }
            */
           if(!item.children){
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                        
                    </Menu.Item>
                )
           }else{
                
            // 查找一个与当前请求路径匹配的子item
            const cItem =  item.children.find(cItem => cItem.key===path)
            // 如果存在，说明当前item子列表需要打开
            if(cItem){
                this.openKey = item.key
            }

                return(
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
        })
    }

    // 在第一次render()之前执行一次,为第一次render()准备数据（必须是同步的）
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {

        // 得到当前请求路由路径
        const path = this.props.location.pathname
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
export default withRouter(LeftNav)