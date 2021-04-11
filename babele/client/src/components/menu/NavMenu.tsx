import React, { useState } from 'react'
import MenuBtn from './MenuBtn'
import MenuModal from './MenuModal'

export default function NavMenu() {
  const [isOpen, setOpen] = useState<boolean>(false)

  const open = () => setOpen(true)
  const close = () => setOpen(false)

  const handleOpen = () => {
    open()
  }

  const handleClose = () => {
    close()
  }

  return (
    <nav className="menu">
      <MenuBtn onOpen={handleOpen} onClose={handleClose} open={isOpen} />
      <MenuModal open={isOpen} emitClose={handleClose} />
    </nav>
  )
}
