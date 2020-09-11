import React from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal,Icon, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {BASE_IMG} from '../../utils/constants'
import {reqDeleteImg} from '../../api'

// 用于图片上传的组件
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false, //标识是否显示大图预览modal
    previewImage: '', //大图的url
    previewTitle: '',
    fileList: [
    //   {
    //     uid: '-1', //每个file都有的唯一id
    //     name: 'image.png', //图片的文件名
    //     status: 'done', //图片的状态:
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', //图片地址
    //   }
    ],
  };

  constructor(props){
    super(props)

    let fileList = []

    // 如果传入了imgs属性
    const {imgs} = this.props
    if(imgs && imgs.length>0){
      fileList = imgs.map((v,i)=> ({
        uid: -i, //每个file都有的唯一id
        name: v, //图片的文件名
        status: 'done', //图片的状态:
        url:BASE_IMG + v //图片地址
      }))
    }

    // 初始化状态
    this.state = {
      previewVisible: false, //标识是否显示大图预览modal
      previewImage: '', //大图的url
      fileList //所有已上传图片的数组
    }
  }
  /*
    获取所有已上传的图片文件名的数组
  */ 
  getImgs = () =>{
    return this.state.fileList.map((v,i) =>v.name)
  }

//   隐藏modal框
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    // 显示指定file对应的大图
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  /*
    file:当前操作的图片文件(上传/删除)
    fileList:所有已上传图片文件对象的数组
  */ 
  handleChange = async ({ fileList,file }) => {
    // console.log('handleChange()',file,fileList)
    // 一旦上传成功，将当前上传的file的信息进行修正(name,url)
    if(file.status==='done'){
        const result = file.response
        if(result.status===0){
            message.success('上传成功!')
            const {name,url} = result.data
            file = fileList[fileList.length-1]
            file.name = name
            file.url = url
        }else{
            message.error('上传失败!')
        }
    }else if(file.status==='removed'){ //删除图片
      const res = await reqDeleteImg(file.name)
      if(res.status===0){
        message.success('删除成功!')
      } else{
        message.error('删除失败!')
      }
    }


    // 在操作(上传/删除)过程中更新fileList状态
    this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload" //上传图片的接口地址
          accept='image/*' //只接受图片类型文件
          name='image' //请求参数名
          listType="picture-card" //卡片样式
          fileList={fileList} //所有已上传图片文件对象的数组
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
