import BScroll from 'better-scroll';
      /** 滚动条 */
export function setScroll(doc:any){
    let scroll = new BScroll(doc, {
        scrollbar: {
          fade: false
        },
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        }
      })
}