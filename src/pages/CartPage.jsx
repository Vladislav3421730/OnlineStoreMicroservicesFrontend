import { useState,useEffect } from "react";
import { getUserData } from "../api";
import { FadeLoader } from "react-spinners";

const CartPage = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserData(setUser);
    }, []);

    if (!user) {
        return
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
            <FadeLoader height={16} radius={6} width={5} />
        </div>
    }

    return (
        <div className="container mt-4">
        {user.carts.length === 0 ? (
            <h1>В вашей корзине пока нет товаров</h1>
        ) : (
            
        )}
        </div>
    )
}

export { CartPage }