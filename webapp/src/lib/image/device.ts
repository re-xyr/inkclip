import * as p from '@variegated-coffee/serde-postcard-ts'
import { decode7in8InPlace, encode7in8 } from './pack'

export type DeviceType = p.InferType<typeof deviceTypeSchema>
const deviceTypeSchema = p.enumType('DeviceType', {
  BWRev1: p.unitVariant('BWRev1'),
})

export type Chroma = p.InferType<typeof chromaSchema>
const chromaSchema = p.enumType('Chroma', {
  Black: p.unitVariant('Black'),
})

export type Request = p.InferType<typeof requestSchema>
const requestSchema = p.enumType('Request', {
  GetIdentification: p.unitVariant('GetIdentification'),
  UpdateDisplay: p.unitVariant('UpdateDisplay'),
  SetPattern: p.structVariant('SetPattern', {
    from: p.u32(),
    to: p.u32(),
    chroma: chromaSchema,
    pattern: p.bytes(),
  }),
})

export type Response = p.InferType<typeof responseSchema>
const responseSchema = p.enumType('Response', {
  GetIdentification: p.structVariant('GetIdentification', {
    model: deviceTypeSchema,
    serial: p.string(),
  }),
  UpdateDisplay: p.unitVariant('UpdateDisplay'),
  SetPattern: p.unitVariant('SetPattern'),
})

const MAGIC_NUMBER = [0x7d]

interface RecvOptions {
  timeout?: number
  filter?: (resp: Response) => boolean
}

export class Device {
  constructor(
    private input: MIDIInput,
    private output: MIDIOutput,
  ) {}

  private send(req: Request) {
    const encResult = encode7in8(p.serialize(requestSchema, req))
    const len = 1 + MAGIC_NUMBER.length + encResult.byteLength + 1

    const buf = new Uint8Array(len)
    // SysEx start
    buf[0] = 0xf0
    // Magic number
    for (let ix = 0; ix < MAGIC_NUMBER.length; ix++) buf[1 + ix] = MAGIC_NUMBER[ix]
    // Request body
    for (let ix = 0; ix < encResult.byteLength; ix++)
      buf[1 + MAGIC_NUMBER.length + ix] = encResult[ix]
    // SysEx end
    buf[1 + MAGIC_NUMBER.length + encResult.byteLength] = 0xf7

    this.output.send(buf)
  }

  private recv({ timeout, filter }: RecvOptions): Promise<Response> {
    return new Promise((resolve, reject) => {
      const callback = (e: MIDIMessageEvent) => {
        if (!e.data) return
        if (e.data.length < 2 || e.data[0] !== 0xf0 || e.data[e.data.length - 1] !== 0xf7) return

        const sysexPayload = e.data.slice(1, -1)
        if (sysexPayload.length < MAGIC_NUMBER.length) return
        for (let ix = 0; ix < MAGIC_NUMBER.length; ix++)
          if (sysexPayload[ix] !== MAGIC_NUMBER[ix]) return

        const payload = decode7in8InPlace(sysexPayload.slice(MAGIC_NUMBER.length))
        try {
          const decResult = p.deserialize(responseSchema, payload)
          if (!filter || filter(decResult.value)) resolve(decResult.value)
        } catch (e) {
          reject(e)
        }

        this.input.removeEventListener('midimessage', callback)
      }

      if (timeout != null) setTimeout(() => reject(new Error('recv timed out')), timeout)
      this.input.addEventListener('midimessage', callback)
    })
  }

  request(
    req: Request,
    opts: RecvOptions = { timeout: 100, filter: resp => resp.type === req.type },
  ): Promise<Response> {
    const recv = this.recv(opts)
    this.send(req)
    return recv
  }

  async open() {
    if (this.input.connection !== 'open') await this.input.open()
    if (this.output.connection !== 'open') await this.output.open()
  }
}
