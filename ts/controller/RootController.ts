/**
 * Created by ncu on 3/29/2017.
 */
///<reference path="../../lib/definitions/pixi.js.d.ts"/>
///<reference path="../../lib/definitions/jquery.d.ts"/>
namespace App{
    export class RootController extends Pluck.ViewController{

        private renderer
        interaction:App.Interaction

        constructor(){

            super(new App.RootView(), new App.RootModel())

            this.interests = [

            ];
            this.interaction = new App.Interaction()
            this.renderer = PIXI.autoDetectRenderer(200, 400,{roundPixels: true});
            this.renderer.backgroundColor = 0xf0f8ff;
            $('#canvasContainer').append(this.renderer.view);

            this.animate()
        }

        onRegister(){

            this.addChildViewController(new App.TabController(new App.TabView(),new App.TabModel()))
            this.sendNotification('drawTabs')
        }

        handleNotification(notification){

        }
        private animate() {
            this.renderer.render(this._view);
            var that = this;
            requestAnimationFrame(function () {
                that.animate()
            });
        }
    }
}