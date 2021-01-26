import React, { useEffect, useState } from 'react';
import GistsTable from '../../components/GistsTable'
import './LoginScreen.css';
import { List, BorderAll } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';
import { Divider, Snackbar } from '@material-ui/core';
import queryString from 'query-string';
import useGithHubApi from "../../hooks/useGithHubApi";
import { connect } from 'react-redux';
import { userAuthorizationSuccess } from '../../redux/actions/userActions'
import PropTypes from 'prop-types'

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const LoginScreen = (props) => {
    const { userAuthorizationSuccess } = props
    const [layout, setLayout] = useState("table");
    const [alert, setAlert] = useState(false)
    const { getAccessToken, getUserData } = useGithHubApi("");

    const auhtorization = async () => {

        const parsed = queryString.parse(window.location.search);
        const data = await getAccessToken(parsed.code);

        if (!data) {
            setAlert(true)
        }
        else {
            const { token } = data;
            if (token) {
                const userData = await getUserData(token);
                sessionStorage.setItem('accessToken', token);
                const auth = { accessToken: token, user: userData }
                userAuthorizationSuccess(auth);
            }
        }
    }

    useEffect(() => {
        auhtorization();
    }, [])

    const handleBorderLayoutClick = () => {
        setLayout("grid")
    }
    const handleTableLayoutClick = () => {
        setLayout("table")
    }
    const handleCloseAlert = () => {
        setAlert(false);
    }


    return (
        <div className="table-container" >
            <div className="icons">
                <div className="box-icon">
                    <BorderAll color="primary" fontSize="medium" onClick={handleBorderLayoutClick} />
                </div>
                <Divider orientation="vertical" flexItem />
                <div className="list-icon">
                    <List color="primary" fontSize="large" onClick={handleTableLayoutClick} />
                </div>

            </div>
            <GistsTable layout={layout} />
            <Snackbar open={alert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="info">
                    Turn on the CORS
                    </Alert>
            </Snackbar>
        </div>
    );
}

LoginScreen.propTypes = {
    userAuthorizationSuccess: PropTypes.func
}

const mapDispatchToProps = dispatch => {
    return {
        userAuthorizationSuccess: (val) => dispatch(userAuthorizationSuccess(val))
    }
}

export default connect(null, mapDispatchToProps)(LoginScreen);