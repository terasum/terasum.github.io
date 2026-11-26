{
  "title": "从Haskell、JS、go看函数式编程",
  "date": "2017-08-12",
  "url": "/posts/functional-programming-by-haskell-js-golang/",
  "description": "用 Haskell、JavaScript 和 Go 的例子理解函数式编程。",
  "categories": [
    "工程"
  ],
  "cover": "banners/functional-programming-by-haskell-js-golang.webp",
  "tags": [
    "haskell",
    "函数式编程"
  ]
}

本文就是我在学习函数式编程的过程当中自己体悟到的一些东西，这里将用go,JavaScript以及Haskell三种语言来分析函数式编程的一些奥秘。JavaScript由于具有的一些优势能够让我们可以实现函数式编程，而go作为一种强类型语言，虽然灵活性又稍有欠缺，但是也能够完成一些高阶函数的实现，Haskell语言作为正统的函数式编程语言，为了解释说明问题，作为对比参照。

## 正文 {#正文}

函数式编程也算是经常看到了，它的一些优势包括：

1. 不包括赋值语句(assignment statement),一个变量一旦初始化，就无法被修改(immutable)
2. 无副作用，函数除了计算结果，将不会产生任何副作用
3. 因为无副作用，所以任何表达式在任何时候都能够evaluate

虽然上面的优势看看上去好像很厉害的样子，但是，到底厉害在哪里呢？我们可以通过下面的例子进行说明：

**求和函数**

*Haskell*

```haskell
sum [1,2,3]
-- 6
-- sum 的实现其实是
foldr (+) 0 [1,2,3]
```

在Haskell中`flodr`的函数定义是：

```haskell
foldr :: Foldable t =&gt; (a -&gt; b -&gt; b) -&gt; b -&gt; t a -&gt; b
```

函数实现是:

```haskell
-- if the list is empty, the result is the initial value z; else
-- apply f to the first element and the result of folding the rest
foldr f z []     = z 
foldr f z (x:xs) = f x (foldr f z xs) 
```

这是一个递归实现，在函数式编程中，递归定义是十分常见的。

`foldr`函数其实做了这样的事情：`foldr`接受三个参数，第一个参数是函数`f`，第二个参数是初始值`z`,第三个参数是一个列表。如果列表为空则返回初始化值`z`，否则递归调用 `foldr`,需要说明的是函数`f`的类型是接受两个参数，返回一个值，两个参数类型都应该和`z`相同（强类型语言中）。

在Haskell中我们能够看到一个列表能够这样被求和，那么在JavaScript中，我们是如何实现`sum`函数的呢？

*JavaScript*

首先我们实现js版本的`foldr`

```javascript
function foldr(f,z,list){
  //为了简洁起见，把类型判断省略了
  // Object.prototype,toString.call(list) === '[object Array]' 
  if(list === null || list.length == 0){
    return z;
  }
  //这里的shift会改变参数的状态，会造成副作用
  //return f(list.shift(),foldr(f,z,list));
  //改用如下写法
  return f(list[0],foldr(f,z,list.slice(1)));
}
```

然后我们再实现js版本的`(+)`:

```javascript
function add(a,b){
  return a+b;
}
```

那么我们的`sum`就变成：

```javascript
function sum(list){
  return foldr(add,0,list);
}
```

最后我们的js版的`sum`也可以这样用了：

```javascript
let a = [1,2,3];
sum(a); // 6
```

像js这样的弱类型的语言较为灵活，函数`f`可以任意实现，对于`foldr`函数也能够在多种数据类型之间复用，那么对于像go这样的强类型语言，结果又是怎么样的呢？

*go*

同样地，我们实现以下go版本的`foldr`:

```go
func foldr(f func(a,b int) int,z int,list []int)int{
    if len(list) == 0{
        return z
    }
    return f(list[0],foldr(f,z,list[1:]))
}
```

go因为有数组切片，所以使用起来较为简单，但是go又是强类型的语言，所以在声明函数的时候必须要把类型声明清楚。

再实现一下`f`函数：

```go
func add(a,b int) int{
    return a+b;
}
```

