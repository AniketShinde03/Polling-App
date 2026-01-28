import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  IconButton,
  Box,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CreateIcon from "@mui/icons-material/Create";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createPoll } from "../services/api";
import { useNavigate } from "react-router-dom";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      setSnackbar({ open: true, message: "At least 2 options are required", severity: "warning" });
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      setSnackbar({ open: true, message: "Please enter a poll question", severity: "error" });
      return;
    }

    if (options.some((opt) => !opt.trim())) {
      setSnackbar({ open: true, message: "Please fill in all options", severity: "error" });
      return;
    }

    if (options.length < 2) {
      setSnackbar({ open: true, message: "At least 2 options are required", severity: "error" });
      return;
    }

    setLoading(true);
    try {
      await createPoll({ question, options });
      setSnackbar({ open: true, message: "Poll created successfully!", severity: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to create poll. Please try again.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
              <Box display="flex" alignItems="center" gap={2} mb={4}>
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
                  <CreateIcon sx={{ color: "white", fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    Create New Poll
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ask a question and add multiple choice options
                  </Typography>
                </Box>
              </Box>

              {/* Question Input */}
              <Box mb={4}>
                <Typography variant="subtitle1" fontWeight={600} mb={1.5} color="text.primary">
                  Poll Question *
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="e.g., Which programming language do you prefer?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      fontSize: "1.1rem",
                    },
                  }}
                />
              </Box>

              {/* Options Section */}
              <Box mb={3}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    Answer Options *
                  </Typography>
                  <Chip
                    label={`${options.length} options`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                {options.map((option, index) => (
                  <Box
                    key={index}
                    display="flex"
                    alignItems="center"
                    mb={2}
                    gap={1.5}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: "rgba(99, 102, 241, 0.03)",
                      border: "1px solid rgba(99, 102, 241, 0.1)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "rgba(99, 102, 241, 0.05)",
                        border: "1px solid rgba(99, 102, 241, 0.2)",
                      },
                    }}
                  >
                    <Chip
                      label={index + 1}
                      size="small"
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        fontWeight: 600,
                        minWidth: 32,
                      }}
                    />
                    <TextField
                      fullWidth
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      variant="standard"
                      sx={{
                        "& .MuiInput-root": {
                          fontSize: "1rem",
                        },
                      }}
                    />
                    <IconButton
                      onClick={() => removeOption(index)}
                      color="error"
                      disabled={options.length <= 2}
                      sx={{
                        opacity: options.length <= 2 ? 0.3 : 1,
                        "&:hover": {
                          background: options.length > 2 ? "rgba(239, 68, 68, 0.1)" : "transparent",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addOption}
                  fullWidth
                  sx={{
                    mt: 1,
                    py: 1.5,
                    borderStyle: "dashed",
                    borderWidth: 2,
                    fontWeight: 600,
                    "&:hover": {
                      borderStyle: "dashed",
                      borderWidth: 2,
                      background: "rgba(99, 102, 241, 0.05)",
                    },
                  }}
                >
                  Add Another Option
                </Button>
              </Box>

              {/* Info Box */}
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Tip:</strong> Keep your question clear and concise. Add at least 2 options, but you can add as many as you need.
                </Typography>
              </Alert>

              {/* Submit Button */}
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CreateIcon />}
                sx={{
                  py: 1.8,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                  "&:hover": {
                    transform: loading ? "none" : "translateY(-2px)",
                    boxShadow: loading ? "0 4px 14px rgba(99, 102, 241, 0.4)" : "0 6px 20px rgba(99, 102, 241, 0.5)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? "Creating Poll..." : "Create Poll"}
              </Button>
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

export default CreatePoll;
