export function pad(n) {
  if (n < 10) {
    return `0${n.toString(10)}`;
  } else {
    return n.toString(10);
  }
}

export function padMs(n) {
  if (n < 10) {
    return `00${n.toString(10)}`;
  } else if (n < 100) {
    return `0${n.toString(10)}`;
  } else {
    return n.toString(10);
  }
}
