import jsonp from 'jsonp'

import ajax from './ajax'
import { message } from 'antd';


const BASE = ''

// 登录
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list',{parentId})
// 添加分类
export const reqAddCategory = (categoryName,parentId) => ajax(BASE + '/manage/category/add',{categoryName,parentId},'POST')
// 更新分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax(BASE + '/manage/category/update',{categoryId,categoryName},'POST')
// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info',{categoryId})
// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})
/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = ({pageNum, pageSize,searchName, searchType}) => ajax(BASE + '/manage/product/search',{
    pageNum, 
    pageSize,
    [searchType]: searchName,
})

// 更新商品状态（上架、下架）
export const reqUpdateStatus = (productId,status) => ajax(BASE + '/manage/product/updateStatus',{productId,status},'POST' )

// 删除图片
export const reqDeleteImg = (name) => ajax(BASE+'/manage/img/delete',{name},'POST')

// 添加商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE+'/manage/product/'+(product._id?'update':'add'),product,'POST')

// 修改商品
export const reqUpdateProduct = (product) => ajax(BASE+'/manage/product/update',product,'POST')

// 获取所有角色列表
export const reqRoles = () => ajax(BASE+'/manage/role/list')

// 新建角色
export const reqAddRole = (roleName) => ajax(BASE+'/manage/role/add',{roleName},'POST')

// 更新角色/权限设置
export const reqUpdateRole = (role) => ajax(BASE+'/manage/role/update',role,'POST')

// 获取用户列表
export const reqUsers = () => ajax(BASE+'/manage/user/list')

// 删除用户
export const reqDeleteUser = (userId) => ajax(BASE+'/manage/user/delete',{userId},'POST')

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE+'/manage/user/'+(user._id?'update':'add'),user,'POST')

// jsonp请求的接口请求
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            // 如果成功了
            if (!err && data.status === 'success') {
                // 取出需要的实际
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather})
            } else {
                // 如果失败了
                message.error('获取天气信息失败')
            }

        })
    })

}
// reqWeather('武汉')