tinymce.PluginManager.add('duxstorage', function (editor, url) {
    var duxstorage = {};

    duxstorage.url = editor.getParam('dux_storage_url', '', 'string');
    duxstorage.res = [];

    function escape2Html(str) {
        var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
        return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
    }

    var openStorage = function () {
        var str = editor.getContent(), arr = [];
        str = escape2Html(str);
        var reg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
        while (tem = reg.exec(str)) {
            arr.push(tem[1]);
        }
        var reg = /url\s*\(([^\)]+)\)/gim;
        var reg2 = new RegExp('("|\'|&quot;)', "g");
        while (tem = reg.exec(str)) {
            var value = tem[1];
            value = value.replace(reg2, '');
            arr.push(value);
        }
        var files = [];
        for (var i in arr) {
            var url = arr[i];
            if (url.indexOf(window.location.host) === -1 && /(^\.)|(^\/)/.test(url) === false) {
                files.push(url);
            }
        }
        if (files.length <= 0) {
            editor.notificationManager.open({
                text: '未发现远程图片',
                type: 'warning',
                timeout: 5000,
            });
            return false;
        }
        dialog.confirm({
            title: '是否保存远程图片，共' + files.length + '张？',
            success: function () {
                editor.notificationManager.open({
                    text: '保存远程图片中...',
                    type: 'info',
                });
                app.ajax({
                    url: duxstorage.url,
                    type: 'POST',
                    data: {files: files},
                    notify: false,
                }).then(data => {
                    top.tinymce.activeEditor.notificationManager.close();
                    for (var i in files) {
                        str = str.replace(files[i], data.result[i]);
                    }
                    editor.notificationManager.open({
                        text: '图片保存成功并替换内容',
                        type: 'success',
                        timeout: 2000,
                    });
                    editor.setContent(str);
                }).catch(error => {
                    top.tinymce.activeEditor.notificationManager.close();
                    editor.notificationManager.open({
                        text: error.message,
                        type: 'info',
                        timeout: 2000,
                    });
                });
            }
        });
    }

    editor.ui.registry.getAll().icons.duxstorage || editor.ui.registry.addIcon('duxstorage','<svg t="1596799661537" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3607" width="24" height="24"><path d="M795.2 304h-108v-72.8c0-49.7-40.3-90.1-90.1-90.1h-390c-49.7 0-90.1 40.3-90.1 90.1v390c0 49.7 40.3 90.1 90.1 90.1h121.7V771c0 48 39.1 86.8 87.4 86.8h378.9c48.3 0 87.4-38.9 87.4-86.8V390.8c0.1-47.9-39-86.8-87.3-86.8z m-417.4-40.8c0-13.5 10.9-24.4 24.4-24.4s24.4 10.9 24.4 24.4v16.3c0 13.5-10.9 24.4-24.4 24.4s-24.4-10.9-24.4-24.4v-16.3z m-90.5 246.7c-9.9-9.9-9.9-26 0-35.9s26-9.9 35.9 0l54.7 54.7V360.9c0-13.5 10.9-24.4 24.4-24.4s24.4 10.9 24.4 24.4v167.7l54.7-54.7c9.9-9.9 26-9.9 35.9 0 9.9 9.9 9.9 26 0 35.9l-95.8 95.8c-3.8 3.8-8.7 6.2-13.8 7.1-1.8 0.4-3.6 0.6-5.5 0.6s-3.7-0.2-5.5-0.6c-5-0.8-9.8-3.2-13.8-7.1l-95.6-95.7z m530.1 254.5c0 15.5-12.7 28.1-28.2 28.1H422.3c-15.5 0-28.2-12.6-28.2-28.1v-53.3h203.2c49.7 0 90.1-40.3 90.1-90.1V369h102c15.5 0 28.2 12.6 28.2 28.1v367.3h-0.2z" p-id="3608"></path></svg>');

    editor.ui.registry.addButton('duxstorage', {
        icon: 'duxstorage',
        tooltip: '远程存图',
        onAction: function () {
            openStorage();
        }
    });
    editor.ui.registry.addMenuItem('duxstorage', {
        icon: 'duxstorage',
        text: '远程存图...',
        onAction: function () {
            openStorage();
        }
    });

    return {
        getMetadata: function () {
            return {
                name: '文件管理',
                url: "http://www.duxphp.com",
            };
        }
    };
});
