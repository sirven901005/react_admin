import React, { PureComponent } from 'react';
import { Form, Input,Select } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const {Option} = Select
// 添加/修改用户的form组件
class UserForm extends PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired, //用来传递form对象的函数
        roles:PropTypes.array.isRequired,
        user:PropTypes.object
    }

    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const {roles} = this.props
        const user = this.props.user||{}
        const formItemLayout = {
            labelCol:{span:4},
            wrapperCol:{span:15}
        }
        const { getFieldDecorator } = this.props.form
        return (
            <Form {...formItemLayout}>
                <Item label='用户名' >
                    {
                        getFieldDecorator('username', {
                            initialValue: user.username,
                           
                        })(
                            <Input placeholder='请输入用户名称' />
                        )
                    }
                </Item>
                <Item label='密码' >
                    {
                        getFieldDecorator('password', {
                            initialValue: user.password,
                            
                        })(
                            <Input type='password' placeholder='请输入密码' />
                        )
                    }
                </Item>
                <Item label='手机号' >
                    {
                        getFieldDecorator('phone', {
                            initialValue: user.phone,
                            
                        })(
                            <Input placeholder='请输入手机号!' />
                        )
                    }
                </Item>
                <Item label='邮箱' >
                    {
                        getFieldDecorator('email', { 
                            initialValue: user.email,
                           
                        })(
                            <Input placeholder='请输入邮箱' />
                        )
                    }
                </Item>
                <Item label='角色' >
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id,
                           
                        })(
                            <Select placeholder="请选择用户角色">
                                {
                                    roles.map((v,i) => <Option key={v._id} value={v._id}>{v.name}</Option>)
                                }
                                
                            </Select>
                        )
                    }
                </Item>
            </Form>
        );
    }
}

export default Form.create()(UserForm)