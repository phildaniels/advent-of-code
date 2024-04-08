
pub mod day1 {
    pub mod part1;
    pub mod part2;
}
pub mod day2 {
    pub mod part1;
    pub mod part2;
}

pub mod day3 {
    pub mod part1;
    pub mod part2;
}

fn main() {
    println!("day1 part 1 {:?}", day1::part1::solve());
    println!("day1 part 2 {:?}", day1::part2::solve());
    println!("day2 part 1 {:?}", day2::part1::solve());
    println!("day2 part 2 {:?}", day2::part2::solve());
    println!("day3 part 1 {:?}", day3::part1::solve());
    println!("day3 part 2 {:?}", day3::part2::solve());
}
