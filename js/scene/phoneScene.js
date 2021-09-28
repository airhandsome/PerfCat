import DataStore from "../base/DataStore";
import Background from '../runtime/background';
// 采用750的设计稿
const screenWidth = wx.getSystemInfoSync().windowWidth;
const screenHeight = wx.getSystemInfoSync().windowHeight;
const ios_mode = wx.getSystemInfoSync().platform == "ios";
let ratio = screenHeight / screenWidth;
const scale = 750 / screenWidth;
const baseUrl = 'https://device.unity.cn/backend/weixin/';
export default class Phone {
    data = {
        keepRation: false,
        timespan: 2000,
        timeDiff: 0,
        imgWidth: screenWidth * scale,
        imgHeight: screenHeight * scale,
        socketOpen: false,
        rotate: false,
        alignLeft: 0,
        alignTop: 0,
        firstLoad: true,
        keepRation: true,
        identifier_list: [null, null, null, null, null, null, null, null, null, null],
        identifier_map: {}
    }
    constructor(ctx, sessionId) {
        console.log(sessionId)
        this.background = new Background(ctx, scale);      
        this.sessionId = sessionId;
        this.ctx = ctx;
        this.ctx.width = screenWidth * scale;
        this.ctx.height = screenHeight * scale;       
        this.init(this.sessionId);
    }
    init(id) {
        let _this = this;
        if (id == null){
            wx.showToast({
                title: '二维码错误',
                icon: 'fail',
                duration: 2000
            })
            return false
        }        
        wx.request({
          url: baseUrl + id,
          method: 'GET',
          success: function(res){              
              if (res == null){
                  console.log(res)
                  wx.showToast({
                      title: "无法获取配置信息",
                      icon: 'fail',
                      duration: 2000
                  })                  
                  return 
              }
              if (res.data.fullScreen != null){
                  _this.data.keepRation = !res.fullScreen
              }
              _this.data.wsUrl = res.data.wss;        
              _this.connectWebSocket()             
          },
          fail:function(){
            console.log(baseUrl + id)
            wx.navigateTo({
                url: '../error/error',
              })
          }
        })
    }
    setShowAndHide(){
        wx.onShow((result) => {
            console.log("onshow")
            this.connectWebSocket()
        })

        wx.onHide((res) => {
            console.log("onhide")            
            wx.closeSocket({
                code: 1000,
            })            
        })
    }

    connectWebSocket(){
        let _this = this
        wx.connectSocket({
            url: _this.data.wsUrl,              
            header:{
                'content-type': 'application/json'
            }
        })
    
        wx.onSocketOpen(function(res) {
            _this.data.socketOpen = true
            console.log("open......");
            // _this.sendStartKey();           
            _this.addTouchAction();
        })
    
        wx.onSocketMessage(function(res) {
            if (res.data.length < 13)
                return
            
            let imageTime = Number(res.data.slice(0, 13))
            let imageData = res.data.slice(13, res.data.length)
            
            if (!_this.data.timeDiff){
                let diff =  Date.now() - imageTime
                _this.data.timeDiff = diff                
                console.log('timeDiff is ' + diff)
            }
                
            if (Date.now() - imageTime < _this.data.timespan + _this.data.timeDiff){
                _this.drawPic(imageData)               
            }else{
                console.log(Date.now() - imageTime)
            }        
        })
    
        wx.onSocketClose(function(res) {
            _this.data.socketOpen = false
            console.log('closed!!!!')
        })
        wx.onSocketError((result) => {
            console.log('error!!!!')
        })
    }
    drawPic(imgData) {
        let _this = this;       

        let pic = new Image();
        pic.src = imgData;
        pic.onload = () => {
            if (this.data.firstLoad && this.data.keepRation){
                let localWidth = pic.width
                let localHeight = pic.height
                //make sure is portrait  width < height
                if (localWidth > localHeight){
                    let tmp = localWidth
                    localWidth = localHeight
                    localHeight = tmp
                }
    
                let localRatio = localHeight / localWidth
                let tmpWidth = _this.data.imgHeight * localWidth / localHeight
                let tmpHeight = _this.data.imgWidth * localHeight / localWidth
                if (localRatio > ratio){  // the cloud device is longer than now
                    _this.data.imgWidth = tmpWidth;
                    _this.data.alignLeft = (_this.ctx.width - tmpWidth) / 2;                                    
                }else{                  // the cloud device is fatter than now
                    _this.data.imgHeight = tmpHeight;
                    _this.data.alignTop = (_this.ctx.height - tmpHeight) / 2;
                }
                ratio = localRatio;
                _this.data.firstLoad = false;   
                _this.ctx.translate(_this.data.alignLeft, _this.data.alignTop)
                _this.ctx.save();
                console.log(_this.data.alignLeft, _this.data.alignTop, ratio)
            } 

            if(pic.width > pic.height != _this.data.rotate){
                let tmp = _this.data.imgHeight;
                _this.data.imgHeight = _this.data.imgWidth;
                _this.data.imgWidth = tmp;                    
                _this.data.rotate = pic.width > pic.height;
                _this.ctx.width = pic.width
                _this.ctx.header = pic.header

                if(_this.data.rotate){                                        
                    _this.ctx.rotate(Math.PI / 180 * 90)  // rotate 90
                    _this.ctx.translate(0, -_this.data.imgHeight)    
                }else{                    
                    _this.ctx.restore();
                    _this.ctx.save();
                }
            }             
            _this.ctx.drawImage(pic, 0, 0, _this.data.imgWidth, _this.data.imgHeight);
        }
        _this.reDrawCanvas();
    }    

