<?php

namespace Duxravel\UI\Providers;

use Duxravel\Core\Util\Hook;
use Duxravel\Core\Util\Menu;
use Illuminate\Contracts\Http\Kernel as HttpKernel;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\Paginator;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class UIServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {

    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot(Router $router)
    {
        $this->publishes([
            __DIR__.'/../dist/static/manage' => public_path('static/manage'),
            __DIR__.'/../dist/static/tinymce' => public_path('static/tinymce'),
            __DIR__.'/../dist/manifest.json' => public_path('static/manage-manifest.json'),
        ], 'duxravel-system');
    }
}
