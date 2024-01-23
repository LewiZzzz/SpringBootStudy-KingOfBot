import { createRouter, createWebHistory } from 'vue-router'
import PKIndexView from '@/views/PKIndexView'
import RecordIndexView from '@/views/RecordIndexView'
import UserBotIndexView from '@/views/UserBotIndexView'
import RanklistIndexView from '@/views/RanklistIndexView'
import NotFoundView from '@/views/NotFoundView'

const routes = [
  {
    path: '/pk/',
    name: 'PKIndexView',
    component: PKIndexView,
  },
  {
    path: '/record/',
    name: 'RecordIndexView',
    component: RecordIndexView,
  },
  {
    path: '/bot/',
    name: 'UserBotIndexView', 
    component: UserBotIndexView,
  },
  {
    path: '/ranklist/',
    name: 'RanklistIndexView',
    component: RanklistIndexView,
  },
  {
    path: '/404',
    name: 'NotFoundView',
    component: NotFoundView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
