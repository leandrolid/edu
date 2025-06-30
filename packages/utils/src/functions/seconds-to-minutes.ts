export function secondsToMinutes(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.ceil(seconds % 60).toString()
  return `${minutes}:${remainingSeconds.padStart(2, '0')}`
}
