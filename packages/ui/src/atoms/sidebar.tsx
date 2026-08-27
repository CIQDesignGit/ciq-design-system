/* eslint-disable react-refresh/only-export-components */
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";
import * as React from "react";

import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { Separator } from "@/atoms/separator";

const Sidebarsheet = React.lazy(() =>
  import("@/atoms/sheet").then((m) => ({
    default: ({
      open,
      onOpenChange,
      side,
      children,
      ...props
    }: {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      side: "left" | "right";
      children: React.ReactNode;
      [k: string]: unknown;
    }) => (
      <m.Sheet open={open} onOpenChange={onOpenChange} {...props}>
        <m.SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
          side={side}
        >
          <m.SheetHeader className="sr-only">
            <m.SheetTitle>Sidebar</m.SheetTitle>
            <m.SheetDescription>Displays the mobile sidebar.</m.SheetDescription>
          </m.SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </m.SheetContent>
      </m.Sheet>
    ),
  }))
);

import { Skeleton } from "@/atoms/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/atoms/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { getCryptoRandomValue } from "@/lib/get-crypto-random-value";
import { cn } from "@/lib/utils";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "380px";
const SIDEBAR_WIDTH_MOBILE = "240px";
const SIDEBAR_WIDTH_ICON = "48px";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarState = {
  open: boolean;
  openMobile: boolean;
  sidebarWidth: string;
};

