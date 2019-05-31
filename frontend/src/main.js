import Vue from 'vue'
import {
  Menu,
  MenuItem,
  MenuItemGroup,
  Input,
  Button,
  ButtonGroup,
  Form,
  FormItem,
  Icon,
  Row,
  Col,
  Card,
  Container,
  Header,
  Main,
  Footer,
  Loading,
  Notification,
  Link,
  MessageBox
} from 'element-ui';

import App from './App.vue'

Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Form);
Vue.use(FormItem);

Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Container);
Vue.use(Header);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Link);
Vue.use(Loading.directive);

Vue.prototype.$notify = Notification;
Vue.prototype.$alert = MessageBox.alert;

new Vue({
  el: '#app',
  render: h => h(App)
})
