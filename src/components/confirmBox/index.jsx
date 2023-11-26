import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';

function ConfirmBox(props) {
    const { open, handleClose, title, content, submit } = props;

    return (
        <Dialog open={open} onClose={handleClose} keepMounted aria-describedby="alert-dialog-slide-description">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy bỏ</Button>
                <Button onClick={submit}>Xác nhận</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmBox;
