/* 参数
 * trigger：目标的class 或者 id
 * auto: 选择文件是否自动上传
 * complete: 完成时的回调函数

*/

function Upload(props) {
    this.trigger = props.trigger;
    this.parent = props.parent;
    this.auto = props.auto;
    this.complete = props.complete;

    this.init();
}

Upload.prototype.init = function() {
    this.handle();
}
Upload.prototype.ajax = function(formData) {
    this.complete && this.complete(formData);

    let xhr = new XMLHttpRequest();

    xhr.open('post', '/upload');

    xhr.upload.addEventListener("progress", (ev) => {
        let percent = (ev.loaded / ev.total) * 100 + "%";
        this.oProgressCon.style.width = percent;
    });
    xhr.send(formData);

    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            this.complete && this.complete(JSON.parse(xhr.responseText))
        }
    });


}
Upload.prototype.handle = function() {
    this.trigger.addEventListener('click', () => {
        // 下次点击的时候把上次创建的删除
        this.oFile && this.oFile.remove();
        this.oProgressWrap && this.oProgressWrap.remove();

        this.createDoms();

        // 主动点击，弹出系统上传框
        this.oFile.click();

        this.oFile.addEventListener("change", () => {
            let formData = new FormData();

            formData.append("upload", this.oFile.files[0]);

            this.ajax(formData);
        })


    })
}

Upload.prototype.createDoms = function() {
    this.oFile = this._createElement("input");
    this.oProgressWrap = this._createElement("div");
    this.oProgressCon = this._createElement("span");

    this.oFile.type = "file";
    this.oFile.style.display = "none";

    this.oProgressWrap.className = "progress-wrap";
    this.oProgressCon.className = "progress-con";

    this.oProgressWrap.appendChild(this.oProgressCon);
    this.parent.appendChild(this.oProgressWrap);

}

Upload.prototype._createElement = function(nodeName) {
    return document.createElement(nodeName);
}