<template>
  <div class="pr-2 pl-2">
    <img :src="image" :alt="title" class="mb-4"/>
    <h6 class="mb-1"><span class="mr-2">{{ order }}.</span>{{ title }}</h6>
    <p class="text-small text-muted mb-0 d-inline-block">{{ text }}: {{ value }}</p>
    <p class="text-small text-muted mb-0 d-inline-block">{{ address }}</p>
  </div>
</template>

<script>

  export default {
    props: ['image', 'order', 'title', 'text', 'value', 'address'],
  }
</script>
