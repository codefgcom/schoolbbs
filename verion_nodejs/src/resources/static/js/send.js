layui.use(function () {
    layui.form.on('submit(sendBtn)', function (data) {
        if (parent && parent.page && parent.page.sendMsg) {
            parent.page.sendMsg(data.field);
        } else {
            layui.layer.msg('只能在嵌套中使用')
        }
        return false;
    });
});