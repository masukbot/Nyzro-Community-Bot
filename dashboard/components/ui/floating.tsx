"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

type Placement =
  | "bottom-start" | "bottom" | "bottom-end"
  | "top-start" | "top" | "top-end"
  | "left-start" | "left" | "left-end"
  | "right-start" | "right" | "right-end"

interface FloatingLayerProps {
  open: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
  placement?: Placement
  sideOffset?: number
  autoFlip?: boolean
  matchTriggerWidth?: boolean
  minWidth?: number | string
  maxWidth?: number | string
  zIndex?: number
  className?: string
}

function getPlacement(placement: Placement) {
  const [side, align] = placement.split("-") as [string, string | undefined]
  return { side: side as "top" | "bottom" | "left" | "right", align: (align || "center") as "start" | "center" | "end" }
}

function computeCoords(
  triggerRect: DOMRect,
  floatRect: DOMRect,
  side: "top" | "bottom" | "left" | "right",
  align: "start" | "center" | "end",
  sideOffset: number,
  viewportW: number,
  viewportH: number,
  autoFlip: boolean
) {
  let top = 0, left = 0
  let finalSide = side
  let finalAlign = align

  if (side === "bottom") {
    top = triggerRect.bottom + sideOffset
    if (autoFlip && top + floatRect.height > viewportH && triggerRect.top - sideOffset > floatRect.height) {
      finalSide = "top"
      top = triggerRect.top - floatRect.height - sideOffset
    }
  } else if (side === "top") {
    top = triggerRect.top - floatRect.height - sideOffset
    if (autoFlip && top < 0 && triggerRect.bottom + sideOffset + floatRect.height < viewportH) {
      finalSide = "bottom"
      top = triggerRect.bottom + sideOffset
    }
  } else if (side === "left") {
    left = triggerRect.left - floatRect.width - sideOffset
    if (autoFlip && left < 0 && triggerRect.right + sideOffset + floatRect.width < viewportW) {
      finalSide = "right"
      left = triggerRect.right + sideOffset
    }
  } else if (side === "right") {
    left = triggerRect.right + sideOffset
    if (autoFlip && left + floatRect.width > viewportW && triggerRect.left - sideOffset > floatRect.width) {
      finalSide = "left"
      left = triggerRect.left - floatRect.width - sideOffset
    }
  }

  if (finalSide === "top" || finalSide === "bottom") {
    if (finalAlign === "start") left = triggerRect.left
    else if (finalAlign === "end") left = triggerRect.right - floatRect.width
    else left = triggerRect.left + (triggerRect.width - floatRect.width) / 2
  }

  if (finalSide === "left" || finalSide === "right") {
    if (finalAlign === "start") top = triggerRect.top
    else if (finalAlign === "end") top = triggerRect.bottom - floatRect.height
    else top = triggerRect.top + (triggerRect.height - floatRect.height) / 2
  }

  left = Math.max(4, Math.min(left, viewportW - floatRect.width - 4))
  top = Math.max(4, Math.min(top, viewportH - floatRect.height - 4))

  return { top, left, finalSide }
}

