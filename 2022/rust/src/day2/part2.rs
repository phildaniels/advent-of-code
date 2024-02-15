use rust_advent_of_code_2022::get_input;

pub fn solve() -> String {
    let input = get_input("inputs/day2.txt");
    let lines = input.lines();
    let sum_of_scores = lines.map(|line| {
        match &*line {
          "A X" => 3,
          "A Y" => 4,
          "A Z" => 8,
          "B X" => 1,
          "B Y" => 5,
          "B Z" => 9,
          "C X" => 2,
          "C Y" => 6,
          "C Z" => 7,
          _ => 0
        }
    }).fold(0, |sum, score| sum + score);
    sum_of_scores.to_string()
}

