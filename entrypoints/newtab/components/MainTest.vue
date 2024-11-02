<template>
  <div class="bg-white z-10">
  <h2 class="text-xl font-bold mb-4 ">今日资讯</h2>
  <div class="grid md:grid-cols-2 grid-cols-1 gap-4">
    <div v-for="n in 4" :key="n" class="bg-white p-4 rounded-lg shadow">
      <h3 class="font-medium">资讯标题示例</h3>
      <p class="text-gray-600 mt-2">这里是资讯的简短描述，可以是最新的技术新闻或者其他感兴趣的内容...</p>
    </div>
  </div>

  </div>
</template>
