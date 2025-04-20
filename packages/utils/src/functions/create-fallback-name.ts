export function createFallbackName(name: string | null | undefined): string {
  if (!name) return 'N/A'
  const nameParts = name.split(' ')
  if (nameParts.length === 1) {
    return nameParts[0]!.substring(0, 1).toUpperCase()
  }
  const firstName = nameParts[0]!.substring(0, 1).toUpperCase()
  const lastName = nameParts[nameParts.length - 1]!.substring(0, 1).toUpperCase()
  return `${firstName}${lastName}`
}
