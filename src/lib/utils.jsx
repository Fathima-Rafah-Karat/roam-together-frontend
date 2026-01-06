function clsx(...inputs) {
  return inputs
    .flat(Infinity)
    .filter(Boolean)
    .map((input) => {
      if (typeof input === "string" || typeof input === "number" || typeof input === "bigint") {
        return input;
      }
      if (Array.isArray(input)) {
        return clsx(...input);
      }
      if (typeof input === "object" && input !== null) {
        return Object.keys(input)
          .filter((key) => input[key])
          .join(" ");
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

// Named export
export const cn = clsx;

// Default export (optional)
export default clsx;
