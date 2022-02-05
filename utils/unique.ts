let globalId = 0

export function uniqueId(): number {
  return globalId++
}

export function uniqueTestName(): string {
  return `Test-${uniqueId()}`
}
