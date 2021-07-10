const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');

mix.postCss('src/css/base.pcss', 'dist/css', [
    require('postcss-import'),
    tailwindcss('./tailwind.config.js'),
    require('postcss-nesting'),
    require('autoprefixer'),
])
    .options({
        processCssUrls: false,
    });
mix.minify(['dist/css/base.css']);

mix.scripts([
    'src/js/do.js',
    'src/js/package.js',
    'src/js/common.js',
    'src/js/component/app.js',
    'src/js/component/notify.js',
    'src/js/component/dialog.js',
    'src/js/component/table.js',
    'src/js/component/form.js',
    'src/js/component/show.js',
    'src/js/component/system.js',
    'src/js/component/file.js',
    'src/js/component/page.js',
], 'dist/js/app.js');
mix.minify(['dist/js/app.js']);

mix.copyDirectory('src/img', 'dist/img');
mix.copyDirectory('src/libs/fontawesome/webfonts', 'dist/webfonts');
mix.copyDirectory('src/js/package/cascader', 'dist/js/cascader');
mix.copyDirectory('src/js/package/Inputmask', 'dist/js/Inputmask');
mix.copyDirectory('src/js/package/pagination', 'dist/js/pagination');
mix.copyDirectory('src/js/package/password', 'dist/js/password');
mix.copyDirectory('src/js/package/prompt', 'dist/js/prompt');
mix.copyDirectory('src/js/package/toast', 'dist/js/toast');
mix.copyDirectory('src/js/package/tinymce', 'dist/js/tinymce');
mix.copyDirectory('src/js/package/tinydux/theme/build/ui/dux', 'dist/js/tinymce/skins/ui/dux');
mix.copyDirectory('src/js/package/tinydux/theme/build/content/dux', 'dist/js/tinymce/skins/content/dux');

mix.copy('src/libs/fontawesome/css/all.min.css', 'dist/css/fontawesome.min.css');
mix.copy('src/libs/jquery/jquery-3.5.1.min.js', 'dist/js/jquery.min.js');
mix.copy('node_modules/@popperjs/core/dist/umd/popper.min.js', 'dist/js/tippy/popper.min.js');
mix.copy('node_modules/tippy.js/dist/tippy.umd.min.js', 'dist/js/tippy/tippy.min.js');
mix.copy('node_modules/tippy.js/dist/tippy.css', 'dist/js/tippy/tippy.css');
