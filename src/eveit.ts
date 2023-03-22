/*
 * @Author: chenzhongsheng
 * @Date: 2023-03-21 22:12:29
 * @Description: Coding something
 */

import version from './version';
 
type IJson<T> = {
    [prop in string]: T
}

type IListener<K extends Array<any> = any[]> = (...args: K) => void;

declare interface IGlobalType extends IJson<any[]>{};

export class Eveit<T extends IJson<any[]> = IJson<any[]>> {
    static version = version;
    static _: Eveit<IGlobalType>;

    static emit (name: string, ...args: any[]) {this._.emit(name, ...args);}
    static off (name: string, listener: IListener) {this._.off(name, listener);}
    static clear (name: string) {this._.clear(name);}
    static on (name: string, listener: IListener) {this._.on(name, listener);}
    static once (name: string, listener: IListener) {this._.once(name, listener);}
    static head (name: string, listener: IListener) {this._.head(name, listener);}
    static headOnce (name: string, listener: IListener) {this._.headOnce(name, listener);}
    static usePrevEmit = false;

    usePrevEmit?: boolean;

    private _map: any = {};
    private _prevData: any = {};

    emit <Key extends keyof T> (name: Key, ...args: T[Key]) {
        this._prevData[name] = args;
        const list = this._map[name];
        if (!list) return false;
        list.forEach((fn: any) => fn(...args));
        return true;
    }
    off <Key extends keyof T> (name: Key, listener: IListener<T[Key]>) {
        delete this._prevData[name];
        const list = this._map[name];
        if (!list) return false;
        const index = list.indexOf(listener);
        if (index === -1) return false;
        list.splice(index, 1);
        return true;
    }
    clear<Key extends keyof T> (name: Key) {
        if (!this._map[name]) return false;
        delete this._map[name];
        delete this._prevData[name];
        return true;
    }
    private _checkPrev (name: any, listener: IListener) {
        if (this.usePrevEmit === false) return;

        if (Eveit.usePrevEmit || this.usePrevEmit) {
            const data = this._prevData[name];
            if (typeof data !== 'undefined') {
                listener(...data);
            }
        }
    }
    on <Key extends keyof T> (name: Key, listener: IListener<T[Key]>) {
        this._checkPrev(name, listener);
        this._getList(name).push(listener);
    }
    once <Key extends keyof T> (name: Key, listener: IListener<T[Key]>) {
        this.on(name, this._onceListener(name, listener));
    }
    head <Key extends keyof T> (name: Key, listener: IListener<T[Key]>) {
        this._checkPrev(name, listener);
        this._getList(name).unshift(listener);
    }
    headOnce <Key extends keyof T> (name: Key, listener: IListener<T[Key]>) {
        this.head(name, this._onceListener(name, listener));
    }
    private _getList (name: any) {
        let list = this._map[name];
        if (!list) this._map[name] = list = [];
        return list;
    }
    private _onceListener (name: any, listener: IListener) {
        const newListener = (...args: any[]) => {
            listener(...args);
            this.off(name, newListener);
        };
        return newListener;
    }
    static bind<T extends IJson<any[]> = IJson<any[]>> (object: any) {
        Object.assign(object, Eveit.prototype, new Eveit<T>());
    }
}

Eveit._ = new Eveit<IGlobalType>();
