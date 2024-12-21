/*
 * @Author: chenzhongsheng
 * @Date: 2023-03-21 22:12:29
 * @Description: Coding something
 */

import version from './version';

export type IJson<T> = Record<any, T>;

export type EmptyPayload = [];
export type AnyPayload = [any];

export interface IEventObject<K extends Array<any> = any[]> {
    listener: (...args: K) => void,
    prev?: boolean,
    once?: boolean,
}

export type IListener<K extends Array<any> = any[]> = ((...args: K) => void) | IEventObject<K>;

// export interface IEventBaseMap {[prop: string]: any[]}
// export type IEventBaseMap = Record<any, any>

export class Eveit<
    EventMap extends IJson<any> = IJson<any>,
> {
    static version = version;
    private static __: Eveit;
    static get _ () {
        if (!this.__) this.__ = new Eveit();
        return this.__;
    }

    static get usePrevEmit () {return this._.usePrevEmit;}
    static set usePrevEmit (v: boolean) {this._.usePrevEmit = v;}
    static emit (name: string, ...args: any[]) {this._.emit(name, ...args);}
    static off (name: string, listener: IListener) {this._.off(name, listener);}
    static clear (name: string) {this._.clear(name);}
    static on (name: string, listener: IListener) {this._.on(name, listener);}
    static once (name: string, listener: IListener) {this._.once(name, listener);}
    static onWait (name: string) {this._.onWait(name);}
    static head (name: string, listener: IListener) {this._.head(name, listener);}
    static headOnce (name: string, listener: IListener) {this._.headOnce(name, listener);}

    usePrevEmit = true; // 启用监听前一次emit , 开启时once事件有错位

    private _map: any = {};
    private _prevData: any = {};

    hasEvent<Key extends keyof EventMap> (name: Key): boolean {
        return !!this._map[name];
    }

    on <Key extends keyof EventMap>(name: { [k in Key]: IListener<EventMap[k]> }): void;
    on <Key extends keyof EventMap>(name: Key, fn: IListener<EventMap[Key]>): (()=>void);

    on <Key extends keyof EventMap> (name: Key|{
        [k in Key]: IListener<EventMap[k]>
    }, fn?: IListener<EventMap[Key]>): void|(()=>void) {
        if (typeof name === 'object') {
            const fns: (()=>void)[] = [];
            for (const k in name) {fns.push(this.on(k, name[k]));}
            return () => {fns.forEach(fn => fn());};
        } else {
            if (!fn) {throw new Error('fn is required');}
            const item = this._formatTarget(fn);
            if (this._checkPrev(name, item) && item.once) {
                return () => {};
            }
            this._getList(name).push(item);
            return () => {this.off(name, item);};
        }
    }

    private _formatTarget (fn: IListener, once?: boolean): IEventObject {
        if (typeof fn === 'function') {
            return {listener: fn, once: once ?? false, prev: this.usePrevEmit};
        }
        if (typeof once === 'boolean') {fn.once = once;}
        return fn;
    }

    emit <Key extends keyof EventMap> (name: Key, ...args: EventMap[Key]) {
        this._prevData[name] = args;
        const list: IEventObject[] = this._map[name];
        if (!list) {return false;}
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            item.listener(...args as any);
            if (item.once) {
                list.splice(i, 1);
                i--;
            }
        }
        return true;
    }
    off <Key extends keyof EventMap> (name: Key, fn: IListener<EventMap[Key]>) {
        const list = this._map[name] as IEventObject<any>[];
        if (!list) {return false;}
        const index = list.findIndex(item => item === fn || item.listener === fn);
        if (index === -1) {return false;}
        list.splice(index, 1);
        return true;
    }
    clear<Key extends keyof EventMap> (name: Key) {
        if (!this._map[name]) {return false;}
        delete this._map[name];
        delete this._prevData[name];
        return true;
    }

    onWait <Key extends keyof EventMap> (name: Key, options?: Omit<IEventObject, 'listener'>): Promise<EventMap[Key]> {
        return new Promise<EventMap[Key]>((resolve) => {
            // @ts-ignore
            let target: IListener = (...args) => resolve(args);
            if (options) {
                target = {
                    listener: target,
                    ...options,
                };
            }
            // @ts-ignore
            this.once(name, target);
        });
    }

    destroy () {
        this._map = {};
        this._prevData = {};
    }
    private _checkPrev (name: any, fn: IEventObject): any {
        if (!fn.prev) {return false;}
        const data = this._prevData[name];
        if (typeof data !== 'undefined') {
            fn.listener(...data);
            return true; // 命中prev
        }
        return false;
    }
    once <Key extends keyof EventMap> (name: Key, fn: IListener<EventMap[Key]>) {
        return this.on(name, this._formatTarget(fn, true));
    }
    head <Key extends keyof EventMap> (name: Key, fn: IListener<EventMap[Key]>) {
        const item = this._formatTarget(fn);
        if (this._checkPrev(name, item) && item.once) {
            return () => {};
        }
        this._getList(name).unshift(item);
        return () => {this.off(name, fn);};
    }
    headOnce <Key extends keyof EventMap> (name: Key, fn: IListener<EventMap[Key]>) {
        return this.head(name, this._formatTarget(fn, true));
    }
    private _getList (name: any) {
        let list = this._map[name];
        if (!list) {this._map[name] = list = [];}
        return list;
    }
}
/*
window.ee = new EventBus();
ee.emit('a');
ee.once('a', ()=>{console.log('a1')});
ee.on('a', ()=>{console.log('a2')});
ee.emit('a')
ee.emit('b');
ee.on('b', {
    listener: ()=>{console.log('b1')},
    prev: false,
});
ee.once('b', {
    listener: ()=>{console.log('b2')},
    prev: false,
});
ee.emit('b');
ee.emit('b');
*/