const getPascalCaseFromDot = (str: string): string => {
  return str
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
};

export default getPascalCaseFromDot;
