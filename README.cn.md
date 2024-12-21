# [Eveit](https://github.com/theajack/eveit) => Event Emitter

**[中文](https://github.com/theajack/eveit/blob/master/README.cn.md) | [Online Trial](https://shiyix.cn/jsbox/?github=theajack.eveit) | [Changelog](https://github.com/theajack/eveit/blob/master/scripts/version.md) | [Gitee](https://gitee.com/theajack/eveit) | [Message Board](https://theajack.github.io/message-board?app=eveit)**

是的，这又是一个新的js事件库，为什么又开发了一个新的呢？我们先来看看它的优点

## 1. features

1. 强大的ts类型支持，支持 on，emit等函数的事件名和参数的类型提示
2. 支持静态调用、new调用、继承调用和绑定使用
3. 支持获取配置是否触发on之前的上次emit的事件
4. 支持head,once,headOnce,off,clear方法（后续可能会考虑加入index、order等逻辑，但是可能会增大包体积）
5. 体积小巧(3kb)、简单易用、不依赖任何第三方库

## 2. quickstart

```
npm i eveit
```

### 2.1 基础使用（静态调用）

```js
import Eveit from 'eveit';
Eveit.on('hello', (v) => {
    console.log('Say ' + v);
});
Eveit.emit('hello', 'Hi');
```

### 2.2 ts类型支持

```ts
const e = new Eveit<{
    aa: [string, number, ...any[]],
    bb: [{a: string}],
}>();
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
```

### 2.3 new使用

```js
const e = new Eveit();
e.on('hello', (v) => {
    console.log('Say ' + v);
});
e.emit('hello', 'Hi');
```

### 2.3 继承使用

```js
class Test extends Eveit {
    test () {
        this.on('hello', () => {console.log('hello');});
        this.emit('hello');
    }
}
```

泛型 + 继承

```ts
class Test extends Eveit<{
    aa: [string, number, ...any[]],
    bb: [{a: string}],
}> {
    // ...
}
```

### 2.4 绑定使用

```js
const a = {};
Eveit.bind(a);
a.on('hello', () => {console.log('hello');});
a.emit('hello');
```

绑定 + 泛型

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
e.once('hello', (v) => {console.log('once', v);}); // 只触发一次的时间
e.head('hello', (v) => {console.log('head', v);}); // 将事件放到头部
e.headOnce('hello', (v) => {console.log('head', v);}); // 结合上面两种
const handler = (v) => {console.log(v);}
e.on('hello', handler);
e.off('hello', handler); // 移除单个事件监听
e.clear('hello'); // 移除整个事件的所有监听
```

### 2.6 触发前置事件

全局开启

```js
Eveit.usePrevEmit = true;
Eveit.emit('hello', 'hi');
Eveit.on('hello', (v) => {console.log(v);});
```

对某个对象开启或关闭

```js
const e = new Eveit();
e.usePrevEmit = false;
e.emit('hello', 'hi');
e.on('hello', (v) => {console.log(v);}); // 不会触发 hello
```

如果只希望对静态调用触发可以这么写

```js
Eveit._.usePrevEmit = true;
```

### 2.7 onWait

```js
Eveit.onWait('xx').then();

const e = new Eveit();
e.onWait('xx').then();
```

### 2.8 使用 MessageChannel 用于跨worker通信

#### 2.8.1 基础使用

worker 中 (worker.js)

```js
import {MCEveit} from 'eveit';

async function workerMain () {
    const e = await MCEveit.copy();
    e.on('test', (v) => {console.log('Worker receive', v);});
    e.emit('test', 'worker data');
}
workerMain();
```

主线程

```js
import {MCEveit} from 'eveit';

const e = new MCEveit();

const worker = new Worker('worker.js'); // 填写真实的worker 或使用 vite import语法导入worker
e.into(worker)

e.on('test', (v) => {console.log('Main receive', v);});
e.emit('test', 'main data');
```

#### 2.8.1 进阶使用

worker 中 (worker.js)

```js
// id 可以约定一致或使用worker message传递
const e = await MCEveit.copy(id);

e.emitTransfer('test', {
    data: [{
        stream: readableStream, // 需要传递的 Transferable
    }],
    transfer: [readableStream]
})
```
