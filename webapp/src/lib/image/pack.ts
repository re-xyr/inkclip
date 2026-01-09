// 7-in-8 encoding (SysEx-style).

/**
 * Decode 7-in-8 data in-place.
 * @param payload Buffer containing 7-in-8 encoded bytes.
 * @returns A subarray view of `payload` containing the decoded bytes.
 */
export function decode7in8InPlace(payload: Uint8Array): Uint8Array {
  let decodedLen = 0
  const groups = Math.ceil(payload.length / 8)

  for (let stride = 0; stride < groups; stride++) {
    const base = 8 * stride
    if (base >= payload.length) break

    // Most significant bits of a 7-in-8 group
    const msbs = payload[base]

    for (let stroll = 1; stroll < 8; stroll++) {
      const inIx = base + stroll
      if (inIx >= payload.length) break

      const low7 = payload[inIx] & 0x7f
      const msb = (msbs << (8 - stroll)) & 0x80
      payload[decodedLen] = (low7 | msb) & 0xff
      decodedLen++
    }
  }

  return payload.subarray(0, decodedLen)
}

/**
 * Encode raw bytes into 7-in-8 form (SysEx-style), allocating the output buffer.
 * Output length is: n + ceil(n/7)
 */
export function encode7in8(payload: Uint8Array): Uint8Array {
  const outLen = payload.length + Math.ceil(payload.length / 7)
  const output = new Uint8Array(outLen)

  let encodedLen = 0
  const groups = Math.ceil(payload.length / 7)

  for (let stride = 0; stride < groups; stride++) {
    const msbsIx = encodedLen
    output[msbsIx] = 0
    encodedLen++

    for (let stroll = 1; stroll < 8; stroll++) {
      const inIx = 7 * stride + (stroll - 1)
      if (inIx >= payload.length) break

      output[msbsIx] |= (payload[inIx] & 0x80) >> (8 - stroll)
      output[encodedLen] = payload[inIx] & 0x7f
      encodedLen++
    }
  }

  return output
}
