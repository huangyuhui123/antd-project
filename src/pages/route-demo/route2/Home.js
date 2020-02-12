import React, { Component } from 'react'
import { Link } from 'react-router-dom'


export default class Home extends Component {
    render() {
        return (
                <div>
                    <ul>
                        <li >
                            <Link to="/main">Home</Link>
                        </li>
                        <li >
                            <Link to="/about"> About</Link>
                        </li>
                        <li >
                            <Link to="/topics">Topic</Link>
                        </li>
                    </ul>
                    <hr />
                    {this.props.children}
                </div>
        )
    }
}
