import Vue from 'vue'
import VueRouter from 'vue-router'
import { isValidToken } from '@/services/auth.service'

Vue.use(VueRouter)

const Layout = () => import('@/layout/SApp')

const routeOptions = [
  { path: 'equipamento', name: 'equipamento/EquipamentoList', },
  { path: 'equipamento/cadastrar', name: 'equipamento/EquipamentoCreate' },
  { path: 'equipamento/:id', name: 'equipamento/EquipamentoEdit' },
  
  { path: 'contrato', name: 'contrato/ContratoList' },

  { path: 'cliente', name: 'cliente/ClienteList' },
  { path: 'cliente/cadastrar', name: 'cliente/ClienteCreate' },
  { path: 'cliente/:id', name: 'cliente/ClienteEdit' },

  { path: 'item-servico', name: 'item-servico/ItemServicoList' },
  { path: 'item-servico/cadastrar', name: 'item-servico/ItemServicoCreate' },
  { path: 'item-servico/:id', name: 'item-servico/ItemServicoEdit' },

  { path: 'servico', name: 'servico/ServicoList', meta: { authorize: 'change_servico' } },
  { path: 'servico/cadastrar', name: 'servico/ServicoCreate', meta: { authorize: 'change_servico' } },
  { path: 'servico/:id', name: 'servico/ServicoEdit', meta: { authorize: 'change_servico' } },

  { path: 'funcionario', name: 'funcionario/FuncionarioList' },
  { path: 'funcionario/cadastrar', name: 'funcionario/FuncionarioCreate' },
  { path: 'funcionario/:id', name: 'funcionario/FuncionarioEdit' },

  { path: 'veiculo', name: 'veiculo/VeiculoList' },
  { path: 'veiculo/cadastrar', name: 'veiculo/VeiculoCreate' },
  { path: 'veiculo/:id', name: 'veiculo/VeiculoEdit' }, 
]

const routes = routeOptions.map(route => {
  return {
    ...route,
    component: () => import( `@/views/${route.name}`)
  }
})

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () =>
        import('@/views/Login')
    },
    {
      path: '/',
      component: Layout,
      children: routes
    },
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('seligue@accessToken')
  const user = JSON.parse(localStorage.getItem('seligue@user'))
  const { authorize } = to.meta
  if (to.name !== 'Login' && !isValidToken(token)) { next({ name: 'Login' }) }
  else if (user && !user.is_superuser && authorize && !user.roles.includes(authorize)) {
    Vue.$toast.open({
      message: "Você não tem permissão para executar esta ação",
      type: "error",
    })
  }
  else next()
})

export default router