import PageHeader from '@/components/pageHeader';
import axiosInstance from '@/config/axiosConfig';
import { Box, TextField, Breadcrumbs, Link, Typography, Card, CardContent, Button } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UploadNewFile() {
    const [file, setFile] = useState({
        FileName: '',
        FilePath: '',
        FileType: '',
        FileSize: 0,
    });

    const [data, setData] = useState(null);

    const navigate = useNavigate();

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const onChange = (event) => {
        setFile({
            FileName: event.target.files[0].name.split('.').shift(),
            FileType: '',
            FileSize: event.target.files[0].size,
        });
        setData(event.target.files[0]);
    };

    const submit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', data);

        await axiosInstance
            .post('File/create-file', formData, { params: file, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message, 'success');
                    navigate('/home');
                }, 600);
            })
            .catch((reason) => {
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    return (
        <>
            <PageHeader title="Thêm tài liệu mới">
                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{
                        textTransform: 'uppercase',
                    }}
                >
                    <Link underline="hover" href="#!">
                        IDM
                    </Link>
                    <Typography color="text.tertiary">Thêm tài liệu mới</Typography>
                </Breadcrumbs>
            </PageHeader>
            <Card type="section">
                <CardContent
                    sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 400, overflowY: 'auto' }}
                    className="card-profile"
                >
                    <Box>
                        <div className="container">
                            <div className="center-box">
                                <div className="upload-box noselect">
                                    <div className="upload-file">
                                        <input type="file" name="file" id="file" onChange={onChange} />
                                        <img
                                            src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDI5NC4xNTYgMjk0LjE1NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjk0LjE1NiAyOTQuMTU2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCI+CjxnPgoJPHBhdGggZD0iTTIyNy4wMDIsMTA4LjI1NmMtMi43NTUtNDEuNzUxLTM3LjYtNzQuODc4LTgwLjAzNi03NC44NzhjLTQyLjQ0NywwLTc3LjI5OCwzMy4xNDEtODAuMDM4LDc0LjkwNyAgIEMyOC45NzgsMTEzLjA1OSwwLDE0NS4zOSwwLDE4NC4xODRjMCw0Mi4yMzQsMzQuMzYsNzYuNTk1LDc2LjU5NSw3Ni41OTVoMTE2LjQ4M2MzLjMxMywwLDYtMi42ODcsNi02cy0yLjY4Ny02LTYtNkg3Ni41OTUgICBDNDAuOTc3LDI0OC43NzgsMTIsMjE5LjgwMSwxMiwxODQuMTg0YzAtMzQuMjc1LDI2LjgzMy02Mi41NjgsNjEuMDg3LTY0LjQxMWMzLjE4NC0wLjE3MSw1LjY3OC0yLjgwMyw1LjY3OC01Ljk5MSAgIGMwLTAuMTE5LTAuMDAzLTAuMjM2LTAuMDEtMC4zNTVjMC4wOS0zNy41MzYsMzAuNjU0LTY4LjA0OSw2OC4yMTEtNjguMDQ5YzM3LjU2MywwLDY4LjEzMiwzMC41MTgsNjguMjExLDY4LjA2MyAgIGMtMC4wMDUsMC4xMTYtMC4wMDksMC4yMzgtMC4wMDksMC4zMjljMCwzLjE5NiwyLjUwNSw1LjgzMSw1LjY5Niw1Ljk5MmMzNC4zNywxLjc0MSw2MS4yOTIsMzAuMDM4LDYxLjI5Miw2NC40MjEgICBjMCwxOS41MjYtOC42OTgsMzcuODAxLTIzLjg2NCw1MC4xMzhjLTIuNTcxLDIuMDkxLTIuOTU5LDUuODctMC44NjgsOC40NGMyLjA5MSwyLjU3MSw1Ljg3LDIuOTU5LDguNDQsMC44NjggICBjMTcuOTgtMTQuNjI2LDI4LjI5Mi0zNi4yOTMsMjguMjkyLTU5LjQ0N0MyOTQuMTU2LDE0NS4yNjksMjY1LjA4LDExMi45MjYsMjI3LjAwMiwxMDguMjU2eiIgZmlsbD0iIzQxNTE2YiIvPgoJPHBhdGggZD0iTTE0MC45NjYsMTQxLjA3OHY3Ni41MTFjMCwzLjMxMywyLjY4Nyw2LDYsNnM2LTIuNjg3LDYtNnYtNzYuNTExYzAtMy4zMTMtMi42ODctNi02LTZTMTQwLjk2NiwxMzcuNzY1LDE0MC45NjYsMTQxLjA3OHoiIGZpbGw9IiM0MTUxNmIiLz4KCTxwYXRoIGQ9Ik0xODEuMjgzLDE1Mi4yMDRjMS41MzYsMCwzLjA3MS0wLjU4Niw0LjI0My0xLjc1N2MyLjM0My0yLjM0MywyLjM0My02LjE0MiwwLTguNDg1bC0zNC4zMTctMzQuMzE3ICAgYy0yLjM0My0yLjM0My02LjE0My0yLjM0My04LjQ4NSwwbC0zNC4zMTcsMzQuMzE3Yy0yLjM0MywyLjM0My0yLjM0Myw2LjE0MiwwLDguNDg1YzIuMzQzLDIuMzQzLDYuMTQzLDIuMzQzLDguNDg1LDAgICBsMzAuMDc0LTMwLjA3NGwzMC4wNzQsMzAuMDc0QzE3OC4yMTIsMTUxLjYxOCwxNzkuNzQ4LDE1Mi4yMDQsMTgxLjI4MywxNTIuMjA0eiIgZmlsbD0iIzQxNTE2YiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo="
                                            alt=""
                                        />
                                        <h6>{file.FileName && file.FileName !== '' ? file.FileName : 'Upload File'}</h6>
                                    </div>
                                    <Box
                                        component="form"
                                        onSubmit={submit}
                                        sx={{
                                            width: '100%',
                                            padding: 4,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <TextField
                                            label="Tên tài liệu"
                                            required
                                            sx={{ marginBottom: 2 }}
                                            variant="outlined"
                                            color="secondary"
                                            type="text"
                                            size="small"
                                            id="fileName"
                                            name="fileName"
                                            autoComplete="fileName"
                                            value={file.FileName || ''}
                                            onChange={(e) =>
                                                setFile((file) => ({ ...file, ...{ FileName: e.target.value } }))
                                            }
                                            fullWidth
                                        />

                                        <TextField
                                            label="Loại tài liệu"
                                            required
                                            sx={{ marginBottom: 2 }}
                                            variant="outlined"
                                            color="secondary"
                                            type="text"
                                            size="small"
                                            id="fileType"
                                            name="fileType"
                                            autoComplete="fileType"
                                            value={file.FileType}
                                            onChange={(e) =>
                                                setFile((file) => ({ ...file, ...{ FileType: e.target.value } }))
                                            }
                                            fullWidth
                                        />

                                        <TextField
                                            label="Kích thước"
                                            required
                                            sx={{ marginBottom: 2 }}
                                            variant="outlined"
                                            color="secondary"
                                            type="text"
                                            size="small"
                                            id="fileSize"
                                            name="fileSize"
                                            autoComplete="fileSize"
                                            value={file.FileSize || ''}
                                            disabled
                                            fullWidth
                                        />

                                        <Button variant="outlined" type="submit" sx={{ marginLeft: 2, float: 'right' }}>
                                            Hoàn tất
                                        </Button>
                                    </Box>
                                </div>
                                <div className="shadow" />
                            </div>
                        </div>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
}
