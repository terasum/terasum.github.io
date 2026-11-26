{
  "title": "Haskell — 你应该学的一门语言",
  "date": "2017-08-09",
  "url": "/posts/haskell-the-language-you-should-learn/",
  "description": "从类型与函数入手，讨论 Haskell 的语言特点和学习价值。",
  "categories": [
    "工程"
  ],
  "cover": "banners/haskell-the-language-you-should-learn.webp",
  "tags": [
    "haskell",
    "函数式编程"
  ]
}

三月的时候立下一个flag, 说是在一个月内学会haskell，现在已经8月了，终于有时间坐下来好好地看看haskell,一直以来我都执着于各种语言，现在已经掌握的语言包括: go, python, php, c, java, javascript, shell, 这些语言在不同的领域都是神兵利器，能够帮我解决不同的问题，但是haskell不一样，是一种我完全凭借兴趣去学习的语言。

刚开始看趣学指南的时候，觉得这门语言语法太奇怪了，我看得很难受。慢慢发现这其实是一种思维定势，如果我的第一门入门语言是haskell的话，想必就不是这种态度了。 Haskell是一门非常迷人的语言，它的列表推导式真的很厉害，能够解决原来传统过程式语言需要写很多代码才能解决的问题。它给了你另外一种思考问题的方式，开阔视野。

我觉得既然是计算机从业者，都应该去学学python和haskell两门语言，python将教会你什么如何让世界变美好，Haskell将告诉你这个世界是多么奇妙。如果你现在被冯·诺依曼式的架构侵染太深的话，学学Haskell吧，它会告诉你这世界上还有这样写代码的方式。

## 书籍 {#书籍}

