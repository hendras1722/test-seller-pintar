import React, { useState, useRef, useEffect } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading, { Level } from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Highlighter,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
} from 'lucide-react'

// Type definitions
interface DropdownItem {
  text: string
  value: string | number
}

interface DropdownProps {
  value: string | number
  items: DropdownItem[]
  onChange: (value: string | number) => void
  orientation?: 'vertical' | 'horizontal'
  renderSelected?: (value: string | number) => React.ReactNode
  renderItem?: (item: DropdownItem) => React.ReactNode
}

interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  uploadImageFn?: (file: File) => Promise<string> | string
}

// Dropdown Component
const Dropdown: React.FC<DropdownProps> = ({
  value,
  items,
  onChange,
  orientation = 'vertical',
  renderSelected,
  renderItem,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedItem = items.find((item) => item.value === value)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-1.5 text-white bg-gray-700 rounded hover:bg-gray-600 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {renderSelected ? renderSelected(value) : selectedItem?.text}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg z-10 min-w-[120px]">
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              className="w-full px-3 py-2 text-left text-white hover:bg-gray-600 text-sm flex items-center gap-2"
              onClick={() => {
                onChange(item.value)
                setIsOpen(false)
              }}
            >
              {renderItem ? renderItem(item) : item.text}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Main Editor Component
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  uploadImageFn,
}) => {
  const [textAlign, setTextAlign] = useState<string>('left')
  const [textLevelSelected, setTextLevelSelected] = useState<
    number | 'paragraph'
  >('paragraph')
  const inputImageRef = useRef<HTMLInputElement>(null)

  const textAlignment: DropdownItem[] = [
    { text: 'Left', value: 'left' },
    { text: 'Center', value: 'center' },
    { text: 'Right', value: 'right' },
    { text: 'Justify', value: 'justify' },
  ]

  const iconAlignment: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    left: AlignLeft,
    right: AlignRight,
    center: AlignCenter,
    justify: AlignJustify,
  }

  const textLevel: DropdownItem[] = [
    { text: 'Paragraph', value: 'paragraph' },
    ...Array.from({ length: 6 }, (_, i) => ({
      text: `Heading ${i + 1}`,
      value: i + 1,
    })),
  ]

  const defaultHeadingClass = 'font-bold'
  const headingClass: Record<Level, string> = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
  }

  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-6',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-6',
          },
        },
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const level = node.attrs.level as Level
          return [
            `h${level}`,
            {
              ...HTMLAttributes,
              class: `${defaultHeadingClass} ${headingClass[level]}`,
            },
            0,
          ]
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Subscript,
      Superscript,
      Highlight,
      Image.configure({
        inline: true,
      }),
    ],
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML())
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Update text level
      if (editor?.isActive('heading')) {
        ;[1, 2, 3, 4, 5, 6].forEach((level) => {
          if (editor.isActive('heading', { level })) {
            setTextLevelSelected(level)
          }
        })
      } else {
        setTextLevelSelected('paragraph')
      }

      // Update text alignment
      textAlignment.forEach((align) => {
        if (editor.isActive({ textAlign: align.value })) {
          setTextAlign(align.value as string)
        }
      })
    },
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none p-4',
        style: 'min-height: 400px',
      },
    },
  })

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  const handleChooseHead = (newValue: string | number) => {
    if (!editor) return

    if (newValue === 'paragraph') {
      editor.chain().focus().setParagraph().run()
    } else {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: Number(newValue) as Level })
        .run()
    }
  }

  const handleChooseAlignment = (newValue: string | number) => {
    if (!editor) return
    editor
      .chain()
      .focus()
      .setTextAlign(newValue as string)
      .run()
  }

  const handleUploadImage = () => {
    if (inputImageRef.current) {
      inputImageRef.current.click()
    }
  }

  const handleChangeImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const allowFiles = ['jpg', 'jpeg', 'png']
    const file = event.target.files?.[0]

    if (file && window.confirm('Are you sure to upload this image?')) {
      const fileType = file.type.toLowerCase()
      const isAllowed = allowFiles.some((type) => fileType.includes(type))

      if (!isAllowed) {
        alert(
          `File type ${file.type} not allowed, only ${allowFiles.join(', ')}`
        )
        return
      }

      try {
        const urlImage = uploadImageFn
          ? await uploadImageFn(file)
          : URL.createObjectURL(file)

        if (urlImage && editor) {
          editor.chain().setImage({ src: urlImage }).run()
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Error uploading image')
      }
    }

    // Reset input value to allow same file selection
    if (event.target) {
      event.target.value = ''
    }
  }

  if (!editor) {
    return <div className="p-4 text-center">Loading editor...</div>
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-300 rounded-t-lg px-3 py-2 flex gap-4 items-center flex-wrap">
        <Dropdown
          value={textLevelSelected}
          items={textLevel}
          onChange={handleChooseHead}
        />

        {/* Text Alignment Dropdown */}
        <Dropdown
          value={textAlign}
          items={textAlignment}
          onChange={handleChooseAlignment}
          orientation="horizontal"
          renderSelected={(value) => {
            const Icon = iconAlignment[value as string]
            return Icon ? <Icon className="w-4 h-4" /> : null
          }}
          renderItem={(item) => {
            const Icon = iconAlignment[item.value as string]
            return Icon ? <Icon className="w-4 h-4" /> : null
          }}
        />

        {/* Formatting Buttons */}
        <button
          type="button"
          className={`editor-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          className={`editor-btn ${
            editor.isActive('italic') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          className={`editor-btn ${
            editor.isActive('subscript') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          title="Subscript"
        >
          <SubscriptIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          className={`editor-btn ${
            editor.isActive('superscript') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          title="Superscript"
        >
          <SuperscriptIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          className={`editor-btn ${
            editor.isActive('strike') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <button
          type="button"
          className={`editor-btn ${
            editor.isActive('underline') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          className={`editor-btn ${
            editor.isActive('highlight') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </button>

        <button
          type="button"
          className={`editor-btn ${
            editor.isActive('bulletList') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          className={`editor-btn ${
            editor.isActive('orderedList') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          className={`editor-btn ${
            editor.isActive('blockquote') ? 'is-active' : ''
          }`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          className="editor-btn"
          onClick={handleUploadImage}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <input
          ref={inputImageRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={handleChangeImage}
        />

        <button
          type="button"
          className="editor-btn"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          className="editor-btn"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="border-4 border-gray-300 rounded-b-lg p-2 bg-white min-h-[400px]">
        <EditorContent editor={editor} />
      </div>

      <style jsx>{`
        .editor-btn {
          @apply text-white bg-transparent border-0 p-1.5 rounded cursor-pointer inline-flex items-center justify-center transition-colors;
        }
        .editor-btn:hover:not(:disabled) {
          @apply bg-gray-700;
        }
        .editor-btn.is-active {
          @apply bg-gray-700;
        }
        .editor-btn:disabled {
          @apply opacity-50 cursor-not-allowed;
        }

        /* Custom prose styles for better editor appearance */
        :global(.ProseMirror) {
          outline: none;
        }

        :global(.ProseMirror h1) {
          @apply text-4xl font-bold mb-4;
        }

        :global(.ProseMirror h2) {
          @apply text-3xl font-bold mb-3;
        }

        :global(.ProseMirror h3) {
          @apply text-2xl font-bold mb-3;
        }

        :global(.ProseMirror h4) {
          @apply text-xl font-bold mb-2;
        }

        :global(.ProseMirror h5) {
          @apply text-lg font-bold mb-2;
        }

        :global(.ProseMirror h6) {
          @apply text-base font-bold mb-2;
        }

        :global(.ProseMirror p) {
          @apply mb-3;
        }

        :global(.ProseMirror ul) {
          @apply list-disc ml-6 mb-3;
        }

        :global(.ProseMirror ol) {
          @apply list-decimal ml-6 mb-3;
        }

        :global(.ProseMirror blockquote) {
          @apply border-l-4 border-gray-300 pl-4 italic my-4;
        }

        :global(.ProseMirror mark) {
          @apply bg-yellow-200;
        }

        :global(.ProseMirror img) {
          @apply max-w-full h-auto rounded;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
