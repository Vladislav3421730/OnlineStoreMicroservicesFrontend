import { useState } from "react";
import { api } from "../apiMarket";

const Address = ({ addresses, totalCoast,setCarts, setError, setMessage, setOpen }) => {
    const [address, setAddress] = useState({
        id: 0,
        region: "",
        town: "",
        exactAddress: "",
        postalCode: "",
    });

    const handleSelectChange = (e) => {
        const selectedAddress = addresses.find(addr => JSON.stringify(addr) === e.target.value);
        if (selectedAddress) {
            setAddress(selectedAddress);
        }
        else setAddress({
            id: 0,
            region: "",
            town: "",
            exactAddress: "",
            postalCode: "",
        });
    };

    const handleInputChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
        const response = await api.post(`cart`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            address: address,
            totalCoast : totalCoast
        })
        setError("")
        setMessage(response.data.message)
        setCarts([])
        }
        catch(error){
            console.error(error.response.data)
            setError(error.response.data.message)
        }
        finally{
            setOpen(false)
        }
    };

    return (
        <>
            {addresses.length > 0 && (
                <select className="form-select" onChange={handleSelectChange}>
                    <option value="">Выберите адрес</option>
                    {addresses.map((addr, index) => (
                        <option key={index} value={JSON.stringify(addr)}>
                            {addr.region}, {addr.town}, {addr.exactAddress}, {addr.postalCode}
                        </option>
                    ))}
                </select>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group mb-2 mt-2">
                    <label htmlFor="region">Регион</label>
                    <input
                        type="text"
                        className="form-control mt-1"
                        name="region"
                        id="region"
                        placeholder="Введите регион"
                        value={address.region}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="town">Город</label>
                    <input
                        type="text"
                        className="form-control mt-1"
                        name="town"
                        id="town"
                        placeholder="Введите город"
                        value={address.town}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="exactAddress">Адрес</label>
                    <input
                        type="text"
                        className="form-control mt-1"
                        name="exactAddress"
                        id="exactAddress"
                        placeholder="Введите точный адрес"
                        value={address.exactAddress}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group mb-2">
                    <label htmlFor="postalCode">Введите почтовый индекс</label>
                    <input
                        type="text"
                        className="form-control mt-1"
                        name="postalCode"
                        id="postalCode"
                        placeholder="Введите почтовый индекс"
                        value={address.postalCode}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">
                    Сделать заказ
                </button>
            </form>
        </>
    );
};

export { Address };
