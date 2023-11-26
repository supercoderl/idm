import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LockSharpIcon from '@mui/icons-material/LockSharp';
import axiosInstance from '@/config/axiosConfig';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const login = async (event) => {
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);
        const body = {
            usernameOrEmail: data.get('usernameOrEmail'),
            password: data.get('password'),
        };

        await axiosInstance
            .post('Auth/login', body)
            .then((value) => {
                setTimeout(() => {
                    window.localStorage.setItem('token', value.data.data.token.accessToken);
                    window.localStorage.setItem('refreshToken', value.data.data.refreshToken.refreshToken);
                    navigate('home');
                    alert(value.data.message, 'success');
                    setLoading(false);
                }, 600);
            })
            .catch((reason) => {
                setLoading(false);
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    px: 4,
                    py: 8,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ mb: 3, bgcolor: 'primary.main', height: 56, width: 56 }}>
                    <LockSharpIcon sx={{ height: 32, width: 32 }} />
                </Avatar>
                <Typography component="h1" variant="h2">
                    Đăng nhập hệ thống quản lý khoa CNTT
                </Typography>
                <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="usernameOrEmail"
                        label="Tên đăng nhập hoặc email"
                        name="usernameOrEmail"
                        autoComplete="usernameOrEmail"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />

                    <FormControlLabel
                        sx={{ width: '100%' }}
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />

                    <LoadingButton
                        loading={loading}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ py: 1.2, mt: 3, mb: 2 }}
                    >
                        Sign In
                    </LoadingButton>
                    <Grid container>
                        <Grid item xs>
                            <Link href="/#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/#" variant="body2">
                                Don&apos;t have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;
