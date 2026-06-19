import {Navigate} from "react-router-dom"
import {useAuthStore} from "../../store/authStore"


// For customer protected Route 
export const ProtectedRoute = ({children} : {children : React.ReactNode}) => {

    const {isAuthenticated} = useAuthStore()
    if (!isAuthenticated) return <Navigate to="/login" replace/>;

    return <>{children}</>
}

export const AdminRoute = ({children} : {children : React.ReactNode}) => {
    const {isAuthenticated, isAdmin} = useAuthStore()
    if(!isAuthenticated) return <Navigate to={"/login"} replace/>
    if(!isAdmin) return <Navigate to={"/"} replace/>

    return <>{children}</>
}