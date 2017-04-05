/**
 * Created by ncu on 3/29/2017.
 */
namespace App{
    export class RootView extends PIXI.Container{

        private _name :string;

        constructor() {
            super()
            this._name = "RootContainer";
        }
        public get name (){
            return this._name
        }

    }
}