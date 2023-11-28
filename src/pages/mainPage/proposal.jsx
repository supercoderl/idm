import axiosInstance from '@/config/axiosConfig';
import {
    CardContent,
    Card,
    CardHeader,
    Chip,
    Button,
    Link,
    Grid,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Input,
    Typography,
} from '@mui/material';
import Modal from '@/components/modal';
import { LoadingButton } from '@mui/lab';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, viVN } from '@mui/x-data-grid';
import moment from 'moment';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmBox from '@/components/confirmBox';

export default function Proposal({ title }) {
    const [proposal, setProposal] = useState({
        proposalsID: 0,
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
    const [proposals, setProposals] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpened, setStateModal] = useState(false);
    const [isDeleting, setStateDeleting] = useState(false);

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const navigate = useNavigate();

    const getProposals = async () => {
        await axiosInstance
            .get('Proposal/get-proposals')
            .then((value) => {
                setTimeout(() => {
                    setProposals(value.data.data);
                    // alert(value.data.message, 'success');
                }, 600);
            })
            .catch((reason) => {
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    const getUsers = async () => {
        await axiosInstance
            .get('User/users')
            .then((value) => {
                setTimeout(() => {
                    setUsers(value.data.data);
                    // alert(value.data.message, 'success');
                }, 600);
            })
            .catch((reason) => {
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    const approve = async (item) => {
        const i = { ...item };
        await axiosInstance
            .put(`Proposal/approve-proposal/${i.proposalsID}`, i)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message, 'success');
                }, 600);
            })
            .catch((reason) => {
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    const accept = (item) => {
        const i = { ...{ proposalsID: item.proposalsID, approvalStatus: 1 } };
        approve(i);
    };

    const reject = (item) => {
        const i = { ...item };
        i.approvalStatus = -1;
        approve(i);
    };

    const openModal = (item) => {
        setStateModal(true);
        setProposal(item);
    };

    const closeModal = () => {
        setStateModal(false);
    };

    const startDelete = (proposal) => {
        setStateDeleting(true);
        setProposal(proposal);
    };

    const cancleDelete = () => {
        setStateDeleting(false);
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

    const updateProposal = async (event) => {
        event.preventDefault();
        setLoading(true);

        const fileUploaded = await uploadFile();
        if (fileUploaded) proposal.fileID = fileUploaded.fileID;

        await axiosInstance
            .put(`Proposal/update-proposal/${proposal.proposalsID}`, proposal)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message, 'success');
                    setLoading(false);
                    closeModal();
                    getProposals();
                }, 600);
            })
            .catch((reason) => {
                setLoading(false);
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    const deleteProposal = async () => {
        console.log(proposal);
        setLoading(true);
        await axiosInstance
            .delete(`Proposal/delete-proposal/${proposal.proposalsID}`)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message);
                    setLoading(false);
                    getProposals();
                });
            })
            .catch((reason) => {
                console.log(reason.response.data.message);
                setLoading(false);
            });
        cancleDelete();
    };

    const getName = (value) => {
        const user = users.find((item) => item.userID === value);
        return user ? user.fullname : 'N/A';
    };

    const columns = [
        {
            field: 'approve',
            headerName: 'Duyệt đề xuất',
            width: 130,
            renderCell: (params) => (
                <>
                    <Link href="#!" underline="none" onClick={() => accept(params.row)}>
                        Duyệt
                    </Link>{' '}
                    &nbsp;|&nbsp;{' '}
                    <Link href="#!" underline="none">
                        Từ chối
                    </Link>
                </>
            ),
        },
        {
            field: 'title',
            headerName: 'Tên đề xuất',
            width: 130,
        },
        {
            field: 'userID',
            headerName: 'Người nhận đề xuất',
            width: 150,
            valueFormatter: (params) => getName(params.value),
        },
        {
            field: 'content',
            headerName: 'Nội dung',
            width: 200,
        },
        {
            field: 'fileID',
            headerName: 'Tài liệu',
            with: 80,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            headerAlign: 'center',
            align: 'center',
            width: 130,
            renderCell: (params) => (
                <Chip
                    label={params.row?.status === 1 ? 'Đã duyệt' : 'Đang chờ duyệt'}
                    color={params.row?.status === 1 ? 'warning' : 'primary'}
                />
            ),
        },
        {
            field: 'createdDateTime',
            headerName: 'Ngày đề xuất',
            headerAlign: 'center',
            align: 'center',
            width: 150,
            valueFormatter: (params) =>
                params.value ? moment(params?.value || new Date()).format('DD/MM/YYYY') : 'N/A',
        },
        {
            field: 'updatedBy',
            headerName: 'Người kiểm duyệt',
            width: 130,
            valueFormatter: (params) => getName(params.value),
        },
        {
            field: 'updatedDateTime',
            headerName: 'Ngày duyệt',
            headerAlign: 'center',
            align: 'center',
            width: 130,
            valueFormatter: (params) => (params.value ? moment(params.value).format('DD/MM/YYYY') : 'N/A'),
        },
        {
            field: 'action',
            headerName: 'Chức năng',
            width: 90,
            renderCell: (params) => (
                <>
                    <Button style={{ minWidth: 32 }} onClick={() => openModal(params.row)}>
                        <ModeEditIcon fontSize="small" />
                    </Button>
                    <Button style={{ minWidth: 32 }} onClick={() => startDelete(params.row)}>
                        <DeleteIcon fontSize="small" />
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        getProposals();
        getUsers();
    }, []);

    return (
        <>
            <Card
                sx={{
                    minHeight: '100vh',
                }}
                type="section"
            >
                <CardHeader
                    title={`${title}`}
                    subheader={`Tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`}
                    action={
                        <Button variant="contained" sx={{ marginLeft: 2 }} onClick={() => navigate('create-proposal')}>
                            <AddIcon /> Đề xuất mới
                        </Button>
                    }
                />

                <CardContent>
                    <div style={{ height: 600, width: '100%', backgroundColor: 'white' }}>
                        <DataGrid
                            getRowId={(row) => row.proposalsID}
                            rows={proposals}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            checkboxSelection
                            localeText={viVN.components.MuiDataGrid.defaultProps.localeText}
                        />
                    </div>
                </CardContent>
            </Card>
            <Modal openModal={isModalOpened} fnCloseModal={closeModal} maxWidth="xs" title="Chỉnh sửa đề xuất" padding>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={8} md={12}>
                        <Box
                            component="form"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                            }}
                            onSubmit={updateProposal}
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
                                        label="Tiêu đề"
                                        required
                                        variant="outlined"
                                        color="secondary"
                                        type="text"
                                        size="small"
                                        value={proposal.title}
                                        onChange={(e) =>
                                            setProposal((item) => ({
                                                ...item,
                                                ...{ title: e.target.value },
                                            }))
                                        }
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={2} sm={4} md={6}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="user">Người nhận</InputLabel>
                                        <Select
                                            labelId="user"
                                            id="user"
                                            value={proposal.userID}
                                            label="Người nhận"
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
                                        variant="outlined"
                                        color="secondary"
                                        type="text"
                                        size="small"
                                        value={proposal.content}
                                        onChange={(e) =>
                                            setProposal((item) => ({ ...item, ...{ content: e.target.value } }))
                                        }
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
                                        {file.FileName && file.FileName !== '' ? file.FileName : 'Chưa có tài liệu nào'}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <LoadingButton loading={loading} variant="outlined" type="submit" sx={{ mt: 'auto' }}>
                                Xác nhận
                            </LoadingButton>
                        </Box>
                    </Grid>
                </Grid>
            </Modal>

            <ConfirmBox
                open={isDeleting}
                handleClose={cancleDelete}
                title="Xóa đề xuất"
                content={`Bạn có chắc muốn xóa đề xuất ${proposal.title} ?`}
                submit={deleteProposal}
            />
        </>
    );
}
