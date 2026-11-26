{
  "title": "如何用GN编译V8引擎",
  "date": "2018-05-12",
  "url": "/posts/how-to-compile-v8-engine-by-gn/",
  "description": "从准备依赖到生成构建配置，记录使用 GN 编译 V8 的过程。",
  "categories": [
    "工程"
  ],
  "cover": "banners/how-to-compile-v8-engine-by-gn.webp",
  "tags": [
    "javascript",
    "v8"
  ]
}

在v8引擎的6.5版本以上，google采用了`GN+Ninja`的编译组合，因此本文主要是基于`GN+Ninjia`的编译方式进行说明。

## 获取源码 {#获取源码}

在官方文档中，还特别提示了避免HFS环境下的unicode问题，需要额外配置一下：

```shell
$ git config --global core.precomposeUnicode true
```

现在v8在github上面有源码镜像，你只需要`git clone`下来即可。

```shell
$ git clone git@github.com:v8/v8.git
```

## 获取依赖 {#获取依赖}

### depot\_tools {#depot_tools}

首先`git clone`如下的仓库：

```shell
$ git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
```

> Note: 国内用户可以`clone`github上面的镜像代码：  
> `git clone git@github.com:cybertk/depot_tools.git`

然后将`depot_tools`加入你的`PATH`环境变量中(通常会加到`.bashrc`或者`.zshrc`中)：

```shell
export PATH="$PATH:/path/to/depot_tools"
```

### gclient {#gclient}

取得`depot_tools`之后，需要取得大量编译依赖，google提供了一个比较方便的工具`gclient`来获取依赖。

```shell
gclient sync
```

尴尬的一点在于，由于众所周知的原因，依赖下载十分缓慢。现在我给出一些解决方案：

**方案A: 设置代码镜像**  
在获取到的v8代码中，第一级目录下有一个`DEPS`文件,通过修改其中的代码源实现加速：

```shell
$ vim DEPS
```

内容如下

```python
vars = {
  'build_for_node': False,
  'checkout_instrumented_libraries': False,
  'chromium_url': 'https://chromium.googlesource.com',
  'download_gcmole': False,
  'download_jsfunfuzz': False,
  'download_mips_toolchain': False,
}
```

将`chromium_url`的值修改为:`https://source.codeaurora.org/quic/lc`

> Note: 请注意，这个chromium源码镜像并不全，没有python相关的库，但是大部分库都有，可以先把大部分代码下载下来，再使用代理把剩下的下载下来。

**方案B: 设置代理**

这是根治的方法，至于代理是如何设置本文不涉及。

```shell
export http_proxy=127.0.0.1:1080 
export https_proxy=127.0.0.1:1080
```

> Note：请注意`http_proxy`一定要小写。

## 编译初始化 {#编译初始化}

v8使用[Ninja](https://ninja-build.org/)作为编译工具，同时使用[GN](https://chromium.googlesource.com/chromium/src/+/lkcr/tools/gn/docs/quick_start.md)来生成`.ninja`文件。

使用GN可以生成不同平台的编译配置文件：

```shell
gn gen out.gn/x64.release
```

当然你也可以在生成编译配置的时候传入一些参数:

```shell
gn gen out.gn/foo --args='is_debug=false target_cpu="x64" v8_target_cpu="arm64" use_goma=true'
```

使用如下参数加速编译：

1. `is_debug = false` 编译成`release`版本
2. `is_component_build = true` 编译成动态链接库而不是很大的可执行文件
3. `symbol_level = 0` 将所有的debug符号放在一起，可以加速二次编译，并加速链接过程
4. 可以使用`ccache`加速编译过程，[安装ccache](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/ccache_mac.md), 可以传入参数`cc_wrapper="ccache"`,[参考这里](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/ccache_mac.md)
5. 使用[jumbo](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/jumbo.md)

编译选项参考[chromium编译方式](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/mac_build_instructions.md)

例如我的编译生成命令是：

```shell
gn gen out.gn/x64.release --args='is_debug=false is_component_build=true symbol_level=0 cc_wrapper="ccache" target_cpu="x64" '
```

或者你可以使用 `gn args out/x64.yourdir` 这样的方式配置编译选项文件，如果你想编译一个简单的静态库，你可以用如下参数：

```text
is_component_build = false
is_debug = false
libcpp_is_static = false
symbol_level = 1
treat_warnings_as_errors = false
use_custom_libcxx = false
use_sysroot = false
v8_deprecation_warnings = false
v8_embedder_string = "-v8_Your_Define_String"
v8_enable_gdbjit = false
v8_enable_i18n_support = false
v8_enable_test_features = false
v8_experimental_extra_library_files = []
v8_extra_library_files = []
v8_imminent_deprecation_warnings = false
v8_monolithic = true
v8_static_library = false
v8_target_cpu = "x64"
v8_untrusted_code_mitigations = false
v8_use_external_startup_data = false
v8_use_snapshot = true
```

请注意，官方wiki文档中使用的`tools/dev/v8gen.py x64.release`一直由于缺少什么文件导致无法运行，如果你也遇到本问题，请参考本文。

## 编译 {#编译}

编译完整的V8代码（假设是x64.relrease）

```shell
ninja -C out.gn/x64.release
```

如果想编译特定目标，比如`d8`：

```shell
ninja -C out.gn/x64.release d8
```

## 生成开发项目 {#生成开发项目}

如果想使用xcode进行开发，你可以这样做：

```shell
gn gen out/gn --ide=xcode
```

然后用`xcode`打开即可

```
open out/gn/ninja/all.xcworkspace
```

## 有关 xcode 调试代码的说明 {#有关-xcode-调试代码的说明}

有朋友反馈上述编译得到的 xcode 项目调试时无法看到源码, 该朋友的解决方案是如下：

原因：

在 xcode 的设置里面, 断点的标记形式, 是以绝对路径的形式的, 而 v8/chrome 默认的配置 (配置文件: compiler.gni) 会删掉绝对路径的符号, 这样与 xcode 就无法找到对应符号, 所以看不到源码。

```text
# If the platform uses stripped absolute paths by default, then we don't expose
# it as a configuration option. If this is causing problems, please file a bug.
if (strip_absolute_paths_from_debug_symbols_default) {
  strip_absolute_paths_from_debug_symbols = true
} else {
  declare_args() {
    strip_absolute_paths_from_debug_symbols = false
  }
}
```

参考这个链接： <https://groups.google.com/a/chromium.org/g/chromium-dev/c/kE1HeGL4mj0/m/TOKsRsyTEwAJ>.

gn 编译时添加参数：

```shell
gn gen out/Default --args="strip_absolute_paths_from_debug_symbols=false”
```

这样就可以让 xcode 调试的时候看到到项目的源代码了。
