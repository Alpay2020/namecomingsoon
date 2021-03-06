import React, { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
    UserDispatchContext,
    UserStateContext,
} from '../context/user/UserContext';
import { LOGOUT } from '../context/user/UserContextProvider';
import { removeJWTToken } from '../utils/jwt-utils';
import CircularProgress from "@material-ui/core/CircularProgress";

function PrivateRoute({ component: Component, ...rest }) {
    const { authStatus, userData } = useContext(UserStateContext);
    const dispatch = useContext(UserDispatchContext);
    useEffect(() => {
        if (
            authStatus === 'SUCCESS' &&
            new Date().getTime() / 1000 >= userData.exp
        ) {
            removeJWTToken();
            dispatch({ type: LOGOUT });
        }
    });

    return (
        <Route
            {...rest}
            render={(props) => {

                if (authStatus === 'FAILED') {
                    return <Redirect to={'/login'} />;
                }
                if (authStatus === 'SUCCESS'){

                    if (new Date().getTime() / 1000 >= userData.exp) {
                        return <Redirect to={'/login'} />;
                    }

                    return <Component {...props} />;
                }
                return <CircularProgress />

            }}
        />
    );
}

export default PrivateRoute;