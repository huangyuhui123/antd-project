import React, { Component } from 'react'
import {Form,Card,Select, Button, DatePicker,Table, Modal} from 'antd'
import axios from '../../axios'
import Utils from '../../utils/utils'
import BaseForm from './../../components/BaseForm'
const Option = Select.Option
 

export default class Order extends Component {
    state={
        list:[],
        selectedItem:{}
    }
    params={
        page:1
    }
    formList = [
        {
            type:'SELECT',
            label:"城市",
            placeholder:'全部',
            initialValue:"1",
            field:'city',
            width:80, 
            list:[
                {
                    id:"0",name:"全部"
                },
                {
                    id:"1",name:"北京"
                },
                {
                    id:"2",name:"天津"
                },
                {
                    id:"3",name:"上海"
                },
            ]
        },
        {
            type:'时间查询'
        },
        {
            type:'SELECT',
            label:"订单状态",
            placeholder:'全部',
            initialValue:"1",
            width:80, 
            field:'order_status',
            list:[
                {
                    id:"0",name:"全部"
                },
                {
                    id:"1",name:"进行中"
                },
                {
                    id:"2",name:"结束行程"
                } 
            ]

        }
    ]
    componentDidMount(){
        this.requestList()
    }
    requestList=()=>{
       // let _this = this;
       axios.requestList(this,'/order/list',this.params,true)
      /*   axios.ajax({
            url:'/order/list',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.code==='0'){
                let list = res.result.list.map((item,index)=>{
                    item.key= index
                    return item
                })
                this.setState({
                    list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.page = current;
                        _this.requestList()
                    })
                })
            }
            
        }) */
    }
    openOrderDetail=()=>{
        let item = this.state.selectedItem;
        if(!item){
            Modal.info({
                title:'订单信息',
                content:'请选择一条订单进行结束'

            })
            return;
        }
        //window.location.href=`/#/common/order/detail/${item.id}`
        console.log(`${item.id}`)
       // window.open(`/#/common/order/detail/${item.id}`,'_blank')
        window.open(`/#/common/order/detail/${item.id}`)
    }
    submitFlterForm=(params)=>{
        this.params = params
        this.requestList()
    }
    render() {
        const columns = [
            {
                title:'订单编号',
                dataIndex:'order_sn'
            },
            {
                title: '车辆编号',
                dataIndex: 'bike_sn'
            },
            {
                title: '用户名',
                dataIndex: 'user_name'
            },
            {
                title: '手机号',
                dataIndex: 'mobile'
            },
            {
                title: '里程',
                dataIndex: 'distance',
                render(distance){
                    return distance/1000 + 'Km';
                }
            },
            {
                title: '行驶时长',
                dataIndex: 'total_time'
            },
            {
                title: '状态',
                dataIndex: 'status'
            },
            {
                title: '开始时间',
                dataIndex: 'start_time'
            },
            {
                title: '结束时间',
                dataIndex: 'end_time'
            },
            {
                title: '订单金额',
                dataIndex: 'total_fee'
            },
            {
                title: '实付金额',
                dataIndex: 'user_pay'
            }
        ]
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            type:'radio',
            selectedRowKeys,
            onChange:(selectedRowKeys,selectedRows)=>{
                this.setState({
                    selectedRowKeys,
                    selectedItem:selectedRows[0]
                })
            }
        }
       
        return (
            <div>
                <Card>
                   {/*  <FilterForm wrappedComponentRef={(inst)=>this.orderForm = inst}/> */}
                    <BaseForm formList={this.formList} submitFlterForm={this.submitFlterForm} ></BaseForm>
                </Card>
                <Card style={{marinTop:10}}>
                    <Button type="primary" onClick={this.openOrderDetail}>订单详情</Button>
                    <Button>结束订单</Button>
                </Card>
                <div className="content-wrap">
                    <Table
                        borderd
                        columns={columns}
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        rowSelection={rowSelection}
                        >
                    </Table>
                </div>
            </div>
        )
    }
}


class FilterForm extends React.Component{
    handleSearch=()=>{
     /*    let searchInfo = this.orderForm.props.form.getFieldValue();
        console.log(searchInfo) */
    }

    render(){
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="inline">
                <Form.Item label="城市">
                    {
                        getFieldDecorator('city_id')(
                            <Select
                                style={{width:100}}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">北京市</Option>
                                <Option value="2">天津市</Option>
                                <Option value="3">深圳市</Option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label="订单时间">
                    {
                        getFieldDecorator('star_time')(
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"></DatePicker>
                        )
                    }
                      {
                        getFieldDecorator('end_time')(
                            <DatePicker  style={{marginLeft:5}} showTime format="YYYY-MM-DD HH:mm:ss"></DatePicker>
                         )
                    }
                </Form.Item>
                <Form.Item label="订单状态">
                    {
                        getFieldDecorator('op_mode')(
                            <Select
                                style={{ width: 80 }}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">进行中</Option>
                                <Option value="2">结束行程</Option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item label="加盟商授权状态">
                    {
                        getFieldDecorator('auth_status')(
                            <Select
                                style={{ width: 100 }}
                                placeholder="全部"
                            >
                                <Option value="">全部</Option>
                                <Option value="1">已授权</Option>
                                <Option value="2">未授权</Option>
                            </Select>
                        )
                    }
                </Form.Item>
                <Form.Item>
                    <Button type="primary" style={{margin:'0 20px'}} onClick={this.handleSearch} >查询</Button>
                    <Button>重置</Button>
                </Form.Item>
            </Form>
        );
    }
}
FilterForm = Form.create({})(FilterForm);
