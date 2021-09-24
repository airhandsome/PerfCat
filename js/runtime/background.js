/**
 * Created by cooky on 2018/5/9.
 */
import Sprite from '../base/Sprite'

const screenWidth  = window.innerWidth;
const screenHeight = window.innerHeight;

export default class Background extends Sprite {
    constructor (ctx, scale = 1) {
        let bgImg = Sprite.getImage('background');
        super(bgImg, 0, 0, screenWidth * scale, screenHeight * scale);
        this.draw(ctx);
    }
}