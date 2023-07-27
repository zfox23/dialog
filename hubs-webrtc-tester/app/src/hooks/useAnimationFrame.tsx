import React, { useEffect, useRef } from 'react';

export const useAnimationFrame = (callback, deps: any[] = []) => {
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();

    const animate = time => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current;
            callback(deltaTime);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    }

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, deps); // Make sure the effect runs only once
}