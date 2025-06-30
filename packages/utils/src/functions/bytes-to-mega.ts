const numberFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

export function bytesToMegaBytes(value: number) {
  return numberFormatter.format(value / 1024 / 1024)
}
