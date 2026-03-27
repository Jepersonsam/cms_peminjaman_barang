import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import UserList from '../pages/UserList.vue'
import UserForm from '../pages/UserForm.vue'
import MainLayout from '../layouts/MainLayout.vue'
import ItemList from '../pages/ItemList.vue'
import ItemForm from '../pages/ItemForm.vue'
import BorrowingForm from '../pages/BorrowingForm.vue'
import BorrowingList from '../pages/BorrowingList.vue'
import Roles from '../pages/RolesList.vue'
import PermissionsList from '../pages/PermissionsList.vue'
import { useUserStore } from '../stores/UserStore'
import RoomForm from '../pages/RoomForm.vue'
import RoomList from '../pages/RoomList.vue'
import RoomLoanList from '../pages/RoomLoanList.vue'
import RoomLoanForm from '../pages/RoomLoanForm.vue'
import LocationList from '../pages/LocationList.vue'
import LocationForm from '../pages/LocationForm.vue'
import MeetingScheduleList from '../pages/MeetingScheduleList.vue'
import MeetingScheduleForm from '../pages/MeetingScheduleForm.vue'
import CategoryList from '../pages/CategoryList.vue'
import CategoryForm from '../pages/CategoryForm.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Dashboard', component: Dashboard },

      // Users
      {
        path: 'users',
        name: 'UserList',
        component: UserList,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-users',
        },
      },
      { path: 'users/create', name: 'UserCreate', component: UserForm },
      { path: 'users/:id/edit', name: 'UserEdit', component: UserForm, props: true },

      // Items
      {
        path: 'items',
        name: 'ItemList',
        component: ItemList,
        meta: { requiresAuth: true, requiredPermission: 'view-items' },
      },
      { path: 'items/create', name: 'ItemCreate', component: ItemForm },
      { path: 'items/edit/:id', name: 'ItemEdit', component: ItemForm },

      // Categories
      {
        path: '/categories',
        name: 'CategoryList',
        component: CategoryList,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-items',
        },
      },
      {
        path: '/categories/create',
        name: 'CategoryCreate',
        component: CategoryForm,
        meta: {
          requiresAuth: true,
          requiredPermission: 'create-items',
        },
      },
      {
        path: '/categories/:id/edit',
        name: 'CategoryEdit',
        component: CategoryForm,
        props: true,
        meta: {
          requiresAuth: true,
          requiredPermission: 'edit-items',
        },
      },

      // Borrowings
      {
        path: '/borrowings',
        name: 'BorrowingList',
        component: BorrowingList,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-borrowing',
        },
      },
      {
        path: '/borrowings/create',
        name: 'BorrowingCreate',
        component: BorrowingForm,
      },
      {
        path: '/borrowings/:id/edit',
        name: 'BorrowingEdit',
        component: BorrowingForm,
        props: true,
      },

      // Roles & Permissions
      {
        path: '/roles',
        name: 'RolesList',
        component: Roles,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-roles',
        },
      },
      {
        path: '/permissions',
        name: 'Permissions',
        component: PermissionsList,
        meta: {
          requiredPermission: 'view-permissions',
          requiresAuth: true,
        },
      },
      {
        path: '/permissions/create',
        name: 'PermissionCreate',
        component: () => import('../pages/PermissionForm.vue'),
        meta: {
          requiredPermission: 'create-permissions',
          requiresAuth: true,
        },
      },
      {
        path: '/permissions/:id/edit',
        name: 'PermissionEdit',
        component: () => import('../pages/PermissionForm.vue'),
        meta: {
          requiredPermission: 'edit-permissions',
          requiresAuth: true,
        },
      },

      // Rooms
      {
        path: '/rooms',
        name: 'RoomList',
        component: RoomList,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-rooms',
        },
      },
      {
        path: '/rooms/create',
        name: 'RoomCreate',
        component: RoomForm,
        meta: {
          requiresAuth: true,
          requiredPermission: 'create-rooms',
        },
      },
      {
        path: '/rooms/:id/edit',
        name: 'RoomEdit',
        component: RoomForm,
        props: true,
        meta: {
          requiresAuth: true,
          requiredPermission: 'edit-rooms',
        },
      },

      // Room Loans
      {
        path: '/room-loans',
        name: 'RoomLoanList',
        component: RoomLoanList,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-room-loans',
        },
      },
      {
        path: '/room-loans/create',
        name: 'RoomLoanCreate',
        component: RoomLoanForm,
        meta: {
          requiresAuth: true,
          requiredPermission: 'create-room-loans',
        },
      },
      {
        path: '/room-loans/:id/edit',
        name: 'RoomLoanEdit',
        component: RoomLoanForm,
        props: true,
        meta: {
          requiresAuth: true,
          requiredPermission: 'edit-room-loans',
        },
      },
      {
        path: '/meeting-schedules',
        name: 'MeetingScheduleList',
        component: MeetingScheduleList,
        props: true,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-meeting-schedules',
        },
      },
      {
        path: '/meeting-schedules/create',
        name: 'MeetingScheduleCreate',
        component: MeetingScheduleForm,
        meta: {
          props: true,
          requiresAuth: true,
          requiredPermission: 'create-meeting-schedules',
        },
      },
      {
        path: '/meeting-schedules/:id/edit',
        name: 'MeetingScheduleEdit',
        component: MeetingScheduleForm,
        props: true,
        meta: {
          props: true,
          requiresAuth: true,
          requiredPermission: 'edit-meeting-schedules',
        },
      },
      {
        path: '/locations',
        name: 'LocationList',
        component: LocationList,
        meta: {
          requiresAuth: true,
          requiredPermission: 'view-location',
        },
      },
      {
        path: '/locations/create',
        name: 'LocationCreate',
        component: LocationForm,
        meta: {
          requiresAuth: true,
          requiredPermission: 'create-location',
        },
      },
      {
        path: '/locations/:id/edit',
        name: 'LocationEdit',
        component: LocationForm,
        props: true,
        meta: {
          requiresAuth: true,
          requiredPermission: 'edit-location',
        },
      },

      // Unauthorized
      {
        path: '/unauthorized',
        name: 'Unauthorized',
        component: () => import('../pages/Unauthorized.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../pages/ForgotPassword.vue'),
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../pages/ResetPassword.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const guestRoutes = ['Login', 'ForgotPassword', 'ResetPassword']

  if (!guestRoutes.includes(to.name) && !token) {
    return next({ name: 'Login' })
  }

  if (to.name === 'Login' && token) {
    return next({ name: 'Dashboard' })
  }

  // Cek permission kalau route butuh
  const requiredPermission = to.meta.requiredPermission
  if (requiredPermission) {
    const userStore = useUserStore()
    
    // Fallback: Jika butuh 'view-xxx', tapi user punya 'manage xxx', izinkan akses
    const moduleName = requiredPermission.replace('view-', '')
    const hasPermission = userStore.permissions.includes(requiredPermission) || 
                          userStore.permissions.includes(`manage ${moduleName}`)

    if (!hasPermission) {
      alert('Anda tidak memiliki izin untuk mengakses halaman ini.')
      return next({ name: 'Unauthorized' })
    }
  }

  next()
})

export default router
