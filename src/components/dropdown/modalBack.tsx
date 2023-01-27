import { CSSProperties, EffectCallback, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { useOutsideChecker } from '../../helpers/hooks'

interface IProps {
  children: any
  isBack?: boolean
  style: CSSProperties
  onClose?(): void
}

export default function ModalBack({ children, isBack, style, onClose }: IProps) {
  const el = document.createElement('div')
  el.className = 'blankContainer'

  const wrapperRef = useRef(null)

  const handleClose = () => {
    if (onClose) {
      onClose()
      document.body.classList.remove('popUp')
    }
  }

  useOutsideChecker(wrapperRef, 'blankContainerContent', handleClose)

  if (isBack) {
    const containerBackDiv = document.createElement('div')
    containerBackDiv.className = 'blankContainerBack'

    el.appendChild(containerBackDiv)
  }

  useEffect((): ReturnType<EffectCallback> => {
    document.body.appendChild(el)
    document.body.classList.add('popUp')
    return () => {
      document.body.removeChild(el)
    }
  }, [children])

  return ReactDOM.createPortal(
    <div className='blankContainerContent' style={style} ref={wrapperRef}>
      {children}
    </div>,
    el,
  )
}
