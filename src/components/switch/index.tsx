import '../styles/switch.css'

export default function Switch({ value, onChange }: SwitchProps): JSX.Element {
  const handleClick = () => {
    onChange(!value)
  }

  return (
    <span className='agog-switch'>
      <span className={value ? 'agog-switch-button checked' : 'agog-switch-button'} onMouseDown={handleClick}>
        <input className='agog-switch-input' type='checkbox' aria-label='controlled' />
        <span className='agog-switch-thumb'></span>
        <span className='agog-switch-root'></span>
      </span>
      <span className='agog-switch-track'></span>
    </span>
  )
}

export interface SwitchProps {
  value: boolean
  onChange(val: boolean): void
}
