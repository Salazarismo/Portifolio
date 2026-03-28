import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";

export interface SegmentedButtonItem {
  id: string;
  label?: string | null;
  isLogo?: boolean;
}

export interface SegmentedButtonProps {
  buttons: SegmentedButtonItem[];
  activeId?: string;
  defaultActive?: string;
  onChange?: (activeId: string) => void;
  className?: string;
  ariaLabel?: string;
}

export function SegmentedButton({
  buttons,
  activeId,
  defaultActive,
  onChange,
  className = "",
  ariaLabel
}: SegmentedButtonProps) {
  const [internalActive, setInternalActive] = useState(defaultActive || buttons[0]?.id || "");
  const activeButton = activeId ?? internalActive;

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverStyle, setHoverStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const syncIndicator = () => {
    const activeIndex = buttons.findIndex((btn) => btn.id === activeButton);
    const activeElement = buttonRefs.current[activeIndex];
    if (!activeElement) return;
    setIndicatorStyle({ left: activeElement.offsetLeft, width: activeElement.offsetWidth });
  };

  const syncHover = () => {
    if (hoveredIndex !== null) {
      const hoveredElement = buttonRefs.current[hoveredIndex];
      if (hoveredElement) {
        setHoverStyle({ left: hoveredElement.offsetLeft, width: hoveredElement.offsetWidth, opacity: 1 });
      }
      return;
    }
    setHoverStyle((s) => ({ ...s, opacity: 0 }));
  };

  useLayoutEffect(() => {
    syncIndicator();
  }, [activeButton, buttons]);

  useLayoutEffect(() => {
    syncHover();
  }, [hoveredIndex, buttons]);

  useEffect(() => {
    syncHover();
    syncIndicator();
    if (!containerRef.current) return;
    if (typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      syncHover();
      syncIndicator();
    });

    ro.observe(containerRef.current);
    buttonRefs.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [buttons, activeButton, hoveredIndex]);

  const handleButtonClick = (buttonId: string) => {
    if (activeId == null) setInternalActive(buttonId);
    onChange?.(buttonId);
  };

  return (
    <div
      ref={containerRef}
      className={`nl-seg relative inline-flex items-center justify-start rounded-full ${className}`.trim()}
      onMouseLeave={() => setHoveredIndex(null)}
      role="radiogroup"
      aria-label={ariaLabel ?? "Seções"}
    >
      <div
        className="nl-seg-hover absolute rounded-full"
        style={{ left: `${hoverStyle.left}px`, width: `${hoverStyle.width}px`, opacity: hoverStyle.opacity }}
        aria-hidden="true"
      />
      <div
        className="nl-seg-indicator absolute rounded-full"
        style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` }}
        aria-hidden="true"
      />

      {buttons.map((button, index) => (
        <button
          key={button.id}
          ref={(el) => {
            buttonRefs.current[index] = el;
          }}
          type="button"
          onClick={() => handleButtonClick(button.id)}
          onMouseEnter={() => setHoveredIndex(index)}
          className="nl-seg-btn relative z-10 flex items-center justify-center gap-2 rounded-full px-2 py-1 transition-colors"
          role="radio"
          aria-checked={activeButton === button.id}
          tabIndex={activeButton === button.id ? 0 : -1}
        >
          <span className={`nl-seg-label ${activeButton === button.id ? "is-active" : ""}`.trim()}>
            {button.label}
          </span>
        </button>
      ))}
    </div>
  );
}
