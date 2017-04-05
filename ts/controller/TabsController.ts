/**
 * Created by ncu on 4/4/2017.
 */
namespace App{
    export class TabController extends Pluck.ViewController{

        constructor(view,model){
            super(view,model)

            this.interests = [
                'drawTabs',
                'dontClickOnMe','thanksForStopingThat','leaveMeBe','youLeaveMe'
            ];
        }
        public handleNotification(notification){
console.log("notification:",notification)//TODO:remove
            if(notification.name == 'dontClickOnMe'){
                const event = notification.body.event
                if(event.currentTarget){
                    event.currentTarget.dragging = true
                    event.currentTarget.alpha = 0.5
                    event.data.getLocalPosition(event.currentTarget.parent,this._model.mousePosition )
                }
                event.stopPropagation()
            }
            else if(notification.name == 'thanksForStopingThat'){
                const target = notification.body.event.target
                target.dragging = false
                target.alpha = 1
            }

            else if(notification.name == 'leaveMeBe'){
                const event = notification.body.event

                if(event.currentTarget && event.currentTarget.dragging){


                    const newPosition = event.data.getLocalPosition(event.currentTarget.parent);
                    event.currentTarget.position.x += Math.round(newPosition.x - this._model.mousePosition.x);
                    //event.currentTarget.position.y += Math.round(newPosition.y - this._model.mousePosition.y);
                    this._model.mousePosition.copy(newPosition)

                    this.checkTabs(event.currentTarget,this._model.tabs)

                }

            }
            else if(notification.name == 'youLeaveMe'){
                const event = notification.body.event
                if(event.currentTarget){
                    event.currentTarget.dragging = false
                    event.currentTarget.alpha = 1
                }
            }else if(notification.name = 'drawTabs'){
                this.drawRect()
            }
        }

        private checkTabs(target,tabs){
            console.log("target:",target)//TODO:remove
            if(tabs){

            }else{

            }

        }

        private drawRect(){
            var rect = this._view.drawRect()
            var root = Pluck.ViewController.getRoot() as App.RootController

            rect.name = this._model.tabs[0]

            root.interaction.attachEvents(rect)
            this.checkTabs(rect,root)
        }
    }
}