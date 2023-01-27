import Ripple from '../button/ripple'
import '../styles/radio.css'

export default function Radio({ onChange, value, label, infoText, items, style }: RadioButtonProps) {
  return (
    <div className='agog-radio' style={{ ...style }}>
      {label && <span className='info-text'>{label}</span>}
      {items?.map((item, index) => {
        return (
          <label className='agog-radio-label' key={`radio-button-${index}`} onClick={() => onChange(item.value)}>
            <Ripple isRadius>
              <span className={value === item.value ? 'agog-radio-root checked' : 'agog-radio-root'}>
                <input
                  name='radio-buttons-group'
                  type='radio'
                  value={item.value ? item.value : ''}
                  className='agog-radio-input'
                />
                <span className='agog-radio-icon'>
                  <svg className='agog-radio-svg1' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'></path>
                  </svg>
                  <svg className='agog-radio-svg2' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                    <path d='M8.465 8.465C9.37 7.56 10.62 7 12 7C14.76 7 17 9.24 17 12C17 13.38 16.44 14.63 15.535 15.535C14.63 16.44 13.38 17 12 17C9.24 17 7 14.76 7 12C7 10.62 7.56 9.37 8.465 8.465Z'></path>
                  </svg>
                </span>
                <span className='agog-radio-checked'></span>
              </span>
            </Ripple>
            <span className='agog-radio-title'>{item.label}</span>
          </label>
        )
      })}
      {infoText && <span className='info-text'>{infoText}</span>}
    </div>
  )
}

export interface RadioButtonProps {
  onChange(str: any): void
  value?: string | null | number
  label?: string
  infoText?: string
  items?: ListItemProps[]
  style?: React.CSSProperties
}

export interface ListItemProps {
  value: string | number | null
  label: string
  group?: string | number | null
}
