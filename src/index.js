require('assets/style/reset.css');
require('modules/interceptor');
require('./index.less');

// 初始化App的相关模块引入
require('libs/fastclick-attach');
// require('libs/touch-scroll');

// 引入数据采集模块
let collector = require('libs/collector');
// 混入数据采集的配置项：项目Id、需要采集的api接口列表
_.extend(collector, require('mixins/collector'));

let React = require('react');
let reactRouter = require('react-router');
let Router = reactRouter.Router;
let Route = reactRouter.Route;
let IndexRoute = reactRouter.IndexRoute;
let hashHistory = reactRouter.hashHistory;
let renderApp = require('libs/apprender');
let PageNew = require('pages/new');
let PageWar = require('pages/war');
let PageWarTpl = require('pages/war/tpl');
let PageTplSelect = require('pages/tpl-select');
let PageWars = require('pages/wars');

const App = React.createClass({
    render: function() {
        return (
            <section className="warbreief-app">
                {this.props.children}
            </section>
        );
    }
});



// 渲染App，参数：(appName, router, container)
renderApp(
    'warbreief',
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={PageWars} />
            <Route path="/new" component={PageNew} />
            <Route path="/war" component={PageWar} />
            <Route path="/wartpl" component={PageWarTpl} />
            <Route path="/tpl_select" component={PageTplSelect} />
        </Route>
    </Router>,
    'warbreiefContainer'
);