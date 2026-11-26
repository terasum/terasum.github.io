{
  "title": "Lodash 源码分析（三）Array",
  "date": "2017-09-21",
  "url": "/posts/lodash-source-code-analysis-3/",
  "description": "阅读 Lodash 的数组方法，梳理底层实现与数据处理过程。",
  "categories": [
    "工程"
  ],
  "cover": "banners/lodash-source-code-analysis-3.webp",
  "tags": [
    "javascript",
    "lodash"
  ]
}

这是Lodash源码分析系列文章的第三篇，前面两篇文章([Lodash 源码分析（一）“Function” Methods](http://www.chenquan.me/archives/254)、[Lodash 源码分析（二）“Function” Methods](http://www.chenquan.me/archives/267))分别分析了Lodash “Function” 中的一些重要函数，也给出了简化的实现，为理解其内部机理和执行方式提供了便利。这篇文章将专注于Array，Array是Lodash中非常重要的内容，我们将分析其代码实现以及同类似库中的实现对比。

## \_.head {#_head}

`_.head`函数其实很简单，返回一个数组的第一个元素，完全可以在两三行代码中实现。可以看到Lodash中是这么实现的：

```javascript
function head(array) {
   return (array && array.length) ? array[0] : undefined;
}
```

Lodash进行了简单的判断，然后返回了第一个元素。这么简单的函数其实没有什么好说的，但我拿出来说是想介绍另一个库`Ramda.js`的实现：

```javascript
module.exports = nth(0);
```

它是用`nth`函数实现该功能的，那么这个函数式怎么样的呢？

```javascript
module.exports = _curry2(function nth(offset, list) {
  var idx = offset &lt; 0 ? list.length + offset : offset;
  return _isString(list) ? list.charAt(idx) : list[idx];
});
```

这个函数就有点意思了，用了柯里化，是一个函数式的实现，当`head`函数返回一个`nth(0)`时，其实返回的是一个柯里化之后的函数，然后再接受一个数组，判断数组类型之后返回`list[offset]`的值。

再看看Lodash的`nth`的实现：

```javascript
function nth(array, n) {
   return (array && array.length) ? baseNth(array, toInteger(n)) : undefined;
}

function baseNth(array, n) {
  var length = array.length;
  if (!length) {
    return;
  }
  n += n &lt; 0 ? length : 0;
  return isIndex(n, length) ? array[n] : undefined;
}
```

仔细对比两个库的实现，两个库都允许负下标的处理，但是对于Ramda而言，如果list是一个`null`或者`undefined`类型的数据的话，将会抛出`TypeError`，而Lodash则优雅一些。

## \_.join {#_join}

`_.join`函数是另一个简单的函数：

```javascript
var arrayProto = Array.prototype;
var nativeJoin = arrayProto.join;

function join(array, separator) {
  return array == null ? '' : nativeJoin.call(array, separator);
}
```

重写之后函数变为:

```javascript
function join(array,separator) {
    return array == null ? '' : Array.prototype.join.call(array, separator);
}
```

我们再对比一下Ramda的实现：

```javascript
&lt;br />var invoker = require('./invoker');
module.exports = invoker(1, 'join');
```

再看看invoker函数：

```javascript
module.exports = _curry2(function invoker(arity, method) {
  return curryN(arity + 1, function() {
    var target = arguments[arity];
    if (target != null && _isFunction(target[method])) {
      return target[method].apply(target, Array.prototype.slice.call(arguments, 0, arity));
    }
    throw new TypeError(toString(target) + ' does not have a method named "' + method + '"');
  });
});
```

`invoker`函数就是为了返回一个curry化的函数，那么我们其实可以这么理解如果用Lodash实现一个函数化的`join`可以这么实现：

```javascript
function _join(array,separator){
        return Array.prototype.join.call(array,seprator);
}
var join = _.curry(_join);
```

那么我们可以和Ramda的使用方式一样使用：

```javascript
join(_,",")([1,2,3]);
// 1,2,3
```

## \_.remove {#_remove}

这个方法很有意思，我们可以看到不同的实现方式（通常实现/函数式实现），两种实现差别很大，所以拿出来分析一下。

先看看Lodash的实现：

```javascript
    /**
     * Removes all elements from `array` that `predicate` returns truthy for
     * and returns an array of the removed elements. The predicate is invoked
     * with three arguments: (value, index, array).
     *
     * **Note:** Unlike `_.filter`, this method mutates `array`. Use `_.pull`
     * to pull elements from an array by value.
     *
     * @static
     * @memberOf _
     * @since 2.0.0
     * @category Array
     * @param {Array} array The array to modify.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @returns {Array} Returns the new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4];
     * var evens = _.remove(array, function(n) {
     *   return n % 2 == 0;
     * });
     *
     * console.log(array);
     * // =&gt; [1, 3]
     *
     * console.log(evens);
     * // =&gt; [2, 4]
     */
    function remove(array, predicate) {
      var result = [];
      if (!(array && array.length)) {
        return result;
      }
      var index = -1,
          indexes = [],
          length = array.length;

      predicate = getIteratee(predicate, 3);
      while (++index &lt; length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result.push(value);
          indexes.push(index);
        }
      }
      basePullAt(array, indexes);
      return result;
    }
```

\*\*一定要注意的是，该方法会修改原数组。\*\*官方也对其进行了说明。该方法同`_.fliter`的区别也就在是否会修改原对象上。

我们分析一下Lodash是如何实现这个功能的，首先判断数组是否合法，如果不合法就直接返回。在Lodash中的实现其实很简单，首先得到一个`predicate`谓词函数，该谓词函数用于判断元素是否符合条件，如果符合条件就将其从原数组中移除。逻辑也比较简单，但是该函数会修改原array，该功能是通过`basePullAt()`实现的：

```javascript
    /**
     * The base implementation of `_.pullAt` without support for individual
     * indexes or capturing the removed elements.
     *
     * @private
     * @param {Array} array The array to modify.
     * @param {number[]} indexes The indexes of elements to remove.
     * @returns {Array} Returns `array`.
     */
    function basePullAt(array, indexes) {
      var length = array ? indexes.length : 0,
          lastIndex = length - 1;

      while (length--) {
        var index = indexes[length];
        if (length == lastIndex || index !== previous) {
          var previous = index;
          if (isIndex(index)) {
            splice.call(array, index, 1);
          } else {
            baseUnset(array, index);
          }
        }
      }
      return array;
    }
```

需要说明的是，这里的`splice`方法的原型是`Array.prototype.splice`，该方法同`Array.prototype.slice`的区别是，`splice`会修改原数组的内容，而`slice`不会修改原数组的内容，而仅仅做的是一次浅拷贝。

还需要说明一下的是`baseUnset`：

```javascript
/**
 * The base implementation of `unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */
function baseUnset(object, path) {
  path = castPath(path, object)
  object = parent(object, path)
  return object == null || delete object[toKey(last(path))]
}

export default baseUnset
```

这个方法其实很简单，就是删除对象中的某一个属性/键。

所以Lodash的整个`_.remove`的脉络就捋清楚了，按照惯例，我们需要稍微简化一下这个函数，把核心逻辑抽取出来：

```javascript
function remove(list,predicated){
  var indexes = [];
    for(var i=0;i &lt; list.length;i++){
      if(predicated(list[i])){
        indexes.push(i);
      }
    }
    for(var idx = indexes.length -1; idx &gt;=0;idx--){
      Array.prototype.splice.call(list,indexes[idx],1);
    }
    return list;
}

var a = [1,2,3,4];
remove(a,function(a){if (a == 3) return true; else return false;});
console.log(a); // [1,2,4]
```

恩，感觉好像也挺好用的。

但是我们不能止步于此，作为一个热衷函数式编程的程序员，最终目标是代码中没有循环没有分支。我们看看Ramda.js是怎么实现的：

```javascript
/**
 * Removes the sub-list of `list` starting at index `start` and containing
 * `count` elements. _Note that this is not destructive_: it returns a copy of
 * the list with the changes.
 * &lt;small&gt;No lists have been harmed in the application of this function.&lt;/small&gt;
 *
 * @func
 * @memberOf R
 * @since v0.2.2
 * @category List
 * @sig Number -&gt; Number -&gt; [a] -&gt; [a]
 * @param {Number} start The position to start removing elements
 * @param {Number} count The number of elements to remove
 * @param {Array} list The list to remove from
 * @return {Array} A new Array with `count` elements from `start` removed.
 * @example
 *
 *      R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=&gt; [1,2,6,7,8]
 */
module.exports = _curry3(function remove(start, count, list) {
  var result = Array.prototype.slice.call(list, 0);
  result.splice(start, count);
  return result;
});
```

其实Ramda就是对`splice`进行了curry化，什么也没有做，毫无参考价值。没有达到我们的预期，所以只能自己动手了：

```javascript
function remove2(list,predicated){
  return _remove(list,list.length-1,predicated);
}

function _remove(list,idx,predicated){
  if(predicated(list[idx])){
    list.splice(idx,1);
  }
  if (idx == 0){return list;}else{
      _remove(list,idx-1,predicated);
  }
}
//调用
var a = [1,2,3,4];
remove2(a,function(a){if (a == 3) return true; else return false;});
console.log(a); //[1,2,4]
```

感觉舒服多了，对于JavaScript而言没有分支语句是不可能的，但是可以把所有的循环用递归取代，感觉代码也简洁了许多，函数式能够让人以另一个角度思考问题，真的是一个很好的编程范式。

## 结语 {#结语}

最近工作非常忙，也没有时间写第三篇连载，忙里抽空用午休时间将本文写完了。成文比较匆忙难免有一些谬误望各位看官海涵，也希望能够直接指出我文章中的错误，感激不尽！

## 敬请期待 {#敬请期待}

本系列文章还有后续内容，包括数组和集合的操作，以及对象的操作，具体还没有想好涉及哪方面内容，总之敬请期待！
