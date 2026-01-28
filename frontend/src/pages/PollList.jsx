import { useEffect, useState } from "react";
import { getAllPolls, deletePoll } from "../services/api";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import BarChartIcon from "@mui/icons-material/BarChart";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";

const PollList = () => {
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllPolls();
      setPolls(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load polls. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleDelete = async (pollId) => {
    if (!window.confirm("Are you sure you want to delete this poll?")) return;

    try {
      await deletePoll(pollId);
      setSnackbar({ open: true, message: "Poll deleted successfully!", severity: "success" });
      fetchPolls();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to delete poll", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <CircularProgress size={60} sx={{ color: "white" }} />
      </Box>
    );
  }

  return (
    <>
      <Box
        minHeight="100vh"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: 4,
              p: 4,
              mb: 4,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 1,
                  }}
                >
                  Mini Polling App
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create polls and gather opinions from your audience
                </Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate("/create")}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(99, 102, 241, 0.5)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Create New Poll
              </Button>
            </Box>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Polls Grid */}
          {polls.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                },
                gap: 3,
              }}
            >
              {polls.map((poll) => (
                <Card
                  key={poll.id}
                  sx={{
                    borderRadius: 4,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s ease",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={2}
                    >
                      <Chip
                        label={poll.isActive ? "Active" : "Closed"}
                        color={poll.isActive ? "success" : "default"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      <Tooltip title="Delete Poll">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(poll.id)}
                          sx={{
                            "&:hover": {
                              background: "rgba(239, 68, 68, 0.1)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Typography
                      variant="h5"
                      mb={3}
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        lineHeight: 1.4,
                        minHeight: "64px",
                      }}
                    >
                      {poll.question}
                    </Typography>

                    <Box display="flex" gap={1.5} flexWrap="wrap">
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<HowToVoteIcon />}
                        onClick={() => navigate(`/pollDetails/${poll.id}`)}
                        fullWidth
                        sx={{
                          flex: 1,
                          py: 1.2,
                          fontWeight: 600,
                        }}
                      >
                        Vote Now
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<BarChartIcon />}
                        onClick={() => navigate(`/poll/${poll.id}/results`)}
                        fullWidth
                        sx={{
                          flex: 1,
                          py: 1.2,
                          fontWeight: 600,
                        }}
                      >
                        Results
                      </Button>
                    </Box>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 2, textAlign: "center" }}
                    >
                      Created on {new Date(poll.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: 4,
                p: 6,
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <HowToVoteIcon sx={{ fontSize: 80, color: "primary.light", mb: 2 }} />
              <Typography variant="h5" fontWeight="600" mb={1}>
                No polls available yet
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                Get started by creating your first poll!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate("/create")}
              >
                Create Your First Poll
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PollList;
