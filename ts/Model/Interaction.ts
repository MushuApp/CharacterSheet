/**
 * Created by ncu on 3/31/2017.
 */
namespace App {

    export class Interaction extends Pluck.Model {

        constructor() {
            super()
        }

        public attachEvents(obj) {
            var that = this;

            this.interactOn(obj)
            obj.on('pointerdown', function(data){
                that.sendNotification('dontClickOnMe',{event:data})
            });
            obj.on('pointerup', function(data){
                that.sendNotification('thanksForStopingThat',{event:data})
            });
            obj.on('pointerupoutside', function(data){
                that.sendNotification('youLeaveMe',{event:data})
            });
            obj.on('pointermove', function(data){
                that.sendNotification('leaveMeBe',{event:data})
            });
        }

        private interactOn(obj) {
            obj.interactive = true
            obj.buttonMode = true
        }

        private interactOff(obj) {
            obj.interactive = false
            obj.buttonMode = false
        }

    }
}