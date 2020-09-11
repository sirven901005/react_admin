import React, { Component } from 'react';
import {Switch,Route,Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'

import './product.less'

// 商品管理路由
export default class Product extends Component {
    render() {
        return (
           <Switch>
               <Route path='/product' component={ProductHome} exact> 

               </Route>
               <Route path='/product/add-update' component={ProductAddUpdate}>
                   
               </Route >
               <Route path='/product/detail' component={ProductDetail}>
                   
               </Route>
               <Redirect to='/product' />
           </Switch>
        );
    }
}
