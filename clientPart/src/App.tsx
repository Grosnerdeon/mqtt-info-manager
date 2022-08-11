import { 
    Alert,
    AlertColor,
    Snackbar, 
    Stack, 
} from "@mui/material";

import React, { useEffect } from "react";

import { NotificationsType } from "./dtos/notificationsDto";
import { useActions } from "./hooks/useActions"
import { useTypedSelector } from "./hooks/useTypedSelector";
import { ConnectionList } from "./components/connections/connectionList";
import { ConnectionCreater } from "./components/connections/connectionCreater";
import { Loader } from "./components/loader/loader";
import { SubscribeManager } from "./components/connectionMainPage/subscribeManager";
import { ConnectionMainPage } from "./components/connectionMainPage/connectionMainPage";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { PublisherManager } from "./components/publisherManager/publisherManager";
import { PublisherList } from "./components/publisherList/publisherList";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import localStorageService from './services/localStorageService';
import { ApplicationToolBar } from "./components/application/applicationToolbar";
import { ApplicationMode, ApplicationPage } from "./dtos/applicationDto";

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });  

const App: React.FunctionComponent = () => {
    const {
        fetchConnections,
        changeMode,
        showNotification,
        hideNotification,
        changePage
    } = useActions();

    const {
        currentPage,
        currentMode
    } = useTypedSelector((state) => state.application);

    const {
        error
    } = useTypedSelector((state) => state.connections);

    const {
        showNotifications,
        message,
        type
    } = useTypedSelector((state) => state.notifications);

    useEffect(() => {
        const mainConnection = localStorageService.getDataToLocalStorage('appMainConnection');

        if (mainConnection !== null) {
            const jsonMainConnection = JSON.parse(mainConnection);

            changePage(ApplicationPage.CONNECTION, jsonMainConnection.connection)
        }

        fetchConnections();
    }, []);

    useEffect(() => {
        if (error !== null) {
            showNotification(error, NotificationsType.ERROR);
        }
    }, [error])

    let colorMessage: AlertColor = 'error';

    switch(type) {
        case NotificationsType.WARNING:
            colorMessage = 'warning';
            break;
        case NotificationsType.INFO:
            colorMessage = 'info';
            break;
        default:
            colorMessage = 'error';
            break;    
    }

    const setClassName = (currentMode: ApplicationMode | undefined): string => {
        if (currentMode === ApplicationMode.CONNECTION_CREATE || currentMode === ApplicationMode.SUBSCRIBE) {
            return 'show-editor';
        } 

        return 'hide-editor';
    };

    const classNameCreatorConnection = setClassName(currentMode);
    const classNameSubcribeTopic = setClassName(currentMode);

    const [mode, setMode] = React.useState<'light' | 'dark'>(localStorageService.getDataToLocalStorage('appColorMode') || 'light');
    const colorMode = React.useMemo(() => ({
            toggleColorMode: () => {
              setMode((prevMode) => {
                    if (prevMode === 'light') {
                        localStorageService.addDataToLocalStorage('appColorMode', 'dark');
                    } else {
                        localStorageService.addDataToLocalStorage('appColorMode', 'light');
                    }
                  
                    return prevMode === 'light' ? 'dark' : 'light';
                });
            },
          }),[]);
      
        const theme = React.useMemo(
          () =>
            createTheme({
              palette: {
                mode,
                primary: {
                    main: mode === 'light' ? '#1976d2' : '#c4c4c4'
                },
                secondary: {
                    main: mode === 'light' ? '#ff8a65' : '#d9e3f0'
                }
              },
            }),
          [mode],
        );

        if (mode === 'light') {
            document.body.style.backgroundColor = 'rgba(0,0,0,0.1)'
          } else {
            document.body.style.backgroundColor = 'rgba(0,0,0,0.7)'
          }

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
            <div>
                <ApplicationToolBar colorMode={colorMode} theme={theme}></ApplicationToolBar>
                {currentPage === ApplicationPage.CONNECTIONS && (
                    <Stack spacing={2} sx={{ padding: "16px" }}>
                        <div className={classNameCreatorConnection}>
                            {currentMode === ApplicationMode.CONNECTION_CREATE && 
                            <ConnectionCreater></ConnectionCreater>}
                        </div>
                        <ConnectionList>
                        </ConnectionList>
                    </Stack>
                )}
                {currentPage === ApplicationPage.CONNECTION && (
                    <Stack spacing={2} sx={{ padding: "16px" }}>
                        <div className={classNameSubcribeTopic}>
                            {currentMode === ApplicationMode.SUBSCRIBE && <SubscribeManager></SubscribeManager>}
                        </div>
                        <ConnectionMainPage>
                        </ConnectionMainPage>
                        <SwipeableDrawer
                                anchor={'right'}
                                open={currentMode === ApplicationMode.PUBLISHER_EDIT}
                                onClose={() => {
                                    changeMode()
                                }}
                                onOpen={(event) => {
                                    changeMode(ApplicationMode.PUBLISHER_EDIT)
                                    
                                }}
                            >
                            <PublisherManager></PublisherManager>
                        </SwipeableDrawer>
                        <SwipeableDrawer
                                anchor={'right'}
                                open={currentMode === ApplicationMode.PUBLISHER_LIST}
                                onClose={() => {
                                    changeMode()
                                }}
                                onOpen={(event) => {
                                    changeMode(ApplicationMode.PUBLISHER_LIST)
                                }}
                            >
                            <PublisherList></PublisherList>
                        </SwipeableDrawer>
                    </Stack>
                )}
                <Snackbar
                    open={showNotifications}
                    autoHideDuration={6000}
                    onClose={hideNotification}
                >
                    <Alert
                        onClose={hideNotification}
                        severity={colorMessage}
                        sx={{ width: "100%" }}
                    >
                        {message}
                    </Alert>
                </Snackbar>
                <Loader></Loader>
            </div> 
            </ThemeProvider>
        </ColorModeContext.Provider>
        
    );
}

export default App;