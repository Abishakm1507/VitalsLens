import { ReactNode } from "react";

interface MobileFrameProps {
  children: ReactNode;
  showNav?: boolean;
}

const MobileFrame = ({ children, showNav = false }: MobileFrameProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] h-[844px] bg-background rounded-[40px] shadow-elevated overflow-hidden relative border-8 border-foreground/10">
        {/* Status bar */}
        <div className="h-11 bg-background flex items-center justify-between px-6 pt-2">
          <span className="text-caption font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex items-end gap-[2px]">
              <div className="w-1 h-1 bg-foreground rounded-full" />
              <div className="w-1 h-2 bg-foreground rounded-full" />
              <div className="w-1 h-3 bg-foreground rounded-full" />
              <div className="w-1 h-3.5 bg-foreground rounded-full" />
            </div>
            <span className="text-caption font-medium ml-1">5G</span>
            <div className="w-6 h-3 border border-foreground rounded-sm ml-1 relative">
              <div className="absolute inset-[2px] right-1 bg-foreground rounded-[1px]" />
              <div className="absolute right-[-3px] top-1/2 -translate-y-1/2 w-[2px] h-1 bg-foreground rounded-r-sm" />
            </div>
          </div>
        </div>
        
        {/* Content area */}
        <div className={`h-[calc(100%-44px)] ${showNav ? 'pb-20' : ''} overflow-y-auto`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
