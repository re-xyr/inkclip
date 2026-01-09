use defmt::{error, warn};

pub struct SysExParser<const N: usize> {
    buf: [u8; N],
    len: usize,
}

impl<const N: usize> SysExParser<N> {
    pub fn new() -> Self {
        SysExParser {
            buf: [0u8; N],
            len: 0,
        }
    }

    pub fn feed(&mut self, packet: &[u8]) -> Option<&mut [u8]> {
        if packet.len() != 4 {
            error!(
                "Got a UDB MIDI packet of length {} != 4; dropping",
                packet.len()
            );
            return None;
        }
        match packet[0] & 0x0f {
            0x04 => self.extend_buf(&packet[1..]),
            0x05 => self.extend_buf_fin(&packet[1..2]),
            0x06 => self.extend_buf_fin(&packet[1..3]),
            0x07 => self.extend_buf_fin(&packet[1..4]),
            _ => self.reset(),
        }
    }

    fn extend_buf(&mut self, data: &[u8]) -> Option<&mut [u8]> {
        let new_len = self.len + data.len();
        if new_len > N {
            warn!("USB MIDI parsing overflowed buffer! Discarding partially parsed payload.");
            self.len = 0;
            return None;
        }

        self.buf[self.len..new_len].copy_from_slice(data);
        self.len = new_len;
        None
    }

    fn extend_buf_fin(&mut self, data: &[u8]) -> Option<&mut [u8]> {
        let new_len = self.len + data.len();
        if new_len > N {
            warn!("USB MIDI parsing overflowed buffer! Discarding partially parsed payload.");
            self.len = 0;
            return None;
        }

        self.buf[self.len..new_len].copy_from_slice(data);
        self.len = new_len;
        let result = &mut self.buf[..self.len];
        self.len = 0;
        Some(result)
    }

    fn reset(&mut self) -> Option<&mut [u8]> {
        self.len = 0;
        None
    }
}

pub struct SysExEncoder<const N: usize> {
    buf: [u8; N],
    len: usize,
}

impl<const N: usize> SysExEncoder<N> {
    pub fn new() -> Self {
        SysExEncoder {
            buf: [0u8; N],
            len: 0,
        }
    }

    fn clear(&mut self) {
        self.len = 0;
    }

    fn feed(&mut self, data: &[u8; 3]) -> bool {
        if self.len + 4 > N {
            error!("Encoding more would overflow the buffer");
            return false;
        }

        self.buf[self.len] = 0x04;
        self.buf[self.len + 1] = data[0];
        self.buf[self.len + 2] = data[1];
        self.buf[self.len + 3] = data[2];
        self.len += 4;
        true
    }

    fn feed_fin(&mut self, n: u8, data: &[u8; 3]) -> Option<&[u8]> {
        if n == 0 || n > 3 {
            error!("Inconsistent number of bytes");
            return None;
        }
        if self.len + 4 > N {
            error!("Encoding more would overflow the buffer");
            return None;
        }

        self.buf[self.len] = 0x04 + n;
        self.buf[self.len + 1] = data[0];
        self.buf[self.len + 2] = data[1];
        self.buf[self.len + 3] = data[2];
        self.len += 4;
        Some(&self.buf[..self.len])
    }

    pub fn encode(&mut self, data: &[u8]) -> Option<&[u8]> {
        self.clear();

        if data.len() == 0 {
            return self.feed_fin(2, &[0xf0, 0xf7, 0x00]);
        }
        if data.len() == 1 {
            return self.feed_fin(3, &[0xf0, data[0], 0xf7]);
        }

        self.feed(&[0xf0, data[0], data[1]]);
        for chunk in data[2..].chunks(3) {
            match chunk.len() {
                3 => {
                    if !self.feed(&[chunk[0], chunk[1], chunk[2]]) {
                        return None;
                    }
                }
                2 => return self.feed_fin(3, &[chunk[0], chunk[1], 0xf7]),
                1 => return self.feed_fin(2, &[chunk[0], 0xf7, 0x00]),
                _ => unreachable!(),
            }
        }
        self.feed_fin(1, &[0xf7, 0x00, 0x00])
    }
}
