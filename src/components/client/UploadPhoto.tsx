'use client'

import React, { Suspense, useEffect } from 'react'
import { Input } from '../ui/input'
import { twMerge } from 'tailwind-merge'
import { ImagePlus } from 'lucide-react'
import { notify } from '@/utils/Notify'
import { useAxios } from '@/composable/useAxios'
import { Else, If } from '../if'

export default function UploadPhoto({
  setImage,
  error,
  image,
}: {
  readonly setImage: React.Dispatch<React.SetStateAction<string>>
  readonly error?: string
  readonly image?: string
}) {
  const inputFile = React.useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = React.useState<string>('')
  const axios = useAxios<{ imageUrl: string }>()

  useEffect(() => {
    if (image) {
      setSelectedImage(image)
    }
  }, [image])

  const handleUploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file))
      }, 1000)
    })
  }
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const { error, data } = await axios('/upload', {
        method: 'POST',
        body: file,
      })
      const imageUrl = await handleUploadImage(file)
      if (!error && data) {
        console.log(data, 'inidata')
        setImage(imageUrl)
        setSelectedImage(data.imageUrl ?? imageUrl)
        return
      }
      setImage(imageUrl)
      setSelectedImage(imageUrl)

      notify({
        variant: 'error',
        title: 'Error',
        description: 'Error uploading image',
        duration: 3000,
        className: 'border border-red-500 bg-white text-red-800',
      })
    }
  }
  return (
    <Suspense>
      <div className="border border-dashed border-gray-400 flex items-center justify-center h-[163px] w-[223px] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
        <div>
          <Input
            ref={inputFile}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className={twMerge(error && 'border-red-500')}
            onClick={() => inputFile.current?.click()}
            tabIndex={0}
            aria-label="Select image file"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                inputFile.current?.click()
              }
            }}
          >
            <If condition={!!selectedImage}>
              <img
                src={selectedImage}
                alt="Selected thumbnail"
                className="w-full h-full object-cover rounded"
              />
              <Else key={'files'}>
                <div className="grid place-items-center mt-3 mb-6">
                  <ImagePlus />
                  <p className="underline">Click to Select Files</p>
                  <p>Support File Type : jpg or png</p>
                </div>
              </Else>
            </If>
          </button>
          <If condition={!!selectedImage}>
            <div className="flex justify-center gap-3 items-center">
              <button
                onClick={() => {
                  if (inputFile.current) {
                    inputFile.current.value = ''
                  }
                  inputFile.current?.click()
                }}
              >
                <div className="text-blue-500 underline ">Changes</div>
              </button>
              <button
                onClick={() => {
                  setImage('')
                  setSelectedImage('')
                  if (inputFile.current) {
                    inputFile.current.value = ''
                  }
                }}
              >
                <div className="text-red-500 underline">Delete</div>
              </button>
            </div>
          </If>
        </div>
      </div>
    </Suspense>
  )
}
