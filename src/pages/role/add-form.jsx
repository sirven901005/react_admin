import React, { Component } from 'react';
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

// 添加分类的form组件
class AddForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired 
    }

    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const formItemLayout = {
            labelCol:{span:4},
            wrapperCol:{span:15}
        }
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item label='角色名称' {...formItemLayout}>
                    {
                        getFieldDecorator('roleName', {
                            initialValue: '',
                            rules:[
                                {required:true,message:'请输入角色名称!'}
                            ]
                        })(
                            <Input placeholder='请输入角色名称' />
                        )
                    }

                </Item>

            </Form>
        );
    }
}

export default Form.create()(AddForm)