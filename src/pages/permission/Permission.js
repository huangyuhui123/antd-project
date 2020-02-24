import React, { Component } from 'react'
import { Button,Card} from 'antd'

export default class Permission extends Component {
    render() {
        return (
            <div>
                <Card>
                    <Button type="primary" onClick={this.handleRole}>创建角色</Button>
                    <Button type="primary" onClick={this.handdlePermission}>设置权限</Button>
                    <Button type="primary" onClick={this.handleUserAuth}>用户权限</Button>
                </Card>
            </div>
        )
    }
}
