import Sprite from '../base/Sprite';
import Background from '../runtime/background';
// 采用750的设计稿
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const ratio = 750 / screenWidth;//wx.getSystemInfoSync().pixelRatio;
const scale = 750 / screenWidth;
const baseUrl = 'https://device.unity.cn/backend/weixin/';
export default class Phone {
    data = {
        keepRation: false,
    }
    constructor(ctx, sessionId) {
        console.log(sessionId)
        this.background = new Background(ctx, scale);      
        this.sessionId = sessionId;
        this.ctx = ctx;
        this.init(this.sessionId);
        //this.drawPic();
        this.addTouch();
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
            console.log("open......")
            _this.sendStartKey()            
        })
    
        wx.onSocketMessage(function(res) {
            console.log("Receive");      
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
                _this.data.imgData = imageData                
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
    drawPic() {
        let _this = this;
        let bgImg = Sprite.getImage('question_bg');
        this.offset = (750 - bgImg.width)/2;
        let bg = new Sprite(bgImg, this.offset, 20 + this.bar.height + 20, bgImg.width, bgImg.height);
        bg.draw(this.ctx);
        this.bg = bg;
        let pic = new Image();
        pic.src = this.img;
        pic.onload = () => {
            _this.centerImg(pic, bg.x + 20, bg.y + 20, bg.width-40, bg.height-40);
            _this.reDrawCanvas();
        }
    }
    // 重新绘制canvas 到主屏上
    reDrawCanvas() {
        DataStore.getInstance().ctx.drawImage(DataStore.getInstance().offScreenCanvas, 0, 0, screenWidth, screenHeight);
    }
    addTouch(){
        let _this = this;
        wx.onTouchStart((e)=>{
            console.log(_this.selectArea.endY);
            if (!this.selected
                &&e.touches[0].clientX >= _this.selectArea.x
                && e.touches[0].clientX <= _this.selectArea.endX
                && e.touches[0].clientY >= _this.selectArea.y
                && e.touches[0].clientY <= _this.selectArea.endY){
                this.selected = true;
            }
        });
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
}