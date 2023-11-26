import axiosInstance from '@/config/axiosConfig';
import {
    CardContent,
    Card,
    CardHeader,
    Chip,
    Button,
    Link,
    Grid,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import Modal from '@/components/modal';
import { LoadingButton } from '@mui/lab';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmBox from '@/components/confirmBox';

export default function Department({ title }) {
    const [department, setDepartment] = useState({
        departmentID: 0,
        departmentName: '',
        description: '',
    });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpened, setStateModal] = useState(false);
    const [isDeleting, setStateDeleting] = useState(false);

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const navigate = useNavigate();

    const getDepartments = async () => {
        await axiosInstance
            .get('Department/get-departments')
            .then((value) => {
                setTimeout(() => {
                    setDepartments(value.data.data);
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
        setDepartment(item);
    };

    const closeModal = () => {
        setStateModal(false);
    };

    const startDelete = (department) => {
        setStateDeleting(true);
        setDepartment(department);
    };

    const cancleDelete = () => {
        setStateDeleting(false);
    };

    const updateDepartment = async (event) => {
        event.preventDefault();
        setLoading(true);
        await axiosInstance
            .put(`Department/update-department/${department.departmentID}`, department)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message, 'success');
                    setLoading(false);
                    closeModal();
                    getDepartments();
                }, 600);
            })
            .catch((reason) => {
                alert(reason.response.data.message, 'error');
                setLoading(false);
                console.log(reason);
            });
    };

    const deleteDepartment = async () => {
        setLoading(true);
        await axiosInstance
            .delete(`Department/delete-department/${department.departmentID}`)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message);
                    setLoading(false);
                    getDepartments();
                });
            })
            .catch((reason) => {
                console.log(reason.response.data.message);
                setLoading(false);
            });
        cancleDelete();
    };

    const columns = [
        {
            field: 'departmentName',
            headerName: 'Tên phòng ban',
            width: 150,
        },
        {
            field: 'description',
            headerName: 'Mô tả',
            width: 450,
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
        getDepartments();
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
                        <Button
                            variant="contained"
                            sx={{ marginLeft: 2 }}
                            onClick={() => navigate('create-department')}
                        >
                            <AddIcon /> Phòng ban mới
                        </Button>
                    }
                />

                <CardContent>
                    <div style={{ height: 600, width: '100%', backgroundColor: 'white' }}>
                        <DataGrid
                            getRowId={(row) => row.departmentID}
                            rows={departments}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                        />
                    </div>
                </CardContent>
            </Card>
            <Modal
                openModal={isModalOpened}
                fnCloseModal={closeModal}
                maxWidth="xs"
                title="Chỉnh sửa phòng ban"
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
                            onSubmit={updateDepartment}
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
                                        label="Tên phòng ban"
                                        required
                                        variant="outlined"
                                        color="secondary"
                                        type="text"
                                        size="small"
                                        value={department.departmentName}
                                        onChange={(e) =>
                                            setDepartment((item) => ({
                                                ...item,
                                                ...{ departmentName: e.target.value },
                                            }))
                                        }
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={2} sm={4} md={12}>
                                    <TextField
                                        label="Mô tả"
                                        required
                                        variant="outlined"
                                        color="secondary"
                                        type="text"
                                        size="small"
                                        value={department.description}
                                        onChange={(e) =>
                                            setDepartment((item) => ({
                                                ...item,
                                                ...{ description: e.target.value },
                                            }))
                                        }
                                        fullWidth
                                        multiline
                                        rows={3}
                                        maxRows={5}
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
                title="Xóa phòng ban"
                content={`Bạn có chắc muốn xóa phòng ban ${department.departmentName} ?`}
                submit={deleteDepartment}
            />
        </>
    );
}
