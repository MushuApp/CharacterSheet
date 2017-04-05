var Pluck;
(function (Pluck) {
    var Model = (function () {
        function Model() {
        }
        Model.prototype.sendNotification = function (type, body) {
            Pluck.ViewController.getRoot().sendNotification(type, body);
        };
        Model.prototype.dispose = function () {
        };
        return Model;
    })();
    Pluck.Model = Model;
})(Pluck || (Pluck = {}));
var Pluck;
(function (Pluck) {
    var Notification = (function () {
        function Notification(name, body) {
            this._name = name;
            this._body = body;
        }
        Object.defineProperty(Notification.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Notification.prototype, "body", {
            get: function () {
                return this._body;
            },
            enumerable: true,
            configurable: true
        });
        return Notification;
    })();
    Pluck.Notification = Notification;
})(Pluck || (Pluck = {}));
/**
 * Created by axmin on 24.3.2016 г..
 */
var Pluck;
(function (Pluck) {
    //import * as Notification from 'Notification';
    var NotificationMap = (function () {
        function NotificationMap() {
            this.data = {};
        }
        NotificationMap.prototype.register = function (controller) {
            var interests = controller.interests;
            for (var i = 0; i < interests.length; i++) {
                this.registerRecipient(interests[i], controller);
            }
        };
        NotificationMap.prototype.unregister = function (controller) {
            var interests = controller.interests;
            for (var i = 0; i < interests.length; i++) {
                var recipients = this.getRecipients(interests[i]);
                recipients.splice(recipients.indexOf(controller), 1);
            }
        };
        NotificationMap.prototype.notify = function (notification) {
            var recipients = this.getRecipients(notification.name);
            if (recipients) {
                recipients = recipients.concat();
                for (var i = 0; i < recipients.length; i++) {
                    recipients[i].handleNotification(notification);
                }
            }
        };
        NotificationMap.prototype.registerRecipient = function (notificationName, controller) {
            if (notificationName in this.data) {
                var recipients = this.getRecipients(notificationName);
                recipients.push(controller);
            }
            else {
                this.data[notificationName] = [];
                this.data[notificationName][0] = controller;
            }
        };
        NotificationMap.prototype.getRecipients = function (notificationName) {
            return this.data[notificationName];
        };
        return NotificationMap;
    })();
    Pluck.NotificationMap = NotificationMap;
})(Pluck || (Pluck = {}));
/**
 * Created by axmin on 16.6.2016 г..
 */
var Pluck;
(function (Pluck) {
    var HashMap = (function () {
        function HashMap() {
            this.keyArray = [];
            this.valueArray = [];
        }
        HashMap.prototype.add = function (key, value) {
            var index = this.keyArray.indexOf(key);
            if (index == -1) {
                this.keyArray.push(key);
                this.valueArray.push(value);
            }
            else {
                this.valueArray[index] = value;
            }
        };
        HashMap.prototype.getVal = function (key) {
            var index = this.keyArray.indexOf(key);
            return this.valueArray[index];
        };
        HashMap.prototype.del = function (key) {
            var index = this.keyArray.indexOf(key);
            this.keyArray.splice(index, 1);
            this.valueArray.splice(index, 1);
        };
        return HashMap;
    })();
    Pluck.HashMap = HashMap;
})(Pluck || (Pluck = {}));
/**
 * Created by axmin on 24.3.2016 г..
 */
