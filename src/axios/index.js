import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd'
import Utils from './../utils/utils'


export default class Axios {
    static jsonp(options) {
        return new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response) {
                //to-do
                if (response.status === 'success') {
                    resolve(response)
                } else {
                    reject(response.message)
                }
            })
        })
    }

    static ajax(options) {
        let loading;
        if(options.data && options.data.isShowloading !==false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block'
        }
        let  baseurl = options.data.isMock? "http://yapi.demo.qunar.com/mock/80590/api":''
        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: 'get',
                baseURL: baseurl,
                timeout: 5000,
                params: (options.data && options.data.params) || ''
                //headers：
                //跨域的话需要传cookie
            }).then((response) => {
                if(options.data && options.data.isShowloading !==false){
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none'
                }
                if (response.status === 200 ) { //服务起返回的状态码
                    const res = response.data
                    if (res.code === '0') {// 业务层面定义的code
                        resolve(res)
                    } else {
                        Modal.info({
                            title: "提示",
                            //content:res.data.msg  //老师笔记中的嗲吗吗
                            content: res.msg
                        })
                    }
                } else {
                    reject(response.data)
                }
            })
        })
    }

    static ajax1(options) {
        let loading;
        if(options.data && options.data.isShowloading !==false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block'
        }
        const baseurl = "http://yapi.demo.qunar.com/mock/80590/api/"
        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: 'get',
                baseURL: baseurl,
                timeout: 5000,
                params: (options.data && options.data.params) || ''
                //headers：
                //跨域的话需要传cookie
            }).then((response) => {
                if(options.data && options.data.isShowloading !==false){
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none'
                }
                if (response.status === 200 ) { //服务起返回的状态码
                    const res = response.data
                    /* if (res.code === '0') {// 业务层面定义的code
                        resolve(res)
                    } else {
                        Modal.info({
                            title: "提示",
                            //content:res.data.msg  //老师笔记中的嗲吗吗
                            content: res.msg
                        })
                    } */
                    resolve(res)
                } else {
                    reject(response.data)
                }
            })
        })
    }


    //业务代码的封装:请求数据
    static requestList(_this,url,params,isMock){
        const data={
            params:params,
            isMock
        }
        this.ajax({
            url,
            data:data
        }).then((res)=>{
            if(res.code==='0'){
                let list = res.result.list.map((item,index)=>{
                    item.key= index
                    return item
                })
                _this.setState({
                    list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.page = current;
                        _this.requestList()
                    })
                })
            }
            
        })
    }
}