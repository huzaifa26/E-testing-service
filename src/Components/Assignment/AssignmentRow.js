import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import styles from './Assignment.module.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from "moment";

export default function AssignmentRow(props) {
    const user = useSelector(state => state.user);
    const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)

    const [counter, setCounter] = useState(0)
    const [timeFinished, setTimeFinished] = useState(false)

    setTimeout(() => {
        setCounter(counter + 1)
    }, 10);

    useEffect(() => {
        let today = new Date();
        today = today.toLocaleString()

        let assignmentStartTime = new Date(props.item.endTime)
        assignmentStartTime = assignmentStartTime.toLocaleString()

        let newassignmentStartTime = moment(assignmentStartTime)

        if (newassignmentStartTime.isBefore(today)) {
            setTimeFinished(true)
        }
    }, [counter])

    return (
        <>
            <TableRow key={props.item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell className={styles.ind} align="left">{props.index + 1}</TableCell>
                <TableCell className={styles.ind} component="th" scope="row"><b>{props.item.assignmentTitle}</b></TableCell>
                <TableCell className={styles.ind} component="th">{props.item.fileType}</TableCell>
                <TableCell className={styles.ind} component="th">{props.item.startTime}</TableCell>
                <TableCell className={styles.ind} component="th">{props.item.endTime}</TableCell>
                {user.userInfo.user.id !== courseClickUserId && <TableCell component="th" className={styles.ind}>{props.item.submitted === 0?"Not Submitted":"Submitted"}</TableCell>}
                <TableCell component="th" align='left'>
                    {user.userInfo.user.id == courseClickUserId && <EditIcon style={{ color: '#2A84EB' }} onClick={() => props.handleEdit(props.item)} />}
                    {user.userInfo.user.id == courseClickUserId && <DeleteIcon style={{ color: '#E53472' }} onClick={() => { props.handleDelete(props.item) }} />}
                    {user.userInfo.user.id == courseClickUserId && <ListAltIcon style={{ color: '#293462' }} onClick={() => { props.handleResult(props.item) }} />}

                    {user.userInfo.user.id !== courseClickUserId && <ArrowDownwardIcon style={{ color: '#E53472' }} onClick={() => props.saveFile(props.item)} />}
                    {(user.userInfo.user.id !== courseClickUserId && timeFinished === false) && <UploadFileIcon style={{ color: '#2A84EB' }} onClick={() => props.handleSubmitAssignment(props.item)} />}
                    {(user.userInfo.user.id !== courseClickUserId && timeFinished === true) && <UploadFileIcon style={{ color: '#2A84EB',pointerEvents:"none" }} />}
                    {user.userInfo.user.id !== courseClickUserId && <ListAltIcon style={{ color: '#2A84EB' }} onClick={() => props.handleSubmitResult(props.item)} />}

                </TableCell>
            </TableRow>
        </>
    )
}