import { forwardRef, useEffect, useState } from 'react';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function MuiSnackbar(props) {
    // const [notification, setNotification] = useState('');

    const { message, severity, title, sx, alertProps } = props;
    console.log(props);

    // useEffect(() => {
    //     WebsocketService.connect(() => {
    //         setNotification(message);
    //     });

    //     return () => {
    //         WebsocketService.disconnect();
    //     };
    // }, []);

    return (
        <Alert severity={severity} sx={{ boxShadow: 27, ...sx }} {...alertProps}>
            <AlertTitle>{title}</AlertTitle>
            {message}
        </Alert>
    );
}

const MuiSnackbarVariant = forwardRef((props, ref) => (
    <div ref={ref}>
        <MuiSnackbar {...props} />
    </div>
));

export function Provider({ children }) {
    return (
        <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ horizontal: 'top', vertical: 'center' }}
            Components={{
                muiSnackbar: MuiSnackbarVariant,
            }}
        >
            {children}
        </SnackbarProvider>
    );
}

export default enqueueSnackbar;
