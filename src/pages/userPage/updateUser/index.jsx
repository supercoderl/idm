import PageHeader from '@/components/pageHeader';
import {
    Link,
    Typography,
    Breadcrumbs,
    Card,
    CardContent,
    Grid,
    Avatar,
    TextField,
    Divider,
    Button,
    Box,
    Select,
    MenuItem,
} from '@mui/material';
import SampleTabsPage from '@/pages/sample/sampleTabsPage';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useState } from 'react';
import axiosInstance from '@/config/axiosConfig';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

export default function CreateUserPage() {
    const [dateOfBirth, setDateOfBirth] = useState(moment(new Date()));
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const comeback = () => {
        window.history.back();
    };

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);
        const body = {
            usernameOrEmail: data.get('usernameOrEmail'),
            passwordHash: data.get('password'),
            fullname: data.get('fullname'),
            firstname: data.get('fullname').substring(data.get('fullname').indexOf(' ') + 1),
            lastname: data.get('fullname').substring(0, data.get('fullname').indexOf(' ')),
            gender: data.get('gender'),
            dateOfBirth: moment(dateOfBirth).format('YYYY-MM-DD'),
        };

        await axiosInstance
            .post('Auth/register', body)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message);
                    setLoading(false);
                }, 600);
            })
            .catch((reason) => {
                console.log(reason.response.data.message);
                setLoading(false);
            });
    };

    return (
        <>
            <PageHeader title="Tạo người dùng mới">
                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{
                        textTransform: 'uppercase',
                    }}
                >
                    <Link underline="hover" href="#!">
                        IDM
                    </Link>
                    <Typography color="text.tertiary">Tạo người dùng mới</Typography>
                </Breadcrumbs>
            </PageHeader>
            <Card type="section">
                <CardContent
                    sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 400, overflowY: 'auto' }}
                    className="card-profile"
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Avatar alt="avt" src="https://i.imgur.com/X2WIvMl.jpg" sx={{ width: 80, height: 'auto' }} />

                        <Box sx={{ float: 'right' }}>
                            <Button variant="contained" onClick={comeback}>
                                <KeyboardBackspaceIcon fontSize="small" /> &nbsp; Trở về
                            </Button>
                        </Box>
                    </Box>

                    <Divider dark sx={{ my: 1 }} />

                    <Box component="form" onSubmit={submit}>
                        <Grid
                            container
                            sx={{ m: 0 }}
                            direction="row"
                            justify="flex-start"
                            alignItems="flex-start"
                            spacing={{ xs: 2, md: 3 }}
                            columns={{ xs: 4, sm: 8, md: 12 }}
                        >
                            <Grid item xs={2} sm={4} md={4}>
                                <TextField
                                    label="Tên đăng nhập"
                                    required
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    size="small"
                                    id="usernameOrEmail"
                                    name="usernameOrEmail"
                                    autoComplete="usernameOrEmail"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                                <TextField
                                    label="Mật khẩu"
                                    required
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    size="small"
                                    id="password"
                                    name="password"
                                    autoComplete="password"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                                <TextField
                                    label="Họ và tên"
                                    required
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    size="small"
                                    id="fullname"
                                    name="fullname"
                                    autoComplete="fullname"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                                <DatePicker
                                    label="Ngày sinh"
                                    required
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    size="small"
                                    sx={{ width: '100%' }}
                                    onChange={(e) => {
                                        setDateOfBirth(e._d);
                                    }}
                                    slotProps={{ textField: { size: 'small' } }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                                <Select
                                    label="Giới tính"
                                    required
                                    sx={{ marginBottom: 2 }}
                                    variant="outlined"
                                    color="secondary"
                                    size="small"
                                    id="gender"
                                    name="gender"
                                    autoComplete="gender"
                                    fullWidth
                                >
                                    <MenuItem value="Nam">Nam</MenuItem>
                                    <MenuItem value="Nữ">Nữ</MenuItem>
                                    <MenuItem value="Khác">Khác</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                                <TextField
                                    label="Vị trí"
                                    required
                                    sx={{ marginBottom: 2 }}
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    size="small"
                                    id="priority"
                                    name="priority"
                                    autoComplete="priority"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>

                        <Button variant="outlined" type="submit" sx={{ marginLeft: 2, float: 'right' }}>
                            Xác nhận
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <SampleTabsPage />
        </>
    );
}
