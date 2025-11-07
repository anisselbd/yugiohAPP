import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Container, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";

import carteService from "../services/carteService";
import CardCartes from "../components/CardCartes";

const HomePage = () => {
  const navigate = useNavigate();
  const [cartes, setCartes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Récupère toutes les cartes depuis l'API et gère les états de chargement/erreur
  const fetchAllCartes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await carteService.getAllCarte();
      const data = response.data?.result ?? response.data ?? [];
      setCartes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching cartes:", err);
      setError("Impossible de charger les cartes. Merci de réessayer plus tard.");
      toast.error("Erreur lors du chargement des cartes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charge initialement la liste au montage du composant
  useEffect(() => {
    fetchAllCartes();
  }, [fetchAllCartes]);

  // Retire la carte supprimée de l'état local sans recharger toute la page
  const handleCarteDeleted = (idCarte) => {
    setCartes((prev) => prev.filter((carte) => carte.idCarte !== idCarte));
  };

  // Filtre client-side par nom/description (simple et réactif)
  const filteredCartes = useMemo(() => {
    if (!searchTerm) {
      return cartes;
    }

    const lowerSearch = searchTerm.toLowerCase();
    return cartes.filter((carte) => {
      const nom = (carte.carteNom ?? carte.nomCarte ?? carte.nom ?? "").toLowerCase();
      const description = (carte.description ?? "").toLowerCase();
      return nom.includes(lowerSearch) || description.includes(lowerSearch);
    });
  }, [cartes, searchTerm]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2} mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Collection de cartes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consultez, filtrez et gérez vos cartes Yu-Gi-Oh! en toute simplicité.
          </Typography>
        </Box>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} width={{ xs: "100%", sm: "auto" }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/new-card")}>Ajouter une carte</Button>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchAllCartes} disabled={isLoading}>
            Rafraîchir
          </Button>
        </Stack>
      </Stack>

      <TextField
        fullWidth
        placeholder="Rechercher une carte par nom ou description"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : filteredCartes.length === 0 ? (
        <Alert severity="info">
          {cartes.length === 0
            ? "Aucune carte n'est encore enregistrée. Ajoutez-en une pour commencer !"
            : "Aucune carte ne correspond à votre recherche."}
        </Alert>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: {
              xs: "repeat(1, minmax(0, 1fr))",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
          }}
        >
          {filteredCartes.map((carte) => (
            <Box key={carte.idCarte} sx={{ display: "flex" }}>
              <CardCartes carte={carte} onDelete={handleCarteDeleted} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default HomePage;