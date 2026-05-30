"use client";

// Reference-number input that accepts digits only. Strips any non-digit
// characters as the user types or pastes. (The lookup is also validated
// server-side via isValidRef, so this is a UX guard, not the security boundary.)
export default function RefInput(props) {
  const onlyDigits = (e) => {
    const cleaned = e.currentTarget.value.replace(/\D/g, "");
    if (cleaned !== e.currentTarget.value) e.currentTarget.value = cleaned;
  };
  return <input {...props} onInput={onlyDigits} />;
}
