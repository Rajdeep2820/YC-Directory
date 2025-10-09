import React from "react";

const Ping = () => {
    return (
        <div className="relative">
            <div className="absolute right-1 top-1">
                <div className="flex size-[11px]">
                    <span className="absolute inline w-full h-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex size-[11px] rounded-full bg-primary"></span>
                </div>
            </div>
        </div>
    );
}

export default Ping;