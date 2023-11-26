// MUI
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Card from '@mui/material/Card';

import PageHeader from '@/components/pageHeader';
import CardHeader from '@/components/cardHeader';

import SampleTabsPage from './sampleTabsPage';
import { CardContent, Box, Link } from '@mui/material';

function SamplePage() {
    return (
        <>
            <PageHeader title="Trang chủ">
                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{
                        textTransform: 'uppercase',
                    }}
                >
                    <Link underline="hover" href="#!">
                        IDM
                    </Link>
                    <Typography color="text.tertiary">Trang chủ</Typography>
                </Breadcrumbs>
            </PageHeader>
            <Card
                type="section"
                sx={{
                    minHeight: '60vh',
                }}
            >
                <CardHeader title="Thông báo mới" subtitle="5 Thông báo mới nhất hằng ngày sẽ được cập nhật">
                    <Link href="#!">Xem tất cả</Link>
                </CardHeader>

                <CardContent
                    sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 400, overflowY: 'auto' }}
                    className="card-notification"
                >
                    <Box
                        sx={{ border: '1px solid #eaeaea', borderRadius: '4px', py: 2, px: 2, display: 'flex' }}
                        color="text.secondary"
                    >
                        <Box
                            sx={{ width: 120 }}
                            component="img"
                            alt="Notification"
                            src="https://sinhvien.hufi.edu.vn/Content/ThemeMXH/img/icons/news.png"
                        />
                        <Link underline="none" href="#!" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                            Danh sách dự kiến sinh viên không có lịch thi cuối kỳ đợt 1 – học kỳ 1 năm học 2023-2024
                        </Link>
                    </Box>

                    <Box
                        sx={{ border: '1px solid #eaeaea', borderRadius: '4px', py: 2, px: 2, display: 'flex' }}
                        color="text.secondary"
                    >
                        <Box
                            sx={{ width: 120 }}
                            component="img"
                            alt="Notification"
                            src="https://sinhvien.hufi.edu.vn/Content/ThemeMXH/img/icons/news.png"
                        />
                        <Link underline="none" href="#!" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                            Danh sách dự kiến sinh viên không có lịch thi cuối kỳ đợt 1 – học kỳ 1 năm học 2023-2024
                        </Link>
                    </Box>

                    <Box
                        sx={{ border: '1px solid #eaeaea', borderRadius: '4px', py: 2, px: 2, display: 'flex' }}
                        color="text.secondary"
                    >
                        <Box
                            sx={{ width: 120 }}
                            component="img"
                            alt="Notification"
                            src="https://sinhvien.hufi.edu.vn/Content/ThemeMXH/img/icons/news.png"
                        />
                        <Link underline="none" href="#!" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                            Danh sách dự kiến sinh viên không có lịch thi cuối kỳ đợt 1 – học kỳ 1 năm học 2023-2024
                        </Link>
                    </Box>

                    <Box
                        sx={{ border: '1px solid #eaeaea', borderRadius: '4px', py: 2, px: 2, display: 'flex' }}
                        color="text.secondary"
                    >
                        <Box
                            sx={{ width: 120 }}
                            component="img"
                            alt="Notification"
                            src="https://sinhvien.hufi.edu.vn/Content/ThemeMXH/img/icons/news.png"
                        />
                        <Link underline="none" href="#!" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                            Danh sách dự kiến sinh viên không có lịch thi cuối kỳ đợt 1 – học kỳ 1 năm học 2023-2024
                        </Link>
                    </Box>

                    <Box
                        sx={{ border: '1px solid #eaeaea', borderRadius: '4px', py: 2, px: 2, display: 'flex' }}
                        color="text.secondary"
                    >
                        <Box
                            sx={{ width: 120 }}
                            component="img"
                            alt="Notification"
                            src="https://sinhvien.hufi.edu.vn/Content/ThemeMXH/img/icons/news.png"
                        />
                        <Link underline="none" href="#!" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                            Danh sách dự kiến sinh viên không có lịch thi cuối kỳ đợt 1 – học kỳ 1 năm học 2023-2024
                        </Link>
                    </Box>
                </CardContent>
            </Card>
            <SampleTabsPage />
        </>
    );
}

export default SamplePage;
