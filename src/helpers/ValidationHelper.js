// Returns valid validation result. Useful for writing custom rule functions.
export function valid() {
  return {isValid: true, reason: null}
}

// Returns invalid validation result with specified reason. Useful for writing
// custom rule functions.
export function invalid(reason) {
  return {isValid: false, reason}
}