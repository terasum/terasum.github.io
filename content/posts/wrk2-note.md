{
  "title": "WRK2 http benchmark 快速笔记",
  "date": "2019-01-11",
  "url": "/posts/wrk2-note/",
  "description": "记录 wrk2 的安装、请求速率设置和 HTTP 压测用法。",
  "categories": [
    "系统"
  ],
  "cover": "banners/wrk2-note.webp"
}

首先需要克隆 wrk2 仓库的代码:

```shell
git clone https://github.com/giltene/wrk2.git
```

编译安装

```
make && sudo make install
```

注意:

在macos下编译需要修改一行代码，我的系统版本为`10.14` Mojave则在`deps/luajit/src/Makefile`文件`293`行  
修改为相应的系统版本号：

```shell
# export MACOSX_DEPLOYMENT_TARGET=10.4
export MACOSX_DEPLOYMENT_TARGET=10.14
```

安装完毕之后，就可以进行压力测试了。

## 编写压测lua脚本 {#编写压测lua脚本}

以post测试为例,编写如下lua脚本：

`post.lua`

```lua
wrk.method = "POST"
wrk.body   = "{\"jsonrpc\":\"2.0\", \"method\": \"node_getNodeStates\", \"id\": 1}"
wrk.headers["Content-type"] = "application/json"
```

## 压力测试 {#压力测试}

wrk拥有如下选项：

```
Usage: wrk <options> <url>
  Options:
    -c, --connections <N>  需要保持的连接数量
    -d, --duration    <T>  测试持续的时间
    -t, --threads     <N>  需要使用的线程数量

    -s, --script      <S>  需要加载的lua脚本
    -H, --header      <H>  添加请求头
    -L  --latency          打印延迟统计
    -U  --u_latency        打印不正确的延迟统计
        --timeout     <T>  连接/请求超时时间
    -B, --batch_latency    统计整个批量时间
                           (正式对应的每一个op)
    -v, --version          打印版本细节
    -R, --rate        <T>  TPS [必填参数]
```

简单测试命令:

```shell
./wrk -t10 -c10 -d30s -R50 -L --script=post.lua http://localhost:8081
```
