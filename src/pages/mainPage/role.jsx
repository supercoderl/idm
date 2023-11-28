import {
    CardContent,
    Card,
    CardHeader,
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Checkbox,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axiosInstance from '@/config/axiosConfig';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function Role({ title }) {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [userRoles, setUserRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
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

    const getRoles = async () => {
        await axiosInstance
            .get('Role/get-roles')
            .then((value) => {
                setTimeout(() => {
                    setRoles(value.data.data);
                    // alert(value.data.message, 'success');
                }, 600);
            })
            .catch((reason) => {
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    const getRolesMapUser = async () => {
        await axiosInstance
            .get('Role/get-roles-map-user')
            .then((value) => {
                setTimeout(() => {
                    setUserRoles(value.data.data);
                    // alert(value.data.message, 'success');
                }, 600);
            })
            .catch((reason) => {
                alert(reason.response.data.message, 'error');
                console.log(reason);
            });
    };

    // const updateUser = async (event) => {
    //     event.preventDefault();
    //     setLoading(true);

    //     user.firstname = user.fullname.substring(user.fullname.indexOf(' ') + 1);
    //     user.lastname = user.fullname.substring(0, user.fullname.indexOf(' '));

    //     await axiosInstance
    //         .put(`User/update-user/${user?.userID}`, user)
    //         .then((value) => {
    //             setTimeout(() => {
    //                 alert(value.data.message);
    //                 setLoading(false);
    //                 getUsers();
    //             }, 600);
    //         })
    //         .catch((reason) => {
    //             console.log(reason);
    //             setLoading(false);
    //         });
    // };

    const checkedRole = (roleID, userID) => {
        if (userRoles) {
            return userRoles.find((x) => x.roleID === roleID && x.userID === userID) != null;
        }
        return false;
    };

    const mapRoleWithUser = async (roleID, userID) => {
        setLoading(true);
        if (userRoles.find((x) => x.roleID === roleID && x.userID === userID)) {
            const userRole = userRoles.find((x) => x.roleID === roleID && x.userID === userID);
            await axiosInstance
                .delete(`role/delete-mapping/${userRole.userRoleID}`)
                .then((value) => {
                    setTimeout(() => {
                        if (value.data.success) alert(value.data.message, 'success');
                        else alert(value.data.message, 'error');
                        getRolesMapUser();
                        setLoading(false);
                    }, 600);
                })
                .catch((reason) => {
                    alert(reason.response.data.message, 'error');
                    setLoading(false);
                    console.log(reason);
                });
        } else {
            const body = {
                RoleID: roleID,
                UserID: userID,
            };

            await axiosInstance
                .post('role/create-mapping', body)
                .then((value) => {
                    setTimeout(() => {
                        if (value.data.success) alert(value.data.message, 'success');
                        else alert(value.data.message, 'error');
                        setLoading(false);
                        getRolesMapUser();
                    }, 600);
                })
                .catch((reason) => {
                    alert(reason.response.data.message, 'error');
                    setLoading(false);
                    console.log(reason);
                });
        }
    };

    useEffect(() => {
        getRoles();
        getUsers();
        getRolesMapUser();
    }, []);

    return (
        <Card
            sx={{
                minHeight: '100vh',
            }}
            type="section"
        >
            <CardHeader title={`${title}`} />

            <CardContent>
                <TableContainer>
                    <TableHead>
                        <TableRow>
                            <TableCell width="300">Người dùng</TableCell>
                            {roles && roles.length > 0
                                ? roles.map((item, index) => (
                                      <TableCell key={index} width="200" align="center">
                                          {item.roleName}
                                      </TableCell>
                                  ))
                                : null}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users && users.length > 0
                            ? users.map((user, index) => (
                                  <TableRow key={index}>
                                      <TableCell>{user.fullname}</TableCell>
                                      {roles && roles.length > 0
                                          ? roles.map((role, index) => (
                                                <TableCell key={index} align="center">
                                                    <Checkbox
                                                        checked={checkedRole(role.roleID, user.userID)}
                                                        onChange={() => mapRoleWithUser(role.roleID, user.userID)}
                                                    />
                                                </TableCell>
                                            ))
                                          : null}
                                  </TableRow>
                              ))
                            : null}
                    </TableBody>
                </TableContainer>
            </CardContent>
        </Card>
    );
}
