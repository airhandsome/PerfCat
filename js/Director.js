import HomeScene from './scene/homeScene';
import PhoneScene from './scene/phoneScene';
import DataStore from './base/DataStore';
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;
export default class Director {
    constructor (ctx) {
        this.currentIndex = 0;
        this.ctx = ctx; // 主屏的ctx
    }
    static getInstance () {
        if (!Director.instance) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    run(ctx) {
        this.showHomeScene(ctx);
    }
    // 首页场景
    showHomeScene (ctx) {
        this.homeScene = new HomeScene(ctx);
    }

    toPhoneScene(sessionId){
        let ctx = DataStore.getInstance().ctx;
        this.offScreenCanvas = wx.createCanvas();
        this.offScreenCanvas.width = screenWidth * ratio;
        this.offScreenCanvas.height = screenHeight * ratio;
        let phoneCtx = this.offScreenCanvas.getContext('2d');
        // 按照 750设计稿绘制
        phoneCtx.scale(ratio, ratio);
        let scales = screenWidth / 750;
        phoneCtx.scale(scales, scales);

        DataStore.getInstance().offScreenCanvas = this.offScreenCanvas;
        ctx.clearRect(0, 0, screenWidth * ratio, screenHeight * ratio);
        this.phonenScene = new PhoneScene(phoneCtx, sessionId);
        ctx.drawImage(this.offScreenCanvas, 0, 0, screenWidth, screenHeight);
        DataStore.getInstance().currentCanvas = 'phoneCanvas';
    }    
}
