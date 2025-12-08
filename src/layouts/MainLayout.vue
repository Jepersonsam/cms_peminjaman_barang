<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <Sidebar class="w-80 bg-white text-black" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <Navbar />

      <!-- Page Content -->
      <main class="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
</script>
