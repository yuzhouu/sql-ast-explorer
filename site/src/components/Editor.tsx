import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { StreamLanguage } from "@codemirror/language";
import { pgSQL } from "@codemirror/legacy-modes/mode/sql";
import { useEffect, useRef } from "react";
import classNames from "classnames";

interface Props {
  code?: string;
}

export default function Editor({ code = "" }: Props) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current === null) return;

    const state = EditorState.create({
      doc: code,

      extensions: [
        basicSetup,
        StreamLanguage.define(pgSQL),
        EditorView.editable.of(false),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      viewRef.current = null;
      view.destroy();
    };
  }, []);

  useEffect(() => {
    if (!viewRef.current) return;

    editorRef.current!.scrollTo(0, 0);

    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: viewRef.current.state.doc.length,
        insert: code,
      },
    });
  }, [code]);

  return (
    <div
      className={classNames(
        "w-full overflow-y-scroll customizedScrollbar editor"
      )}
      ref={editorRef}
    ></div>
  );
}
