import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Form from '@/components/Form'
import FilledForm from '@/components/FilledForm'
import DataView from '@/components/DataView'
import LieuForm from '@/components/LieuForm'
import MapForm from '@/components/MapForm'

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
    }, {
      path: '/data_view/:year',
      name: 'DataView',
      component: DataView
    }, {
      path: '/lieu-form',
      name: 'LieuForm',
      component: LieuForm
    }, {
      path: '/mapvisu/:crewid?',
      name: 'MapVisu',
      component: MapForm,
      props: {
        config: {
          show: 'depolls',
          edit: false,
          poly: false,
          tile: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
        }
      }
    }
  ]
})
