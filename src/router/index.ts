import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Vocabulary from '../views/Vocabulary.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/vocabulary',
      name: 'vocabulary',
      component: Vocabulary
    }
  ]
});

export default router;
