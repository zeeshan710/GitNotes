import React, { Fragment, useRef, useState } from 'react';
import { MenuList, MenuItem, Avatar, Grow, Paper, Popper, ClickAwayListener } from "@material-ui/core";
import { connect } from 'react-redux';
import { userloggedout, moveToProfileScreenSuccess, moveToHomeScreen } from '../../redux/actions/userActions'
import { Redirect } from 'react-router-dom';
import CreateGistDialog from '../CreateGistDialog'

function AvatarButton(props) {
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const { userDetail, routeName, onProfileScreen, moveToHomeScreen, moveToProfileScreenSuccess, onHomeScreen, userloggedout } = props
    const { login, avatar_url } = userDetail

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    const handleClosePoper = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleYourGistClick = async () => {
        onProfileScreen ? moveToHomeScreen() : moveToProfileScreenSuccess();
        setOpen(false);
    };

    const redirectProfileScreen = () => {


        return <Redirect to="/profile" />
    }
    const redirectHomecreen = () => {

        return <Redirect to="/" />
    }
    const signOut = () => {
        userloggedout();
        sessionStorage.removeItem("accessToken");
        handleToggle();

    };
    const handleCreatgistClick = () => {
        handleToggle();
        setOpenDialog(true);
    }


    return (

        <Fragment>
            <Avatar ref={anchorRef} alt={login} src={avatar_url} sizes='' onClick={handleToggle} style={{ cursor: 'pointer' }} />
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClosePoper}>

                                <MenuList autoFocusItem={open} id="menu-list-grow" >
                                    <MenuItem onClick={handleToggle} style={{ borderBottom: "2px solid rgb(212, 212, 212)" }}>Sign in as {login}</MenuItem>
                                    <MenuItem onClick={handleYourGistClick}>{routeName} </MenuItem>
                                    <MenuItem onClick={handleCreatgistClick}>Create gist</MenuItem>
                                    <MenuItem onClick={handleToggle} style={{ borderTop: "2px solid rgb(212, 212, 212)" }}><a href="https://github.com/mirzazeeshan-emumba" className='link'>Your Github Profile</a></MenuItem>
                                    <MenuItem onClick={signOut}>Sign out</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            {onHomeScreen && redirectHomecreen()}
            {onProfileScreen && redirectProfileScreen()}
            <CreateGistDialog openDialog={openDialog} handleCloseDialog={handleCloseDialog} />
        </Fragment>


    );
}

const mapStateToProps = state => {
    return {
        userDetail: state.user.userDetail,
        routeName: state.user.routeName,
        onProfileScreen: state.user.onProfileScreen,
        onHomeScreen: state.user.onHomeScreen,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        moveToProfileScreenSuccess: () => dispatch(moveToProfileScreenSuccess()),
        moveToHomeScreen: () => dispatch(moveToHomeScreen()),
        userloggedout: () => dispatch(userloggedout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvatarButton);