import React, { useState } from 'react'
import './index.css'
import Select, { SelectProps } from '../select'
import TextBox, { TextBoxProps } from '../textbox'
import Button from '../button'
import CheckBox, { CheckBoxProps } from '../checkbox'
import Radio, { RadioButtonProps } from '../radio'

export default function Table({ columns, data, isStickyHeader, rowSelection }: TableProps) {
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

  return (
    <div className='agog-table'>
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
      <div className='agog-table-content'>
        <table>
          <thead>
            <tr>
              {rowSelection && (
                <th style={{ width: 30 }} className={isStickyHeader ? 'stickyHeader' : ''}>
                  {selectionRender()}
                </th>
              )}
              {columns.map((th, thIndex) => {
                const headerClasses = []
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
                  {rowSelection && <td style={{ width: 10 }}>{selectionRender(item)}</td>}
                  {columns.map((td, tdIndex) => (
                    <td key={`tdCell${tdIndex}`}>{td.render ? td.render(item) : item[td.key]}</td>
                  ))}
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
}
