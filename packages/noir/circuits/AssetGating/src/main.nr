use dep::std;

fn u16_to_u8_2(input: u32) -> [u8; 2] {
    let mut output: [u8; 2] = [0; 2];
    for bit_pos in 0..2 {
        let shift_amount: u32 = 8 * bit_pos as u32;
        output[bit_pos] = ((input >> shift_amount) & 255) as u8;
    }
    output
}

fn construct_claim_payload(subject_eth_address: [u8; 20], subject_balance: u32) -> [u8; 32] {
    let mut packed_bytes: [u8; 22] = [0; 22];
    for i in 0..20 {
        packed_bytes[i] = subject_eth_address[i];
    }
    let balance_bytes = u16_to_u8_2(subject_balance);
    packed_bytes[20] = balance_bytes[0];
    packed_bytes[21] = balance_bytes[1];
    let hash = std::hash::keccak256(packed_bytes, 22);
    hash
}

fn main(required_balance: pub u32, issuer_public_key_x: pub [u8; 32], issuer_public_key_y: pub [u8; 32], subject_eth_address: pub [u8; 20], issuer_signed_message: [u8; 64], subject_balance: u32) {
    assert(required_balance <= subject_balance, "Subject balance does not meet the required threshold.");

    let claim_payload = construct_claim_payload(subject_eth_address, subject_balance);
    let is_verified = std::ecdsa_secp256k1::verify_signature(
        issuer_public_key_x,
        issuer_public_key_y,
        issuer_signed_message,
        claim_payload,
    );
    assert(is_verified, "Signature verification failed.");
}