依葫芦画瓢我们可以得到go版本的`sum`函数：

```go
func sum(list []int) int{
    return foldr(add,0,list)
}
```

可以看出来好像套路都差不多，真正在调用的时候是这样的：

```go
func main(){
    a := []int{1,2,3}
    sum(a) // 6
}
```

在Haskell中是没有循环的，因为循环可以通过递归实现，在上文我们实现的`sum`函数中，也没有用到任何循环语句，这和我们原来的编程思维有所不同，刚开始我学写求和函数的时候，都是从`for`,`while`开始的，但是函数式给我打开了新世界的大门。

有了上面的基础，我们发现在函数式编程中，代码的重用非常便利：

**求积函数**

*javaScript*

```javascript
function muti(a,b){
  return a*b;
}

function product(list){
  return foldr(muti,1,list);
}
```

*go*

```go
func muti(a,b int) int{
    return a*b;
}

func product(list []int) int{
    return foldr(muti,1,list)
}
```

*Haskell*

```haskell
foldr (*) 1 [1,2,3,4] 
-- 24
-- or 
-- product 是Haskell预定义的函数
myproduct xs = foldr (*) 1 xs
-- myproduct [1,2,3,4]  
```

还有很多例如 `anyTrue`、`allTrue`的例子,以下仅给出js实现：

**anyTure**

*JavaScript*

```javascript
function or(a,b){
  return a || b;
}

function anyTrue(list){
  return foldr(or,false,list);
}
```

调用：

```javascript
let b = [true,false,true];
console.log(anyTrue(b)); // true
```

**allTure**

*JavaScript*

```javascript
function and(a,b){
  return a && b;
}

function allTrue(list){
  return foldr(and,true,list);
}
```

调用:

```javascript
let b = [true,false,true];
console.log(allTrue(b)); // false
```

当然我们可以看出来这个`flodr`函数贼好用，但是好像还是有点疑惑，它是怎么工作的呢？看了一圈，`flodr`就是一个递归函数，但其实在编程世界，它还有一个更加出名的名字——`reduce`。我们看看在js中是如何使用`reduce`实现sum函数的：

**求和函数reduce版**

```javascript
const _ = require("lodash");
_.reduce([1,2,3],function(sum,n){
  return sum+n;
});
```

在`lodash`官方文档是这么定义的：

```javascript
_.reduce alias _.foldl
_.reduceRight alias _.foldr
```

好吧，我欺骗了你们，其实`foldr`应该对应`reduceRight`。

那么`foldl`和`foldr`到底有什么不同呢？

其实这两个函数的不同之处在于结合的方式不同，以求差为例：

*Haskell*

```haskell
foldr (-) 0 [1,2,3]
-- 输出: 2
foldl (-) 0 [1,2,3]
-- 输出: -6
```

为什么两个输出是不同的呢？这个和结合方向有关:

`foldr (-) 0 [1,2,3]`

相当于：

`1-(2-(3-0)) = 2`

而

`foldl (-) 0 [1,2,3]`

相当于：

`((0-1)-2)-3) = -6`

结合方向对于求和结果而言是没有区别的，但是对于求差，就有影响了：

*JavaScript*

```javascript
const _ = require("lodash");
//reduce 相当于 foldl
_.reduce([1,2,3],function(sum,n){
  return sum-n;
});
// 输出 -4
```

这个和说好的`-6`好像又不一样了，坑爹呢么不是？！这是因为，在`lodash`的实现中，`reduce`的初始值为数组的第一个元素,所以结果是`1-2-3 = -4`。

那么我们看看`reduceRight == foldr`的结果：

*JavaScript*

```javascript
const _ = require("lodash");
//reduceRight 相当于 foldr
_.reduceRight([1,2,3],function(sum,n){
  return sum-n;
});
// 输出 0
```

我们看到这个结果是``也算是预期结果，因为`3-2-1=0`。

> 注：上文为了易于理解和行文连贯，加入了一些我自己的理解。需要说明的是，在Haskell中，`foldl1`函数应该是和JavaScript的`reduce`(lodash)函数是一致的，`foldl1`函数将会把列表的第一个元素作为初始值。

