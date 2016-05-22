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
let Link = reactRouter.Link;
let IndexLink = reactRouter.IndexLink;
// 引入组件
let List = require('./modules/list');
let Detail = require('./modules/detail');

let ACTIVE = {color: 'red'}
// 顶层组件
const App = React.createClass({
    render: function () {
        return (
            <section className="app">
                <div>
                    <Link to="#/" activeStyle={ACTIVE}>/</Link> {/* Link:跳转路由的链接，activeStyle:当前路径包含to时生效的样式 */}
                </div>
                <div>
                    <IndexLink to="/list" activeStyle={ACTIVE}>List</IndexLink>
                    {/* IndexLink:当前路径等同to时activeStyle才生效 */}
                </div>
                <div>
                    <Link to={{ pathname: '/detail', query: { id: '-1' },state:{id: 2} }}>Detail</Link>
                    {/* Link.to的完整写法，这是一个location对象 */}
                    {/*location.query即问号后面点参数，query会被复制一份到state */}
                </div>
                <div>
                    <Link to="/detail/3" onlyActiveOnIndex={true} activeStyle={ACTIVE}>Detail 3</Link>
                    {/* onlyActiveOnIndex 的效果 跟<IndexLink>相同 */}
                </div>
                <p>
                    <input type='text' ref='nameInput' defaultValue="45" onChange={this.handleChange}/>
                </p>
                <Sub id={this.state.id}/>  {/* state.id 被改变时，Sub 会被重新render */}
                {this.props.children}
            </section>
        );
    },
    getInitialState: function () {
        return {
            id: 0
        };
    },
    // 更新 state
    handleChange: function () {
        console.log(this.refs.nameInput.value);
        this.setState({
            id:this.refs.nameInput.value //通过 ref 获得指定元素，通过 getDOMNode() 获取真实DOM
        })
    }
});

let Sub = React.createClass({
        render: function () {
            console.log('render Sub');
            return (
                <h1 style={{color:'blue'}}>
                    Hello {this.props.id}
                </h1>
            )
        },
        // 构造默认参数
        getDefaultProps: function () {
            return {
                id: 99
            };
        }
    }
);

let auth = function () {
    console.log('auth');
}

// 渲染
ReactDOM.render(
    <Router history={hashHistory} onUpdate={auth}>
        {/* 根路由，及其对应的组件。里面是其嵌套的路由（子路由） */}
        <Route path="/" component={App}>
            {/* 默认子路由，及其对应的组件 */}
            <IndexRoute component={List}/>
            {/* 子路由，及其对应的路径和组件 */}
            <Route path="list" component={List}/>
            <Route path="detail" component={Detail} onEnter={Detail.enterDetail}/>
            {/* onEnter:进入该路由前调用，可以用于判断能不能进入 */}
            <Route path="detail/:id" component={Detail}/>
        </Route>
    </Router>
    ,
    document.getElementById('container')
);