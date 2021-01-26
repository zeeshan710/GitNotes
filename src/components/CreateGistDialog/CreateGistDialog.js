import React, { useState, Fragment } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogTitle, DialogContent, Snackbar } from "@material-ui/core"
import { authenticateAccessToken } from '../../utils';
import useGithHubApi from '../../hooks/useGithHubApi';
import MuiAlert from '@material-ui/lab/Alert';


const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function CreateGistDialog(props) {

    const { openDialog, handleCloseDialog } = props

    const [filename, setFilename] = useState('');
    const [content, setContent] = useState('');
    const [description, setDescription] = useState('');
    const [disableCreate, setDisableCreate] = useState(false);
    const [createAlert, setCreateAlert] = useState(false);
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const { createGist } = useGithHubApi('');


    const onCreateClick = async () => {
        setDisableCreate(true)
        if (!filename.toString().trim() || !content.toString().trim() || !description.toString().trim()) {

            setCreateAlert(true)
            setDisableCreate(false);
        }
        else {
            const token = await authenticateAccessToken()
            const status = await createGist(token, filename, content, description);
            status === 201 && setOpenSuccessAlert(true);
            setFilename('');
            setContent('');
            setDescription('');
            props.handleCloseDialog();
            setDisableCreate(false);
        }
    }

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccessAlert(false);
        setCreateAlert(false);
    };

    return (
        <Fragment>
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Create Gist</DialogTitle>
                <DialogContent>

                    <TextField
                        autoFocus
                        margin="dense"
                        id="filename"
                        label="File Name"
                        type="email"
                        fullWidth
                        onChange={(event) => setFilename(event.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="content"
                        label="content"
                        type="text"
                        multiline
                        rows={8}
                        fullWidth
                        onChange={(event) => setContent(event.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="discription"
                        label="description"
                        type="text"
                        multiline
                        rows={8}
                        fullWidth
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleCloseDialog} color="primary">
                        Cancel
                            </Button>
                    <Button variant={disableCreate ? 'outlined' : 'contained'} onClick={onCreateClick} disabled={disableCreate} color="primary">
                        Create Gist
                            </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openSuccessAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="success">
                    Gist Created !!
                    </Alert>
            </Snackbar>
            <Snackbar open={createAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="warning">
                    Please Fill all the fields
                    </Alert>
            </Snackbar>
        </Fragment>

    );
}



export default CreateGistDialog;