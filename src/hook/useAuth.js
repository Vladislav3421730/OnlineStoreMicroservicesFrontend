import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../apiMarket";

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isManager, setIsManager] = useState(false);
    const [isAuthorized, setAuthorized] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
                setIsFetching(false);
                return;
            }
            try {
                const response = await api.get("profile", {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setAuthorized(true);
                setUser(response.data);
                setIsAdmin(response.data.roleSet.includes("ROLE_ADMIN"));
                setIsManager(response.data.roleSet.includes("ROLE_MANAGER"));
            } catch (error) {
                console.error("Ошибка при получении пользователя:", error);
                navigate("/");
            } finally {
                setIsFetching(false);
            }
        };
        fetchUser();
    }, [navigate]);

    return { user, isAdmin, isManager, isAuthorized, isFetching };
};

export { useAuth };
