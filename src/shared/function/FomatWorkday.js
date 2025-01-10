export default function FormatWorkday(item) {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const workdays = item.split("-").filter(day => days.includes(day));
  const result = [];

  let start = workdays[0];
  let end = workdays[0];

  for (let i = 1; i < workdays.length; i++) {
    const currentDay = workdays[i];
    const prevDay = workdays[i - 1];

    // Check if the current day is consecutive to the previous day
    if (days.indexOf(currentDay) === days.indexOf(prevDay) + 1) {
      end = currentDay; // Extend the end day of the range
    } else {
      // If not consecutive, push the range or single day to result
      if (start === end) {
        result.push(start);
      } else {
        result.push(`${start}-${end}`);
      }
      start = currentDay; // Start a new range
      end = currentDay; // Reset end to the current day
    }
  }

  // Push the last range or single day
  if (start === end) {
    result.push(start);
  } else {
    result.push(`${start}-${end}`);
  }

  return result.join(", ");
}
