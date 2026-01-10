use base64::prelude::*;
use embassy_stm32::uid::uid;
use embassy_sync::once_lock::OnceLock;

pub fn uid_base64() -> &'static str {
    unsafe { core::str::from_utf8_unchecked(uid_base64_bytes()) }
}

pub fn uid_base64_bytes() -> &'static [u8; 16] {
    static UID_BASE64: OnceLock<[u8; 16]> = OnceLock::new();
    UID_BASE64.get_or_init(|| {
        let mut b64 = [0u8; 16];
        BASE64_STANDARD
            .encode_slice(uid(), &mut b64)
            .expect("12-byte UID encoded to 16 bytes of base64");
        b64
    })
}
