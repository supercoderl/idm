import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// assets

import LoggedUser from './loggedUser';
import SearchBar from './searchBar';

function MainHeader() {
    return (
        <Box bgcolor="background.paper" component="header" py={1.5} zIndex={1}>
            <Stack
                component={Container}
                maxWidth="lg"
                direction="row"
                height={50}
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                spacing={3}
                overflow="hidden"
            >
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                        component="sub"
                        variant="h1"
                        alignSelf="self-end"
                        display={{
                            xs: 'none',
                            sm: 'block',
                        }}
                    >
                        IDM
                    </Typography>
                </Stack>
                <SearchBar />
                <LoggedUser />
            </Stack>
        </Box>
    );
}

export default MainHeader;
