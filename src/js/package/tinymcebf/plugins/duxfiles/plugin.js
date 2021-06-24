tinymce.PluginManager.add('duxfiles', function (editor, url) {
    var duxfiles = {};

    duxfiles.attrUrl = editor.getParam('dux_attr_url', '', 'string');
    duxfiles.uploadUrl = editor.getParam('dux_upload_url', '', 'string');
    duxfiles.res = [];


    var openFiles = function () {
        file.manage({
            url: duxfiles.attrUrl,
            uploadUrl: duxfiles.uploadUrl,
            multiple: true,
            callback: function (list) {
                list.map(info => {
                    if (info.ext == 'png' || info.ext == 'jpg' || info.ext == 'jpeg' || info.ext == 'bmp' || info.ext == 'gif') {
                        $node = "<div><img src='" + info.url + "' alt='" + info.title + "' /></div>";
                    } else if (info.ext == 'mp4' || info.ext == 'ogv' || info.ext == 'webm') {
                        $node = "<div><video controls src='" + info.url + "'></video></div>";
                    } else if (info.ext == 'mp3' || info.ext == 'ogg' || info.ext == 'wav' || info.ext == 'acc') {
                        $node = "<div><audio controls src='" + info.url + "'></audio></div>";
                    } else {
                        $node = "<div><a href='" + info.url + "' target='_blank'>" + info.title + "</a></div>";
                    }
                    editor.insertContent($node);
                })
            }
        });
    }

    editor.ui.registry.getAll().icons.duxfiles || editor.ui.registry.addIcon('duxfiles','<svg t="1596798366737" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1290" width="20" height="20"><path d="M958.473611 844.240917c0 0 0-509.912455 0-560.039109 0-68.029396-61.916165-61.654198-61.916165-61.654198s-369.837186 0.436952-350.275665 0c-21.221324 0.436952-31.699979-11.090593-31.699979-11.090593s-14.758122-25.325805-41.218774-65.408709c-27.770484-42.004673-59.907415-35.106566-59.907415-35.106566L140.9021 110.941741c-75.53944 0-76.41232 72.65781-76.41232 72.65781s0 604.576465 0 656.886855c0 81.040734 61.217247 70.998007 61.217247 70.998007s730.330564 0 776.439718 0C967.643458 911.48339 958.473611 844.240917 958.473611 844.240917L958.473611 844.240917z" p-id="1291"></path></svg>');


    editor.ui.registry.addButton('duxfiles', {
        icon: 'duxfiles',
        tooltip: '文件管理器',
        onAction: function () {
            openFiles();
        }
    });
    editor.ui.registry.addMenuItem('duxfiles', {
        icon: 'duxfiles',
        text: '文件管理器...',
        onAction: function () {
            openFiles();
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
