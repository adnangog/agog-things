import '../styles/checkbox.css'
import Ripple from '../button/ripple'
export default function CheckBox({
  onSelect,
  value,
  label,
  infoText,
  items,
  direction = 'vertical',
  style,
}: CheckBoxProps) {
  const handleClick = (val: any, e: React.MouseEvent<HTMLDivElement>) => {
    const tempArr: string[] | undefined = value?.toString().split(',')
    if (checkExist(val)) {
      onSelect(Array.isArray(tempArr) && tempArr.length > 1 ? tempArr.filter((i) => i != val).join(',') : null)
    } else {
      onSelect(Array.isArray(tempArr) ? [...tempArr, val].join(',') : val)
    }
    e.stopPropagation()
  }

  const checkExist = (val: any): boolean | undefined => {
    return value?.toString().split(',').includes(val.toString())
  }

  return (
    <div className='agog-checkbox' style={{ ...style, flexDirection: direction === 'horizontal' ? 'row' : 'column' }}>
      {label && <span className='info-text'>{label}</span>}
      {items?.map((item, index) => {
        return (
          <div
            className='agog-checkbox-label'
            key={`checkbox-button-${index}`}
            onClick={(e) => handleClick(item.value, e)}
          >
            <Ripple isRadius>
              <span className={checkExist(item.value) ? 'agog-checkbox-root checked' : 'agog-checkbox-root'}>
                <input
                  name='checkbox-buttons-group'
                  type='checkbox'
                  value={item.value ? item.value : ''}
                  className='agog-checkbox-input'
                />
                <span className='agog-checkbox-icon'>
                  <svg className='agog-checkbox-svg1' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                    <path d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'></path>
                  </svg>
                  <svg className='agog-checkbox-svg2' focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                    <path d='M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'></path>
                  </svg>
                </span>
                <span className='agog-checkbox-checked'></span>
              </span>
            </Ripple>
            {item.label && <span className='agog-checkbox-title'>{item.label}</span>}
          </div>
        )
      })}
      {infoText && <span className='info-text'>{infoText}</span>}
    </div>
  )
}

export interface CheckBoxProps {
  onSelect(str: any): void
  value?: string | null | number
  label?: string
  infoText?: string
  items?: ListItemProps[]
  style?: React.CSSProperties
  direction?: 'vertical' | 'horizontal'
}

export interface ListItemProps {
  value: string | number | null
  label: string
  group?: string | number | null
}
