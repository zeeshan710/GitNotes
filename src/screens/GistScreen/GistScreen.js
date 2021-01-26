import React, { useEffect, useState, Fragment } from 'react';
import GistDetailCard from '../../components/GistDetailCard';
import './GistScreen.css';
import useGithHubApi from '../../hooks/useGithHubApi';
import Alert from '@material-ui/lab/Alert';
import { CircularProgress } from '@material-ui/core';

const GistScreen = ({ match }) => {

  const { getGistById } = useGithHubApi('');
  const [gistData, setGistData] = useState(null);
  const gistId = match.params.id;
  const [loading, setLoading] = useState(true);

  const getGistDetail = async () => {
    const data = await getGistById(gistId);
    if (data.owner) {
      setGistData(data);
    }
    setLoading(false);
  }
  useEffect(() => {

    getGistDetail();
  }, []);

  return (
    <Fragment>
      {loading ? <div className="spinner"><CircularProgress style={{ marginLeft: '45%', marginTop: '20%' }} /></div> :
        <div className="gistscreen-container">
          {gistData ? <GistDetailCard data={gistData} /> : <Alert severity="info">No Gist Found</Alert>}
        </div>
      }
    </Fragment>
  );

}

export default GistScreen;