use usbd_hid::descriptor::generator_prelude::*;

// Watch out the terminology!
// - An "output" report is a report from the host to the device (as the device is the one doing the output);
// - An "input" report is a report from the device to the host (as it is presumably triggered by user input).
#[gen_hid_descriptor(
    (usage_page = VENDOR_DEFINED_END, usage = 0x01, collection = APPLICATION) = {
        (report_id = 0x01, usage = 0x02) = {
            write_pattern = output;
        };
        (report_id = 0x02, usage = 0x03) = {
            serial_number_request = output;
        };
        (report_id = 0x02, usage = 0x03) =  {
            serial_number_response = input;
        };
    }
)]
pub struct HIDReports {
    write_pattern: [u8; 5000],
    serial_number_request: u8,
    serial_number_response: [u8; 16],
}
