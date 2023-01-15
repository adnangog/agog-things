import { InputHTMLAttributes } from 'react'
import './index.css'
export default function TextBox({
  value,
  label,
  placeholder = '',
  onChange: OnChange,
  onFocus,
  infoText,
  pattern,
  type = 'text',
  style,
  visualType = 'materialOutline',
}: TextBoxProps): JSX.Element {
  const handleChange = (event: any) => {
    const str = event.target.value
    const regexp = new RegExp('/^[0-9]*$/')
    if (pattern && regexp.test(str)) {
      return false
    }

    if (OnChange) OnChange(str)
    return true
  }

  const visualTypes = {
    materialOutline: 'material-outline',
    materialFilled: 'material-filled',
    materialStandard: 'material-standard',
  }

  return (
    <div className={`agog-textbox ${visualTypes[visualType]}`} style={style}>
      <label htmlFor='myTextBox'>{label}</label>
      <div className='form-element'>
        <input
          id='myTextBox'
          type={type}
          value={value}
          onFocus={onFocus}
          onChange={handleChange}
          placeholder={placeholder}
          className='agog-input'
        />
        <fieldset aria-hidden='true'>
          <legend>
            <span>{label}</span>
          </legend>
        </fieldset>
      </div>
      {infoText && <span className='info-text'>{infoText}</span>}
    </div>
  )
}

export interface TextBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange?(value: any): void
  onFocus?(): void
  value?: string
  label?: string
  placeholder?: string
  infoText?: string
  pattern?: string
  type?: 'text' | 'number'
  style?: React.CSSProperties
  visualType?: 'materialOutline' | 'materialFilled' | 'materialStandard'
}
