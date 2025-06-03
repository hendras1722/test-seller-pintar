import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Else, If } from './if'
import ArrayMap from './ArrayMap'
import { cn } from '@/utils/lib'
import MenuDropdownchildren from './MenuDropdownChildren'

interface MenuItem {
  name: string
  href?: string
  icon: () => React.ReactElement
  children?: MenuItem[]
}

interface DropdownItem {
  name: string
  href?: string
  icon: () => React.ReactElement
  children?: MenuItem[]
  id?: string // Tambahkan id
}

interface MenuDropdownProps {
  item: DropdownItem
}

export default function MenuDropdown({ item }: Readonly<MenuDropdownProps>) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownHeight, setDropdownHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const [rotateAngle, setRotateAngle] = useState(0) // Inisialisasi dengan 0
  const [isOpen, setIsOpen] = useState(false) // State lokal untuk dropdown ini

  useEffect(() => {
    if (contentRef.current) {
      setDropdownHeight(contentRef.current.scrollHeight + 15)
    }
  }, [isOpen])

  const toggle = () => {
    setIsOpen(!isOpen)
    setRotateAngle(rotateAngle === 0 ? 180 : 0)
  }

  useEffect(() => {
    setRotateAngle(isOpen ? 180 : 0)
  }, [isOpen])

  return (
    <div>
      <div ref={dropdownRef} className="relative">
        <div
          className={cn(
            isOpen &&
              'bg-gray-100 border-l-4 border-gray-400 dark:bg-transparent dark:border-transparent',
            'flex w-full h-full items-center gap-3 justify-between py-3 px-5 cursor-pointer transition-all duration-200  my-2',
            'hover:bg-gray-100 hover:border-l-4 hover:border-gray-400 hover:dark:bg-transparent hover:dark:border-none hover:dark:border-transparent'
          )}
          onClick={toggle}
        >
          <span>{item.name}</span>
          <div
            className="transition-transform duration-300 ease-in-out"
            style={{ transform: `rotate(${rotateAngle}deg)` }}
          >
            <ChevronDown />
          </div>
        </div>

        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-in-out',
            isOpen ? 'opacity-100 max-h-[""]' : 'opacity-0 max-h-0'
          )}
          style={{
            visibility: isOpen ? 'visible' : 'hidden',
          }}
        >
          <div
            ref={contentRef}
            className="my-1 mx-1 p-2 rounded bg-gray-200 shadow-md"
          >
            <ul className="w-full">
              <ArrayMap
                of={item.children ?? []}
                render={(childItem, index) => (
                  <If
                    key={index}
                    condition={
                      !!(childItem.children && childItem.children.length > 0)
                    }
                  >
                    <MenuDropdownchildren
                      key={`if-${index}`}
                      item={childItem}
                    />
                    <Else key={index}>
                      <div>
                        <li className="bg-white px-3 py-2 rounded first:mt-0 mt-2 flex gap-3 items-center">
                          <div className="flex-shrink-0">Icon</div>
                          <span className="truncate">{childItem.name}</span>
                        </li>
                      </div>
                    </Else>
                  </If>
                )}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
