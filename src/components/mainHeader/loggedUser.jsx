import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
// MUI
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
// Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import TaskOutlinedIcon from '@mui/icons-material/TaskOutlined';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
// assets

// Components
import NotificationsButton from './notificationButton';
import axiosInstance from '@/config/axiosConfig';
import { enqueueSnackbar } from 'notistack';

function LoggedUser() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const getProfile = async () => {
        await axiosInstance
            .get('User/profile')
            .then((value) => {
                setTimeout(() => {
                    setUser(value.data.data);
                }, 600);
            })
            .catch((reason) => {
                if (reason.response.status !== 401) console.log(reason);
            });
    };

    const logout = async () => {
        const body = { refreshToken: window.localStorage.getItem('refreshToken') };

        if (body) {
            await axiosInstance
                .post('Auth/logout', body)
                .then((value) => {
                    alert(value.data.message, 'success');
                    window.localStorage.clear();
                    navigate('/');
                })
                .catch((reason) => {
                    if (reason.response.status !== 401) alert(reason.response.data.message);
                });
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <>
            <Menu
                elevation={26}
                sx={{
                    '& .MuiMenuItem-root': {
                        mt: 0.5,
                    },
                }}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <UserMenu handleClose={handleClose} user={user} logout={logout} />
            </Menu>
            <Stack height="100%" direction="row" flex={1} justifyContent="flex-end" alignItems="center" spacing={0}>
                <NotificationsButton />
                <IconButton size="small">
                    <Badge color="tertiary" overlap="rectangular" variant="dot">
                        <CommentOutlinedIcon color="primary" fontSize="small" />
                    </Badge>
                </IconButton>
                <ButtonBase
                    onClick={handleClick}
                    variant="outlined"
                    sx={{
                        ml: 1,
                        height: '100%',
                        overflow: 'hidden',
                        borderRadius: '25px',
                        transition: '.2s',
                        px: 1,
                        transitionProperty: 'background,color',
                        '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
                        },
                        '&:hover .MuiSvgIcon-root': {
                            opacity: '1',
                            // transform: 'translateX(10px)',
                        },
                    }}
                >
                    <Stack width="100%" direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                        <Avatar
                            alt="User Img"
                            sx={{
                                width: 35,
                                height: 35,
                                boxShadow: (theme) =>
                                    `0px 0px 0px 4px ${theme.palette.background.paper} ,0px 0px 0px 5px ${theme.palette.primary.main} `,
                            }}
                        />
                        <Typography
                            variant="body2"
                            display={{
                                xs: 'none',
                                sm: 'inline-block',
                            }}
                        >
                            {user ? user.fullname : null}
                        </Typography>
                        <ExpandMoreIcon
                            fontSize="small"
                            sx={{
                                transition: '0.2s',
                                opacity: '0',
                            }}
                        />
                    </Stack>
                </ButtonBase>
            </Stack>
        </>
    );
}

function UserMenu(props) {
    const { handleClose, user, logout } = props;
    return (
        <MenuList
            sx={{
                p: 1,
                '& .MuiMenuItem-root': {
                    borderRadius: 2,
                },
            }}
        >
            <Stack px={3}>
                <Typography variant="subtitle1" textAlign="center">
                    {user ? user.fullname : null}
                </Typography>
                <Typography variant="subtitle2" textAlign="center">
                    Administrator
                </Typography>
            </Stack>
            <Divider
                sx={{
                    borderColor: 'primary.light',
                    my: 1,
                }}
            />
            <MenuItem onClick={handleClose} to="/pages/notifications" component={RouterLink}>
                <ListItemIcon>
                    <NotificationsNoneOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Notifications <ListBadge color="info.main" count={18} />
            </MenuItem>
            <MenuItem onClick={handleClose} to="/" component={RouterLink}>
                <ListItemIcon>
                    <DraftsOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Messages
                <ListBadge color="success.main" count={5} />
            </MenuItem>
            <MenuItem onClick={handleClose} to="/" component={RouterLink}>
                <ListItemIcon>
                    <TaskOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Tasks <ListBadge color="error.main" count={23} />
            </MenuItem>
            <MenuItem onClick={handleClose} to="/" component={RouterLink}>
                <ListItemIcon>
                    <CommentOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Comments <ListBadge color="warning.main" count={11} />
            </MenuItem>
            <Divider
                sx={{
                    borderColor: 'primary.light',
                    my: 1,
                }}
            />
            <MenuItem onClick={handleClose} to="/home/profile" component={RouterLink}>
                <ListItemIcon>
                    <Person2OutlinedIcon fontSize="small" />
                </ListItemIcon>
                Profile
            </MenuItem>

            <MenuItem onClick={handleClose} to="/pages/settings" component={RouterLink}>
                <ListItemIcon>
                    <SettingsOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Account Settings
            </MenuItem>
            <MenuItem onClick={handleClose} to="/" component={RouterLink}>
                <ListItemIcon>
                    <PaymentOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Payments
            </MenuItem>
            <MenuItem onClick={handleClose} to="/" component={RouterLink}>
                <ListItemIcon>
                    <SummarizeOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Projects
            </MenuItem>
            <Divider
                sx={{
                    borderColor: 'primary.light',
                    my: 1,
                }}
            />
            <MenuItem onClick={handleClose} component={RouterLink} to="/">
                <ListItemIcon>
                    <LockPersonOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Lock Account
            </MenuItem>
            <MenuItem onClick={logout}>
                <ListItemIcon>
                    <ExitToAppIcon fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </MenuList>
    );
}

function ListBadge({ color, count }) {
    return (
        <Box
            ml={1}
            bgcolor={color}
            color="primary.contrastText"
            height={20}
            width={20}
            fontSize="body1"
            borderRadius="50%"
            display="grid"
            sx={{ placeItems: 'center' }}
        >
            {count}
        </Box>
    );
}
export default LoggedUser;
