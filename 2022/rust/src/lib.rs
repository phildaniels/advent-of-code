use std::fs::read_to_string;

pub fn get_input(path: &str) -> String {
    match read_to_string(path) {
        Ok(input) => input,
        Err(e) => format!("there was an error: {}", e),
    }
}