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
    const [schedule, setSchedule] = useState({
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

    const [loading, setLoading] = useState(false);

    const comeback = () => {
        window.history.back();
    };

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
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

    return (
        <>
            <PageHeader title="Tạo lịch họp">
                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{
                        textTransform: 'uppercase',
                    }}
                >
                    <Link underline="hover" href="#!">
                        IDM
                    </Link>
                    <Typography color="text.tertiary">Tạo lịch họp</Typography>
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
                                    <Grid item xs={2} sm={4} md={12}>
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
                                    <Grid item xs={2} sm={4} md={12}>
                                        <TextField
                                            label="Nội dung"
                                            required
                                            variant="outlined"
                                            color="secondary"
                                            type="text"
                                            size="small"
                                            value={schedule.description}
                                            onChange={(e) =>
                                                setDepartment((item) => ({
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
                                            sx={{ width: '100%' }}
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
                                    <Grid item xs={2} sm={4} md={12}>
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
                                            <InputLabel id="task">Trạng thái</InputLabel>
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
                                                <MenuItem value={true}>
                                                    Lặp lại
                                                </MenuItem>
                                                <MenuItem value={false}>
                                                    Không lặp lại
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} sm={4} md={6}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="task">Trong ngày</InputLabel>
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
                                                <MenuItem value={true}>
                                                    Đúng
                                                </MenuItem>
                                                <MenuItem value={false}>
                                                    Sai
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} sm={4} md={6}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="task">Thứ</InputLabel>
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
                                                <MenuItem value="Monday">
                                                    Hai
                                                </MenuItem>
                                                <MenuItem value="Tuesday">
                                                    Ba
                                                </MenuItem>
                                                <MenuItem value="Wednesday">
                                                    Tư
                                                </MenuItem>
                                                <MenuItem value="Thursday">
                                                    Năm
                                                </MenuItem>
                                                <MenuItem value="Friday">
                                                    Sáu
                                                </MenuItem>
                                                <MenuItem value="Saturday">
                                                    Bảy
                                                </MenuItem>
                                                <MenuItem value="Sunday">
                                                    Chủ nhật
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} sm={4} md={12}>
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
