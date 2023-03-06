<p align="center">
<a href="https://www.duxravel.com/">
    <img src="https://github.com/duxphp/duxravel/blob/main/resources/image/watermark.png?raw=true" width="100" height="100">
</a>

<p align="center">适用于 duxravel 配套后台前端代码</p>

<p align="center">
<a href="https://www.duxravel.com">中文文档</a> |
<a href="https://www.github.com/duxphp/duxravel">配套后端</a>
</p>

<p align="center">
    <a href="https://packagist.org/packages/duxphp/duxravel-static">
        <img src="https://img.shields.io/github/v/release/duxphp/duxravel-static">
    </a>
    <a href="https://packagist.org/packages/duxphp/duxravel-static">
        <img src="https://img.shields.io/packagist/dt/duxphp/duxravel-static.svg?style=flat-square">
    </a>
    <a href="https://packagist.org/packages/duxphp/duxravel">
        <img src="https://img.shields.io/packagist/l/duxphp/duxravel.svg?maxAge=2592000&&style=flat-square" alt="Packagist">
    </a>
    <a href="https://github.com/arco-design/arco-design-vue">
        <img src="https://img.shields.io/badge/dependence-arco design-red?style=flat-square">
    </a>
    <a href="https://github.com/vuejs/vue-next">
        <img src="https://img.shields.io/badge/dependence-vue3-blue?style=flat-square">
    </a>
    <a href="https://github.com/vitejs/vite">
        <img src="https://img.shields.io/badge/dependence-vite-blue?style=flat-square">
    </a>
</p>


### 项目安装
```
yarn install
```

### 本地调试
```
yarn serve
```

### 编译版本
```
yarn build
```

### 检验文件
```
yarn lint
```

### 实时编译（Duxravel）
本地开发时，如需 `duxravel-static` 与 `duxravel` 主项目（即您的业务项目）实时编译并生效，可按如下几步简便实现：

1. 在您的业务项目 `composer.json` 添加如下配置

```json
    "repositories": {
        "duxphp/duxravel-static": {
            "type": "path",
            "url": "/path/to/your/local/duxravel-static",
            "options": {
                "symlink": true
            }
        }
    },
```

2. 在您的业务项目根目录下，执行 `composer update -vv` 或者 `composer require duxphp/duxravel-static -vv`

3. 在 `duxravel-static` 创建 `.env.local` 文件并添加环境变量：

```shell
DUXRAVEL_PROJECT_ROOT = '/path/to/your/duxravel'
```

> `DUXRAVEL_PROJECT_ROOT` 值为您的业务项目根目录

4. 在 `duxravel-static` 终端启动 `yarn build -w`

终端输出如下日志，即表明成功。然后你可以任意修改前端源文件试试咯。
```shell
INFO  Publishing [duxravel] assets.  

Copying directory [/path/to/github.com/duxphp/duxravel-static/dist/static/manage] to [public/static/manage] ........................ DONE
Copying directory [/path/to/github.com/duxphp/duxravel-static/dist/static/tinymce] to [public/static/tinymce] ...................... DONE
Copying file [/path/to/github.com/duxphp/duxravel-static/dist/manifest.json] to [public/static/manage-manifest.json] ............... DONE
```
