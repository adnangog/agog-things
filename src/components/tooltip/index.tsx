import '../styles/tooltip.css'
export default function ToolTip({ children, text }: ToolTipProps) {
  const handleMouse = (event: any) => {
    const elm = Array.from(event.currentTarget.children as HTMLCollectionOf<HTMLElement>)
    const target = elm[0]
    const target2 = elm[1]
    target2.style.left = `${target.offsetWidth + 10}px`
    target2.style.top = `${0}px`
  }
  return (
    <span className='agog-tooltip' onMouseOver={(e) => handleMouse(e)}>
      {children}
      <div className='agog-tooltip-root'>{text}</div>
    </span>
  )
}
export interface ToolTipProps {
  children: JSX.Element
  text: string | number
  placement?:
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'rightTop'
    | 'rightMiddle'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottomCenter'
    | 'bottomRight'
    | 'leftTop'
    | 'leftMiddle'
    | 'leftTop'
  color?: string
  zIndex?: number
}
