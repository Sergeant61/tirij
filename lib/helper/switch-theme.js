export default function switchTeheme() {
  let theme = localStorage.getItem('theme'); //kayıtlı temayı oku ('light', 'dark', ya da 'undefined')
  theme = (theme == 'light') ? 'dark' : 'light'; //kayıtlı tema dark ise light yap, tanımlanmamışsa da light yap
  let themeStyleUrl = `/assets/css/theme-styles/styles-${theme}-theme.css`;
  localStorage.setItem('theme', theme); //local storage a temayı kaydet
  document.querySelector('link#tj-theme').setAttribute('href', themeStyleUrl);
}