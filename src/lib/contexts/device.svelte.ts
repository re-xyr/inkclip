import { DEVICE_PID, DEVICE_VID } from '$lib/constants'
import { getContext, setContext } from 'svelte'
import { toast } from 'svelte-sonner'

function isInkclip(dev: HIDDevice) {
  return dev.vendorId == DEVICE_VID && dev.productId == DEVICE_PID
}

export interface DeviceContext {
  device: HIDDevice | null
}

const DeviceContextToken = Symbol('device')

export function getDeviceContext(): DeviceContext {
  return getContext(DeviceContextToken)
}

export function createDeviceContext(): DeviceContext {
  const ctx: DeviceContext = $state({ device: null })

  navigator.hid.getDevices().then(devices => {
    const dev = devices.find(isInkclip)
    if (dev !== undefined) ctx.device = dev
  })

  navigator.hid.addEventListener('connect', e => {
    if (isInkclip(e.device) && ctx.device === null) {
      toast.info('Device connected')
      ctx.device = e.device
    }
  })

  navigator.hid.addEventListener('disconnect', e => {
    if (ctx.device === e.device) {
      toast.info('Device disconnected')
      ctx.device = null
    }
  })

  return setContext(DeviceContextToken, ctx)
}
