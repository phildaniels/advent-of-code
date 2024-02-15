use rust_advent_of_code_2022::get_input;

pub fn solve() -> String {
    let input = get_input("inputs/day1.txt");
    let inventories_as_string_chunks = input.split("\n\n");
    let max_calories = inventories_as_string_chunks.map(|string_chunk| {
        string_chunk.to_string().lines().fold(0, |sum, num| sum + num.parse::<i32>().unwrap())
    }).max().unwrap_or(0);
    max_calories.to_string()
}