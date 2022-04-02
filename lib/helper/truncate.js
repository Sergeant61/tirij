export default truncate = (text, length = 30) => {
  if (!text) {
    return ''
  }

  if (text.length > length)
    text = text.substring(0, length) + '...';

  return text;
}