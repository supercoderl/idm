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
    TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useEffect, useState } from 'react';
import axiosInstance from '@/config/axiosConfig';
import { enqueueSnackbar } from 'notistack';
import { Textarea } from '@mui/joy';
import moment from 'moment';
import { LoadingButton } from '@mui/lab';

export default function CreateDepartment() {
    const [department, setDepartment] = useState({
        departmentName: '',
        description: '',
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
            .post('Department/create-department', department)
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
            <PageHeader title="Tạo phòng ban mới">
                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{
                        textTransform: 'uppercase',
                    }}
                >
                    <Link underline="hover" href="#!">
                        IDM
                    </Link>
                    <Typography color="text.tertiary">Tạo phòng ban mới</Typography>
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
                                rows={[]}
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
                </CardContent>
            </Card>
            asd
        </>
    );
}
