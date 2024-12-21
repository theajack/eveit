# [Eveit](https://github.com/theajack/eveit) => Event Emitter

**[English](https://github.com/theajack/eveit/blob/master/README.md) | [在线使用](https://shiyix.cn/jsbox/?github=theajack.eveit ) | [更新日志](https://github.com/theajack/eveit/blob/master/scripts/version.md) | [Gitee](https://gitee.com/theajack/eveit) | [留言板](https://theajack.github.io/message-board?app=eveit)**

Yes, this is another new js event library, why develop a new one? Let's first look at its advantages

## 1. features

1. Powerful ts type support, support event names and parameter type hints for on, emit and other functions
2. Support static call, new call, inheritance call and binding use
3. Support to get whether the configuration triggers the last emit event before on
4. Support head, once, headOnce, off, clear methods (subsequent may consider adding logic such as index, order, but may increase the package size)
5. Small size (3kb), easy to use, does not depend on any third-party library

## 2. quickstart

```
npm i eveit
```

### 2.1 Basic use (static call)

```js
import Eveit from 'eveit';
Eveit.on('hello', (v) => {
     console.log('Say ' + v);
});
Eveit.emit('hello', 'Hi');
```

### 2.2 ts type support

```ts
const e = new Eveit<{
     aa: [string, number, ...any[]],
     bb: [{a: string}],
}>();
e.on('aa', (a1, a2, a3) => {
     // Here it will be inferred that a1 is string, a2 is number, a3 is any
});
e.on('bb', (v, v2) => {
     v.a; // here it will be inferred that v is {a:string}
     // v2 will report an error
});
e.on('cc', () => { // error, cc does not exist
});
e.emit('bb', {a: '1', b: 2}); // attribute b will report an error
```

### 2.3 new use

```js
const e = new Eveit();
e.on('hello', (v) => {
     console.log('Say ' + v);
});
e.emit('hello', 'Hi');
```

### 2.3 Inheritance use

```js
class Test extends Eveit {
     test () {
         this.on('hello', () => {console.log('hello');});
         this.emit('hello');
     }
}
```

Generics + inheritance

```ts
class Test extends Eveit<{
     aa: [string, number, ...any[]],
     bb: [{a: string}],
}> {
     //...
}
```

### 2.4 Binding usage

```js
const a = {};
Eveit.bind(a);
a.on('hello', () => {console.log('hello');});
a.emit('hello');
```

binding + generics

```ts
const a: Eveit<{aa: [string]}> & {
     [prop: string]: any;
} = {
};
Eveit.bind(a);
a.on('aa', (v) => {console.log('hello', v);});
a.emit('aa');
```

### 2.5 head,once,off,clear

```js
const e = new Eveit();
e.once('hello', (v) => {console.log('once', v);}); // Only trigger once
e.head('hello', (v) => {console.log('head', v);}); // Put the event in the head
e.headOnce('hello', (v) => {console.log('head', v);}); // combine the above two
const handler = (v) => {console.log(v);}
e.on('hello', handler);
e.off('hello', handler); // Remove a single event listener
e.clear('hello'); // Remove all listeners for the entire event
```

### 2.6 Trigger pre-events

global open

```js
Eveit.usePrevEmit = true;
Eveit.emit('hello', 'hi');
Eveit.on('hello', (v) => {console.log(v);});
```

turn on or off for an object

```js
const e = new Eveit();
e.usePrevEmit = false;
e.emit('hello', 'hi');
e.on('hello', (v) => {console.log(v);}); // will not trigger hello
```

If you only want to trigger on static calls, you can write like this

```js
Eveit._.usePrevEmit = true;
```

### 2.7 onWait

```js
Eveit.onWait('xxx').then();

const e = new Eveit();
e.onWait('xxx').then();
```