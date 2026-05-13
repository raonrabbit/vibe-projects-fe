"use client";

import * as RadixTabs from "@radix-ui/react-tabs";
import { type ComponentPropsWithoutRef } from "react";

import { cn } from "../lib/cn";

export type TabProps = ComponentPropsWithoutRef<typeof RadixTabs.Root>;
export type TabListProps = ComponentPropsWithoutRef<typeof RadixTabs.List>;
export type TabTriggerProps = ComponentPropsWithoutRef<typeof RadixTabs.Trigger>;
export type TabPanelProps = ComponentPropsWithoutRef<typeof RadixTabs.Content>;

function TabRoot({ className, ...props }: TabProps) {
  return <RadixTabs.Root className={cn("w-full", className)} {...props} />;
}

function TabList({ className, ...props }: TabListProps) {
  return (
    <RadixTabs.List
      className={cn("flex border-b border-border", className)}
      {...props}
    />
  );
}

function TabTrigger({ className, ...props }: TabTriggerProps) {
  return (
    <RadixTabs.Trigger
      className={cn(
        "type-label-1 -mb-px border-b-2 border-transparent px-4 py-2.5 text-text-secondary",
        "transition-colors hover:text-text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
        "data-[state=active]:border-accent data-[state=active]:text-text-primary",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

function TabPanel({ className, ...props }: TabPanelProps) {
  return (
    <RadixTabs.Content
      className={cn(
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Tab is a compound component for content switching via tab triggers.
 *
 * @example
 * <Tab defaultValue="overview">
 *   <Tab.List>
 *     <Tab.Trigger value="overview">개요</Tab.Trigger>
 *     <Tab.Trigger value="detail">상세</Tab.Trigger>
 *   </Tab.List>
 *   <Tab.Panel value="overview">개요 내용</Tab.Panel>
 *   <Tab.Panel value="detail">상세 내용</Tab.Panel>
 * </Tab>
 */
export const Tab = Object.assign(TabRoot, {
  List: TabList,
  Trigger: TabTrigger,
  Panel: TabPanel,
});
