import { useEffect } from 'react'

export function useOutsideChecker(ref: any, classNamez: string, callBack?: any) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        const className = ref.current.className
        if (className.indexOf(classNamez) > -1) {
          ref.current.className = className.replace(classNamez, '')
          // document.removeEventListener("mousedown", handleClickOutside);
          if (callBack) callBack()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref])
}
