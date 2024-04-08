use std::collections::HashSet;
use rust_advent_of_code_2022::get_input;

pub fn solve() -> String {
    let input = get_input("inputs/day3.txt");
    if input.starts_with("there was an error") {
        return input;
    }

    let lines = input.lines();
    let item_ones_and_twos = lines.filter_map(|line| {
        let line_length = line.len();
        let half_way_point = line_length / 2;
        let (item_one, item_two) = line.split_at(half_way_point);
        Some((item_one, item_two))
    });

    let sum = item_ones_and_twos
        .filter_map(|(item_one, item_two)| get_overlapping_character(&item_one, &item_two))
        .map(|character| convert_char_to_priority(&character))
        .fold(0, |sum, priority| sum + priority);
    sum.to_string()
}

fn get_overlapping_character(left: &str, right: &str) -> Option<char> {
    let right_chars: HashSet<char> = right.chars().collect();
    for left_string_char in left.chars() {
        if right_chars.contains(&left_string_char) {
            return Some(left_string_char);
        }
    }

    None
}

fn convert_char_to_priority(character: &char) -> u64 {
    match character {
        'a'..='z' => *character as u64 - ('a' as u64) + 1,
        'A'..='Z' => *character as u64 - ('A' as u64) + 1,
        _ => 0
    }
}
