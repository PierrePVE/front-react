import React from 'react';
import '@style/ButtonCompo.css'; // Import du fichier CSS pour styliser le bouton

interface ButtonCompoProps {
  onClick: () => void;
  children: React.ReactNode;
}

const ButtonCompo: React.FC<ButtonCompoProps> = ({ onClick, children }) => {
  return (
    <button className="button-comp btn-with-glow-effect" onClick={onClick}>
      {children}
    </button>
  );
};

export default ButtonCompo;
