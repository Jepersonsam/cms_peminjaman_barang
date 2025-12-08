<template>
  <aside class="h-full p-5 flex flex-col bg-gray-100">
    <!-- Logo Section -->
    <div class="mb-6 flex flex-col items-center justify-center px-2">
      <img src="../assets/inventaris.png" alt="Logo" class="w-30 h-30 object-contain mb-4" />
      <h1 class="text-2xl font-bold tracking-wide text-center mb-1">Inventaris App</h1>
      <div class="w-24 h-0.5 bg-gray-800"></div>
    </div>

    <!-- Navigation Section -->
    <nav class="space-y-3 text-l font-bold">
      <RouterLink
        v-if="hasPermission('view-dashboard')"
        to="/"
        class="flex items-center space-x-2 px-4 py-2 rounded transition"
        :class="isActive('/') ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'"
      >
        <LayoutDashboard class="w-5 h-5" />
        <span>Dashboard</span>
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage users')"
        to="/users"
        class="flex items-center space-x-2 px-4 py-2 rounded transition"
        :class="isActive('/users') ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'"
      >
        <Users class="w-5 h-5" />
        <span>Manajemen Users</span>
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage items')"
        to="/items"
        class="flex items-center space-x-2 px-4 py-2 rounded transition"
        :class="isActive('/items') ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'"
      >
        <Package class="w-5 h-5" />
        <span>Manajemen Item</span>
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage items')"
        to="/categories"
        class="flex items-center space-x-2 px-4 py-2 rounded transition"
        :class="isActive('/categories') ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'"
      >
        <Tag class="w-5 h-5" />
        <span>Manajemen Kategori</span>
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage borrowing')"
        to="/borrowings"
        class="flex items-center space-x-2 px-4 py-2 rounded transition"
        :class="isActive('/borrowings') ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'"
      >
        <ClipboardList class="w-5 h-5" />
        <span>Manajemen Peminjaman Barang</span>
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage roles')"
        to="/roles"
        class="flex items-center space-x-2 px-4 py-2 rounded transition"
        :class="isActive('/roles') ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'"
      >
        <Shield class="w-5 h-5" />
        <span>Manajemen Role</span>
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage permissions')"
        to="/permissions"
        class="flex items-center space-x-2 px-4 py-2 rounded transition"
        :class="isActive('/permissions') ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'"
      >
        <KeyRound class="w-5 h-5" />
        <span>Manajemen Permission</span>
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage rooms')"
        to="/rooms"
        class="flex items-center space-x-2 px-4 py-2 rounded transition"
        :class="isActive('/rooms') ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'"
      >
        <DoorOpen class="w-5 h-5" />
        <span>Manajemen Ruangan</span>
      </RouterLink>

      <RouterLink
        v-if="hasPermission('manage room-loans')"
        to="/room-loans"
        class="flex items-center space-x-2 px-4 py-2 rounded transition"
        :class="isActive('/room-loans') ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'"
      >
        <ClipboardList class="w-5 h-5" />
        <span>Manajemen Peminjaman Ruangan</span>
      </RouterLink>

      <RouterLink
        v-if="hasAnyPermission('manage meeting-schedules', 'manage weekly-room-loans', 'view-meeting-schedules')"
        to="/meeting-schedules"
        class="flex items-center space-x-2 px-4 py-2 rounded transition"
        :class="isActive('/meeting-schedules') ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'"
      >
        <CalendarDays class="w-5 h-5" />
        <span>Manajemen Meeting Schedule</span>
      </RouterLink>

      <!-- <RouterLink
        v-if="hasPermission('manage location')"
        to="/locations"
        class="flex items-center space-x-2 px-4 py-2 rounded transition"
        :class="isActive('/locations') ? 'bg-gray-300 text-gray-900' : 'hover:bg-gray-200'"
      >
        <MapPin class="w-5 h-5" />
        <span>Manajemen Lokasi</span>
      </RouterLink> -->
    </nav>
  </aside>
</template>

<script setup>
import { useUserStore } from '@/stores/UserStore'
import {
  LayoutDashboard,
  Users,
  Package,
  ClipboardList,
  Shield,
  KeyRound,
  MapPin,
  DoorOpen,
  CalendarDays,
  Tag
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()

const hasPermission = (perm) => userStore.permissions.includes(perm)
const hasAnyPermission = (...perms) => perms.some(perm => userStore.permissions.includes(perm))
const isActive = (path) => route.path === path
</script>
