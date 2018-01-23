/*https://segmentfault.com/a/1190000005770330*/
!function(env){
    'use strict'

    var lstorage = window.localStorage

    function lsFile(url){
        this.url = url
        //this.filename = url.substring(url.lastIndexOf("/")+1,url.lastIndexOf("."))
        let domain = location.protocol+'//'+location.host;
        let filepath = url.replace(domain,'');
        this.filename  = filepath.substring(0, filepath.lastIndexOf("?"));
        this.lname     = '__Lsf__'+this.filename+'_'+url.substring(url.lastIndexOf("?")+1)
        this.filetext    = lstorage.getItem(this.lname)
        this.init()
    }

    lsFile.prototype.init = function(){
        if (this.filetext){
            if (this.filename.substring(this.filename.lastIndexOf(".")+1) == 'css') {
                this.runcss(this.filetext);
            }else{
                this.runjs(this.filetext)
            }
        }else{
            this.xhr(this.url,this.runstr)
        }
    }

    lsFile.prototype.runcss = function(_css){
        var style = document.createElement('style'), //创建一个style元素
            head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
        style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        if(style.styleSheet){ //IE
            var func = function(){
                try{ //防止IE中stylesheet数量超过限制而发生错误
                    style.styleSheet.cssText = _css;
                }catch(e){

                }
            }
            //如果当前styleSheet还不能用，则放到异步中则行
            if(style.styleSheet.disabled){
                setTimeout(func,10);
            }else{
                func();
            }
        }else{
           //w3c浏览器中只要创建文本节点插入到style元素中就行了
            var textNode = document.createTextNode(_css);
            style.appendChild(textNode);
        }
        head.appendChild(style); //把创建的style元素插入到head中
    }

    lsFile.prototype.xhr = function(url,callback){
        var _this = this
        var version = url.substring(url.lastIndexOf("?"))
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            switch(xhr.readyState){
                case 4:
                    if(xhr.status==200){
                        var filetext = xhr.responseText
                        if(callback){
                            callback.call(_this,filetext)
                        }
                    }else{
                        alert('加载失败')
                    }
                    break;
                default:
                    break;
            }
        }
        xhr.open('GET',url, false);
        //xhr.setRequestHeader("Content-Length", _data.length);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();
    }

    lsFile.prototype.runstr = function(filetext){
        if (this.filename.substring(this.filename.lastIndexOf(".")+1) == 'css') {
            this.runcss(filetext);
        }else{
            this.runjs(filetext)
        }
        lstorage.setItem(this.lname,filetext);
        this.removels()
    }

    lsFile.prototype.removels = function(){
        var arr = []
        for(var i=0;i<lstorage.length;i++){
            var name = lstorage.key(i);
            if(name.indexOf(this.filename) > -1 && name != this.lname){
                arr.push(name)
            }
        }
        for(var i in arr){
            localStorage.removeItem(arr[i]);
        }
    }

    lsFile.prototype.runjs = function(filetext){
        window.eval(filetext)
    }

    env.lsFile = function (modules){
        if (typeof modules == 'object') {
            for (var i in modules) {
                // console.log(i);
                // console.log(modules[i]);
                new lsFile(i + '?' + modules[i]);
            }
        }else{
            new lsFile(modules);
        }
        // return new lsFile(url)
    }
}(window)
