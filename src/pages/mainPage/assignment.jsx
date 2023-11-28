import axiosInstance from '@/config/axiosConfig';
import {
    CardContent,
    Card,
    CardHeader,
    Chip,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Modal from '@/components/modal';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { DataGrid, viVN } from '@mui/x-data-grid';
import moment from 'moment';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers';
import ConfirmBox from '@/components/confirmBox';

export default function Assignment({ title }) {
    const [isModalOpened, setStateModal] = useState(false);
    const [assignment, setAssignment] = useState({
        assignmentID: 0,
        employee: '',
        taskID: 0,
        deadline: new Date(),
        status: 0,
    });
    const [assignments, setAssignments] = useState([]);
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [progresses, setProgresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setStateDeleting] = useState(false);
    const arrayProgressClick = 5;

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const navigate = useNavigate();

    const getProgresses = async () => {
        await axiosInstance
            .get('Progress/get-progresses')
            .then((value) => {
                setTimeout(() => {
                    setProgresses(value.data.data);
                    // alert(value.data.message, 'success');
                }, 600);
            })
            .catch((reason) => {
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    const getAssignments = async () => {
        await axiosInstance
            .get('Assignment/get-assignments')
            .then((value) => {
                setTimeout(() => {
                    setAssignments(value.data.data);
                    // alert(value.data.message, 'success');
                }, 600);
            })
            .catch((reason) => {
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    const getUsers = async () => {
        await axiosInstance
            .get('User/users')
            .then((value) => {
                setTimeout(() => {
                    setUsers(value.data.data);
                    // alert(value.data.message, 'success');
                }, 600);
            })
            .catch((reason) => {
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    const getTasks = async () => {
        await axiosInstance
            .get('Task/get-tasks')
            .then((value) => {
                setTimeout(() => {
                    setTasks(value.data.data);
                    // alert(value.data.message, 'success');
                }, 600);
            })
            .catch((reason) => {
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    const openModal = (item) => {
        setStateModal(true);
        setAssignment(item);
    };

    const closeModal = () => {
        setStateModal(false);
    };

    const startDelete = (assignment) => {
        setStateDeleting(true);
        setAssignment(assignment);
    };

    const cancleDelete = () => {
        setStateDeleting(false);
    };

    const updateAssignment = async (event) => {
        event.preventDefault();
        setLoading(true);
        await axiosInstance
            .put(`Assignment/update-assignment/${assignment.assignmentID}`, assignment)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message, 'success');
                    setLoading(false);
                    closeModal();
                    getAssignments();
                }, 600);
            })
            .catch((reason) => {
                setLoading(false);
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    const deleteAssignment = async () => {
        setLoading(true);
        await axiosInstance
            .delete(`Assignment/delete-assignment/${assignment.assignmentID}`)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message);
                    setLoading(false);
                    getAssignments();
                });
            })
            .catch((reason) => {
                console.log(reason.response.data.message);
                setLoading(false);
            });
        cancleDelete();
    };

    const getName = (value) => {
        const user = users.find((item) => item.userID === value);
        return user ? user.fullname : 'N/A';
    };

    const getTaskTitle = (value) => {
        const task = tasks.find((item) => item.taskID === value);
        return task ? task.title : 'N/A';
    };

    const updateProgress = async (assignmentID, value) => {
        const progress = progresses.find((item) => item.assignmentID === assignmentID);
        if (progress) {
            progress.status = value;
            progress.date = new Date();

            await axiosInstance
                .put(`Progress/update-progress/${progress.progressID}`, progress)
                .then((value) => {
                    alert(value.data.message, 'success');
                    getProgresses();
                })
                .catch((reason) => {
                    console.log(reason.response.data.message);
                });
        }
    };

    const getProgressStatus = (value) => {
        const progress = progresses.find((item) => item.assignmentID === value);
        return progress ? progress.status : 0;
    };

    const columns = [
        {
            field: 'employee',
            headerName: 'Nhân viên',
            width: 130,
            valueFormatter: (params) => getName(params.value),
        },
        {
            field: 'taskID',
            headerName: 'Công việc',
            width: 200,
            valueFormatter: (params) => getTaskTitle(params.value),
        },
        {
            field: 'deadline',
            headerName: 'Thời hạn',
            headerAlign: 'center',
            align: 'center',
            width: 130,
            valueFormatter: (params) => (params.value ? moment(params?.value).format('DD/MM/YYYY') : 'N/A'),
        },
        {
            field: 'progress',
            headerName: 'Tiến độ',
            headerAlign: 'center',
            align: 'center',
            width: 80,
            renderCell: (params) => (
                <Chip sx={{ borderRadius: 3 }} label={`${getProgressStatus(params.id)}%`} color="secondary" />
            ),
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            align: 'center',
            width: 150,
            renderCell: (params) => (
                <Chip
                    sx={{ borderRadius: 3 }}
                    label={params.row?.status === 1 ? 'Đang hoạt động' : 'Bị khóa'}
                    color={params.row?.status === 1 ? 'warning' : 'primary'}
                />
            ),
        },
        {
            field: 'createdBy',
            headerName: 'Người tạo',
            width: 130,
            valueFormatter: (params) => getName(params.value),
        },
        {
            field: 'updatedDateTime',
            headerName: 'Lần cập nhật cuối',
            headerAlign: 'center',
            align: 'center',
            width: 130,
            valueFormatter: (params) => (params.value ? moment(params?.value).format('DD/MM/YYYY') : 'N/A'),
        },
        {
            field: 'action',
            headerName: 'Chức năng',
            width: 90,
            renderCell: (params) => (
                <>
                    <Button style={{ minWidth: 32 }} onClick={() => openModal(params.row)}>
                        <ModeEditIcon fontSize="small" />
                    </Button>
                    <Button style={{ minWidth: 32 }} onClick={() => startDelete(params.row)}>
                        <DeleteIcon fontSize="small" />
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        getAssignments();
        getUsers();
        getTasks();
        getProgresses();
    }, []);

    return (
        <>
            <Card
                sx={{
                    minHeight: '100vh',
                }}
                type="section"
            >
                <CardHeader
                    title={`${title}`}
                    subheader={`Tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`}
                    action={
                        <>
                            <Button
                                variant="contained"
                                sx={{ marginLeft: 2 }}
                                onClick={() => navigate('assignment-schedule')}
                            >
                                <CalendarMonthIcon /> &nbsp; Xem lịch
                            </Button>
                            <Button
                                variant="contained"
                                sx={{ marginLeft: 2 }}
                                onClick={() => navigate('create-assignment')}
                            >
                                <AddIcon /> &nbsp; Phân công
                            </Button>
                        </>
                    }
                />

                <CardContent>
                    <div style={{ height: 600, width: '100%', backgroundColor: 'white' }}>
                        <DataGrid
                            getRowId={(row) => row.assignmentID}
                            rows={assignments}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                        />
                    </div>
                </CardContent>
            </Card>

            <Modal
                openModal={isModalOpened}
                fnCloseModal={closeModal}
                maxWidth="xs"
                title="Điều chỉnh phân công"
                padding
            >
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={8} md={12}>
                        <Box
                            component="form"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                            }}
                            onSubmit={updateAssignment}
                        >
                            <Grid
                                container
                                sx={{ mb: 2 }}
                                direction="row"
                                justify="flex-start"
                                alignItems="flex-start"
                                spacing={{ xs: 2, md: 3 }}
                                columns={{ xs: 4, sm: 8, md: 12 }}
                            >
                                <Grid item xs={2} sm={4} md={6}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="employee">Nhân viên được phân công</InputLabel>
                                        <Select
                                            labelId="employee"
                                            id="employee"
                                            value={assignment.employee}
                                            label="Nhân viên được phân công"
                                            onChange={(e) =>
                                                setAssignment((item) => ({
                                                    ...item,
                                                    ...{ employee: e.target.value },
                                                }))
                                            }
                                        >
                                            {users && users.length > 0
                                                ? users.map((item, index) => (
                                                      <MenuItem key={index} value={item.userID}>
                                                          {item.fullname}
                                                      </MenuItem>
                                                  ))
                                                : null}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="task">Công việc</InputLabel>
                                        <Select
                                            labelId="task"
                                            id="task"
                                            value={assignment.taskID}
                                            label="Công việc"
                                            onChange={(e) =>
                                                setAssignment((item) => ({
                                                    ...item,
                                                    ...{ taskID: e.target.value },
                                                }))
                                            }
                                        >
                                            {tasks && tasks.length > 0
                                                ? tasks.map((item, index) => (
                                                      <MenuItem key={index} value={item.taskID}>
                                                          {item.title}
                                                      </MenuItem>
                                                  ))
                                                : null}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <DatePicker
                                        label="Thời hạn"
                                        required
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        sx={{ width: '100%' }}
                                        slotProps={{ textField: { size: 'small' } }}
                                        format="DD/MM/YYYY"
                                        value={moment(assignment.deadline || new Date())}
                                        onChange={(e) => {
                                            setAssignment((item) => ({
                                                ...item,
                                                ...{ deadline: moment(e._d).format('YYYY-MM-DD') },
                                            }));
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="status">Trạng thái</InputLabel>
                                        <Select
                                            labelId="status"
                                            id="status"
                                            value={assignment.status}
                                            label="Trạng thái"
                                            onChange={(e) =>
                                                setAssignment((item) => ({
                                                    ...item,
                                                    ...{ status: e.target.value },
                                                }))
                                            }
                                        >
                                            <MenuItem value={0}>Bị khóa</MenuItem>
                                            <MenuItem value={1}>Đang hoạt động</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <Typography paddingBottom={1}>Tiến độ công việc</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <HorizontalRuleIcon sx={{ width: 10 }} />
                                        {Array.from({ length: arrayProgressClick }, (_, index) => (
                                            <Box key={index} display="flex" alignItems="center">
                                                <Tooltip title={`${index * 25}%`} placement="top">
                                                    <IconButton
                                                        className="connected-progress"
                                                        aria-label="fingerprint"
                                                        sx={{ padding: 0 }}
                                                        color={
                                                            getProgressStatus(assignment.assignmentID) >= index * 25
                                                                ? 'success'
                                                                : 'default'
                                                        }
                                                        onClick={() =>
                                                            updateProgress(assignment.assignmentID, index * 25)
                                                        }
                                                    >
                                                        <RadioButtonCheckedIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <HorizontalRuleIcon sx={{ width: 10 }} />
                                            </Box>
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>

                            <LoadingButton loading={loading} variant="outlined" type="submit" sx={{ mt: 'auto' }}>
                                Xác nhận
                            </LoadingButton>
                        </Box>
                    </Grid>
                </Grid>
            </Modal>

            <ConfirmBox
                open={isDeleting}
                handleClose={cancleDelete}
                title="Xóa phòng ban"
                content={`Bạn có chắc muốn xóa bảng phân công ${getTaskTitle(assignment.taskID)} ?`}
                submit={deleteAssignment}
            />
        </>
    );
}
