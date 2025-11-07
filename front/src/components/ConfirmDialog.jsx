import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const ConfirmDialog = ({ open, title, description, confirmLabel = "Confirmer", cancelLabel = "Annuler", onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={() => onClose?.()} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <WarningAmberIcon color="warning" />
          <Typography variant="h6">{title}</Typography>
        </Stack>
      </DialogTitle>
      {description && (
        <DialogContent>
          <Typography variant="body2" color="text.secondary">{description}</Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={() => onClose?.()} color="inherit">
          {cancelLabel}
        </Button>
        <Button onClick={() => onConfirm?.()} color="error" variant="contained" autoFocus>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;


