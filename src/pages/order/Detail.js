import React, { Component } from 'react'
import {  Card, } from 'antd'
import axios from '../../axios'
import  './detail.less';


export default class Detail extends Component {
    state = {}
    componentDidMount() {
        let orderId = this.props.match.params.orderId;
        if (orderId) {
            this.getDetailInfo(orderId)
        }
    }
    getDetailInfo = (orderId) => {
        axios.ajax({
            url: '/order/detail',
            data: {
                params: {
                    orderId: orderId
                }
            }
        }).then((res) => {
            if (res.code === '0') {
                this.setState({
                    orderInfo: res.result
                })
                this.renderMap(res.result)
               
            }
        })
    }

    //初始化地图
    renderMap= (result)=>{
        /* 因为是但页面应用，每个页面都是一个模块，只有通过import引入的变量才能使用，在此模块没有引入，所以BMap会报未定义，但是BMap是通过script标签引入的，
        所以解决这种第三方插件找不到变量的解决方法 是，把这个插件挂到window下，*/
        //this.map= new BMap.Map('orderDetailMap',{enableMapClick:false})
        this.map= new window.BMap.Map('orderDetailMap',{enableMapClick:false})
        this.map.centerAndZoom('北京',11);  
        this.addMapControl()
        this.drawBikeRoute(result.position_list);

        this.drawServiceArea(result.area)
    }

    //添加地图控件
    addMapControl=()=>{
        let map = this.map;
        map.addControl(new window.BMap.NavigationControl({anchor:window.BMAP_ANCHOR_TOP_RIGHT})); 
        map.addControl(new window.BMap.ScaleControl({anchor:window.BMAP_ANCHOR_TOP_RIGHT}));
    }
    //绘制用户的行驶路线
    drawBikeRoute=(positionList)=>{
        let startPoint = '';
        let endPoint = '';
        if(positionList.length>0){
            //创建起始点
            let first = positionList[0];
            startPoint = new window.BMap.Point(first.lon,first.lat);
            let startIcon = new window.BMap.Icon('/assets/start_point.png',new window.BMap.Size(36,42),{ //设置外边icon的大小
                imageSize: new window.BMap.Size(36,42), //设置图片的大小
                anchor:new window.BMap.Size(36,42)
            })

            let startMaker = new window.BMap.Marker(startPoint,{icon:startIcon})
            this.map.addOverlay(startMaker)

            //创建终点
            let last = positionList[positionList.length-1];
            endPoint = new window.BMap.Point(last.lon,last.lat);
            let endIcon = new window.BMap.Icon('/assets/end_point.png',new window.BMap.Size(36,42),{ //设置外边icon的大小
                imageSize: new window.BMap.Size(36,42), //设置图片的大小
                anchor:new window.BMap.Size(36,42)
            })

            let endMaker = new window.BMap.Marker(endPoint,{icon:endIcon})
            this.map.addOverlay(endMaker)

            //连接路线图
            let trackPoint = [];
            for(let i = 0;i<positionList.length;i++){
                let point = positionList[i];
                trackPoint.push(new window.BMap.Point(point.lon,point.lat))
            }

            let polyline = new window.BMap.Polyline(trackPoint,{
                strokeColor:'#1869AD',
                strokeWeigth:3,
                strokeOpacity:1
            })

            this.map.addOverlay(polyline);
            this.map.centerAndZoom(endPoint,11) //以终点为中心点

        }
    }

    //绘制服务区
    drawServiceArea=(positionList)=>{
        //生成点连线连接区域线路图
        let trackPoint = [];
            for(let i = 0;i<positionList.length;i++){
                let point = positionList[i];
                trackPoint.push(new window.BMap.Point(point.lon,point.lat))
            }
        //绘制多边形区域
         let polygon = new window.BMap.Polygon(trackPoint,{
             strokeColor:'#CE0000',
             strokeWeigth:4,
             strokeOpacity:1,
             fillColor:"#ff8605",
             fillOpacity:0.4
         })

         this.map.addOverlay(polygon)
    }

    render() {
        const info = this.state.orderInfo || {}
        return (
            <div>  
                <Card>
                    <div id="orderDetailMap" className="order-map"></div>
                    <div className="detail-items">
                        <div className="item-title">基础信息</div>
                        <ul className="detail-form">
                            <li>
                                <div className="detail-form-left">用车模式</div>
                                <div className="detail-form-content">{info.model === 1 ? '服务区' : '停车点'}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">订单编号</div>
                                <div className="detail-form-content">{info.order_sn}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">车辆编号</div>
                                <div className="detail-form-content">{info.bike_sn}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">用户姓名</div>
                                <div className="detail-form-content">{info.username}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">手机号码</div>
                                <div className="detail-form-content">{info.mobile}</div>
                            </li>
                        </ul>
                    </div>
                    <div className="detail-items">
                        <div className="item-title">行驶轨迹</div>
                        <ul className="detail-form">
                            <li>
                                <div className="detail-form-left">行程起点</div>
                                <div className="detail-form-content">{info.start_location}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">行程终点</div>
                                <div className="detail-form-content">{info.end_location}</div>
                            </li>
                            <li>
                                <div className="detail-form-left">行程里程</div>
                                <div className="detail-form-content">{info.distance}</div>
                            </li>
                        </ul>
                    </div>
                </Card>
            </div>
        )
    }
}
