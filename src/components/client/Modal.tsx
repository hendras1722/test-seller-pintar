import React from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

export default function ModalComponent({
  children,
  open,
  onOpenChange,
  title,
}) {
  let _footer, _buttonModal, _description

  React.Children.forEach(children, (child) => {
    if (child.type === ButtonModal) {
      _buttonModal = child
    }

    if (child.type === Description) {
      _description = child
    }

    if (child.type === Footer) {
      _footer = child
    }
  })

  return (
    <div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {_buttonModal}
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-3">{title}</DialogTitle>
            {_description}
          </DialogHeader>
          {_footer}
        </DialogContent>
      </Dialog>
    </div>
  )
}

const ButtonModal = ({ children }) => (
  <DialogTrigger asChild>{children}</DialogTrigger>
)
const Description = ({ children }) => (
  <div className="max-h-[500px] overflow-auto">{children}</div>
)
const Footer = ({ children }) => <DialogFooter>{children}</DialogFooter>

ModalComponent.ButtonModal = ButtonModal
ModalComponent.Footer = Footer
ModalComponent.Description = Description
