(function ($, owner) {

    owner.load = function () {
        return `
            <div class="flex items-center justify-center py-6">
                <div class="flex items-center space-x-4">
                  <div class="flex-none">
                    <svg class="animate-spin w-6 h-6 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>

                  </div>
                  <div class="flex-grow">
                      <div class="text-base">加载数据中...</div>
                      <div class="text-gray-500">
                        如果长时间未加载，您可以尝试重新加载或刷新
                      </div>
                 </div>
                </div>
            </div>
        `
    }

    owner.empty = function (title, content, reload) {
        return `
            <div class="flex flex-col items-center">
                <div class="w-20 h-20">
                    <svg class="w-full h-full" viewBox="0 0 140 140" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="06.-Design-Variations" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="02-example-products-empty" transform="translate(-776.000000, -284.000000)">
                                <g id="empty-state" transform="translate(290.000000, 164.000000)">
                                    <g id="illustration" transform="translate(486.000000, 120.000000)">
                                        <rect id="illustration-bg" fill="#FFFFFF" opacity="0" x="0" y="0" width="140" height="140"></rect>
                                        <g id="receipt" transform="translate(28.000000, 16.000000)">
                                            <path d="M78,0.979732163 L6,1 L6,61.6706477 C6,62.220134 78,61.9838101 78,61.6706477 L78,0.979732163 Z" id="Path" fill="#D7DBEC"></path>
                                            <polygon id="Path" fill="#336DFF" points="84 9 0 9 0 109 5.5 103 10.5 109 16 103 21 109 26.5 103 31.5 109 37 103 42 109 47.5 103 52.5 109 58 103 63 109 68.5 103 73.5 109 79 103 84 109"></polygon>
                                            <polygon id="Path" fill="#FFFFFF" fill-rule="nonzero" points="21.6465315 28.5275452 24.3534685 31.4724548 15.3588167 39.740266 10.6190485 35.2159419 13.3809515 32.3225197 15.41 34.26"></polygon>
                                            <rect id="Rectangle" fill="#FFFFFF" x="32" y="32" width="38" height="4"></rect>
                                            <polygon id="Path" fill="#FFFFFF" fill-rule="nonzero" points="21.6465315 45.5275452 24.3534685 48.4724548 15.3588167 56.740266 10.6190485 52.2159419 13.3809515 49.3225197 15.41 51.26"></polygon>
                                            <rect id="Rectangle" fill="#FFFFFF" x="32" y="49" width="38" height="4"></rect>
                                            <polygon id="Path" fill="#FFFFFF" fill-rule="nonzero" points="21.6465315 62.5275452 24.3534685 65.4724548 15.3588167 73.740266 10.6190485 69.2159419 13.3809515 66.3225197 15.41 68.26"></polygon>
                                            <rect id="Rectangle" fill="#FFFFFF" x="32" y="66" width="38" height="4"></rect>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <p class="text-lg mb-2 mt-4">${title || '未找到数据'}</p>
                <p class="text-gray-500">
                    ${content || '暂时未找到数据，您可以尝试刷新页面'}
                </p>
                ${reload === false ? '' : `<div class="mt-5">
                    <a href="javascript:location.reload();" class="btn-blue flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" /></svg>
                        <span>刷新页面</span>
                    </a>
                </div>`}
            </div>
        `
    }

    owner.data = function (title, content) {
        return `
            <div class="flex items-center justify-center py-6">
                <div class="flex items-center space-x-4">
                  <div class="flex-none">
                    <svg class="w-10 h-10" viewBox="0 0 1320 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2514" width="16" height="16"><path d="M835.267497 208.791925V13.472746L309.80188 94.309224l397.467399 127.998218z" fill="#6180F1" p-id="2515"></path><path d="M1219.247894 148.200209L835.253241 13.472746v195.319179z" fill="#AFC0FD" p-id="2516"></path><path d="M612.945799 397.4674l-303.158176-107.78197v424.412892l383.994653 114.525472 13.472747-606.302095z" fill="#6180F1" p-id="2517"></path><path d="M707.255023 222.307442l-13.472747 606.302095 525.465618-80.836477v-417.726419l-370.521907 94.309224z" fill="#AFC0FD" p-id="2518"></path><path d="M1219.247894 148.214466l-383.994653 60.634486-127.998218 13.472747 141.470964 202.10545 370.521907-94.309223 101.052726-26.945493z" fill="#E2E3FE" p-id="2519"></path><path d="M707.269279 222.307442L309.80188 94.309224l-74.135747 168.416456 74.135747 26.945493 303.158176 107.78197z" fill="#AFC0FD" p-id="2520"></path><path d="M444.529342 990.311006c0 18.533937 144.778559 33.688994 323.360167 33.688994s323.360167-15.083773 323.360167-33.688994-144.778559-33.688994-323.360167-33.688994-323.360167 15.083773-323.360167 33.688994z" fill="#6180F1" opacity=".5" p-id="2521"></path></svg>
                  </div>
                  <div class="flex-grow">
                      <div class="text-base">${title || '暂无数据'}</div>
                      <div class="text-gray-500">
                        ${content || '暂无添加数据，您可以进行添加操作'}
                      </div>
                 </div>
                </div>
            </div>
        `
    }

}(jQuery, window.page = {}));
