import { defineComponent } from 'vue'
import { resource } from "../../utils/router";
import { distance } from "../../utils/gps";
import location from "../../assets/images/location.png";
import { asyncTimeOut, getOffset } from '../../utils/util';

export default defineComponent({
  props: {
    ak: {
      type: String,
      default: () => window.baiduMapAk || 'diaBBBb4lASIa7p4fgYdFZT2NgYdAsOy'
    },
    value: Object,
    // 模式 select 经纬度选择模式 poi 附近信息选择模式
    model: {
      type: String,
      default: 'select'
    },
    defaultPoiKeyword: {
      type: String,
      default: ''
    },
    // 是否显示poi列表
    poiListShow: Boolean
  },
  data() {
    return {
      loadMap: false,
      selectPointInfo: {},
      // 位置索索结果
      searchLocalResult: [],
      // 位置索索状态
      searchStatus: false,
      // poi信息搜索半径
      poiSearchReadus: 1000,
      // 是否固定poi时候的中心点
      poiFixedCenter: false,
      // poi关键词
      poiKeyword: '',
      // poi搜索结果
      poiList: [],
      poiListSelect: -1,
      // 当前中心点
      poiCenter: {
        lat: 0,
        lng: 0,
      }
    }
  },
  async mounted() {
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

    this.loadMap = false
    this.map = new BMapGL.Map(this.mapContainer)
    const geoc = new BMapGL.Geocoder()

    if (this.model === 'poi') {
      this.poiKeyword = this.defaultPoiKeyword
      const search = this.bdPoiSearch = new BMapGL.LocalSearch(this.map)
      search.disableAutoViewport()
      search.disableFirstResultSelection()
      search.setPageCapacity(100)
      search.setSearchCompleteCallback(e => {
        this.poiList = e._pois.map(item => {
          const d = distance(item.point.lat, item.point.lng, e.center.lat, e.center.lng) | 0
          return {
            ...item,
            distance: d,
            distanceText: d < 1000 ? `${d}m` : `${(d / 1000).toFixed(2)}km`
          }
        }).sort((a, b) => a.distance - b.distance)
        geoc.getLocation(this.poiCenter, res => {
          this.$emit('update:value', {
            ...res.point,
            ...res.addressComponents,
            address: res.address,
            addressPois: res.surroundingPois,
            pois: e._pois
          })
        })
      })
    } else {
      this.map.addEventListener('click', e => {
        this.map.panTo(e.latlng)
      })
    }
    const moveend = () => {
      const pt = this.map.getCenter()
      if (!this.poiFixedCenter && this.model === 'poi') {
        this.poiCenter = pt
      }
      geoc.getLocation(pt, res => {
        this.selectPointInfo = {
          ...res.point,
          ...res.addressComponents,
          address: res.address,
          addressPois: res.surroundingPois
        }
        if (this.model === 'select') {
          this.$emit('update:value', this.selectPointInfo)
        }
      })
    }
    this.map.addEventListener('moveend', moveend)
    this.map.addEventListener('zoomend', moveend)

    this.map.enableInertialDragging() // 惯性推拽
    this.map.enableScrollWheelZoom() // 滚轮缩放
    this.map.enableContinuousZoom() // 平滑缩放
    this.map.enablePinchToZoom() // 双指缩放地图
    this.map.enableResizeOnCenter() // 开启图区resize中心点不变

    const location = new BMapGL.LocationControl()
    this.map.addControl(location); // 添加定位
    // 设置中心位置
    if (this.value?.lng && this.value?.lat) {
      if (this.model === 'poi') {
        this.poiFixedCenter = true
        this.poiCenter = { lng: +this.value.lng, lng: +this.value.lat }
        this.poiList = this.value?.pios || (this.bdPoiSearch.searchNearby(this.poiKeyword, this.poiCenter, this.poiSearchReadus), [])
      }
      // 跳转
      this.map.centerAndZoom(new BMapGL.Point(+this.value.lng, +this.value.lat), 16)
      moveend()
    } else {
      this.map.centerAndZoom(new BMapGL.Point(112.945039, 28.234063), 15)
      moveend()
      await asyncTimeOut(500)
      location.startLocation()
    }
  },
  destroyed() {

  },
  methods: {
    search(e) {
      e.preventDefault?.()
      const keyword = e.target?.value || e
      if (this.model === 'select') {
        if (!keyword) {
          return
        }
        const search = new BMapGL.LocalSearch(this.map, {
          renderOptions: { map: this.map }
        })
        search.search(keyword)
      } else {
        if (!keyword) {
          this.searchLocalResult = []
          return
        }
        const search = new BMapGL.LocalSearch(this.map)
        this.searchStatus = true
        search.setSearchCompleteCallback(e => {
          this.searchLocalResultOriginal = Object.fromEntries(e._pois.map(item => [`${item.title} ${item.address}`, item]))
          this.searchLocalResult = e._pois.map(item => `${item.title} ${item.address}`)
          this.searchStatus = false
        })
        search.search(keyword)
      }
    },
    selectLocalResult(e) {
      const pt = this.searchLocalResultOriginal[e].point
      if (this.poiFixedCenter) {
        this.poiCenter = pt
      }
      this.map.centerAndZoom(pt, 15)
    },
    showPoiCenter() {
      this.poiCenterMarker?.remove()
      this.poiCenterCircle?.remove()
      const point = new BMapGL.Point(this.poiCenter.lng, this.poiCenter.lat)
      if (this.poiFixedCenter) {
        const option = {
          icon: new BMapGL.Icon(location, new BMapGL.Size(48, 48)),
          offset: new BMapGL.Size(0, -24)
        }
        this.poiCenterMarker = new BMapGL.Marker(point, option)
        this.map.addOverlay(this.poiCenterMarker)
      }
      this.poiCenterCircle = new BMapGL.Circle(point, this.poiSearchReadus, { strokeColor: 'blue', strokeWeight: 2, strokeOpacity: 0.5 })
      this.map.addOverlay(this.poiCenterCircle)
    },
    clickPoiListSelect(index) {
      this.poiListSelect = index
    }
  },
  watch: {
    poiCenter(pt) {
      if (this.model === 'poi') {
        this.poiListSelect = -1
        this.bdPoiSearch.searchNearby(this.poiKeyword, pt, this.poiSearchReadus)
        this.showPoiCenter()
      }
    },
    poiFixedCenter(val) {
      if (!val) {
        this.poiCenter = this.map.getCenter()
      }
      this.showPoiCenter()
    },
    poiList(val) {
      this.poiMarkers?.forEach(marker => marker.remove())
      this.poiMarkers = val.map((item, index) => {
        const marker = new BMapGL.Marker(new BMapGL.Point(item.point.lng, item.point.lat))
        this.map.addOverlay(marker)
        marker.addEventListener('click', () => {
          this.poiListSelect = index
          if (this.popListRef) {
            const arcoListContent = this.popListRef.$el.children[0].children[0]
            const current = arcoListContent.children[index]
            this.popListRef.$el.children[0].scrollTo(0, getOffset(current, arcoListContent).top)
          }
        })
        return marker
      })

    },
    poiListSelect(val, old) {
      // 修改选中的marker
      this.poiMarkers[old]?.getLabel()?.remove?.()
      this.poiMarkers[val]?.setLabel(new BMapGL.Label(this.poiList[val].title))
    }
  },
  render() {
    return <>
      <div className="relative flex items-center justify-center h-96 w-full">
        <div ref={ref => this.mapContainer = ref} className="w-full h-full">
        </div>
        {this.loadMap && <div
          className='absolute' style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', marginTop: '-15px', color: '#3385FF' }}
        >
          <a-spin />
        </div>}
        <div className='absolute flex items-center justify-center'
          style={{ top: '10px', left: '10px', right: '10px', zIndex: 5 }}
        >
          {this.model === 'select' ?
            <a-input-search
              onPressEnter={this.search}
              onSearch={this.search}
              style={{ width: '320px', backgroundColor: '#fff' }}
              placeholder="位置搜索"
            /> :
            <>
              <a-space>
                <a-select
                  options={this.searchLocalResult}
                  loading={this.searchStatus}
                  onSearch={this.search}
                  onChange={this.selectLocalResult}
                  allowSearch
                  filterOption={false}
                  showExtraOptions={false}
                  style={{ width: '240px', backgroundColor: '#fff' }}
                  placeholder="输入位置关键字"
                />
                <a-input
                  style={{ width: '100px', backgroundColor: '#fff' }}
                  placeholder="PIO关键词"
                  vModel={[this.poiKeyword, 'model-value']}
                />
                <a-input
                  style={{ width: '100px', backgroundColor: '#fff' }}
                  placeholder="PIO半径"
                  vModel={[this.poiSearchReadus, 'model-value']}
                />
                <div>固定位置</div>
                <a-switch vModel={[this.poiFixedCenter, 'model-value']} />
              </a-space>
            </>
          }
        </div>
        {
          !!Object.keys(this.selectPointInfo).length && <div
            className='absolute flex items-center justify-center pl-2 pr-2'
            style={{ bottom: '10px', right: '10px', backgroundColor: '#fff', height: '32px', borderRadius: '3px' }}
          >
            {this.selectPointInfo.province}{this.selectPointInfo.city}{this.selectPointInfo.district}{this.selectPointInfo.street}{this.selectPointInfo.streetNumber}
          </div>
        }
        {!this.poiFixedCenter && <div className='absolute' style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', marginTop: '-24px', color: '#3385FF' }}>
          <img src={location} />
        </div>}
      </div>
      {this.poiListShow && this.model === 'poi' && <a-list
        maxHeight={400}
        data={this.poiList}
        hoverable
        ref={ref => this.popListRef = ref}
      >
        {{
          item: ({ item, index }) => <a-list-item
            key={item.uid}
            style={{ backgroundColor: index === this.poiListSelect ? 'rgb(242 243 245)' : '#fff' }}
            onClick={this.clickPoiListSelect.bind(this, index)}
          >
            {{
              actions: () => <a className='flex items-center' href={item.detailUrl || '#'} target={!item.detailUrl ? '_self' : '_blank'}>
                <span className='text-xl'>{item.distanceText} </span>
                {item.detailUrl && <icon-right size={26} />}
              </a>,
              default: () => <a-list-item-meta
                title={item.title + (item.phoneNumber ? ` ${item.phoneNumber}` : '')}
                description={item.address}
              >
                {{
                  avatar: () => <a-avatar shape="square">
                    {index + 1}
                  </a-avatar>
                }}
              </a-list-item-meta>
            }}
          </a-list-item>
        }}
      </a-list>}
    </>
  }
})