import axiosInstance from '@/config/axiosConfig';
import { CardContent, Card, CardHeader, Chip, Button } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, viVN } from '@mui/x-data-grid';
import moment from 'moment';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

export default function Schedule({ title }) {
    const [schedules, setSchedules] = useState([]);
    const [users, setUsers] = useState([]);

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
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
            valueFormatter: (params) => (params.value ? moment(params?.value).format('DD/MM/YYYY') : 'N/A'),
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
                    <Button style={{ minWidth: 32 }}>
                        <RemoveRedEyeIcon fontSize="small" />
                    </Button>
                    <Button style={{ minWidth: 32 }}>
                        <ModeEditIcon fontSize="small" />
                    </Button>
                    <Button style={{ minWidth: 32 }}>
                        <DeleteIcon fontSize="small" />
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        getSchedules();
        getUsers();
    }, []);

    return (
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
                    <Button variant="contained" sx={{ marginLeft: 2 }}>
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
    );
}
