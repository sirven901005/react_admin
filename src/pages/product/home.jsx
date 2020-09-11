import React, { Component } from 'react';
import LinkButton from '../../components/link-button'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import { async } from 'q';

const Option = Select.Option

// product的默认子路由组件
export default class ProductHome extends Component {
    state = {
        total: 0, //商品的总数
        products: [], //商品的数组
        loading: false, //是否加载
        searchName: '', // 搜索的关键字
        searchType: 'productName', // 根据哪个字段搜索
    }

    // 初始化table的列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price  // 当前指定了对应的属性, 传入的是对应的属性值
            },
            {
                title: '状态',
                width: 100,
                // dataIndex: 'status',
                render: (product) => {
                    const{status,_id} = product
                    const newStatus = status===1? 2:1
                    return (
                        <span>
                            <Button type='primary' onClick={() => this.updateStatus(_id,newStatus)}>{status === 1 ? '下架' : '上架'}</Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                            {/* 将product对象使用state传递给目标路由组件 */}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
                            <LinkButton onClick={() => {this.props.history.push('/product/add-update',product)}}>修改</LinkButton>
                        </span>
                    )
                }
            },

        ];
    }

    // 获取指定页码的列表数据
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存pageNum让其他方法也能调用
        this.setState({
            loading: true
        })
        const { searchName, searchType } = this.state
        // 如果关键字有值，要做的十搜索分页
        let result
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }

        this.setState({
            loading: false
        })
        if (result.status == 0) {
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    // 更新指定商品的状态
     updateStatus = async (productId,status) =>{
        const result = await reqUpdateStatus(productId,status)
        if(result.status===0){
            message.success('更新商品状态成功')
            this.getProducts(this.pageNum)
        }
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }
    render() {
        const { products, total, loading, searchType, searchName } = this.state


        const title = (
            <span>
                <Select value={searchType} style={{ width: 150 }} onChange={value => this.setState({ searchType: value })}>
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{ width: 150, margin: '0 15px' }} value={searchName} onChange={event => this.setState({ searchName: event.target.value })} />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/add-update')}>
                <Icon type='plus' />
                添加商品
            </Button>
        )



        return (
            <Card title={title} extra={extra}>
                <Table
                    loading={loading}
                    bordered
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    pagination={{ current: this.pageNum, defaultPageSize: PAGE_SIZE, showQuickJumper: true, total, onChange: this.getProducts }}
                />
            </Card>
        );
    }
}