现在我们总结一下`foldr`和`foldl`的一些思路：

如果对列表`[3,4,5,6]`应用函数`f`初始值为`z`进行`foldr`的话，应该理解为：

```haskell
f 3 (f 4 (f 5 ( f 6 z)))
-- 当 f 为 +, z = 0 上式就变为：
3 + (4 + (5 + (6 + 0)))
-- 前缀(+)形式则为：
(+)3 ((+)4 ((+)5 ((+)6 0)))
```

如果对列表`[3,4,5,6]`应用函数`g`初始值为`z`进行`foldl`的话，应该理解为：

```haskell
g(g (g (g z 3) 4) 5) 6
-- 当然我们也可以类似地把 g 设为 +, z = 0， 上式就变为：
(((0 + 3) + 4) + 5) + 6
-- 改成前缀形式
(+)((+)((+)((+)0 3) 4) 5) 6
```

从上面的例子可以看出，左折叠(`foldl`)和右折叠(`foldr`)两者有一个很关键的区别，就是，左折叠无法处理无限列表，但是右折叠可以。

前面我们说的都是用预定义的函数`+`,`-`,`*`…,（在函数式编程里，这些运算符其实也都是函数）用这些函数是为了能够让我们更加便于理解，现在我们看看用我们自己定义的函数呢？试试逆转一个列表：

**reverse**

*Haskell*

```haskell
flip' :: (a -&gt; b -&gt; c) -&gt; b -&gt; a -&gt; c
flip' f x y= f y x
```

上面的`flip'`函数的作用就是传入第一个参数是一个函数，然后将两个参数的顺序调换一下(`flip`是预定义函数)。

*Hasekll*

```haskell
foldr flip' [] [1,2,3]
```

那么JavaScript的实现呢？

*JavaScript*

```javascript
function flip(f, a, b){
     return f(b,a);
}
//这个函数需要进行柯里化，否则无法在foldr中作为参数传入
var flip_ = _.curry(flip);

function cons(a,b){
     return a.concat(b);
 }

function reverse(list){
  return foldr(flip_(cons),[],list);
}
```

调用结果又是怎么样的呢？

```javascript
console.log(reverse([1,2,3]))
// [ 3, 2, 1 ]
```

好了，现在我们好像又看到了一个新东西——`curry`，柯里化。简单地说，柯里化就是一个函数可以先接受一部分参数，然后返回一个接受剩下参数的函数。用上面的例子来说，`flip`函数在被柯里化之后得到的函数`flip_`，可以先接受第一个参数`cons`然后返回一个接受两个参数`a,b`的函数，也就是我们需要的连接函数。

在go语言里面，实现curry是一个很麻烦的事情，因此go的函数式编程支持还是比较有限的。

接着我们试试如何取得一个列表的长度，实现一个`length`函数：

**length**

*Haskell*

```haskell
-- 先定义实现一个count 函数
count :: a -&gt; b -&gt;c
count a n = n + 1
-- 再实现一个length函数
length' = foldr (count) 0
-- 再调用
length' [1,2,3,4]
-- 4
```

*JavaScript*

```javascript
//先定义一个count函数
function count(a,n){
  return n + 1;
}
//再实现length函数
function length(list){
  return foldr(count,0,list);
}
//调用
console.log(length([1,2,3,4]));
// 4
```

就是这么简单，好了，`reduce`我们讲完了，然后我们看看`map`,要知道`map`函数是怎么来的，我们要从一个比较简单的函数先入手，这个函数的功能是把整个列表的所有元素乘以2:

**doubleall**

*haskell*

```haskell
-- 定义一个乘以2，并连接的函数
doubleandcons :: a -&gt; [a] -&gt; [a]
doubleandcons x y  = 2 * x : y

doubleall x = foldr doubleandcons []

-- 调用
doubleall [1,2,3]
-- 输出
-- [2,4,6]
```

*JavaScript*

```javascript
function doubleandcons(a,list){
  return [a * 2].concat(list)
}

function doubleall(list){
  return foldr(doubleandcons,[],list)
}

//调用
console.log(doubleall([1,2,3]));
// [2,4,6]
```

