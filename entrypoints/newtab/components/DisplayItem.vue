<template>
  <Card>
    <a :href="item.href" target="_self">
      <CardHeader>
        <CardTitle>{{ item.title }}</CardTitle>
        <CardDescription>{{ item.desc }}</CardDescription>
      </CardHeader>
    </a>
  </Card>
</template>

<script lang="ts" setup>

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>