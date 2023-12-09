import { createElement, useEffect, useState } from 'react';
// MUI
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ListItemIcon from '@mui/material/ListItemIcon';

import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import AppRegistrationIcon from '@mui/icons-material/AppRegistrationOutlined';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GroupsIcon from '@mui/icons-material/Groups';
import ManageAccountIcon from '@mui/icons-material/ManageAccountsOutlined';

import PageHeader from '@/components/pageHeader';
import CardHeader from '@/components/cardHeader';
import ProgressCard from '../mainPage/progress';
import Account from '../mainPage/account';
import Assignment from '../mainPage/assignment';
import Proposal from '../mainPage/proposal';
import File from '../mainPage/file';
import Schedule from '../mainPage/meeting';
import Statistic from '../mainPage/statistic';
import Department from '../mainPage/department';
import axiosInstance from '@/config/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faCalendar,
    faWalkieTalkie,
    faWindowRestore,
    faFile,
    faChartSimple,
    faShieldHalved,
    faMedal,
} from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import Role from '../mainPage/role';

library.add(faUser);
library.add(faCalendar);
library.add(faWalkieTalkie);
library.add(faWindowRestore);
library.add(faFile);
library.add(faChartSimple);
library.add(faShieldHalved);
library.add(faMedal);

function SampleTabsPage() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);

    const getMenus = async () => {
        setLoading(true);
        await axiosInstance
            .get('Menu/get-menus-by-role')
            .then((value) => {
                setTimeout(() => {
                    setMenus(value.data.data);
                    console.log(value);
                    setLoading(false);
                }, 600);
            })
            .catch((reason) => {
                if (reason.response.status !== 401) {
                    setLoading(false);
                    console.log(reason);
                }
            });
    };

    const setPageIndex = (index) => {
        setActiveIndex(index);
        localStorage.setItem('pageIndex', index);
    };

    const getMenuID = (value) => {
        const menu = menus.find((x) => x.code === value);
        return menu ? menu.menuID : 0;
    };

    useEffect(() => {
        getMenus();
        setActiveIndex(localStorage.getItem('pageIndex') ? Number(localStorage.getItem('pageIndex')) : 0);
    }, []);
    return (
        <>
            <PageHeader title="Trang quản lý">
                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{
                        textTransform: 'uppercase',
                    }}
                >
                    <Link underline="hover" href="#!">
                        IDM
                    </Link>
                    <Typography color="text.tertiary">Trang quản lý</Typography>
                </Breadcrumbs>
            </PageHeader>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={4} md={3}>
                    <Card component="aside" sx={{ marginBottom: 2 }}>
                        <MenuList
                            sx={{
                                '& .MuiMenuItem-root': {
                                    borderRadius: 2,
                                },
                            }}
                        >
                            {menus && menus.length > 0
                                ? menus.map((item, index) => (
                                      <MenuListItem
                                          key={index}
                                          icon={item.menuIcon}
                                          text={item.menuName}
                                          onClick={() => setPageIndex(item.menuID)}
                                          selected={activeIndex === item.menuID}
                                      />
                                  ))
                                : null}
                        </MenuList>
                    </Card>

                    <Card component="aside">
                        <ProgressCard />
                    </Card>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                    {activeIndex === getMenuID('Account') && <Account title="Quản lý tài khoản" />}
                    {activeIndex === getMenuID('Schedule') && <Schedule title="Lịch họp, trực khoa" />}
                    {activeIndex === getMenuID('Assignment') && <Assignment title="Phân công công việc" />}
                    {activeIndex === getMenuID('Proposal') && <Proposal title="Đề xuất" />}
                    {activeIndex === getMenuID('File') && <File title="Quản lý hồ sơ lưu trữ" />}
                    {activeIndex === getMenuID('Department') && <Department title="Quản lý phòng ban" />}
                    {activeIndex === getMenuID('Report') && <Statistic title="Báo cáo thống kê" />}
                    {activeIndex === getMenuID('Authorize') && <Role title="Phân quyền" />}
                </Grid>
            </Grid>
        </>
    );
}

function MenuListItem({ icon, text, ...props }) {
    return (
        <MenuItem {...props} sx={{ paddingBlock: 1.2 }}>
            <ListItemIcon>
                <FontAwesomeIcon icon={icon} fontSize={23} />
            </ListItemIcon>
            {text}
        </MenuItem>
    );
}

function Section({ text }) {
    return (
        <Card
            sx={{
                minHeight: '100vh',
            }}
            type="section"
        >
            <CardHeader title={`Section ${text} Title`} subtitle="Section subtitle">
                Optional Action
            </CardHeader>
            {text}
        </Card>
    );
}

export default SampleTabsPage;
