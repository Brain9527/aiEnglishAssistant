import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Vocabulary from '../views/Vocabulary.vue';

const router = createRouter({
  history: createWebHistory(),
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
