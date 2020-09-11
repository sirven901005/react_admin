import React, { Component } from 'react';
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { formateDate } from '../../utils/dataUtils'
import {connect} from 'react-redux'
import {logout} from '../../redux/actions'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
    Tree
} from 'antd'

// 角色管理路由
class Role extends Component {
    state = {
        roles: [], //所有角色的列表
        role: {}, //选中的role
        loading: false,
        isShowAdd: false, //是否显示添加界面
        isShowAuth: false //是否显示设置权限界面
    }

    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    onRow = (role) => {
        return {
            onClick: e => { //点击行
                console.log(role)
                this.setState({ role })
            }
        }
    }

    getRoles = async () => {
        this.setState({
            loading: true
        })
        const res = await reqRoles()
        this.setState({
            loading: false
        })
        if (res.status === 0) {
            this.setState({
                roles: res.data
            })
        }
    }
    // 添加角色
    addRole = () => {
        // 进行表单验证，通过后才可发请求
        this.form.validateFields(async (error, values) => {
            if (!error) {
                // 隐藏确认框
                this.setState({
                    isShowAdd: false
                })

                // 收集输入数据
                const { roleName } = values
                this.form.resetFields()
                // 请求添加
                const res = await reqAddRole(roleName)
                // 根据结果提示/更新列表显示
                if (res.status === 0) {
                    message.success('添加角色成功!')
                    // 新生成的角色
                    const role = res.data
                    // 更新roles状态
                    // const roles = [...this.state.roles]
                    // // this.getRoles()
                    //  roles.push(role)
                    //  this.setState({roles})

                    // 更新roles状态，基于原本状态数据更新
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                } else {
                    message.error('添加角色失败!')
                }

            }
        })

    }

    // 更新角色/设置权限
    UpdateRole = async () => {
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role
        // 得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username
        // 请求更新
        const res = await reqUpdateRole(role)
        if (res.status === 0) {
            message.success('设置角色权限成功!')
            // 如果当前更新的是自己的角色，强制退出登录页
            if (role._id===this.props.user.role_id) {
                // memoryUtils.user = {}
                // storageUtils.removeUser()
                // this.props.history.replace('/login')

                this.props.logout()
                message.success('当前用户角色权限设置成功!')
            } else {
                message.success('设置角色权限成功!')
                this.setState({
                    roles: [...this.state.roles]
                })
            }

        }
    }

    UNSAFE_componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoles()
    }

    render() {
        const { roles, role, loading, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button> &nbsp;
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({ isShowAuth: true })}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    loading={loading}
                    rowSelection={{ 
                        type: 'radio', 
                        selectedRowKeys: [role._id],
                        onSelect:(role)=>{ //选择某个radio时的回调 
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow={this.onRow}
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
                />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({
                            isShowAdd: false
                        })
                    }}
                >
                    <AddForm setForm={(form) => { this.form = form }} />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.UpdateRole}
                    onCancel={() => {
                        this.setState({
                            isShowAuth: false
                        })
                    }}
                >
                    <AuthForm role={role} ref={this.auth} />
                </Modal>
            </Card>
        );
    }
}

export default connect(
    state=> ({user:state.user}),
    {logout}
)(Role)