export function FloatingLayer({
  open,
  onClose,
  triggerRef,
  children,
  placement = "bottom-start",
  sideOffset = 6,
  autoFlip = true,
  matchTriggerWidth = true,
  minWidth,
  maxWidth,
  zIndex = 50,
  className,
}: FloatingLayerProps) {
  const floatRef = React.useRef<HTMLDivElement>(null)
  const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0 })
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const position = React.useCallback(() => {
    if (!triggerRef.current || !floatRef.current) return
    const tRect = triggerRef.current.getBoundingClientRect()
    const fRect = floatRef.current.getBoundingClientRect()
    const { side, align } = getPlacement(placement)

    let w = matchTriggerWidth ? tRect.width : fRect.width
    if (minWidth !== undefined) w = Math.max(w, typeof minWidth === "number" ? minWidth : 0)
    if (maxWidth !== undefined) w = Math.min(w, typeof maxWidth === "number" ? maxWidth : Infinity)

    const { top, left } = computeCoords(tRect, { ...fRect, width: w }, side, align, sideOffset, window.innerWidth, window.innerHeight, autoFlip)
    setCoords({ top, left, width: w })
  }, [placement, sideOffset, autoFlip, matchTriggerWidth, minWidth, maxWidth, triggerRef])

  React.useEffect(() => {
    if (!open) return
    position()

    const handleResize = () => position()
    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", position, true)
    const interval = setInterval(position, 250)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", position, true)
      clearInterval(interval)
    }
  }, [open, position])

  React.useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (floatRef.current && !floatRef.current.contains(e.target as Node) && triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClick, true)
    return () => document.removeEventListener("mousedown", handleClick, true)
  }, [open, onClose, triggerRef])

  React.useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onClose])

  if (!open || !mounted) return null

  const { side } = getPlacement(placement)
  const anchorTop = side === "bottom" || side === "top"

  return createPortal(
    <div
      ref={floatRef}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        width: coords.width || undefined,
        zIndex,
      }}
      className={cn(
        "rounded-xl border border-slate-800 bg-[#141B2D] p-1 shadow-2xl",
        "animate-in fade-in zoom-in-95 duration-200",
        anchorTop
          ? side === "bottom" ? "slide-in-from-top-1" : "slide-in-from-bottom-1"
          : side === "right" ? "slide-in-from-left-1" : "slide-in-from-right-1",
        className
      )}
    >
      {children}
    </div>,
    document.body
  )
}

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
} | null>(null)

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  children?: React.ReactNode
  value: string
  onValueChange: (value: string) => void
  options?: SelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function Select({ children, value, onValueChange, options, placeholder, className, disabled }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleClose = React.useCallback(() => setIsOpen(false), [])

  if (options) {
    const selectedOption = options.find((opt) => opt.value === value)
    return (
      <div className={cn("relative w-full", className)} ref={containerRef}>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
            isOpen && "ring-2 ring-primary/50 border-slate-700"
          )}
        >
          <span className={cn("truncate", !selectedOption && "text-slate-500")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", isOpen && "rotate-180")} />
        </button>

        <FloatingLayer
          open={isOpen}
          onClose={handleClose}
          triggerRef={triggerRef}
          placement="bottom-start"
          sideOffset={6}
          matchTriggerWidth
          zIndex={50}
        >
          <div className="max-h-60 overflow-y-auto no-scrollbar">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onValueChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-800",
                  value === option.value ? "bg-primary text-white" : "text-slate-300"
                )}
              >
                <span className="truncate">{option.label}</span>
                {value === option.value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </FloatingLayer>
      </div>
    )
  }

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen, triggerRef }}>
      <div className={cn("relative w-full", className)} ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(SelectContext)
  if (!context) return null

  return (
    <button
      ref={(node) => {
        (context.triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
        if (typeof ref === "function") ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
      }}
      type="button"
      onClick={() => context.setIsOpen(!context.isOpen)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
        context.isOpen && "ring-2 ring-primary/50 border-slate-700",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-200", context.isOpen && "rotate-180")} />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, className }: { placeholder?: string, className?: string }) => {
  const context = React.useContext(SelectContext)
  if (!context) return null
  return <span className={cn("truncate", !context.value && "text-slate-500", className)}>{context.value || placeholder}</span>
}

const SelectContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const context = React.useContext(SelectContext)
  if (!context || !context.isOpen) return null
  return (
    <FloatingLayer
      open={context.isOpen}
      onClose={() => context.setIsOpen(false)}
      triggerRef={context.triggerRef as React.RefObject<HTMLElement>}
      placement="bottom-start"
      sideOffset={6}
      matchTriggerWidth
      zIndex={50}
      className={className}
    >
      <div className="max-h-60 overflow-y-auto no-scrollbar">
        {children}
      </div>
    </FloatingLayer>
  )
}

const SelectItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(SelectContext)
  if (!context) return null
  const isSelected = context.value === value
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        context.onValueChange(value)
        context.setIsOpen(false)
      }}
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-slate-800",
        isSelected ? "bg-primary text-white" : "text-slate-300",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check className="h-4 w-4" />}
    </button>
  )
})
SelectItem.displayName = "SelectItem"

export { SelectTrigger, SelectValue, SelectContent, SelectItem }
export type { FloatingLayerProps }
