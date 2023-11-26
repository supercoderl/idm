import calcHeaderHeight from '@helpers/layoutHeight';
// MUI
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// Icons
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { Button } from '@mui/material';

function Page403() {
    return (
        <Stack
            px={5}
            direction="column"
            spacing={1}
            justifyContent="center"
            alignItems="center"
            minHeight={`calc(100vh - ${calcHeaderHeight('header')})`}
            color="text.tertiary"
        >
            <Typography
                variant="h1"
                fontSize={150}
                borderBottom={1}
                sx={{
                    textDecoration: 'dotted underline',
                }}
            >
                403
            </Typography>
            {/* <Typography variant="h2" color="inherit">
				Page not found
			</Typography> */}
            <Typography variant="h2" color="inherit">
                Không thể truy cập...
            </Typography>
            {/* <Typography variant="body2" color="inherit">
				You may have mistyped the address or the page may have moved.
			</Typography> */}
            <Typography variant="body2" color="inherit">
                Bạn không có quyền truy cập vào trang này.
            </Typography>
            <Typography variant="body2" color="inherit">
                Vui lòng liên hệ đến administrator hoặc trở về trang chủ.
            </Typography>
            <SentimentVeryDissatisfiedIcon
                sx={{
                    fontSize: 110,
                }}
            />
            <Button variant="outlined" sx={{ padding: 1 }} onClick={() => window.location.replace('/home')}>
                Back to home page
            </Button>
        </Stack>
    );
}

export default Page403;
