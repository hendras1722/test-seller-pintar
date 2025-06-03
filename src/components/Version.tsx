'use client'

import DarkMode from '@/components/client/DarkMode'
import { useStore } from '@/store/todo_list'
import Link from 'next/link'
import { group } from 'radash'

export default function Version() {
  const { count, inc } = useStore()

  const fish = [
    {
      name: 'Marlin',
      source: 'ocean',
    },
    {
      name: 'Bass',
      source: 'lake',
    },
    {
      name: 'Trout',
      source: 'lake',
    },
  ]

  const fishBySource = group(fish, (f) => f.source)
  return (
    <div>
      <details
        name="accordion"
        id="boating"
        open
        className="border border-black p-3 mb-3"
      >
        <summary className="font-bold">Version 1.0.4</summary>
        <div className="mt-3 text-sm font-normal">
          <ul className="list-disc ml-5">
            <li>
              Add package radash
              <div>{JSON.stringify(fish)}</div>
              <div>result using radash: {JSON.stringify(fishBySource)}</div>
              chore: add package radash check documentation:{' '}
              <Link
                className="text-blue-400"
                href={'https://radash-docs.vercel.app/'}
              >
                https://radash-docs.vercel.app/
              </Link>
            </li>
            <li>
              chore: update version @msa_cli/react_composable v1.0.20 check
              documentation:{' '}
              <Link
                className="text-blue-400"
                href={'https://react-composable.vercel.app/'}
              >
                https://react-composable.vercel.app/
              </Link>
            </li>
          </ul>
        </div>
      </details>
      <details
        name="accordion"
        id="boating"
        className="border border-black p-3 mb-3"
      >
        <summary className="font-bold">Version 1.0.3 </summary>
        <div className="mt-3 text-sm font-normal">
          <ul className="list-disc ml-5">
            <li>Bug fixed error mayor hydration</li>
            <li>Bug fixed error calendar shadcn</li>
            <li>
              chore: update version @msa_cli/react_composable v1.0.7 check
              documentation:{' '}
              <Link
                className="text-blue-400"
                href={'https://react-composable.vercel.app/'}
              >
                https://react-composable.vercel.app/
              </Link>
            </li>
          </ul>
        </div>
      </details>
      <details
        name="accordion"
        id="boating"
        className="border border-black p-3"
      >
        <summary className="font-bold">Version 1.0.2 </summary>
        <div className="mt-3 text-sm font-normal">
          <ul className="list-disc ml-5">
            <li>update package @msa_cli/react_composable v1.0.5</li>
            <li>add composable onBeforeLeave</li>
            <li>
              delete composable useLocalStorage move to package{' '}
              <span>
                {' '}
                <Link
                  href="https://www.npmjs.com/package/@msa_cli/react-composable"
                  className="ml-2 text-blue-700"
                >
                  @msa_cli/react-composable
                </Link>
              </span>
            </li>
            <li>
              delete composable useDebounce move to package{' '}
              <span>
                {' '}
                <Link
                  href="https://www.npmjs.com/package/@msa_cli/react-composable"
                  className="ml-2 text-blue-700"
                >
                  @msa_cli/react-composable
                </Link>
              </span>
            </li>
            <li>
              delete composable useBreakpoints move to package{' '}
              <span>
                {' '}
                <Link
                  href="https://www.npmjs.com/package/@msa_cli/react-composable"
                  className="ml-2 text-blue-700"
                >
                  @msa_cli/react-composable
                </Link>
              </span>
            </li>
            <li>
              delete composable useDraggable move to package{' '}
              <span>
                {' '}
                <Link
                  href="https://www.npmjs.com/package/@msa_cli/react-composable"
                  className="ml-2 text-blue-700"
                >
                  @msa_cli/react-composable
                </Link>
              </span>
            </li>
            <li>
              delete composable useFetch move to package{' '}
              <span>
                {' '}
                <Link
                  href="https://www.npmjs.com/package/@msa_cli/react-composable"
                  className="ml-2 text-blue-700"
                >
                  @msa_cli/react-composable
                </Link>
              </span>
            </li>
            <li>
              delete composable useBase64 move to package{' '}
              <span>
                {' '}
                <Link
                  href="https://www.npmjs.com/package/@msa_cli/react-composable"
                  className="ml-2 text-blue-700"
                >
                  @msa_cli/react-composable
                </Link>
              </span>
            </li>
            <li>
              delete composable useDateFormat move to package{' '}
              <span>
                {' '}
                <Link
                  href="https://www.npmjs.com/package/@msa_cli/react-composable"
                  className="ml-2 text-blue-700"
                >
                  @msa_cli/react-composable
                </Link>
              </span>
            </li>
            <li>
              delete composable useDebounce move to package{' '}
              <span>
                {' '}
                <Link
                  href="https://www.npmjs.com/package/@msa_cli/react-composable"
                  className="ml-2 text-blue-700"
                >
                  @msa_cli/react-composable
                </Link>
              </span>
            </li>
            <li>
              delete composable useElementBounding move to package{' '}
              <span>
                {' '}
                <Link
                  href="https://www.npmjs.com/package/@msa_cli/react-composable"
                  className="ml-2 text-blue-700"
                >
                  @msa_cli/react-composable
                </Link>
              </span>
            </li>
            <li>
              delete composable useNetwork move to package{' '}
              <span>
                {' '}
                <Link
                  href="https://www.npmjs.com/package/@msa_cli/react-composable"
                  className="ml-2 text-blue-700"
                >
                  @msa_cli/react-composable
                </Link>
              </span>
            </li>
          </ul>
        </div>
      </details>
      <details
        name="accordion"
        id="boating"
        className="border border-black p-3 mt-3"
      >
        <summary className="font-bold">Version 1.0.1 </summary>
        <div className="mt-3 text-sm font-normal">
          <ul className="list-disc ml-5">
            <li>fixing bug rewrite production </li>
            <li>add composable useLocalStorage </li>
            <li>add composable useDebounce </li>
            <li>add composable useBreakpoints </li>
            <li>add composable useDraggable </li>
            <li>add composable useFetch </li>
            <li>add composable useBase64 </li>
            <li>add composable useDateFormat </li>
            <li>add composable useDebounce </li>
            <li>add composable useElementBounding </li>
            <li>add composable useNetwork </li>
            <li>add composable useFetch </li>
          </ul>
        </div>
      </details>
      <details
        name="accordion"
        id="boating"
        className="border border-black p-3 mt-3"
      >
        <summary className="font-bold">Version 1.0.0</summary>
        <div className="mt-3 text-sm font-normal">
          <ul className="list-disc ml-5">
            <li>
              Store zustand support{' '}
              <button onClick={() => inc('plus')}>+</button>{' '}
              <span>{count}</span>{' '}
              <button onClick={() => inc('minus')}>-</button>
            </li>
            <li>Component mapping using components</li>
            <li>Condition if else using components</li>
            <li>Talwinds support</li>
            <li>Login style</li>
            <li>Settings rewrite api</li>
            <li>Settings next image</li>
            <li>Settings middleware</li>
            <li>
              Support dark mode <DarkMode />
            </li>
            <li>Next security settings in middleware</li>
            <li>Support using shadcn/ui</li>
            <li>Form using react hook form</li>
            <li>Support React Icon</li>
            <li>Format date using date-fns</li>
            <li>Component table dynamic using shadcn/ui</li>
          </ul>
        </div>
      </details>
    </div>
  )
}
