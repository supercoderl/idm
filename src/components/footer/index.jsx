import constants from '@/utils/constants';
// MUI
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';

// Icons
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
// assets
import logo from '@/assets/images/logo/png/Color_logo_nobg.png';

function Footer() {
    return (
        <Box bgcolor={(theme) => theme.palette.background.paper} py={3} borderTop={1} borderColor="cuaternary.300">
            <Container maxWidth="lg" component={Stack} direction="column" spacing={5}>
                <Grid container spacing={3} alignContent="center" justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Box component="img" src={logo} alt="slim logo" width="90%" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={5}>
                        <Typography variant="h6" my={1}>
                            Đăng ký để nhận thêm thông tin
                        </Typography>
                        <form>
                            <TextField
                                size="small"
                                margin="dense"
                                InputProps={{
                                    name: 'email',
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Button type="submit" variant="contained" disableElevation>
                                                Subcribe
                                            </Button>
                                        </InputAdornment>
                                    ),
                                    sx: {
                                        pr: 0,
                                    },
                                }}
                                placeholder="Email"
                                variant="outlined"
                                fullWidth
                            />
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={1} alignItems="center" direction="column">
                            <Typography variant="h6">Mạng xã hội</Typography>
                            <Stack direction="row" spacing={1}>
                                <Link href={constants.siteData.facebookUrl} target="_blank" rel="noreferrer noopener">
                                    <IconButton aria-label="network" color="primary">
                                        <FacebookIcon />
                                    </IconButton>
                                </Link>
                                <Link href={constants.siteData.twitterUrl} target="_blank" rel="noreferrer noopener">
                                    <IconButton aria-label="network" color="primary">
                                        <TwitterIcon />
                                    </IconButton>
                                </Link>
                                <Link href={constants.siteData.googleUrl} target="_blank" rel="noreferrer noopener">
                                    <IconButton aria-label="network" color="primary">
                                        <GoogleIcon />
                                    </IconButton>
                                </Link>
                                <Link href={constants.siteData.githubUrl} target="_blank" rel="noreferrer noopener">
                                    <IconButton aria-label="network" color="primary">
                                        <GitHubIcon />
                                    </IconButton>
                                </Link>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Stack spacing={1}>
                            <Typography variant="h6" my={1}>
                                Liên hệ
                            </Typography>
                            <ContactLink Icon={LocalPhoneOutlinedIcon} text="+00 000 000 00 00" />
                            <ContactLink Icon={EmailOutlinedIcon} text="00000000@hufi.edu.vn" />
                            <ContactLink Icon={LocationOnOutlinedIcon} text="Tân Phú, TP Hồ Chí Minh" />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={1}>
                            <Typography variant="h6" my={1}>
                                Liên kết nhanh
                            </Typography>
                            <FooterLink text="Trang chủ" />
                            <FooterLink text="Trang quản lý" />
                            <FooterLink text="Thông tin cá nhân" />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={1}>
                            <Typography variant="h6" my={1}>
                                FAQ
                            </Typography>
                            <FooterLink text="Để được hưởng trợ cấp xã hội, SV phải nộp hồ sơ gồm các giấy tờ gì?" />
                            <FooterLink text="Mỗi học kỳ, SV được nhận tiền hưởng trợ cấp xã hội là mấy tháng?" />
                            <FooterLink text="Thời gian biểu của các tiết học trong ngày tại trường được quy định như thế nào?" />
                        </Stack>
                    </Grid>
                </Grid>

                <Divider
                    variant="middle"
                    sx={{
                        bgcolor: (theme) => theme.palette.secondary.main,
                    }}
                />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" textAlign="center">
                        Copyright 2023 © All Rights Reserved. IT Department Management
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
}

function ContactLink({ Icon, text }) {
    return (
        <Stack spacing={1} alignItems="center" direction="row">
            <Icon
                color="primary"
                sx={{
                    mr: 3,
                }}
            />
            <Typography variant="body1">{text}</Typography>
        </Stack>
    );
}

function FooterLink({ text }) {
    return (
        <Link
            variant="body2"
            fontWeight="300"
            href="#!"
            underline="hover"
            sx={{
                color: 'text.primary',
                '&:hover': {
                    '& svg': {
                        opacity: '1',
                        ml: 2,
                    },
                },
                '&::before': {
                    content: '""',
                    display: 'inline-block',
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    width: '4px',
                    height: '4px',
                    mb: '2px',
                    mr: 2,
                },
            }}
        >
            {/* <span style={{ marginRight: '15px' }}>•</span> */}
            {text}
            <ArrowForwardIosIcon
                color="primary"
                sx={{
                    transition: '0.3s',
                    fontSize: '11px',
                    ml: 0,
                    opacity: '0',
                }}
            />
        </Link>
    );
}

export default Footer;
