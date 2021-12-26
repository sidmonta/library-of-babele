import React, { useState } from 'react'
import MenuBtn from './MenuBtn'
import MenuModal from './MenuModal'

export default function NavMenu() {
  const [isOpen, setOpen] = useState<boolean>(false)

  const open = () => setOpen(true)
  const close = () => setOpen(false)

  return (
    <nav className="menu">
      <MenuBtn onOpen={open} onClose={close} open={isOpen} />
      <MenuModal open={isOpen} emitClose={close} />
    </nav>
  )
}
