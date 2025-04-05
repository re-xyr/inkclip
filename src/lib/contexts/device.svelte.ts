import { DEVICE_PID, DEVICE_VID } from '$lib/constants'
import { getContext, onDestroy, setContext } from 'svelte'
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

  function connectIfIdle(e: HIDConnectionEvent) {
    if (!isInkclip(e.device) || ctx.device !== null) return

      toast.info('Device connected')
      ctx.device = e.device
    }

  function disconnectIfSame(e: HIDConnectionEvent) {
    if (ctx.device !== e.device) return

      toast.info('Device disconnected')
      ctx.device = null
    }

  navigator.hid.addEventListener('connect', connectIfIdle)
  navigator.hid.addEventListener('disconnect', disconnectIfSame)

  onDestroy(() => {
    navigator.hid.removeEventListener('connect', connectIfIdle)
    navigator.hid.removeEventListener('disconnect', disconnectIfSame)
  })

  return setContext(DeviceContextToken, ctx)
}
