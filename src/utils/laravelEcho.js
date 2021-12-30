import Echo from 'laravel-echo'
import Pusher from "pusher-js"
import config from '../config/request'

const domain = config.domain.replace('http://', '').replace('https://', '')

const pusherConfig = {
  forceTLS: document.location.protocol === 'https:' ? true : false,
  wsHost: import.meta.env.DEV ? domain : window.location.hostname,
  wssHost: import.meta.env.DEV ? domain : window.location.hostname,
  wsPort: 6001,
  wssPort: 6001,
  disableStats: true,
  encrypted: false
}

export const LaravelEcho = (appConfig) => {
  return new Echo({
    client: new Pusher(appConfig ? appConfig.key : '', pusherConfig),
    broadcaster: 'pusher'
  })
}

export default LaravelEcho