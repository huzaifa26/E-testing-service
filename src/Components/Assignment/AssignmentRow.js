import ArrowDownwardIcon from '@mui/icons-material/FileDownload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import styles from './Assignment.module.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, IconButton, Tooltip } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import moment from "moment";

export default function AssignmentRow(props) {
    const user = useSelector(state => state.user);
    const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)

    const [counter, setCounter] = useState(0)
    const [abc, setAbc] = useState(0)
    const [timeFinished, setTimeFinished] = useState(false)

    setTimeout(() => {
        setCounter(counter + 1)
    }, 10);


    const checkTime = (startTime) => {
        let today = new Date();
        today = today.toLocaleString()

        let assignmentStartTime = new Date(startTime)
        assignmentStartTime = assignmentStartTime.toLocaleString()

        let newassignmentStartTime = moment(assignmentStartTime)


        if (newassignmentStartTime.isBefore(today)) {
            return true
        }
        else {
            return false
        }
    }

    const checkTime2 = (EndTime) => {
        let today = new Date();
        today = today.toLocaleString()

        let assignmentEndTime = new Date(EndTime)
        assignmentEndTime = assignmentEndTime.toLocaleString()

        let newassignmentEndTime = moment(assignmentEndTime)


        if (newassignmentEndTime.isBefore(today)) {
            return true
        }
        else {
            return false
        }
    }

    useEffect(() => {
        setAbc(prev => prev + 1)

    }, [counter])

    return (
        <>
            <TableRow key={props.item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell className={styles.ind} align="left">{props.index + 1}</TableCell>
                <TableCell className={styles.ind} component="th" scope="row"><b>{props.item.assignmentTitle}</b></TableCell>
                <TableCell className={styles.ind} component="th">{props.item.fileType}</TableCell>
                <TableCell className={styles.ind} component="th">{props.item.startTime}</TableCell>
                <TableCell className={styles.ind} component="th">{props.item.endTime}</TableCell>
                {user.userInfo.user.id !== courseClickUserId && <TableCell component="th" className={styles.ind}>{props.item.submitted === 0 ? "Not Submitted" : "Submitted"}</TableCell>}
                <TableCell component="th" align='left'>
                    <Stack direction="row" spacing={0} sx={{ marginTop: '-15px' }}>
                        {user.userInfo.user.id == courseClickUserId && <Tooltip placement="top" arrow title="Edit"><IconButton color="primary" aria-label="add to shopping cart">
                            <EditIcon style={{ color: '#2A84EB' }} onClick={() => props.handleEdit(props.item)} />
                        </IconButton></Tooltip>}
                        {/* {user.userInfo.user.id == courseClickUserId && <EditIcon style={{ color: '#2A84EB' }} onClick={() => props.handleEdit(props.item)} />} */}
                        {(user.userInfo.user.id !== courseClickUserId && checkTime2(props.item.endTime)) && <Tooltip placement="top" arrow title="Result"><IconButton color="primary" aria-label="add to shopping cart"><ListAltIcon style={{ color: '#2A84EB' }} onClick={() => props.handleSubmitResult(props.item)} /></IconButton></Tooltip>}
                        {user.userInfo.user.id == courseClickUserId && <Tooltip placement="top" arrow title="Delete"><IconButton color="primary" aria-label="add to shopping cart"><DeleteIcon style={{ color: '#E53472' }} onClick={() => { props.handleDelete(props.item) }} /></IconButton></Tooltip>}
                        {user.userInfo.user.id == courseClickUserId && <Tooltip placement="top" arrow title="Result"><IconButton color="primary" aria-label="add to shopping cart"><ListAltIcon style={{ color: '#293462' }} onClick={() => { props.handleResult(props.item) }} /></IconButton></Tooltip>}
                        {/* {(user.userInfo.user.id !== courseClickUserId && !checkTime(props.item.startTime)) && <Tooltip placement="top" arrow title="Time Not Started"><IconButton onClick={() => console.log('hello')} color="primary" aria-label="add to shopping cart"><UploadFileIcon style={{ color: '#DEDEDE', pointerEvents: "none" }} /></IconButton></Tooltip>} */}

                        {(user.userInfo.user.id !== courseClickUserId && checkTime(props.item.startTime) && !checkTime2(props.item.endTime)) && <Tooltip placement="top" arrow title="Upload"><IconButton color="primary" aria-label="add to shopping cart"
                            onClick={() => {
                                props.handleSubmitAssignment(props.item)
                                console.log('hello2')
                            }}><UploadFileIcon style={{ color: '#495579', pointerEvents: "none" }}
                            /></IconButton></Tooltip>}
                        {user.userInfo.user.id !== courseClickUserId && <Tooltip placement="top" arrow title="Download"><IconButton color="primary" aria-label="add to shopping cart"><ArrowDownwardIcon style={{ color: '#DC3535' }} onClick={() => props.saveFile(props.item)} /></IconButton></Tooltip>}
                    </Stack>
                </TableCell>
            </TableRow>
        </>
    )
}