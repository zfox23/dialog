import React, { useEffect, useState } from 'react';

export const useHeadings = () => {
    interface Headings {
        id: string;
        text: string;
        level: number;
    }

    const [headings, setHeadings] = useState<Headings[]>([]);
    useEffect(() => {
        const elements = Array.from(document.querySelectorAll("h2, h3, h4, h5, h6"))
            .filter((element) => element.id && element.id !== 'navigation')
            .map((element) => ({
                id: element.id,
                text: element.textContent ?? "",
                level: Number(element.tagName.substring(1))
            }));
        setHeadings(elements);
    }, []);
    return headings;
}