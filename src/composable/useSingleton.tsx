import React, { useState, useEffect, ComponentType, RefObject } from 'react'
import { createRoot, Root } from 'react-dom/client'
import PQueue from './useQueue'

interface InstanceItem {
  id: string
  component: ComponentType<any>
  ref: RefObject<any>
}

interface Container {
  root: Root
  target: HTMLDivElement
}

interface InstancesRef {
  current: Map<string, InstanceItem>
}

let instances: InstancesRef | null = null
let container: Container | null = null
const queue = new PQueue()

// Global container component that renders all singleton instances
const GlobalContainer: React.FC = () => {
  const [instancesMap, setInstancesMap] = useState<Map<string, InstanceItem>>(
    new Map()
  )

  // Update instances when the global instances change
  useEffect(() => {
    if (instances) {
      setInstancesMap(new Map(instances.current))
    }
  }, [])

  // Re-render when instances change
  useEffect(() => {
    const updateInstances = () => {
      if (instances) {
        setInstancesMap(new Map(instances.current))
      }
    }

    // Store the update function globally so we can call it from outside
    ;(window as any).__updateGlobalInstances = updateInstances

    return () => {
      delete (window as any).__updateGlobalInstances
    }
  }, [])

  return (
    <>
      {Array.from(instancesMap.values()).map((item) => {
        const Component = item.component
        return <Component key={item.id} ref={item.ref} />
      })}
    </>
  )
}

async function createInstance<T = any>(
  id: string,
  component: ComponentType<T>
): Promise<T | null> {
  if (!instances) {
    instances = { current: new Map<string, InstanceItem>() }
  }

  if (!container) {
    const target = document.createElement('div')
    target.id = 'global'
    document.body.appendChild(target)

    const root = createRoot(target)
    container = { root, target }

    // Initial render
    root.render(<GlobalContainer />)
  }

  let instance = instances.current.get(id)
  if (!instance) {
    instance = {
      id,
      component,
      ref: React.createRef<T>(),
    }
    instances.current.set(id, instance)

    // Trigger re-render
    if ((window as any).__updateGlobalInstances) {
      ;(window as any).__updateGlobalInstances()
    }

    // Wait for next tick equivalent
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
  }

  return instance.ref.current
}

async function removeInstance(id: string): Promise<void> {
  if (instances && container) {
    instances.current.delete(id)

    // Trigger re-render
    if ((window as any).__updateGlobalInstances) {
      ;(window as any).__updateGlobalInstances()
    }

    // Wait for next tick equivalent
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
  }
}

export async function resetInstance(): Promise<void> {
  if (instances) {
    instances.current.clear()

    // Trigger re-render
    if ((window as any).__updateGlobalInstances) {
      ;(window as any).__updateGlobalInstances()
    }

    // Wait for next tick equivalent
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
  }
}

export async function useSingleton<T = any>(component: ComponentType<T>) {
  const componentName =
    component.displayName || component.name || 'AnonymousComponent'
  return await queue.add(() => createInstance<T>(componentName, component))
}

export async function removeSingleton<T = any>(component: ComponentType<T>) {
  const componentName =
    component.displayName || component.name || 'AnonymousComponent'
  return await queue.add(() => removeInstance(componentName))
}
