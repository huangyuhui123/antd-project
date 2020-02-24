import React, { Component } from 'react'
import {Card,Button,Table, Modal, Form, Input, Select, DatePicker,Radio} from 'antd'
import BaseForm from '../../components/BaseForm'
import axios from './../../axios'
import ETable from '../../components/ETable'
import utils from '../../utils/utils'
import moment from 'moment'
const RadioGroup = Radio.Group
const Option = Select.Option;


export default class User extends Component {
    constructor(props){
        super();
        this.state={
            list:[],
        }
    }
    params={
        page:1
    }
    formList = [
        {
            type:'INPUT',
            label:"用户名",
            placeholder:'请输入用户名',
            field:'user_name',
            width:80,
        },
        {
            type:'INPUT',
            label:"用户手机号",
            placeholder:'请输入手机号',
            field:'user_mobile',
            width:80,
        },
        {
            type:'DATE',
            label:"请选择入职日期",
            placeholder:'请输入只时间',
            field:'user_date',
            width:80,
        },
    ]
    submitFlterForm=(params)=>{
        this.params = params; 
        this.requestList()
    }
    componentDidMount(){
        this.requestList()
    }

    requestList=()=>{
        console.log('dddd')
        axios.requestList(this,'/table/user_list',this.params,true)
    }

    handleOperate=(type)=>{
        let item =this.state.selectedItem && this.state.selectedItem[0]
        if(type==='create'){
            this.setState({
                title:'创建员工',
                isVisible:true,
                type
            })
        }else if(type==='edit'||type==="detail"){
            if(!item){
                Modal.info({
                    title:'信息',
                    content:'请选择一个用户'
                })
                return
            }
            this.setState({
                title:type=='edit'?'编辑用户':'查看详情',
                isVisible:true,
                userInfo:item,
                type
            })
        }else if(type==='delete'){
            if(!item){
                Modal.info({
                    title:'信息',
                    content:'请选择一个用户'
                })
                return
            }
            Modal.confirm({
                title:'确定删除',
                content:'确定要删除此用户吗',
                onOk:()=>{
                    axios.ajax({
                        url:'/user/delete',
                        data:{
                            params:{
                                id:item.id
                            },
                            isMock:true,
                            isShowLoading:false
                        }
                    }).then((res)=>{
                        this.setState({
                            isVisible:false
                        })
                        this.requestList();
                    })
                }
            })
        }
    }

    handleSubmit=()=>{
        let type = this.state.type;
        let data = this.userForm.props.form.getFieldsValue();
        axios.ajax({
            url:type==='create'?'/user/add':'/user/edit',
            data:{
                params:{
                    ...data
                },
                isMock:true,
                isShowLoading:false
            },
            
        }).then((res)=>{
            if(res.code ==='0'){
                this.setState({
                    isVisible:false
                })
                this.requestList();
            }
        })
    }

