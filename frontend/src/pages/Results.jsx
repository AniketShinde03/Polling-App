import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  LinearProgress,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { getPollResults } from "../services/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BarChartIcon from "@mui/icons-material/BarChart";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleIcon from "@mui/icons-material/People";

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPollResults(id);
      setPoll(res.data.poll);
      setOptions(res.data.options);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to load poll results", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResults();
  }, [id, fetchResults]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);
  const winningOption = options.reduce((max, opt) => (opt.votes > max.votes ? opt : max), options[0] || { votes: 0 });

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

          {/* Main Results Card */}
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Header */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={4} flexWrap="wrap" gap={2}>
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
                    <BarChartIcon sx={{ color: "white", fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="text.primary">
                      Poll Results
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Live voting results and statistics
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={<PeopleIcon />}
                  label={`${totalVotes} ${totalVotes === 1 ? "Vote" : "Votes"}`}
                  color="primary"
                  sx={{ fontWeight: 600, fontSize: "1rem", py: 2.5, px: 1 }}
                />
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

              {/* Results Visualization */}
              <Box sx={{ pt: 2 }}>
                {options.length > 0 ? (
                  options
                    .sort((a, b) => b.votes - a.votes)
                    .map((option, index) => {
                      const percentage = totalVotes === 0 ? 0 : Math.round((option.votes / totalVotes) * 100);
                      const isWinner = totalVotes > 0 && option.id === winningOption.id;

                      return (
                        <Box
                          key={option.id}
                          sx={{
                            mb: 3,
                            pt: 4,
                            pb: 3,
                            px: 3,
                            borderRadius: 3,
                            background: isWinner
                              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)"
                              : "rgba(0, 0, 0, 0.02)",
                            border: "2px solid",
                            borderColor: isWinner ? "success.main" : "rgba(0, 0, 0, 0.05)",
                            position: "relative",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateX(4px)",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            },
                          }}
                        >
                          {/* Position Badge */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              left: 16,
                              background: isWinner ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                              borderRadius: 2,
                              px: 1.5,
                              py: 0.5,
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            {isWinner && totalVotes > 0 && <EmojiEventsIcon sx={{ fontSize: 14 }} />}
                            #{index + 1}
                          </Box>

                          {/* Option Header */}
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2}>
                            <Typography variant="h6" fontWeight={600} color="text.primary">
                              {option.text}
                            </Typography>
                            <Chip
                              label={`${percentage}%`}
                              color={isWinner ? "success" : "default"}
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.9rem",
                                minWidth: 60,
                              }}
                            />
                          </Box>

                          {/* Progress Bar */}
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{
                              height: 12,
                              borderRadius: 6,
                              backgroundColor: "rgba(0, 0, 0, 0.05)",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 6,
                                background: isWinner
                                  ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
                                  : "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                              },
                            }}
                          />

                          {/* Vote Count */}
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1.5, fontWeight: 500, fontSize: "0.9rem" }}
                          >
                            {option.votes} {option.votes === 1 ? "vote" : "votes"}
                          </Typography>
                        </Box>
                      );
                    })
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary">
                      No votes have been cast yet
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Summary Stats */}
              {totalVotes > 0 && (
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                    border: "1px solid rgba(102, 126, 234, 0.1)",
                  }}
                >
                  <Box display="flex" justifyContent="space-around" flexWrap="wrap" gap={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        {totalVotes}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Total Votes
                      </Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="bold" color="secondary.main">
                        {options.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Options
                      </Typography>
                    </Box>
                    {totalVotes > 0 && (
                      <Box textAlign="center">
                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          sx={{
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {winningOption.text}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                          Leading Option
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              {/* Vote Again Button */}
              <Box mt={4}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={() => navigate(`/pollDetails/${id}`)}
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Vote Again
                </Button>
              </Box>
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

export default Results;
