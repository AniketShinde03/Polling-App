import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { getPollDetails, voteDetails } from "../services/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PollDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchPoll = async () => {
    setLoading(true);
    try {
      const res = await getPollDetails(id);
      setPoll(res.data.poll);
      setOptions(res.data.options);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to load poll details", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const handleVote = async () => {
    if (!selectedOption) {
      setSnackbar({ open: true, message: "Please select an option", severity: "warning" });
      return;
    }

    setSubmitting(true);
    try {
      await voteDetails(id, selectedOption);
      setHasVoted(true);
      setSnackbar({ open: true, message: "Vote submitted successfully!", severity: "success" });
      fetchPoll();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to submit vote", severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewResults = () => {
    navigate(`/poll/${id}/results`);
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
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 5,
        }}
      >
        <Container maxWidth="md">
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{
              mb: 3,
              color: "white",
              fontWeight: 600,
              "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Back to Polls
          </Button>

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: 3,
                      p: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <HowToVoteIcon sx={{ color: "white", fontSize: 32 }} />
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    Cast Your Vote
                  </Typography>
                </Box>
                {poll?.isActive && (
                  <Chip label="Active" color="success" sx={{ fontWeight: 600 }} />
                )}
              </Box>

              {/* Question */}
              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  border: "2px solid rgba(102, 126, 234, 0.2)",
                }}
              >
                <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ lineHeight: 1.5 }}>
                  {poll?.question}
                </Typography>
              </Box>

              {/* Voting Options */}
              <FormControl component="fieldset" fullWidth disabled={hasVoted}>
                <RadioGroup value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {options.map((option, index) => (
                      <Box
                        key={option.id}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: "2px solid",
                          borderColor: selectedOption === option.id.toString() ? "primary.main" : "rgba(0, 0, 0, 0.1)",
                          background: selectedOption === option.id.toString()
                            ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
                            : "white",
                          transition: "all 0.3s ease",
                          cursor: hasVoted ? "not-allowed" : "pointer",
                          "&:hover": {
                            borderColor: hasVoted ? "rgba(0, 0, 0, 0.1)" : "primary.light",
                            transform: hasVoted ? "none" : "translateX(8px)",
                            boxShadow: hasVoted ? "none" : "0 4px 12px rgba(99, 102, 241, 0.2)",
                          },
                        }}
                        onClick={() => !hasVoted && setSelectedOption(option.id.toString())}
                      >
                        <FormControlLabel
                          value={option.id.toString()}
                          control={
                            <Radio
                              sx={{
                                color: "primary.main",
                                "&.Mui-checked": {
                                  color: "primary.main",
                                },
                              }}
                            />
                          }
                          label={
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Typography variant="body1" fontWeight={500} fontSize="1.1rem">
                                {option.text}
                              </Typography>
                              {selectedOption === option.id.toString() && !hasVoted && (
                                <CheckCircleIcon color="primary" fontSize="small" />
                              )}
                            </Box>
                          }
                          sx={{ width: "100%", m: 0 }}
                        />
                      </Box>
                    ))}
                  </Box>
                </RadioGroup>
              </FormControl>

              {/* Vote Status Message */}
              {hasVoted && (
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon />}
                  sx={{ mt: 3, borderRadius: 2 }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    Thank you for voting! Your response has been recorded.
                  </Typography>
                </Alert>
              )}

              {/* Action Buttons */}
              <Box mt={4} display="flex" flexDirection="column" gap={2}>
                {!hasVoted ? (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <HowToVoteIcon />}
                    disabled={!selectedOption || submitting}
                    onClick={handleVote}
                    sx={{
                      py: 1.8,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                      "&:hover": {
                        transform: submitting ? "none" : "translateY(-2px)",
                        boxShadow: submitting ? "0 4px 14px rgba(99, 102, 241, 0.4)" : "0 6px 20px rgba(99, 102, 241, 0.5)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Vote"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    size="large"
                    startIcon={<BarChartIcon />}
                    onClick={handleViewResults}
                    sx={{
                      py: 1.8,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      boxShadow: "0 4px 14px rgba(236, 72, 153, 0.4)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(236, 72, 153, 0.5)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    View Results
                  </Button>
                )}
              </Box>

              {!hasVoted && (
                <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
                  Select an option above to submit your vote
                </Typography>
              )}
            </CardContent>
          </Card>
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

export default PollDetail;
