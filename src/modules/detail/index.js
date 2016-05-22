require('./index.less');
let React = require('react');

let Detail = React.createClass({
        render: function () {
            return (
                <h1 className='detail'>
                    detail
                    <div className='detail-img'></div>
                    <div>
                        pathname:{this.props.location.pathname}{/* 获取location对象{pathname,query,state} */}
                    </div>
                    <div>
                        query id:{this.props.location.query.id}{/* 获取url 参数 */}
                    </div>
                    <div>
                        state id:{this.props.location.state && this.props.location.state.id}{/* 获取Link.to中的state */}
                    </div>
                    <div>
                        param id:{this.props.params && this.props.params.id} {/* 获取路径上的 /: 参数 */}
                    </div>
                    <div>
                        路由配置:{JSON.stringify(this.props.routes[0])}
                    </div>
                    <div>
                        当前匹配路由:{JSON.stringify(this.props.routes[1])}
                    </div>
                </h1>
            )
        },
        getDefaultProps: function () {// 构造默认参数
            return {
                name: 'Hello World'
            }
        }
    }
)
Detail.enterDetail = function (nextState, replace) {
    // nextState: 要进入的这个路由的一些信息
    if(nextState.location.query.id < 0){
        // 跳转
        replace({      // 改变location
            pathname: nextState.location.pathname,
            query: {id:0}
        })
    }
}

module.exports = Detail