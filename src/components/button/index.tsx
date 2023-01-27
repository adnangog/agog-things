import Ripple from './ripple'
import '../styles/button.css'

export default function Button({ children, style, isRipple = false, onClick }: ButtonProps) {
  const handlerClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const button = (
    <button className='agog-button' style={style} onClick={handlerClick}>
      {children}
    </button>
  )

  if (isRipple) return <Ripple>{button}</Ripple>
  else return button
}

export interface ButtonProps {
  children: JSX.Element | string
  style?: React.CSSProperties
  isRipple?: boolean
  onClick?(e?: any): void
}
