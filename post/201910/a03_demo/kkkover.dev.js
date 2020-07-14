;(function(w) {
    var kkkover = function () {
        _ = this;
        this.init = function (obj) {
            if(!obj){
                throw 'kkkover.js: Give me an object! You can see docs at https://jw12138.com/kkkover.js';
            }
            if(!obj.wrapCell){
                throw 'kkkover.js: Give me an <wrapCell> object! You can see docs at https://jw12138.com/kkkover.js';
            }
            if(!obj.img){
                throw 'kkkover.js: Give me an <img> object! You can see docs at https://jw12138.com/kkkover.js';
            }
            w.onresize = function () {
                _.resized(obj);
            }
            obj.img.onload = function () {
                obj.ratio = obj.img.clientHeight / obj.img.clientWidth;
                _.calcStyle(obj);
            }
            obj.ratio = obj.img.clientHeight / obj.img.clientWidth;
            _.calcStyle(obj);
        }
        this.calcStyle = function (obj) {
            obj.wrapCell.style.position = 'relative';
            obj.img.style.position = 'absolute';
            obj.img.style.top = '50%';
            obj.img.style.zIndex = '0';
            obj.img.style.left = '50%';
            obj.img.style.width = '100%';
            obj.img.style.marginLeft = -(obj.img.clientWidth / 2) + 'px';
            obj.img.style.marginTop = -(obj.img.clientHeight / 2) + 'px';
            if(obj.img.clientHeight <= obj.wrapCell.clientHeight){
                obj.img.style.maxWidth = 'none';
                obj.img.style.height = obj.wrapCell.clientHeight;
                obj.img.style.width = obj.wrapCell.clientHeight / obj.ratio + 'px';
                obj.img.style.marginTop = -(obj.img.clientHeight / 2) + 'px'
                obj.img.style.marginLeft = -(obj.img.clientWidth / 2) + 'px';
            }
            if(obj.wrapCell.clientWidth > obj.img.clientWidth){
                obj.img.style.width = '100%';
                obj.img.style.height = 'auto';
                obj.img.style.marginLeft = -(obj.img.clientWidth / 2) + 'px';
                obj.img.style.marginTop = -(obj.img.clientHeight / 2) + 'px';
            }
        }
        this.resized = function (obj) {
            _.calcStyle(obj);
        }
    }
    var app = new kkkover();
    var wp = w.prototype || w.__proto__ || w;
    wp.kkkover = app.init;
}(window));