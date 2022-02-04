import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Form from '@/components/Form'
import FilledForm from '@/components/FilledForm'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }, {
      path: '/form',
      name: 'Form',
      component: Form
    }, {
      path: '/filled_form',
      name: 'FilledForm',
      component: FilledForm
    }
  ]
})
