import { Drawer, Box, Typography, useTheme, DrawerProps, SxProps, Theme, IconButton, Tooltip } from "@mui/material";
import React, { ReactNode, useEffect } from "react";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
// import CloseIcon from '@mui/icons-material/LastPageRounded';
// import CloseSidebar from '../assets/images/icons/closeNewIcon.svg';
// import Image from "./Image";
const sizes = {
  xxl: 1200, // Extra Extra Large
  xl: 1000, // Extra Large
  lg: 800,   // Large 
  md: 600,   // Medium
  sm: 400,   // Small
  xs: 300,   // Extra Small
  xxs: 200,   // Extra Extra Small
  micro: 100  // Micro size
}
export interface DrawerProp extends DrawerProps {
    toggleDrawer: () => void;
    drawerTitle?: ReactNode | string;
    titleStyles?: SxProps<Theme>;
    isArrow?: boolean;
    bgColor?: string;
    size?: keyof typeof sizes;
    drawerStyles?: SxProps<Theme>;
    ModalProps?: DrawerProps['ModalProps'];
    children?: ReactNode;
    headerAction?: ReactNode;
}

const CommonDrawer = ({
    drawerTitle,
    toggleDrawer,
    headerAction,
    children,
    bgColor,
    anchor = 'right',
    titleStyles = {},
    isArrow = false,
    drawerStyles = {},
    size,
    ModalProps,
}: DrawerProp) => {
    const theme = useTheme();

    useEffect(() => {
        const cb = (ev: KeyboardEvent) => {
            if(ev.key === 'Escape') {
                toggleDrawer();
            }
        };
        document.addEventListener('keyup', cb, false)

        return () => document.removeEventListener('keyup', cb, false);
    }, [])
    return (
      <Drawer
        anchor={anchor}
        open={true}
        sx={{
          ...drawerStyles,
        }}
        transitionDuration={{
          enter: 5000,
          appear: 100,
                exit: 500
        }}
        ModalProps={ModalProps}
      >
        <Box
          sx={{
            // bgcolor: bgColor || theme.palette.secondary.light,
            height: "100%",
                    width: size ? sizes[size] : 'auto',
                    boxSizing: 'border-box',
          }}
        >
          <Typography
            sx={{
                        display: 'flex',
                       paddingLeft:'12px !important',
                        justifyContent: 'space-between',
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.light,
                        fontSize:'1rem',
              padding: theme.spacing(1),
                        '& svg': {
                            cursor: 'pointer'
              },
                        alignItems: 'center',
              height: "38px", // Added fixed height
              lineHeight: "38px", // Ensures text stays vertically centered
                        ...titleStyles
            }}
          >
            {isArrow && (
              <>
                            <span style={{ display: 'inline-flex', fontSize: '0.875rem', alignItems: 'center' }}>
                  {/* <ArrowBackIcon sx={{ marginRight: '5px' }} /> */}
                  {drawerTitle}
                </span>

              </>
            )}
            {!isArrow && (
              <>
                            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span>{drawerTitle}</span>
                </span>


              </>
            )}
                        <Box sx={{ display: 'flex', alignItems: 'center', py:'0px'}}>
              {headerAction}
              <Tooltip title="Close Panel" arrow>
                        <IconButton onClick={toggleDrawer} sx={{alignSelf:'center','&:hover':{
                            background:'transparent'
                        }}} >
                        {/* <Image src={CloseSidebar} alt={"Close Panel"} /> */}
                         <CloseIcon sx={{ color: theme.palette.primary.light }} />
                </IconButton>
              </Tooltip>
            </Box>
                  

          </Typography>
          <Box
                    bgcolor={bgColor || '#D5D9E7'}
            // margin={theme.spacing(1)}
            padding={theme.spacing(1.2)}
                  
            // borderRadius={5}
            height="calc(100vh - 75px)"
            overflow="auto"
          >
                    <Box
                        paddingBottom={theme.spacing(6)}
                    >
                        {children}
                    </Box>
          </Box>
        </Box>
      </Drawer>
    );
}

export default CommonDrawer;
