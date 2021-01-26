import React, { useEffect, useState } from 'react';
import './Navbar.css'
import logo from '../../assets/images/emumba-logo.png';
import mobileLogo from '../../assets/images/mobile-logo.png';
import { Button, makeStyles, TextField, InputAdornment } from "@material-ui/core"
import { Search } from '@material-ui/icons';
import { authenticateAccessToken } from '../../utils';
import useGithHubApi from '../../hooks/useGithHubApi';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { userAuthorizationSuccess, moveToHomeScreen } from '../../redux/actions/userActions'
import { searchGist } from '../../redux/actions/gistsActions'
import PropTypes from 'prop-types';
import AvatarButton from '../AvatarButton';


const useStyles = makeStyles({
    button: {
        backgroundColor: 'white',

        color: '#68C89A',
        '&:hover': {
            textDecoration: 'underline',
            backgroundColor: "white"
        },

    },
    search: {
        marginRight: '3em',

    },
    searchIcon: {
        cursor: 'pointer'

    }
});



const Navbar = (props) => {

    const {
        isLoggedin,
        moveToHomeScreen,
        userAuthorizationSuccess,
        searchGist
    } = props


    const [searchValue, setSearchValue] = useState('');
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth
    })
    const [redirectToSearch, setRedirectToSearch] = useState(false);
    const { getUserData } = useGithHubApi('');


    const handleSearchClick = async () => {
        await setRedirectToSearch(true);
        setRedirectToSearch(false);
        setSearchValue('');
    }

    const handleLogoClick = async () => {
        moveToHomeScreen(false);
    }


    const authorization = async (token) => {
        const userData = await getUserData(token);
        const auth = { accessToken: token, user: userData }
        userAuthorizationSuccess(auth);
    }


    useEffect(() => {

        const token = authenticateAccessToken()

        if (token) {
            !isLoggedin && authorization(token);
        }

        const handleResize = () => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        }

        window.addEventListener('resize', handleResize)

    }, [isLoggedin])


    const redirectSearchScreen = () => {
        return <Redirect to={`/GistDetail/${searchValue}`} />
    }



    const classes = useStyles()
    return (
        <div className="container">
            <a onClick={() => handleLogoClick()}> <img src={dimensions.width < 565 ? mobileLogo : logo} className="navbar-logo" /></a>


            <div className="navbar-right">

                <TextField
                    id="outlined-search"
                    label="Search Notes"
                    type="search"
                    variant="outlined"
                    size="small"
                    className={classes.search}
                    color="secondary"
                    value={searchValue}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <a onClick={handleSearchClick} className={classes.searchIcon} >
                                    <Search color="secondary" />
                                </a>
                            </InputAdornment>
                        ),
                    }}
                    onChange={(event) => { setSearchValue(event.target.value); searchGist(event.target.value) }}
                />

                {
                    (isLoggedin) ?
                        <AvatarButton />
                        :
                        <Button className={classes.button} href="https://github.com/login/oauth/authorize?client_id=523f6307ec061d563a89" >Login</Button>

                }

            </div>
            {redirectToSearch && redirectSearchScreen()}

        </div>
    );
}

Navbar.propTypes = {
    isLoggedin: PropTypes.bool,
    moveToHomeScreen: PropTypes.func,
    userAuthorizationSuccess: PropTypes.func,
}

const mapStateToProps = state => {
    return {
        isLoggedin: state.user.isLoggedin,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userAuthorizationSuccess: (val) => dispatch(userAuthorizationSuccess(val)),
        moveToHomeScreen: () => dispatch(moveToHomeScreen()),
        searchGist: (id) => dispatch(searchGist(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);