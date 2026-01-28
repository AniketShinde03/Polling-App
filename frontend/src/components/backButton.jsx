import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
      Back
    </Button>
  );
};

export default BackButton;
