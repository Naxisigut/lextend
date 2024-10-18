import 'uno.css';
export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
});
