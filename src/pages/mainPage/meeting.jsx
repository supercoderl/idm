import axiosInstance from '@/config/axiosConfig';
import {
    CardContent,
    Card,
    CardHeader,
    Chip,
    Button,
    Grid,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    SwipeableDrawer,
    Divider,
} from '@mui/material';
import Modal from '@/components/modal';
import { LoadingButton } from '@mui/lab';
import { TimePicker } from '@mui/x-date-pickers';
import ConfirmBox from '@/components/confirmBox';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, viVN } from '@mui/x-data-grid';
import moment from 'moment';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function Schedule({ title }) {
    const [schedules, setSchedules] = useState([]);
    const [schedule, setSchedule] = useState({
        scheduleID: 0,
        title: '',
        description: '',
        organizer: '',
        startTime: moment(new Date()).format('HH:mm:ss'),
        duration: 0,
        repeat: false,
        onWorkingDay: false,
        dayOfWeek: '',
        weekOfMonth: 0,
    });
    const [users, setUsers] = useState([]);
    const [isModalOpened, setStateModal] = useState(false);
    const [isDeleting, setStateDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDraw, setStateDrawer] = useState(false);

    const navigate = useNavigate();

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const openModal = (item) => {
        setStateModal(true);
        setSchedule(item);
    };

    const closeModal = () => {
        setStateModal(false);
    };

    const startDelete = (schedule) => {
        setStateDeleting(true);
        setSchedule(schedule);
    };

    const cancleDelete = () => {
        setStateDeleting(false);
    };

    const toggleDrawer = (item, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setSchedule(item);
        setStateDrawer(open);
    };

    const getSchedules = async () => {
        await axiosInstance
            .get('Schedule/get-schedules')
            .then((value) => {
                setTimeout(() => {
                    setSchedules(value.data.data);
                    // alert(value.data.message, 'success');
                }, 600);
            })
            .catch((reason) => {
                if (reason.response.status !== 401) {
                    alert(reason.response.data.message, 'error');
                    console.log(reason);
                }
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
                if (reason.response.status !== 401) {
                    alert(reason.response.data.message, 'error');
                    console.log(reason);
                }
            });
    };

    const updateSchedule = async (event) => {
        event.preventDefault();
        setLoading(true);
        await axiosInstance
            .put(`Schedule/update-schedule/${schedule.scheduleID}`, schedule)
            .then((value) => {
                setTimeout(() => {
                    if (!value.data.success) {
                        alert(value.data.message, 'error');
                        return;
                    }

                    getSchedules();
                    closeModal();
                    alert(value.data.message, 'success');
                    setLoading(false);
                }, 600);
            })
            .catch((reason) => {
                console.log(reason.response.data.message);
                setLoading(false);
            });
    };

    const deleteSchedule = async () => {
        setLoading(true);
        await axiosInstance
            .delete(`Schedule/delete-schedule/${schedule.scheduleID}`)
            .then((value) => {
                setTimeout(() => {
                    if (!value.data.success) {
                        alert(value.data.message, 'error');
                        return;
                    }

                    getSchedules();
                    cancleDelete();
                    alert(value.data.message, 'success');
                    setLoading(false);
                }, 600);
            })
            .catch((reason) => {
                console.log(reason.response.data.message);
                setLoading(false);
            });
    };

    const getName = (value) => {
        const user = users.find((item) => item.userID === value);
        return user ? user.fullname : 'N/A';
    };

    const columns = [
        {
            field: 'title',
            headerName: 'Tiêu đề',
            width: 130,
        },
        {
            field: 'organizer',
            headerName: 'Chủ trì',
            width: 200,
            valueFormatter: (params) => getName(params.value),
        },
        {
            field: 'startTime',
            headerName: 'Thời gian bắt đầu',
            headerAlign: 'center',
            align: 'center',
            width: 130,
        },
        {
            field: 'dayOfWeek',
            headerName: 'Thứ',
            headerAlign: 'center',
            align: 'center',
            width: 130,
        },
        {
            field: 'weekOfMonth',
            headerName: 'Tuần',
            headerAlign: 'center',
            align: 'center',
            width: 130,
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
            width: 120,
            renderCell: (params) => (
                <>
                    <Button style={{ minWidth: 32 }} onClick={toggleDrawer(params.row, true)}>
                        <RemoveRedEyeIcon fontSize="small" />
                    </Button>
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
        getSchedules();
        getUsers();
        console.log(moment(`${new Date().toDateString()} ${schedule.startTime}`).utc());
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
                        <Button variant="contained" sx={{ marginLeft: 2 }} onClick={() => navigate('create-schedule')}>
                            <AddIcon /> Lịch mới
                        </Button>
                    }
                />

                <CardContent>
                    <div style={{ height: 600, width: '100%', backgroundColor: 'white' }}>
                        <DataGrid
                            getRowId={(row) => row.scheduleID}
                            rows={schedules}
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

            <Modal openModal={isModalOpened} fnCloseModal={closeModal} maxWidth="md" title="Chỉnh sửa lịch họp" padding>
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
                            onSubmit={updateSchedule}
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
                                    <TextField
                                        label="Tiêu đề"
                                        required
                                        variant="outlined"
                                        color="secondary"
                                        type="text"
                                        size="small"
                                        value={schedule.title}
                                        onChange={(e) =>
                                            setSchedule((item) => ({
                                                ...item,
                                                ...{ title: e.target.value },
                                            }))
                                        }
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <TextField
                                        label="Nội dung"
                                        required
                                        variant="outlined"
                                        color="secondary"
                                        type="text"
                                        size="small"
                                        value={schedule.description}
                                        onChange={(e) =>
                                            setSchedule((item) => ({
                                                ...item,
                                                ...{ description: e.target.value },
                                            }))
                                        }
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="organizer">Chủ trì</InputLabel>
                                        <Select
                                            labelId="organizer"
                                            id="organizer"
                                            value={schedule.organizer}
                                            label="Chủ trì"
                                            onChange={(e) =>
                                                setSchedule((item) => ({
                                                    ...item,
                                                    ...{ organizer: e.target.value },
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
                                    <TimePicker
                                        label="Bắt đầu"
                                        required
                                        variant="outlined"
                                        color="secondary"
                                        size="small"
                                        value={moment(`${new Date().toDateString()} ${schedule.startTime}`)}
                                        sx={{ width: '100%' }}
                                        format="HH:mm:ss"
                                        slotProps={{ textField: { size: 'small' } }}
                                        onChange={(e) => {
                                            setSchedule((item) => ({
                                                ...item,
                                                ...{ startTime: moment(e._d).format('HH:mm:ss') },
                                            }));
                                        }}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <TextField
                                        label="Khoảng thời gian"
                                        required
                                        variant="outlined"
                                        color="secondary"
                                        type="text"
                                        size="small"
                                        value={schedule.duration}
                                        onChange={(e) =>
                                            setSchedule((item) => ({
                                                ...item,
                                                ...{ duration: e.target.value },
                                            }))
                                        }
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="repeat">Trạng thái</InputLabel>
                                        <Select
                                            labelId="repeat"
                                            id="repeat"
                                            value={schedule.repeat}
                                            label="Trạng thái"
                                            onChange={(e) =>
                                                setSchedule((item) => ({
                                                    ...item,
                                                    ...{ repeat: e.target.value },
                                                }))
                                            }
                                        >
                                            <MenuItem value>Lặp lại</MenuItem>
                                            <MenuItem value={false}>Không lặp lại</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="onWorkingDay">Trong ngày</InputLabel>
                                        <Select
                                            labelId="repeat"
                                            id="repeat"
                                            value={schedule.onWorkingDay}
                                            label="Trong ngày"
                                            onChange={(e) =>
                                                setSchedule((item) => ({
                                                    ...item,
                                                    ...{ onWorkingDay: e.target.value },
                                                }))
                                            }
                                        >
                                            <MenuItem value>Đúng</MenuItem>
                                            <MenuItem value={false}>Sai</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="dayOfWeek">Thứ</InputLabel>
                                        <Select
                                            labelId="repeat"
                                            id="repeat"
                                            value={schedule.dayOfWeek}
                                            label="Thứ"
                                            onChange={(e) =>
                                                setSchedule((item) => ({
                                                    ...item,
                                                    ...{ dayOfWeek: e.target.value },
                                                }))
                                            }
                                        >
                                            <MenuItem value="Monday">Hai</MenuItem>
                                            <MenuItem value="Tuesday">Ba</MenuItem>
                                            <MenuItem value="Wednesday">Tư</MenuItem>
                                            <MenuItem value="Thursday">Năm</MenuItem>
                                            <MenuItem value="Friday">Sáu</MenuItem>
                                            <MenuItem value="Saturday">Bảy</MenuItem>
                                            <MenuItem value="Sunday">Chủ nhật</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <TextField
                                        label="Tuần"
                                        required
                                        variant="outlined"
                                        color="secondary"
                                        type="text"
                                        size="small"
                                        value={schedule.weekOfMonth}
                                        onChange={(e) =>
                                            setSchedule((item) => ({
                                                ...item,
                                                ...{ weekOfMonth: e.target.value },
                                            }))
                                        }
                                        fullWidth
                                    />
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
                title="Xóa đề xuất"
                content={`Bạn có chắc muốn xóa đề xuất ${schedule.title} ?`}
                submit={deleteSchedule}
            />

            <SwipeableDrawer anchor="right" open={isDraw} onClose={toggleDrawer(false)} onOpen={() => {}}>
                <Box width={400} py={3} px={2}>
                    <Typography variant="h2" pb={3} textAlign="center">
                        Lịch họp
                    </Typography>
                    <Typography variant="h5">ID: #{schedule.scheduleID}</Typography>
                    <p>Tiêu đề buổi họp:</p>
                    <p style={{ fontSize: 14, padding: 5, border: '2px solid rgb(173 136 230)', width: 'fit-content' }}>
                        {schedule.title}
                    </p>
                    <Divider />
                    <p>Nội dung: </p>
                    <p style={{ fontSize: 14 }}>- {schedule.description}</p>
                    <p>Chủ trì cuộc họp: </p>
                    <p style={{ fontSize: 14, width: 'fit-content' }}>Thầy/cô: {getName(schedule.organizer)}</p>
                    <Box display="flex" justifyContent="space-between">
                        <p>Thời gian bắt đầu: </p>
                        <p>Khoảng thời gian: </p>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <p style={{ fontSize: 14, marginTop: 0 }}>--- {schedule.startTime} ---</p>
                        <p style={{ fontSize: 14, marginTop: 0 }}>{schedule.duration} giờ</p>
                    </Box>
                    <p>Ngày: </p>
                    <p style={{ fontSize: 14, width: 'fit-content' }}>Thứ {schedule.dayOfWeek}</p>
                    <p>Tuần thứ: </p>
                    <p style={{ fontSize: 14, width: 'fit-content' }}>{schedule.weekOfMonth}</p>
                    <p>Nhân sự tham gia: </p>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                        <p
                            style={{
                                fontSize: 14,
                                marginBottom: 0,
                            }}
                        >
                            Ngày tạo:
                        </p>
                        <p
                            style={{
                                fontSize: 14,
                                marginBottom: 0,
                            }}
                        >
                            Ngày cập nhật:
                        </p>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <p
                            style={{
                                fontSize: 14,
                            }}
                        >
                            ---
                            {schedule.createdDateTime ? moment(schedule.createdDateTime).format('DD/MM/YYYY') : 'N/A'}
                            ---
                        </p>
                        <p
                            style={{
                                fontSize: 14,
                            }}
                        >
                            ---
                            {schedule.updatedDateTime ? moment(schedule.updatedDateTime).format('DD/MM/YYYY') : 'N/A'}
                            ---
                        </p>
                    </Box>
                </Box>
            </SwipeableDrawer>
        </>
    );
}
