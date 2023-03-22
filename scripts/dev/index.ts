/*
 * @Author: tackchen
 * @Date: 2022-08-03 20:32:39
 * @Description: Coding something
 */

import Eveit from '../../src/index';

const win = (window as any);

win.Eveit = Eveit;


const e = new Eveit<{
    aa: [string, number, ...any[]],
    bb: [{a: string}],
}>();

e.on('aa', () => {});

e.on('aa', (a1, a2, a3) => {
    // 这里会推断出a1是string，a2是number, a3是any
});
e.on('bb', (v, v2) => {
    v.a; // 这里会推断出v是 {a:string}
    // v2 会报错
});
e.on('cc', () => { // 报错，不存在cc
});

e.emit('bb', {a: '1', b: 2}); // 属性b会报错

e.on('hello', (v) => {
    console.log('Say ' + v);
});
e.emit('hello', 'Hi');

class Test extends Eveit {
    test () {
        this.on('hello', () => {console.log('hello');});
        this.emit('hello');
    }
    
}

const a: Eveit<{aa: [string]}> & {
    [prop: string]: any;
} = {
};

Eveit.bind(a);

Eveit.emit('hello', 'hi');
Eveit.on('hello', (v) => {console.log(v);});