/*
 * @Author: chenzhongsheng
 * @Date: 2023-03-21 22:12:29
 * @Description: Coding something
 */

import version from './version';
 
type IJson<T> = {
    [prop in string]: T
}

type IListener = (...args: any[]) => void;

export class Eveit {
    static version = version;
    static _: Eveit;
    private _map: IJson<IListener[]> = {};
    private _prevData: IJson<any[]> = {};
    static emit (name: string, ...args: any[]) {this._.emit(name, ...args);}
    static off (name: string, listener: IListener) {this._.off(name, listener);}
    static on (name: string, listener: IListener) {this._.on(name, listener);}
    static once (name: string, listener: IListener) {this._.once(name, listener);}
    static head (name: string, listener: IListener) {this._.head(name, listener);}
    static headOnce (name: string, listener: IListener) {this._.headOnce(name, listener);}
    static UsePrevData = false;
    emit (name: string, ...args: any[]) {
        this._prevData[name] = args;
        const list = this._map[name];
        if (!list) return false;
        list.forEach(fn => fn(...args));
        return true;
    }
    off (name: string, listener: IListener) {
        delete this._prevData[name];
        const list = this._map[name];
        if (!list) return false;
        const index = list.indexOf(listener);
        if (index === -1) return false;
        list.splice(index, 1);
        return true;
    }
    private _checkPrev (name: string, listener: IListener) {
        if (!Eveit.UsePrevData) return;
        const data = this._prevData[name];
        if (typeof data !== 'undefined') {
            listener(...data);
        }
    }
    on (name: string, listener: IListener) {
        this._checkPrev(name, listener);
        this._getList(name).push(listener);
    }
    once (name: string, listener: IListener) {
        this.on(name, this._onceListener(name, listener));
    }
    head (name: string, listener: IListener) {
        this._checkPrev(name, listener);
        this._getList(name).unshift(listener);
    }
    headOnce (name: string, listener: IListener) {
        this.head(name, this._onceListener(name, listener));
    }
    private _getList (name: string) {
        let list = this._map[name];
        if (!list) this._map[name] = list = [];
        return list;
    }
    private _onceListener (name: string, listener: IListener) {
        const newListener = (...args: any[]) => {
            listener(...args);
            this.off(name, newListener);
        };
        return newListener;
    }
    static bind (object: any) {
        Object.assign(object, Eveit.prototype, new Eveit());
    }
}
Eveit._ = new Eveit();
