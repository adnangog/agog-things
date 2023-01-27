import React, { useRef, useState } from 'react'
import { useOutsideChecker } from '../../helpers/hooks'
import '../styles/select.css'

export default function Select({
  value,
  label,
  placeholder = '',
  searchPlaceholder = '',
  onSelect: OnSelect,
  infoText,
  items,
  isGroup,
  isClear,
  isMultiple,
  isEtiquette,
  isFilter,
  isTotalDisplay,
  style,
  type,
}: SelectProps): JSX.Element {
  const [keyword, setKeyword] = useState<string>()

  const wrapperRef = useRef(null)

  useOutsideChecker(wrapperRef, ' select-selected')

  const handleClick = (e: any) => {
    e.preventDefault()
    const className = e.currentTarget.className
    if (className.indexOf(' select-selected') > -1) {
      e.currentTarget.className = className.replace(' select-selected', '')
    } else {
      e.currentTarget.className = className + ' select-selected'
    }
  }

  const checkExist = (val: any): boolean | undefined => {
    return value?.toString().split(',').includes(val.toString())
  }

  const onSelect = (val: any, e: any) => {
    if (val === null || isMultiple) {
      e.stopPropagation()
    }

    if (isMultiple && val !== null) {
      const tempArr: string[] | undefined = value?.toString().split(',')
      if (checkExist(val)) {
        OnSelect(Array.isArray(tempArr) && tempArr.length > 1 ? tempArr.filter((i) => i != val).join(',') : null)
      } else {
        OnSelect(Array.isArray(tempArr) ? [...tempArr, val].join(',') : val)
      }
    } else {
      OnSelect(value === val ? null : val)
    }
  }

  const renderOptions = (items: ListItemProps[] | undefined) => {
    if (keyword) {
      return items
        ?.filter((i) => i.label.indexOf(keyword) > -1)
        .map((item, index) => {
          return (
            <li
              key={`ddl-items${index}`}
              onClick={(e) => onSelect(item.value, e)}
              className={checkExist(item.value) ? 'ddlOption selected' : 'ddlOption'}
            >
              {item.label}
            </li>
          )
        })
    } else {
      return items?.map((item, index) => {
        return (
          <li
            key={`ddl-items${index}`}
            onClick={(e) => onSelect(item.value, e)}
            className={checkExist(item.value) ? 'ddlOption selected' : 'ddlOption'}
          >
            {item.label}
          </li>
        )
      })
    }
  }

  const renderItems = (): JSX.Element => {
    if (!isGroup) {
      return <ul>{renderOptions(items)}</ul>
    } else {
      const groups = keyword
        ? [...new Set(items?.filter((i) => i.label.indexOf(keyword) > -1).map((i) => i.group))]
        : [...new Set(items?.map((i) => i.group))]
      return (
        <ul>
          {groups?.map((group, groupIndex) => {
            return (
              <React.Fragment key={`ddl-groups${groupIndex}`}>
                <li className={'ddlGroup'}>{group}</li>
                {renderOptions(items?.filter((i) => i.group === group))}
              </React.Fragment>
            )
          })}
        </ul>
      )
    }
  }

  const text = value ? items?.find((i) => i.value === value)?.label : placeholder
  const longText = !isEtiquette
    ? isTotalDisplay
      ? value?.toString().split(',').length && (
          <div className='etiquette-item'>
            <span>
              <strong>{value?.toString().split(',').length}</strong> selected
            </span>
          </div>
        )
      : value
          ?.toString()
          .split(',')
          .map((val) => items?.find((item) => item.value == val)?.label)
          .join(', ')
    : value
        ?.toString()
        .split(',')
        .map((val, index) => {
          const sItem = items?.find((item) => item.value == val)
          return (
            <div className='etiquette-item' key={`etiquette${index}`}>
              <span>{sItem?.label}</span>
              <svg
                onClick={(e) => onSelect(sItem?.value, e)}
                focusable='false'
                aria-hidden='true'
                viewBox='0 0 24 24'
                data-testid='CancelIcon'
              >
                <path d='M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z'></path>
              </svg>
            </div>
          )
        })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setKeyword(e.target.value)
  }

  const clearFilter = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation()
    setKeyword('')
  }

  const contClass = type === 'mini' ? 'agog-select mini' : 'agog-select'

  return (
    <div className={contClass} ref={wrapperRef} onClick={(e) => handleClick(e)} data-value={value} style={style}>
      {label && <label htmlFor='myTextBox'>{label}</label>}
      <div className='form-element'>
        <div
          className='select-item'
          style={isEtiquette ? { display: 'flex' } : { display: 'block', textAlign: 'left' }}
        >
          {!isMultiple ? text : longText}{' '}
        </div>
        <fieldset aria-hidden='true'>
          {label && (
            <legend>
              <span>{label}</span>
            </legend>
          )}
        </fieldset>
        <div className='item-icon'>
          <svg focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
            <path d='M7 10l5 5 5-5z'></path>
          </svg>
        </div>
        {value && isClear && (
          <div className='delete' onClick={(e) => onSelect(null, e)}>
            <svg focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
              <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'></path>
            </svg>
          </div>
        )}
        <div className='select-dropdown'>
          {isFilter && (
            <div className='search-box'>
              <input
                autoFocus={true}
                id='dllSearch'
                type={'text'}
                value={keyword}
                onChange={handleChange}
                onClick={(e) => e.stopPropagation()}
                placeholder={searchPlaceholder}
              />
              {keyword && (
                <div className='delete' onClick={clearFilter}>
                  <svg focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                    <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'></path>
                  </svg>
                </div>
              )}
            </div>
          )}
          {renderItems()}
        </div>
      </div>
      {infoText && <span className='info-text'>{infoText}</span>}
    </div>
  )
}

export interface SelectProps {
  onSelect(str: any): void
  value?: string | null | number
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  infoText?: string
  items?: ListItemProps[]
  isGroup?: boolean
  isClear?: boolean
  isMultiple?: boolean
  isEtiquette?: boolean
  isFilter?: boolean
  isTotalDisplay?: boolean
  style?: React.CSSProperties
  type?: 'mini' | 'default'
}

export interface ListItemProps {
  value: string | number | null
  label: string
  group?: string | number | null
}
