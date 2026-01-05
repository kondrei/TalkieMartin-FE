import { useState, useCallback } from "react";


export function useApiFetch() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async (url: string, options?: RequestInit) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(` ${data?.message || 'Unknown error'} Status code: ${response.status}`);
            }

            setLoading(false);
            return data;
        } catch (err) {
            const error = err instanceof Error ? err : new Error('An error occurred');
            setError(error);
            setLoading(false);
            return null;
        }
    }, []);

    return { fetchData, loading, error };
}   