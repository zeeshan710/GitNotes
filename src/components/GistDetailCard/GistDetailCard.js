import React, { useState, useEffect, Fragment } from 'react';
import { Avatar, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Card, CardActions, CardContent, Button, TextareaAutosize, CircularProgress } from '@material-ui/core';
import { StarBorder, Share, Code, DeleteForever, EditOutlined } from '@material-ui/icons';
import useGithHubApi from '../../hooks/useGithHubApi';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import { moveToGistScreen, } from '../../redux/actions/userActions'
import { setLoading, checkUserGist } from '../../redux/actions/gistsActions';
import PropTypes from 'prop-types';

const R = require('ramda')

const useStyles = makeStyles((theme) => ({
    containerMargin: {
        marginTop: '2em',
        marginBottom: '1em'
    },
    avatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),

    },
    gistcardHead: {
        display: Grid,

    },
    heading: {

        color: '#2889FD',
        fontWeight: "bold",
        fontSize: 16,
        display: 'flex'
    },
    subHeading: {
        color: 'gray',
        fontSize: 'small'
    },
    icon: {
        color: '#2889FD',
        cursor: "pointer"


    },
    iconText: {
        color: '#2889FD',
        marginRight: '1em',
        cursor: "pointer"

    },
    iconContainer: {
        display: "grid",
        justifyContent: 'flex-end'
    },
    secondaryIconStyle: {
        color: '#FEBD32',
        cursor: "pointer"
    },

    card: {
        marginTop: '0.5em',
        width: '100%',
        cursor: "pointer"
    },
    profileCardHeading: {
        color: '#2889FD',
        fontSize: 16,

    },
    disableNotebo0k: {

        backgroundColor: 'white',
        borderColor: 'white',
        color: 'gray',
    },
    notebook: {
        color: '#2889FD',
        cursor: "pointer",
        paddingLeft: '0.7em'
    },
    content: {
        width: '100%',
        backgroundColor: 'white',
        borderColor: 'white',

    },

    update: {
        color: 'white'
    }

}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}



