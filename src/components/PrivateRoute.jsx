import { Navigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth"

const PrivateRoute = ({children}) => {
    const {isAuthorized, isFetching, isManager} = useAuth()

    if (!isFetching && !isAuthorized) {
        window.location.href='/login'
        return;
    }

    if (!isFetching && !isManager) {
        window.location.href='/error403'
        return;
    }

    return children
}

export {PrivateRoute}