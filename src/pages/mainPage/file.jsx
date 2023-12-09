import axiosInstance from '@/config/axiosConfig';
import { CardContent, Card, CardHeader, Chip, Button } from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, viVN } from '@mui/x-data-grid';
import moment from 'moment';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function File({ title }) {
    const [files, setFiles] = useState([]);
    const [users, setUsers] = useState([]);
    const [isDeleting, setStateDeleting] = useState(false);

    const navigate = useNavigate();

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const getFiles = async () => {
        await axiosInstance
            .get('File/get-files')
            .then((value) => {
                setTimeout(() => {
                    setFiles(value.data.data);
                    console.log(value.data.data);
                    // alert(value.data.message, 'success');
                }, 600);
            })
            .catch((reason) => {
                if (reason.response.status !== 401) {
                    alert(reason.response.data.message, 'error');
                    console.log(reason);
                }
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
                if (reason.response.status !== 401) {
                    alert(reason.response.data.message, 'error');
                    console.log(reason);
                }
            });
    };

    const getName = (value) => {
        const user = users.find((item) => item.userID === value);
        return user ? user.fullname : 'N/A';
    };

    const columns = [
        {
            field: 'fileName',
            headerName: 'Tài liệu',
            width: 130,
        },
        {
            field: 'preview',
            headerName: 'Xem trước',
            width: 130,
            renderCell: (params) => (
                <a
                    href={`http://localhost:5290/${params.row.filePath}`}
                    rel="noreferrer"
                    target="_blank"
                    download={params.row.fileName}
                >
                    Nhấn để xem
                </a>
            ),
        },
        {
            field: 'filePath',
            headerName: 'Đường dẫn thư mục',
            width: 130,
        },
        {
            field: 'documentType',
            headerName: 'Loại tài liệu',
            width: 130,
        },
        {
            field: 'fileSize',
            headerName: 'Kích thước',
            headerAlign: 'center',
            align: 'center',
            width: 130,
        },
        {
            field: 'createdBy',
            headerName: 'Người tạo',
            width: 130,
            valueFormatter: (params) => getName(params.value),
        },
        {
            field: 'updatedDateTime',
            headerName: 'Lần cập nhật cuối',
            headerAlign: 'center',
            align: 'center',
            width: 130,
            valueFormatter: (params) => (params.value ? moment(params?.value).format('DD/MM/YYYY') : 'N/A'),
        },
        {
            field: 'action',
            headerName: 'Chức năng',
            width: 90,
            renderCell: (params) => (
                <>
                    <Button style={{ minWidth: 32 }}>
                        <ModeEditIcon fontSize="small" />
                    </Button>
                    <Button style={{ minWidth: 32 }}>
                        <DeleteIcon fontSize="small" />
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        getFiles();
        getUsers();
    }, []);

    return (
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
                    <Button variant="contained" sx={{ marginLeft: 2 }} onClick={() => navigate('upload-new-file')}>
                        <AddIcon /> Tài liệu mới
                    </Button>
                }
            />

            <CardContent>
                <div style={{ height: 600, width: '100%', backgroundColor: 'white' }}>
                    <DataGrid
                        getRowId={(row) => row.fileID}
                        rows={files}
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
    );
}
