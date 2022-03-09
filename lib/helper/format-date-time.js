export default formatDateTime = (date) => {
  if (!date) {
    return '-';
  }

  return moment(date).format('DD/MM/YYYY - HH:mm');
}