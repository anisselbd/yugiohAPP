import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import carteService from "../services/carteService";
import ConfirmDialog from "./ConfirmDialog";

const CardCartes = ({ carte, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  // Contrôle de l'affichage du dialogue de confirmation de suppression
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Supprime la carte côté API puis notifie et remonte l'information au parent
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await carteService.DeleteCarte(carte.idCarte);
      toast.success("Carte supprimée", {
        pauseOnHover: false,
        transition: Bounce,
      });
      onDelete?.(carte.idCarte);
    } catch (error) {
      console.error("Error deleting carte:", error);
      toast.error("Impossible de supprimer la carte");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  // Redirige vers la page d'édition de la carte sélectionnée
  const handleUpdate = () => {
    navigate(`/update-card/${carte.idCarte}`);
  };

  const attaque = carte.attaque ?? carte.attack;
  const defense = carte.defense ?? carte.def;
  const niveau = carte.niveau ?? carte.level;
  const rarete = carte.libelleRarete ?? carte.rarete ?? carte.rareteLibelle;
  const type = carte.libelleType ?? carte.type ?? carte.typeLibelle;
  const attribut = carte.libelleAttribut ?? carte.attribut ?? carte.attributLibelle;

  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardMedia
        component="img"
        image={carte.imageUrl || "https://via.placeholder.com/300x420?text=Yu-Gi-Oh"}
        alt={carte.carteNom ?? carte.nomCarte ?? "Carte Yu-Gi-Oh"}
        sx={{ height: 220, objectFit: "contain", bgcolor: "black" }}
      />
      <CardContent sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Typography gutterBottom variant="h6" component="div" textAlign="center" noWrap>
          {carte.carteNom ?? carte.nomCarte ?? carte.nom ?? "Carte sans nom"}
        </Typography>
        {carte.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
          >
            {carte.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {type && <Chip label={type} color="primary" size="small" />}
          {attribut && <Chip label={attribut} size="small" />}
          {rarete && <Chip label={rarete} size="small" variant="outlined" />}
          {typeof niveau === "number" && !Number.isNaN(niveau) && <Chip label={`Niveau ${niveau}`} size="small" />}
        </Stack>

        {(attaque ?? defense) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-around" textAlign="center">
              {attaque != null && !Number.isNaN(attaque) && <Typography variant="subtitle2">ATK {attaque}</Typography>}
              {defense != null && !Number.isNaN(defense) && <Typography variant="subtitle2">DEF {defense}</Typography>}
            </Stack>
          </>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => setConfirmOpen(true)} disabled={isDeleting}>
          Supprimer
        </Button>
        <Button size="small" variant="contained" startIcon={<ModeEditIcon />} onClick={handleUpdate}>
          Modifier
        </Button>
      </CardActions>
      <ConfirmDialog
        open={confirmOpen}
        title="Confirmer la suppression"
        description={`Êtes-vous sûr de vouloir supprimer "${carte.carteNom ?? carte.nomCarte ?? "cette carte"}" ? Cette action est définitive.`}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </Card>
  );
};

export default CardCartes;