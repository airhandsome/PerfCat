import Background from '../runtime/background'
import DataStore from '../base/DataStore';
import Sprite from '../base/Sprite';
import {drawText} from '../utils/index.js';
// import {getAuthSettings, createUserInfoButton} from '../utils/auth.js';
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const ratio = 750 / screenWidth;//wx.getSystemInfoSync().pixelRatio;
export default class HomeScene {
  constructor(ctx) {
      this.ctx = ctx;
      this.canvas = DataStore.getInstance().canvas;
      this.loop();
  }
  drawHomeEle () {     
      this.logoImg = Sprite.getImage('logo');
      this.homeImg = new Sprite(this.logoImg, 80, screenHeight / 5 , this.logoImg.width / 2, this.logoImg.height / 2);
      this.homeImg.draw(this.ctx);
      
      this.title = "为移动开发者打造的真机测试服务云平台";
      drawText(this.title, 40, screenHeight / 4 + 30, screenWidth / 5 * 4 , this.ctx, 1.1);
      this.subtitle = "前往 device.unity.cn 了解更多"
      drawText(this.subtitle, 80, screenHeight / 4 + 60, screenWidth / 5 * 4 , this.ctx, 1.1, "#2196f3");
  }
  drawButton () {      
      this.scanImg = Sprite.getImage('scan_btn');
      this.scanSprite = new Sprite(this.scanImg, (screenWidth - this.scanImg.width) / 2 + 60 , screenHeight / 2 ,
          this.scanImg.width/1.5, this.scanImg.height/1.5);
      this.scanSprite.draw(this.ctx);

      this.bindEvent();
  }
  loop () {
        this.ctx.clearRect(0, 0, screenWidth, screenHeight);
        this.background = new Background(this.ctx);
        this.drawHomeEle();
        this.drawButton();
        this.requestId = requestAnimationFrame(this.loop.bind(this));
    }   
    bindEvent () {
        let _this = this;
        wx.offTouchStart();     
        wx.onTouchStart((e) => {
            let x = e.touches[0].clientX,
                y = e.touches[0].clientY;
            if (x >= _this.scanSprite.x
                && x <= _this.scanSprite.x + _this.scanSprite.width
                && y >= _this.scanSprite.y
                && y <= _this.scanSprite.y + _this.scanSprite.height) {                    
                this.scanQRCode()
            }
        });
    }
    scanQRCode(){
        let _this = this
        wx.scanCode({
          // onlyFromCamera: true,
          scanType: [],
          success: (result) => {            
            let url = result.result            
            if (url == null || url.indexOf("?") == -1){
                wx.showToast({
                    title: 'please scan valid QR code',                   
                    duration: 2000,
                    icon: 'none'
                    })
            }else{
                _this.sessionId = url.split('id=')[1];
                cancelAnimationFrame(_this.requestId);
                DataStore.getInstance().director.toPhoneScene(_this.sessionId);                             
            }
          },
          fail: (res) => {
            wx.showToast({
                title: 'please scan valid QR code',                   
                duration: 2000,
                icon: 'none'
              })
          },
          complete: (res) => {},
        })
    }
}