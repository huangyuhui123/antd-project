import React, { Component } from 'react'
import { Table, Card, Row, Col,Button } from 'antd'
import axios from '../../axios/index'
import utils from '../../utils/utils';

export default class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            update_time: '',
        }
    }
    params = {
        page: 1
    }
    componentDidMount() {
        this.request();
        document.addEventListener('onload',this.cancelTimer())
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
            this.setState({
                dataSource: list,
                totalInfo: res.totalInfo
            })

        })
    }

    sorter = (key) => {
        return (rowa, rowb) => {
            return  key === "timeStamp" ? this.sortFun(new Date(rowa[key]), new Date(rowb[key]))
                        : this.sortFun(rowa[key], rowb[key])
        }
            
    }

    sortFun = (a, b) => {
        if ((typeof a) !== "number") {
            //console.log(Object.prototype.toString.call(a), a,a instanceof Date)
            if ( a instanceof Date) {
                return new Date(a).getTime() - new Date(b).getTime();
            } else {
                return a.localeCompare(b, 'zh')
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
                collist.push(<Col span={2} key={key} >{totallist[key]}</Col>)
            }

        }
        let footer = <Row>
            <Col span={3}>合计</Col>
            <Col span={17}></Col>
            {collist}
        </Row>
        console.log(footer) 
        return footer
    }

    setTimeResh = () =>{
        const  update_time = utils.formatDate1(new Date(),'hh:mm:ss')
        console.log(update_time)
        let _this = this;
        const setTime = 1000*60*10;
        this.clearTimer()
        this.timer = setInterval(()=>{
            console.log('刷新一次')
            _this.setState({
                update_time: update_time
            })
            _this.request();
        },setTime)
        console.log(this.state.update_time)
    }

    clearTimer = () =>{
        if(this.timer){
            clearInterval(this.timer)
        }
    }
     cancelTimer = () =>{
        utils.debounce(this.setTimeResh(),5000)
     }
 
    hanldResh = () =>{
       const update_time = utils.formatDate1(new Date(),'hh:mm:ss')
       this.clearTimer();
       this.request();
       this.setState({
           update_time: update_time
       })
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
                width: 120,
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
                    上次更新时间{this.state.update_time||''},每隔十分钟自动刷新一次
                    {
                        this.setTimeResh()
                    }
                </Row>
                <Row>
                    <Button onClick={this.hanldResh}>手动刷新</Button>
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
