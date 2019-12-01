import main from './main';
import './style.css';

window.addEventListener('error', function(e) {
  alert(`Opps! We have an error.\nDetail: ${e.message}`);
});

window.addEventListener('load', function() {
  main.init();
});
