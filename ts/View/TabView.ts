/**
 * Created by ncu on 4/4/2017.
 */
namespace App{
    export class TabView extends PIXI.Container{

        private _name :string;

        constructor() {
            super()
            this._name = "TabView";

        }
        public get name(){
            return this._name
        }
        drawRect(){
            var rect

            rect = new PIXI.Graphics();
            rect.lineStyle(/*strokeWidth*/1,0x15090A);
            rect.beginFill(0x25dccd,/*graphicsAlpha*/0.8);
            rect.drawRect(0,0,200,400);
            rect.endFill();
            this.addChild(rect);
            return rect
        }
    }
}