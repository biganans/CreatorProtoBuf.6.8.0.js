game.ProtoBufFilter = cc.Class({
    properties : {
        version         : null,  //传给服务器的版本信息，保存在platform.json下
        proto           : null,
        game_infos      : null,
    },

    init:function(callback) {
        var proto = game.ResMgr.getProto(proto_name)
        protobuf.load(proto.url, function(err, data){
            //等文件加载成功后，才调用callback执行下一步操作
            self.proto = data
            if(callback) {
                callback(true)
            }
        })
    },

    encode:function(data){ 
        var msg_class = this.proto.lookupType(classNameOfMessage);
        var message = msg_class.create(data)
        var body = msg_class.encode(message).finish();
        this.decode(body)
    },

    decode:function(arrayBuffer) {
        var msg_class = this.proto.lookupType(classNameOfMessage);
        if(!builder) {
            cc.error("proto head name not in proto(!"+name+")")
            return null
        }

        var body = builder.decode(arrayBuffer)//builder.builder.deserializeBinary(bodyArray)
        if(!body) {
            cc.error("proto body decode wrong!")
            return null
        }
    },

})