    // 重新绘制canvas 到主屏上
    reDrawCanvas() {
        DataStore.getInstance().ctx.drawImage(DataStore.getInstance().offScreenCanvas, 0, 0, screenWidth, screenHeight);
    }
   
    sendStartKey(){
        if (!this.data.socketOpen)
            return;

        let msg = JSON.stringify({
            "msg_type": 0,
            "msg_inject_keycode_action": 0,
            "msg_inject_keycode_keycode": '__VolumeDown',
            "msg_inject_keycode_metastate": 0
        })
        this.sendSocketMessage(msg);  
        msg = JSON.stringify({
            "msg_type": 0,
            "msg_inject_keycode_action": 1,
            "msg_inject_keycode_keycode": '__VolumeDown',
            "msg_inject_keycode_metastate": 0
        })
        this.sendSocketMessage(msg);  
    } 
    sendSocketMessage(msg) {
        if (this.data.socketOpen) {
          wx.sendSocketMessage({
            data:msg
          })
        }
    }

    addTouchAction(){
        this.handleStart();
        this.handleMove();
        this.handleEnd();       
    }
    handleStart(){
        let _this = this;
        wx.onTouchStart(function(e){
            if (!_this.data.socketOpen)
                return;
            let touch = e.changedTouches[0]
            let scalex = (touch.clientX - _this.data.alignLeft / scale) * scale  / _this.data.imgWidth
            let scaley = (touch.clientY - _this.data.alignTop / scale) * scale / _this.data.imgHeight        
            if (_this.data.rotate){
                scalex = (touch.clientY - _this.data.alignTop / scale) * scale / _this.data.imgWidth
                scaley = 1 -(touch.clientX - _this.data.alignLeft / scale) * scale / _this.data.imgHeight
            }
            let msg = JSON.stringify({
                "msg_type": 2,
                "msg_inject_touch_action": 0,
                "msg_inject_touch_index": ios_mode? _this.addIdentifierKey(touch.identifier): touch.identifier,
                "msg_inject_touch_position": {
                    "x": scalex, "y": scaley, "width": _this.data.imgWidth, "height": _this.data.imgHeight
                }
            })           
            // console.log("start " + msg)
            _this.sendSocketMessage(msg);          
        })                         
    }
    handleMove(){
        let _this = this;
        wx.onTouchMove(function(e){
            if (!_this.data.socketOpen)
            return;
            let touch = e.changedTouches[0]
            let scalex = (touch.clientX - _this.data.alignLeft / scale) * scale  / _this.data.imgWidth
            let scaley = (touch.clientY - _this.data.alignTop / scale) * scale / _this.data.imgHeight        
            if (_this.data.rotate){
                scalex = (touch.clientY - _this.data.alignTop / scale) * scale / _this.data.imgWidth
                scaley = 1 -(touch.clientX - _this.data.alignLeft / scale) * scale / _this.data.imgHeight
            }
            let msg = JSON.stringify({
                "msg_type": 2,
                "msg_inject_touch_action": 2,
                "msg_inject_touch_index": ios_mode? _this.getIdentifierKey(touch.identifier) : touch.identifier,
                "msg_inject_touch_position": {
                    "x": scalex, "y": scaley, "width": _this.data.imgWidth, "height": _this.data.imgHeight
                }
            })
            // console.log("move " + msg)
            _this.sendSocketMessage(msg);   
        })          
    }
    handleEnd(){
        let _this = this;
        wx.onTouchEnd(function(e){
            if (!_this.data.socketOpen)
                return;
            let touch = e.changedTouches[0]
            let scalex = (touch.clientX - _this.data.alignLeft / scale) * scale  / _this.data.imgWidth
            let scaley = (touch.clientY - _this.data.alignTop / scale) * scale  / _this.data.imgHeight        
            if (_this.data.rotate){
                scalex = (touch.clientY - _this.data.alignTop / scale) * scale  / _this.data.imgWidth
                scaley = 1 -(touch.clientX - _this.data.alignLeft / scale) * scale / _this.data.imgHeight
            }
            let msg = JSON.stringify({
                "msg_type": 2,
                "msg_inject_touch_action": 1,
                "msg_inject_touch_index": ios_mode? _this.removeIdentifierKey(touch.identifier) : touch.identifier,
                "msg_inject_touch_position": {
                    "x": scalex, "y": scaley, "width": _this.data.imgWidth, "height": _this.data.imgHeight
                }
            })
            // console.log("end " + msg)
            _this.sendSocketMessage(msg);  
        })
           
    }
    sendSocketMessage(msg) {
        if (this.data.socketOpen) {
          wx.sendSocketMessage({
            data:msg
          })
        }
    }

    addIdentifierKey(key){
        let i = 0;
        for(i = 0; i<this.data.identifier_list.length; i++){
            if (this.data.identifier_list[i] == null)
                break
        }
        this.data.identifier_map[key] = i
        this.data.identifier_list[i] = key
        return i
    }

    getIdentifierKey(key){
        return this.data.identifier_map[key]
    }

    removeIdentifierKey(key){
        let val = this.data.identifier_map[key]
        this.data.identifier_map[key] = 0
        this.data.identifier_list[val] = null
        return val
    }

}