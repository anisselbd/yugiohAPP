import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Divider,
  Card,
  CardMedia,
} from "@mui/material";
import TitleIcon from "@mui/icons-material/Title";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import ImageIcon from "@mui/icons-material/Image";
import BoltIcon from "@mui/icons-material/Bolt";
import ShieldIcon from "@mui/icons-material/Shield";
import GradeIcon from "@mui/icons-material/Grade";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import { toast } from "react-toastify";

import carteService from "@/services/carteService";
import TypeService from "@/services/typeService";
import AttributService from "@/services/attributService";
import RareteService from "@/services/rareteService";
import EditionService from "@/services/editionService";

const emptyFormValues = {
  nom: "",
  description: "",
  idType: "",
  attaque: "",
  defense: "",
  imageUrl: "",
  idAttribut: "",
  niveau: "",
  idRarete: "",
  codeEdition: "",
};

const UpdateCard = () => {
  const navigate = useNavigate();
  const { idCarte } = useParams();
  const [formValues, setFormValues] = useState(emptyFormValues);
  const [listeTypes, setListeTypes] = useState([]);
  const [listeAttributs, setListeAttributs] = useState([]);
  const [listeRaretes, setListeRaretes] = useState([]);
  const [listeEditions, setListeEditions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charge en parallèle les listes de référence + la carte à éditer
  const loadInitialData = useCallback(async () => {
    if (!idCarte) {
      setLoadError("Identifiant de carte manquant");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError(null);
      const [typesResponse, attributsResponse, raretesResponse, editionsResponse, carteResponse] = await Promise.all([
        TypeService.getAllTypes(),
        AttributService.getAllAttributs(),
        RareteService.getAllRaretes(),
        EditionService.getAllEditions(),
        carteService.getCarteById(idCarte),
      ]);

      setListeTypes(typesResponse.data?.result ?? typesResponse.data ?? []);
      setListeAttributs(attributsResponse.data ?? []);
      setListeRaretes(raretesResponse.data ?? []);
      setListeEditions(editionsResponse.data ?? []);

      const carte = carteResponse.data?.result ?? carteResponse.data?.carte ?? carteResponse.data;
      if (!carte) {
        throw new Error("Carte introuvable");
      }

      setFormValues({
        nom: carte.carteNom ?? carte.nomCarte ?? carte.nom ?? "",
        description: carte.description ?? "",
        idType: String(carte.idType ?? carte.type?.idType ?? ""),
        attaque: carte.attaque != null ? String(carte.attaque) : "",
        defense: carte.defense != null ? String(carte.defense) : "",
        imageUrl: carte.imageUrl ?? "",
        idAttribut: String(carte.idAttribut ?? carte.attribut?.idAttribut ?? ""),
        niveau: carte.niveau != null ? String(carte.niveau) : "",
        idRarete: String(carte.idRarete ?? carte.rarete?.idRarete ?? ""),
        codeEdition: carte.codeEdition ?? carte.edition?.codeEdition ?? "",
      });
    } catch (error) {
      console.error("Erreur lors du chargement de la carte :", error);
      setLoadError("Impossible de charger la carte demandée.");
      toast.error("Erreur lors du chargement de la carte");
    } finally {
      setIsLoading(false);
    }
  }, [idCarte]);

  useEffect(() => {
    // Déclenche le chargement initial lorsque l'id change
    loadInitialData();
  }, [loadInitialData]);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  // Valide et envoie les changements au backend pour mise à jour
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!idCarte) {
      toast.error("Carte introuvable");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        nomCarte: formValues.nom.trim(),
        description: formValues.description.trim(),
        idType: Number(formValues.idType),
        attaque: Number(formValues.attaque) || 0,
        defense: Number(formValues.defense) || 0,
        imageUrl: formValues.imageUrl.trim(),
        idAttribut: Number(formValues.idAttribut),
        niveau: Number(formValues.niveau) || 0,
        idRarete: Number(formValues.idRarete),
        codeEdition: formValues.codeEdition,
      };

      await carteService.UpdateCarte(idCarte, payload);
      toast.success("Carte mise à jour avec succès !");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la carte :", error);
      toast.error("La mise à jour a échoué");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h5" component="h1" gutterBottom>
              Modifier la carte
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ajustez les informations de la carte sélectionnée.
            </Typography>
          </Box>
          <Button onClick={() => navigate(-1)} color="inherit" disabled={isSubmitting}>
            Annuler
          </Button>
        </Stack>

        {loadError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loadError}
          </Alert>
        )}

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 1 }}>Informations principales</Typography>
              <Divider sx={{ mb: 2 }} />
              <TextField
                required
                label="Nom de la carte"
                fullWidth
                value={formValues.nom}
                onChange={handleChange("nom")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                label="Description"
                fullWidth
                multiline
                minRows={3}
                value={formValues.description}
                onChange={handleChange("description")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DescriptionIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="type-select-label">Type</InputLabel>
                <Select
                  labelId="type-select-label"
                  label="Type"
                  value={formValues.idType}
                  onChange={handleChange("idType")}
                >
                  {listeTypes.map((type) => (
                    <MenuItem key={type.idType} value={type.idType}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CategoryIcon fontSize="small" />
                        <span>{type.libelleType ?? type.nom ?? type.label}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="URL de l'image"
                placeholder="https://..."
                fullWidth
                value={formValues.imageUrl}
                onChange={handleChange("imageUrl")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="attribut-select-label">Attribut</InputLabel>
                <Select
                  labelId="attribut-select-label"
                  label="Attribut"
                  value={formValues.idAttribut}
                  onChange={handleChange("idAttribut")}
                >
                  {listeAttributs.map((attribut) => (
                    <MenuItem key={attribut.idAttribut} value={attribut.idAttribut}>
                      {attribut.libelleAttribut ?? attribut.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="rarete-select-label">Rareté</InputLabel>
                <Select
                  labelId="rarete-select-label"
                  label="Rareté"
                  value={formValues.idRarete}
                  onChange={handleChange("idRarete")}
                >
                  {listeRaretes.map((rarete) => (
                    <MenuItem key={rarete.idRarete} value={rarete.idRarete}>
                      {rarete.libelleRarete ?? rarete.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Attaque"
                type="number"
                fullWidth
                value={formValues.attaque}
                onChange={handleChange("attaque")}
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BoltIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Défense"
                type="number"
                fullWidth
                value={formValues.defense}
                onChange={handleChange("defense")}
                inputProps={{ min: 0 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShieldIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Niveau"
                type="number"
                fullWidth
                value={formValues.niveau}
                onChange={handleChange("niveau")}
                inputProps={{ min: 0, max: 12 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <GradeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="edition-select-label">Édition</InputLabel>
                <Select
                  labelId="edition-select-label"
                  label="Édition"
                  value={formValues.codeEdition}
                  onChange={handleChange("codeEdition")}
                >
                  {listeEditions.map((edition) => (
                    <MenuItem key={edition.codeEdition} value={edition.codeEdition}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CollectionsBookmarkIcon fontSize="small" />
                        <span>{edition.nomEdition ?? edition.nom}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>Aperçu</Typography>
              <Divider sx={{ mb: 2 }} />
              <Card sx={{ bgcolor: "black", borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  image={formValues.imageUrl || "https://via.placeholder.com/600x360?text=Preview"}
                  alt="Aperçu carte"
                  sx={{ height: 280, objectFit: "contain" }}
                />
              </Card>
            </Grid>
          </Grid>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" spacing={2} mt={4}>
          <Button color="inherit" onClick={() => navigate(-1)} disabled={isSubmitting}>
            Retour
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting || isLoading}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default UpdateCard;