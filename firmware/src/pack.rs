// 7-in-8 encoding. Each 7 bytes can be encoded into 8 bytes with all-0 MSB's. This is useful
// for sending data over exotic protocols like MIDI SysEx.

// Decode in-place, returning the decoded slice.
pub fn decode_7in8(payload: &mut [u8]) -> &mut [u8] {
    let mut decoded_len = 0;
    for stride in 0..payload.len().div_ceil(8) {
        // Most significant bits of a 7-in-8 group
        let msbs = payload[8 * stride];

        for stroll in 1..8 {
            let in_ix = 8 * stride + stroll;
            if in_ix >= payload.len() {
                break;
            }

            payload[decoded_len] =
                (payload[in_ix] & 0b01111111) | ((msbs << (8 - stroll)) & 0b10000000);
            decoded_len += 1;
        }
    }
    &mut payload[..decoded_len]
}

// Encode into provided output buffer, returning the length of the output, or None if the buffer is too small.
pub fn encode_7in8<'a>(payload: &[u8], output: &'a mut [u8]) -> Option<usize> {
    let mut encoded_len = 0;
    for stride in 0..payload.len().div_ceil(7) {
        let msbs_ix = encoded_len;
        if encoded_len >= output.len() {
            return None;
        }
        output[msbs_ix] = 0;
        encoded_len += 1;

        for stroll in 1..8 {
            let in_ix = 7 * stride + stroll - 1;
            if in_ix >= payload.len() {
                break;
            }

            if encoded_len >= output.len() {
                return None;
            }
            output[msbs_ix] |= (payload[in_ix] & 0b10000000) >> (8 - stroll);
            output[encoded_len] = payload[in_ix] & 0b01111111;
            encoded_len += 1;
        }
    }
    Some(encoded_len)
}