最棒的haskell免费入门书 [haskell趣学指南](http://learnyouahaskell.com/chapters)

## 视频 {#视频}

下面是两小时入门haskell的内容，视频我也贴在下面了，但直接访问不了，你懂的。

## 讲义 {#讲义}

下面是我翻译过的视频随堂讲义内容：

```haskell
-- Haskell 是一种函数式编程语言
-- 在Haskell 中所有的值都是immutable 的，所以一旦一个变量被赋值之后，它就不会改变了
-- 函数可以作为另一个函数的参数
-- 递归函数在hankell中很普遍
-- Haskell没有for.while，以及典型的变量，但是它拥有常量
-- Haskell试试一种惰性求值的语言，只有在真正需要的时候再进行求值，以及错误检查


-- 最佳的Best free book
-- http://learnyouahaskell.com/chapters


-- 输入 ghci 到你的terminal中

import Data.List
import System.IO

-- This is haskell comment single line

{-

muti-line comment
-}


-- --------DATA types ---------
-- Haskell 能够自己进行类型推定
-- Haskell 是一种静态类型语言，在编译之后无法改变类型
-- 值不可变(immutable)
-- 你可以在gchi 中使用 :t 来查看数据类型

-- Int : 所有的数字范围在 -2^63 ~ 2^63
-- :: Int 表示这个类型是一个Int类型的数据

maxInt = maxBound :: Int
minInt = minBount :: Int

-- Integer 无限制的number类型

-- Float： 单精度浮点数
-- Double: 双精度浮点数
bigFloat = 3.99999999999+0.00000000005 

-- Bool： True或者False
-- Char: 一个unicode字符，用单引号括起来
-- Tuple: 能够存储多种数据类型的一组数据 (11 pts 精度)

-- 你可以用这种方式声明一个常量

always5 :: Int
always5 = 5


-- ------MATH-----
-- 一些牛逼的操作
-- 求1到100的和

sumofValues = sum[1..1000]

addEx = 5 + 4
subEx = 5 - 4
multEx = 5 * 4
divEX = 5 / 4

-- mod 是前缀操作符

modEx = mod 5 4

-- 你可以通过反引号将前缀函数变为中缀形式
modEx2 = 5 `mod` 4

-- 负数必须要用括号括起来

negNumEx = 5 + (-4)

-- 如果你定义了一个Int类型的数，你必须要用fromIntegral 函数先处理之后才能够使用sqrt函数进行处理
num9 = 9 :: Int
sqrtof9 = sqrt (fromIntegral 9)

-- built in 的一些数学函数
piVal = pi
ePow9 = exp 9
logOf9 = log 9
squared9 = 9 ** 2
truncateVal = truncate 9.999
roundVal = round 9.999
ceilingVal = ceiling 9.999
floorVal = floor 9.999

-- 当然还有一些基本数学函数： sin cos tan asin acos sinh tanh cosh asinh atanh acosh

trueAndFalse =   True && False
trueOrFalse  = True || False
notTrue = not(True)

-- 记住你可以用 :t 在ghci得到数据的类型
-- 当然也可以在函数中用:t 判断数据的类型

-- :t(+) = Num =&gt; a -&gt; a -&gt; a
-- Type a 是一种 num的类型， 传入两个a 类型的数据，然后得到一个a类型的数据

-- :t truncate = (RealFrac a, Integral b) =&gt; a -&gt; b

-- ------ LIST ------

-- List是一个单向链表，只能够在前面添加数据
-- List能够存储一系列相同类型的数据

primeNumbers = [3,5,7,11]

-- 在连接两个链表的时候会如果其中一个链表很大会导致连接速度很慢
morePrime = primeNumbers ++ [13,17,19,23,29]

-- 你可以使用冒号 : 进行数据和列表连接, 一定要有一个列表，哪怕是空列表

favNums = 2 : 7 : 21 : 66 : []

-- 你可以弄一个列表的列表

multiList [[3,5,7],[11,13,17]]

-- 在列表面快速添加一个元素 
morePrime2 = 2 : morePrime2

-- 得到列表的长度

length morePrime

-- 得到index 为1 的元素
morePrime !! 1

-- 得到第一个元素
head morePrime
-- 得到最后一个元素
last morePrime

-- 得到除了第一个元素之外的所有元素
tail morePrime

-- 得到除了最后一个元素之外的所有元素

init morePrime

-- 得到指定个数的列表前几个元素
take 3 morePrime

-- 删除前几个元素
drop 2 morePrime

-- 判断一个元素是否在列表中

3 `elem` morePrime

-- or 
 elem 3 morePrime

-- 列表中的最大值

 maximum morePrime
-- 列表中的最小值
 minimin morePrime


-- 列表求和

sum morePrime

-- 列表求积

product morePrime

-- 列表自动推导
zeroToten = [0..10]

-- 步进2列表自动推导

step2list =[2,4..20]

-- 字符列表自动推导
letterlist =['A'..'Z']

-- 字符列表步进2自动推导
letterlist =['A','C'..'Z']

--无限列表,Haskell只计算你所需要的值
infinPow10 = [10,20..]

-- repeat 可以得到一个重复值的列表

many2s = take 10 (repeat 2)

-- replicate 能够指定重复次数和值
-- 3 重复10次
many3s = replicate 10 3

-- 循环列表，无限循环

cyclelis = take 10 (cycle [1,2,3,4,5])

-- haskell 较为高级的列表推导式
-- haskell 可以通过列表推导式实现高级条件数据筛选

-- 将1..10 的元素都乘以2然后返回一个列表
 listtime2 = [x * 2 | x &lt;- [1..10]]
-- 输出 [2,4,6,8,10,12,14,16,18,20]

-- 将1..20中 3*x 小于50的剔除，输出剩下的3*x的列表
 listtime3 = [x * 3 | x &lt;- [1..20], x * 3 &lt; 50]
-- 输出 [3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48]

-- 输出在 1..500中所有能够被 13和9整除的数

divisBy9N13 = [x | x &lt;- [1..500],x `mod` 13 == 0, x `mod` 9 == 0]
-- 输出[117,234,351,468]

-- 列表排序
-- 需要import Data.List
sortedList = sort [9,8,1,2,3,4,7,6]

-- zipWith 可以合并两个列表
 sumOfLists = zipWith (+) [1,2,3,4,5] [6,7,8,9,10]
 -- 输出[7,9,11,13,15]

 --数据过滤，通过filter函数,能够保留满足条件的数据
listBiggerThan5 = filter (&gt;5) sumOfLists

-- takeWhile 能够取出数据直到条件为false

evenUp20 =  takeWhile (&lt;=20) [2,4..]

-- foldl 从左到右应用运算符
-- foldr 从右到左应用运算符
foldl (*) 1 [1,2,3,4]
-- 24


-- ------TUPLES ------
-- Tuple 能够存储多种类型，但是其大小是固定的
randTuple = (1,"Random tuple")

bobsSmith = ("Bob Smith",52)

-- Get the first value
bobsAge = fst bobsSmith
-- Get the second value
bobsAge = snd bobsSmith

-- zip函数能够将两个列表压缩为tuples

names =["Bob","Mary","Tom"]
address =["123 Main","234 North","567 south"]

nameNaddress = zip names address
-- 输出 [("Bob","123 Main"),("Mary","234 North"),("Tom","567 south")]

-- ------ FUNCTIONS -------
-- ghc --make haskelltut 将会编译你的程序并执行main函数

-- Functions 必须由小写字母开始

-- 我们能够使用let关键字定义一个函数
-- let num7 = 7
-- let getTriple x = x * 3
-- getTriple num7 = 21

-- main 函数能够在terminal中被调用的main函数

main = do
    -- 在一行中打印
    putStrLn "What's your name"
    -- 获取用户的输入并将其存储到name中
    -- &lt;- 运算符能从IO操作中取得数据并放入变量中
    name &lt;- getLine

    putStrLn ("hello" ++ name)

-- 创建一个名为addMe 的函数
-- x 是一个参数，然后后面是类型签名
-- 传入的类型如果符合要求将会自动应用函数声明
-- 所有的函数都要求有返回值
-- 如果一个函数没有参数则称为一个定义或一个名称

--你可以通过如下的形式定义一个函数：
-- funcName :: param1 -&gt; param2 -&gt; returnType
addMe :: Int -&gt; Int -&gt; Int

-- funcName param1 param2 = operations (Returned Value)
-- 执行: addMe 4 5
addMe x y = x + y

-- 如果没有类型声明则该函数能够处理浮点数
sumMe x y = x + y


-- 当然你也可以定义一个tuple相加函数
addTuples :: (Int,Int) -&gt; (Int,Int) -&gt; (Int,Int)
addTuples (x1,y1) (x2,y2) = (x1 + x2, y1 +y2)

-- 你可以根据不同的值进行不同的操作 类似于switch case
whatAge :: Int -&gt; String
whatAge 16 = "You can drive"
whatAge 18 = "You can vote"
whatAge 21 = "You are a adult"
-- default
whatAge x = "Nothing Import"

-- 定义一个我们期望输入以及输出的函数
factorial :: Int -&gt; Int
-- 如果是0 则返回1 （递归函数)
factorial 0 = 1
factorial n = factorial(n -1)

-- 3 * factorial (2) : 6
-- 2 * factorial (1) : 2
-- 1 * factorial (0) : 1

-- 当然你也可以定义一个乘法的Factorial
productFactorial n = product [1..n]

-- 我们能够利用竖线来根据不同情况下的返回值
isOdd :: Int -&gt; Bool

isOdd n
    -- if 如果是奇数
    | n `mod` 2 == 0 = False
    -- else
    | otherwise = True

-- 当然这个函数能够精简
isEven n = n `mod` 2 == 0

-- 多个条件的 if else 

    whatGrade :: Int -&gt; String
    whatGrade age
        | (age &gt;= 5) && (age &lt;= 6) = "Kindergarten"
        | (age &gt;= 6) && (age &lt;= 10) = "Elementary school"
        | (age &gt;= 10) && (age &lt;= 14) = "Middle school"
        | (age &gt;= 14) && (age &lt;= 18) = "High school"
        |  otherwise "Go to college"

-- 使用where能够帮我们处理条件
batAvgRating :: Double -&gt; Double -&gt; String
batAvgRating hits atBats
    | avg &lt;= 0.200 = "Terrible Batting Average"
    | avg &lt;= 0.250 = "Average Player"
    | avg &lt;= 0.280 = "Your doing pretty good"
    | otherwise = "You're a Superstar"
    where avg = hits / atBats

-- 多条件判断不同的list状态
getListItems :: [Int] -&gt; String
getListItems [] = "Your list is empty"
getListItems (x:[]) = "Your list contains " ++ show x
getListItems (x:y:[]) = "Your list contains " ++ show x ++ " and " ++ show y
getListItems (x:xs) = "The first item is " ++ show x ++ " and the rest are " 
    ++ show xs

-- 我们也能够通过模式来定义一个函数
getFirstItem :: String -&gt; String
getFirstItem [] = "Empty String"
getFirstItem all@(x:xs) = "The first letter in " ++ all ++ "is" ++ [x]



-- ------ 高阶函数 -------
-- 能够将一个函数像一个值一样传入到另一个函数中

times4 :: Int -&gt; Int
times4 x = x * 4

-- map 能够将一个列表应用于另一个函数并求值

listTimes4 = map times4 [1,2,3,4,5]
-- [4,8,12,16,20]

-- 然后我们来定义一个map

multBy4 :: [Int] -&gt; [Int]
multBy4 [] = []

-- 将一个列表中的某个值取出然后乘以4再存入到另一个列表中
-- 这里的xs 类型是 [Int], 这是一个递归写法 
multBy4 (x:xs) = times4 x : multBy4 xs

-- 判断两个字符串是否相等

areStringEq :: [Char] -&gt; [Char] -&gt; Bool
areStringEq [] [] = True
areStringEq (x:xs) (y:ys) = x == y && areStringEq xs ys
areStringEq _ _ = False

-- 将一个函数作为另一个函数的参数
-- (Int -&gt; Int) 代表我们需要一个参数是Int 返回值是Int的函数作为参数传入

doMult :: (Int -&gt; Int) -&gt; Int
doMult func = func 3

num3Time4 = doMult times4

-- 返回一个函数
getAddFunc :: Int -&gt; (Int -&gt; Int)

-- 我们能够值传入
getAddFunc x y = x + y

-- 我们也能得到一个+3的函数

adds3 = getAddFunc 3
fourPlus3 = adds3 4

-- 我们也能够将这个函数用到map中

threePlusList = map adds3 [1,2,3,4,5]


-- ------ LAMBDA ------
-- 创建一个匿名函数 也称为lambda 用 \ 开始表示这是一个lambda (\arguments -&gt; result)

db1To10 map (\x -&gt; x * 2) [1..10]

-- ------- 条件 ------
-- 所有的if 都必须包含else

doubleEvenNumber y = 
    if (y `mod` 2 /= 0)
        then y
        else y * 2

-- 我们能够利用case表达式
getClass :: Int -&gt; String
getClass n = case n of 
    5 -&gt; "Go to kindergarten"
    6 -&gt; "Go to elementary school"
    _ -&gt; "Go to some place else"


-- ------ MODULES -------
-- 我们能够将一组函数组织起来，集合成一个module，通过import能加载一个模块
-- 那么如何创建一个模块呢？
-- 1. 创建一个文件
-- 2. 将所有需要使用的函数包含进去
-- TODO
-- 3.  在文件的顶部将所有需要导出的函数列出

-- ------ 枚举 ------

data BaseallPlayer = Pitcher
                    | Catcher
                    | Infield
                    | Outfield
                deriving Show

barryBonds :: BaseallPlayer -&gt; Bool
barryBonds Outfield = True

barryInOf print(barryBonds Outfield)

-- ------ 自定义类型 ------

data Customer = Customer String String Double
    deriving Show

--定义自定义类型的变量
tomSmith :: Customer
tomSmith = Customer "Tom Smith" "123 Main st" 20.50

-- 定义一个需要使用该自定义类型的函数
getBalance :: Customer -&gt; Double
getBalance (Customer _ _ b) = b

tomSmithBal print(getBalance tomSmith)


data RPS = Rock | Paper | Scissors

shoot :: RPS -&gt; RPS -&gt; String
shoot Paper Rock = "Paper Beats Rock"
shoot Rock Scissors= "Rock Beats Scissors"
shoot Scissors Paper= "Rock Beats Scissors"
shoot Scissors Rocks= "Scissors Lose to Rocks"
shoot Paper Scissors= "Paper Lose to Scissors"
shoot Rock Paper= "Rock Loses to Paper"
shoot _ _= "Error"

data Shape = Circle Float Float Float | Rectangle Float Float Float Float
    deriving (Show)

-- :t Circle = Float -&gt; Float -&gt; Float -&gt; Float

area :: Shape -&gt; Float
area (Circle _ _ r) = pi * r ^ 2 
area (Rectangle x y x2 y2) = (abs (x2 - x))  * (abs (y2 - y))

-- 使用 $ 符号可以把$后面的表达式作为一个参数传入到前面的函数中
-- 使用 . 可以作为一个管道符号，将后面一个函数的输出作为前一个函数的输入
putStrLn . show $ 1 + 2

-- Get area of shapes 
areaOfCircle = area (Circle 50 60 20)

areaOfRectangle = area $ Rectangle 10 10 100 100

-- ------ Type Class -------
-- Num, Eq 和 Show 是类型类
-- Type Class相当于面向对象的接口
-- 多态函数（具有多种参数，多种数据类型，通常用类型定义
-- 例如， + 运算符就是用Num 类型类定义的
-- :t (+) :: Num a =&gt; a -&gt; a -&gt; a
-- 这代表 a 是Num的一个实例，+ 能够处理两个a类型的数然后返回一个类型为Num的数

--自定义一个自定义类型类，并让其能够进行比较

data Emplyee = Emplyee {
    name :: String,
    position :: String,
    idNum :: Int,
} deriving (Eq,Show)

samSmith = Emplyee{name = "Sam Smith",position = "Manager",IdNum = 1000}
pamMax = Emplyee{name = "Pam Max",position = "Sales",IdNum = 1001}

isSamPam = smaSmith == pamMax

samSimithData = show smaSmith

-- 实现一个自己实现的Eq 和Show类型类的数据类型
data ShirtSize = S | M | L

instance Eq ShirtSize where
    S == S = True
    M == M = True
    L == L = True
    _ == _ = False

instance Show ShirtSize where
    show S = "Small"
    show M = "Medium"
    show L = "Large"

-- Check if S is in the list
-- 需要实现Eq才能够用elem 方法
smallAvail = S `elem` [S, M, L]

-- Get string value for ShirtSize
-- 需要实现Show 类型类
theSize = show S

-- 自定义类型类
class MyEq a where
    areEqual :: a -&gt; a -&gt; Bool


-- 实现自己定义的类型类

instance MyEq ShirtSize where
    areEqual S S = True
    areEqual M M = True
    areEqual L L = True
    areEqual _ _ = Fasle

newSize = areEqual M M




-- ------ I/O ------

sayHello = do
    putStrLn "What's your name: "
    name &lt;- getLine

    putStrLn $ "Hello" ++ name

-- File I/O

writeToFile = do
    theFile &lt;- openFile "test.txt" WriteMode

    hPutStrLn theFile ("Random line of text")

    hClose theFile

readFromFile = do
    theFile2 &lt;- openFile "test.txt" ReadMode

    contents &lt;- hGetContents theFile2
    putStr contents
    hClose theFile2


-- ------ EXAMPLE: FIBONACCI SEQUENCE ------
-- 1,1,2,3,5,8, ...

-- 1 : 1 : 代表函数的开始
-- | 表示对于每个 a,b 并将其相加
-- &lt;- 存储 a + b 之和
-- tail : 得到除了第一个值之外的所有值
-- zip 将两个列表压缩，并得到一个tuple 列表

fib = 1 : 1: [a + b | (a , b) &lt;- zip fib (tail fib)]
-- 对上式进行推演
-- 1. 首先 fib = 1 然后tail fib = 1
-- 2. 现在列表变成了 [1,1,2] 因为 a:1 + b:1 = 2
-- 3. 然后第二步, fib = 1 然后 (tail fib) = 2
-- 4. 现在列表变成了 [1,1,2,3] 因为 a: 1 + b: 2 = 3
```
