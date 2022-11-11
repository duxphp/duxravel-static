import { defineComponent } from 'vue'
import { getUrl, request } from '../../utils/request'
import { getLocalUserInfo } from '../../utils/user'

//引入tinymce编辑器
import Editor from '@tinymce/tinymce-vue'

//引入node_modules里的tinymce相关文件文件
import tinymce from 'tinymce/tinymce' //static/tinymce默认hidden，不引入则不显示编辑器
import 'tinymce/themes/silver'  //编辑器主题，不引入则报错
import 'tinymce/icons/default'  //引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/models/dom'
// 扩展插件
//import 'tinymce/plugins/advlist'  //高级列表
import 'tinymce/plugins/anchor'  //锚点
import 'tinymce/plugins/autolink'  //自动链接
import 'tinymce/plugins/autoresize'  //编辑器高度自适应,注：plugins里引入此插件时，Init里设置的height将失效
//import 'tinymce/plugins/autosave'  //自动存稿
import 'tinymce/plugins/charmap'  //特殊字符
import 'tinymce/plugins/code'  //编辑源码
import 'tinymce/plugins/codesample'  //代码示例
import 'tinymce/plugins/directionality'  //文字方向
import 'tinymce/plugins/emoticons'  //表情
import 'tinymce/plugins/fullscreen'  //全屏
import 'tinymce/plugins/help'  //帮助
import 'tinymce/plugins/image'  //插入编辑图片
//import 'tinymce/plugins/editimage'  //图片工具
import 'tinymce/plugins/importcss'  //引入css
import 'tinymce/plugins/insertdatetime'  //插入日期时间
import 'tinymce/plugins/link'  //超链接
import 'tinymce/plugins/lists' //列表插件
import 'tinymce/plugins/media' //插入编辑媒体
import 'tinymce/plugins/nonbreaking' //插入不间断空格
import 'tinymce/plugins/pagebreak' //插入分页符
//import 'tinymce/plugins/paste' //粘贴插件
import 'tinymce/plugins/preview'//预览
//import 'tinymce/plugins/print'//打印
import 'tinymce/plugins/quickbars'  //快速工具栏
import 'tinymce/plugins/save'  //保存
import 'tinymce/plugins/searchreplace'  //查找替换
// import 'tinymce/plugins/spellchecker'  //拼写检查，暂未加入汉化，不建议使用
//import 'tinymce/plugins/tabfocus'  //切入切出，按tab键切出编辑器，切入页面其他输入框中
import 'tinymce/plugins/table'  //表格
import 'tinymce/plugins/template'  //内容模板
//import 'tinymce/plugins/textcolor'  //文字颜色
//import 'tinymce/plugins/textpattern'  //快速排版
//import 'tinymce/plugins/tableofcontents'  //目录生成器
import 'tinymce/plugins/visualblocks'  //显示元素范围
import 'tinymce/plugins/visualchars'  //显示不可见字符
import 'tinymce/plugins/wordcount'  //字数统计

