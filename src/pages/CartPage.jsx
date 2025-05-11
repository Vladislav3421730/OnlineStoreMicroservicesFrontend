import { useState, useEffect } from "react";
import { getUserData } from "../apiMarket";
import { FadeLoader } from "react-spinners";
import { CustomModal } from "../components/CustomModal";
import { CartInBusket } from "../components/CartInBusket/CartInBusket";
import { Address } from "../components/Adress";

const CartPage = () => {
    const [user, setUser] = useState(null);
    const [carts, setCarts] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        getUserData(setUser, setCarts)
    }, []);

    const updateCart = (updatedCart) => {
        setCarts((prevCarts) => {
            if (updatedCart.amount === 0) {
                return prevCarts.filter((cart) => cart.id !== updatedCart.id);
            }
            return prevCarts.map((cart) =>
                cart.id === updatedCart.id ? updatedCart : cart
            );
        });
    };

    if (!user) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50vh" }}
            >
                <FadeLoader height={16} radius={6} width={5} />
            </div>
        );
    }

    const totalCoast = carts
        .map((cart) => cart.product.price * (1- (cart.product.discount /100)) * cart.amount )
        .reduce((total, currentPrice) => total + currentPrice, 0)
        .toFixed(2)

    const addresses = [
        ...new Map(user.orders.map((order) => JSON.stringify(order.address)).map((e) => [e, e])).values()
    ].map((e) => JSON.parse(e));


    return (
        <div className="container-fluid mt-4">
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <CustomModal open={open} onClose={() => setOpen(false)}>
                <Address
                    setError={setError}
                    setMessage={setMessage}
                    addresses={addresses}
                    totalCoast={totalCoast}
                    setOpen={setOpen}
                    setCarts={setCarts}
                />
            </CustomModal>
            {carts.length === 0 ? (
                <h1>В вашей корзине пока нет товаров</h1>
            ) : (
                <div className="row">
                    <div className="col-lg-1 col-md-0"></div>
                    <div className="col-lg-10 col-md-12">
                        {(user.isLoyal)
                            && <h2>Вы есть в системе лояльности, ваша скидка 10%</h2>}
                        <div className="row">
                            {carts.map((cart, index) => (
                                <div key={cart.id} className="col-lg-3 col-md-4 col-sm-6">
                                    <CartInBusket
                                        cart={cart}
                                        index={index}
                                        updateCart={updateCart}
                                    />
                                </div>
                            ))}
                        </div>
                        <div class="mt-2 mb-2 d-flex">
                            <button type="button" onClick={() => setOpen(true)} className="btn btn-primary mx-3">
                                {user.isLoyal ? (
                                    <>
                                        <span className="text-decoration-line-through me-2">
                                            {totalCoast} BYN
                                        </span>
                                        <strong> {(totalCoast * 0.9).toFixed(2)} BYN </strong>
                                    </>
                                ) : (
                                    <>
                                        {totalCoast} BYN
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-1 col-md-0"></div>
                </div>
            )}
        </div>
    );
};

export { CartPage };
