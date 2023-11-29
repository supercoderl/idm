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
} from '@mui/material';
import SampleTabsPage from '../sample/sampleTabsPage';
import Modal from '../../components/modal';
import { useState } from 'react';
import axiosInstance from '@/config/axiosConfig';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

function ProfilePage() {
    const [isModalOpened, setStateModal] = useState(false);
    const navigate = useNavigate();

    const openModal = () => {
        setStateModal(true);
    };

    const closeModal = () => {
        setStateModal(false);
    };

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const changePassword = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (data.get('newPassword') !== data.get('confirmPassword')) {
            alert('Mật khẩu không trùng khớp', 'error');
            return;
        }

        const body = {
            oldPassword: data.get('oldPassword'),
            newPassword: data.get('newPassword'),
        };

        await axiosInstance
            .put('Auth/change-password', body)
            .then((value) => {
                alert(value.data.message, 'success');
                navigate('/');
            })
            .catch((reason) => {
                if (reason.response.status !== 401) {
                    alert(reason.response.data.message, 'error');
                    console.log(reason);
                }
            });
    };

    return (
        <>
            <PageHeader title="Hồ sơ cá nhân">
                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{
                        textTransform: 'uppercase',
                    }}
                >
                    <Link underline="hover" href="#!">
                        IDM
                    </Link>
                    <Typography color="text.tertiary">Hồ sơ cá nhân</Typography>
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
                            <Button variant="contained" onClick={openModal}>
                                Đổi mật khẩu
                            </Button>
                            <Button variant="outlined" sx={{ marginLeft: 2 }}>
                                Lưu thay đổi
                            </Button>
                        </Box>
                    </Box>

                    <Divider dark sx={{ my: 1 }} />

                    <form>
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
                                    label="Họ và tên"
                                    required
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                                <TextField
                                    label="Email"
                                    required
                                    variant="outlined"
                                    color="secondary"
                                    type="email"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                                <TextField
                                    label="Ngày sinh"
                                    required
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                                <TextField
                                    label="Giới tính"
                                    required
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                                <TextField
                                    label="Trạng thái"
                                    required
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                                <TextField
                                    label="Ngày tạo tài khoản"
                                    required
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>

            <Modal openModal={isModalOpened} fnCloseModal={closeModal} maxWidth="xs" title="Đổi mật khẩu" padding>
                <Box component="form" onSubmit={changePassword}>
                    <TextField
                        label="Mật khẩu cũ"
                        required
                        sx={{ marginBottom: 2 }}
                        variant="outlined"
                        color="secondary"
                        type="text"
                        size="small"
                        id="oldPassword"
                        name="oldPassword"
                        autoComplete="oldPassword"
                        fullWidth
                    />

                    <TextField
                        label="Mật khẩu mới"
                        required
                        sx={{ marginBottom: 2 }}
                        variant="outlined"
                        color="secondary"
                        type="text"
                        size="small"
                        id="newPassword"
                        name="newPassword"
                        autoComplete="newPassword"
                        fullWidth
                    />

                    <TextField
                        label="Nhập lại mật khẩu mới"
                        required
                        sx={{ marginBottom: 2 }}
                        variant="outlined"
                        color="secondary"
                        type="text"
                        size="small"
                        id="confirmPassword"
                        name="confirmPassword"
                        autoComplete="confirmPassword"
                        fullWidth
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button variant="contained" sx={{ minWidth: 100 }}>
                            Reset
                        </Button>
                        <Button type="submit" variant="contained" sx={{ minWidth: 100 }}>
                            Xác nhận
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <SampleTabsPage />
        </>
    );
}

export default ProfilePage;
