"use client"
import React, { useEffect, useState } from "react";
import HomeLayout from "../(home)/layout";

const aiStudioUrl = process.env.AI_STUDIO_URL || "https://ai-design-studio-blush.vercel.app/";

const AIStudio = () => {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isHovered ? 'hidden' : 'auto';
    }, [isHovered]);
    return (
        <HomeLayout>
            <div className="w-full h-full">
                <iframe onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)} src={aiStudioUrl} width="100%" height="600" />
            </div>
        </HomeLayout>
    );
};

export default AIStudio;