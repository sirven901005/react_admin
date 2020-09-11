import React, { Component } from 'react';
import {Redirect} from 'react-router-dom'
import { Form, Icon, Input, Button,message } from 'antd';
import {reqLogin} from '../../api'
import './login.less'
import logo from '../../assets/images/logo.png'
import memoryUtils from '../../utils/memoryUtils'
import {connect} from 'react-redux'
import {login} from '../../redux/actions'
import storageUtils from '../../utils/storageUtils'


const Iteem = Form.Item //不能卸载import之前
// 登录的路由组件
class Login extends Component {
    handleSubmit = (e) => {
        e.preventDefault()
        // 对所有表单字段进行验证
        this.props.form.validateFields(async (err, values) => {
            // 检验成功
            if (!err) {
            //   console.log('提交登录的ajax请求 ', values);
            // 请求登录
                const {username,password} = values
                // 调用分发异步action的函数 => 发登录的异步请求,有了结果后更新状态
                this.props.login(username,password)
                // this.props.history.replace('/home')
                // const res = await reqLogin(username,password)       // alt + <-
                // if(res.status===0){
                //     // 提示登录成功
                //     message.success('登录成功')
                //     // 保存user
                //     const user = res.data
                //     memoryUtils.user = user //保存在内存
                //     storageUtils.saveUser(user) //保存到本地
                //     // 跳转到管理页面,不需要再回退到登录
                //     this.props.history.replace('/home')
                // }else{ //登录失败
                //     // 提示错误信息
                //     message.error(res.msg)
                // }
                // console.log('请求成功',res)
            } else {
                console.log('检验失败')
            }
          });
    }

    // 对密码进行验证
    validatepwd = (rule, value, callback) => {
        if(!value){
            callback('密码必须输入!')
        } else if(value.length<4){
            callback('密码必须大于4位!')
        }else if(value.length>12){
            callback('密码必须小于12位!')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('用户名必须是英文，数字，下划线开头!')
        }else {
            callback() //验证通过
        }
        
        // callback('xxx') //验证失败，并指定提示文本
    }

    render() {
        // 如果用户已经登录，自动跳转管理页面
        const user = this.props.user
        if(user && user._id){
            return <Redirect to='/home' />
        }
        const errorMsg= this.props.user.errorMsg
        // 得到具有强大功能的form对象
        const { getFieldDecorator } = this.props.form;

        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo" />
                    <h1>React项目:后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <div>{errorMsg}</div>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Iteem>
                            {getFieldDecorator('username', { //配置对象: 属性名是特定的一些名称
                            // 声明是验证，直接使用别人定义的验证规则进行验证
                                rules: [
                                    { required: true, whitespace: true, message: '用户名必须输入!' },
                                    { min: 4, message: '用户名至少为4位!' },
                                    { max: 12, message: '用户名最多为12位!' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文，数字，下划线开头!' }
                                ],
                                initialValue: 'admin' //指定初始值
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />
                            )}

                        </Iteem>
                        <Iteem>
                        {getFieldDecorator('password', {
                                rules: [
                                    {validator: this.validatepwd}
                                ]
                            })(
                                <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                            )}
                           
                        </Iteem>
                        <Iteem>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Iteem>
                    </Form>
                </section>
            </div>
        );
    }
}



// 包装fotm组件生成一个新的组件：From（Login）,新组件会向From组件传递一个强大的对象属性:from
const WrappLogin = Form.create()(Login);
export default connect(
    state=>({user:state.user}),
    {login}
)(WrappLogin) 
// 1.前台表单验证
// 2.手机表单数据