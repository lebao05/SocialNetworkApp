import { useState, useEffect } from "react";
import { getPersonalInfoApi } from "../apis/userApi";

export function usePersonalInfo(userId) {
    const [personalInfo, setPersonalInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchInfo = async () => {
            try {
                setLoading(true);
                const data = await getPersonalInfoApi(userId);
                setPersonalInfo(data);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [userId]);

    return { personalInfo, loading, error, setPersonalInfo };
}
