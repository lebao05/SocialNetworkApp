import { useState, useEffect } from "react";
import {
    getUserSchoolsApi,
    addSchoolApi,
    updateSchoolApi,
    deleteSchoolApi
} from "../apis/schoolApi";

export function useSchools(userId) {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Tự động lấy danh sách trường học khi userId thay đổi
    useEffect(() => {
        if (!userId) return;
        fetchSchools();
    }, [userId]);
    const fetchSchools = async () => {
        try {
            setLoading(true);
            const data = await getUserSchoolsApi(userId);
            setSchools(data);
            setError(null);
        } catch (err) {
            setError(err.message || "Không thể tải danh sách trường học");
        } finally {
            setLoading(false);
        }
    };

    // Trả về dữ liệu kèm theo các hàm xử lý hành động
    return {
        schools,
        loading,
        error,
        fetchSchools,
        setSchools
    };
}