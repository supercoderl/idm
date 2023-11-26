import PageHeader from '@/components/pageHeader';
import {
    Link,
    Typography,
    Breadcrumbs,
    Card,
    CardContent,
    Grid,
    Button,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useEffect, useState } from 'react';
import axiosInstance from '@/config/axiosConfig';
import { enqueueSnackbar } from 'notistack';
import { Textarea } from '@mui/joy';
import moment from 'moment';
import { LoadingButton } from '@mui/lab';

export default function CreateProposal() {
    const [proposal, setProposal] = useState({
        title: '',
        userID: '',
        content: '',
        fileID: null,
        status: 0,
    });
    const [file, setFile] = useState({
        FileName: '',
        FilePath: '',
        FileType: '',
        FileSize: 0,
    });
    const [data, setData] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const comeback = () => {
        window.history.back();
    };

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const getUsers = async () => {
        await axiosInstance
            .get('User/users')
            .then((value) => {
                setUsers(value.data.data);
            })
            .catch((reason) => {
                console.log(reason);
            });
    };

    const onChange = (event) => {
        setFile({
            FileName: event.target.files[0].name.split('.').shift(),
            FileType: '',
            FileSize: event.target.files[0].size,
        });
        setData(event.target.files[0]);
    };

    const uploadFile = async () => {
        if (data) {
            const formData = new FormData();
            formData.append('file', data);

            const response = await axiosInstance.post('File/create-file', formData, {
                params: file,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.data;
        }
        return null;
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const fileUploaded = await uploadFile();
        if (fileUploaded) proposal.fileID = fileUploaded.fileID;

        await axiosInstance
            .post('Proposal/create-proposal', proposal)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message);
                    setLoading(false);
                }, 600);
            })
            .catch((reason) => {
                console.log(reason.response.data.message);
                setLoading(false);
            });
    };

    const columns = [
        {
            field: 'title',
            headerName: 'Danh sách công việc',
            width: 200,
        },
    ];

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <>
            <PageHeader title="Tạo đề xuất">
                <Breadcrumbs
                    aria-label="breadcrumb"
                    sx={{
                        textTransform: 'uppercase',
                    }}
                >
                    <Link underline="hover" href="#!">
                        IDM
                    </Link>
                    <Typography color="text.tertiary">Tạo đề xuất</Typography>
                </Breadcrumbs>
            </PageHeader>
            <Card type="section">
                <CardContent
                    sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 400, overflowY: 'auto' }}
                    className="card-profile"
                >
                    <Box sx={{ marginLeft: 'auto', mb: 4 }}>
                        <Button variant="contained" onClick={comeback}>
                            <KeyboardBackspaceIcon fontSize="small" /> &nbsp; Trở về
                        </Button>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={4} md={4}>
                            <DataGrid
                                getRowId={(row) => row.taskID}
                                rows={[]}
                                columns={columns}
                                hideFooterPagination
                                hideFooter
                            />
                        </Grid>
                        <Grid item xs={12} sm={8} md={8}>
                            <Box
                                component="form"
                                onSubmit={submit}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                }}
                            >
                                <Grid
                                    container
                                    sx={{ mb: 2 }}
                                    direction="row"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    spacing={{ xs: 2, md: 3 }}
                                    columns={{ xs: 4, sm: 8, md: 12 }}
                                >
                                    <Grid item xs={2} sm={4} md={6}>
                                        <TextField
                                            label="Tên đề xuất"
                                            required
                                            variant="outlined"
                                            color="secondary"
                                            type="text"
                                            size="small"
                                            id="title"
                                            name="title"
                                            autoComplete="title"
                                            value={proposal.title}
                                            onChange={(e) =>
                                                setProposal((item) => ({ ...item, ...{ title: e.target.value } }))
                                            }
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={2} sm={4} md={6}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel id="task">Người nhận đề xuất</InputLabel>
                                            <Select
                                                labelId="user"
                                                id="user"
                                                value={proposal.userID}
                                                label="Người nhận đề xuất"
                                                onChange={(e) =>
                                                    setProposal((item) => ({
                                                        ...item,
                                                        ...{ userID: e.target.value },
                                                    }))
                                                }
                                            >
                                                {users && users.length > 0
                                                    ? users.map((item, index) => (
                                                          <MenuItem key={index} value={item.userID}>
                                                              {item.fullname}
                                                          </MenuItem>
                                                      ))
                                                    : null}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2} sm={4} md={12}>
                                        <TextField
                                            label="Nội dung"
                                            required
                                            color="secondary"
                                            value={proposal.content}
                                            onChange={(e) => {
                                                setProposal((item) => ({ ...item, ...{ content: e.target.value } }));
                                            }}
                                            fullWidth
                                            multiline
                                            rows={3}
                                            maxRows={5}
                                        />
                                    </Grid>

                                    <Grid item xs={2} sm={4} md={12} display="flex" alignItems="center">
                                        <Button variant="outlined" component="label" color="error">
                                            Tải tài liệu
                                            <input type="file" hidden onChange={onChange} />
                                        </Button>
                                        <Typography fontWeight="bold" marginLeft={1}>
                                            {file.FileName && file.FileName !== ''
                                                ? file.FileName
                                                : 'Chưa có tài liệu nào'}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <LoadingButton loading={loading} variant="outlined" type="submit" sx={{ mt: 'auto' }}>
                                    Xác nhận
                                </LoadingButton>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            asd
        </>
    );
}
