import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      },
      //种子地址处理
      {
        path:'/addrgen/handleseedfile',
        name:'Handleseedfile',
        component: ()=>import('@/views/addrgen/handleseedfile/index'),
        meta:{title: '种子地址处理'},
        hidden:true
      },
      //地址生成
      {
        path:'/addrgen/record',
        name:'Record',
        component:()=>import('@/views/genedIP/record/index'),
        meta:{title: '地址扩展记录'},
        hidden: true
      },
      //漏洞库
      {
        path:'/vuln/repository',
        name:'Repository',
        component:()=>import('@/views/vuln/repository/index'),
        meta:{title: '漏洞库'},
        hidden: true
      },
      //漏洞扫描
      {
        path:'/vuln/scanvuln',
        name:'Scan',
        component:()=>import('@/views/vuln/scan/index'),
        meta:{title:'漏洞扫描'},
        hidden: true
      },
      //历史记录
      {
        path:'/vuln/history',
        name:'History',
        component:()=>import('@/views/vuln/history/index'),
        meta: {title: '历史记录'},
        hidden: true
      },
      //用户管理
      {
        path:'/system/user',
        name: 'User',
        component:()=>import('@/views/system/user/index'),
        meta:{title: '用户管理'},
        hidden: true
      },
      //角色管理
      {
        path: '/system/role',
        name:'Role',
        component:()=>import('@/views/system/role/index'),
        meta:{title: '角色管理'},
        hidden: true
      },
      //菜单管理
      {
        path: '/system/menu',
        name:'Menu',
        component:()=>import('@/views/system/menu/index'),
        meta:{title: '菜单管理'},
        hidden: true
      },
    ]
  },
  /*自定义的公共路由，扫描漏洞*/
  {
    path: '/scanvuln',
    component: Layout,
    redirect: 'noredirect',
    children: [
      {
        path: '/scanvuln',
        component: () => import('@/views/vuln/scan/index')
      }
    ]
  },
  {
    path: '/addrgen',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'details/:id',
        component: () => import('@/views/addrgen/details/index'),
      },
    ]
  },
  {
    path: '/addrgen',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'format/:id',
        component: () => import('@/views/addrgen/format/index'),
      }
    ]
  },
  {
    path: '/addrgen',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'collect/:id',
        component: () => import('@/views/addrgen/collect/index'),
      }
    ]
  },
  {
    path: '/addrgen',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'detect/:id',
        component: () => import('@/views/addrgen/detect/index'),
      }
    ]
  },
  {
    path: '/addrgen',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'gen/:id/:name',
        component: () => import('@/views/addrgen/gen/index'),
      }
    ]
  },
  {
    path: '/genedIP',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'details/:id/',
        component: () => import('@/views/genedIP/details/index'),
      }
    ]
  },
  {
    path: '/genedIP',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'detect/:id/',
        component: () => import('@/views/genedIP/detect/index'),
      }
    ]
  },
  {
    path: '/vuln',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'singleDetails/:id/',
        component: () => import('@/views/vuln/singleDetails/index'),
      }
    ]
  },
  {
    path: '/vuln',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'cnnvd/:id/',
        component: () => import('@/views/vuln/cnnvd/index'),
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      },

    ]
  },


]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [

  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/system/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/system/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/monitor/job-log',
    component: Layout,
    hidden: true,
    permissions: ['monitor:job:list'],
    children: [
      {
        path: 'index',
        component: () => import('@/views/monitor/job/log'),
        name: 'JobLog',
        meta: { title: '调度日志', activeMenu: '/monitor/job' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
