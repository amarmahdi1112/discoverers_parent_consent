import React, { useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  onSave: (signature: string) => void;
  value?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, value }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (value && sigCanvas.current) {
      sigCanvas.current.fromDataURL(value);
    }
  }, [value]);

  const clear = () => {
    sigCanvas.current?.clear();
    onSave("");
  };

  const save = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();
      onSave(dataURL);
    }
  };

  return (
    <div className="space-y-2">
      <div className="border-2 border-gray-300 rounded-lg bg-white">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: "w-full h-40",
          }}
          onEnd={save}
        />
      </div>
      <button
        type="button"
        onClick={clear}
        className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
      >
        Clear Signature
      </button>
    </div>
  );
};
