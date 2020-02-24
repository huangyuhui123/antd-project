import React, { Component } from 'react'
import { Form, Checkbox,Input,Select,Button, DatePicker} from 'antd'
import Utils from '../../utils/utils';

 class BaseForm extends Component {

    initFormList= ()=>{
        const {getFieldDecorator} = this.props.form;
        const formList = this.props.formList;
        const formItemList = []
        if(formList && formList.length>0){
            formList.forEach((item,i)=>{
                let label = item.label;
                let field = item.field;
                let initialValue = item.initialValue;
                let placeholder = item.placeholder;
                let width = item.width;
                if(item.type === '城市'){
                    const CITY = <Form.Item label="城市" key={field}>
                        {getFieldDecorator('city',{
                            initialValue:'0'
                        })(
                            <Select
                            style={{width:width}}
                            placeholder={placeholder}
                        >
                           {Utils.getOptionList(
                            [
                                {id:'0',name:'全部'},
                                {id:'1',name:'北京'},
                                {id:'2',name:'上海'},
                                {id:'3',name:'天津'},
                                {id:'4',name:'杭州'},
                            ])}  
                        </Select>
                        )}
                    </Form.Item>
                    formItemList.push(CITY)
                }else  if(item.type === '时间查询'){
                    const begin_time = <Form.Item label="时间查询">
                        {
                            getFieldDecorator('begin_time')(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY_MM_DD"></DatePicker>
                            )
                        }
                    </Form.Item>
                    formItemList.push(begin_time)
                    const end_time= <Form.Item label="~" colon={false} key={field}>
                    {
                        getFieldDecorator('end_time')(
                            <DatePicker showTime={true} placeholder={placeholder} format="YYYY_MM_DD"></DatePicker>
                        )
                    }
                    </Form.Item>
                      formItemList.push(end_time)
                }
                else if(item.type === 'INPUT'){
                    const INPUT = <Form.Item label={label} key={field}>
                        {getFieldDecorator([field],{
                            initialValue:initialValue
                        })(
                            <Input type="text" placeholder={placeholder}></Input>
                        )}
                    </Form.Item>
                    formItemList.push(INPUT)
                }else if(item.type==='SELECT'){
                    const SELECTE = <Form.Item label={label} key={field}>
                        {getFieldDecorator([field],{
                            initialValue:initialValue
                        })(
                            <Select
                            style={{width:width}}
                            placeholder={placeholder}
                        >
                           {Utils.getOptionList(item.list)}
                        </Select>
                        )}
                    </Form.Item>
                    formItemList.push(SELECTE)
                }else if(item.type==='CHECKBOX'){
                    const CHECKBOX = <Form.Item label={label} key={field}>
                        {getFieldDecorator([field],{
                            valuePropName:'checked',
                            initialValue:initialValue //必须是true 或者false
                        })(
                         <Checkbox>
                             {label}
                         </Checkbox>
                        )}
                    </Form.Item>
                    formItemList.push(CHECKBOX)
                }else if(item.type==="DATE"){
                        const DATE_PICKER = <Form.Item label={label} key={field}>
                            {
                        getFieldDecorator('user_date')(
                            <DatePicker showTime={true} placeholder={placeholder} format="YYYY_MM_DD"></DatePicker>
                            )
                        }
                        </Form.Item>
                        formItemList.push(DATE_PICKER)
                }
            })
        }
        return formItemList

    }

    handleFilterSubmit=()=>{
         let fieldValues = this.props.form.getFieldsValue();
         this.props.submitFlterForm(fieldValues)

    }
    reset=()=>{
        this.props.form.resetFields()
    }
    render() {
        return (
            <Form layout="inline">
                {this.initFormList( )}
                <Form.Item>
                    <Button type="primary" style={{margin:'0 20px'}} onClick={this.handleFilterSubmit} >查询</Button>
                    <Button onClick={this.reset}> 重置</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create({})(BaseForm)