export function formatToAmPm(time: string): string {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  const period = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours % 12 || 12; // converts 0 → 12

  return `${formattedHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}