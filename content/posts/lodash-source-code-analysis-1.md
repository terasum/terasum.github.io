{
  "title": "Lodash 源码分析（一）“Function” Methods",
  "date": "2017-08-21",
  "url": "/posts/lodash-source-code-analysis-1/",
  "description": "阅读 Lodash 的对象方法，追踪取值、复制等操作的内部实现。",
  "categories": [
    "工程"
  ],
  "cover": "banners/lodash-source-code-analysis-1.webp",
  "tags": [
    "javascript",
    "lodash",
    "前端"
  ]
}

Lodash一直是我很喜欢用的一个库，代码也十分简洁优美，一直想抽时间好好分析一下Lodash的源代码。最近抽出早上的一些时间来分析一下Lodash的一些我觉得比较好的源码。因为函数之间可能会有相互依赖，所以不会按照文档顺序进行分析，而是根据依赖关系和简易程度由浅入深地进行分析。因为个人能力有限，如果理解有偏差，还请直接指出，以便我及时修改。

源码都是针对`4.17.4`版本的，[源docs](https://lodash.com/docs/4.17.4#after)写得也很好，还有很多样例。

## \_.after {#_after}

`_.after`函数几乎是Lodash中最容易理解的一个函数了，它一共有两个参数，第一个参数是调用次数`n`,第二个参数是`n`次调用之后执行的函数`func`。

```javascript
function after(n, func) {
      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n &lt; 1) {
          return func.apply(this, arguments);
        }
      };
    }
```

这个函数的核心代码就是：

```javascript
func.apply(this,arguments);
```

但是一定要注意，这个函数中有闭包的应用，就是这个参数`n`。`n`本应该在函数`_.after`返回的时候就应该从栈空间回收，但事实上它还被返回的函数引用着，一直在内存中：

```javascript
return function() {
        if (--n &lt; 1) {
          return func.apply(this, arguments);
        }
      };
```

所以一直到返回的函数执行完毕，`n`所占用的内存空间都无法被回收。

我们再来看看这个`apply`函数，我们知道`apply`函数可以改变函数运行时的作用域了，那么问题来了，在在`_.after`函数中`func.apply`函数的`this`，是谁呢？这个东西我们没有办法从源码中看出来，因为`this`是在运行时决定的。那么`this`会变吗？如果会的话怎么变呢？这个问题我们需要先弄懂`_.after`函数怎么用。

`_.after`函数调用后返回了另一个函数，所以对于`_.after`函数的返回值，我们是需要再次调用的。所以最好的场景可能是在延迟加载等场景中。当然为了简单起见我给出一个很简单的例子：

```javascript
const _ = require("lodash");

function foo(func ){
    console.log("invoked foo.");
    func();
}


var done = _.after(2,function bar(){
    console.log("invoke bar");
});

for( var i = 0; i &lt;  4; i++ ){
   foo(done);
}
```

正如我们前面说的，`n`的作用域是`_.after`函数内部，所以在执行过程中`n`会一直递减，因此输出结果应该是在调用两次`foo`之后调用一次`bar`，之后每次调用`foo`，都会调用一次`bar`。结果和我们预期的一致：

```javascript
invoked foo
invoked foo
invoke bar
invoked foo
invoke bar
invoked foo
invoke bar
```

那么我们再看看`this`指向的问题，我们修改一下上面的调用函数，让`bar`函数输出一下内部的`this`的一些属性：

```javascript
const _ = require("lodash");

function foo(func ){
    this.name = "foo";
    console.log("invoked foo: " + this.name );
    func();
}


var done = _.after(2,function bar(){
    console.log("invoke bar: " + this.name);
});

for( var i = 0; i &lt;  4; i++ ){
   foo(done);
}
```

其实想来大家也应该能够猜到，在`bar`函数中输出的`this.name`也是`foo`：

```javascript
invoked foo: foo
invoked foo: foo
invoke bar: foo
invoked foo: foo
invoke bar: foo
invoked foo: foo
invoke bar: foo
```

这是因为`bar`的`this`应该指向的是`_.after`创建的函数的`this`,而这个函数是由`foo`函数调用的，因此`this`实际上指向就是`foo`。

## \_.map {#_map}

`_.map`函数我们几乎随处可见，这个函数应用也相当广泛。

```javascript
function map(collection, iteratee) {
      var func = isArray(collection) ? arrayMap : baseMap;
      return func(collection, getIteratee(iteratee, 3));
}
```

为了简化问题，我们分析比较简单的情况：用一个func函数处理数组。

```javascript
_.map([1,2,3],func);
```

在处理数组的时候，lodash是分开处理的，对于`Array`采用`arrayMap`进行处理，对于对象则采用`baseMap`进行处理。

我们先看数组`arrayMap`：

```javascript
function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index &lt; length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }
```

这个函数是一个私有函数，第一个参数是一个需要遍历的数组，第二个参数是在遍历过程当中进行处理的函数；返回一个进行map处理之后的函数。

在看我们需要进行遍历处理的函数`iteratee`，这个函数式通过`getIteratee`函数得到的：

```javascript
function getIteratee() {
      var result = lodash.iteratee || iteratee;
      result = result === iteratee ? baseIteratee : result;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
    }
```

如果`lodash.iteratee`被重新定义,则使用用户定义的`iteratee`，否则就用官方定义的`baseIteratee`。需要强调的是，`result(arguments[0],arguments[1])`是柯里化的函数返回，返回的仍旧是一个函数。不可避免地，我们需要看看官方定义的`baseIteratee`的实现：

```javascript
   function baseIteratee(value) {
      // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
      // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
      if (typeof value == 'function') {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == 'object') {
        return isArray(value)
          ? baseMatchesProperty(value[0], value[1])
          : baseMatches(value);
      }
      return property(value);
    }
```

我们可以看出来，这个`iteratee`迭代者其实就是一个函数，在`_.map`中`getIteratee(iteratee, 3)`，给了两个参数，按照逻辑，最终返回的是一个`baseIteratee`，`baseIteratee`的第一个参数`value`就是`iteratee`,这是一个函数，所以，`baseIteratee`函数在第一个判断就返回了。

所以我们可以将map函数简化为如下版本:

```javascript
function map(collection,iteratee){
    return arrayMap(collection,getIteratee(iteratee,3));
}

function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index &lt; length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
}

function getIteratee() {
      var result =  baseIteratee;
      return arguments.length ? result(arguments[0], arguments[1]) : result;
}

function baseIteratee(value) {
      if (typeof value == 'function') {
        return value;
      }
}
```

可以看到，最终调用函数`func`的时候会传入3个参数。`array[index],index,array`。我们可以实验，将`func`实现如下：

```javascript
function func(){
   console.log(“arguments[0] ” + arguments[0]);
   console.log(“arguments[1] ” + arguments[1]);
   console.log(“arguments[2] ” + arguments[2]);
   console.log("-----")
}
```

输出的结果也和我们的预期一样，输出的第一个参数是该列表元素本身，第二个参数是数组下标，第三个参数是整个列表：

```javascript
arguments[0] 6
arguments[1] 0
arguments[2] 6,8,10
-----
arguments[0] 8
arguments[1] 1
arguments[2] 6,8,10
-----
arguments[0] 10
arguments[1] 2
arguments[2] 6,8,10
-----
[ undefined, undefined, undefined ]
```

上面的分析就是抛砖引玉，先给出数组的分析，别的非数组，例如对象的遍历处理则会走到别的分支进行处理，各位看官有兴趣可以深入研究。

## \_.ary {#_ary}

这个函数是用来限制参数个数的。这个函数咋一看好像没有什么用，但我们考虑如下场景，将一个字符列表`['6','8','10']`转为整型列表`[6,8,10]`，用`_.map`实现，我们自然而然会写出这样的代码：

```javascript
const _ = require("lodash");
_.map(['6','8','10'],parseInt);
```

好像很完美，我们输出看看：

```javascript
[ 6, NaN, 2 ]
```

很诡异是不是，看看内部到底发生了什么？其实看了上面的`-.map`函数的分析，其实原因已经很明显了。对于`parseInt`函数而言，其接收两个参数，第一个是需要处理的字符串，第二个是进制：

```javascript
/**
* @param string 必需。要被解析的字符串。
* @param radix  
* 可选。表示要解析的数字的基数。该值介于 2 ~ 36 之间。
* 如果省略该参数或其值为 0，则数字将以 10 为基础来解析。如果它以 “0x” 或 “0X” 开头，将以 16 为基数。
* 如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN
*/
parseInt(string, radix)
/**
当参数 radix 的值为 0，或没有设置该参数时，parseInt() 会根据 string 来判断数字的基数。

举例，如果 string 以 "0x" 开头，parseInt() 会把 string 的其余部分解析为十六进制的整数。如果 string 以 0 开头，那么 ECMAScript v3 允许 parseInt() 的一个实现把其后的字符解析为八进制或十六进制的数字。如果 string 以 1 ~ 9 的数字开头，parseInt() 将把它解析为十进制的整数。
*/
```

那么这样的输出也就不难理解了：

处理第一个数组元素6的时候，`parseInt`实际传入参数`(6,0)`,那么按照十进制解析，会得到`6`,处理第二个数组元素的时候传入的实际参数是`(8,1)`，返回`NaN`,对于第三个数组元素，按照2进制处理，则`10`返回的是`2`。

所以在上述需求的时候我们需要限制参数的个数，这个时候`_.ary`函数就登场了，上面的函数这样处理就没有问题了：

```javascript
const _ = require("lodash");
_.map(['6','8','10'],_.ary(parseInt),1);
```

我们看看这个函数是怎么实现的：

```javascript
 function ary(func, n, guard) {
      n = guard ? undefined : n;
      n = (func && n == null) ? func.length : n;
      return createWrap(func, WRAP_ARY_FLAG, undefined, undefined, undefined, undefined, n);
    }
```

这个函数先检查`n`的值，需要说明的是`func.length`返回的是函数的声明参数个数。然后返回了一个`createWrap`包裹函数，这个函数可以说是脏活累活处理工厂了，负责很多函数的包裹处理工作，而且为了提升性能，还将不同的判断用`bitflag`进行与/非处理，可以说是很用尽心机了。

```javascript
/**
     * Creates a function that either curries or invokes `func` with optional
     * `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to wrap.
     * @param {number} bitmask The bitmask flags.
     *    1 - `_.bind` 1                      0b0000000000000001
     *    2 - `_.bindKey`                     0b0000000000000010
     *    4 - `_.curry` or `_.curryRight`...  0b0000000000000100
     *    8 - `_.curry`                       0b0000000000001000
     *   16 - `_.curryRight`                  0b0000000000010000
     *   32 - `_.partial`                     0b0000000000100000
     *   64 - `_.partialRight`                0b0000000001000000
     *  128 - `_.rearg`                       0b0000000010000000
     *  256 - `_.ary`                         0b0000000100000000
     *  512 - `_.flip`                        0b0000001000000000
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {Array} [partials] The arguments to be partially applied.
     * @param {Array} [holders] The `partials` placeholder indexes.
     * @param {Array} [argPos] The argument positions of the new function.
     * @param {number} [ary] The arity cap of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new wrapped function.
     */
    function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
      if (!isBindKey && typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var length = partials ? partials.length : 0;
      if (!length) {
        bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
        partials = holders = undefined;
      }
      ary = ary === undefined ? ary : nativeMax(toInteger(ary), 0);
      arity = arity === undefined ? arity : toInteger(arity);
      length -= holders ? holders.length : 0;

      if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
        var partialsRight = partials,
            holdersRight = holders;

        partials = holders = undefined;
      }
      var data = isBindKey ? undefined : getData(func);

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
        ? (isBindKey ? 0 : func.length)
        : nativeMax(newData[9] - length, 0);

      if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
        bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
      }
      if (!bitmask || bitmask == WRAP_BIND_FLAG) {
        var result = createBind(func, bitmask, thisArg);
      } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
        result = createCurry(func, bitmask, arity);
      } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
        result = createPartial(func, bitmask, thisArg, partials);
      } else {
        result = createHybrid.apply(undefined, newData);
      }
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }
```

看上去太复杂了，把无关的代码削减掉：

```javascript
function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
      //      0000000100000000 & 0000000000000010
      // var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
      var isBindKey = 0;
      var length =  0;
      // if (!length) {
        //              0000000000100000 | 0000000001000000
        //            ~(0000000001100000)
        //              1111111110011111
        //             &0000000100000000
        //              0000000100000000 = WRAP_ARY_FLAG 
        // bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
      //  bitmask = WRAP_ARY_FLAG;
      //  partials = holders = undefined;
      // }
      bitmask = WRAP_ARY_FLAG;
      partials = holders = undefined;
      ary = undefined;
      arity = arity === undefined ? arity : toInteger(arity);
      // because holders == undefined
      //length -= 0;
      // because isBindKey  == 0
      // var data = isBindKey ? undefined : getData(func);
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
        ? func.length : newData[9];
      result = createHybrid.apply(undefined, newData);
      var setter = data ? baseSetData : setData;
      return setWrapToString(setter(result, newData), func, bitmask);
    }
