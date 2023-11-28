import '@/assets/css/style.css';
import '@fontsource/rubik/300.css';
import '@fontsource/rubik/400.css';
import '@fontsource/rubik/500.css';
import '@fontsource/rubik/700.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';

import StoreProvider from '@/store';

import { Provider as SnackbarProvider } from '@/components/snackbar';

import MUITheme from '@/utils/theme';
import Router from '@/utils/routes';
import CustomizationLayout from '@/components/layouts/customization';
import { useMemo, useState } from 'react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material';
import * as locales from '@mui/material/locale';

function App() {
    const [locale, setLocale] = useState('viVN');

    const theme = useTheme();

    const themeWithLocale = useMemo(() => createTheme(theme, locales[locale]), [locale, theme]);

    return (
        <ThemeProvider theme={themeWithLocale}>
            <StoreProvider>
                <MUITheme>
                    <SnackbarProvider>
                        <CustomizationLayout />
                        <Router />
                    </SnackbarProvider>
                </MUITheme>
            </StoreProvider>
        </ThemeProvider>
    );
}

export default App;
