"use client";

import * as RadixToast from "@radix-ui/react-toast";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../lib/cn";

export type ToastProviderProps = ComponentPropsWithoutRef<typeof RadixToast.Provider>;
export type ToastProps = ComponentPropsWithoutRef<typeof RadixToast.Root>;
export type ToastTitleProps = ComponentPropsWithoutRef<typeof RadixToast.Title>;
export type ToastDescriptionProps = ComponentPropsWithoutRef<typeof RadixToast.Description>;
export type ToastActionProps = ComponentPropsWithoutRef<typeof RadixToast.Action>;
export type ToastViewportProps = ComponentPropsWithoutRef<typeof RadixToast.Viewport>;

const ToastProvider = RadixToast.Provider;

const ToastViewport = forwardRef<HTMLOListElement, ToastViewportProps>(
  ({ className, ...props }, ref) => (
    <RadixToast.Viewport
      ref={ref}
      className={cn(
        "fixed bottom-0 right-0 z-50 m-0 flex w-[380px] max-w-[100vw] flex-col gap-2 p-6",
        "list-none outline-none",
        className,
      )}
      {...props}
    />
  ),
);
ToastViewport.displayName = "Toast.Viewport";

const ToastRoot = forwardRef<HTMLLIElement, ToastProps>(
  ({ className, ...props }, ref) => (
    <RadixToast.Root
      ref={ref}
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-md",
        "animate-slide-up",
        "data-[state=closed]:animate-fade-in",
        className,
      )}
      {...props}
    />
  ),
);
ToastRoot.displayName = "Toast.Root";

const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>(
  ({ className, ...props }, ref) => (
    <RadixToast.Title
      ref={ref}
      className={cn("type-headline-2 text-text-primary", className)}
      {...props}
    />
  ),
);
ToastTitle.displayName = "Toast.Title";

const ToastDescription = forwardRef<HTMLDivElement, ToastDescriptionProps>(
  ({ className, ...props }, ref) => (
    <RadixToast.Description
      ref={ref}
      className={cn("type-body-2 text-text-secondary", className)}
      {...props}
    />
  ),
);
ToastDescription.displayName = "Toast.Description";

const ToastAction = forwardRef<HTMLButtonElement, ToastActionProps>(
  ({ className, ...props }, ref) => (
    <RadixToast.Action
      ref={ref}
      className={cn(
        "type-label-1 ml-auto shrink-0 text-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  ),
);
ToastAction.displayName = "Toast.Action";

const ToastClose = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof RadixToast.Close>
>(({ className, ...props }, ref) => (
  <RadixToast.Close
    ref={ref}
    className={cn(
      "ml-auto shrink-0 text-text-secondary hover:text-text-primary transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
ToastClose.displayName = "Toast.Close";

/**
 * Toast is a compound component built on Radix Toast.
 * Place `<Toast.Provider>` and `<Toast.Viewport>` once near the app root.
 *
 * @example
 * // App root
 * <Toast.Provider>
 *   {children}
 *   <Toast.Viewport />
 * </Toast.Provider>
 *
 * // Anywhere in the tree
 * const [open, setOpen] = useState(false);
 * <Button onClick={() => setOpen(true)}>알림 보내기</Button>
 * <Toast.Root open={open} onOpenChange={setOpen}>
 *   <Toast.Title>저장 완료</Toast.Title>
 *   <Toast.Description>변경사항이 저장되었습니다.</Toast.Description>
 *   <Toast.Action altText="실행 취소" onClick={undo}>실행 취소</Toast.Action>
 * </Toast.Root>
 */
export const Toast = Object.assign(ToastRoot, {
  Provider: ToastProvider,
  Viewport: ToastViewport,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
});
