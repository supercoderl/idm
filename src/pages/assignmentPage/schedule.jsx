import axiosInstance from '@/config/axiosConfig';
import {
    Eventcalendar,
    Datepicker,
    snackbar,
    setOptions,
    Popup,
    Button,
    Input,
    Textarea,
    formatDate,
    Select,
} from '@mobiscroll/react';
import { Card, CardContent, CardHeader } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import moment from 'moment';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

setOptions({
    theme: 'ios',
    themeVariant: 'light',
});

const viewSettings = {
    timeline: {
        type: 'week',
        eventList: true,
        startDay: 1,
        endDay: 5,
    },
};

const responsivePopup = {
    medium: {
        display: 'center',
        width: 400,
        fullScreen: false,
        touchUi: false,
        showOverlay: false,
    },
};

export default function AssignmentSchedule() {
    const [assignments, setAssignments] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [assignment, setAssignment] = useState({
        assignmentID: 0,
        employee: '',
        taskID: 0,
        startTime: moment(new Date()).format('HH:mm:ss'),
        endTime: moment(new Date()).format('HH:mm:ss'),
        deadline: new Date(),
        status: 1,
    });
    const [start, startRef] = useState(null);
    const [end, endRef] = useState(null);
    const [min, setMinTime] = useState('');
    const [max, setMaxTime] = useState('');
    const [isOpen, setOpen] = useState(false);
    const [isEdit, setEdit] = useState(false);
    const [headerText, setHeader] = useState('');
    const [shiftDate, setDate] = useState([]);
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    const alert = (message, status) => {
        enqueueSnackbar(message, status);
    };

    const transformAssignment = (values, taskList) =>
        values.map((item) => ({
            id: item.assignmentID,
            employee: item.employee,
            taskID: item.taskID,
            status: item.status,
            start: moment(`${moment(item.deadline).format('YYYY-MM-DD')} ${item.startTime}`).format('YYYY-MM-DDTHH:mm'),
            end: moment(`${moment(item.deadline).format('YYYY-MM-DD')} ${item.endTime}`).format('YYYY-MM-DDTHH:mm'),
            title: taskList && taskList.length > 0 ? taskList.find((x) => x.taskID === item.taskID).title : '',
            resource: item.employee,
        }));

    const getTasks = async () => {
        const response = await axiosInstance.get('Task/get-tasks');
        return response.data.data;
    };

    const getAssignments = async () => {
        const taskList = await getTasks();
        setTasks(taskList);
        await axiosInstance
            .get('Assignment/get-assignments')
            .then((value) => {
                setAssignments(transformAssignment(value.data.data, taskList));
            })
            .catch((reason) => {
                if (reason.response.status !== 401) console.log(reason.response.data.message);
            });
    };

    const saveEvent = async () => {
        if (isEdit) {
            await axiosInstance
                .put(`Assignment/update-assignment/${assignment.assignmentID}`, assignment)
                .then((value) => {
                    setTimeout(() => {
                        alert(value.data.message, 'success');
                        getAssignments();
                    }, 600);
                })
                .catch((reason) => {
                    if (reason.response.status !== 401) console.log(reason.response.data.message);
                });
        } else {
            // add the new event to the list
            await axiosInstance
                .post('Assignment/create-assignment', assignment)
                .then((value) => {
                    setTimeout(() => {
                        alert(value.data.message, 'success');
                        getAssignments();
                    }, 600);
                })
                .catch((reason) => {
                    if (reason.response.status !== 401) console.log(reason.response.data.message);
                });
        }
        // close the popup
        setOpen(false);
    };

    const deleteEvent = async (id) => {
        await axiosInstance
            .delete(`Assignment/delete-assignment/${id}`)
            .then((value) => {
                setTimeout(() => {
                    alert(value.data.message);
                    getAssignments();
                }, 600);
            })
            .catch((reason) => {
                if (reason.response.status !== 401) console.log(reason.response.data.message);
            });
    };

    const loadPopupForm = useCallback((event) => {
        setDate([event.start, event.end]);
    }, []);

    const onDeleteClick = useCallback(() => {
        deleteEvent(assignment.assignmentID);
        setOpen(false);
    }, [deleteEvent]);

    // scheduler options
    const onEventClick = (args) => {
        const { event } = args;
        const resource = users && users.length > 0 ? users.find((r) => r.id === event.resource) : null;
        setHeader(
            `<div>Chỉnh sửa ca làm việc của ${resource.name}</div>
                <div class="employee-shifts-day">
                ${formatDate('DDDD', new Date(event.start))},
                ${formatDate('DD MMMM YYYY', new Date(event.start))} 
                </div>`,
        );
        setEdit(true);
        setAssignment({
            assignmentID: event.id,
            employee: event.resource,
            taskID: event.taskID,
            startTime: moment(event.start).format('HH:mm:ss'),
            endTime: moment(event.end).format('HH:mm:ss'),
            deadline: moment(event.end).format('YYYY-MM-DD'),
            status: event.status,
        });
        // fill popup form with event data
        loadPopupForm(event);
        setOpen(true);
    };

    const onEventCreated = (args) => {
        const { event } = args;
        setHeader(
            `<div>Ca làm việc mới</div>
                <div class="employee-shifts-day">
                ${formatDate('DDDD', new Date(event.start))},
                ${formatDate('DD MMMM YYYY', new Date(event.start))}
                </div>`,
        );
        setEdit(false);
        setAssignment((item) => ({
            ...item,
            ...{
                assignmentID: 0,
                employee: event.resource,
                startTime: moment(event.start).format('HH:mm:ss'),
                endTime: moment(event.end).format('HH:mm:ss'),
                deadline: moment(event.end).format('YYYY-MM-DD'),
            },
        }));
        // fill popup form with event data
        loadPopupForm(event);
        // open the popup
        setOpen(true);
    };

    const onEventDeleted = useCallback(
        (args) => {
            console.log(args);
            // deleteEvent(args.event);
        },
        [deleteEvent],
    );

    // popup options
    const popupButtons = useMemo(() => {
        if (isEdit) {
            return [
                'cancel',
                {
                    handler: () => {
                        saveEvent();
                    },
                    keyCode: 'enter',
                    text: 'Save',
                    cssClass: 'mbsc-popup-button-primary',
                },
            ];
        }
        return [
            'cancel',
            {
                handler: () => {
                    saveEvent();
                },
                keyCode: 'enter',
                text: 'Add',
                cssClass: 'mbsc-popup-button-primary',
            },
        ];
    }, [isEdit, saveEvent]);

    const onClose = useCallback(() => {
        if (!isEdit) {
            // refresh the list, if add popup was canceled, to remove the temporary event
            setAssignments([...assignments]);
        }
        setOpen(false);
    }, [isEdit, assignments]);

    const extendDefaultEvent = useCallback((args) => {
        const d = args.start;
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), args === 1 ? 7 : 12);
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), args === 1 ? 13 : 18);

        return {
            title: `${formatDate('HH:mm', start)} - ${formatDate('HH:mm', end)}`,
            start,
            end,
            resource: args.resource,
        };
    }, []);

    const renderMyResource = (resource) => (
        <div className="employee-shifts-cont">
            <div className="employee-shifts-name">{resource.name}</div>
            <div className="employee-shifts-title">{resource.title}</div>
            <img className="employee-shifts-avatar" src={resource.img} alt="Avatar" />
        </div>
    );

    const dateChange = useCallback((args) => {
        setDate(args.value);
    }, []);

    function getRandomColor() {
        // Tạo giá trị ngẫu nhiên cho các thành phần màu RGB
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);

        // Trả về màu ngẫu nhiên và màu văn bản là đen
        return `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue
            .toString(16)
            .padStart(2, '0')}`;
    }

    const transformUsers = (values) =>
        values.map((item) => ({
            id: item.userID,
            name: item.fullname,
            color: getRandomColor(),
            title: 'Test',
            img: 'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg',
        }));

    const getUsers = async () => {
        await axiosInstance
            .get('User/users')
            .then((value) => {
                setUsers(transformUsers(value.data.data));
            })
            .catch((reason) => {
                console.log(reason.response.data.message);
            });
    };

    const handleChange = (fieldName, newValue) => {
        const updatedObject = { ...assignment };
        updatedObject[fieldName] = newValue;
        setAssignment(updatedObject);
    };

    useEffect(() => {
        getUsers();
        getAssignments();
    }, []);

    return (
        <Card
            sx={{
                minHeight: '100vh',
            }}
            type="section"
        >
            <CardHeader
                title="Lịch phân công công việc"
                subheader={`Tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`}
                action={
                    <Button color="primary" variant="outline" onClick={() => navigate('/home')}>
                        <KeyboardBackspaceIcon />
                    </Button>
                }
            />

            <CardContent>
                <div>
                    <Eventcalendar
                        view={viewSettings}
                        data={assignments}
                        resources={users}
                        dragToCreate={false}
                        dragToResize={false}
                        dragToMove
                        clickToCreate
                        extendDefaultEvent={extendDefaultEvent}
                        onEventClick={onEventClick}
                        onEventCreated={onEventCreated}
                        onEventDeleted={onEventDeleted}
                        renderResource={renderMyResource}
                        cssClass="md-employee-shifts"
                    />
                    <Popup
                        display="bottom"
                        fullScreen
                        contentPadding={false}
                        headerText={headerText}
                        buttons={popupButtons}
                        isOpen={isOpen}
                        onClose={onClose}
                        responsive={responsivePopup}
                        cssClass="employee-shifts-popup"
                    >
                        <div className="mbsc-form-group">
                            <Select
                                data={tasks.map((item) => ({
                                    text: item.title,
                                    value: item.taskID,
                                }))}
                                value={assignment.taskID}
                                onChange={(e) => handleChange('taskID', e.value)}
                                label="Công việc"
                            />
                            <Input ref={startRef} dropdown label="Thời gian bắt đầu" />
                            <Input ref={endRef} dropdown label="Thời gian kết thúc" />
                            <Datepicker
                                select="range"
                                controls={['time']}
                                startInput={start}
                                endInput={end}
                                display="anchored"
                                showRangeLabels={false}
                                touchUi={false}
                                onChange={dateChange}
                                value={shiftDate}
                                stepMinute={60}
                                timeWheels="|h:mm A|"
                                minTime={min}
                                maxTime={max}
                            />
                        </div>
                        <div className="mbsc-form-group">
                            <Textarea label="Notes" />
                        </div>
                        {isEdit && (
                            <div className="mbsc-button-group">
                                <Button
                                    className="mbsc-button-block"
                                    color="danger"
                                    variant="outline"
                                    onClick={onDeleteClick}
                                >
                                    Delete shift
                                </Button>
                            </div>
                        )}
                    </Popup>
                </div>
            </CardContent>
        </Card>
    );
}
