import React, { Component } from 'react'
import { Table, Card, Divider, Row, Col,Button } from 'antd'
import axios from '../../axios/index'
import utils from '../../utils/utils';

export default class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            update_time: ''
        }
    }
    params = {
        page: 1
    }
    componentDidMount() {
        this.request();
    }

    request = () => {
        axios.ajax1({
            url: '/demo',
            data: {
                params: {
                    page: this.params.page
                }
            }
        }).then((res) => {
            let list = res.allSchoolInfos.map((item, index) => {
                item.key = index + 1;
                return item;
            })
            //const totalList = list.length>0?[...list,{key:'','schoolName':'合计',...res.totalInfo}]:[]
            // console.log(list)
            this.setState({
                dataSource: list,
                totalInfo: res.totalInfo

            })

        })
    }

    sorter = (key) => {
        return (rowa, rowb) => this.sortFun(rowa[key], rowb[key])
    }

    sortFun = (a, b) => {
        if ((typeof a) !== "number") {
            if (new Date(a) instanceof Date) {
                return new Date(a).getTime() - new Date(b).getTime();
            } else {
                console.log(a, b)
                return a.chinese.localeCompare(b.chinese, 'zh')
            }
        } else {
            return a - b
        }
    }

    handlefooter = () => {
        let totallist = this.state.totalInfo;
        let collist = []
        for (let key in totallist) {
            if (key !== "totalTargetAttendNum"&& key!=='totalAttendNum') {
                collist.push(<Col span={3} key={key}>{totallist[key]}</Col>)
            }

        }
        let footer = <Row>
            <Col span={4}>合计</Col>
            <Col span={14}></Col>
            {collist}
        </Row>
        console.log(footer) 
        return footer
    }
    timer = setInterval(this.setTimeResh, 1000);

    setTimeResh = () =>{
        let update_time = utils.formatDate1(new Date(),'hh:mm:ss')
        let _this = this;
        const setTime = 1000
       /*  let timer = setInterval(()=>{
            console.log('刷新一次')
            _this.setState({
                update_time: update_time
            })
        },setTime) */
        console.log(update_time)
    }

    hanldResh = () =>{
        if(this.timer){
            clearInterval(this.timer)
        }
    }   


    render() {
        const columns = [
            {
                title: 'id',
                dataIndex: 'key',
                width: 80,
            },
            {
                title: "机构",
                dataIndex: 'schoolName',
                width: 100,
                sorter: this.sorter('schoolName')

            },
            {
                title: "更新时间",
                dataIndex: "timeStamp",
                sorter: this.sorter('timeStamp')
            },
            {
                title: "排课数",
                dataIndex: "totalClassNum",
                width: 80,
                sorter: this.sorter('totalClassNum')
            },
            {
                title: "正在上课数",
                width: 120,
                dataIndex: "totalAttendNum",
                sorter: this.sorter('totalAttendNum')
            }
        ]
        return (
            <Card >
                <Row>
                    上次更新时间{this.state.update_time},每隔十分钟自动刷新一次
                    {
                        //this.setTimeResh()
                    }
                </Row>
                <Row>
                    <Button onClick={this.hanldResh()}>手动刷新</Button>
                </Row>
                <Table
                    bordered
                    columns={columns}
                    dataSource={this.state.dataSource}
                    pagination={false}
                    footer={this.handlefooter}
                ></Table>
            </Card>
        )
    }
}
