import React, { Fragment, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, TablePagination, makeStyles } from '@material-ui/core';
import './GistsTable.css'
import { Redirect } from 'react-router-dom'
import GisDetailCard from '../GistDetailCard';
import PropTypes from 'prop-types'
import { moveToGistScreen } from '../../redux/actions/userActions'
import { setVisitedPage, setGridData, fetchPublicGistsSucess } from '../../redux/actions/gistsActions';
import { connect } from 'react-redux';
import { fetchCall } from '../../utils';
const R = require('ramda')


const useStyles = makeStyles((theme) => ({
  tableHeaderCell: {
    color: 'gray',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  tableAvatarcell: {
    display: "grid",
    gridTemplateColumns: "4em auto",
    alignContent: 'center',
    alignItems: 'center',
    color: 'gray',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  gridLayout: {
    display: "grid",
    gridTemplateColumns: "31% 31% 31%",
    TemplateRows: "auto",
    width: '100%',
    gridGap: '2em',
    margin: '1em',

  }

}));


const GistsTable = (props) => {

  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const [id, setId] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState();


  const { publicGists, moveToGistScreen, gridData, layout, searchId, setVisitedPage, visitedPages, setGridData, fetchPublicGistsSucess } = props

  useEffect(() => {
    if (!visitedPages.includes(0)) {
      setVisitedPage(0)
      getPublicGistData();
    }
  }, [])


  const handleChangePage = async (event, newPage) => {

    setPage(newPage);
    if (!visitedPages.includes(newPage)) {
      getPublicGistData(newPage + 1);
      setVisitedPage(newPage);
    }
  };


  const renderRedirect = () => {
    return <Redirect to={`/GistDetail/${id}`} />
  }

  const gridItem = row => {
    return (
      <a onClick={() => {
        setId(row.id);
        setRedirect(true);
        moveToGistScreen(true)
      }}><GisDetailCard data={row} rowsMax={5} /></a>
    )

  }

  const renderGridLayout = () => {
    return (
      <div className={classes.gridLayout}>

        { !searchId.toString().trim() ? gridData.length > 0 && R.slice(page * 10, page * 10 + 10, R.map(gridItem, gridData))
          :
          R.map(gridItem, R.filter(matchId, gridData))

        }
      </div>
    )
  }

  const matchId = (row) => {
    return row.id === searchId
  }

  const mapRowData = async (data) => {
    const rowdata = []
    await data.map((item, index) => {

      const { owner, updated_at, files, id, } = item
      let avatar = owner.avatar_url;
      let name = owner.login;
      let dateTime = updated_at.split('T');
      let date = dateTime[0]
      let time = dateTime[1].slice(0, dateTime[1].length - 1);
      let keyword;
      let notebook;

      const getNotebookdata = val => {
        keyword = val.language
        notebook = val.filename;

      }
      R.map(getNotebookdata, files);
      rowdata.push({ avatar, name, date, time, keyword, notebook, id });
    })
    return (rowdata);
  }

  const getPublicGistData = async (page = 1) => {

    setLoading(true);
    console.log("page Number", page)
    const data = await fetchCall(`https://api.github.com/gists/public?page=${page}&per_page=10`, { mode: 'cors' });
    console.log(data);
    setGridData(data.response)
    if (data.status === 403) {
      alert("API LIMIT EXCEEDED")
    }
    else {
      const rowData = await mapRowData(data.response);
      fetchPublicGistsSucess(rowData);
      setLoading(false);
    }

  }

  const renderTableLayout = () => {
    return (
      <Table aria-label="simple table"  >
        <TableHead className="table-header">
          <TableRow >
            <TableCell className={classes.tableHeaderCell} align="left">Name</TableCell>
            <TableCell className={classes.tableHeaderCell} align="left">Date</TableCell>
            <TableCell className={classes.tableHeaderCell} align="left">Time</TableCell>
            <TableCell className={classes.tableHeaderCell} align="left">Keyword</TableCell>
            <TableCell className={classes.tableHeaderCell} align="left">Notebook Name</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>

          {
            !searchId.toString().trim() ? R.slice(page * 10, page * 10 + 10, R.map(tableItem, publicGists))
              : R.map(tableItem, R.filter(matchId, publicGists))
          }

        </TableBody>
      </Table>
    )
  }

  const tableItem = (row) => {
    return (<TableRow key={row.id} hover
      onClick={() => {
        moveToGistScreen(true)
        setRedirect(true);
        setId(row.id)
      }}
    >
      <TableCell component="th" scope="row" className={classes.tableAvatarcell}>
        <Avatar alt={row.name} src={row.avatar} />
        {row.name}
      </TableCell>
      <TableCell className={classes.tableHeaderCell} align="left">{row.date}</TableCell>
      <TableCell className={classes.tableHeaderCell} align="left">{row.time}</TableCell>
      <TableCell className={classes.tableHeaderCell} align="left">{row.keyword}</TableCell>
      <TableCell className={classes.tableHeaderCell} align="left" >{row.notebook}</TableCell>

    </TableRow>)
  }

  const renderTable = () => {
    return (<Fragment>
      {redirect ? renderRedirect() :
        <TableContainer component={Paper} >
          {layout === "grid" ? renderGridLayout() : renderTableLayout()
          }
          <TablePagination
            component="div"
            count={!searchId.toString().trim() ? 120 : 1}
            rowsPerPage={10}
            page={page}
            rowsPerPageOptions={false}
            onChangePage={handleChangePage}

          />

        </TableContainer>
      }
    </Fragment >)
  }

  return (
    <Fragment>
      {!loading && renderTable()}
    </Fragment>
  );
}

GistsTable.propTypes = {
  layout: PropTypes.string,
  publicGists: PropTypes.array,
  gridData: PropTypes.array,
  moveToGistScreen: PropTypes.func,
};


const mapStateToProps = state => {
  return {
    publicGists: state.gist.publicGists,
    gridData: state.gist.gridData,
    searchId: state.gist.searchId,
    visitedPages: state.gist.visitedPages
  }
}

const mapDispatchToProps = dispatch => {
  return {
    moveToGistScreen: (val) => dispatch(moveToGistScreen(val)),
    setVisitedPage: (pageNo) => dispatch(setVisitedPage(pageNo)),
    setGridData: (data) => dispatch(setGridData(data)),
    fetchPublicGistsSucess: (data) => dispatch(fetchPublicGistsSucess(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GistsTable);