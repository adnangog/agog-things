import ModalBack from '../dropdown/modalBack'
import '../styles/loading.css'

export default function Loading({ isShow }: { isShow: boolean }) {
  return isShow ? (
    <ModalBack
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' }}
      isBack={true}
    >
      <div>
        <svg width='50' height='50'>
          <path
            id='loading'
            d='M 25,25 m 0,-20 a 20,20 0 1 1 0,40 a 20,20 0 1 1 0,-40'
            fill='none'
            strokeWidth='2'
            stroke='#666'
          />
        </svg>
      </div>
    </ModalBack>
  ) : null
}
