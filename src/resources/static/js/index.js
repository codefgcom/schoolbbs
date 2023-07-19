layui.use(function () {
    var util = layui.util;
    // 自定义固定条
    util.fixbar({
        bars: [{
            type: 'send',
            content: '发',
            style: 'font-size: 21px;',
            style: 'background-color: #FF5722;'
        }, {
            type: 'refresh',
            icon: 'layui-icon-refresh',
        }, {
            type: 'help',
            icon: 'layui-icon-help'
        },],
        on: {
            mouseenter: function (type) {
                let tipMsg = {
                    help: '帮助&关于',
                    send: '我也发一条',
                    refresh: '随机刷新数据'
                }
                layer.tips(tipMsg[type], this, {
                    tips: 4,
                    fixed: true
                });
            },
            mouseleave: function (type) {
                layer.closeAll('tips');
            }
        },
        // 点击事件
        click: function (type) {
            console.log(this, type);
            // layer.msg(type);
        }
    });
});