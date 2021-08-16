export const pageData = `
<template>
  <n-layout class="bg-gray-100 h-screen" :native-scrollbar="false">
    <div class="p-5">
      <div class="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-5 whitespace-nowrap">
        <div class=" flex shadow bg-white rounded items-center">
          <div class="flex-none rounded-l bg-blue-600 text-white text-xl flex items-center justify-center w-14 h-16">
            PV
          </div>
          <div class="px-4 flex-grow">
            <div class="text-xl">8</div>
            <div class="text-gray-500 text-xs">今日访问量</div>
          </div>
          <div class="flex-none px-4 text-right">
            <div class="text-sm flex items-center justify-end  text-green-600  ">
              <div>1%</div>
              <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4 " fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="text-gray-500 text-xs">7天占比</div>
          </div>
        </div>
        <div class=" flex shadow bg-white rounded items-center">
          <div class="flex-none rounded-l bg-red-600 text-white text-xl flex items-center justify-center w-14 h-16">
            RT
          </div>
          <div class="flex-grow px-4">
            <div class="text-xl">0.066s</div>
            <div class="text-gray-500 text-xs">响应速度</div>
          </div>
          <div class="flex-none px-4 text-right">
            <div class="text-sm flex items-center justify-end   text-blue-600 ">
              <div>0%</div>
              <div class="ml-1"> -</div>
            </div>
            <div class="text-gray-500 text-xs">7天占比</div>
          </div>
        </div>
        <div class=" flex shadow bg-white rounded items-center">
          <div class="flex-none rounded-l bg-yellow-600 text-white text-xl flex items-center justify-center w-14 h-16">
            FN
          </div>
          <div class="flex-grow px-4">
            <div class="text-xl">0</div>
            <div class="text-gray-500 text-xs">文件数量</div>
          </div>
          <div class="flex-none px-4 text-right">
            <div class="text-sm flex items-center justify-end text-red-600   ">
              <div>0%</div>
              <svg xmlns="http://www.w3.org/2000/svg" class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <div class="text-gray-500 text-xs">7天占比</div>
          </div>
        </div>
        <div class=" flex shadow bg-white rounded items-center">
          <div class="flex-none rounded-l bg-green-600 text-white text-xl flex items-center justify-center w-14 h-16">
            LN
          </div>
          <div class="flex-grow px-4">
            <div class="text-xl">2391</div>
            <div class="text-gray-500 text-xs">操作日志</div>
          </div>
          <div class="flex-none px-4 text-right">
            <div class="text-sm flex items-center justify-end  text-green-600  ">
              <div>24%</div>
            </div>
            <div class="text-gray-500 text-xs">7天占比</div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-5 whitespace-nowrap mt-5">
        <div class=" shadow bg-white rounded p-5">
          <apexchart width="100%" height="200" type="area"
            :options='{"dataLabels":{"enabled":false},"fill":{"opacity":0.2,"type":"solid"},"xaxis":{"categories":["08-10","08-11","08-12","08-13","08-14","08-15","08-16"]},"chart":{"id":"vuechart-20210816499954522542156385","locales":[{"name":"zh-CN","options":{"months":["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],"shortMonths":["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],"days":["\u661f\u671f\u65e5","\u661f\u671f\u4e00","\u661f\u671f\u4e8c","\u661f\u671f\u4e09","\u661f\u671f\u56db","\u661f\u671f\u4e94","\u661f\u671f\u516d"],"shortDays":["\u5468\u65e5","\u5468\u4e00","\u5468\u4e8c","\u5468\u4e09","\u5468\u56db","\u5468\u4e94","\u5468\u516d"],"toolbar":{"exportToSVG":"\u4e0b\u8f7d SVG","exportToPNG":"\u4e0b\u8f7d PNG","exportToCSV":"\u4e0b\u8f7d CSV","menu":"\u83dc\u5355","selection":"\u9009\u62e9","selectionZoom":"\u9009\u62e9\u5927\u5c0f","zoomIn":"\u653e\u5927","zoomOut":"\u7f29\u5c0f","pan":"\u79fb\u52a8","reset":"\u91cd\u7f6e"}}}],"fontFamily":"inherit","defaultLocale":"zh-CN","toolbar":{"show":false},"zoom":{"enabled":false}},"colors":["#005dff","#d5e1ed","#00d586"],"grid":{"strokeDashArray":4},"legend":{"show":false}}'
            :series='[{"name":"\u8bbf\u95ee\u91cf","data":[0,0,0,0,0,0,0]}]'></apexchart>
        </div>
        <div class=" shadow bg-white rounded p-5">
          <apexchart width="100%" height="200" type="line"
            :options='{"dataLabels":{"enabled":false},"fill":{"opacity":1},"stroke":{"curve":"straight"},"xaxis":{"categories":["08-10","08-11","08-12","08-13","08-14","08-15","08-16"]},"chart":{"id":"vuechart-20210816499954101229710447","locales":[{"name":"zh-CN","options":{"months":["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],"shortMonths":["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],"days":["\u661f\u671f\u65e5","\u661f\u671f\u4e00","\u661f\u671f\u4e8c","\u661f\u671f\u4e09","\u661f\u671f\u56db","\u661f\u671f\u4e94","\u661f\u671f\u516d"],"shortDays":["\u5468\u65e5","\u5468\u4e00","\u5468\u4e8c","\u5468\u4e09","\u5468\u56db","\u5468\u4e94","\u5468\u516d"],"toolbar":{"exportToSVG":"\u4e0b\u8f7d SVG","exportToPNG":"\u4e0b\u8f7d PNG","exportToCSV":"\u4e0b\u8f7d CSV","menu":"\u83dc\u5355","selection":"\u9009\u62e9","selectionZoom":"\u9009\u62e9\u5927\u5c0f","zoomIn":"\u653e\u5927","zoomOut":"\u7f29\u5c0f","pan":"\u79fb\u52a8","reset":"\u91cd\u7f6e"}}}],"fontFamily":"inherit","defaultLocale":"zh-CN","toolbar":{"show":false},"zoom":{"enabled":false}},"colors":["#005dff","#d5e1ed","#00d586"],"grid":{"strokeDashArray":4},"legend":{"show":true,"position":"top","horizontalAlign":"right","floating":true,"offsetY":0,"offsetX":-5}}'
            :series='[{"name":"\u6700\u5927\u5ef6\u8fdf","data":[0,0,0,0,0,0,0]},{"name":"\u6700\u5c0f\u5ef6\u8fdf","data":[0,0,0,0,0,0,0]}]'>
          </apexchart>
        </div>
        <div class=" shadow bg-white rounded p-5">
          <apexchart width="100%" height="200" type="bar"
            :options='{"plotOptions":{"bar":{"columnWidth":"50%"}},"dataLabels":{"enabled":false},"fill":{"opacity":1},"xaxis":{"categories":["08-10","08-11","08-12","08-13","08-14","08-15","08-16"]},"chart":{"id":"vuechart-20210816499955533917595696","locales":[{"name":"zh-CN","options":{"months":["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],"shortMonths":["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],"days":["\u661f\u671f\u65e5","\u661f\u671f\u4e00","\u661f\u671f\u4e8c","\u661f\u671f\u4e09","\u661f\u671f\u56db","\u661f\u671f\u4e94","\u661f\u671f\u516d"],"shortDays":["\u5468\u65e5","\u5468\u4e00","\u5468\u4e8c","\u5468\u4e09","\u5468\u56db","\u5468\u4e94","\u5468\u516d"],"toolbar":{"exportToSVG":"\u4e0b\u8f7d SVG","exportToPNG":"\u4e0b\u8f7d PNG","exportToCSV":"\u4e0b\u8f7d CSV","menu":"\u83dc\u5355","selection":"\u9009\u62e9","selectionZoom":"\u9009\u62e9\u5927\u5c0f","zoomIn":"\u653e\u5927","zoomOut":"\u7f29\u5c0f","pan":"\u79fb\u52a8","reset":"\u91cd\u7f6e"}}}],"fontFamily":"inherit","defaultLocale":"zh-CN","toolbar":{"show":false},"zoom":{"enabled":false}},"colors":["#005dff","#d5e1ed","#00d586"],"grid":{"strokeDashArray":4},"legend":{"show":false}}'
            :series='[{"name":"\u6587\u4ef6\u6570\u91cf","data":[0,0,0,0,0,0,0]}]'></apexchart>
        </div>
        <div class=" shadow bg-white rounded p-5">
          <apexchart width="100%" height="200" type="bar"
            :options='{"plotOptions":{"bar":{"columnWidth":"50%"}},"dataLabels":{"enabled":false},"fill":{"opacity":1},"xaxis":{"categories":["08-10","08-11","08-12","08-13","08-14","08-15","08-16"]},"chart":{"id":"vuechart-20210816491005351336843835","locales":[{"name":"zh-CN","options":{"months":["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],"shortMonths":["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"],"days":["\u661f\u671f\u65e5","\u661f\u671f\u4e00","\u661f\u671f\u4e8c","\u661f\u671f\u4e09","\u661f\u671f\u56db","\u661f\u671f\u4e94","\u661f\u671f\u516d"],"shortDays":["\u5468\u65e5","\u5468\u4e00","\u5468\u4e8c","\u5468\u4e09","\u5468\u56db","\u5468\u4e94","\u5468\u516d"],"toolbar":{"exportToSVG":"\u4e0b\u8f7d SVG","exportToPNG":"\u4e0b\u8f7d PNG","exportToCSV":"\u4e0b\u8f7d CSV","menu":"\u83dc\u5355","selection":"\u9009\u62e9","selectionZoom":"\u9009\u62e9\u5927\u5c0f","zoomIn":"\u653e\u5927","zoomOut":"\u7f29\u5c0f","pan":"\u79fb\u52a8","reset":"\u91cd\u7f6e"}}}],"fontFamily":"inherit","defaultLocale":"zh-CN","toolbar":{"show":false},"zoom":{"enabled":false}},"colors":["#005dff","#d5e1ed","#00d586"],"grid":{"strokeDashArray":4},"legend":{"show":false}}'
            :series='[{"name":"\u64cd\u4f5c\u8bb0\u5f55","data":[593,1824,1709,1249,2253,0,2391]}]'></apexchart>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5">
        <div class="bg-white rounded shadow p-5">
          <div class="flex items-center relative">
            <span class="text-base flex-grow">访问排名</span>
            <div class="flex-none select-none">
              <n-dropdown trigger="hover" @select="handleSelect($event, 'views')" :options="optionDay('views')">
                <n-button>最近 {{filter.views.day}} 天</n-button>
              </n-dropdown>
            </div>
          </div>
          <app-table class="mt-4" url="http://dev.test/admin/system/visitorApi/ajax?limit=10&amp;_time=4057"
            :columns='columnsTotal' :filter='filter.views' :n-params='table'></app-table>
        </div>
        <div class="bg-white rounded shadow p-5">
          <div class="flex items-center relative">
            <span class="text-base flex-grow">响应排名</span>
            <div class="flex-none select-none">
              <n-dropdown trigger="hover" @select="handleSelect($event, 'response')" :options="optionDay('response')">
                <n-button>最近 {{filter.response.day}} 天</n-button>
              </n-dropdown>
            </div>
          </div>
          <app-table class="mt-4" url="http://dev.test/admin/system/visitorApi/ajax?limit=10&amp;_time=3717"
            :columns='columnsResponse' :filter='filter.response' :n-params='table'></app-table>
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5">
        <div class="bg-white rounded shadow p-5">
          <div class="flex items-center relative">
            <span class="text-base flex-grow">操作日志</span>
            <div class="flex-none select-none">
              <n-dropdown trigger="hover" @select="handleSelect($event, 'log')" :options="optionDay('log')">
                <n-button>最近 {{filter.log.day}} 天</n-button>
              </n-dropdown>
            </div>
          </div>
          <app-table class="mt-4" url="http://dev.test/admin/system/operate/ajax?limit=9&amp;_time=5395"
            :columns='columnsLog' :filter='filter.log' :n-params='table'></app-table>
        </div>
        <div class="bg-white shadow overflow-hidden ">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-base text-gray-600">
              环境信息
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              系统运行各参数与环境数据
            </p>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center">
                <dt class="text-sm text-gray-600 flex items-center flex-grow lg:flex-none">
                  <div class="bg-red-600 p-2 rounded text-white">
                    <svg t="1607399448502" class="w-5 h-5 fill-current" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="2810" width="24" height="24">
                      <path
                        d="M1008.8 231.66a11.44 11.44 0 0 0-0.56-1.36 17.04 17.04 0 0 0-1.06-2.5 12 12 0 0 0-1.08-1.42 18.72 18.72 0 0 0-1.44-1.88c-0.46-0.44-1.04-0.8-1.54-1.2a17.68 17.68 0 0 0-1.8-1.36L808.8 111.1a16 16 0 0 0-16 0L600.24 222a16.14 16.14 0 0 0-1.76 1.38 15.36 15.36 0 0 0-1.56 1.2 16.46 16.46 0 0 0-1.44 1.86c-0.34 0.48-0.78 0.9-1.08 1.42a19.4 19.4 0 0 0-1.04 2.5c-0.16 0.46-0.42 0.88-0.56 1.36a16.16 16.16 0 0 0-0.56 4.16v210.48l-160.44 92.38V126.88a15.6 15.6 0 0 0-0.56-4.18c-0.12-0.48-0.4-0.9-0.56-1.36a16.7 16.7 0 0 0-1.04-2.48c-0.28-0.52-0.74-0.94-1.08-1.44a18.72 18.72 0 0 0-1.44-1.88 18.92 18.92 0 0 0-1.56-1.2 19.6 19.6 0 0 0-1.76-1.36L231.22 2.14a16 16 0 0 0-16 0L22.68 112.98a13.04 13.04 0 0 0-1.76 1.38 15.62 15.62 0 0 0-1.58 1.2 16.3 16.3 0 0 0-1.42 1.86c-0.36 0.5-0.8 0.92-1.1 1.44a15.76 15.76 0 0 0-1.02 2.48 12.92 12.92 0 0 0-0.58 1.34 16.36 16.36 0 0 0-0.56 4.2v659.4a16 16 0 0 0 8 13.9l385 221.68a17.66 17.66 0 0 0 2.66 1.08c0.42 0.16 0.82 0.4 1.26 0.52a15.84 15.84 0 0 0 8.2 0c0.4-0.1 0.74-0.32 1.1-0.44a17.2 17.2 0 0 0 2.8-1.16L808.8 800.18a16 16 0 0 0 8-13.9V575.76l184.48-106.22a16 16 0 0 0 8-14V235.84a17.26 17.26 0 0 0-0.48-4.18zM223.2 34.56l160.38 92.3-160.4 92.36-160.36-92.34z m176.5 120V557.2l-93.06 53.58-67.38 38.8V247l93.06-53.58z m0 825.56L46.74 777V154.64L114.12 193.4l93.04 53.6v430.36a13.88 13.88 0 0 0 0.24 1.8 16 16 0 0 0 0.32 2.36 11.84 11.84 0 0 0 0.76 1.8 12.76 12.76 0 0 0 0.84 2 17.08 17.08 0 0 0 1.2 1.56 15.24 15.24 0 0 0 1.32 1.68c0.46 0.44 1.04 0.76 1.54 1.16a17.86 17.86 0 0 0 1.72 1.32l184.38 104.36z m16-212.34l-160.12-90.64 168.18-96.82 184.52-106.22 160.26 92.26-117.6 67.12z m369.04 9.14L431.76 980.22V795.6l261.44-149.2 91.54-52.3z m0-238.26L717.36 500l-93.06-53.58v-182.84l67.38 38.8L784.74 356z m16-210.56l-160.4-92.34 160.4-92.32 160.36 92.3z m16 210.56V356L910 302.38l67.36-38.8v182.78z"
                        p-id="2811"></path>
                    </svg>
                  </div>
                  <div class="ml-2">Laravel 版本</div>
                </dt>
                <dd class="lg:mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  8.51.0
                </dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center">
                <dt class="text-sm text-gray-600 flex items-center flex-grow lg:flex-none">
                  <div class="bg-gray-700 p-2 rounded text-white">
                    <svg t="1607399651954" class="w-5 h-5 fill-current" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="6471" width="24" height="24">
                      <path
                        d="M33.28 665.6h955.733V375.467H33.28V665.6z m757.76-187.733c23.893 0 42.667 18.773 44.373 40.96 0 23.893-18.773 42.666-40.96 44.373s-42.666-18.773-44.373-40.96c0-23.893 18.773-44.373 40.96-44.373z m-136.533 0c17.066 0 32.426 10.24 39.253 25.6 6.827 15.36 3.413 34.133-8.533 46.08-11.947 11.946-30.72 15.36-46.08 10.24-15.36-6.827-27.307-22.187-27.307-39.254 1.707-23.893 20.48-42.666 42.667-42.666z m-484.694 0h238.934V563.2H169.813v-85.333zM917.333 0H106.667c-39.254 0-71.68 32.427-71.68 71.68v218.453H990.72V71.68C989.013 32.427 956.587 0 917.333 0zM408.747 187.733H169.813V102.4h238.934v85.333z m249.173 0c-15.36 0-30.72-6.826-39.253-20.48s-8.534-29.013-1.707-42.666 22.187-22.187 37.547-22.187c22.186 0 40.96 18.773 42.666 40.96 1.707 23.893-15.36 42.667-39.253 44.373z m136.533 0c-23.893 0-42.666-18.773-44.373-40.96 0-23.893 18.773-42.666 40.96-44.373 23.893 0 42.667 18.773 44.373 40.96 0 23.893-18.773 44.373-40.96 44.373zM104.96 733.867H33.28V972.8c0 29.013 22.187 51.2 51.2 51.2h853.333c27.307 0 51.2-22.187 51.2-51.2V733.867H104.96zM408.747 921.6H169.813v-85.333h238.934V921.6z m247.466 0c-23.893 0-42.666-18.773-42.666-42.667s18.773-42.666 42.666-42.666 42.667 18.773 42.667 42.666-18.773 42.667-42.667 42.667z m136.534 0c-23.894 0-42.667-18.773-42.667-42.667s18.773-42.666 42.667-42.666 42.666 18.773 42.666 42.666S816.64 921.6 792.747 921.6z"
                        p-id="6472" fill="#ffffff"></path>
                    </svg>
                  </div>
                  <div class="ml-2">操作系统</div>
                </dt>
                <dd class="lg:mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  Darwin Version 20.6.0
                </dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center">
                <dt class="text-sm text-gray-600 flex items-center flex-grow lg:flex-none">
                  <div class="bg-blue-600 p-2 rounded text-white">
                    <svg t="1607399504569" class="w-5 h-5 fill-current" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="3747" width="24" height="24">
                      <path
                        d="M369.44 682.176c-4.512-27.136-18.08-49.76-45.248-58.816-9.024-4.512-22.592-13.568-31.68-18.08-13.536-4.512-27.104-9.056-36.16-13.568s-18.08 0-27.136 9.056c-4.544 9.024 0 18.08 4.512 22.592 4.544 9.056 9.056 13.568 18.112 22.624 9.024 13.568 18.08 22.624 31.68 36.192 9.024 13.568 18.08 22.624 13.536 40.704-4.512 31.68-18.08 63.36-40.704 85.952-4.512 4.512-9.056 4.512-9.056 4.512-13.568 0-31.68-9.024-40.704-18.08-13.568-13.568-9.056-27.136 4.512-36.16a9.728 9.728 0 0 0 9.056-9.088c9.056-9.024 13.568-18.08 9.056-31.68-4.512-4.48-4.512-9.024-9.056-13.536-18.08-18.112-40.704-36.192-63.328-54.272-58.784-45.248-85.952-99.52-90.464-162.88-4.512-72.352 13.568-140.192 49.76-203.52 13.568-22.624 31.68-45.248 58.816-58.816 18.08-9.056 36.16-13.568 54.272-18.08 49.76-13.6 104.032-22.624 158.304-13.6 45.248 9.056 81.44 31.68 95.008 76.928 9.056 31.648 13.568 58.784 9.056 90.464-4.544 63.328-54.304 117.6-113.088 135.68-27.136 9.056-40.704 4.544-54.304-18.08-9.024-13.568-22.592-31.68-31.68-49.76v-4.512c0-4.544-4.48-4.544-4.48-9.056 4.48 27.136 9.024 54.272 22.592 76.896 9.056 13.568 18.112 22.624 36.192 22.624 58.816 4.512 104.032-13.568 140.224-58.816 36.192-49.76 45.248-108.544 36.192-171.872 0-13.568-4.512-22.624-9.024-36.192 0-9.056 0-13.568 9.024-18.112 4.544 0 9.056 0 9.056-4.512 45.248-9.056 94.976-13.568 140.224-9.056 54.272 4.544 104.032 18.112 149.28 49.76 72.384 45.248 117.6 113.088 140.224 194.528 4.512 13.568 4.512 22.592 4.512 36.16 0 9.056-4.512 9.056-13.568 4.544-9.024-4.544-13.568-13.568-18.08-18.112-4.544-4.512-9.056-13.568-13.568-18.08-4.544-4.512-9.056-4.512-9.056 0s-4.512 9.056-4.512 13.568c-13.568 45.248-31.68 85.952-63.36 117.6-4.48 4.544-9.024 13.568-9.024 18.112 0 18.08-4.512 36.16 0 54.272 4.512 36.16 9.056 76.896 13.568 113.088 4.512 22.624-4.512 31.68-22.624 40.704-13.568 4.512-27.136 9.056-45.216 9.056h-72.384c0-27.136 0-54.272-22.624-67.84 4.512-18.112 9.056-36.192 13.568-58.816 4.544-18.112 0-31.68-9.056-45.248-9.024-13.568-22.592-13.568-36.16-9.024-36.192 22.592-72.384 22.592-113.088 9.024-18.112-4.512-31.68-4.512-40.736 13.568-9.024 18.112-13.568 36.192-13.568 54.304 0 22.592 4.544 49.728 9.056 72.352 0 13.568 0 18.112-13.568 22.624a207.36 207.36 0 0 1-90.464 4.512h-4.512c0-27.136 0-54.272-31.68-67.84 18.112-18.08 18.112-49.76 13.568-76.896z m-185.472-104.032c4.544-4.544 9.056-9.056 9.056-18.112 4.512-13.568-9.056-36.16-22.624-40.704-9.024-4.512-13.568 0-18.08 4.544-13.568 13.568-22.624 27.136-36.192 40.704 0 4.512-4.512 4.512-4.512 9.024-4.544 9.056 0 18.112 9.024 18.112 4.544 0 13.568 0 18.112 4.512 18.08 0 31.68-4.512 45.216-18.08z m0-149.28c0-9.056-9.024-18.08-18.08-18.08s-22.624 9.024-18.08 22.592c0 9.056 9.024 18.112 22.592 18.112 4.544-4.544 13.568-13.568 13.568-22.624z"
                        fill="#ffffff" p-id="3748"></path>
                    </svg>
                  </div>
                  <div class="ml-2">PHP版本</div>
                </dt>
                <dd class="lg:mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  fpm-fcgi 8.0.8
                </dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center">
                <dt class="text-sm text-gray-600 flex items-center flex-grow lg:flex-none">
                  <div class="bg-yellow-600 p-2 rounded text-white">
                    <svg t="1607399567811" class="w-5 h-5 fill-current" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="4325" width="24" height="24">
                      <path
                        d="M1001.632 793.792c-7.84-13.856-26.016-37.536-93.12-83.2a1096.224 1096.224 0 0 0-125.152-74.144c-30.592-82.784-89.824-190.112-176.256-319.36-93.056-139.168-201.12-197.792-321.888-174.56a756.608 756.608 0 0 0-40.928-37.696C213.824 78.688 139.2 56.48 96.32 60.736c-19.424 1.952-34.016 9.056-43.36 21.088-21.664 27.904-14.432 68.064 85.504 198.912 19.008 55.616 23.072 84.672 23.072 99.296 0 30.912 15.968 66.368 49.984 110.752l-32 109.504c-28.544 97.792 23.328 224.288 71.616 268.384 25.76 23.552 47.456 20.032 58.176 15.84 21.504-8.448 38.848-29.472 50.048-89.504a4390.107 4390.107 0 0 1 18.208 45.6c34.56 87.744 68.352 136.288 106.336 152.736a32.032 32.032 0 0 0 25.44-58.688c-9.408-4.096-35.328-23.712-72.288-117.504-31.168-79.136-53.856-132.064-69.376-161.856a32.224 32.224 0 0 0-35.328-16.48 32.032 32.032 0 0 0-25.024 29.92c-3.872 91.04-13.056 130.4-19.2 147.008C261.632 785.28 220 689.76 240.896 618.208c20.768-71.232 32.992-112.928 36.64-125.248a31.936 31.936 0 0 0-5.888-29.28c-41.664-51.168-46.176-75.584-46.176-83.712 0-29.472-9.248-70.4-28.288-125.152a31.104 31.104 0 0 0-4.768-8.896c-53.824-70.112-73.6-105.216-80.832-121.888 25.632 1.216 74.336 15.04 91.008 29.376a660.8 660.8 0 0 1 49.024 46.304 31.902 31.902 0 0 0 31.232 8.928c100.192-25.92 188.928 21.152 271.072 144 87.808 131.328 146.144 238.048 173.408 317.216a32 32 0 0 0 16.384 18.432 1004.544 1004.544 0 0 1 128.8 75.264 944.85 944.85 0 0 1 20.064 14.016h-98.848a32.032 32.032 0 0 0-24.352 52.736 3098.752 3098.752 0 0 0 97.856 110.464 32 32 0 1 0 46.56-43.872 2237.6 2237.6 0 0 1-50.08-55.328h110.08a32.032 32.032 0 0 0 27.84-47.776zM320 289.472c12.672 21.76 22.464 37.344 29.344 46.784 8.288 16.256 21.184 29.248 29.44 45.536l2.016-1.984c14.528-9.952 25.92-49.504 2.752-75.488-12.032-18.176-51.04-17.664-63.552-14.848z"
                        p-id="4326" fill="#ffffff"></path>
                    </svg>
                  </div>
                  <div class="ml-2">Mysql版本</div>
                </dt>
                <dd class="lg:mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  8.0.25
                </dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center">
                <dt class="text-sm text-gray-600 flex items-center flex-grow lg:flex-none">
                  <div class="bg-red-600 p-2 rounded text-white">
                    <svg t="1623898130568" class="w-5 h-5 fill-current" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="2623" width="200" height="200">
                      <path
                        d="M960 444.8s-3.2 0-4.8 3.2l-436.8 172.8h-6.4l-436.8-172.8c-3.2 0-3.2-3.2-4.8-4.8v129.6c0 3.2 3.2 4.8 4.8 4.8l436.8 172.8h6.4l436.8-172.8 4.8-4.8v-128z"
                        p-id="2624"></path>
                      <path
                        d="M68.8 787.2l436.8 172.8h6.4l436.8-172.8 4.8-4.8V656v-3.2c0 3.2-3.2 3.2-4.8 4.8l-435.2 172.8h-6.4l-436.8-172.8c-3.2 0-3.2-3.2-4.8-4.8v129.6c-1.6-3.2 1.6 0 3.2 4.8zM68.8 374.4l436.8 172.8h6.4l436.8-172.8 4.8-4.8v-126.4c0-3.2-3.2-4.8-4.8-4.8l-436.8-172.8h-6.4l-436.8 172.8c-3.2 0-4.8 3.2-4.8 4.8v126.4c0 1.6 3.2 4.8 4.8 4.8z m464 19.2s0 3.2 0 0c-4.8 3.2-4.8 3.2 0 0l-160-64s-3.2 0 0-3.2c0 0 0-3.2 3.2-3.2l203.2-22.4h3.2v3.2l-49.6 89.6z m179.2-200l124.8 49.6v6.4l-110.4 46.4-124.8-49.6v-3.2-3.2l110.4-46.4c-1.6 0-1.6 0 0 0z m-348.8-27.2l83.2-14.4-19.2-35.2v-4.8h3.2l72 27.2 83.2-14.4h3.2v3.2l-36.8 32 68.8 27.2s3.2 3.2 0 3.2c0 0 0 3.2-3.2 3.2l-96-4.8-41.6 35.2h-3.2l-19.2-44.8-96-4.8c-1.6-4.8-1.6-4.8 1.6-8-3.2 0-3.2 0 0 0z m-148.8 54.4c19.2-9.6 41.6-12.8 68.8-12.8s54.4 4.8 73.6 12.8c22.4 4.8 33.6 22.4 33.6 32s-9.6 22.4-27.2 27.2-44.8 9.6-68.8 9.6c-27.2 0-56-4.8-73.6-12.8-22.4-4.8-32-22.4-32-32-3.2-9.6 4.8-19.2 25.6-24z"
                        p-id="2625"></path>
                    </svg>
                  </div>
                  <div class="ml-2">Redis版本</div>
                </dt>
                <dd class="lg:mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  6.2.4
                </dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center">
                <dt class="text-sm text-gray-600 flex items-center flex-grow lg:flex-none">
                  <div class="bg-green-600 p-2 rounded text-white">
                    <svg t="1623898416456" class="w-5 h-5 fill-current" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="3437" width="200" height="200">
                      <path
                        d="M843.861333 938.666667H180.138667C127.573333 938.666667 85.333333 896 85.333333 843.861333V180.138667C85.333333 128 127.530667 85.333333 180.138667 85.333333h663.722666C896 85.333333 938.666667 128 938.666667 180.138667v663.722666C938.666667 896 896 938.666667 843.861333 938.666667zM393.472 322.389333H298.666667v379.221334h94.805333V322.389333z m355.584 47.36c0-26.154667-21.248-47.36-47.445333-47.36h-213.333334v379.221334h94.848v-142.208h118.485334A47.36 47.36 0 0 0 749.056 512V369.792z m-165.973333 23.722667h94.848v94.805333h-94.805334V393.472z"
                        p-id="3438"></path>
                    </svg>
                  </div>
                  <div class="ml-2">服务器IP</div>
                </dt>
                <dd class="lg:mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  192.168.50.41
                </dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center">
                <dt class="text-sm text-gray-600 flex items-center flex-grow lg:flex-none">
                  <div class="bg-purple-600 p-2 rounded text-white">
                    <svg t="1607661922912" class="w-5 h-5 fill-current" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="3239" width="48" height="48">
                      <path
                        d="M221.696 405.504c-14.848 36.352-23.552 76.8-23.552 117.248 0 34.304 6.144 68.096 16.896 98.304 19.456-31.744 45.056-68.096 76.8-106.496-4.096-8.704-8.704-19.456-8.704-29.696 0-8.704 2.048-14.848 4.096-21.504-29.184-22.016-50.688-40.96-65.536-57.856zM332.8 778.752c10.752-8.704 19.456-16.896 29.696-23.552 87.552-66.048 166.4-104.448 228.352-125.952 0-4.096-2.048-8.704-2.048-12.8v-6.656c-21.504-6.656-45.056-12.8-66.048-21.504-55.296-19.456-102.4-42.496-142.848-64-10.752 10.752-25.6 16.896-40.448 16.896-8.704 0-14.848-2.048-21.504-4.096-40.448 47.104-68.096 91.648-87.552 125.952 25.6 47.616 59.904 85.504 102.4 115.712z m202.752-221.696c23.552 8.704 47.104 14.848 70.656 21.504 6.144-6.144 12.8-10.752 19.456-12.8-6.656-23.552-14.848-47.104-25.6-70.656-14.848-34.304-31.744-66.048-49.152-93.696-6.144 2.048-10.752 2.048-16.896 2.048-12.8 0-25.6-4.096-36.352-12.8-23.552 14.848-47.104 29.696-72.704 49.152l-31.744 25.6c2.048 6.144 4.096 14.848 4.096 21.504v8.704c37.888 18.432 84.992 41.984 138.24 61.44z m298.496-34.304c0-89.6-38.4-172.544-102.4-228.352-31.744 6.144-80.896 19.456-140.8 44.544v6.144c0 12.8-4.096 23.552-10.752 34.304 19.456 29.696 36.352 64 53.248 102.4 10.752 27.648 21.504 55.296 29.696 80.896 16.896 4.096 31.744 16.896 40.448 34.304 12.8 2.048 25.6 2.048 38.4 2.048 31.744 2.048 61.952 0 85.504 0 2.56-27.136 6.656-50.688 6.656-76.288z m-317.952-232.448c6.144-2.048 10.752-2.048 16.896-2.048 16.896 0 31.744 6.144 42.496 19.456 47.104-21.504 87.552-34.304 119.296-42.496-51.2-34.304-113.152-55.296-179.2-55.296-23.552 0-49.152 2.048-70.656 8.704 19.968 17.92 45.568 41.472 71.168 71.68z m145.408 509.44c2.048-31.744 0-74.752-10.752-128h-4.096c-14.848 0-27.648-4.096-36.352-12.8-59.904 21.504-138.752 57.344-224.256 123.904-6.144 4.096-12.8 10.752-21.504 14.848 45.056 23.552 96.256 36.352 149.504 36.352 53.248 2.048 104.448-10.752 147.456-34.304zM239.104 371.2c14.848 16.896 38.4 40.448 72.704 66.048 8.704-4.096 19.456-8.704 29.696-8.704 10.752 0 21.504 2.048 29.696 8.704l31.744-25.6c25.6-19.456 51.2-36.352 74.752-51.2-2.048-4.096-2.048-8.704-2.048-14.848 0-12.8 4.096-23.552 10.752-34.304-31.744-35.84-59.904-64-82.944-80.896-70.656 25.6-128 76.8-164.352 140.8z m494.592 262.144c-6.144 0-16.896 0-31.744 4.096-4.096 8.704-8.704 14.848-14.848 21.504 8.704 47.104 12.8 87.552 12.8 119.296 51.2-36.352 91.648-85.504 115.2-144.896h-81.408z"
                        fill="#ffffff" p-id="3240"></path>
                      <path
                        d="M661.504 87.552c-8.704-25.6-31.744-45.056-61.952-45.056-34.304 0-64 27.648-64 61.952s27.648 61.952 64 61.952c16.896 0 34.304-6.144 45.056-19.456 159.744 55.296 272.896 202.752 272.896 375.296 0 42.496-6.144 83.456-19.456 121.856l55.296 31.744c16.896-47.104 27.648-100.352 27.648-153.6 0.512-202.24-134.144-374.784-319.488-434.688z m181.248 652.8c-34.304 0-64 27.648-64 61.952 0 6.656 2.048 10.752 2.048 16.896-70.656 61.952-164.352 100.352-266.752 100.352-117.248 0-224.256-51.2-298.496-130.048l-57.344 31.744c85.504 98.304 213.504 159.744 354.304 159.744 119.296 0 230.4-45.056 311.296-119.296 4.096 2.048 8.704 2.048 14.848 2.048 34.304 0 64-27.648 64-61.952s-25.6-61.44-59.904-61.44zM121.856 599.552c-4.096-25.6-8.704-49.152-8.704-76.8 0-189.952 136.704-347.648 317.952-386.048V72.704C213.504 111.104 49.152 298.496 49.152 522.752c0 31.744 4.096 64 10.752 93.696-10.752 10.752-16.896 25.6-16.896 42.496 0 34.304 27.648 61.952 64 61.952 34.304 0 64-27.648 64-61.952-0.512-29.696-21.504-53.248-49.152-59.392z"
                        fill="#ffffff" p-id="3241"></path>
                    </svg>
                  </div>
                  <div class="ml-2">Web服务端</div>
                </dt>
                <dd class="lg:mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  nginx/1.21.1
                </dd>
              </div>
              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center">
                <dt class="text-sm text-gray-600 flex items-center flex-grow lg:flex-none">
                  <div class="bg-green-600 p-2 rounded text-white">
                    <svg t="1610011408252" class="w-5 h-5 fill-current" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="1143" width="48" height="48">
                      <path
                        d="M821.76 479.488c0 0-6.272-206.4-174.4-247.424S398.208 368.192 396.544 373.248C394.88 378.304 386.624 376 386.624 376c-13.44-12.736-72.704-41.984-134.976-4.48-62.208 37.504-39.68 108.736-39.68 108.736S119.744 472.768 72.448 615.168c-47.232 142.528 118.464 182.912 118.464 182.912l278.144 0 0-151.616-55.68 0L408.512 646.464 404.736 646.464l0-0.256c-3.2 0-5.76-2.56-5.76-5.824 0-1.92 1.024-3.584 2.56-4.672l113.984-119.872c1.6-1.792 3.84-3.008 6.464-3.008 2.688 0 5.056 1.344 6.656 3.328l113.152 118.912c0.192 0.128 0.384 0.32 0.576 0.512l1.088 1.152-0.384 0c0.576 1.024 0.96 1.92 0.96 3.136 0 3.584-2.88 6.528-6.528 6.528-0.128 0-0.128-0.128-0.256-0.128l0 0.256L575.936 646.528l0 151.616 252.48 0c0 0 120.384-30.144 131.008-154.432C970.176 519.424 821.76 479.488 821.76 479.488z"
                        p-id="1144" fill="#ffffff"></path>
                    </svg>
                  </div>
                  <div class="ml-2">上传限制</div>
                </dt>
                <dd class="lg:mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  512M
                </dd>
              </div>
              <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center">
                <dt class="text-sm text-gray-600 flex items-center flex-grow lg:flex-none">
                  <div class="bg-red-600 p-2 rounded text-white">
                    <svg t="1610011470374" class="w-5 h-5 fill-current" viewBox="0 0 1029 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="2001" width="48" height="48">
                      <path
                        d="M514.332091 0a508.819876 508.819876 0 1 0 508.819876 508.819876 508.819876 508.819876 0 0 0-508.819876-508.819876z m0 932.836439a424.016563 424.016563 0 1 1 424.016563-424.016563 424.016563 424.016563 0 0 1-424.016563 422.320497z m196.743685-296.811594l-175.542857-101.763975V253.561905a42.401656 42.401656 0 0 0-84.803312 0v296.811594c0 15.688613 19.504762 28.833126 32.225258 36.041408a57.666253 57.666253 0 0 0 19.080746 13.56853L678.426501 705.563561a37.737474 37.737474 0 0 0 53.850104-15.688613 42.401656 42.401656 0 0 0-21.200829-57.666252z"
                        p-id="2002" fill="#ffffff"></path>
                    </svg>
                  </div>
                  <div class="ml-2">脚本超时</div>
                </dt>
                <dd class="lg:mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  30秒
                </dd>
              </div>

              <div class="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex items-center">
                <dt class="text-sm text-gray-600 flex items-center flex-grow lg:flex-none">
                  <div class="bg-gray-700 p-2 rounded text-white">
                    <svg t="1610011525042" class="w-5 h-5 fill-current" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="3640" width="48" height="48">
                      <path
                        d="M719.872 153.6q34.816 0 53.248 9.728t31.744 37.376q5.12 11.264 16.384 34.816t25.6 53.248 29.696 62.976 29.184 62.976 24.576 52.736 14.848 33.28q5.12 11.264 8.704 16.896t6.144 12.288 3.584 15.872 1.024 25.6q0 12.288-0.512 37.888t-0.512 54.272l0 57.344 0 39.936q0 28.672-16.896 48.64t-48.64 19.968l-786.432 0q-29.696 0-45.056-18.944t-16.384-48.64l0-35.84q0-23.552 0.512-50.176t0.512-53.248l0-43.008q0-17.408 0.512-27.648t2.56-17.92 4.608-15.872 7.68-20.48q3.072-8.192 13.312-31.232t24.576-52.736 31.232-63.488 31.744-64 27.136-53.76l16.384-33.792q13.312-26.624 32.768-35.84t46.08-9.216l430.08 0zM897.024 589.824q0-30.72-28.672-30.72l-724.992 1.024q-17.408 0-26.624 9.728t-9.216 25.088l0 145.408q0 12.288 6.656 20.48t20.992 8.192l729.088 1.024q20.48 0 26.624-9.728t6.144-24.064l0-146.432zM293.888 206.848q-14.336 0-24.064 9.728t-9.728 24.064 9.728 24.064 24.064 9.728 23.552-9.728 9.216-24.064-9.216-24.064-23.552-9.728zM215.04 391.168q-14.336 0-24.064 9.728t-9.728 24.064 9.728 24.064 24.064 9.728 24.064-9.728 9.728-24.064-9.728-24.064-24.064-9.728zM686.08 240.64q0 14.336 9.216 24.064t23.552 9.728 24.064-9.728 9.728-24.064-9.728-24.064-24.064-9.728-23.552 9.728-9.216 24.064zM763.904 424.96q0 14.336 9.728 24.064t24.064 9.728 23.552-9.728 9.216-24.064-9.216-24.064-23.552-9.728-24.064 9.728-9.728 24.064zM233.472 740.352l-30.72 0 0-145.408 30.72 0 0 145.408zM326.656 740.352l-30.72 0 0-145.408 30.72 0 0 145.408zM420.864 740.352l-30.72 0 0-145.408 30.72 0 0 145.408zM514.048 740.352l-30.72 0 0-145.408 30.72 0 0 145.408zM610.304 740.352l-30.72 0 0-145.408 30.72 0 0 145.408zM705.536 740.352l-30.72 0 0-145.408 30.72 0 0 145.408zM795.648 740.352l-30.72 0 0-145.408 30.72 0 0 145.408z"
                        p-id="3641" fill="#ffffff"></path>
                    </svg>
                  </div>
                  <div class="ml-2">剩余空间</div>
                </dt>
                <dd class="lg:mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                  142.03 GB
                </dd>
              </div>
            </dl>
          </div>
        </div>

      </div>
    </div>
  </n-layout>

</template>
<script>
  export default {
    data: function () {
      return {
        filter: {
          views: {
            day: 3
          },
          response: {
            day: 3
          },
          log: {
            day: 3
          },
        },
        table: { "vBind:row-key": "row => row.excel_id", bordered: false },
        columnsTotal: [
          {
            title: '接口',
            key: '',
            'render:rowData, rowIndex': [
              {
                nodeName: 'div',
                class: 'flex gap-2 items-center',
                child: [
                  {
                    nodeName: 'n-tag',
                    size: 'small',
                    type: 'info',
                    child: '{{rowData.method}}'
                  },
                  {
                    nodeName: 'div',
                    child: '{{rowData.desc}}'
                  },
                ]
              },
              {
                nodeName: 'div',
                class: 'text-gray-400',
                child: '{{rowData.name}}'
              },
            ]
          },
          {
            title: '访问量',
            key: 'pv',
            sorter: true
          },
          {
            title: '访客',
            key: 'uv',
            align: 'right',
            sorter: true
          }
        ],
        columnsResponse: [
          {
            title: '响应',
            key: '',
            'render:rowData, rowIndex': [
              {
                nodeName: 'div',
                class: 'flex gap-2 items-center',
                child: [
                  {
                    nodeName: 'n-tag',
                    size: 'small',
                    type: 'info',
                    child: '{{rowData.method}}'
                  },
                  {
                    nodeName: 'div',
                    child: '{{rowData.desc}}'
                  },
                ]
              },
              {
                nodeName: 'div',
                class: 'text-gray-400',
                child: '{{rowData.name}}'
              },
            ]
          },
          {
            title: '最大响应',
            key: 'max',
            sorter: true
          },
          {
            title: '最小响应',
            key: 'min',
            align: 'right',
            sorter: true
          }
        ],
        columnsLog: [
          {
            title: '接口',
            key: '',
            'render:rowData, rowIndex': [
              {
                nodeName: 'div',
                child: '{{rowData.desc}}'
              },
              {
                nodeName: 'div',
                class: 'text-gray-400',
                child: '{{rowData.name}}'
              },
            ]
          },
          {
            title: '类型',
            key: 'method',
          },
          {
            title: '时间',
            align: 'right',
            'render:rowData, rowIndex': [
              {
                nodeName: 'div',
                child: '{{rowData.create_time}}'
              },
              {
                nodeName: 'div',
                class: 'text-gray-400',
                child: '{{rowData.time}}'
              },
            ]
          }
        ]
      }
    },
    methods: {
      optionDay: function (name) {
        return [
          {
            label: '最近3天',
            key: 3
          },
          {
            label: '最近7天',
            key: 7
          },
          {
            label: '最近30天',
            key: 30
          },
        ]
      },
      handleSelect(key, name) {
        this.filter[name].day = key
      }
    },
    render() {

    }
  }
</script>


`