export default defineComponent({
    props: {
        value: {
            type: String,
            default: ''
        },
        baseUrl: {
            type: String,
            default: window.location.origin ? window.location.origin : ''
          },
        disabled: {
            type: Boolean,
            default: false
        },
        plugins: {
            type: [String, Array],
            default: ' preview searchreplace autolink directionality visualblocks visualchars image link media template code codesample table charmap pagebreak nonbreaking insertdatetime  lists wordcount help emoticons'
        },
        toolbar: {
            type: [String, Array],
            default: ' code preview | blocks fontsize lineheight | forecolor backcolor bold italic underline strikethrough  subscript superscript  removeformat | \
            alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | pagebreak link table  |  image media  filemanage  codesample charmap emoticons'
        },
        'upload': {
          type: String,
          default: 'upload'
        },
    },
    data() {
        return {
            init: {
                language_url: `${this.baseUrl}/static/tinymce/langs/zh-Hans.js`,  //引入语言包文件
                language: 'zh-Hans',  //语言类型
                skin_url: `${this.baseUrl}/static/tinymce/skins/ui/` + (window.darkMode === 'dark' ? 'oxide-dark' : 'oxide'),
                content_css: `${this.baseUrl}/static/tinymce/skins/content/${window.darkMode === 'dark' ? 'dark' : 'default'}/content.min.css`,
                emoticons_database_url: `${this.baseUrl}/static/tinymce/emojis.min.js`,
                
                plugins: this.plugins,
                toolbar: this.toolbar,
                promotion: false,
                width: '100%',
                min_height: 500,
                font_size_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
                convert_urls: false,
                relative_urls: false,
                line_height_formats: "0.5 0.8 1 1.2 1.5 1.75 2 2.5 3 4 5",
                placeholder: '请输入内容',
                branding: false,
                resize: false,
                elementpath: false,
                content_style: "img {max-width:100%;}",
                paste_data_images: true,
                images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
                    var xhr, formData;
                    xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open('POST', getUrl(this.upload));

                    xhr.upload.onprogress = (e) => {
                        progress(e.loaded / e.total * 100)
                    }

                    xhr.onload = function () {
                        let json;
                        if (xhr.status !== 200) {
                            reject('HTTP Error: ' + xhr.status)
                            return;
                        }
                        json = JSON.parse(xhr.responseText);
                        if (!json || !json.data.length) {
                            reject('Invalid JSON: ' + xhr.responseText)
                            return;
                        }
                        json.data.map(info => {
                            resolve(info.url)
                        })
                    };
                    formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename())

                    xhr.setRequestHeader('Accept', 'application/json')
                    xhr.setRequestHeader('Authorization', `${getLocalUserInfo().token || ''}`)
                    xhr.send(formData)
                }),
                setup: function (editor) {
                    // 文件管理器
                    editor.ui.registry.getAll().icons.filemanage || editor.ui.registry.addIcon('filemanage', '<svg t="1620982539724" class="icon" viewBox="0 0 1204 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2147" width="22" height="22"><path d="M0.002 541.857c0-124.482 85.64-233.86 200.042-266.246C263.379 115.14 420.248 0 603.747 0c184.938 0 337.488 115.143 400.801 275.61 118.024 33.104 200.053 141.048 200.053 266.248 0 153.998-124.495 279.245-282.07 279.245-29.503 0-56.136-26.62-56.136-56.112 0-33.832 26.62-56.136 56.137-56.136 94.979 0 170.573-74.11 170.573-166.939 0-49.653-22.351-95.71-59.007-125.211l-10.07-9.41c-2.882-3.6-7.2-6.47-12.94-10.07-2.894-3.613-9.41-3.613-12.94-6.483h-3.6c-2.882-3.6-6.482-3.6-9.41-6.47h-3.6c-2.883 0-6.482-3.61-10.082-3.61-2.882 0-6.47 0-6.47-2.87h-9.41c-3.6 0-6.47 0-10.082-3.6h-26.562c-2.882-10.788-6.482-18.705-6.482-29.504-2.87 0-2.87-3.588-2.87-6.47-3.588-6.482-3.588-12.94-6.47-19.434 0-3.6-3.612-3.6-3.612-7.188-2.87-6.47-6.47-12.94-10.058-19.421v-6.482c-2.894-6.47-9.41-12.94-12.94-19.434-55.396-92.156-157.609-154.716-272.764-154.716-118.012 0-220.181 62.56-275.587 154.716l-9.41 19.434c0 2.164-1.448 2.164-2.154 4.317l-1.447 2.165-10.081 19.42v7.2l-9.34 19.435v6.446c-3.612 10.8-7.2 18.716-7.2 29.503H259.05c-2.87 3.6-6.47 3.6-9.34 3.6h-6.494c-2.87 2.164-4.306 2.87-5.035 2.87a1.341 1.341 0 0 1-2.153 0c-2.87 0-6.482 3.61-9.41 3.61h-6.47c-3.611 2.883-6.482 2.883-10.082 6.47h-3.587c-2.87 2.87-6.482 2.87-9.411 6.483h-3.6c-2.87 3.6-6.46 6.47-10.07 10.07-6.47 2.87-9.34 6.482-12.94 9.41-36.69 29.504-55.396 75.56-55.396 125.212 0 92.828 75.559 166.94 166.94 166.94 33.83 0 59.018 22.35 59.018 56.136 0 29.503-25.187 56.112-59.02 56.112C128.098 821.103 0.002 695.856 0.002 541.857zM377.792 728.9c0-16.552 6.47-28.786 12.94-39.573L561.293 502.31c10.8-10.788 25.88-16.552 42.467-16.552s29.504 5.764 43.173 16.552l166.938 187.04a54.972 54.972 0 0 1 16.551 39.573c0 29.503-25.186 55.42-59.006 55.42-16.55 0-28.786-8.636-39.585-19.423l-71.947-78.453v282.105c0 33.82-25.185 55.419-56.136 55.419-32.373 0-55.419-21.586-55.419-55.42V686.504l-71.9 78.44c-10.785 10.788-26.62 19.422-43.16 19.422-29.561 0-55.477-25.915-55.477-55.407z" p-id="2148"></path></svg>');
                    editor.ui.registry.addButton('filemanage', {
                        icon: 'filemanage',
                        tooltip: '文件管理器',
                        onAction: function () {
                            window.fileManage({
                                multiple: true
                            }).then(res => {
                                res.map(info => {
                                    let node
                                    switch (info.ext) {
                                        case 'png':
                                        case 'jpg':
                                        case 'jpeg':
                                        case 'bmp':
                                        case 'gif':
                                            node = "<div><img src='" + info.url + "' alt='" + info.title + "' /></div>"
                                            break;
                                        case 'mp4':
                                        case 'ogm':
                                        case 'ogv':
                                        case 'webm':
                                            node = "<div><video controls src='" + info.url + "'></video></div>"
                                            break;
                                        case 'mp3':
                                        case 'ogg':
                                        case 'wav':
                                        case 'acc':
                                            node = "<div><audio controls src='" + info.url + "'></audio></div>"
                                            break;
                                        default:
                                            node = "<div><a href='" + info.url + "' target='_blank'>" + info.title + "</a></div>"
                                    }
                                    editor.insertContent(node)
                                })
                            })
                        }
                    })
                },
                toolbar_mode: 'wrap',
                file_picker_callback: function (callback, value, meta) {
                    let type = 'all';
                    if (meta.filetype == 'media') {
                        type = 'video,audio';
                    }
                    if (meta.filetype == 'image') {
                        type = 'image';
                    }
                    window.fileManage({
                        multiple: false
                    }).then(res => {
                        callback(res.url)
                    })
                },
                file_picker_types: 'file image media',
                
            },

            html: this.value
        }
    },
    watch: {
        value(content) {
            this.html = content
        },
        content(content) {
            this.$emit('update:value', content)
        },
    },
    created() {
    },
    mounted() {
        tinymce.init({})
    },
    methods: {
        // 添加相关的事件，可用的事件参照文档=> https://github.com/static/tinymce/tinymce-vue => All available events
        onClick(e) {
            this.$emit('onClick', e, tinymce)
        },
        //清空内容
        clear() {
            this.html = ''
        },
    },
    render() {
        return <Editor vModel={this.html} init={this.init} disabled={this.disabled} onClick={this.onClick} />
    }
})
