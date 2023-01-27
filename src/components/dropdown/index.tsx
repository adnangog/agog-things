import Button, { ButtonProps } from '../../components/button'
import ModalBack from './modalBack'
import '../styles/dropdown.css'
import { useState } from 'react'

export default function DropDown({ label, children }: DropDownProps) {
  const [state, setState] = useState({
    show: false,
    top: 0,
    left: 0,
    width: 0,
  })

  const handleClick = (e: any) => {
    // e.currentTarget.offsetHeight;

    const box = e.currentTarget.getBoundingClientRect()

    const top =
      window.innerHeight - box.bottom > box.top ? box.top + e.currentTarget.offsetHeight : box.top - box.height
    const left = window.innerWidth - box.right > box.left ? box.left : box.right - 137
    const width = e.currentTarget.offsetWidth

    setState({ show: true, top, left, width })
  }

  const btnDropDown: ButtonProps = {
    onClick: handleClick,
    children: label,
  }

  return (
    <>
      {typeof label === 'string' ? (
        <Button {...btnDropDown} />
      ) : (
        <button style={{ outline: 0, border: 0, background: 'none' }} onClick={handleClick}>
          {label}
        </button>
      )}
      {state.show && (
        <ModalBack
          style={{ top: state.top, left: state.left, minWidth: state.width }}
          onClose={() => setState({ ...state, show: false })}
        >
          <div className='agoga-dropdown'>{children}</div>
        </ModalBack>
      )}
    </>
  )
}

export interface DropDownProps {
  label: JSX.Element | string
  children?: any
}
