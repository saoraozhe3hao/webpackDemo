require('./index.less');
require('modules/counter');
let React = require('react');
let Icon = require('components/icon/icon');
let Dialog = require('global/dialog');
let DialogContent = Dialog.DialogContent;
let Avatar = require('components/avatar');
let api = require('modules/api');
let classnames = require('libs/classnames');
let Alert = require('global/alert');
let pay = require('modules/pay');
let util = require('modules/util');
let collector = require('libs/collector');
let payConfig;
let GlobalLoading = require('global/loading-global');
let Toast = require('global/toast');
let AwardDialog = React.createClass({
    getInitialState() {
            return {
                users: [],
                title: '',
                money: 0,
                selectedIds: []
            }
        },
        /**
         * @function 初始化用户和全选
         */
        init() {
            let users = util.formatUsers(this.props.detail.signerInfos);
            let selectedIds = this.getAllUserIds(users);
            this.setState({
                users: users,
                selectedIds: selectedIds
            });
        },
        componentWillMount() {
            this.init();
        },
        componentDidMount() {
            let me = this;
            if (!payConfig) {
                api.getPaymentConfig({
                    flag: 1
                }, function(data) {
                    payConfig = JSON.parse(data.config);
                    me.refresh();
                });
            } else {
                me.refresh();
            }
        },
        componentDidUpdate(){
          
        },
        /**
         * 选中所有签单人
         *
         */
        getAllUserIds(users) {
            let result = [];
            let selfID = window.curUserInfo.openUserId;
            for (var i = 0, len = users.length; i < len; i++) {
                if (users[i].id != selfID) {
                    result.push(users[i].id);
                }
            }
            return result;
        },
        /**
         *@function 
         * 选择要打赏的人
         */
        select(e) {
            let $item = $(e.target).parents('.avatar-item');
            let index = $item.index();
            let users = this.state.users;
            let currentId = users[index].id;
            let selectedIds = this.state.selectedIds;
            let findIndex = this.isSelected(currentId);
            if (findIndex == -1) {
                selectedIds.push(currentId)
                    //未选中
                this.setState({
                    selectedIds: selectedIds
                });
            } else {
                selectedIds.splice(findIndex, 1);
                this.setState({
                    selectedIds: selectedIds
                });
                //勾选掉签单人的次数
                collector.log('warbreief_selectUserWhenAward');
            }
        },
        isSelected(id) {
            return this.state.selectedIds.indexOf(id);
        },
        /**
         *@function 
         * 下单
         */
        createPay() {
            let me = this;
            if (me.paying) {
                return;
            }
            me.paying = true;
            let selectedIds = this.state.selectedIds;
            let detail = this.props.detail;
            if (selectedIds.length < 1) {
                me.paying = false;
                return Alert.show('请选择打赏人');
            }
            //点击赏并发起付款的次数
            collector.log('warbreief_callPay');
            GlobalLoading.show('');
            api.createPayment({
                clientInfo: util.getClientInfo(),
                battleId: detail.battleId,
                words: me.state.title,
                money: me.state.money,
                signerIds: selectedIds
            }, (data)=> {

                let paymentId = data.paymentId;
                let form = {
                    amount: data.payMoney, // 金额，单位：分
                    wareId: paymentId, // 业务编号
                    wareName: data.wareName, // 商品名称
                    merchantId: data.merchantId,
                    sign: data.sign,
                    limitPayer: data.limitPayer,
                    fromEa: data.fromEa,
                    fromUid: data.fromUid,
                    expireTime: data.expireTime
                };

                // me.finishPay(form);
                pay.create(form, function() {
                    GlobalLoading.hide();
                    me.paying = false;
                    me.finishPay(form);
                },function(){
                    GlobalLoading.hide();
                    me.paying = false;
                });
            });
        },
        /**
         * @function
         * 完成订单
         */
        finishPay(opts) {
            Toast.show('打赏成功',2000);
            this.close();
            GlobalLoading.hide();
            this.props.refreshAwards({
                moneyCal: Number(opts.amount),
                numCal:1
            });
            collector.log('warbreief_paySuccess');
        },
        /**
         *@function 
         * 刷新打赏金额
         */
        refresh() {
            if(this.animated){
                return;
            }
            let num = Math.floor(Math.random() * 5);
            if (payConfig[num].m == this.state.money) {
                num = (num + 1) % 5;
            }
            this.setState({
                title: payConfig[num].w,
                money: payConfig[num].m
            });
            this.refs.dialog.setTitle(payConfig[num].w);
            //金额刷新次数
            collector.log('warbreief_refreshPayMoney');
           setTimeout(()=>{
                this.animated=  true;
                let duringTime = 400;
                 $('.j-counter span').counterUp({
                    delay: 4,
                    time: duringTime,
                    cb:()=>{
                        this.animated = false;
                    }
                 });
            },10)
        },
        render: function() {
            let users = this.state.users;
            let me = this;
            return (
                <Dialog ref="dialog" maskClosable={true} className="award-dialog" title={me.state.title} width={640} modal={true} horizontal="center" vertical="center" visible={true}>
                    <DialogContent>
                        <div className="avatar-list" ref="avatarList" >
                        {
                            users.map((item, index)=>{
                                return(
                                    <div className={classnames('avatar-item',me.isSelected(item.id)>-1?'active':'')} key={index}>
                                        <div className="img-box">
                                            <Avatar src={item.img} onClick={me.select} id={item.payerId}/>
                                            <Icon name="avatar-select"/>
                                            <Icon name="avatar-selected"/>
                                        </div>
                                        <p className="name">{item.name}</p>
                                        <p className="money j-counter"><span>{this.state.money}</span>元</p>
                                    </div>
                                );
                            })
                        }
                        </div>
                        <div className="refresh-money">
                            <span onClick={this.refresh}>
                                <Icon name="refresh"/>
                                切换金额
                            </span>
                        </div>
                        <div  className={classnames('award-btn',this.state.selectedIds.length === 0?'disable':'')}  onClick={me.createPay}>
                            打赏
                        </div>
                    </DialogContent>
                    <div onClick={this.close}><Icon name="hb-close"/></div>
                </Dialog>
            );
        },
        open() {
            this.init();
            this.refs.dialog.open();
        },
        close() {
            this.refs.dialog.close();
        }
});

module.exports = AwardDialog;