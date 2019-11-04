import React, { Component } from 'react';
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'
import { async } from 'q';

// 商品分类路由
export default class Category extends Component {
    state = {
        loading: false, //是否正在获取数据中
        categorys: [], //一级分类列表
        subCategorys: [], //二级分类列表
        parentId: '0', //当前需要显示的分类列表的parentId
        parentName: '', //当前需要显示的分类列表的父分类名称
        showStatus: 0, //标识添加/更新的确认框是否显示 0:都不显示，1:显示添加,2:显示更新
    }

    /*
        初始化table所有列数组
    */
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => ( //返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {/* 如何向事件回调函数传递参数:先定义一个匿名函数，在函数中调用处理的函数并传入数据 */}
                        {
                            this.state.parentId === '0' ? <LinkButton onClick={() => { this.showsubCategorys(category) }}>查看子分类</LinkButton>
                                : null
                        }

                    </span>
                )
            }
        ];
    }

    // 异步获取分类列表显示
    getCategorys = async () => {
        // 再发请求前显示loading
        this.setState({
            loading: true
        })
        const { parentId } = this.state
        // 发异步ajax请求获取数据

        const result = await reqCategorys(parentId)
        // 在请求完成之后关闭loading
        this.setState({
            loading: false
        })
        if (result.status == 0) {
            //   取出分类数组（可能是一级，也可能是二级）
            const categorys = result.data
            if (parentId === '0') {
                // 更新一级分类状态
                this.setState({ categorys })
            } else {
                // 更新二级分类状态
                this.setState({ subCategorys: categorys })
            }

        } else {
            message.error('获取分类列表失败')
        }
    }

    // 显示制定一级分类对象的二级子分类列表
    showsubCategorys = (category) => {
        // 更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { //在状态更新且从那个心render之后执行
            // 获取二级分类列表显示
            this.getCategorys()
        })
        // setState()不能立即获取最新的状态:此方法是异步更新状态
    }

    // 显示指定一级分类列表
    showFirstcategorys = () => {
        // 更新显示为一级列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }

    // 响应点击取消隐藏确认框
    handleCancel = () => {
        // 清除输入数据
        this.form.resetFields()
        // 隐藏确认框
        this.setState({
            showStatus: 0
        })
    }

    // 显示添加分类确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    // 添加分类
    addCategory = () => {
        console.log('addCategory()')
    }

    // 显示更新分类列表确认框
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category
        // 更新状态
        this.setState({
            showStatus: 2
        })
    }

    // 更新分类
    updateCategory = async () => {
        console.log('updateCategory()')

        // 隐藏确认框
        this.setState({
            showStatus: 0
        })

        // 准备数据
        const categoryId = this.category._id
        const categoryName = this.form.getFieldValue('categoryName')
        // 清除输入数据
        this.form.resetFields()

        // 发请求更新分类
        const result = await reqUpdateCategory({ categoryId, categoryName })
        if (result.status == 0) {
            // 更新显示列表
            this.getCategorys()
        }

    }

    // 视为第一次render准备数据
    componentWillMount() {
        this.initColumns()
    }

    // 发异步ajax请求
    componentDidMount() {
        // 获取一级分类列表
        this.getCategorys()
    }

    render() {

        // 读取状态数据
        const { categorys, subCategorys, parentId, parentName, showStatus, loading } = this.state
        // 读取指定的分类
        const category = this.category || {} //如果还没有指定一个空对象

        // card的左侧
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showFirstcategorys}>一级分类列表</LinkButton>
                <Icon type="arrow-right" style={{ marginRight: 10 }} />
                <span>{parentName}</span>
            </span>
        )
        // card的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <Icon type='plus'></Icon>
                添加
            </Button>
        )

        return (
            <Card title={title} extra={extra} >
                <Table loading={loading} pagination={{ defaultPageSize: 5, showQuickJumper: true }} rowKey='_id' bordered dataSource={parentId === '0' ? categorys : subCategorys} columns={this.columns} />

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm />
                </Modal>

                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm categoryName={category.name} setForm={(form) => {this.form=form}} />
                </Modal>
            </Card>
        );
    }
}
