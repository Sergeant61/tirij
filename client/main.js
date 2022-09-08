import { Meteor } from 'meteor/meteor';
import App from '../imports/app/App.svelte';
import './configs';

Meteor.startup(() => {
  const app = new App({
    target: document.getElementById('app')
  });

  let theme = localStorage.getItem('theme'); //kayıtlı temayı oku ('light', 'dark', ya da 'undefined')
  theme = (theme == 'dark') ? 'dark' : 'light'; //kayıtlı tema dark ise light yap, tanımlanmamışsa da light yap
  let themeStyleUrl = `/assets/css/theme-styles/styles-${theme}-theme.css`;
  localStorage.setItem('theme', theme); //local storage a temayı kaydet
  document.querySelector('link#tj-theme').setAttribute('href', themeStyleUrl);
});