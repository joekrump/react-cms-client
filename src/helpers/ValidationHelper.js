export function valid(sanitizedValue) {
  return {isValid: true, reason: null,}
}

export function invalid(reason, sanitizedValue) {
  return {isValid: false, reason: reason, value: sanitizedValue}
}
