import React, { useEffect, useState } from 'react';

export const useHeadings = ( rootElement: Document | Element | undefined = document, filter = "h2, h3, h4, h5, h6" ) => {
    interface Headings {
        id: string;
        text: string;
        level: number;
    }

    const [headings, setHeadings] = useState<Headings[]>([]);
    useEffect(() => {
        const elements = Array.from(rootElement.querySelectorAll(filter))
            .filter((element) => element.id && element.id !== 'navigation')
            .map((element) => ({
                id: element.id,
                text: element.textContent ?? "",
                level: Number(element.tagName.substring(1))
            }));
        setHeadings(elements);
    }, [rootElement]);

    return headings;
}