function GistDetailCard(props) {

    const { onProfileScreen, moveToGistScreen, token, loading, setLoading, isUserGist, checkUserGist } = props
    const { owner, created_at, files, id, description } = props.data;
    const date = created_at.split('T');
    const { login, avatar_url } = owner;
    const classes = useStyles();
    const { starGist, forkGist, getGistContent, checkstarredGist, unStarGist, deleteGist, updateGist } = useGithHubApi();


    const [open, setOpen] = useState(false);
    const [openForkWarning, setOpenForkWarning] = useState(false);
    const [isforked, setforked] = useState(false);
    const [isStarred, setisStarred] = useState(false);
    const [isDeleted, setisDeleted] = useState(false);
    const [code, setCode] = useState("");
    const [disableEdit, setDisableEdit] = useState(true);

    const [isStarLoading, setIsStarLoading] = useState(true);
    const [deleteIconLoading, setDeleteIconLoading] = useState(false);
    const [disableUpdate, setdisableUpdate] = useState(false);
    const [redirectGistDetail, setRedirectGistDetail] = useState(false);

    let notebook;
    let raw_url;

    const getNotebookdata = val => {
        notebook = val.filename;
        raw_url = val.raw_url
    }
    R.map(getNotebookdata, files);

    useEffect(() => {

        !onProfileScreen && checkUserGist(owner.id);
        checkstarGist();


    }, []);


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setOpenForkWarning(false);
        setforked(false);
    };

    const handleStarClick = async () => {

        if (token) {

            if (!isStarred) {
                const status = await starGist(id, token);
                status === 204 && setisStarred(true);
            }
            else {
                const status = await unStarGist(id, token);
                status === 204 && setisStarred(false);
            }
        }
        else {
            setOpen(true);
        }

    }

    const handleForkClick = async () => {
        setLoading(true);

        if (isUserGist) {
            setOpenForkWarning(true);
            setLoading(false);
        }
        else {
            if (token) {


                const forkResponse = await forkGist(id, token);
                forkResponse.message ? alert("Network issue Fork Request failed") : setforked(true);
                setLoading(false);
            }
            else {
                setOpen(true);
                setLoading(false);
            }
        }

    }
    const handleEditClick = () => {
        setDisableEdit(false);
    }

    const onUpdateClick = async () => {
        setdisableUpdate(true);

        const status = await updateGist(id, token, notebook, code);
        status === 200 && setDisableEdit(true);
        setdisableUpdate(false);
    }

    const handleDeleteClick = async () => {
        setDeleteIconLoading(true)
        const status = await deleteGist(id, token);

        if (status === 204) {
            setTimeout(() => {
                setDeleteIconLoading(false)
                setisDeleted(true);
            }, 3000)

        }
    }

    const renderEditDeleteOption = () => {
        return (
            <Fragment >
                <EditOutlined className={classes.icon} onClick={() => handleEditClick()} />

                <Typography className={classes.iconText} >edit</Typography>

                {
                    deleteIconLoading ? <CircularProgress size={'1.5em'} />
                        :
                        <DeleteForever className={classes.icon} onClick={() => handleDeleteClick()} />
                }

                <Typography className={classes.iconText}>delete</Typography>

            </Fragment>)
    }



    const redirectOnDelete = () => {
        return (<Redirect to="/profile" />)
    }

    const renderUpdateButton = () => {
        return (
            <CardActions>
                <Button size="small" variant="contained" color='primary' className={classes.update} onClick={() => onUpdateClick()} disabled={disableUpdate}>
                    Update
                </Button>
            </CardActions>
        );
    }
    const checkstarGist = async () => {
        const fetchData = await checkstarredGist(id, token)

        if (fetchData === 204) {
            setisStarred(true);

        }
        if (!onProfileScreen) {
            const contentData = await getGistContent(raw_url)

            setCode(contentData)

        }
        setIsStarLoading(false);
    }

    const handleContetnClick = () => {
        moveToGistScreen(true)
        setRedirectGistDetail(true);

    }

    const renderGistDetailCard = () => {
        return (
            <Fragment>
                {!isStarLoading &&

                    <div >

                        <Grid container wrap="nowrap" spacing={2} className={classes.containerMargin}>
                            <Grid item >
                                <Avatar alt={login} src={avatar_url} className={classes.avatar} />
                            </Grid>
                            <Grid item xs={10} >
                                {
                                    !onProfileScreen ?

                                        <Typography className={classes.heading}>{login}</Typography>
                                        :
                                        <Typography className={classes.heading}>{`${login} /  `}  <Typography className={classes.profileCardHeading}>{` ${notebook}`}</Typography></Typography>

                                }
                                <Typography className={classes.subHeading}>Created At {date[0]}</Typography>
                            </Grid>

                            <Grid item xs={7} className={classes.iconContainer} >
                                <Grid container item  >

                                    {isUserGist && !onProfileScreen && renderEditDeleteOption()}

                                    <StarBorder onClick={() => handleStarClick()} className={isStarred ? classes.secondaryIconStyle : classes.icon} />

                                    <Typography className={isStarred ? `${classes.secondaryIconStyle} ${classes.iconText}` : classes.iconText} >star</Typography>

                                    {!onProfileScreen && !isUserGist ?
                                        loading ?

                                            <CircularProgress size={'1.5em'} />
                                            :
                                            <Fragment>
                                                <Share onClick={() => handleForkClick()} className={classes.icon} />
                                                <Typography className={classes.iconText} >Fork</Typography>
                                            </Fragment>
                                        :
                                        null

                                    }

                                </Grid>

                            </Grid>

                        </Grid>

                        <Card className={classes.card}  >

                            {!onProfileScreen ?

                                <CardContent>
                                    <Grid container item xs={6} direction="row" alignItems="center" >
                                        <Code />
                                        <Grid>
                                            <Typography className={disableEdit ? classes.notebook : classes.disableNotebook}>{notebook}</Typography>
                                        </Grid>

                                    </Grid>

                                    <hr />
                                    <TextareaAutosize

                                        disabled={disableEdit}
                                        rowsMax={props.rowsMax}
                                        className={classes.content}
                                        defaultValue={code}
                                        onChange={(event) => { setCode(event.target.value) }}
                                    />

                                </CardContent>
                                :
                                <a onClick={() => handleContetnClick()} className={classes.card}>
                                    <CardContent >

                                        <Typography className={classes.subHeading} >{description}</Typography>

                                    </CardContent>
                                </a>
                            }
                            {!disableEdit && renderUpdateButton()}

                        </Card>

                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="warning">
                                Please Login First !
                            </Alert>
                        </Snackbar>

                        <Snackbar open={openForkWarning} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="warning">
                                You cannot Fork your own gist
                            </Alert>
                        </Snackbar>
                        <Snackbar open={isforked} autoHideDuration={6000} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="Success">
                                Gist Forked !!
                            </Alert>
                        </Snackbar>

                        {isDeleted && redirectOnDelete()}

                    </div>
                }

            </Fragment>
        )
    }


    return (
        <Fragment>
            { isStarLoading ?
                <div className="spinner">
                    <CircularProgress style={{ marginLeft: '45%', marginTop: '17.3%' }} />
                </div>
                : renderGistDetailCard()}
            {redirectGistDetail && <Redirect to={`GistDetail/${id}`} />}
        </Fragment>


    );
}

GistDetailCard.propTypes = {
    onProfileScreen: PropTypes.bool,
    moveToGistScreen: PropTypes.func,
    token: PropTypes.string,
    loading: PropTypes.bool,
    setLoading: PropTypes.func,
    isUserGist: PropTypes.bool
}

const mapStateToProps = state => {
    return {
        onProfileScreen: state.user.onProfileScreen,
        token: state.user.accessToken,
        loading: state.loading.status,
        isUserGist: state.gist.isUserGist,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        moveToGistScreen: (val) => dispatch(moveToGistScreen(val)),
        checkUserGist: (id) => dispatch(checkUserGist(id)),
        setLoading: (val) => dispatch(setLoading(val)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GistDetailCard);