type SidebarContextProps = {
  getSidebarState: (id: string) => SidebarState;
  setSidebarOpen: (id: string, open: boolean) => void;
  setSidebarOpenMobile: (id: string, open: boolean) => void;
  toggleSidebar: (id: string) => void;
  setSidebarWidth: (id: string, w: string) => void;
  isMobile: boolean;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar(sidebarId?: string) {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  // If no sidebarId provided, use default behavior (backward compatibility)
  const id = sidebarId || "default";
  const state = context.getSidebarState(id);

  return {
    state: state.open ? "expanded" : "collapsed",
    open: state.open,
    setOpen: (open: boolean) => context.setSidebarOpen(id, open),
    openMobile: state.openMobile,
    setOpenMobile: (open: boolean) => context.setSidebarOpenMobile(id, open),
    isMobile: context.isMobile,
    toggleSidebar: () => context.toggleSidebar(id),
    sidebarWidth: state.sidebarWidth,
    setSidebarWidth: (w: string) => context.setSidebarWidth(id, w),
  };
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    readonly defaultOpen?: boolean;
    readonly open?: boolean;
    readonly onOpenChange?: (open: boolean) => void;
    readonly initialOpen?: Record<string, boolean>;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      initialOpen,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();

    // Helper function to get cookie value
    const getCookie = React.useCallback((name: string): string | null => {
      if (typeof document === "undefined") return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    }, []);

    // Helper function to parse sidebar states from cookie
    const getSidebarStatesFromCookie = React.useCallback((): Record<string, SidebarState> => {
      if (typeof document === "undefined") return {};
      const cookieValue = getCookie(SIDEBAR_COOKIE_NAME);
      if (cookieValue) {
        try {
          return JSON.parse(decodeURIComponent(cookieValue));
        } catch {
          // Legacy cookie format - single boolean value
          const legacyValue = cookieValue === "true";
          return { default: { open: legacyValue, openMobile: false, sidebarWidth: SIDEBAR_WIDTH } };
        }
      }
      return {};
    }, [getCookie]);

    // Initialize sidebar states from cookie or defaults
    const [sidebarStates, setSidebarStates] = React.useState<Record<string, SidebarState>>(() => {
      const cookieStates = getSidebarStatesFromCookie();
      return {
        default: {
          open: openProp ?? cookieStates.default?.open ?? defaultOpen,
          openMobile: cookieStates.default?.openMobile ?? false,
          sidebarWidth:
            (typeof window !== "undefined" && localStorage.getItem("sidebar_width")) ||
            cookieStates.default?.sidebarWidth ||
            SIDEBAR_WIDTH,
        },
      };
    });

    // Get sidebar state by ID
    const getSidebarState = React.useCallback(
      (id: string): SidebarState => {
        if (!sidebarStates[id]) {
          const cookieStates = getSidebarStatesFromCookie();
          if (cookieStates[id]) {
            return cookieStates[id];
          }
          const initialOpenForId =
            initialOpen && Object.prototype.hasOwnProperty.call(initialOpen, id)
              ? !!initialOpen[id]
              : undefined;
          return {
            open: initialOpenForId !== undefined ? initialOpenForId : defaultOpen,
            openMobile: false,
            sidebarWidth: SIDEBAR_WIDTH,
          };
        }
        return sidebarStates[id];
      },
      [sidebarStates, defaultOpen, getSidebarStatesFromCookie, initialOpen]
    );

    // Set sidebar open state
    const setSidebarOpen = React.useCallback(
      (id: string, open: boolean) => {
        setSidebarStates((prev) => {
          // Merge with cookie states so we don't drop other sidebar entries
          const cookieStates = getSidebarStatesFromCookie();
          const baseStates: Record<string, SidebarState> = {
            ...cookieStates,
            ...prev,
          };
          const newStates: Record<string, SidebarState> = {
            ...baseStates,
            [id]: {
              ...getSidebarState(id),
              open,
            },
          };
          // Save to cookie
          if (typeof document !== "undefined") {
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(newStates))}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
          }
          return newStates;
        });
        // Handle legacy default sidebar prop
        if (id === "default" && setOpenProp) {
          setOpenProp(open);
        }
      },
      [getSidebarState, setOpenProp, getSidebarStatesFromCookie]
    );

    // Set sidebar mobile open state
    const setSidebarOpenMobile = React.useCallback(
      (id: string, open: boolean) => {
        setSidebarStates((prev) => {
          // Merge with cookie states so we don't drop other sidebar entries
          const cookieStates = getSidebarStatesFromCookie();
          const baseStates: Record<string, SidebarState> = {
            ...cookieStates,
            ...prev,
          };
          const newStates: Record<string, SidebarState> = {
            ...baseStates,
            [id]: {
              ...getSidebarState(id),
              openMobile: open,
            },
          };
          // Save to cookie
          if (typeof document !== "undefined") {
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(newStates))}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
          }
          return newStates;
        });
      },
      [getSidebarState, getSidebarStatesFromCookie]
    );

    // Toggle sidebar
    const toggleSidebar = React.useCallback(
      (id: string) => {
        const state = getSidebarState(id);
        if (isMobile) {
          setSidebarOpenMobile(id, !state.openMobile);
        } else {
          setSidebarOpen(id, !state.open);
        }
      },
      [isMobile, getSidebarState, setSidebarOpen, setSidebarOpenMobile]
    );

    // Set sidebar width
    const setSidebarWidth = React.useCallback(
      (id: string, w: string) => {
        setSidebarStates((prev) => {
          // Merge with cookie states so we don't drop other sidebar entries
          const cookieStates = getSidebarStatesFromCookie();
          const baseStates: Record<string, SidebarState> = {
            ...cookieStates,
            ...prev,
          };
          const newStates: Record<string, SidebarState> = {
            ...baseStates,
            [id]: {
              ...getSidebarState(id),
              sidebarWidth: w,
            },
          };
          // Save to cookie for consistent width persistence
          if (typeof document !== "undefined") {
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${encodeURIComponent(JSON.stringify(newStates))}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
          }
          return newStates;
        });
        // Store in localStorage for legacy support
        if (id === "default" && typeof window !== "undefined") {
          localStorage.setItem("sidebar_width", w);
        }
      },
      [getSidebarState, getSidebarStatesFromCookie]
    );

    // Handle legacy open prop for default sidebar
    React.useEffect(() => {
      if (openProp !== undefined) {
        setSidebarOpen("default", openProp);
      }
    }, [openProp, setSidebarOpen]);

    // Adds a keyboard shortcut to toggle the default sidebar (legacy behavior)
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar("default");
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    // Get default sidebar width for CSS variable
    const defaultSidebarWidth = getSidebarState("default").sidebarWidth;

    const contextValue = React.useMemo<SidebarContextProps>(
      () => ({
        getSidebarState,
        setSidebarOpen,
        setSidebarOpenMobile,
        toggleSidebar,
        setSidebarWidth,
        isMobile,
      }),
      [
        getSidebarState,
        setSidebarOpen,
        setSidebarOpenMobile,
        toggleSidebar,
        setSidebarWidth,
        isMobile,
      ]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": defaultSidebarWidth,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex h-full w-full has-[[data-variant=inset]]:bg-sidebar overflow-hidden",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    readonly side?: "left" | "right";
    readonly variant?: "sidebar" | "floating" | "inset";
    readonly collapsible?: "offcanvas" | "icon" | "none";
    readonly id?: string;
    readonly showSeparator?: boolean;
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      id,
      className,
      children,
      style,
      showSeparator = true,
      ...props
    },
    ref
  ) => {
    // Use provided id or generate one based on side
    const sidebarId = id || (side === "left" ? "default" : "right");
    const { isMobile, state, openMobile, setOpenMobile, sidebarWidth, setSidebarWidth } =
      useSidebar(sidebarId);

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <React.Suspense fallback={null}>
          <Sidebarsheet
            open={openMobile}
            onOpenChange={setOpenMobile}
            side={side}
            data-testid="sidebar-set-open-mobile-sheet"
            {...props}
          >
            {children}
          </Sidebarsheet>
        </React.Suspense>
      );
    }

    // Calculate width based on state and collapsible mode
    const getWidth = () => {
      if (state === "collapsed") {
        if (collapsible === "offcanvas") return "0px";
        if (collapsible === "icon") {
          const iconWidth = parseFloat(SIDEBAR_WIDTH_ICON);
          return variant === "floating" || variant === "inset"
            ? `${iconWidth + 16}px` // icon + spacing
            : SIDEBAR_WIDTH_ICON;
        }
      }
      return sidebarWidth;
    };

    const currentWidth = getWidth();
    const sidebarWidthNum = parseFloat(sidebarWidth);

    return (
      <div
        ref={ref}
        className="group peer hidden text-sidebar-foreground md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        style={style}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "relative bg-transparent transition-[width] duration-200 ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180"
          )}
          style={{ width: currentWidth }}
        />
        <div
          className={cn(
            "absolute inset-y-0 z-10 hidden h-full w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
            side === "left"
              ? state === "collapsed" && collapsible === "offcanvas"
                ? `left-[calc(${sidebarWidthNum}*-1px)]`
                : "left-0"
              : state === "collapsed" && collapsible === "offcanvas"
                ? `right-[calc(${sidebarWidthNum}*-1px)]`
                : "right-0",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2"
              : "group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          style={{ width: currentWidth }}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
          >
            {children}
            {/* Resize handle */}
            {showSeparator && (
              <div
                role="separator"
                aria-orientation="vertical"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startX = e.clientX;
                  const startWidth = parseFloat(sidebarWidth);
                  const onMove = (ev: MouseEvent) => {
                    const delta = side === "left" ? ev.clientX - startX : startX - ev.clientX;
                    const newWidth = Math.max(280, Math.min(640, startWidth + delta));
                    setSidebarWidth(`${Math.round(newWidth)}px`);
                  };
                  const onUp = () => {
                    window.removeEventListener("mousemove", onMove);
                    window.removeEventListener("mouseup", onUp);
                  };
                  window.addEventListener("mousemove", onMove);
                  window.addEventListener("mouseup", onUp);
                }}
                className={cn(
                  "absolute top-0 bottom-0 w-1 cursor-col-resize opacity-0 transition-opacity hover:opacity-100",
                  side === "left" ? "right-0" : "left-0"
                )}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<
  React.ComponentRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & {
    readonly sidebarId?: string;
  }
>(({ className, onClick, sidebarId, ...props }, ref) => {
  const { toggleSidebar } = useSidebar(sidebarId);

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {props.children || (
        <>
          <PanelLeft />
          <span className="sr-only">Toggle Sidebar</span>
        </>
      )}
    </Button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    readonly sidebarId?: string;
  }
>(({ className, sidebarId, ...props }, ref) => {
  const { toggleSidebar } = useSidebar(sidebarId);

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      data-testid="sidebar-toggle-sidebar-btn"
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(
  ({ className, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          "relative flex w-full flex-1 flex-col bg-background",
          "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
          className
        )}
        {...props}
      />
    );
  }
);
SidebarInset.displayName = "SidebarInset";

const SidebarInput = React.forwardRef<
  React.ComponentRef<typeof Input>,
  React.ComponentPropsWithoutRef<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      data-testid="sidebar-input"
      {...props}
    />
  );
});
SidebarInput.displayName = "SidebarInput";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="header"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
      />
    );
  }
);
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="footer"
        className={cn("flex flex-col gap-2 p-2", className)}
        {...props}
      />
    );
  }
);
SidebarFooter.displayName = "SidebarFooter";

function SidebarSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Separator>) {
  return (
    <Separator
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  );
}
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="content"
        className={cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
          className
        )}
        {...props}
      />
    );
  }
);
SidebarContent.displayName = "SidebarContent";

const SidebarGroup = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-sidebar="group"
        className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
        {...props}
      />
    );
  }
);
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { readonly asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-lg px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { readonly asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-lg p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";

const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
);
SidebarGroupContent.displayName = "SidebarGroupContent";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
);
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
);
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-lg p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    readonly asChild?: boolean;
    readonly isActive?: boolean;
    readonly tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot.Root : "button";
    const { isMobile, state } = useSidebar();

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild data-testid="sidebar-tooltip-trigger">
          {button}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    readonly asChild?: boolean;
    readonly showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-lg p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

const SidebarMenuBadge = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-lg px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    readonly showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${(getCryptoRandomValue() % 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-lg px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-lg" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
);
SidebarMenuSub.displayName = "SidebarMenuSub";

const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(
  ({ ...props }, ref) => <li ref={ref} {...props} />
);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    readonly asChild?: boolean;
    readonly size?: "sm" | "md";
    readonly isActive?: boolean;
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-lg px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
