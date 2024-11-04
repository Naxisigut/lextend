type Website = {
  icon?: string
  title: string
  desc: string
  href: string
}

const FrontEnd: Website[] = [
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
    title: 'Lucide',
    desc: '图标库',
    href: 'https://lucide.dev/icons/'
  },
]

const Resource: Website[] = [
  // {
  //   title: 'UnoCSS',
  //   desc: 'UnoCSS',
  //   href: 'http://unocss.cn/'
  // },
]

const Groups = [ FrontEnd, Resource ]
const Length = Groups.reduce((acc, curr) => acc + curr.length, 0)


export default {
  Data: [
    {
      title: 'FrontEnd',
      data: FrontEnd
    },
    {
      title: 'Resource',
      data: Resource
    },
  ],
  Length 
}


