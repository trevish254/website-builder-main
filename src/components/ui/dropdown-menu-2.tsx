'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'; // Check if importing as * works, or if I need separate imports. Usually @radix-ui/react-dropdown-menu.
// The user code uses 'radix-ui' which is likely a re-export or alias if they use it like that.
// BUT standard nextjs shadcn projects install @radix-ui/react-dropdown-menu.
// I will attempt to import from @radix-ui/react-dropdown-menu as is standard.
import * as DropdownMenuPrimitiveRadix from '@radix-ui/react-dropdown-menu';

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.Root>) {
    return <DropdownMenuPrimitiveRadix.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.Portal>) {
    return <DropdownMenuPrimitiveRadix.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.Trigger>) {
    return <DropdownMenuPrimitiveRadix.Trigger className="select-none" data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.SubTrigger> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitiveRadix.SubTrigger
            data-slot="dropdown-menu-sub-trigger"
            className={cn(
                'flex cursor-default gap-2 select-none items-center rounded-md px-2 py-1.5 text-sm outline-hidden',
                'focus:bg-accent focus:text-foreground',
                'data-[state=open]:bg-accent data-[state=open]:text-foreground',
                'data-[here=true]:bg-accent data-[here=true]:text-foreground',
                '[&>svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&>svg]:size-4 [&>svg]:shrink-0',
                inset && 'ps-8',
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRight data-slot="dropdown-menu-sub-trigger-indicator" className="ms-auto size-3.5! rtl:rotate-180" />
        </DropdownMenuPrimitiveRadix.SubTrigger>
    );
}

function DropdownMenuSubContent({
    className,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.SubContent>) {
    return (
        <DropdownMenuPrimitiveRadix.SubContent
            data-slot="dropdown-menu-sub-content"
            className={cn(
                'space-y-0.5 z-50 min-w-[8rem] overflow-hidden shadow-md shadow-black/5 rounded-md border border-border bg-popover text-popover-foreground p-2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuContent({
    className,
    sideOffset = 4,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.Content>) {
    return (
        <DropdownMenuPrimitiveRadix.Portal>
            <DropdownMenuPrimitiveRadix.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                className={cn(
                    'space-y-0.5 z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md shadow-black/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    className,
                )}
                {...props}
            />
        </DropdownMenuPrimitiveRadix.Portal>
    );
}

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.Group>) {
    return <DropdownMenuPrimitiveRadix.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuItem({
    className,
    inset,
    variant,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.Item> & {
    inset?: boolean;
    variant?: 'destructive';
}) {
    return (
        <DropdownMenuPrimitiveRadix.Item
            data-slot="dropdown-menu-item"
            className={cn(
                'text-foreground relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
                'focus:bg-accent focus:text-foreground',
                'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground',
                inset && 'ps-8',
                variant === 'destructive' &&
                'text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/5 focus:bg-destructive/5 data-[active=true]:bg-destructive/5',
                className,
            )}
            {...props}
        />
    );
}

function DropdownMenuCheckboxItem({
    className,
    children,
    checked,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.CheckboxItem>) {
    return (
        <DropdownMenuPrimitiveRadix.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            className={cn(
                'relative flex cursor-default select-none items-center rounded-md py-1.5 ps-8 pe-2 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
                className,
            )}
            checked={checked}
            {...props}
        >
            <span className="absolute start-2 flex h-3.5 w-3.5 items-center text-muted-foreground justify-center">
                <DropdownMenuPrimitiveRadix.ItemIndicator>
                    <Check className="h-4 w-4 text-primary" />
                </DropdownMenuPrimitiveRadix.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitiveRadix.CheckboxItem>
    );
}

function DropdownMenuRadioItem({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.RadioItem>) {
    return (
        <DropdownMenuPrimitiveRadix.RadioItem
            data-slot="dropdown-menu-radio-item"
            className={cn(
                'relative flex cursor-default select-none items-center rounded-md py-1.5 ps-6 pe-2 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <span className="absolute start-1.5 flex h-3.5 w-3.5 items-center justify-center">
                <DropdownMenuPrimitiveRadix.ItemIndicator>
                    <Circle className="h-1.5 w-1.5 fill-primary stroke-primary" />
                </DropdownMenuPrimitiveRadix.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitiveRadix.RadioItem>
    );
}

function DropdownMenuLabel({
    className,
    inset,
    ...props
}: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.Label> & {
    inset?: boolean;
}) {
    return (
        <DropdownMenuPrimitiveRadix.Label
            data-slot="dropdown-menu-label"
            className={cn('px-2 py-1.5 text-xs text-muted-foreground font-medium', inset && 'ps-8', className)}
            {...props}
        />
    );
}

function DropdownMenuRadioGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.RadioGroup>) {
    return <DropdownMenuPrimitiveRadix.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.Separator>) {
    return (
        <DropdownMenuPrimitiveRadix.Separator
            data-slot="dropdown-menu-separator"
            className={cn('-mx-2 my-1.5 h-px bg-muted', className)}
            {...props}
        />
    );
}

function DropdownMenuShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn('ms-auto text-xs tracking-widest opacity-60', className)}
            {...props}
        />
    );
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitiveRadix.Sub>) {
    return <DropdownMenuPrimitiveRadix.Sub data-slot="dropdown-menu-sub" {...props} />;
}

export {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
};
