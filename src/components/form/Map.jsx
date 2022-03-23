import { defineComponent } from 'vue'
import { resource } from "../../utils/router";

export default defineComponent({
  props: {
    ak: {
      type: String,
      default: () => window.baiduMapAk || 'diaBBBb4lASIa7p4fgYdFZT2NgYdAsOy'
    },
    value: Object
  },
  data() {
    return {
      loadMap: false,
      selectPointInfo: {}
    }
  },
  async created() {
    if (!this.ak) {
      return console.error('百度地图加载错误 未配置密钥')
    }
    if (!window.BMapGL) {
      this.loadMap = true
      window.BMAP_PROTOCOL = "https"
      window.BMapGL_loadScriptTime = (new Date).getTime()
      await resource.pageLoad({
        script: ['https://api.map.baidu.com/getscript?type=webgl&v=1.0&ak=' + this.ak + '&services=&t=20220224113913'],
        css: ['https://api.map.baidu.com/res/webgl/10/bmap.css']
      }, "form-map-baidump")
    }
    setTimeout(() => {
      this.loadMap = false
      this.map = new BMapGL.Map(this.mapContainer)
      this.map.addEventListener('click', e => {
        this.map.panTo(e.latlng)
      })
      const geoc = new BMapGL.Geocoder()
      const moveend = () => {
        const pt = this.map.getCenter()
        geoc.getLocation(pt, res => {
          this.selectPointInfo = {
            ...res.point,
            ...res.addressComponents,
            address: res.address
          }
        })
        this.$emit('update:value', this.selectPointInfo)
      }
      this.map.addEventListener('moveend', moveend)
      this.map.addEventListener('zoomend', moveend)

      this.map.addControl(new BMapGL.CityListControl()); // 添加城市列表控件

      const location = new BMapGL.LocationControl()
      this.map.addControl(location); // 添加定位
      // 设置中心位置
      if (this.value?.lng && this.value?.lat) {
        this.map.panTo(new BMapGL.Point(+this.value.lng, +this.value.lat))
      } else {
        location.startLocation()
      }
      this.map.enableInertialDragging() // 惯性推拽
      this.map.enableScrollWheelZoom() // 滚轮缩放
      this.map.enableContinuousZoom() // 平滑缩放
      this.map.enablePinchToZoom() // 双指缩放地图
      this.map.enableResizeOnCenter() // 开启图区resize中心点不变
    }, 200)
  },
  methods: {
    search(e) {
      const search = new BMapGL.LocalSearch(this.map, {
        renderOptions: { map: this.map }
      })
      const keyword = e.target?.value || e
      if (!keyword) {
        return
      }
      search.search(keyword)
    }
  },
  render() {
    return <div className="relative flex items-center justify-center h-96 w-full">
      <div ref={ref => this.mapContainer = ref} className="w-full h-full">
      </div>
      {this.loadMap && <a-spin />}
      <div className='absolute z-10'
        style={{ top: '10px', left: '50%', transform: 'translate(-50%, 0)' }}
      >
        <a-input-search
          onPressEnter={this.search}
          onSearch={this.search}
          style={{ width: '320px', backgroundColor: '#fff' }}
          placeholder="位置搜索"
        />
      </div>
      {!!Object.keys(this.selectPointInfo).length && <div
        className='absolute z-10 flex items-center justify-center pl-2 pr-2'
        style={{ bottom: '10px', right: '10px', backgroundColor: '#fff', height: '32px', borderRadius: '3px' }}
      >
        {this.selectPointInfo.province}{this.selectPointInfo.city}{this.selectPointInfo.district}{this.selectPointInfo.street}{this.selectPointInfo.streetNumber}
      </div>}
      <div className='absolute z-10' style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', marginTop: '-15px', color: '#3385FF' }}>
        <icon-location size={36} />
      </div>
    </div>
  }
})