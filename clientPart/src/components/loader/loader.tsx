import { CircularProgress, Stack } from "@mui/material";
import React from "react";
import { FunctionComponent } from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";

export const Loader: FunctionComponent = () => {
    const { loading } = useTypedSelector(state => state.connections);

    return (
        <>
            {loading &&
                <Stack 
                    sx={{
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'gainsboro',
                        opacity: '70%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: 0
                    }}
                >
                    <CircularProgress size={100}/>
                </Stack>
          }
        </>
    );
}