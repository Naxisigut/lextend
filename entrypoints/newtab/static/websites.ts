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
    desc: 'Github仓库',
    href: 'https://github.com/Naxisigut?tab=repositories'
  },
  {
    title: 'ChatGPT',
    desc: 'ChatGPT',
    href: 'https://chatgpt.com/'
  },
  {
    title: 'Cursor',
    desc: 'Cursor',
    href: 'https://www.cursor.com/settings'
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
  {
    title: 'Regexr',
    desc: '正则表达式测试',
    href: 'https://regexr.com/' 
  },
  {
    title: 'Excalidraw',
    desc: '流程图',
    href: 'https://excalidraw.com/' 
  },
  {
    title: 'Snippet Generator',
    desc: 'vscode代码片段',
    href: 'https://snippet-generator.app/?description=&tabtrigger=&snippet=&mode=vscode' 
  },
  {
    title: 'vscode 快捷键',
    desc: 'vscode 快捷键',
    href: 'https://www.dute.org/vscode-shortcut' 
  },
  {
    title: 'CSS Inspiration',
    desc: '个人博客 chokcoco',
    href: 'https://chokcoco.github.io/CSS-Inspiration/#/' 
  },
  {
    title: '字体编辑',
    desc: 'iconfont字体编辑',
    href: 'https://www.1json.com/front/fonteditor.html' 
  },
]

const FrontEnd: WebsiteItem[] = [
  {
    title: 'UnoCSS',
    desc: 'css框架',
    href: 'http://unocss.cn/config/'
  },
  {
    title: 'UnoCSS Tutorial',
    desc: 'UnoCSS入门',
    href: 'https://tutorial.unocss.dev/1-basics/1-introduction/1-welcome/'
  },
  {
    title: 'Shadcn Vue',
    desc: '无头组件库',
    href: 'https://www.shadcn-vue.com/docs/components/accordion.html'
  },
  {
    title: 'TailWindCSS',
    desc: 'css框架',
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
  {
    title: 'sortablejs',
    desc: '拖拽排序',
    href: 'https://sortablejs.com/'
  },
  {
    title: 'vue-treeselect',
    desc: '树形下拉',
    href: 'https://vue-treeselect.js.org/'
  },
  {
    title: 'rollup.js',
    desc: '构建 打包工具',
    href: 'https://www.rollupjs.com/'
  },
  {
    title: 'mescroll',
    desc: '移动端滚动组件',
    href: 'https://www.mescroll.com/api.html'
  },
  {
    title: 'TS入门教程',
    desc: '电子书',
    href: 'https://ts.xcatliu.com/'
  },
  {
    title: 'Next.js',
    desc: 'React框架',
    href: 'https://nextjs.org/docs'
  },
  {
    title: 'Vitest',
    desc: '测试框架 vue3',
    href: 'https://cn.vitest.dev/guide/'
  },
  {
    title: 'UniBest',
    desc: 'Uniapp框架 vue3',
    href: 'https://codercup.github.io/unibest-docs/base/1-introduction'
  },
  {
    title: 'Ant Design Vue',
    desc: 'Vue组件库',
    href: 'https://2x.antdv.com/components/input-cn' 
  },
  {
    title: 'Flowbite Icon',
    desc: '无头图标库',
    href: 'https://flowbite.com/icons/' 
  },
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


