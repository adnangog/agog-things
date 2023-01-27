import React, { useState, UIEvent } from 'react'
import '../styles/table.css'
import Select, { SelectProps } from '../select'
import TextBox, { TextBoxProps } from '../textbox'
import Button from '../button'
import CheckBox, { CheckBoxProps } from '../checkbox'
import Radio, { RadioButtonProps } from '../radio'
import DropDown, { DropDownProps } from '../dropdown'

export default function Table({ columns, data, isStickyHeader, rowSelection, title }: TableProps) {
  const [state, setState] = useState<ITableState>({
    sorted: {
      type: null,
      key: null,
    },
    filter: {
      show: false,
      key: null,
      items: [],
    },
    selected: [],
    selectAll: false,
    countPerPage: 10,
    page: 1,
    scrollTop: 0,
    scrollLeft: 0,
    scrollDirection: null,
    visibleColumns: columns.map((c) => c.key),
    fullSecreen: false,
  })

  const getData = () => {
    const tempData = [...data]
    const { key, type } = state.sorted
    return paginate(key && type ? checkFilter(tempData).sort(arraySort(key, type)) : checkFilter(data))
  }

  const checkFilter = (d: any) => {
    const { items } = state.filter
    return items.length > 0 ? filtering(d) : d
  }

  const filtering = (dataz: any) => {
    let tempData = [...dataz]
    state.filter.items.forEach(
      (item) =>
        (tempData = tempData.filter(
          (e) => e[item.key || 'a'].toString().toLocaleLowerCase().indexOf(item.value.toLocaleLowerCase()) > -1,
        )),
    )
    return tempData
  }

  const paginate = (array: []) => {
    const { page, countPerPage } = state
    return array.slice((page - 1) * countPerPage, page * countPerPage)
  }

  const handleSort = (val: string) => {
    setState((prevState) => {
      return {
        ...state,
        sorted: {
          ...prevState.sorted,
          key: val,
          type:
            prevState.sorted.key === val
              ? !prevState.sorted.type
                ? 'asc'
                : prevState.sorted.type === 'asc'
                ? 'desc'
                : null
              : 'asc',
        },
      }
    })
  }

  const handleFilter = (val: string, e: React.MouseEvent<HTMLOrSVGElement>) => {
    e.stopPropagation()
    setState((prevState) => {
      return {
        ...state,
        filter: {
          ...prevState.filter,
          show: prevState.filter.key !== val,
          key: prevState.filter.key !== val ? val : null,
        },
      }
    })
  }

  const handleFilterItem = (val: any) => {
    setState((prevState) => {
      return { ...state, filter: { ...prevState.filter, key: val } }
    })
  }

  const handleItemDelete = (val: any, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setState((prevState) => {
      return {
        ...state,
        filter: {
          ...prevState.filter,
          key: prevState.filter.key === val ? null : prevState.filter.key,
          items: prevState.filter.items.filter((i) => i.key !== val),
        },
      }
    })
  }

  const ddlPerPage: SelectProps = {
    value: state.countPerPage,
    placeholder: '--Lütfen Seçin--',
    onSelect: (value: number) => {
      setState({ ...state, countPerPage: value })
    },
    items: [
      { label: '5 / page', value: 5 },
      { label: '10 / page', value: 10 },
      { label: '25 / page', value: 25 },
      { label: '50 / page', value: 50 },
      { label: '100 / page', value: 100 },
    ],
    type: 'mini',
    style: { alignSelf: 'flex-end', justifySelf: 'flex-end' },
  }

  const pager = () => {
    const { page, countPerPage } = state
    let visiblePageCount = 5
    const totalPage = Math.round(checkFilter(data).length / countPerPage)
    visiblePageCount = visiblePageCount > totalPage ? totalPage : visiblePageCount
    let startFrom = visiblePageCount > page ? 0 : page - Math.round(visiblePageCount / 2)
    const maxStart = totalPage - visiblePageCount
    startFrom = startFrom > maxStart ? maxStart : startFrom
    return (
      <div className='pager'>
        {startFrom > 0 && (
          <>
            <button className={`pager-item`} onClick={() => setState({ ...state, page: 1 })}>
              1
            </button>
            <button
              className={`pager-item`}
              onClick={() => setState({ ...state, page: page - visiblePageCount > 0 ? page - visiblePageCount : 1 })}
            >
              ...
            </button>
          </>
        )}
        {Array.from({ length: visiblePageCount }, (_, i) => startFrom + i + 1).map((item) => (
          <button
            disabled={item === state.page}
            key={`pager-item${item}`}
            className={item === page ? `pager-item active` : `pager-item`}
            onClick={() => setState({ ...state, page: item })}
          >
            {item}
          </button>
        ))}
        {totalPage + Math.round(visiblePageCount / 2) - 5 > page && (
          <>
            <button
              className={`pager-item`}
              onClick={() =>
                setState({ ...state, page: page + visiblePageCount < totalPage ? page + visiblePageCount : totalPage })
              }
            >
              ...
            </button>
            <button className={`pager-item`} onClick={() => setState({ ...state, page: totalPage })}>
              {totalPage}
            </button>
          </>
        )}
        <Select {...ddlPerPage} />
      </div>
    )
  }

  const txtFilter: TextBoxProps = {
    value:
      state.filter.key && state.filter.items.find((i) => i.key === state.filter.key)
        ? state.filter.items.find((i) => i.key === state.filter.key)?.value
        : '',
    label: 'Filtre değeri',
    placeholder: '...',
    type: 'text',
    style: { flex: 1 },
    onChange: (value) => {
      if (state.filter.key) {
        const title = columns.find((i) => i.key === state.filter.key)?.title
        const sortIndex = columns.findIndex((i) => i.key === state.filter.key)

        if (state.filter.items.find((i) => i.key === state.filter.key)) {
          if (value) {
            setState((prevState) => ({
              ...prevState,
              filter: {
                ...prevState.filter,
                items: [
                  ...prevState.filter.items.filter((i) => i.key !== prevState.filter.key),
                  { key: prevState.filter.key, value, title, sortIndex },
                ],
              },
            }))
          } else {
            setState((prevState) => ({
              ...prevState,
              filter: {
                ...prevState.filter,
                items: [...prevState.filter.items.filter((i) => i.key !== prevState.filter.key)],
              },
            }))
          }
        } else {
          setState((prevState) => ({
            ...prevState,
            filter: {
              ...prevState.filter,
              items: [...prevState.filter.items, { key: prevState.filter.key, value, title, sortIndex }],
            },
          }))
        }
      }
    },
  }

  const ddlFields: SelectProps = {
    value: state.filter.key,
    placeholder: '--Lütfen Seçin--',
    label: 'Filtrelenecek Kolon',
    onSelect: (value: null | number) => {
      setState((prevState) => ({ ...prevState, filter: { ...prevState.filter, key: value } }))
    },
    items: columns.filter((f) => f.isFiltered && !f.render).map((item) => ({ label: item.title, value: item.key })),
    isClear: true,
    style: { width: 200 },
  }

  const selectionRender = (item?: any) => {
    const { selectAll, selected } = state

    const checkProps: CheckBoxProps = {
      items: [{ label: '', value: !item ? 'all' : item.id }],
      onSelect: () => {
        if (item) {
          if (selected.includes(item.id)) {
            rowSelection?.onChange(
              selected.filter((i) => i !== item.id),
              data.filter((i: any) => selected.includes(i.id) && i.id !== item.id),
            )
            setState((prevState) => ({
              ...prevState,
              selectAll: false,
              selected: prevState.selected.filter((i) => i !== item.id),
            }))
          } else {
            rowSelection?.onChange(
              [...selected, item.id],
              data.filter((i: any) => [...selected, item.id].includes(i.id)),
            )
            setState((prevState) => ({ ...prevState, selectAll: false, selected: [...prevState.selected, item.id] }))
          }
        } else {
          if (selectAll) {
            rowSelection?.onChange([], [])
            setState({ ...state, selectAll: false, selected: [] })
          } else {
            rowSelection?.onChange(
              data.map((i: any) => i.id),
              data,
            )
            setState({ ...state, selectAll: true, selected: data.map((i: any) => i.id) })
          }
        }
      },
      value: item ? (selected.includes(item?.id) ? item?.id : null) : selectAll ? 'all' : null,
    }

    const radioProps: RadioButtonProps = {
      items: [{ label: '', value: item?.id }],
      onChange: () => {
        console.log(item.id)
        rowSelection?.onChange(
          [item.id],
          data.filter((i: any) => i.id === item.id),
        )
        setState({ ...state, selectAll: false, selected: [item.id] })
      },
      value: selected.includes(item?.id) ? item?.id : null,
    }

    const Element =
      rowSelection?.selectionType === 'checkbox' ? (
        <CheckBox {...checkProps} />
      ) : item ? (
        <Radio {...radioProps} />
      ) : null
    return Element
  }

  const tableScroll = (e: UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop != state.scrollTop && state.scrollDirection != 'Y') {
      setState({ ...state, scrollTop: e.currentTarget.scrollTop, scrollDirection: 'Y' })
      document.querySelectorAll<HTMLElement>('.sticky').forEach((item) => {
        item.style.zIndex = '2'
      })
      document.querySelectorAll<HTMLElement>('.stickyHeader').forEach((item) => {
        item.style.zIndex = '3'
      })
      document.querySelectorAll<HTMLElement>('.stickyHeader.sticky').forEach((item) => {
        item.style.zIndex = '4'
      })
    }
    let left = 0
    if (e.currentTarget.scrollLeft != state.scrollLeft && state.scrollDirection != 'X') {
      setState({ ...state, scrollLeft: e.currentTarget.scrollLeft, scrollDirection: 'X' })

      document.querySelectorAll<HTMLElement>('.stickyHeader').forEach((item) => {
        item.style.zIndex = '2'
      })
      document.querySelectorAll<HTMLElement>('.sticky').forEach((item, index) => {
        if (
          index %
            ((rowSelection ? 1 : 0) +
              columns.filter((c) => c.isSticky && state.visibleColumns.includes(c.key)).length) ===
          0
        )
          left = 0
        item.style.zIndex = '3'
        item.style.left = left + 'px'
        left += item.offsetWidth
      })
      document.querySelectorAll<HTMLElement>('.stickyHeader.sticky').forEach((item) => {
        item.style.zIndex = '4'
      })
    }
  }

  const cbColumns: CheckBoxProps = {
    value: state.visibleColumns.join(','),
    label: 'Show / Hide',
    onSelect: (value: any) => setState({ ...state, visibleColumns: value ? value.split(',') : [] }),
    items: columns?.map((c) => ({ label: c.title, value: c.key })),
  }

  const handleFullScreen = (condition: boolean) => {
    setState({ ...state, fullSecreen: condition })
  }

  const ddlSettings: DropDownProps = {
    label: (
      <div>
        <svg className='menuIcon' focusable='false' aria-hidden='true' viewBox='0 0 128 512'>
          <path d='M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56zM120 96c0 30.9-25.1 56-56 56S8 126.9 8 96S33.1 40 64 40s56 25.1 56 56z'></path>
        </svg>
      </div>
    ),
  }

  return (
    <div className={state.fullSecreen ? 'agog-table full' : 'agog-table'}>
      <div className={'agog-table-settings'}>
        {title && <h2>{title}</h2>}
        <div className='icons'>
          {!state.fullSecreen ? (
            <svg
              className='fullsecreenIcon'
              onClick={() => handleFullScreen(true)}
              viewBox='64 64 896 896'
              focusable='false'
              data-icon='fullscreen'
              width='1em'
              height='1em'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M290 236.4l43.9-43.9a8.01 8.01 0 00-4.7-13.6L169 160c-5.1-.6-9.5 3.7-8.9 8.9L179 329.1c.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L370 423.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L290 236.4zm352.7 187.3c3.1 3.1 8.2 3.1 11.3 0l133.7-133.6 43.7 43.7a8.01 8.01 0 0013.6-4.7L863.9 169c.6-5.1-3.7-9.5-8.9-8.9L694.8 179c-6.6.8-9.4 8.9-4.7 13.6l43.9 43.9L600.3 370a8.03 8.03 0 000 11.3l42.4 42.4zM845 694.9c-.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L654 600.3a8.03 8.03 0 00-11.3 0l-42.4 42.3a8.03 8.03 0 000 11.3L734 787.6l-43.9 43.9a8.01 8.01 0 004.7 13.6L855 864c5.1.6 9.5-3.7 8.9-8.9L845 694.9zm-463.7-94.6a8.03 8.03 0 00-11.3 0L236.3 733.9l-43.7-43.7a8.01 8.01 0 00-13.6 4.7L160.1 855c-.6 5.1 3.7 9.5 8.9 8.9L329.2 845c6.6-.8 9.4-8.9 4.7-13.6L290 787.6 423.7 654c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.4z'></path>
            </svg>
          ) : (
            <svg
              className='fullsecreenIcon'
              onClick={() => handleFullScreen(false)}
              viewBox='64 64 896 896'
              focusable='false'
              data-icon='fullscreen-exit'
              width='1em'
              height='1em'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M391 240.9c-.8-6.6-8.9-9.4-13.6-4.7l-43.7 43.7L200 146.3a8.03 8.03 0 00-11.3 0l-42.4 42.3a8.03 8.03 0 000 11.3L280 333.6l-43.9 43.9a8.01 8.01 0 004.7 13.6L401 410c5.1.6 9.5-3.7 8.9-8.9L391 240.9zm10.1 373.2L240.8 633c-6.6.8-9.4 8.9-4.7 13.6l43.9 43.9L146.3 824a8.03 8.03 0 000 11.3l42.4 42.3c3.1 3.1 8.2 3.1 11.3 0L333.7 744l43.7 43.7A8.01 8.01 0 00391 783l18.9-160.1c.6-5.1-3.7-9.4-8.8-8.8zm221.8-204.2L783.2 391c6.6-.8 9.4-8.9 4.7-13.6L744 333.6 877.7 200c3.1-3.1 3.1-8.2 0-11.3l-42.4-42.3a8.03 8.03 0 00-11.3 0L690.3 279.9l-43.7-43.7a8.01 8.01 0 00-13.6 4.7L614.1 401c-.6 5.2 3.7 9.5 8.8 8.9zM744 690.4l43.9-43.9a8.01 8.01 0 00-4.7-13.6L623 614c-5.1-.6-9.5 3.7-8.9 8.9L633 783.1c.8 6.6 8.9 9.4 13.6 4.7l43.7-43.7L824 877.7c3.1 3.1 8.2 3.1 11.3 0l42.4-42.3c3.1-3.1 3.1-8.2 0-11.3L744 690.4z'></path>
            </svg>
          )}
          <DropDown {...ddlSettings}>
            <CheckBox {...cbColumns} />
          </DropDown>
        </div>
      </div>
      <div className={state.filter.show ? 'filter-block show' : 'filter-block'}>
        <div className='filter-form-items'>
          <Select {...ddlFields} />
          <TextBox {...txtFilter} />
          <Button
            style={{ height: 50, backgroundColor: 'rgba(0,0,0,.12)', color: '#000', fontWeight: 'bold' }}
            onClick={() => setState({ ...state, filter: { ...state.filter, show: false, key: null } })}
          >
            X
          </Button>
        </div>
        <div className='filter-items'>
          {state.filter.items.sort(compare).map((item, index) => (
            <div key={`filterItem${index}`} className='filter-item' onClick={() => handleFilterItem(item.key)}>
              <div>{item.title}</div>
              <div>{item.value}</div>
              <div className='delete-item' onClick={(e) => handleItemDelete(item.key, e)}>
                <svg focusable='false' aria-hidden='true' viewBox='0 0 24 24'>
                  <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='agog-table-content' onScroll={tableScroll}>
        <table>
          <thead>
            <tr>
              {rowSelection && (
                <th style={{ width: 30 }} className={isStickyHeader ? 'stickyHeader sticky' : 'sticky'}>
                  {selectionRender()}
                </th>
              )}
              {columns
                .filter((c) => state.visibleColumns.includes(c.key))
                .map((th, thIndex) => {
                  const headerClasses = []
                  if (th.isSticky) {
                    headerClasses.push('sticky')
                  }
                  if (isStickyHeader) {
                    headerClasses.push('stickyHeader')
                  }
                  if (th.isSorted) {
                    headerClasses.push('sorting')
                  }
                  if (th.key === state.sorted.key) {
                    headerClasses.push('sorted')
                  }
                  if (state.filter.items.map((i) => i.key).includes(th.key)) {
                    headerClasses.push('filtered')
                  }

                  return (
                    <th
                      onClick={
                        th.isSorted
                          ? () => handleSort(th.key)
                          : () => {
                              return false
                            }
                      }
                      style={{ width: th.width ? th.width : 'auto' }}
                      key={`thCell${thIndex}`}
                      className={headerClasses.join(' ')}
                    >
                      {th.title}
                      {th.isSorted && (
                        <svg
                          focusable='false'
                          aria-hidden='true'
                          className='sorted-icon'
                          style={
                            state.sorted.key === th.key && state.sorted.type === 'asc'
                              ? { transform: 'rotate(360deg)' }
                              : state.sorted.key === th.key && state.sorted.type === 'desc'
                              ? { transform: 'rotate(180deg)' }
                              : { transform: 'rotate(270deg)' }
                          }
                          viewBox='0 0 24 24'
                        >
                          <path d='M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z'></path>
                        </svg>
                      )}
                      {th.isFiltered && (
                        <svg
                          className='filtered-icon'
                          onClick={(e) => handleFilter(th.key, e)}
                          focusable='false'
                          aria-hidden='true'
                          viewBox='0 0 24 24'
                        >
                          <path d='M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z'></path>
                        </svg>
                      )}
                    </th>
                  )
                })}
            </tr>
          </thead>
          <tbody>
            {getData().map((item: any, index: number) => {
              return (
                <tr key={`rows${index}`}>
                  {rowSelection && (
                    <td className='sticky' style={{ width: 30 }}>
                      {selectionRender(item)}
                    </td>
                  )}
                  {columns
                    .filter((c) => state.visibleColumns.includes(c.key))
                    .map((td, tdIndex) => {
                      const left = rowSelection ? 43.64 : 0
                      const tdStyle: React.CSSProperties = td.isSticky
                        ? { position: 'sticky', left }
                        : { position: 'relative' }
                      return (
                        <td className={td.isSticky ? 'sticky' : ''} style={{ ...tdStyle }} key={`tdCell${tdIndex}`}>
                          {td.render ? td.render(item) : item[td.key]}
                        </td>
                      )
                    })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {pager()}
    </div>
  )
}

function arraySort(key: any, order = 'asc') {
  return function innerSort(a: any, b: any) {
    if (!Object.prototype.hasOwnProperty.call(a, key) || !Object.prototype.hasOwnProperty.call(b, key)) {
      return 0
    }
    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key]
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key]

    if (varA > varB) return order === 'desc' ? -1 : 1
    if (varA < varB) return order === 'desc' ? 1 : -1
    return 0
  }
}

function compare(a: any, b: any) {
  if (a.sortIndex < b.sortIndex) {
    return -1
  }
  if (a.sortIndex > b.sortIndex) {
    return 1
  }
  return 0
}

export interface RowSelectionProps {
  onChange(selectedRowKeys: any[], selectedRows: []): void
  getCheckboxProps(record: any): void
  selectionType: 'checkbox' | 'radio'
}

export interface TableProps {
  columns: ColumnProps
  data: any
  rowSelection?: RowSelectionProps
  isStickyHeader?: boolean
  title?: string
}

export type ColumnProps = Array<CellProps>

export interface CellProps {
  title: string
  key: string
  width?: number
  fixed?: 'left' | 'right' | 'top' | 'bottom'
  isFiltered?: boolean
  isSorted?: boolean
  isSticky?: boolean
  render?: (item: any) => JSX.Element
}

interface ITableState {
  sorted: {
    type: null | 'asc' | 'desc'
    key: null | string
  }
  filter: {
    show: boolean
    key: string | number | null
    items: Array<{
      key: string | number | null
      value: any
      sortIndex: any
      title: any
    }>
  }
  countPerPage: number
  page: number
  selected: any[]
  selectAll: boolean
  scrollTop: number
  scrollLeft: number
  scrollDirection: 'Y' | 'X' | null
  visibleColumns: string[]
  fullSecreen: boolean
}
