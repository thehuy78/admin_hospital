export const CaculatorPercentfn = (value, total) => {
  if (value > 0) {
    return (value / total) * 100
  }
  return 0;

};