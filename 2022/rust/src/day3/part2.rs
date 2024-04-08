use std::collections::HashSet;
use rust_advent_of_code_2022::get_input;

pub fn solve() -> String {
    let input = get_input("inputs/day3.txt");
    if input.starts_with("there was an error") {
        return input;
    }

    let lines: Vec<&str> = input.lines().collect();
    let sum = lines
        .chunks(3)
        .filter_map(|chunk| {
            if chunk.len() == 3 {
                let first = &chunk[0];
                let second = &chunk[1];
                let third = &chunk[2];
                get_overlapping_character_among_three_strings(first, second, third)
            } else {
                None
            }
        })
        .map(|character| {
            let priority = convert_char_to_priority(&character);
            println!("character {} priority {}", character, priority);
            priority

        })
        .fold(0, |sum, priority| sum + priority);
    sum.to_string()
}

fn get_overlapping_character_among_three_strings(first: &str, second: &str, third: &str) -> Option<char> {
    let second_chars: HashSet<char> = second.chars().collect();
    let third_chars: HashSet<char> = third.chars().collect();
    for first_string_char in first.chars() {
        if second_chars.contains(&first_string_char) && third_chars.contains(&first_string_char) {
            return Some(first_string_char);
        }
    }

    None
}

fn convert_char_to_priority(character: &char) -> u64 {
    match character {
        'a'..='z' => *character as u64 - ('a' as u64) + 1,
        'A'..='Z' => *character as u64 - ('A' as u64) + 1 + ('z' as u64 - ('a' as u64) + 1),
        _ => 0
    }
}
