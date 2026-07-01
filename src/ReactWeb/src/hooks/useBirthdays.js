import { useState, useEffect, useCallback } from "react";
import { getTodayBirthdaysApi, getUpcomingBirthdaysApi } from "../apis/birthdayApi";

const MONTH_LABELS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MAX_PER_MONTH = 10;

export function useBirthdays() {
    const [todayBirthdays, setTodayBirthdays] = useState([]);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const [today, upcoming] = await Promise.all([
                getTodayBirthdaysApi(),
                getUpcomingBirthdaysApi(),
            ]);
            setTodayBirthdays(today ?? []);
            setUpcomingBirthdays(upcoming ?? []);
        } catch (err) {
            setError(err?.response?.data?.error ?? "Failed to load birthdays.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const monthlyBirthdays = MONTH_LABELS.map((label, index) => {
        const month = index + 1;
        const monthFriends = upcomingBirthdays
            .filter((p) => p.month === month)
            .sort((a, b) => a.day - b.day);

        return {
            month,
            label,
            totalCount: monthFriends.length,
            friends: monthFriends.slice(0, MAX_PER_MONTH),
        };
    }).filter((group) => group.totalCount > 0);

    const allBirthdays = [...todayBirthdays, ...upcomingBirthdays];

    return {
        todayBirthdays,
        upcomingBirthdays,
        monthlyBirthdays,
        allBirthdays,
        isLoading,
        error,
        refetch: fetchAll,
    };
}
