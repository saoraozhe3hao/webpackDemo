// 一切皆模块，这里引入 less
require('./index.less');

// 引入react
let React = require('react');
let ReactDOM = require('react-dom');
// 引入react 路由
let reactRouter = require('react-router');
let Router = reactRouter.Router;
let Route = reactRouter.Route;
let IndexRoute = reactRouter.IndexRoute;
let hashHistory = reactRouter.hashHistory;
// 引入组件
let List = require('./modules/list');
let Detail = require('./modules/detail');

// 顶层组件
const App = React.createClass({
    render: function () {
        return (
            <section className="app">
                <div><a href='#'>List</a></div>
                <div><a href='#/detail'>Detail</a></div>
                {this.props.children}
            </section>
        );
    }
});

// 渲染
ReactDOM.render(
    <Router history={hashHistory}>
        {/* 根路由，及其对应的组件。里面是其嵌套的路由（子路由） */}
        <Route path="/" component={App}>
            {/* 默认子路由，及其对应的组件 */}
            <IndexRoute component={List}/>
            {/* 子路由，及其对应的路径和组件 */}
            <Route path="/detail" component={Detail}/>
        </Route>
    </Router>,
    document.getElementById('container')
);