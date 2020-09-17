export const generateTaskId = () => `T-${Math.floor(10000 + Math.random() * 90000)}`;

export const propsComparison = (prevProps = {}, nextProps = {}) => {
  let isEqual = true;
  Object.keys(prevProps).forEach((key) => {
    const value = prevProps[key];
    const nextValue = nextProps[key];
    switch (typeof value) {
      case 'object':
        isEqual = isEqual && JSON.stringify(value) === JSON.stringify(nextValue);
        break;
      default:
        isEqual = isEqual && value === nextValue;
        break;
    }
  });
  return isEqual;
};
