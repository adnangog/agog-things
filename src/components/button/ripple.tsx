export default function Ripple({ isRadius, children }: ButtonProps) {
  return (
    <div className='ripple-cont' style={isRadius ? { borderRadius: '50%' } : {}} onClick={createRipple}>
      {children}
    </div>
  )
}

export interface ButtonProps {
  children: JSX.Element
  isRadius?: boolean
}

function createRipple(event: any) {
  const button = event.currentTarget

  const circle = document.createElement('span')
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2

  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`
  circle.classList.add('ripple')

  const ripple = button.getElementsByClassName('ripple')[0]

  if (ripple) {
    ripple.remove()
  }

  button.appendChild(circle)
}
