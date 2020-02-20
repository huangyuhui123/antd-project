//相等于admin.js，包裹详情页的,是一个父容器，承载内容的
import React, { Component } from 'react'
import {Row} from 'antd';
import Header from './components/Header';
import './style/common.less'

export default class admin extends Component {
    render() {
        return (
            <div>
            <Row className="simple-page">
                <Header menuType="second"></Header>
            </Row>
            <Row className="content">
                {this.props.children}
            </Row>
            </div>
        )
    } 
}
