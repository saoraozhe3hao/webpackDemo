require('./index.less');
let React = require('react');

let List = React.createClass({
        getInitialState: function () {
            return {};
        },
        render: function () {
            return (
                <h1 className='list'>
                    list
                    <img src={require("./images/list.png")}></img>{/* 引入图片，由于它小于8k，会被打成 data url */}
                </h1>
            )
        },
        // 构造默认参数
        getDefaultProps: function () {
            return {
                name: 'Hello World'
            };
        }
    }
);

module.exports = List;