;(function($, window, document, undefined) {

    let Upload = function(props) {
        this.$trigger = $(props.trigger);
        this.auto = props.auto;
        this.complete = props.complete;

        this.init();
    }

    Upload.prototype = {
        init: function() {
            this.$trigger.on('click', () => {
                // 下次点击的时候把上次创建的删除
                this.$file && this.$file.remove();
                this.$progress && this.$progress.remove();

                this.createDom();

                // 主动点击，弹出系统上传框
                this.$file.click();

                // 监听文件选择,后期可根据auto的真假来决定何时开始上传，这里是选中文件立即发起上传
                this.$file.on('change', () => {
                    let fileData = new FormData();
                    fileData.append('upload', this.$file[0].files[0]);

                    this.ajaxUpload(fileData);
                })


            })
        },
        ajaxUpload: function(fileData) {
            // 主要的上传步骤，用原生js写异步请求代码
            let xhr = new XMLHttpRequest();
            xhr.open('post', './upload');

            // 进度条的显示
            xhr.upload.addEventListener('progress', (ev) => {
                let percent = ( ev.loaded / ev.total ) * 100 + '%';
                this.$progress.find('.progress-con').width(percent)
            })

            xhr.send(fileData);

            xhr.addEventListener('readystatechange', () => {
                if(xhr.readyState === 4 && xhr.status === 200) {
                    // 调用成功之后的回调
                    this.complete && this.complete(JSON.parse(xhr.responseText))
                } else {
                    // 可调用失败的回调
                }
            })
        },

        createDom: function() {
            const $trigger = this.$trigger;
            this.$file = $('<input type="file" style="display: none" />');

            const progress = '<div class="progress-wrap"><span class="progress-con"></span></div>'
            $(progress).insertAfter($trigger);

            this.$progress = $trigger.siblings('.progress-wrap');
        }
    }

    // 扩展jquery方法，直接在html中使用$.uploadPro
    $.extend({
        uploadPro: function(options) {
            let uploadPro = new Upload(options);
            return uploadPro;
        }
    })
})(jQuery, window, document)