import { useState, useEffect } from "react";
import { getUserSchoolsApi } from "../apis/schoolApi";

export function useSchools(userId) {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchSchools = async () => {
            try {
                setLoading(true);
                const data = await getUserSchoolsApi(userId);
                setSchools(data);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchools();
    }, [userId]);

    return { schools, loading, error, setSchools };
}
