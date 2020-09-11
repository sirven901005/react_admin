import React, { Component } from 'react';
import {
    Card,
    Form,
    Input,
    Cascader,
    Upload,
    Button,
    Icon,
    message,
    InputNumber
} from 'antd'
import LinkButton from '../../components/link-button';
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api'

const { Item } = Form
const { TextArea } = Input


// product的新增修改商品子路由组件
class ProductAddUpdate extends Component {
    state = {
        options:[],
    };

    constructor(props){
        super(props)
        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    // 初始化下拉选分类列表数据
    initOptions=async (categorys) => {
        // 根据categorys生成options数组
       const options = categorys.map((v,i) =>({
            value:v._id,
            label:v.name,
            isLeaf:false //不是叶子
        }))

        // 如果是一个二级分类商品的更新
        const {isUpdate,product} = this
        const {pCategoryId,categoryId} = product
        if(isUpdate&&pCategoryId!=='0'){
            // 获取对应的二级分类列表
           const subCategorys = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategorys.map((v,i) => ({
                value:v._id,
                label:v.name,
                isLeaf:true
            }))
            // 找到当前商品对应的一级option对象
            const targetOption = options.find(option=> option.value===pCategoryId)

            // 关联到对应的一级option上
            targetOption.children = childOptions
        }

        // 更新options状态
        this.setState({options})
    }

    // 获取一级/二级分类列表,并显示
    // async函数的返回值是一个新的Promise对象,promise的结果和值由async的结果来决定
    getCategorys=async (parentId) => {
        const result = await reqCategorys(parentId)
        if(result.status===0){
            const categorys = result.data
            // 如果是一级分类列表
            if(parentId==='0'){
                this.initOptions(categorys)
            }else{ //二级列表
                return categorys //返回二级列表 ==>当前async函数返回的promise就会成功且value为categorys
            }
            
        }
    }
    submit = () => {
        // 进行表单校验,如果通过,才发送请求
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                // 1.收集数据,并封装成product对象
                const {name,desc,price,categoryIds} = values
                let pCategoryId,categoryId
                if(categoryIds.length===1){
                    pCategoryId='0'
                    categoryId = categoryIds[0]
                } else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = {
                    name,
                    desc,
                    price,
                    imgs,
                    detail,
                    pCategoryId,
                    categoryId 
                }

                // 如果是更新，需要添加_id
                if(this.isUpdate){
                    product._id = this.product._id
                }
                // 2.调用接口请求函数去添加或者更新
                const result = await reqAddOrUpdateProduct(product)
                // 3.根据结果提示
                if(result.status===0){
                    message.success(`${this.isUpdate?'更新':'添加'}商品成功!`)
                    this.props.history.goBack()
                }else{
                    message.error(`${this.isUpdate?'更新':'添加'}商品失败!`)
                }
                
            }
        })
    }
    // 验证价格的自定义验证函数
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback()
        } else {
            callback('价格必须大于0')
        }
    }
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        
        // 根据选中的分类,请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        // 二级分类列表有数据
        if(subCategorys&&subCategorys.length>0){
            // 生成一个二级列表的options
            const cOptions = subCategorys.map((v,i) =>({
                value:v._id,
            label:v.name,
            isLeaf:true
            }))
            // 关联到当前options上
            targetOption.children = cOptions
        }else{ //当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
            // 更新options状态
          this.setState({
            options: [...this.state.options],
          });
        
      };
      componentDidMount(){
          this.getCategorys('0')
      }

      componentWillMount(){
        //   取出携带的state
        const product = this.props.location.state
        // 保存是否是更新的标识
        this.isUpdate = !!product._id
        // 保存商品(如果没有,保存是{})
        this.product = product || {}
      }
    render() {
        const {isUpdate,product} = this
        const {pCategoryId,categoryId,imgs,detail} = product
        // 用来接收级联分类ID的数组
        let categoryIds = []
        if(isUpdate){
            // 商品是一个一级分类的商品
            if(pCategoryId==='0'){
                categoryIds.push(categoryId)
            }else{
                // 商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
           
        }
        const layout = {
            labelCol: {
                span: 2,
            },
            wrapperCol: {
                span: 8,
            },
        };
        const title = (
            <span>
                <LinkButton onClick={()=>{this.props.history.goBack()}}>
                    <Icon type="arrow-left" style={{ fontSize: 20 }}></Icon>

                </LinkButton>
        <span>{isUpdate?'修改商品':'添加商品'}</span>
            </span>
        )
        const { getFieldDecorator } = this.props.form
        const name = getFieldDecorator('name', {
            initialValue: product.name,
            rules: [
                { required: true, message: '商品名称不能为空!' },
            ]
        })
        const desc = getFieldDecorator('desc', {
            initialValue: product.desc,
            rules: [
                { required: true, message: '商品描述不能为空!' },
            ]
        })
        const price = getFieldDecorator('price', {
            initialValue: product.price,
            rules: [
                { required: true, message: '商品价格不能为空!' },
                { validator: this.validatePrice }
            ]
        })
        const cIds = getFieldDecorator('categoryIds', {
            initialValue: categoryIds,
            rules: [
                { required: true, message: '请选择商品分类!' }
               
            ]
        })
        return (
            <Card title={title}>
                <Form {...layout}>
                    <Item label="商品名称">
                        {
                            name(<Input placeholder="请输入商品名称"></Input>)
                        }

                    </Item>
                    <Item label="商品描述">
                        {
                            desc(<TextArea placeholder="请输入商品描述" autosize={{ minRows: 2, maxRows: 6 }}></TextArea>)
                        }

                    </Item>
                    <Item label="商品价格">
                        {
                            price(<Input type="number" addonAfter="元" placeholder="请输入商品价格" />)
                        }

                    </Item>
                    <Item label="商品分类">
                        {
                            cIds(<Cascader
                                options={this.state.options} //需要显示的列表数据
                                loadData={this.loadData} //当选择某个列表项,加载下一级列表的监听回调
                                placeholder='请选择商品分类'
                            />)
                        }
                        
                    </Item>
                    <Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label="商品详情" labelCol={{span:2}} wrapperCol={{span:20}}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item >
                        <Button type="primary" onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(ProductAddUpdate)

// 1.子组件调用父组件的方法:将父组件的方法以函数属性的形式传递给子组件,子组件就可以调用

// 父组件调用子组件的方法:在父组件中通过ref得到子组件标签对象(也就是组件对象),调用其方法