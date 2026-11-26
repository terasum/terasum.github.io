{
  "title": "Sublime Text 安装配置，代理设置，插件管理",
  "date": "2016-08-25",
  "url": "/posts/sublime-text-installation-proxy-plugin/",
  "description": "记录 Sublime Text 的安装、代理设置和 Package Control 的使用。",
  "categories": [
    "工程"
  ],
  "cover": "banners/sublime-text-installation-proxy-plugin.webp",
  "tags": [
    "ide",
    "sublime",
    "编辑器"
  ]
}

我一直想写一篇文章，用来说明如何按照我自己的喜好来进行Sublime Text(目前版本是V3)的安装和设置。  
这篇文章更多的是为我自己写的一篇指南，以免未来的什么时候我忘记了。如果这篇文章能够帮到你，那就更棒啦！

## 步骤1: 下载并且安装 {#步骤1-下载并且安装}

你可以从以下链接下载最新版本：

- [Sublime Text 2](http://www.sublimetext.com/2)
- [Sublime Text 3](http://www.sublimetext.com/3)

目前我使用的版本是`ST3 build 3065` 更新于2014年8月29日

> [译者](http://www.chenquan.me) 用的版本是`st3 build 3083`

## 步骤2: 安装Package Control (插件管理工具) {#步骤2-安装package-control-插件管理工具}

如果想安装其他的插件，需要先安装这个Package Control 插件，请遵照这个链接中的安装教程：

[Package Control Install](https://sublime.wbond.net/installation)

注意：如果你在使用代理，可能需要手动下载并安装这个包，安装完成之后，需要重启下sublime text (出于安全因素的考虑)

[译者](http://www.chenquan.me) ：  
由于考虑到国内不一定能打开安装链接，我把安装代码贴在下面，请在st3中按快捷键’ctrl+`’然后再弹出的输入框中输入以下代码并回车（2015/8/25）：

```python
import urllib.request,os,hashlib; h = 'eb2297e1a458f27d836c04bb0cbaf282' +&lt;/blockquote&gt;
'd0e7a3098092775ccb37ca9d6b2e4b7d'; pf = 'Package Control.sublime-package';
ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) );
by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest();
print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

> **更新**: 这个脚本是每天更新的，复制过去脚本会失效，请用上面的安装链接践行安装。（2017-04-01）

## 步骤2（附）: Package Control的代理设置 {#步骤2附-package-control的代理设置}

如果你需要在代理环境中使用`Sublime Text` ，那么你需要配置一下代理来让`Package Control` 正常工作。

将以下代码加入到  
`Preferences > Package Settings > Package Control > Settings – User`  
中：

```json
//proxy settings
"http_proxy": "your.proxy.fqdn:80",
"https_proxy": "your.proxy.fqdn:80",
"proxy_username": "my_username",
"proxy_password": "my_password",
```

**注意:**  
你可能需要修改80端口为别的你代理的端口（比如8080）， 你可以在IE的代理设置中找到这个端口 ([译者](http://chenquan.me)用的是ss，视实际情况而定)。

完成之后，**重启下Sublime Text**

## 步骤3: 安装Sublime Text的插件 {#步骤3-安装sublime-text的插件}

现在，你可以安装所有能让Sublime Text更酷的插件! 以下的步骤是安装所有插件需要的步骤：

1. `Cmd+shift+P (OSX) / Ctrl+Shift+P (Win/Linux)`
2. 输入：Install Packsge
3. 搜索你需要的插件名称
4. 按回车进行安装

### 我在Sublime Text中使用的插件有： {#我在sublime-text中使用的插件有}

- CSS Comb
- Emmet1
- Emmet CSS Snippets
- FileDiffs (only on Windows machines)
- Gist
- Predawn2
- PowerShell
- SASS
- SCSS
- Sidebar Enhancements
- SublimeLinter
- VBDotNet
- vbScript
- WordPress

> **1**: To use Emmet you need PyV8 installed. By default when installing Emmet, PyV8 will attempt to download and install automatically. If it doesn’t you an download it from here [Emmet PyV8](https://github.com/emmetio/pyv8-binaries).  
> 如果想要使用emmet插件需要安装PyV8依赖，一般情况下可以自动安装完成，如果它傲娇了，请务必点击上面的链接下载自行安装。
>
> **2**: You must install Predawn prior to configuring User Settings in Step 5 below (otherwise the settings in the Colour Scheme & Theme section will fail).  
> For more information about PreDawn and the options available have a look here [Predawn GitHub](https://github.com/jamiewilson/predawn)  
> 如果你想要更改颜色主题，请一定要按照步骤5中的用户配置进行相应配置。

## 步骤4: 编辑asp页面以包含aspx 文件 {#步骤4-编辑asp页面以包含aspx-文件}

> 由于这部分并不重要，是作者自己个人的偏好，并没有普遍性，所以不翻译了

## 步骤5: Sublime Text的用户设置： {#步骤5-sublime-text的用户设置}

想要改变`SublimeText`的默认设置，你需要把你的个人设置添加到`User Settings`文件中，你可以在`Preferences &gt; Settings – User`找到并编辑这个文件：

下面的是我自己添加的：

```json
// Colour Scheme & Theme (for ST3)

"color_scheme": "Packages/User/predawn (SL).tmTheme",
"theme": "predawn-DEV.sublime-theme",

// Typography

"font_face": "Source Code Pro",
"font_size": 13,
"font_options": ["no_round"],
"highlight_line": true,
"caret_extra_width": 1,
"caret_style": "phase",
"tab_size": 2,
"translate_tabs_to_spaces": true,
"word_wrap": false,

// Whitespace, Matching, Copy & Auto-Complete

"copy_with_empty_selection": false,
"drag_text": false,
"match_brackets_content": false,
"match_selection": false,
"match_tags": false,
"translate_tabs_to_spaces": true,
"trim_trailing_white_space_on_save": true,

// Interface & Behavior

"close_windows_when_empty": false,
"draw_minimap_border": true,
"enable_tab_scrolling": false,
"hot_exit": false,
"overlay_scroll_bars": "enabled",
"open_files_in_new_window": false,
"preview_on_click": false,
"remember_open_files": false,
"scroll_past_end": true,
"scroll_speed": 5.0,
"show_full_path": false,

// Other Settings

"ignored_packages":
[
"Vintage"
],
```

注意:上面的是Sublime Text 3的设置，如果你正在使用ST2你需要把Colour Scheme & Theme 部分修改成下面的

```json
//Colour Scheme Theme (for ST2)
"theme": "predawn.sublime-theme",
"color_scheme": "Packages/Predawn/predawn.tmTheme",
```

## 步骤6: 改变Sublime Text的图标 {#步骤6-改变sublime-text的图标}

现在有很多的`Sublime Text`的炫酷图标，我也把我自己的改掉了，你可以按照下面的步骤进行修改：

**Mac OSX**

略(有兴趣请大家翻原文看)

**Windows8**

1. 把新的图标拷贝到安装目录下(我的是`D:\SublimeText3\`)
2. 右键点击 `Sublime Text.exe`
3. 点击创建快捷方式
4. 重命名快捷方式
5. 右键点击快捷方式并选择属性
6. 选择快捷方式栏
7. 点击更改图标
8. 选择新的图标
9. 点击`ok`
10. 右键点击快捷方式并放到开始中

```
> 尼玛简直太感动太详细了，我居然翻译完了。。。）
```

## 步骤7: 安装Sublime Text 的许可 {#步骤7-安装sublime-text-的许可}

**土豪请随意购买许可。**

原文是教你如何购买许可的，当然这没啥意思，所以我找了几个许可大家随意取用(土豪请务必购买正版，请支持正版)：

```
    —– BEGIN LICENSE —–
    Andrew Weber
    Single User License
    EA7E-855605
    813A03DD 5E4AD9E6 6C0EEB94 BC99798F
    942194A6 02396E98 E62C9979 4BB979FE
    91424C9D A45400BF F6747D88 2FB88078
    90F5CC94 1CDC92DC 8457107A F151657B
    1D22E383 A997F016 42397640 33F41CFC
    E1D0AE85 A0BBD039 0E9C8D55 E1B89D5D
    5CDB7036 E56DE1C0 EFCC0840 650CD3A6
    B98FC99C 8FAC73EE D2B95564 DF450523
    —— END LICENSE ——
    —– BEGIN LICENSE —–
    K-20
    Single User License
    EA7E-940129
    3A099EC1 C0B5C7C5 33EBF0CF BE82FE3B
    EAC2164A 4F8EC954 4E87F1E5 7E4E85D6
    C5605DE6 DAB003B4 D60CA4D0 77CB1533
    3C47F579 FB3E8476 EB3AA9A7 68C43CD9
    8C60B563 80FE367D 8CAD14B3 54FB7A9F
    4123FFC4 D63312BA 141AF702 F6BBA254
    B094B9C0 FAA4B04C 06CC9AFC FD412671
    82E3AEE0 0F0FAAA7 8FA773C9 383A9E18
    —— END LICENSE ——
    —– BEGIN LICENSE —–
    J2TeaM
    2 User License
    EA7E-940282
    45CB0D8F 09100037 7D1056EB A1DDC1A2
    39C102C5 DF8D0BF0 FC3B1A94 4F2892B4
    0AEE61BA 65758D3B 2EED551F A3E3478C
    C1C0E04E CA4E4541 1FC1A2C1 3F5FB6DB
    CFDA1551 51B05B5D 2D3C8CFE FA8B4285
    051750E3 22D1422A 7AE3A8A1 3B4188AC
    346372DA 37AA8ABA 6EB30E41 781BC81F
    B5CA66E3 A09DBD3A 3FE85BBD 69893DBD
    —— END LICENSE ——
```

> [注册码来源](http://blog.sina.com.cn/s/blog_68e267e10102v76h.html)
