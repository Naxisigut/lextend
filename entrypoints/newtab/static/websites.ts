export type WebsiteItem = {
  icon?: string
  title: string
  desc: string
  href: string
}
const General: WebsiteItem[] = [
  {
    title: 'Github',
    desc: 'Github',
    href: 'https://github.com/dashboard'
  },
  {
    title: 'Github Repos',
    desc: 'Github Repos',
    href: 'https://github.com/Naxisigut?tab=repositories'
  },
  {
    title: 'ChatGPT',
    desc: 'ChatGPT',
    href: 'https://chatgpt.com/'
  },
  {
    title: 'Google Translate',
    desc: '谷歌翻译',
    href: 'https://translate.google.com/?hl=zh-cn&sl=auto&tl=zh-CN&op=translate'
  },
  {
    title: 'Starlink',
    desc: '翻墙',
    href: 'https://star.369.cyou/' 
  },
]

const FrontEnd: WebsiteItem[] = [
  {
    title: 'UnoCSS',
    desc: 'UnoCSS官方文档',
    href: 'http://unocss.cn/config/'
  },
  {
    title: 'UnoCSS Tutorial',
    desc: 'UnoCSS入门',
    href: 'https://tutorial.unocss.dev/1-basics/1-introduction/1-welcome/'
  },
  {
    title: 'Shadcn Vue',
    desc: 'Shadcn Vue',
    href: 'https://www.shadcn-vue.com/docs/components/accordion.html'
  },
  {
    title: 'TailWindCSS',
    desc: 'TailWindCSS',
    href: 'https://www.tailwindcss.cn/docs/installation'
  },
  {
    title: 'Vue',
    desc: 'Vue',
    href: 'https://cn.vuejs.org/guide/introduction.html'
  },
  {
    title: 'NPM',
    desc: 'NPM',
    href: 'https://www.npmjs.com/'
  },
  {
    title: 'Lucide',
    desc: '图标库',
    href: 'https://lucide.dev/icons/'
  },
  {
    title: 'Element',
    desc: '组件库',
    href: 'https://element.eleme.cn/#/zh-CN/component/installation'
  },
  {
    title: 'Vaul',
    desc: 'Drawer组件 仿ios',
    href: 'https://vaul.emilkowal.ski/'
  },
  {
    title: 'vue-sonner',
    desc: 'sonner toast组件',
    href: 'https://vue-sonner.vercel.app/'
  },
  {
    title: 'VueUse',
    desc: 'Vue3 hook',
    href: 'https://vueuse.org/guide/'
  },
  // {
  //   title: 'vue-sonner3',
  //   desc: 'sonner toast组件',
  //   href: 'https://vue-sonner.vercel.app/'
  // },
  // {
  //   title: 'vue-sonner4',
  //   desc: 'sonner toast组件',
  //   href: 'https://vue-sonner.vercel.app/'
  // },
  // {
  //   title: 'vue-sonner5',
  //   desc: 'sonner toast组件',
  //   href: 'https://vue-sonner.vercel.app/'
  // },
]

const Resource: WebsiteItem[] = [
  {
    title: '不太灵影视',
    desc: '视频下载',
    href: 'https://www.2bt0.com'
  },
  {
    title: 'CN影院',
    desc: '在线VIP',
    href: 'https://cnys.tv/'
  },
]

const Groups = [ FrontEnd, Resource ]
const Count = Groups.reduce((acc, curr) => acc + curr.length, 0)


export default {
  Data: [
    {
      title: 'General',
      data: General
    },
    {
      title: 'FrontEnd',
      data: FrontEnd
    },
    {
      title: 'Resource',
      data: Resource
    },
  ],
  Count 
}


