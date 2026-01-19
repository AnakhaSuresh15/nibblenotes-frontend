export function capitalizeFirst(str) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

export function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ""))
    .join(" ");
}
