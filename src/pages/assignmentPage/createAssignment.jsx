import PageHeader from '@/components/pageHeader';
import {
    Link,
    Typography,
    Breadcrumbs,
    Card,
    CardContent,
    Grid,
    Button,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useEffect, useState } from 'react';
import axiosInstance from '@/config/axiosConfig';
import { enqueueSnackbar } from 'notistack';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';

export default function Assignment() {
    const [assignment, setAssignment] = useState({
        employee: '',
        taskID: 0,
        startTime: moment(new Date()).format('HH:mm:ss'),
        endTime: moment(new Date()).format('HH:mm:ss'),
        deadline: new Date(),
        status: 1,
    });
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const comeback = () => {
        window.history.back();
    };

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const getUsers = async () => {
        await axiosInstance
            .get('User/users')
            .then((value) => {
                setUsers(value.data.data);
            })
            .catch((reason) => {
                if (reason.response.status !== 401) console.log(reason);
            });
    };

    const getTasks = async () => {
        await axiosInstance
            .get('Task/get-tasks')
            .then((value) => {
                setTasks(value.data.data);
            })
            .catch((reason) => {
                if (reason.response.status !== 401) console.log(reason);
            });
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);

        await axiosInstance
            .post('Assignment/create-assignment', assignment)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message);
                    setLoading(false);
                }, 600);
            })
            .catch((reason) => {
                if (reason.response.status !== 401) {
                    console.log(reason.response.data.message);
                    setLoading(false);
                }
            });
    };

    const columns = [
        {
            field: 'title',
            headerName: 'Danh sách công việc',
            width: 200,
        },
    ];

    useEffect(() => {
        getUsers();
        getTasks();
    }, []);

    return (
        <>
            <PageHeader title="Phân công công việc">
                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{
                        textTransform: 'uppercase',
                    }}
                >
                    <Link underline="hover" href="#!">
                        IDM
                    </Link>
                    <Typography color="text.tertiary">Phân công công việc</Typography>
                </Breadcrumbs>
            </PageHeader>
            <Card type="section">
                <CardContent
                    sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 400, overflowY: 'auto' }}
                    className="card-profile"
                >
                    <Box sx={{ marginLeft: 'auto', mb: 4 }}>
                        <Button variant="contained" onClick={comeback}>
                            <KeyboardBackspaceIcon fontSize="small" /> &nbsp; Trở về
                        </Button>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4} md={4}>
                            <DataGrid
                                getRowId={(row) => row.taskID}
                                rows={tasks}
                                columns={columns}
                                hideFooterPagination
                                hideFooter
                            />
                        </Grid>
                        <Grid item xs={12} sm={8} md={8}>
                            <Box
                                component="form"
                                onSubmit={submit}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                }}
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
                                        <TimePicker
                                            label="Bắt đầu"
                                            required
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            sx={{ width: '100%' }}
                                            slotProps={{ textField: { size: 'small' } }}
                                            onChange={(e) => {
                                                setAssignment((item) => ({
                                                    ...item,
                                                    ...{ startTime: moment(e._d).format('HH:mm:ss') },
                                                }));
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={2} sm={4} md={6}>
                                        <TimePicker
                                            label="Kết thúc"
                                            required
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            sx={{ width: '100%' }}
                                            slotProps={{ textField: { size: 'small' } }}
                                            onChange={(e) => {
                                                setAssignment((item) => ({
                                                    ...item,
                                                    ...{ endTime: moment(e._d).format('HH:mm:ss') },
                                                }));
                                            }}
                                            fullWidth
                                        />
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
                                            onChange={(e) => {
                                                setAssignment((item) => ({
                                                    ...item,
                                                    ...{ deadline: moment(e._d).format('YYYY-MM-DD') },
                                                }));
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>

                                <Button variant="outlined" type="submit" sx={{ mt: 'auto' }}>
                                    Xác nhận
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            asd
        </>
    );
}
