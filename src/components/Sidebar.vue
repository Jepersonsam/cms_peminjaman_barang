<template>
  <aside class="h-full p-5 flex flex-col bg-gray-100 overflow-y-auto">
    <!-- Logo Section -->
    <div class="mb-8 flex flex-col items-center justify-center px-2 pt-4">
      <img
        src="../assets/inventaris.png"
        alt="Logo"
        class="w-24 h-24 object-contain mb-3 drop-shadow-sm"
      />
      <h1 class="text-xl font-extrabold tracking-wide text-center text-gray-800">Inventaris App</h1>
      <div class="w-16 h-1 bg-indigo-500 rounded-full mt-3"></div>
    </div>

    <!-- Navigation Section -->
    <nav class="space-y-6 flex-1">
      <div v-for="(group, index) in menuGroups" :key="index">
        <h3
          v-if="group.title"
          class="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3"
        >
          {{ group.title }}
        </h3>
        <ul class="space-y-1">
          <li v-for="item in group.items" :key="item.to">
            <!-- Check permission: if item.permission is defined, check it. Otherwise show. -->
            <RouterLink
              v-if="!item.permission || checkPermission(item.permission)"
              :to="item.to"
              class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group font-medium"
              :class="
                isActive(item.to)
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              "
            >
              <component
                :is="item.icon"
                class="w-5 h-5 transition-transform group-hover:scale-110"
                :class="
                  isActive(item.to) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                "
              />
              <span class="text-sm">{{ item.label }}</span>

              <!-- Active Indicator (Optional little dot) -->
              <span
                v-if="isActive(item.to)"
                class="ml-auto w-1.5 h-1.5 bg-white rounded-full"
              ></span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Logout / Footer Area -->
    <div class="mt-auto pt-6 border-t border-gray-200">
      <div
        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-100 shadow-sm"
      >
        <div
          class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"
        >
          <Shield class="w-4 h-4" />
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-700">CMS System</p>
          <p class="text-[10px] text-gray-500">v1.0.0</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Shield,
  KeyRound,
  DoorOpen,
  CalendarDays,
  Tag,
  ScanBarcode,
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()

const isActive = (path) => route.path === path

// Helper to check permission (string or array)
const checkPermission = (perm) => {
  if (Array.isArray(perm)) {
    return perm.some((p) => userStore.permissions.includes(p))
  }
  return userStore.permissions.includes(perm)
}

const menuGroups = computed(() => [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', to: '/', icon: LayoutDashboard, permission: 'view-dashboard' }],
  },
  {
    title: 'Master Data',
    items: [
      { label: 'Manajemen Users', to: '/users', icon: Users, permission: 'manage users' },
      { label: 'Manajemen Role', to: '/roles', icon: Shield, permission: 'manage roles' },
      {
        label: 'Manajemen Permission',
        to: '/permissions',
        icon: KeyRound,
        permission: 'manage permissions',
      },
    ],
  },
  {
    title: 'Inventory & Facilities',
    items: [
      { label: 'Manajemen Item', to: '/items', icon: Package, permission: 'manage items' },
      { label: 'Manajemen Kategori', to: '/categories', icon: Tag, permission: 'manage items' }, // Assuming 'manage items' covers categories too, or adjust if unique perm exists
      { label: 'Manajemen Ruangan', to: '/rooms', icon: DoorOpen, permission: 'manage rooms' },
    ],
  },
  {
    title: 'Transactions',
    items: [
      {
        label: 'Scan Pengembalian',
        to: '/scan-return',
        icon: ScanBarcode,
        permission: 'manage borrowing',
      },
      {
        label: 'Peminjaman Barang',
        to: '/borrowings',
        icon: ClipboardList,
        permission: 'manage borrowing',
      },
      {
        label: 'Peminjaman Ruangan',
        to: '/room-loans',
        icon: ClipboardList,
        permission: 'manage room-loans',
      },
      {
        label: 'Meeting Schedules',
        to: '/meeting-schedules',
        icon: CalendarDays,
        permission: [
          'manage meeting-schedules',
          'manage weekly-room-loans',
          'view-meeting-schedules',
        ],
      },
    ],
  },
])
</script>
