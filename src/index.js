import main from './main';
import uiControl from './ui_control';
import './style.css';

window.addEventListener('error', function(e) {
  uiControl.showMessage(e.message, { type: 'error' });
});

window.addEventListener('load', function() {
  main.handleStartup(main.init);
});
