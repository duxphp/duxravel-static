const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');


const srcDir = 'src';
const distDir = 'dist';

mix.postCss(srcDir + '/css/base.pcss', distDir + '/css', [
    require('postcss-import'),
    tailwindcss('./tailwind.config.js'),
    require('postcss-nesting'),
    require('autoprefixer'),
])
    .options({
        processCssUrls: false,
    });
mix.minify([distDir + '/css/base.css']);

mix.scripts([
    srcDir + '/js/do.js',
    srcDir + '/js/package.js',
    srcDir + '/js/common.js',
    srcDir + '/js/component/app.js',
    srcDir + '/js/component/notify.js',
    srcDir + '/js/component/dialog.js',
    srcDir + '/js/component/table.js',
    srcDir + '/js/component/form.js',
    srcDir + '/js/component/show.js',
    srcDir + '/js/component/system.js',
    srcDir + '/js/component/file.js',
    srcDir + '/js/component/page.js',
], distDir + '/js/app.js');
mix.minify([distDir + '/js/app.js']);

mix.copyDirectory(srcDir + '/img', distDir + '/img');
mix.copyDirectory(srcDir + '/libs/fontawesome/webfonts', distDir + '/webfonts');
mix.copyDirectory(srcDir + '/js/package/cascader', distDir + '/js/cascader');
mix.copyDirectory(srcDir + '/js/package/Inputmask', distDir + '/js/Inputmask');
mix.copyDirectory(srcDir + '/js/package/pagination', distDir + '/js/pagination');
mix.copyDirectory(srcDir + '/js/package/password', distDir + '/js/password');
mix.copyDirectory(srcDir + '/js/package/prompt', distDir + '/js/prompt');
mix.copyDirectory(srcDir + '/js/package/toast', distDir + '/js/toast');
mix.copyDirectory(srcDir + '/js/package/tinymce', distDir + '/js/tinymce');
mix.copyDirectory(srcDir + '/js/package/tinydux/theme/build/ui/dux', distDir + '/js/tinymce/skins/ui/dux');
mix.copyDirectory(srcDir + '/js/package/tinydux/theme/build/content/dux', distDir + '/js/tinymce/skins/content/dux');

mix.copy(srcDir + '/libs/fontawesome/css/all.min.css', distDir + '/css/fontawesome.min.css');
mix.copy(srcDir + '/libs/jquery/jquery-3.5.1.min.js', distDir + '/js/jquery.min.js');
mix.copy('node_modules/@popperjs/core/dist/umd/popper.min.js', distDir + '/js/tippy/popper.min.js');
mix.copy('node_modules/tippy.js/dist/tippy.umd.min.js', distDir + '/js/tippy/tippy.min.js');
mix.copy('node_modules/tippy.js/dist/tippy.css', distDir + '/js/tippy/tippy.css');
