{
  "title": "精通 sed (mastering sed)",
  "date": "2017-07-05",
  "url": "/posts/mastering-in-diving/",
  "categories": [
    "工程"
  ],
  "description": "从常用的文本替换入手，理解 sed 的脚本和处理流程。",
  "cover": "banners/mastering-in-diving.webp",
  "tags": [
    "sed"
  ]
}

# mastering sed

> 我承认这是标题党，但是sed在平时工作中sed真的很有用，特别是像我这种需要写一些shell进行自动化工作的。

## sed 快速入门

`sed` 作为流编辑神器，在写脚本的时候往往会发挥奇效，所以这里我将`sed`的一些关键用法介绍一下，目的在于实用，而不是全面。

### `-i` 参数

常常会看到会有`sed -i`这样的命令，`-i`的意思就是直接在源文件上进行操作。

### 动作

`sed`的**动作**是我们需要掌握的最为重要的内容 ：  
– a ：新增， a 的后面可以接字串，而这些字串会在新的一行出现(目前的下一行);  
– c ：取代， c 的后面可以接字串，这些字串可以取代 n1,n2 之间的行;  
– d ：删除， d 后面通常不接任何字符;  
– i ：插入， i 的后面可以接字串，而这些字串会在新的一行出现(目前的上一行)；  
– p ：列印，亦即将某个选择的数据印出。通常 p 会与参数 sed -n 一起运行;  
– s ：替换，可以直接进行取代的工作通常这个 s 的动作可以搭配正则语法,语法很像vim的替换。

### 样例

测试文件内容：

```shell
# cat song.txt
my name is zhangshan
his name is lisi
my dog name is doglas
today is good day
we sang a song:
lalalalala
hahahahaha
```

#### `s` 替换

```
sed "s/zhangshan/wangnima/g" song.txt
```

> 替换的方式和`vim`很像

输出

```shell
# sed "s/zhangshan/wangnima/g" song.txt
my name is wangnima
his name is lisi
my dog name is doglas
today is good day
we sang a song:
lalalalala
hahahahaha
```

这样只会将修改之后的文件输出到标准输出，如果需要修改原来的文件的话，加上`-i`参数：

```
sed -i "s/zhangshan/wangnima/g" song.txt
```

修改就会在源文件上生效

**用正则武装sed**  
正则表达式是一件神兵利器，这里介绍一些较为简单的正则表达式：  
– `^` 表示一行的开头，如：`/^my/` 这就是以单词my为开头的匹配  
– `$` 表示一行的结尾，如: `/:$/` 就是以字符`:`为结尾的匹配  
– `\<` 表示一个词的开头，如`\<s` 就是以s开头的词  
– `\>` 表示一个词的结尾，如`g\>` 就是以g为结尾的词  
– `.` 表示任意单个字符  
– `*` 表示一个字符可以出现0次或者多次  
– `?` 表示一个字符可以出现1次或者多次  
– `[]` 集合，例如[abc]可以匹配a,或b,或c，经典例子：[a-zA-Z]匹配所有26个字母,`^`表示取反，如`[^a]`表示非a的字符。

**只替换第一行的内容**

```
sed "1s/name/nume/g"
```

输出

```shell
# sed "1s/name/nume/g" song.txt
my nume is wangnima
his name is lisi
my dog name is doglas
today is good day
we sang a song:
lalalalala
hahahahaha
```

**指定行号范围**

```
sed "1,2s/name/nume/g" song.txt
```

输出

```shell
# sed "1,2s/name/nume/g" song.txt
my nume is wangnima
his nume is lisi
my dog name is doglas
today is good day
we sang a song:
lalalalala
hahahahaha
```

**只替换每行第一个s**

```
sed "s/s/S/1" song.txt
```

输出

```shell
# sed "s/s/S/1" song.txt
my name iS wangnima
hiS name is lisi
my dog name iS doglas
today iS good day
we Sang a song:
lalalalala
hahahahaha
```

**只替换每行第2个s**

```
sed "s/s/S/2" song.txt
```

输出

```shell
# sed "s/s/S/2" song.txt
my name is wangnima
his name iS lisi
my dog name is doglaS
today is good day
we sang a Song:
lalalalala
hahahahaha
```

**只替换每行第2个之后的s**

```
sed "s/s/S/2g" song.txt
```

输出

```shell
# sed "s/s/S/2g" song.txt
my name is wangnima
his name iS liSi
my dog name is doglaS
today is good day
we sang a Song:
lalalalala
hahahahaha
```

**多次匹配**

将第一行的”wangnima”改成”zhangshan”然后把第二行的lisi改成”wangwu”

```shell
sed "1s/wangnima/zhangshan/g; 2s/lisi/wangwu/" song.txt
```

输出

```shell
    # sed "1s/wangnima/zhangshan/g; 2s/lisi/wangwu/" song.txt
    my name is zhangshan
    his name is wangwu
    my dog name is doglas
    today is good day
    we sang a song:
    lalalalala
    hahahahaha
```

等价命令

```shell
sed -e "1s/wangnima/zhangshan/g" -e "2s/lisi/wangwu/" song.txt
```

**`&` 的妙用**  
可以用&表示被匹配到的字符，我们可以用这个trick 做一些事情：

```shell
sed "s/name/@&@/g" song.txt
```

输出：

```shell
    my @name@ is wangnima
    his @name@ is lisi
    my dog @name@ is doglas
    today is good day
    we sang a song:
    lalalalala
    hahahahaha
```

**圆括号匹配**  
在正则表达式中，圆括号括起来的正则部分可以作为变量使用，sed中用`\1`,`\2`…表示匹配到的值：

```shell
    sed "s/\([a-z]*\) name is \([a-z]*\)/\1:\2/g" song.txt
```

输出

```shell
    # sed "s/\([a-z]*\) name is \([a-z]*\)/\1:\2/g" song.txt
    my:wangnima
    his:lisi
    my dog:doglas
    today is good day
    we sang a song:
    lalalalala
    hahahahaha
```
