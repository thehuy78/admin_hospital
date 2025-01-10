export const ValidateRegex = (reg, value, name) => {
  const regexPattern = typeof reg === 'string' ? new RegExp(reg) : reg;
  if (!value.match(regexPattern)) {
    return {
      status: false,
      message: name
    };
  } else {
    return {
      status: true,
      message: ""
    };
  }

}