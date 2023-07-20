layui.use(function () {

    var o = {
        init: function () {
            this.render();
            this.loadData();
        },
        render: function () {
            layui.util.fixbar({
                bars: [{
                    type: 'send',
                    // content: '发',
                    icon: 'layui-icon-release',
                    style: 'font-size: 21px;background-color: #FF5722;'
                }, {
                    type: 'refresh',
                    icon: 'layui-icon-refresh',
                    style: 'background-color: #29c127;'
                }, {
                    type: 'help',
                    icon: 'layui-icon-help'
                },],
                on: {
                    mouseenter: function (type) {
                        let tipMsg = {
                            help: '帮助&关于',
                            send: '我也发一条',
                            refresh: '刷新随机数据'
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
                    if (type == 'refresh') {
                        o.loadData();
                    } else if (type == 'help') {
                        layer.open({
                            type: 2,
                            title: '关于',
                            area: ['480px', '240px'],
                            content: 'about.html',
                            fixed: false, // 不固定
                            shadeClose: true
                        });
                    } else if (type == 'send') {
                        layer.open({
                            type: 2,
                            title: '发送',
                            area: ['480px', '380px'],
                            content: 'send.html',
                            fixed: false, // 不固定
                            shadeClose: true
                        });
                    }
                }
            });
        },
        loadData: function () {
            $.ajax({
                url: '/loadData',
                success: function (d) {
                    if (d.success) {
                        $("#container").html('');
                        for (var i = 0; d.data && i < d.data.length; i++) {
                            var r = d.data[i];
                            o.addPost(r);
                        }
                    } else {
                        $("#container").html(d.message || '数据加载错误');
                    }
                },
                error: function (e) {
                    console.warn(e);
                    layui.layer.msg('查询失败')
                }
            })
        },
        addPost: function (r) {
            var maxWidth = window.innerWidth - 240;
            var maxHeight = window.innerHeight - 180;

            var p = $("<div>").addClass('post-container');
            var content = $('<div>').addClass('post-content').text(r.content);
            var author = $('<span>').addClass('post-tip-author').text(r.author).attr('title', r.contact_info);
            var time = $('<span>').addClass('post-tip-time').text(r.create_time);
            var tip = $('<div>').addClass('post-tip').append(author).append(time);
            p.append(content).append(tip);
            p.css('z-index', Math.floor(Math.random() * 10000)).css('left', Math.floor(Math.random() * maxWidth) + 'px').css('top', Math.floor(Math.random() * maxHeight) + 'px')
            $("#container").append(p);
        },
        sendMsg: function (r) {
            $.ajax({
                url: '/sendMsg',
                method: 'post',
                data: r,
                async: true,
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                success: function (d) {
                    if (d.success) {
                        o.addPost({
                            content: r.content,
                            author: r.author,
                            create_time: '刚刚',
                            contact_info: r.contact_info
                        });
                        layui.layer.closeAll('iframe');
                    } else {
                        layui.layer.msg(d.message || '数据加载错误');
                    }
                },
                error: function (e) {
                    console.warn(e);
                    layui.layer.msg('保存失败');
                }
            })
        }
    }

    //
    window.page = o;
    window.page.init();

});