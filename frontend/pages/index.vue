<script setup lang="ts">
// Root index redirects to /tasks
definePageMeta({
  middleware: () => {
    return navigateTo('/tasks', { replace: true })
  },
})
</script>
