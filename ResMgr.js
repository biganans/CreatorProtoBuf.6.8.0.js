game.ResMgr = {
    res_cache : [],
    progress_callback : null,
    complete_callback : null,

    init : function(endCallback){
        // folder_path 是proto资源所在的目录，位于assets/resources目录下
        this.loadFolder(folder_path)
    },

    loadFolder : function(folder, progress_cb = null, completed_cb = null){
        this.progress_callback = progress_cb;
        this.complete_callback = completed_cb;

        this.cur_loading_path = folder;
        var type = this.getResLoadType(folder);
        cc.loader.loadResDir(folder, type, this.progressCallback.bind(this), this.completedCallback.bind(this));
    },

    //加载进度回调
    progressCallback : function (completedCount, totalCount, res) {
        var is_proto = this.cur_loading_path.indexOf("protos") >= 0
        if(is_proto) {
            // json格式由于没有文件描述符，所以在这边单独处理
            var asset = {content : res.content}
            if( typeof (asset) === "string" ) {
                asset = JSON.parse(asset)    
            }
            // 通过路径的url解析proto的名字
            var newURL = new String(res.url)
            var start_idx = newURL.lastIndexOf("/") + 1 
            var end_idx = newURL.lastIndexOf(".") 
            asset.name = newURL.substring(start_idx, end_idx)
            asset.url = res.url
            game.ResMgr.res_cache[asset.name] = asset
        } 
    },

    getProto : function(proto_name){
        return game.ResMgr.res_cache[proto_name] = asset
    },

}
