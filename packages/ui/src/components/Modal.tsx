"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cn } from "../lib/cn";

export type ModalProps = ComponentPropsWithoutRef<typeof Dialog.Root>;
export type ModalContentProps = ComponentPropsWithoutRef<typeof Dialog.Content>;
export type ModalTitleProps = ComponentPropsWithoutRef<typeof Dialog.Title>;
export type ModalDescriptionProps = ComponentPropsWithoutRef<typeof Dialog.Description>;

const ModalRoot = Dialog.Root;
const ModalTrigger = Dialog.Trigger;
const ModalClose = Dialog.Close;

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children, ...props }, ref) => (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
          "rounded-3xl border border-border bg-surface p-6 shadow-lg",
          "animate-slide-up",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          className,
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  ),
);
ModalContent.displayName = "Modal.Content";

const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, ...props }, ref) => (
    <Dialog.Title
      ref={ref}
      className={cn("type-title-2 text-text-primary", className)}
      {...props}
    />
  ),
);
ModalTitle.displayName = "Modal.Title";

const ModalDescription = forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
  ({ className, ...props }, ref) => (
    <Dialog.Description
      ref={ref}
      className={cn("type-body-2 mt-1 text-text-secondary", className)}
      {...props}
    />
  ),
);
ModalDescription.displayName = "Modal.Description";

/**
 * Modal is a compound component built on Radix Dialog.
 *
 * @example
 * <Modal>
 *   <Modal.Trigger asChild>
 *     <Button>열기</Button>
 *   </Modal.Trigger>
 *   <Modal.Content>
 *     <Modal.Title>제목</Modal.Title>
 *     <Modal.Description>설명 텍스트</Modal.Description>
 *     <div className="mt-4 flex justify-end gap-2">
 *       <Modal.Close asChild>
 *         <Button variant="secondary">취소</Button>
 *       </Modal.Close>
 *       <Button>확인</Button>
 *     </div>
 *   </Modal.Content>
 * </Modal>
 */
export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Title: ModalTitle,
  Description: ModalDescription,
  Close: ModalClose,
});