再来看看go怎么写：

*go*

go 的尴尬之处在于，需要非常明确的函数定义，所以我们要重新写一个`foldr`函数，来接受第二个参数为列表的`f`。

```go
func foldr2(f func(a int,b []int) []int,z []int,list []int)[]int{
    if len(list) == 0{
        return z
    }
    return f(list[0],foldr2(f,z,list[1:]))
}
```

然后我们再实现同上面相同的逻辑：

```go
func doubleandcons(n int,list []int) []int{
    return append([]int{n * 2},list...)
}

func doubleall(list []int) []int{
    return foldr2(doubleandcons,make([]int,0),list)
}
// doubleall([]int{1,2,3,4})
//[2 4 6 8]
```

go这门强类型编译语言虽然支持一定的函数式编程，但是使用起来还是有一定局限性的，起码代码复用上还是不如js的。

接下来我们关注一下其中的`doubleandcons`函数，这个函数其实可以转换为这样的一个函数：

```haskell
fandcons f el [a]= (f el) : [a]
double el = el * 2
-- 只传入部分参数，柯里化
doubleandcons = fandcons double
```

现在我们关注一下这里的`fandcons`,其实这里可以通用表述为`Cons·f`,这里的`·`称为函数组合。而函数组合有这样的操作：

```haskell
(f. g) h = f (g h)
```

> 需要注意的是等号右边是函数调用。

那么上面的我们的函数就可以表述为：

```haskell
fandcons f el = (Cons.f) el = Cons (f el)
```

所以：

```haskell
fandcons f el list = (Cons.f) el list = Cons (f el) list
```

最终版本就是：

```haskell
doubleall = foldr (Cons . double) Nil
```

这里的`foldr(Cons.double)` 其实就是我们要的`map double`，那么我们的`map`的本来面目就是：

```haskell
map = foldr (Cons.f) Nil
```

> 这里的`Nil`是`foldr`函数的初始值。

好了`map`已经现身了，让我们再仔细看看一个`map`函数应该怎么实现：

**map**

*Haskell*

```haskell
fandcons :: (a-&gt;b) -&gt;a -&gt; [b] -&gt; [b]
fandcons f x y= (f x):y

map' :: (a-&gt;b) -&gt; [a] -&gt; [b]
map' f x = foldr (fandcons f) [] x

-- 调用 
map' (\x -&gt; 2 * x)  [1,2,3]
-- 输出 [2,4,6]
```

这里用了Haskell的lambda表达式，其实就是`f`的`double`实现。

我们也看看js版本的实现：

*JavaScript*

```javascript
function fandcons(f, el, list){
  return [f(el)].concat(list);
}
//需要柯里化
var fandcons_ = _.curry(fandcons);

function map(f, list){
  return foldr(fandcons_(f),[],list);
}
//调用
console.log(map(function(x){return 2*x},[1,2,3,4]));
// 输出[ 2, 4, 6, 8 ]
```

这些需要柯里化的go我都不实现了，因为go实现柯里化比较复杂。

最后我们再看看`map`的一些神奇的操作：

**矩阵求和**

**summatrix**

*Haskell*

```haskell
summatrix :: Num a =&gt; [[a]] -&gt; a
summatrix x = sum (map sum x)

-- 调用
summatrix [[1,2,3],[4,5,6]]
-- 21
```

> 这里一定要显式声明 参数a的类型，因为sum函数要求Num类型的参数

*JavaScript*

```javascript
function sum(list){
  return foldr(add,0,list);
}
function summatrix(matrix){
  return sum(map(sum,matrix));
}
//调用
 mat = [[1,2,3],[4,5,6]];
 console.log(summatrix(mat));
//输出 21
```

## 结语 {#结语}

在学习函数式编程的过程中，我感受到了一种新的思维模式的冲击，仿佛打开了一种全新的世界，没有循环，甚至没有分支，语法简洁优雅。我认为作为一名计算机从业人员都应该去接触一下函数式编程，能够让你的视野更加开阔，能够从另一个角度去思考。
