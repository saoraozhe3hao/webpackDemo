require('./index.less');
let React = require('react');

let Detail = React.createClass({
        render: function () {
            return (
                <h1 className='detail'>
                   detail
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

module.exports = Detail;