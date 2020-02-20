import React from 'react';
import {Select} from 'antd';
const Option = Select.Option;

export default{
    formateDate(time){
        if(!time) return
        let date = new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+":"+date.getSeconds()
    },
    //分页方法的封装，在原有基础上
    pagination(data,callback){
        let page = {
            onChange:(current)=>{
                callback(current)
            },
            current:data.result.page,
            pageSize:data.result.page_size,
            total:data.result.total_count,
            showTotal:(total,range)=>{
                return  `共${data.result.total_count}条`
            },
            showQuickJumper:true
        }
        return page;
    },
    getOptionList(data){
        if(!data){
            return []
        }
        let options =[<Option value="0" key="all_key">全部</Option>]
        data.map((item)=>{
           options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options;
    },

    sorter(key){
        return (rowa,rowb)=> this.sortFun(rowa[key],rowb[key])
    },
    sortFun(a,b){
        if(!a || !b){
            return
        }
        if((typeof a)!== "number"){
           return a.localeCompare(b.chinese, 'zh')
        }
    },

   formatDate1(date, fmt) {
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        let o = {
          'M+': date.getMonth() + 1,
          'd+': date.getDate(),
          'h+': date.getHours(),
          'm+': date.getMinutes(),
          's+': date.getSeconds()
        };
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
          }
        }
        return fmt;
      },

     debounce(fun,delay=50){
        let timer = null;
        return function(...args){
            if(timer) clearTimeout(timer);
            timer = setTimeout(()=>{
                fun.apply(this,args)
            },delay)
        }
    }

}


/* export function debounce(fun,delay=50){
    let timer = null;
    return function(...args){
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            fun.apply(this,args)
        },delay)
    }
} */



/* export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
    }
    return fmt;
  };
  
  function padLeftZero (str) {
    return ('00' + str).substr(str.length);
  };
   */

  function padLeftZero (str) {
    return ('00' + str).substr(str.length);
  };