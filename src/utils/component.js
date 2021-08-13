/**
 * 格式化accept
 * @param {*} value 
 */
export const formatType = (type) => {
    const types = type instanceof Array ? type : type.split(',')
    let accept = '*.*';
    const formatType = {
        'image': 'jpg,png,bmp,jpeg,gif',
        'audio': 'wav,mp3,acc,ogg',
        'video': 'mp4,ogv,webm,ogm',
        'document': 'doc,docx,xls,xlsx,pptx,ppt,csv,pdf',
    }
    let exts = []
    for (const type of types) {
        if (type === 'other' || type === 'all') {
            exts = []
            break;
        }
        formatType[type].split(',').map(item => {
            exts.push('.' + item)
        })
    }
    if (exts.length > 0) {
        accept = exts.join(',')
    }
    return accept
}
