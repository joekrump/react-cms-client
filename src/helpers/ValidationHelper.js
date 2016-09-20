// Returns valid validation result. Useful for writing custom rule functions.
export function valid(sanitizedValue) {
  return {isValid: true, reason: null,}
}

// Returns invalid validation result with specified reason. Useful for writing
// custom rule functions.
export function invalid(reason, sanitizedValue) {
  return {isValid: false, reason: reason, value: sanitizedValue}
}