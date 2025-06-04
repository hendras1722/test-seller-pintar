import React from 'react'
import * as Icons from './Icons'
import ModalComponent from './Modal'

export function LinkModal({
  onChangeUrl,
  url,
  open,
  setOpen,
  onRemoveLink,
  onSaveLink,
  title,
}) {
  return (
    <ModalComponent open={open} onOpenChange={setOpen} title={title}>
      <ModalComponent.Description>
        <input
          className="modal-input"
          autoFocus
          value={url}
          onChange={onChangeUrl}
        />
      </ModalComponent.Description>
      <ModalComponent.Footer>
        <div className="modal-buttons">
          <button
            className="button-remove"
            type="button"
            onClick={onRemoveLink}
          >
            Remove
          </button>
          <button className="button-save" type="button" onClick={onSaveLink}>
            Save
          </button>
        </div>
      </ModalComponent.Footer>
    </ModalComponent>
    // <Modal {...rest}>
    //   <h2 className="modal-title">Edit link</h2>
    //   <button className="modal-close" type="button" onClick={closeModal}>
    //     <Icons.X />
    //   </button>
    // <input
    //   className="modal-input"
    //   autoFocus
    //   value={url}
    //   onChange={onChangeUrl}
    // />
    // <div className="modal-buttons">
    //   <button className="button-remove" type="button" onClick={onRemoveLink}>
    //     Remove
    //   </button>
    //   <button className="button-save" type="button" onClick={onSaveLink}>
    //     Save
    //   </button>
    // </div>
    // </Modal>
  )
}
