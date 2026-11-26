# codestack Hugo 源站

使用 Hugo 0.170.1、Go 1.25.5、Dart Sass 1.108.2 和 Stack 4.0.3。主题版本记录在 `go.mod` 和 `go.sum` 中。

检出本分支后，在仓库根目录运行以下命令。第一行适用于本机从官方预编译包安装的 Dart Sass。若 `sass --version` 已显示 Dart Sass，可省略第一行。

```sh
export PATH="$HOME/.local/share/dart-sass-1.108.2/dart-sass:$PATH"
hugo server --bind 127.0.0.1 --port 1313
```

打开 http://127.0.0.1:1313/。运行 `hugo` 可生成静态文件。

## 文章与配图

- 21 篇公开技术文章在 `content/posts/*.md`。这些 Markdown 从旧站发布的 HTML 恢复，无法确认作者提交时的 Markdown 原稿。
- 每篇文章的 `cover` 指向 `assets/` 下的封面。21 张主题插画位于 `assets/banners/`。正文插图位于 `static/blog-assets/`。
- 正文版式位于 `layouts/posts/single.html`。首页会列出所有可发布的 Markdown 文章。历史归档地址跳转到首页文章列表。本分支只保存公开技术文章。

主站使用仓库根目录的静态文件发布。发布时合并 Hugo 生成的首页、正文、归档、分类和主题资源，保留已有域名、旧技术入口以及原有 RSS 订阅地址。
