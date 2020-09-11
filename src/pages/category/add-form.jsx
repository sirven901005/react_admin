import React, { Component } from 'react';
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

// 添加分类的form组件
class AddForm extends Component {

    static propTypes = {
        categorys: PropTypes.array.isRequired,  //一级分类的数组
        parentId: PropTypes.string.isRequired,  //父分类id
        setForm: PropTypes.func.isRequired 
    }

    UNSAFE_componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const {categorys,parentId} = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categorys.map((item,index) => <Option key={index} value={item._id}>{item.name}</Option> )
                                }
                            </Select>
                        )
                    }

                </Item>

                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: '',
                            rules:[
                                {required:true,message:'请输入分类名称!'}
                            ]
                        })(
                            <Input placeholder='请输入分类名称' />
                        )
                    }

                </Item>

            </Form>
        );
    }
}

export default Form.create()(AddForm)