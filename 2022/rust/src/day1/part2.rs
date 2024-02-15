use rust_advent_of_code_2022::get_input;

pub fn solve() -> String {
    let input = get_input("inputs/day1.txt");
    let inventories_as_string_chunks = input.split("\n\n");
    let mut inventories: Vec<i32> = inventories_as_string_chunks.map(|string_chunk| {
        string_chunk.to_string().lines().fold(0, |sum, num| sum + num.parse::<i32>().unwrap())
    }).collect();
    inventories.sort_by(|a, b| b.cmp(a));
    let sum_of_top_three = inventories.drain(0..3).fold(0, |sum, inventory| sum + inventory);
    sum_of_top_three.to_string()
}