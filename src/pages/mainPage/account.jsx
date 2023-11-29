import {
    CardContent,
    Card,
    CardHeader,
    Button,
    Box,
    TextField,
    Select,
    MenuItem,
    Chip,
    FormControl,
    InputLabel,
} from '@mui/material';
import { DataGrid, nlNL, ptBR, viVN } from '@mui/x-data-grid';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import axiosInstance from '@/config/axiosConfig';
import { enqueueSnackbar } from 'notistack';
import moment from 'moment/moment';
import Modal from '@/components/modal';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import ConfirmBox from '@/components/confirmBox';
import * as XLSX from 'xlsx';

export default function Account({ title }) {
    const [isModalOpened, setStateModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [user, setUser] = useState({
        userID: '',
        usernameOrEmail: '',
        fullname: '',
        firstname: '',
        lastname: '',
        gender: '',
        dateOfBirth: new Date(),
        status: 0,
        priority: 0,
        departmentID: 0,
    });
    const [userToExport, setUserToExport] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setStateDeleting] = useState(false);

    const navigate = useNavigate();

    const openModal = () => {
        setStateModal(true);
    };

    const closeModal = () => {
        setStateModal(false);
    };

    const startDelete = (user) => {
        setStateDeleting(true);
        setUser(user);
    };

    const cancleDelete = () => {
        setStateDeleting(false);
    };

    const getUserToUpdate = (item) => {
        setUser(item?.row);
        openModal();
    };

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
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

    const getDepartments = async () => {
        await axiosInstance
            .get('Department/get-departments')
            .then((value) => {
                setTimeout(() => {
                    setDepartments(value.data.data);
                    // alert(value.data.message, 'success');
                    console.log(value);
                }, 600);
            })
            .catch((reason) => {
                if (reason.response.status !== 401) {
                    alert(reason.response.data.message, 'error');
                    console.log(reason);
                }
            });
    };

    const createUser = () => {
        navigate('/home/create-user');
    };

    const updateUser = async (event) => {
        event.preventDefault();
        setLoading(true);

        user.firstname = user.fullname.substring(user.fullname.indexOf(' ') + 1);
        user.lastname = user.fullname.substring(0, user.fullname.indexOf(' '));

        await axiosInstance
            .put(`User/update-user/${user?.userID}`, user)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message);
                    setLoading(false);
                    getUsers();
                    closeModal();
                }, 600);
            })
            .catch((reason) => {
                if (reason.response.status !== 401) {
                    console.log(reason);
                    setLoading(false);
                }
            });
    };

    const setStatus = async (userID) => {
        setLoading(true);
        await axiosInstance
            .put(`User/set-status/${userID}`)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message);
                    setLoading(false);
                    getUsers();
                }, 600);
            })
            .catch((reason) => {
                if (reason.response.status !== 401) {
                    console.log(reason);
                    setLoading(false);
                }
            });
    };

    const deleteUser = async () => {
        setLoading(true);
        await axiosInstance
            .delete(`User/delete-user/${user?.userID}`)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message);
                    setLoading(false);
                    getUsers();
                });
            })
            .catch((reason) => {
                if (reason.response.status !== 401) {
                    console.log(reason.response.data.message);
                    setLoading(false);
                }
            });
        cancleDelete();
    };

    const handleSelectionItem = (items) => {
        const selectedIds = new Set(items);
        const selectedRows = users.filter((value) => selectedIds.has(value.userID));
        setUserToExport(selectedRows);
    };

    const exportToExcel = () => {
        if (userToExport.length <= 0) {
            alert('Không có dữ liệu để export', 'error');
            return;
        }

        const ws = XLSX.utils.json_to_sheet(userToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Danh sách người dùng');
        XLSX.writeFile(wb, 'users.xlsx');
    };

    const getDepartmentName = (departmentID) => {
        const department = departments.find((dept) => dept.departmentID === departmentID);
        return department ? department.departmentName : 'N/A';
    };

    const columns = [
        { field: 'userID', headerName: 'ID', width: 70 },
        { field: 'lastname', headerName: 'Họ', width: 130 },
        { field: 'firstname', headerName: 'Tên', width: 130 },
        {
            field: 'dateOfBirth',
            headerName: 'Ngày sinh',
            width: 110,
            valueFormatter: (params) => moment(params?.value).format('DD/MM/YYYY'),
        },
        { field: 'gender', headerName: 'Giới tính', width: 70, align: 'center' },
        {
            field: 'departmentID',
            headerName: 'Khoa',
            width: 110,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (params) => getDepartmentName(params.value),
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Chip
                    label={params.row?.status === 1 ? 'Đang hoạt động' : 'Bị khóa'}
                    color={params.row?.status === 1 ? 'warning' : 'primary'}
                />
            ),
        },
        {
            field: 'createdDateTime',
            headerName: 'Ngày tạo',
            width: 110,
            headerAlign: 'center',
            align: 'center',
            valueFormatter: (params) => moment(params?.value).format('DD/MM/YYYY'),
        },
        {
            field: 'action',
            headerName: 'Chức năng',
            sortable: false,
            width: 120,
            renderCell: (params) => (
                <>
                    <Button style={{ minWidth: 32 }} onClick={() => setStatus(params.row?.userID)}>
                        {params.row?.status === 1 ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                    </Button>
                    <Button style={{ minWidth: 32 }} onClick={() => getUserToUpdate(params)}>
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
        getDepartments();
        getUsers();
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
                    action={
                        <>
                            <Button variant="contained" onClick={exportToExcel}>
                                <AddIcon /> Xuất file excel
                            </Button>
                            <Button variant="contained" sx={{ marginLeft: 2 }} onClick={createUser}>
                                <AddIcon /> Thêm mới
                            </Button>
                        </>
                    }
                />

                <CardContent>
                    <div style={{ height: 600, width: '100%', backgroundColor: 'white' }}>
                        <DataGrid
                            getRowId={(row) => row.userID}
                            rows={users}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            onRowSelectionModelChange={handleSelectionItem}
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                        />
                    </div>
                </CardContent>
            </Card>
            <Modal
                openModal={isModalOpened}
                fnCloseModal={closeModal}
                maxWidth="xs"
                title="Chỉnh sửa người dùng"
                padding
            >
                <Box component="form" onSubmit={updateUser}>
                    <TextField
                        label="Tên đăng nhập"
                        required
                        sx={{ marginBottom: 2 }}
                        variant="outlined"
                        color="secondary"
                        type="text"
                        size="small"
                        value={user.usernameOrEmail}
                        onChange={(e) => setUser((item) => ({ ...item, ...{ usernameOrEmail: e.target.value } }))}
                        disabled
                        fullWidth
                    />

                    <TextField
                        label="Tên người dùng"
                        required
                        sx={{ marginBottom: 2 }}
                        variant="outlined"
                        color="secondary"
                        type="text"
                        size="small"
                        value={user.fullname}
                        onChange={(e) => setUser((item) => ({ ...item, ...{ fullname: e.target.value } }))}
                        fullWidth
                    />

                    <DatePicker
                        label="Ngày sinh"
                        required
                        sx={{ marginBottom: 2, width: '100%' }}
                        variant="outlined"
                        color="secondary"
                        format="DD-MM-YYYY"
                        value={moment(user.dateOfBirth)}
                        onChange={(e) =>
                            setUser((item) => ({ ...item, ...{ dateOfBirth: moment(e._d).format('YYYY-MM-DD') } }))
                        }
                        slotProps={{ textField: { size: 'small' } }}
                    />

                    <FormControl size="small" fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel id="gender">Giới tính</InputLabel>
                        <Select
                            labelId="gender"
                            id="gender"
                            value={user.gender}
                            label="Giới tính"
                            onChange={(e) =>
                                setUser((item) => ({
                                    ...item,
                                    ...{ gender: e.target.value },
                                }))
                            }
                        >
                            <MenuItem value="Nam">Nam</MenuItem>
                            <MenuItem value="Nữ">Nữ</MenuItem>
                            <MenuItem value="Khác">Khác</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel id="status">Trạng thái</InputLabel>
                        <Select
                            labelId="status"
                            id="status"
                            value={user.status}
                            label="Trạng thái"
                            onChange={(e) =>
                                setUser((item) => ({
                                    ...item,
                                    ...{ status: e.target.value },
                                }))
                            }
                        >
                            <MenuItem value={0}>Bị khóa</MenuItem>
                            <MenuItem value={1}>Đang hoạt động</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Vị trí"
                        required
                        sx={{ marginBottom: 2 }}
                        variant="outlined"
                        color="secondary"
                        type="text"
                        size="small"
                        value={user.priority}
                        onChange={(e) => setUser((item) => ({ ...item, ...{ priority: e.target.value } }))}
                        fullWidth
                    />

                    <FormControl size="small" fullWidth sx={{ marginBottom: 2 }}>
                        <InputLabel id="departmentID">Phòng ban</InputLabel>
                        <Select
                            labelId="departmentID"
                            id="departmentID"
                            value={user.departmentID}
                            label="Phòng ban"
                            onChange={(e) =>
                                setUser((item) => ({
                                    ...item,
                                    ...{ departmentID: e.target.value },
                                }))
                            }
                        >
                            {departments && departments.length > 0
                                ? departments.map((item, index) => (
                                      <MenuItem key={index} value={item.departmentID}>
                                          {item.departmentName}
                                      </MenuItem>
                                  ))
                                : null}
                        </Select>
                    </FormControl>

                    <DatePicker
                        label="Ngày tạo"
                        required
                        sx={{ marginBottom: 2, width: '100%' }}
                        variant="outlined"
                        color="secondary"
                        format="DD-MM-YYYY"
                        defaultValue={moment.utc(user?.createdDateTime)}
                        disabled
                        slotProps={{ textField: { size: 'small' } }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button variant="contained" sx={{ minWidth: 100 }}>
                            Reset
                        </Button>
                        <LoadingButton loading={loading} type="submit" variant="contained" sx={{ minWidth: 100 }}>
                            Xác nhận
                        </LoadingButton>
                    </Box>
                </Box>
            </Modal>

            <ConfirmBox
                open={isDeleting}
                handleClose={cancleDelete}
                title="Xóa người dùng"
                content={`Bạn có chắc muốn xóa người dùng ${user?.fullname} ?`}
                submit={deleteUser}
            />
        </>
    );
}
