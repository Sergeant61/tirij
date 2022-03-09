export default LinkExpireType = (value = null) => {
  const types = [
    { value: 'never', text: 'Never' },
    { value: 'count', text: 'Count' },
    { value: 'date', text: 'Date' }
  ]

  if (value) {
    return types.find(v => {
      return value == v.value;
    });
  }

  return types
}