/**
 * Created by ncu on 3/29/2017.
 */
namespace App{
    export class RootModel extends Pluck.Model{

        map:Pluck.HashMap

        constructor(){
            super()

            this.map = new Pluck.HashMap();
        }

    }
}