```

简化了一些之后我们来到了`createHybrid`函数，这个函数也巨复杂，所以我们还是按照简化方法，把我们用不到的逻辑给简化:

```javascript
   function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = bitmask & WRAP_ARY_FLAG,
          isBind = bitmask & WRAP_BIND_FLAG,
          isBindKey = bitmask & WRAP_BIND_KEY_FLAG,
          isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG),
          isFlip = bitmask & WRAP_FLIP_FLAG,
          Ctor = isBindKey ? undefined : createCtor(func);

      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;

        while (index--) {
          args[index] = arguments[index];
        }
        if (isCurried) {
          var placeholder = getHolder(wrapper),
              holdersCount = countHolders(args, placeholder);
        }
        if (partials) {
          args = composeArgs(args, partials, holders, isCurried);
        }
        if (partialsRight) {
          args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
        }
        length -= holdersCount;
        if (isCurried && length &lt; arity) {
          var newHolders = replaceHolders(args, placeholder);
          return createRecurry(
            func, bitmask, createHybrid, wrapper.placeholder, thisArg,
            args, newHolders, argPos, ary, arity - length
          );
        }
        var thisBinding = isBind ? thisArg : this,
            fn = isBindKey ? thisBinding[func] : func;

        length = args.length;
        if (argPos) {
          args = reorder(args, argPos);
        } else if (isFlip && length &gt; 1) {
          args.reverse();
        }
        if (isAry && ary &lt; length) {
          args.length = ary;
        }
        if (this && this !== root && this instanceof wrapper) {
          fn = Ctor || createCtor(fn);
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }
```

把不需要的逻辑削减掉：

```javascript
   function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
      var isAry = 1;
      function wrapper() {
        var length = arguments.length,
            args = Array(length),
            index = length;
        while (index--) {
          args[index] = arguments[index];
        }
        var thisBinding = this, fn = func;
        length = args.length;
        if (isAry && ary &lt; length) {
          args.length = ary;
        }
        return fn.apply(thisBinding, args);
      }
      return wrapper;
    }
```

好了，绕了一大圈，终于看到最终的逻辑了，`_.ary`函数其实就是把参数列表重新赋值了一下，并进行了长度限制。想想这个函数实在是太麻烦了，我们自己可以根据这个逻辑实现一个简化版的`_.ary`：

```javascript
function ary(func,n){
    return function(){
        var length = arguments.length,
            args = Array(length),
            index = length;
        while(index--){
            args[index] = arguments[index];
        }
        args.length = n;
        return func.apply(this,args);
    }
}
```

试试效果：

```javascript
console.log(_.map(['6','8','10'],ary(parseInt,1)));
```

工作得很不错：

```javascript
[ 6, 8, 10 ]
```

## 小结 {#小结}

今天分析这三个函数就花了一整天的时间，但是收获颇丰，能够静下心来好好分析一个著名的开源库，并能够理解透里面的一些逻辑，确实是一件很有意思的事情。我会在有时间的时候把Lodash这个我很喜欢的库都好好分析一遍，尽我最大的努力将里面的逻辑表述清楚，希望能够简明易懂。
