{
  "title": "Lodash 源码分析（二）“Function” Methods",
  "date": "2017-08-29",
  "url": "/posts/lodash-source-code-analysis-2/",
  "description": "从调用、绑定与包装入手，阅读 Lodash 的函数方法实现。",
  "categories": [
    "工程"
  ],
  "cover": "banners/lodash-source-code-analysis-2.webp",
  "tags": [
    "javascript",
    "lodash"
  ]
}

这是Lodash源码分析的第二篇文章，我们在第一篇[Lodash 源码分析（一）“Function” Methods](http://www.chenquan.me/archives/254)中介绍了基本的`_.after`，`_.map`，以及复杂的`_.ary`函数的实现以及我们自己的自定义轻量级版本。大概清楚了Lodash的整个代码脉络。这次我们继续分析，这次我们讲讲`_.reduce`和`_.curry`。

## \_.reduce {#_reduce}

我一直觉得，如果能够理解`_.map`和`_.reduce`的实现，那么任何复杂的函数都不在话下。我们已经[介绍了`_.map`的实现](https://segmentfault.com/a/1190000010775719#articleHeader2)，知道了`_.map`函数中是如何处理集合，并将其逐个进行函数处理的。我们知道在`_.map`函数中会把三个参数传到给定的函数中，分别是`array[index]`，`index`和`array`。这次我们看看`_.reduce`函数。

众所周知，`_.reduce`函数能够将一个集合进行”折叠”。”折叠”理解起来比较抽象。我们可以通过代码作为样例说明一下：

```javascript
const _ = require("lodash");
_.reduce([1,2,3],function(a,b){return a+b});
// 6
```

如果你不知道`_.reduce`到底是怎么工作的，那么你可以看看我写的这篇文章[从Haskell、JavaScript、Go看函数式编程](https://segmentfault.com/a/1190000010632526)。我们今天的目的是看看lodash是如何实现`_.reduce`的，以及和我们函数式的实现的区别。

我们看到lodash源代码是这样的：

```javascript
function reduce(collection, iteratee, accumulator) {
var func = isArray(collection) ? arrayReduce : baseReduce,
    initAccum = arguments.length &lt; 3;

  return func(collection, getIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}
```

在官方的注释中说，对于对象，遍历顺序是无法保证的。我们不考虑这么复杂的情况，先看看`Array`的情况。其次，我们在调用`_.reduce`的时候没有传入第三个`accumulator`参数，那么函数可以简化为：

```javascript
function reduce(collection, iteratee, accumulator) {
  return arrayReduce(collection, getIteratee(iteratee, 4), accumulator, true, baseEach);
}
```

在看看`arrayReduce`函数：

```javascript
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index &lt; length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }
```

这里的`accumulator`是初始累加值，如果传入，则”折叠”在其基础上进行，就上面的最简单的例子而言，如果传入第三个参数是`2`，那么返回值就会使`8`。

```javascript
const _ = require("lodash");
_.reduce([1,2,3],function(a,b){return a+b},8);
// 8
```

所以`arrayReduce`函数就是给定一个初始值然后进行迭代的函数。我们真正需要关注的函数式`iteratee`函数，即`getIteratee(func, 4)`这里的`func`就是我进行重命名之后的自定义函数。

这个`getIteratee`函数在介绍`_.map`的时候就进行介绍了，在`func`是一个function的情况下，就是返回`func`本身。

所以我们可以把整个`reduce`函数简化为如下版本：

```javascript
function reduce(array, func, accumulator) {
    var index = -1,
        length = array == null ? 0 : array.length;
    if (length) {
      accumulator = array[++index];
    }
    while (++index &lt; length) {
      accumulator = func(accumulator, array[index], index, array);
    }
    return accumulator;
  }
```

其实看上去很像一个”递归“函数，因为前面一次的运算结果将会用于下一次函数调用，但又不是递归函数。我们其实完全可以写一个递归版本的`reduce`：

```javascript
function reduce(array,func,accumulator){
  accumulator = accumulator == null ? array[0]:accumulator;
  if (array.length &gt;0){
    var a = array.shift();
    accumulator = func(a,accumulator);
    return reduce(array,func,accumulator);
  }
  return accumulator
}
```

工作的也不错，但在分析过程中，发现lodash一直在避免修改原参数的值，尽量让整个函数调用时无副作用的。我觉得这个思想在开发过程中也有很多值得借鉴的地方。

## \_.curry {#_curry}

了解过函数式编程的同学一定听过大名鼎鼎的柯里化，在Lodash中也有一个专门用于柯里化的函数`_.curry`。这个函数接受一个函数`func`和这个函数的部分参数，然后返回一个接受剩余参数的函数`func'`。

我们看看这个函数是怎么实现的：

```javascript
function curry(func, arity, guard) {
   arity = guard ? undefined : arity;
   var result = createWrap(func, WRAP_CURRY_FLAG, undefined, undefined, undefined, undefined, undefined, arity);
   result.placeholder = curry.placeholder;
   return result;
}
```

我们又看到我们的老朋友`createWrap`了，其实这个函数我们在上一篇文章中分析过，但是我们那时候是分析`_.ary`函数的时候进行了精简，这次我们看看`createWrap`函数式怎么对`_.curry`函数进行处理的(将无关逻辑进行精简)：

```javascript
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = 0
      var length =  0;
      ary = undefined ;
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;
      var data = getData(func);
      var newData = [
        func, bitmask, thisArg, partials, holders, partialsRight, holdersRight,
        argPos, ary, arity
      ];

      if (data) {
        mergeData(newData, data);
      }
      func = newData[0];
      bitmask = newData[1];
      thisArg = newData[2];
      partials = newData[3];
      holders = newData[4];
      arity = newData[9] = newData[9] === undefined
        ? func.length
        : nativeMax(newData[9] - length, 0);
      result = createCurry(func, bitmask, arity);
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }
```

这里面的关键就是`createCurry`函数了：

```javascript
function createCurry(func, bitmask, arity) {
      var Ctor = createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length,
            placeholder = getHolder(wrapper);

        while (index--) {
          args[index] = arguments[index];
        }
        var holders = (length &lt; 3 && args[0] !== placeholder && args[length - 1] !== placeholder)
          ? []
          : replaceHolders(args, placeholder);

        length -= holders.length;
        if (length &lt; arity) {
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, undefined,
            args, holders, undefined, undefined, arity - length);
        }
        var fn = (this && this !== root && this instanceof wrapper) ? Ctor : func;
        return apply(fn, this, args);
      }
      return wrapper;
    }
```

不得不说和`createHybird`函数十分相似,但是其中还有一个比较关键的函数，就是`createRecurry`，这个函数返回了一个能够继续进行curry的函数：

```javascript
function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
      var isCurry = bitmask & WRAP_CURRY_FLAG,
          newHolders = isCurry ? holders : undefined,
          newHoldersRight = isCurry ? undefined : holders,
          newPartials = isCurry ? partials : undefined,
          newPartialsRight = isCurry ? undefined : partials;

      bitmask |= (isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG);
      bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);

      if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
        bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
      }
      var newData = [
        func, bitmask, thisArg, newPartials, newHolders, newPartialsRight,
        newHoldersRight, argPos, ary, arity
      ];

      var result = wrapFunc.apply(undefined, newData);
      if (isLaziable(func)) {
        setData(result, newData);
      }
      result.placeholder = placeholder;
      return setWrapToString(result, func, bitmask);
    }
```

Lodash为了实现curry化，进行了多层的包装，为了实现返回的是划一的Lodash中定义的能够curry化的函数。

这个函数要求接受相应的参数列表，即代码中的`data`。在curry化的过程中有一个非常重要的东西，就是占位符`placeholder`。在对curry化的函数进行调用时也可以用占位符进行占位：

```javascript
var curried = _.curry(abc);
curried(1)(2)(3);
// =&gt; [1, 2, 3]
curried(1, 2)(3);
// =&gt; [1, 2, 3]
curried(1, 2, 3);
// =&gt; [1, 2, 3]
// Curried with placeholders.
curried(1)(_, 3)(2);
// =&gt; [1, 2, 3]
```

可以用下划线`_`作为占位符占位。我们且不看lodash为我们做的很多复杂的预处理和特殊情况的处理，我们就分析`_.curry`函数实现的主要思想。首先`_.curry`函数有一个属性存储了最初的函数的接受函数参数的个数。然后有一个参数数组用于存储部分参数，如果参数个数没有满足调用函数需要的个数，就继续返回一个重新curry化的函数。

根据上面的思想我们可以写出一个简化的curry化代码：

```javascript
/**
 *
 *var abc = function(a, b, c) {
 *    return [a, b, c];
 *};
 *
 *var curried = curry(abc);
 *
 *curried(1)(2)(3);
 * // =&gt; [1, 2, 3]
 *
 * curried(1, 2)(3);
 * // =&gt; [1, 2, 3]
 *
 * curried(1, 2, 3);
 * // =&gt; [1, 2, 3]
 *
 * // Curried with placeholders.
 * curried(1)("_", 3)(2)
 * 这就无法处理了
 * // =&gt; [1, 3, 2]
 */

function curry(func){
  function wrapper(){
    func.prototype.that = func.prototype.that ? func.prototype.that : this;
    func.prototype.paramlength = func.prototype.paramlength ? func.prototype.paramlength: func.length ;
    func.prototype.paramindex = func.prototype.paramindex ?func.prototype.paramindex : 0;
    func.prototype.paramplaceholder = func.prototype.paramplaceholder ?  func.prototype.paramplaceholder : Array(func.length);
    for (var i = 0 ; i &lt; arguments.length; i++) {
      if (arguments[i] == '_'){
        continue;
      }else{
        func.prototype.paramplaceholder[func.prototype.paramindex] = arguments[i];
        func.prototype.paramindex += 1;
      }
    }
    if (func.prototype.paramindex == func.prototype.paramlength){
      func.prototype.paramindex = 0;
      return func.apply(func.prototype.that,func.prototype.paramplaceholder)
    }
    return wrapper;
  }
  return wrapper;
}
```

我们虽然可以借助Lodash的思想实现我们一个简单版本的`curry`函数，但是这个简单版本的函数有一个问题，那就是，这个函数是借助闭包实现的，在整个执行过程当中，只要被柯里化的函数没有执行结束，那么它就会一直存在在内存当中，它的一些属性也会一直存在。第二个问题是，没有办法实现Lodash的”真正”的占位符，只是在遇到”\_”的时候将其跳过了。

一个真正有效的柯里化函数实现起来有很多细节需要考虑，这就是Lodash存在的意义。我们应该在理解其实现原理的前提下，享受Lodash带来的便利。

## 小结 {#小结}

阅读Lodash源码真的能够了解很多代码实现上的细节，Lodash在性能优化上面做了很多工作，也给我们学习一个优秀的js库提供了非常好的参考。我在阅读Lodash源代码的过程中也会遇到很多不理解的地方。但是细细琢磨发其实它的代码还是非常清晰易懂的。

## 待续 {#待续}

下周将继续更新Lodash源码分析系列，接下来将会分析Lodash集合方法。

> © 版权所有，禁止一切形式转载。顺便宣传一下个人博客[codestack](http://chenquan.me)
