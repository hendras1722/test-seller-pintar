'use client'

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'

export default function AlertModal({ children, open, onOpenChange, title }) {
  let _buttonModal, _description, _cancel, _action

  React.Children.forEach(children, (child) => {
    if (child.type === ButtonModal) {
      _buttonModal = child
    }

    if (child.type === Description) {
      _description = child
    }

    if (child.type === Cancel) {
      _cancel = child
    }

    if (child.type === Action) {
      _action = child
    }
  })

  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        {_buttonModal}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            {_description}
          </AlertDialogHeader>
          <div className="flex justify-end gap-3 item-center">
            {_cancel}
            {_action}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

const ButtonModal = ({ children }) => (
  <AlertDialogTrigger>{children}</AlertDialogTrigger>
)
const Description = ({ children }) => (
  <AlertDialogDescription>{children}</AlertDialogDescription>
)

const Cancel = ({ children, ...props }) => (
  <AlertDialogCancel className={props.className} onClick={props.onClick}>
    {children}
  </AlertDialogCancel>
)
const Action = ({ children, ...props }) => (
  <AlertDialogAction className={props.className} onClick={props.onClick}>
    {children}
  </AlertDialogAction>
)

AlertModal.ButtonModal = ButtonModal
AlertModal.Description = Description
AlertModal.Cancel = Cancel
AlertModal.Action = Action