///<reference path="../utils/HashMap.ts"/>
var Pluck;
(function (Pluck) {
    var ViewController = (function () {
        function ViewController(view, model) {
            if (view === void 0) { view = null; }
            if (model === void 0) { model = null; }
            this.interests = [];
            this.parent = null;
            this.children = [];
            this.autoDispose = true;
            this._view = view;
            this._model = model; // not every controller has model
            this._name = Pluck.GlobalFNs.getQualifiedClassName(this);
        }
        ViewController.setRoot = function (root) {
            if (this.root) {
                throw new Error('Root controller has been already set!');
            }
            this.root = root;
            this.controllerMap.add(this.root.constructor, this.root);
            this.root.onRegister();
            ViewController.notificationMap.register(this.root);
        };
        ViewController.getRoot = function () {
            return this.root;
        };
        ViewController.disposeRootController = function () {
            while (this.root.children.length > 0) {
                this.root.removeChildViewController(this.root.children[0]);
            }
            this.controllerMap.del(this.root.constructor);
            this.notificationMap.unregister(this.root);
            this.root.onUnregister();
            if (this.root.autoDispose) {
                this.root.destroy();
            }
            this.root = null;
        };
        //body parameter should be optional ?
        ViewController.prototype.sendNotification = function (type, body) {
            ViewController.notificationMap.notify(new Pluck.Notification(type, body));
        };
        ViewController.prototype.handleNotification = function (notification) {
        };
        ViewController.prototype.onRegister = function () {
        };
        ViewController.prototype.onUnregister = function () {
        };
        ViewController.prototype.hasChildViewController = function (controller) {
            return this.children.indexOf(controller) != -1;
        };
        ViewController.prototype.addChildViewController = function (controller) {
            if (!this.hasChildViewController(controller)) {
                this.children.push(controller);
                controller.parent = this;
                ViewController.controllerMap.add(controller.constructor, controller);
                ViewController.notificationMap.register(controller);
                if (this._view instanceof PIXI.DisplayObject && controller._view instanceof PIXI.DisplayObject) {
                    this._view.addChild(controller._view);
                }
                controller.onRegister();
            }
            return controller;
        };
        ViewController.prototype.removeChildViewController = function (controller) {
            if (this.hasChildViewController(controller)) {
                while (controller.children.length > 0) {
                    controller.removeChildViewController(controller.children[0]);
                }
                this.children.splice(this.children.indexOf(controller), 1);
                controller.parent = null;
                ViewController.controllerMap.del(controller.constructor);
                ViewController.notificationMap.unregister(controller);
                controller.onUnregister();
                if (controller.autoDispose) {
                    controller.destroy();
                }
            }
        };
        ViewController.prototype.destroy = function () {
            this.dispose();
            if (this._view && 'dispose' in this._view)
                this._view.dispose();
            if (this._model && 'dispose' in this._model)
                this._model.dispose();
            if (this._view instanceof PIXI.DisplayObject) {
                if (this._view.parent) {
                    this._view.parent.removeChild(this._view);
                }
                this._view = null;
                this._model = null;
            }
        };
        ViewController.prototype.dispose = function () {
        };
        ViewController.prototype.getController = function (constructor) {
            if (ViewController.controllerMap.getVal(constructor) == undefined) {
                return null;
            }
            return ViewController.controllerMap.getVal(constructor);
        };
        ViewController.prototype.unique = function () {
            return this.getController(this._name) || this;
        };
        Object.defineProperty(ViewController.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewController.prototype, "zIndex", {
            get: function () {
                if (this._view instanceof PIXI.DisplayObject) {
                    var displayObject = this._view;
                    if (displayObject.parent)
                        return displayObject.parent.getChildIndex(displayObject);
                    else
                        return -1;
                }
                return -1;
            },
            set: function (value) {
                if (this._view instanceof PIXI.DisplayObject) {
                    var displayObject = this._view;
                    if (displayObject.parent)
                        displayObject.parent.setChildIndex(displayObject, value);
                }
            },
            enumerable: true,
            configurable: true
        });
        // TODO check if works
        ViewController.controllerMap = new Pluck.HashMap;
        ViewController.notificationMap = new Pluck.NotificationMap();
        ViewController.root = null;
        return ViewController;
    })();
    Pluck.ViewController = ViewController;
})(Pluck || (Pluck = {}));
var Pluck;
(function (Pluck) {
    var ArrayTools = (function () {
        function ArrayTools() {
            throw new Error("This is a static class");
        }
        ArrayTools.flatten = function (array) {
            var flattened = [];
            for (var i = 0; i < array.length; i++) {
                var obj = array[i];
                if (obj instanceof Array) {
                    flattened = flattened.concat(this.flatten(obj));
                }
                else {
                    flattened.push(obj);
                }
            }
            return flattened;
        };
        ArrayTools.equals = function (arr1, arr2) {
            if (arr1.length != arr2.length) {
                return false;
            }
            for (var i = 0; i < arr1.length; i++) {
                if (arr1[i] != arr2[i]) {
                    return false;
                }
            }
            return true;
        };
        ArrayTools.diff = function (array, compare) {
            var unique = [];
            for (var i = 0; i < array.length; i++) {
                if (array.indexOf(compare) > -1) {
                    unique.push(array[i]);
                }
            }
            return unique;
        };
        return ArrayTools;
    })();
    Pluck.ArrayTools = ArrayTools;
})(Pluck || (Pluck = {}));
var Pluck;
(function (Pluck) {
    var External = (function () {
        function External() {
        }
        External.prototype.serialize = function (obj) {
            for (var key in obj) {
                if (this.hasOwnProperty(key)) {
                    if (typeof this[key] === "object" && this[key] instanceof External) {
                        this[key].serialize(obj[key]);
                    }
                    else {
                        this[key] = obj[key];
                    }
                }
            }
        };
        return External;
    })();
    Pluck.External = External;
})(Pluck || (Pluck = {}));
var Pluck;
(function (Pluck) {
    var GlobalFNs = (function () {
        function GlobalFNs() {
            throw new Error("This is a static class");
        }
        /**
         *
         * @returns {boolean} Returns true if the userAgent is mobile device
         */
        GlobalFNs.isMobile = function () {
            if (navigator.userAgent.match(/Android/i) ||
                navigator.userAgent.match(/webOS/i) ||
                navigator.userAgent.match(/iPhone/i) ||
                navigator.userAgent.match(/iPad/i) ||
                navigator.userAgent.match(/iPod/i) ||
                navigator.userAgent.match(/BlackBerry/i) ||
                navigator.userAgent.match(/Windows Phone/i)) {
                return true;
            }
            else {
                return false;
            }
        };
        /**
         *
         * @param object Instance of an object
         * @returns {string} Name of the class
         */
        GlobalFNs.getQualifiedClassName = function (object) {
            return object.constructor.Name;
        };
        return GlobalFNs;
    })();
    Pluck.GlobalFNs = GlobalFNs;
})(Pluck || (Pluck = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Created by ncu on 3/29/2017.
 */
///<reference path="../../lib/definitions/pixi.js.d.ts"/>
///<reference path="../../lib/definitions/jquery.d.ts"/>
var App;
(function (App) {
    var RootController = (function (_super) {
        __extends(RootController, _super);
        function RootController() {
            _super.call(this, new App.RootView(), new App.RootModel());
            this.interests = [];
            this.interaction = new App.Interaction();
            this.renderer = PIXI.autoDetectRenderer(200, 400, { roundPixels: true });
            this.renderer.backgroundColor = 0xf0f8ff;
            $('#canvasContainer').append(this.renderer.view);
            this.animate();
        }
        RootController.prototype.onRegister = function () {
            this.addChildViewController(new App.TabController(new App.TabView(), new App.TabModel()));
            this.sendNotification('drawTabs');
        };
        RootController.prototype.handleNotification = function (notification) {
        };
        RootController.prototype.animate = function () {
            this.renderer.render(this._view);
            var that = this;
            requestAnimationFrame(function () {
                that.animate();
            });
        };
        return RootController;
    })(Pluck.ViewController);
    App.RootController = RootController;
})(App || (App = {}));
/**
 * Created by ncu on 4/4/2017.
 */
var App;
(function (App) {
    var TabController = (function (_super) {
        __extends(TabController, _super);
        function TabController(view, model) {
            _super.call(this, view, model);
            this.interests = [
                'drawTabs',
                'dontClickOnMe', 'thanksForStopingThat', 'leaveMeBe', 'youLeaveMe'
            ];
        }
        TabController.prototype.handleNotification = function (notification) {
            console.log("notification:", notification); //TODO:remove
            if (notification.name == 'dontClickOnMe') {
                var event_1 = notification.body.event;
                if (event_1.currentTarget) {
                    event_1.currentTarget.dragging = true;
                    event_1.currentTarget.alpha = 0.5;
                    event_1.data.getLocalPosition(event_1.currentTarget.parent, this._model.mousePosition);
                }
                event_1.stopPropagation();
            }
            else if (notification.name == 'thanksForStopingThat') {
                var target = notification.body.event.target;
                target.dragging = false;
                target.alpha = 1;
            }
            else if (notification.name == 'leaveMeBe') {
                var event_2 = notification.body.event;
                if (event_2.currentTarget && event_2.currentTarget.dragging) {
                    var newPosition = event_2.data.getLocalPosition(event_2.currentTarget.parent);
                    event_2.currentTarget.position.x += Math.round(newPosition.x - this._model.mousePosition.x);
                    //event.currentTarget.position.y += Math.round(newPosition.y - this._model.mousePosition.y);
                    this._model.mousePosition.copy(newPosition);
                    this.checkTabs(event_2.currentTarget, this._model.tabs);
                }
            }
            else if (notification.name == 'youLeaveMe') {
                var event_3 = notification.body.event;
                if (event_3.currentTarget) {
                    event_3.currentTarget.dragging = false;
                    event_3.currentTarget.alpha = 1;
                }
            }
            else if (notification.name = 'drawTabs') {
                this.drawRect();
            }
        };
        TabController.prototype.checkTabs = function (target, tabs) {
            console.log("target:", target); //TODO:remove
            if (tabs) {
            }
            else {
            }
        };
        TabController.prototype.drawRect = function () {
            var rect = this._view.drawRect();
            var root = Pluck.ViewController.getRoot();
            rect.name = this._model.tabs[0];
            root.interaction.attachEvents(rect);
            this.checkTabs(rect, root);
        };
        return TabController;
    })(Pluck.ViewController);
    App.TabController = TabController;
})(App || (App = {}));
/**
 * Created by ncu on 3/31/2017.
 */
var App;
(function (App) {
    var Interaction = (function (_super) {
        __extends(Interaction, _super);
        function Interaction() {
            _super.call(this);
        }
        Interaction.prototype.attachEvents = function (obj) {
            var that = this;
            this.interactOn(obj);
            obj.on('pointerdown', function (data) {
                that.sendNotification('dontClickOnMe', { event: data });
            });
            obj.on('pointerup', function (data) {
                that.sendNotification('thanksForStopingThat', { event: data });
            });
            obj.on('pointerupoutside', function (data) {
                that.sendNotification('youLeaveMe', { event: data });
            });
            obj.on('pointermove', function (data) {
                that.sendNotification('leaveMeBe', { event: data });
            });
        };
        Interaction.prototype.interactOn = function (obj) {
            obj.interactive = true;
            obj.buttonMode = true;
        };
        Interaction.prototype.interactOff = function (obj) {
            obj.interactive = false;
            obj.buttonMode = false;
        };
        return Interaction;
    })(Pluck.Model);
    App.Interaction = Interaction;
})(App || (App = {}));
/**
 * Created by ncu on 3/29/2017.
 */
var App;
(function (App) {
    var RootModel = (function (_super) {
        __extends(RootModel, _super);
        function RootModel() {
            _super.call(this);
            this.map = new Pluck.HashMap();
        }
        return RootModel;
    })(Pluck.Model);
    App.RootModel = RootModel;
})(App || (App = {}));
/**
 * Created by ncu on 4/4/2017.
 */
var App;
(function (App) {
    var TabModel = (function (_super) {
        __extends(TabModel, _super);
        function TabModel() {
            _super.call(this);
            this._tabs = ['Main', 'Stats', 'Skills'];
            this.mousePosition = new PIXI.Point(0, 0);
        }
        Object.defineProperty(TabModel.prototype, "tabs", {
            get: function () {
                return this._tabs.slice();
            },
            enumerable: true,
            configurable: true
        });
        return TabModel;
    })(Pluck.Model);
    App.TabModel = TabModel;
})(App || (App = {}));
/**
 * Created by ncu on 3/29/2017.
 */
var App;
(function (App) {
    var RootView = (function (_super) {
        __extends(RootView, _super);
        function RootView() {
            _super.call(this);
            this._name = "RootContainer";
        }
        Object.defineProperty(RootView.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        return RootView;
    })(PIXI.Container);
    App.RootView = RootView;
})(App || (App = {}));
/**
 * Created by ncu on 4/4/2017.
 */
var App;
(function (App) {
    var TabView = (function (_super) {
        __extends(TabView, _super);
        function TabView() {
            _super.call(this);
            this._name = "TabView";
        }
        Object.defineProperty(TabView.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        TabView.prototype.drawRect = function () {
            var rect;
            rect = new PIXI.Graphics();
            rect.lineStyle(/*strokeWidth*/ 1, 0x15090A);
            rect.beginFill(0x25dccd, /*graphicsAlpha*/ 0.8);
            rect.drawRect(0, 0, 200, 400);
            rect.endFill();
            this.addChild(rect);
            return rect;
        };
        return TabView;
    })(PIXI.Container);
    App.TabView = TabView;
})(App || (App = {}));
//# sourceMappingURL=lib.js.map