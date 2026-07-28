/** Shortest signed distance of `index` from `active` on a circular track of `length`. */
export function getRelativeOffset(index: number, active: number, length: number) {
  let diff = index - active;
  const half = length / 2;
  while (diff > half) diff -= length;
  while (diff <= -half) diff += length;
  return diff;
}
