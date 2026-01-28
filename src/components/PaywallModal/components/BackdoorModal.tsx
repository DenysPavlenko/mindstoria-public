import { useRevenueCat } from "@/providers";
import { useState } from "react";
import { Button } from "../../Button/Button";
import { Input } from "../../Input/Input";
import { Label } from "../../Label/Label";
import { Modal } from "../../Modal/Modal";
import { Typography } from "../../Typography/Typography";

interface BackdoorModalProps {
  onClose: () => void;
}

export const BackdoorModal = ({ onClose }: BackdoorModalProps) => {
  const { submitBackdoorCode } = useRevenueCat();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isValidCode = code.trim() !== "";

  const handleSubmit = () => {
    const success = submitBackdoorCode(code);
    if (success) {
      onClose();
      setError(null);
    } else {
      setError("Invalid backdoor code");
    }
  };

  return (
    <Modal visible onClose={onClose}>
      <Label label="Reviewer Access" />
      <Typography variant="small" style={{ marginBottom: 12, opacity: 0.7 }}>
        Enter the reviewer backdoor code to access premium features
      </Typography>
      <Input
        placeholder="Enter code..."
        autoFocus
        value={code}
        onChangeText={(text) => {
          setCode(text);
          if (error) setError(null); // Clear error when user types
        }}
        autoCapitalize="characters"
        autoCorrect={false}
        secureTextEntry={false}
      />
      {error && (
        <Typography variant="small" color="error" style={{ marginTop: 8 }}>
          {error}
        </Typography>
      )}
      <Button
        disabled={!isValidCode}
        onPress={handleSubmit}
        style={{ marginTop: 16 }}
      >
        Submit
      </Button>
    </Modal>
  );
};
