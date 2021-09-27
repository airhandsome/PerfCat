import DataStore from "../base/DataStore";
import Background from '../runtime/background';
// 采用750的设计稿
const screenWidth = wx.getSystemInfoSync().windowWidth;
const screenHeight =wx.getSystemInfoSync().windowHeight;
const ratio = 750 / screenWidth;//wx.getSystemInfoSync().pixelRatio;
const scale = 750 / screenWidth;
const baseUrl = 'https://device.unity.cn/backend/weixin/';
export default class Phone {
    data = {
        keepRation: false,
        timespan: 2000,
        timeDiff: 0,
        imgWidth: screenWidth * ratio,
        imgHeight: screenHeight * ratio,
        socketOpen: false,
        rotate: false,
        alignLeft: 0,
        alignTop: 0
    }
    constructor(ctx, sessionId) {
        console.log(sessionId)
        this.background = new Background(ctx, scale);      
        this.sessionId = sessionId;
        this.ctx = ctx;
        this.ctx.width = screenWidth * ratio;
        this.ctx.height = screenHeight * ratio;
        this.ctx.save();
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
            _this.sendStartKey();           
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
            if(pic.width > pic.height != _this.data.rotate){
                _this.data.imgHeight = _this.ctx.width;
                _this.data.imgWidth = _this.ctx.height;                    
                _this.ctx.width = _this.data.imgWidth;
                _this.ctx.height = _this.data.imgHeight; 
                _this.data.rotate = pic.width > pic.height;
                if(_this.data.rotate){                    
                    _this.ctx.translate(pic.width / 2,  pic.height / 2)
                    _this.ctx.rotate(Math.PI / 2)
                    _this.ctx.translate(-pic.height / 2, -_this.data.imgHeight + pic.width / 2)
                }else{
                    _this.ctx.restore();
                }
            }             
            
            _this.ctx.drawImage(pic, 0, 0, _this.ctx.width, _this.ctx.height);
        }
        _this.reDrawCanvas();
    }
    centerImg(pic,x,y,limitW,limitH) {
        let drawWidth = pic.width;
        let drawHeight = pic.height;
        if(drawWidth/drawHeight>1){
            drawHeight = limitW * (drawHeight / drawWidth);
            drawWidth = limitW;
            y = y + (limitH - drawHeight) / 2;
        } else {
            drawWidth = limitH * (drawWidth / drawHeight);
            drawHeight = limitH;
            x = x + (limitW - drawWidth) / 2;
        }

        this.ctx.drawImage(pic,x,y,drawWidth,drawHeight);
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
            console.log(touch)
            let scalex = (touch.clientX - _this.data.alignLeft) * scale  / _this.data.imgWidth
            let scaley = (touch.clientY - _this.data.alignTop) * scale / _this.data.imgHeight        
            if (_this.data.rotate){
                scalex = (touch.clientY - _this.data.alignTop) * scale / _this.data.imgWidth
                scaley = 1 -(touch.clientX - _this.data.alignLeft) * scale / _this.data.imgHeight
            }
            let msg = JSON.stringify({
                "msg_type": 2,
                "msg_inject_touch_action": 0,
                "msg_inject_touch_index": touch.identifier,
                "msg_inject_touch_position": {
                    "x": scalex, "y": scaley, "width": _this.data.imgWidth, "height": _this.data.imgHeight
                }
            })           
            _this.sendSocketMessage(msg);          
        })                         
    }
    handleMove(){
        let _this = this;
        wx.onTouchMove(function(e){
            if (!_this.data.socketOpen)
            return;
            let touch = e.changedTouches[0]
            let scalex = (touch.clientX - _this.data.alignLeft) * scale  / _this.data.imgWidth
            let scaley = (touch.clientY - _this.data.alignTop) * scale / _this.data.imgHeight        
            if (_this.data.rotate){
                scalex = (touch.clientY - _this.data.alignTop) * scale / _this.data.imgWidth
                scaley = 1 -(touch.clientX - _this.data.alignLeft) * scale / _this.data.imgHeight
            }
            let msg = JSON.stringify({
                "msg_type": 2,
                "msg_inject_touch_action": 2,
                "msg_inject_touch_index": touch.identifier,
                "msg_inject_touch_position": {
                    "x": scalex, "y": scaley, "width": _this.data.imgWidth, "height": _this.data.imgHeight
                }
            })
            _this.sendSocketMessage(msg);   
        })          
    }
    handleEnd(){
        let _this = this;
        wx.onTouchEnd(function(e){
            if (!_this.data.socketOpen)
                return;
            let touch = e.changedTouches[0]
            let scalex = (touch.clientX - _this.data.alignLeft) * scale  / _this.data.imgWidth
            let scaley = (touch.clientY - _this.data.alignTop) * scale  / _this.data.imgHeight        
            if (_this.data.rotate){
                scalex = (touch.clientY - _this.data.alignTop) * scale  / _this.data.imgWidth
                scaley = 1 -(touch.clientX - _this.data.alignLeft) * scale / _this.data.imgHeight
            }
            let msg = JSON.stringify({
                "msg_type": 2,
                "msg_inject_touch_action": 1,
                "msg_inject_touch_index": touch.identifier,
                "msg_inject_touch_position": {
                    "x": scalex, "y": scaley, "width": _this.data.imgWidth, "height": _this.data.imgHeight
                }
            })
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
}