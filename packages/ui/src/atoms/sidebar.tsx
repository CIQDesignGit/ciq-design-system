import * as React from "react";
import { PanelLeft } from "lucide-react";

import { Button } from "@/atoms/button";
import { cn } from "@/lib/utils";

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      toggle: () => setOpen((current) => !current),
    }),
    [open]
  );
  return (
    <SidebarContext.Provider value={value}>
      <div className="flex min-h-svh w-full">{children}</div>
    </SidebarContext.Provider>
  );
}

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
  return ctx;
}

function Sidebar({
  className,
  children,
  ...props
}: React.ComponentProps<"aside">) {
  const { open } = useSidebar();
  return (
    <aside
      data-state={open ? "expanded" : "collapsed"}
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-[width] duration-200",
        open ? "w-64" : "w-12",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-2", className)} {...props} />;
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto p-2", className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-auto", className)} {...props} />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-2", className)} {...props} />;
}

function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-8 items-center rounded-lg px-2 text-xs font-medium text-sidebar-foreground/70",
        className
      )}
      {...props}
    />
  );
}

function SidebarGroupContent(props: React.ComponentProps<"div">) {
  return <div {...props} />;
}

function SidebarGroupAction(props: React.ComponentProps<"button">) {
  return <button type="button" {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col gap-1", className)} {...props} />;
}

function SidebarMenuItem(props: React.ComponentProps<"li">) {
  return <li {...props} />;
}

function SidebarMenuButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 overflow-hidden rounded-lg p-2 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    />
  );
}

function SidebarMenuAction(props: React.ComponentProps<"button">) {
  return <button type="button" {...props} />;
}

function SidebarMenuBadge(props: React.ComponentProps<"span">) {
  return <span {...props} />;
}

function SidebarMenuSkeleton({ className }: { className?: string }) {
  return <div className={cn("h-8 rounded-lg bg-sidebar-accent animate-pulse", className)} />;
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("ml-4 flex flex-col gap-1", className)} {...props} />;
}

function SidebarMenuSubItem(props: React.ComponentProps<"li">) {
  return <li {...props} />;
}

function SidebarMenuSubButton({
  className,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "flex h-7 items-center gap-2 rounded-lg px-2 text-sm hover:bg-sidebar-accent",
        className
      )}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return <main className={cn("flex-1 bg-background", className)} {...props} />;
}

function SidebarInput(props: React.ComponentProps<"input">) {
  return (
    <input
      className="h-8 w-full rounded-lg border bg-background px-2 text-sm"
      {...props}
    />
  );
}

function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { toggle } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggle}
      aria-label="Toggle sidebar"
      {...props}
    >
      <PanelLeft />
    </Button>
  );
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarInset,
  SidebarInput,
  SidebarTrigger,
  useSidebar,
};
