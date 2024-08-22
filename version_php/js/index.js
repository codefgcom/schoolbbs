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
                            refresh: '随机刷新'
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
                url: '/api/loadData.php',
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
        addPost: function (r, opt) {
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

            if (opt && opt.css) {
                Object.entries(opt.css).forEach(a => p.css(a[0], a[1]));
            }

            //拖拽
            (function (elem) {
                var draggableDiv = elem;
                var offsetX, offsetY;

                // 按下鼠标时的处理函数
                draggableDiv.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    offsetX = e.clientX - draggableDiv.offsetLeft;
                    offsetY = e.clientY - draggableDiv.offsetTop;
                    window.addEventListener('mousemove', dragDiv);
                });

                // 松开鼠标时的处理函数
                draggableDiv.addEventListener('mouseup', function () {
                    window.removeEventListener('mousemove', dragDiv);
                });

                // 拖拽函数
                function dragDiv(e) {
                    draggableDiv.style.left = (e.clientX - offsetX) + 'px';
                    draggableDiv.style.top = (e.clientY - offsetY) + 'px';
                }
            })(p[0]);
        },
        sendMsg: function (r) {
            $.ajax({
                url: '/api/sendMsg.php',
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
                        }, {
                            css: {
                                'z-index': 999999,
                                'background-color': 'rgb(241, 203, 219)'
                            }
                        });
                        layui.layer.msg('保存成功');
                        layui.layer.closeAll('iframe');
                    } else {
                        layui.layer.msg(d.message || '保存失败');
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