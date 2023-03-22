<!--
 * @Author: chenzhongsheng
 * @Date: 2023-03-22 09:19:41
 * @Description: Coding something
-->
## 0.0.1

初始版本

1. 强大的ts类型支持，支持 on，emit等函数的事件名和参数的类型提示
2. 支持静态调用、new调用、继承调用和绑定使用
3. 支持获取配置是否触发on之前的上次emit的事件
4. 支持head,once,headOnce,off,clear方法（后续可能会考虑加入index、order等逻辑，但是可能会增大包体积）
5. 体积小巧(3kb)、简单易用、不依赖任何第三方库

1. Powerful ts type support, support event names and parameter type hints for on, emit and other functions
6. Support static call, new call, inheritance call and binding use
7. Support to get whether the configuration triggers the last emit event before on
8. Support head, once, headOnce, off, clear methods (subsequent may consider adding logic such as index, order, but may increase the package size)
9. Small size (3kb), easy to use, does not depend on any third-party library