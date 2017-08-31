#protobufjs
    本插件基于protobufjs 6.8.0版本，主要针对自己的项目进行了一点点更改，使之能正常的在跨平台上面使用

#适用范围：
    cocos creator 1.6版本(1.6之前的版本没有测试过)， 如果有问题可以直接联系我QQ657542753

#用法：
    导入项目，并设置为插件（ps:不要问我怎么导入为插件，不然我打死你！官方文档是有相关介绍的）

#更改
#game对象是一个自定义的全局变量，如果大家喜欢用全局变量，可以在以下目录的文件中添加以下内容
    window.game = {}

需要添加的文件：
    creator安装目录下：
        /Resources/static/simulator/main.js                //该目录是用于模拟器的
        /Resources/static/preview-templates/boot.js        //web
        /Resources/static/build-templates/shares/main.js   //打包模板
<!-- 
    1.更改987行附近的函数，注释掉了8192长度，这个数值会造成在把数据转换成arraybuffer时，总是生成8192长度的arraybuffer数组
-->
    function pool(alloc, slice, size) {
        var SIZE   = size //|| 8192;
        var MAX    = SIZE >>> 1;
        var slab   = null;
        var offset = SIZE;
        return function pool_alloc(size) {
            if (size < 1 || size > MAX)
                return alloc(size);
            if (offset + size > SIZE) {
                slab = alloc(SIZE);
                offset = 0;
            }
            var buf = slice.call(slab, offset, offset += size);
            if (offset & 7) // align to 32 bit
                offset = (offset | 7) + 1;
            return buf;
        };
    }


<!-- 
    2.更改447行附近的fetch函数，将原有的native判断转换成cc.sys.isNative来判断是否属于本地，
并将原生的读文件操作进行了转换，转换原理：通过creator本身的cc.loader.load函数来获取proto文件，然后将其中的内容返回
    var data = game.ResMgr.getProto(name)  这个函数用来获取proto文件信息，
    注意！！！游戏开发过程中，常用的内容一般都会走预先加载的流程，所以我这边直接获取是没有问题的
    data = {
        url : 文件在本地的正目录，
        name :文件名
        content : 文件内容
    }
 -->
    function fetch(filename, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    } else if (!options)
        options = {};

    if (!callback)
        return asPromise(fetch, this, filename, options); // eslint-disable-line no-invalid-this

    // if a node-like filesystem is present, try it first but fall back to XHR if nothing is found.
    console.log("cc.sys.isNative)",cc.sys.isNative)
    if (cc.sys.isNative)
        try {
            // 这边通过解析文件名字，然后用cc.loader.load来加载文件
            var start_idx = filename.lastIndexOf("/") + 1
            var end_idx = filename.lastIndexOf(".")
            var name = filename.substring(start_idx, end_idx)
            var data = game.ResMgr.getProto(name)
            return callback(null, data.content)
        } catch (e) {
            return null;
        }
    // use the XHR version otherwise.
    return fetch.xhr(filename, options, callback);
}

<!-- 
    3.更改  4207行附近 将 // name = applyCase(name);注释的原因是因为这个函数会把所有非字母数字的符号去除，
    将原有的变量名字强行更改成驼峰式命名，如，我们项目里的变量大多是abc_def的，如果这个函数没有注释的话，则会被abcDef替换，
    导致最终获取不到这个对象，发送或者接收的数据缺失
 -->

    // name = applyCase(name)
