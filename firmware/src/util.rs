use base64::prelude::*;
use embassy_stm32::uid::uid;

pub fn uid_base64() -> &'static str {
    unsafe { core::str::from_utf8_unchecked(uid_base64_bytes()) }
}

#[allow(static_mut_refs)]
pub fn uid_base64_bytes() -> &'static [u8] {
    static mut UID_BASE64: [u8; 16] = [0; 16];
    static mut LOADED: bool = false;
    critical_section::with(|_| unsafe {
        if !LOADED {
            let uid = uid();
            BASE64_STANDARD.encode_slice(uid, &mut UID_BASE64).unwrap();
            LOADED = true;
        }
    });
    unsafe { &*core::ptr::addr_of!(UID_BASE64) }
}
