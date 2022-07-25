import * as React from "react";
import classNames from "classnames";

const baseStyle = {
  flex: "1",
  display: "flex",
};

const styleB = {
  ...baseStyle,
  minWidth: 0,
  minHeight: 0,
};

interface Porps {
  vertical?: boolean;
  className?: string;
  children?: React.ReactNode;
  onResize?: () => void;
}

/**
 * Creates a left-right split pane inside its container.
 */
export default function SplitPane({
  vertical = false,
  className,
  children,
  onResize,
}: Porps) {
  // Position is really the size (width or height) of the first (left or top)
  // panel, as percentage of the parent containers size. The remaining elements
  // are sized and layed out through flexbox.
  const [position, setPosition] = React.useState(50);
  const container = React.useRef<HTMLDivElement>(null);

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> =
    React.useCallback(
      function (event) {
        if (!container.current) {
          return;
        }

        // This is needed to prevent text selection in Safari
        event.preventDefault();

        const offset = vertical
          ? container.current.offsetTop
          : container.current.offsetLeft;
        const size = vertical
          ? container.current.offsetHeight
          : container.current.offsetWidth;
        globalThis.document.body.style.cursor = vertical
          ? "row-resize"
          : "col-resize";
        let moveHandler = (event: MouseEvent) => {
          event.preventDefault();
          const newPosition =
            (((vertical ? event.pageY : event.pageX) - offset) / size) * 100;
          // Using 99% as the max value prevents the divider from disappearing
          setPosition(Math.min(Math.max(0, newPosition), 99));
        };
        let upHandler = () => {
          document.removeEventListener("mousemove", moveHandler);
          document.removeEventListener("mouseup", upHandler);
          globalThis.document.body.style.cursor = "";

          if (onResize) {
            onResize();
          }
        };

        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", upHandler);
      },
      [vertical, position, container]
    );

  const childrenArr = React.Children.toArray(children);

  if (childrenArr.length < 2) {
    return (
      <div className={className} style={{ display: "flex" }}>
        {children}
      </div>
    );
  }

  const styleA: React.CSSProperties = { ...baseStyle };

  if (vertical) {
    // top
    styleA.minHeight = styleA.maxHeight = position + "%";
  } else {
    // left
    styleA.minWidth = styleA.maxWidth = position + "%";
  }

  return (
    <div
      ref={container}
      className={classNames(className, "flex")}
      style={{ flexDirection: vertical ? "column" : "row" }}
    >
      <div style={styleA}>{childrenArr[0]}</div>
      <div
        className={classNames(
          {
            "splitpane-divider": true,
            vertical: vertical,
            horizontal: !vertical,
          },
          "w-1 bg-gray-300"
        )}
        onMouseDown={onMouseDown}
      />
      <div style={styleB}>{childrenArr[1]}</div>
    </div>
  );
}
