import React, { useEffect, useState } from 'react';
import { Avatar, Grid, Typography, Button, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { authenticateAccessToken } from '../../utils';
import GistDetailCard from '../../components/GistDetailCard';
import { connect } from 'react-redux';
import { moveToProfileScreenSuccess, userAuthorizationSuccess, myGistsData } from '../../redux/actions/userActions'
import PropTypes from 'prop-types';
const R = require('ramda');

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: "40em",
        width: "50em",
        display: "grid",
        justifyContent: "center",
        alignContent: "center",
        marginTop: '3em'
    },
    control: {
        padding: theme.spacing(2),
    },
    largeAvatar: {
        width: theme.spacing(20),
        height: theme.spacing(20),
    },
    username: {
        marginTop: '2em',
        marginBottom: '2em',
        fontWeight: 'bold'
    },
    cardMargin: {
        marginTop: '1em',

    },
    divider: {
        marginTop: '3em',
        marginRight: '2em'
    }
}));

function ProfileScreen(props) {

    const { myGists, userDetail, loading, moveToProfileScreenSuccess, myGistsData, isLoggedin } = props
    const { login, avatar_url, html_url } = userDetail

    const classes = useStyles();
    const [dimensions, setDimensions] = useState({

        width: window.innerWidth
    })

    const handleResize = () => {
        setDimensions({
            width: window.innerWidth
        })
    }

    useEffect(() => {
        const token = authenticateAccessToken()

        if (token && !isLoggedin) {
            moveToProfileScreenSuccess()
            userAuthorizationSuccess(token);

        }
        else {
            moveToProfileScreenSuccess()
            myGistsData();
        }

        window.addEventListener('resize', handleResize)
    }, [isLoggedin])

    const myGistItem = (item) => {
        return (<div className={classes.cardMargin}>

            <GistDetailCard data={item} rowsMax={7} />

        </div>)
    }

    return (
        <div>
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}>

                        <Grid item className={classes.paper}>

                            <Avatar alt={login} src={avatar_url} className={classes.largeAvatar} />
                            <Typography variant="h6" gutterBottom className={classes.username}>{login}</Typography>
                            <Button variant="outlined" color="primary" href={html_url}>View GitHub Profile</Button>

                        </Grid>
                        {dimensions.width > 1030 && <Divider orientation="vertical" flexItem className={classes.divider} />}
                        <Grid item xs={6}>

                            {!loading && myGists.length > 0 && R.map(myGistItem, myGists)}

                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

ProfileScreen.propTypes = {
    isLoggedin: PropTypes.bool,
    loading: PropTypes.bool,
    myGists: PropTypes.array,
    userDetail: PropTypes.object,
    moveToProfileScreenSuccess: PropTypes.func,

}

const mapStateToProps = state => {
    return {
        userDetail: state.user.userDetail,
        isLoggedin: state.user.isLoggedin,
        myGists: state.user.myGists,
        loading: state.loading.status
    }
}

const mapDispatchToProps = dispatch => {
    return {
        moveToProfileScreenSuccess: () => dispatch(moveToProfileScreenSuccess()),
        userAuthorizationSuccess: (val) => dispatch(userAuthorizationSuccess(val)),
        myGistsData: () => dispatch(myGistsData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);