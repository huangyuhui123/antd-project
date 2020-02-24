import React from 'react';
import { HashRouter, Route, Switch} from 'react-router-dom';
import App from './App'
import Login from './pages/login';
import Admin from './Admin';
import Detail from './pages/order/Detail'
import Buttons from './pages/ui/buttons'
import NoMatch from './pages/nomatch';
import basicTable from './pages/table/basicTable';
import highTable from './pages/table/highTable';
import City from './pages/city/City'
import Order from './pages/order';

import Common from './common'
import Demo from './pages/demo/Demo';
import Permission from './pages/permission/Permission';
import User from './pages/user/User';


export default class IRouter extends React.Component{
    render(){
        return(
            <HashRouter>
                {/* 由于登陆，主页，详情页三个页面是平级的，所以需要把这三个组件放在一个大的组件包裹起来，不用div包裹 */}
                {/* 子路由需要使用render放法 */}
                <App>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/admin" render={()=>
                        <Admin>
                            <Switch>
                            <Route path="/admin/ui/buttons" component={Buttons}></Route>
                            <Route path="/admin/table/basic" component={basicTable}></Route>
                            <Route path="/admin/table/high" component={highTable}></Route>
                            <Route path="/admin/city" component={City}></Route>
                            <Route path="/admin/order" component={Order}></Route>
                            <Route path="/admin/permission" component={Permission}></Route>
                            <Route path="/admin/user" component={User}></Route>
                            <Route component={NoMatch}></Route>
                            </Switch>
                        </Admin>
                    }>
                    </Route>
                    <Route path="/common" render={()=>
                       <Common>
                           <Route path="/common/order/detail/:orderId" component={Detail}>
                           </Route>
                           <Route path="/common/demo" component={Demo}>
                           </Route>
                       </Common>
                    }></Route>
                </App>
            </HashRouter>
        )
    }
}