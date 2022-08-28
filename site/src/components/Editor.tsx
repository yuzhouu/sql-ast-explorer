import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { EditorView, ViewUpdate } from '@codemirror/view'
import { StreamLanguage } from '@codemirror/language'
import { pgSQL } from '@codemirror/legacy-modes/mode/sql'
import { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { json } from '@codemirror/lang-json'

interface Props {
  code?: string
  onChange?: (content: string) => void
}

export default function Editor({ code = '', onChange }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (editorRef.current === null) return

    const state = EditorState.create({
      doc: code,

      extensions: [
        basicSetup,
        json(),
        StreamLanguage.define(pgSQL),
        EditorView.editable.of(true),
        EditorView.updateListener.of((v: ViewUpdate) => {
          if (v.docChanged) {
            onChange?.(v.state.doc.sliceString(0))
            // Document changed
          }
        }),
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      viewRef.current = null
      view.destroy()
    }
  }, [])

  useEffect(() => {
    if (!viewRef.current) return

    editorRef.current!.scrollTo(0, 0)

    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: viewRef.current.state.doc.length,
        insert: code,
      },
    })
  }, [code])

  return (
    <div
      className={classNames(
        'w-full overflow-y-scroll customizedScrollbar editor'
      )}
      ref={editorRef}
    ></div>
  )
}
