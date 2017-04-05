/**
 * Created by ncu on 4/4/2017.
 */
namespace App{
    export class TabModel extends Pluck.Model{

        mousePosition:PIXI.Point
        private _tabs = ['Main','Stats','Skills']

        constructor(){
            super()

            this.mousePosition = new PIXI.Point(0,0)

        }
        get tabs(){
            return this._tabs.slice()
        }
    }
}