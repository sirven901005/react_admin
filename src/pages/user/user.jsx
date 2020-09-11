import React, { Component } from 'react';
import {formateDate} from '../../utils/dataUtils'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqUsers,reqDeleteUser,reqAddOrUpdateUser } from '../../api'
import UserForm from './user-form'
import {
    Card,
    Table,
    Button,
    Modal,
    message
} from 'antd'

// 用户路由
export default class User extends Component {
    state = {
        users:[], //所有用户列表
        roles:[], //所有角色列表
        isShow:false, //是否显示确认框
        loading:false,
    }

    // 根据roles数组生成所有角色名的对象(属性名用角色id值)
    initRoleNames =(roles)=>{
        const roleNames = roles.reduce((pre,role)=>{
            pre[role._id] = role.name
            return pre
        },{})
        this.roleNames = roleNames
    }

    initColumns =()=>{
        this.columns=[
            {
                title:'用户名',
                dataIndex:'username',
            },
            {
                title:'邮箱',
                dataIndex:'email',
            },
            {
                title:'电话',
                dataIndex:'phone',
            },
            {
                title:'注册时间',
                dataIndex:'create_time', 
                render:formateDate
            },
            {
                title:'所属角色',
                dataIndex:'role_id',
                render:(role_id) => this.roleNames[role_id]
            },
            {
                title:'操作',
                render:(user) => {
                    return (
                        <span>
                            <LinkButton onClick={()=>this.showUpdate(user)}>修改</LinkButton>
                            <LinkButton onClick={() =>this.deleteUser(user)}>删除</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }

    // 获取用户列表
    getUsers=async() =>{
        this.setState({
            loading:true
        })
        const res = await reqUsers()
        this.setState({loading:false})
        if(res.status===0){
            const {users,roles} = res.data
            this.initRoleNames(roles)
            this.setState({users,roles})
        }
    }

    // 显示添加界面
    showAdd=()=> {
        this.user = null 
        this.setState({isShow:true})
    }

    // 显示修改界面
    showUpdate=(user) => {
        this.user = user //保存user
        this.setState({
            isShow:true
        })
    }

    // 添加或者更新用户
    addOrUpdateUser=async()=>{
        // 1.收集输入数据
        const user = this.form.getFieldsValue()
        this.form.resetFields()

        // 如果是更新,需要给user指定_id属性
        if(this.user){
            user._id = this.user._id
        }
        // 2.提交添加的请求
        const res= await reqAddOrUpdateUser(user)
        
        // 3.更新列表显示
        if(res.status===0){
            message.success(`${this.user?'修改':'添加'}用户成功`)
            this.setState({isShow:false})
            this.getUsers()
        }
    }

    // 删除指定用户
    deleteUser=(user) =>{
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            onOk:async()=> {
              const res = await reqDeleteUser(user._id)
              if(res.status===0){
                message.success('删除用户成功!')
                this.getUsers()
              }
            }
          })
    }

    UNSAFE_componentWillMount(){
        this.initColumns()
    }
    
    componentDidMount(){
        this.getUsers()
    }

    render() {
        const title = (
            <Button type='primary' onClick={() =>this.showAdd()}>创建用户</Button>
        )
        const {users,isShow,loading,roles} = this.state
        const user = this.user ||{}
        return (
            <Card title={title}>
                <Table
                    loading={loading}
                    pagination={{ defaultPageSize: PAGE_SIZE, showQuickJumper: true }}
                    rowKey='_id'
                    bordered
                    dataSource={users}
                    columns={this.columns}
                />

                <Modal
                    title={user._id?'修改用户':'添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() =>{ 
                        this.form.resetFields()
                        this.setState({isShow:false})
                    }} 
                >
                    <UserForm setForm={form =>this.form=form} roles={roles} user={user} />
                </Modal>
            </Card>
        );
    }
}
