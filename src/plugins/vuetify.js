import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import pt from 'vuetify/lib/locale/pt';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#263238',
      },
    },
  },
  lang: {
    locales: { pt },
    current: 'pt',
  },
  icons: {
    iconfont: 'md',
  },
});