    render() {
        const columns = [{
            title: 'id',
            dataIndex: 'id'
          }, {
            title: '用户名',
            dataIndex: 'username'
          }, {
            title: '性别',
            dataIndex: 'sex',
            render(sex){
                return sex ==1 ?'男':'女'
            }
          }, {
            title: '状态',
            dataIndex: 'state',
            render(state){
                let config = {
                    '1':'咸鱼一条',
                    '2':'风华浪子',
                    '3':'北大才子一枚',
                    '4':'百度FE',
                    '5':'创业者'
                }
                return config[state];
            }
          },{
            title: '爱好',
            dataIndex: 'interest',
            render(interest){
                let config = {
                    '1':'游泳',
                    '2':'打篮球',
                    '3':'踢足球',
                    '4':'跑步',
                    '5':'爬山',
                    '6':'骑行',
                    '7':'桌球',
                    '8':'麦霸'
                }
                return config[interest];
            }
          },{
            title: '爱好',
            dataIndex: 'isMarried',
            render(isMarried){
                return isMarried?'已婚':'未婚'
            }
          },{
            title: '生日',
            dataIndex: 'birthday'
          },{
            title: '联系地址',
            dataIndex: 'address'
          },{
            title: '早起时间',
            dataIndex: 'time'
          }
        ]
        let footer = {}
        if(this.state.type==='detail'){
            footer={
                footer:null
            }
        }
        return (
            <div>
               <Card>
                   <BaseForm formList={this.formList} submitFlterForm={this.submitFlterForm} >
                   </BaseForm>
               </Card>
               <Card style={{marinTop:10}} className="operate-wrap">
                    <Button type="primary" icon="plus" onClick={()=>this.handleOperate('create')} style={{marginRight:'10px'}}>创建员工</Button>
                    <Button type="primary" icon="edit" onClick={()=>this.handleOperate('edit')} style={{marginRight:'10px'}}>编辑员工</Button>
                    <Button type="primary" onClick={()=>{this.handleOperate('detail')}} style={{marginRight:'10px'}}>员工详情</Button>
                    <Button type="primary" icon="delete" onClick={()=>this.handleOperate('delete')} style={{marginRight:'10px'}}>删除员工</Button>
                </Card>
                <div className="content-wrap">
                    <ETable 
                        updateSelectedItem={utils.updateSelectedItem.bind(this)}
                        columns={columns}
                        //row_selection="checkbox"
                         dataSource={this.state.list}
                         selectedRowKeys={this.state.selectedRowKeys}
                         //selectedIds={this.state.selectedIds} 单选的时候不需要ids
                         selectedItem={this.state.selectedItem}
                         pagination={this.state.pagination}
                        >
                    </ETable>
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    width={800}
                    onCancel={()=>{
                        this.setState({
                            isVisible:false,
                        })
                    }}
                    {...footer}
                    >
                        <UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef={(inst)=>this.userForm=inst}></UserForm>
                    </Modal>
            </div>
        )
    }
}

class UserForm extends React.Component{
    getState=(state)=>{
       return {
                '1':'咸鱼一条',
                '2':'风华浪子',
                '3':'北大才子一枚',
                '4':'百度FE',
                '5':'创业者'
            }[state];
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        
        const formItemLayout={
            labelCol:{span:5},
            wrapperCol:{span:16}
        }
        const userInfo = this.props.userInfo||{}
        const type= this.props.type
        return(
           <Form layout="horizontal"  {...formItemLayout}>
                <Form.Item label="姓名" >
                    {
                        type==='detail'?userInfo.username:
                        getFieldDecorator('username',
                            {
                                initialValue:userInfo.username
                            }
                        )(
                            <Input type="text" placeholder="请输入姓名"></Input>
                        )
                    }
                </Form.Item>
                <Form.Item label="性别" >
                    {
                        type==="detail"? userInfo.sex===1?'男':'女':
                        getFieldDecorator('sex',{
                            initialValue:userInfo.sex
                        })(
                            <RadioGroup>
                                <Radio value={1}>男</Radio>
                                <Radio value={2}>女</Radio>
                            </RadioGroup>
                        )
                    }
                </Form.Item>
                <Form.Item label="状态">
                    {
                        type==='detail'?this.getState(userInfo.state):
                        getFieldDecorator('state',{
                        initialValue:userInfo.state
                    })(
                        <Select>
                             <Option value={1}>咸鱼一条</Option>
                            <Option value={2}>风华浪子</Option>
                            <Option value={3}>北大才子一枚</Option>
                            <Option value={4}>百度FE</Option>
                            <Option value={5}>创业者</Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="生日">
                        {
                            type==='detail'?userInfo.birthday:
                            getFieldDecorator('birthday',{
                            initialValue:moment(userInfo.birthday)
                        })(
                            <DatePicker></DatePicker>
                            
                        )}
                </Form.Item>
                <Form.Item label="联系地址">
                        {   
                            type==='detail'?userInfo.address:
                            getFieldDecorator('address',{
                            initialValue:userInfo.address
                        })(
                           <Input.TextArea rows={3} placeholder="请输入联系地址"></Input.TextArea>
                        )}
                </Form.Item>
            </Form>
        )
    }
}

UserForm =Form.create({})(UserForm)