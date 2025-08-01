import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { trackPageView } from '@/utils/analytics'
import UserGuideView from '@/views/UserGuideView.vue'
import SecurityGuideView from '@/views/SecurityGuideView.vue'
import DeveloperTeamView from '@/views/DeveloperTeamView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      alias: '/home',
      component: HomeView
    },
    {
      path: '/userGuide',
      name: 'userGuide',
      alias: '/userGuide',
      component: UserGuideView,
    },
    {
      path: '/securityGuide',
      name: 'securityGuide',
      alias: '/securityGuide',
      component: SecurityGuideView,
    },
    {
      path: '/devTeam',
      name: 'devTeam',
      alias: '/devTeam',
      component: DeveloperTeamView,
    },
    {
      path: '/graph-test',
      name: 'graphTest',
      component: () => import('../views/GraphTestView.vue')
    }
  ]
})

// 追蹤每個頁面瀏覽
router.afterEach((to) => {
  // 確保 gtag 已載入
  setTimeout(() => {
    trackPageView(to.fullPath)
  }, 100)
})

export default router
