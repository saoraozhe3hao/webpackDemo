require('./index.less');
let React = require('react');

let List = React.createClass({
        render: function () {
            return (
                <h1 className='list'>
                    list
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